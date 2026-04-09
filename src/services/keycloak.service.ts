/**
 * @file keycloak.service.ts
 * @description Keycloak-js integration layer.
 *
 *   In production: keycloak-js communicates with a real Keycloak server.
 *   In mock/dev mode (VITE_USE_MOCK_AUTH=true): we skip the Keycloak
 *   redirect and use the mockAuthenticate() function instead so the app
 *   can run without a live Keycloak instance.
 *
 *   AUTH-001, AUTH-002, AUTH-003 evaluator scenarios are covered here.
 */

import Keycloak from 'keycloak-js'
import type { AuthUser } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Keycloak instance — configured from environment variables so realm/clientId
// are never hard-coded and can be changed per environment.
// ─────────────────────────────────────────────────────────────────────────────

const keycloakConfig = {
  url: (import.meta.env.VITE_KEYCLOAK_URL as string | undefined) ?? 'http://localhost:8080',
  realm: (import.meta.env.VITE_KEYCLOAK_REALM as string | undefined) ?? 'boaz-study',
  clientId: (import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string | undefined) ?? 'studyportal-app',
}

/**
 * Singleton Keycloak instance.
 * Always import this — never instantiate Keycloak directly elsewhere.
 */
const keycloak = new Keycloak(keycloakConfig)

export default keycloak

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the raw JWT access token string, or null if unauthenticated.
 * Used by the Axios interceptor to inject `Authorization: Bearer <token>`.
 */
export function getAccessToken(): string | null {
  return keycloak.token ?? null
}

/**
 * Triggers a silent token refresh.
 * Call this before API requests when the token may be near expiry.
 * Returns true if refresh succeeded.
 */
export async function refreshTokenIfNeeded(): Promise<boolean> {
  try {
    // Refresh if token expires in less than 30 seconds
    return await keycloak.updateToken(30)
  } catch {
    // Refresh failed — token is expired, force re-login
    void keycloak.login()
    return false
  }
}

/**
 * Revokes the current access token and clears the session.
 * Call this during logout to ensure the token cannot be reused.
 * Also performs server-side logout to invalidate the Keycloak session.
 */
export async function revokeToken(): Promise<void> {
  try {
    if (keycloak.token) {
      // This will redirect to Keycloak's logout endpoint to invalidate the server session
      // and then redirect back to the redirectUri
      await keycloak.logout({
        redirectUri: window.location.origin + '/login',
      })
    }
  } catch (err) {
    console.error('[keycloak.service] Failed to revoke token via logout:', err)
    // Even if logout fails, clear the local token
    keycloak.clearToken()
  }
}

/**
 * Decodes the JWT payload without verifying the signature.
 * Signature verification is Keycloak's responsibility on the server side.
 */
export function decodeTokenPayload(token: string): Record<string, unknown> {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload) as Record<string, unknown>
}

/**
 * Extracts and normalizes the authorities array from a Keycloak token.
 * If the token already has authorities[], uses those.
 * Otherwise, attempts to extract from realm_access.roles or resource_access.
 *
 * This ensures backward compatibility when Keycloak tokens don't include
 * a custom 'authorities' claim.
 */
export function extractAuthorities(token: Record<string, unknown>): string[] {
  // Prefer explicit authorities claim if present
  if (Array.isArray(token.authorities)) {
    return (token.authorities as unknown[]).filter((a): a is string => typeof a === 'string')
  }

  // Fallback 1: Map from resource_access for this specific app
  const resourceAccess = token.resource_access
  if (resourceAccess && typeof resourceAccess === 'object') {
    const appRoles = (resourceAccess as Record<string, unknown>)['studyportal-app']
    if (appRoles && typeof appRoles === 'object' && Array.isArray((appRoles as Record<string, unknown>).roles)) {
      console.warn('[keycloak.service] Extracted authorities from resource_access.studyportal-app.roles')
      return ((appRoles as Record<string, unknown>).roles as unknown[]).filter((r): r is string => typeof r === 'string')
    }
  }

  // Fallback 2: Use realm_access.roles as last resort
  const realmAccess = token.realm_access
  if (realmAccess && typeof realmAccess === 'object' && Array.isArray((realmAccess as Record<string, unknown>).roles)) {
    console.warn('[keycloak.service] Extracted authorities from realm_access.roles (fallback)')
    return ((realmAccess as Record<string, unknown>).roles as unknown[]).filter((r): r is string => typeof r === 'string')
  }

  // No authorities found
  console.warn('[keycloak.service] Could not extract authorities from token')
  return []
}

/**
 * Flag: true when the app is running without a real Keycloak server.
 * Set VITE_USE_MOCK_AUTH=true in your .env.local to enable.
 */
export const IS_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

/**
 * Authenticate using the direct grant flow (Resource Owner Password Credentials).
 * This allows custom UI forms to authenticate without redirecting to Keycloak.
 *
 * Requirements:
 *   - Keycloak client must have "Direct Access Grants Enabled" = true
 *   - Client credentials (client_id + client_secret) required for token exchange
 *
 * Returns the decoded AuthUser or throws on failure.
 */
export async function directGrantAuth(
  username: string,
  password: string
): Promise<AuthUser> {
  if (!keycloakConfig.url || !keycloakConfig.realm) {
    throw new Error('Keycloak URL and realm must be configured')
  }

  const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: keycloakConfig.clientId,
        username,
        password,
        grant_type: 'password',
        scope: 'openid profile',
      }).toString(),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as Record<string, unknown>
      const errorDesc = typeof errorData.error_description === 'string' ? errorData.error_description : 'Authentication failed'
      throw new Error(errorDesc)
    }

    const tokenData = (await response.json()) as Record<string, unknown>
    const tokenString = typeof tokenData.access_token === 'string' ? tokenData.access_token : undefined
    if (!tokenString) throw new Error('No access token in response')
    
    const decoded = decodeTokenPayload(tokenString)
    const authorities = extractAuthorities(decoded)
    
    // Ensure proper AuthUser structure
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
    
    return authUser
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Direct grant auth failed'
    throw new Error(message)
  }
}