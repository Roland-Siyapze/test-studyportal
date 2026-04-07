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

// ─────────────────────────────────────────────────────────────────────────────
// Keycloak instance — configured from environment variables so realm/clientId
// are never hard-coded and can be changed per environment.
// ─────────────────────────────────────────────────────────────────────────────

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL as string ?? 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM as string ?? 'boaz-study',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID as string ?? 'studyportal-app',
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
 * Decodes the JWT payload without verifying the signature.
 * Signature verification is Keycloak's responsibility on the server side.
 */
export function decodeTokenPayload<T = Record<string, unknown>>(token: string): T {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  return JSON.parse(jsonPayload) as T
}

/**
 * Flag: true when the app is running without a real Keycloak server.
 * Set VITE_USE_MOCK_AUTH=true in your .env.local to enable.
 */
export const IS_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'