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
} from '@services/keycloak.service'
import { mockAuthenticate } from '@services/mock/auth.mock'
import type { AuthUser } from '@contracts/api-contracts'

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
  /** Clears the session and redirects to the login page. */
  logout: () => void
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
    if (isInitialized) return

    setLoading(true)

    try {
      if (IS_MOCK_AUTH) {
        // In mock mode we don't auto-login — user must fill the login form.
        // Just mark as initialized so the router can render the login page.
        setInitialized(true)
      } else {
        // Attempt silent SSO — if a valid Keycloak session already exists
        // the user is logged in without seeing the login page.
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        })

        if (authenticated && keycloak.token) {
          const decoded = decodeTokenPayload<AuthUser>(keycloak.token)
          setUser(decoded)
        }

        setInitialized(true)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Auth init failed'
      setError(message)
      setInitialized(true)
    } finally {
      setLoading(false)
    }
  }, [isInitialized, setError, setInitialized, setLoading, setUser])

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
          const authUser = await mockAuthenticate(email, password)
          setUser(authUser)
        } else {
          // Redirect to the custom Keycloak login page
          await keycloak.login({
            redirectUri: window.location.origin + '/dashboard',
          })
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Authentication failed'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [setError, setLoading, setUser]
  )

  // ── Logout ──────────────────────────────────────────────────────────────

  const logout = useCallback((): void => {
    clearUser()

    if (!IS_MOCK_AUTH) {
      void keycloak.logout({ redirectUri: window.location.origin + '/login' })
    }
  }, [clearUser])

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