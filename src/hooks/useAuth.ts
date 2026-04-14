/**
 * @file useAuth.ts
 * @description Exposes authentication actions and state to components.
 *
 *   In MOCK mode  (VITE_USE_MOCK_AUTH=true):
 *     Uses mockAuthenticate() — no Keycloak server needed.
 *
 *   In PRODUCTION mode:
 *     Initialises keycloak-js, handles redirect flow, stores the decoded
 *     JWT in the Zustand auth store.
 *
 *   Satisfies: AUTH-003 (JWT stored, header injected via api.service.ts)
 *              STATE-001 (authorities available globally)
 */

import { useCallback } from 'react'
import { useAuthStore } from '@store/auth.store'
import keycloak, {
  IS_MOCK_AUTH,
  decodeTokenPayload,
  revokeToken,
  directGrantAuth,
  extractAuthorities,
} from '@services/keycloak.service'
import { mockAuthenticate } from '@services/mock/auth.mock'
import type { AuthUser } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Module-level guard to prevent multiple keycloak.init() calls
// This is necessary because React Strict Mode calls effects twice, and
// keycloak.init() can only be called once per instance.
// ─────────────────────────────────────────────────────────────────────────────

let hasStartedInitialization = false

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isInitialized: boolean
  isAuthenticated: boolean
  error: string | null
  /**
   * Initialise authentication on app startup.
   * Call once from the root component (App.tsx / AuthProvider).
   */
  initAuth: () => Promise<void>
  /**
   * Mock-mode: authenticate with email + password.
   * Production-mode: redirect to Keycloak login page.
   */
  login: (email?: string, password?: string) => Promise<void>
  /** Clears the session, revokes the token, and redirects to login. */
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const {
    user,
    isLoading,
    isInitialized,
    error,
    setUser,
    clearUser,
    setLoading,
    setInitialized,
    setError,
  } = useAuthStore()

  // ── Init ────────────────────────────────────────────────────────────────

  const initAuth = useCallback(async (): Promise<void> => {
    // CRITICAL: Use module-level flag to prevent multiple init attempts
    // React Strict Mode calls effects twice, so we need this guard
    if (hasStartedInitialization) {
      console.warn('[useAuth] Initialization already in progress or completed, skipping...')
      return
    }

    hasStartedInitialization = true
    console.warn('[useAuth] Marking initialization as started')

    setLoading(true)

    try {
      if (IS_MOCK_AUTH) {
        // In mock mode we don't auto-login — user must fill the login form.
        console.warn('[useAuth] Mock auth mode enabled')
        setInitialized(true)
      } else {
        // Initialize keycloak-js for the current page load.
        console.warn('[useAuth] Starting Keycloak init...')
        
        // Determine init strategy based on current location
        // On login page: don't auto-authenticate (force fresh login)
        // On other pages: check for existing session (SSO)
        const isOnLoginPage = window.location.pathname === '/login'
        const onLoadStrategy = isOnLoginPage ? 'login-required' : 'check-sso'
        
        console.warn('[useAuth] Using init strategy:', { onLoadStrategy, isOnLoginPage })
        
        // Create a promise that times out after 10 seconds
        // This prevents hanging if the silent SSO check fails
        const initPromise = keycloak.init({
          onLoad: onLoadStrategy,
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
          redirectUri: window.location.origin + '/',
          checkLoginIframe: false,
        })

        const timeoutPromise = new Promise<boolean>((_, reject) =>
          setTimeout(
            () => { reject(new Error('Keycloak init timeout after 10 seconds')); },
            10000
          )
        )

        let authenticated = false
        try {
          authenticated = await Promise.race([initPromise, timeoutPromise])
          console.warn('[useAuth] Keycloak init completed successfully', { authenticated })
        } catch (timeoutErr) {
          console.warn('[useAuth] Keycloak init timed out, but proceeding anyway', timeoutErr)
          // Don't fail the whole auth flow if init times out
          // Just mark as initialized and let the user try to login
          authenticated = false
        }

        if (authenticated && keycloak.token) {
          console.warn('[useAuth] User authenticated, decoding token...')
          try {
            const decoded = decodeTokenPayload(keycloak.token)
            
            // Debug: log the full token structure
            console.error('[useAuth] Full token payload:', decoded)
            
            // Extract/normalize authorities from various token claim locations
            const authorities = extractAuthorities(decoded)
            
            const authUser: AuthUser = {
              sub: (decoded.sub as string) || '',
              preferred_username: (decoded.preferred_username as string) || '',
              email: (decoded.email as string) || '',
              realm_access: decoded.realm_access as AuthUser['realm_access'],
              resource_access: decoded.resource_access as AuthUser['resource_access'],
              scope: (decoded.scope as string) || '',
              authorities: authorities as AuthUser['authorities'],
              exp: (decoded.exp as number) || 0,
            }
            
            console.warn('[useAuth] Token decoded successfully', {
              sub: authUser.sub,
              email: authUser.email,
              authorities: authorities.length,
            })
            setUser(authUser)
          } catch (decodeErr) {
            console.error('[useAuth] Failed to decode token:', decodeErr)
            console.error('[useAuth] Raw token:', keycloak.token)
          }
        } else {
          console.warn('[useAuth] Not authenticated or no token present after init')
        }

        setInitialized(true)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Auth init failed'
      console.error('[useAuth] Init error:', message)
      // Don't set error state for init failures — allow user to try logging in
      // Only set initialization to true so the page stops loading
      setInitialized(true)
    } finally {
      setLoading(false)
    }
  }, [setInitialized, setLoading, setUser])

  // ── Login ───────────────────────────────────────────────────────────────

  const login = useCallback(
    async (email?: string, password?: string): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        if (IS_MOCK_AUTH) {
          if (!email || !password) {
            throw new Error('Email and password are required')
          }
          const authUser = await mockAuthenticate(email)
          setUser(authUser)
        } else {
          // Production mode: try direct grant flow first (custom UI)
          if (email && password) {
            try {
              const authUser: AuthUser = await directGrantAuth(email, password)
              setUser(authUser)
              return
            } catch (directGrantErr) {
              console.warn(
                '[useAuth] Direct grant failed, falling back to redirect flow:',
                directGrantErr
              )
              // Fall through to redirect flow if direct grant is not configured
            }
          }

          // Fallback: Keycloak redirect flow (hosted login page)
          // The redirectUri was already set in keycloak.init(), so we don't
          // override it here. Keycloak will redirect back to the app root (/)
          // with the callback in the URL fragment. Then keycloak.init() on the
          // next page load will process it.
          await keycloak.login()
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Authentication failed'
        setError(message)
        console.error('[useAuth] Login error:', message)
      } finally {
        setLoading(false)
      }
    },
    [setError, setLoading, setUser]
  )

  // ── Logout ──────────────────────────────────────────────────────────────

  const logout = useCallback(async (): Promise<void> => {
    clearUser()
    setInitialized(false)  // Reset initialized so user can login fresh

    if (!IS_MOCK_AUTH) {
      // Clear any cached auth data
      sessionStorage.clear()
      localStorage.removeItem('keycloak')
      
      // Reset Keycloak instance for fresh login
      hasStartedInitialization = false
      
      try {
        // This will redirect to Keycloak logout endpoint and then redirect back to /login
        // Note: This is async but will redirect the page, so execution won't return
        await revokeToken()
      } catch (err) {
        console.warn('[useAuth] Error during token revocation, redirecting to login:', err)
        // If revocation fails or doesn't redirect, manually go to login
        window.location.href = '/login'
      }
    }
  }, [clearUser, setInitialized])

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: user !== null,
    error,
    initAuth,
    login,
    logout,
  }
}