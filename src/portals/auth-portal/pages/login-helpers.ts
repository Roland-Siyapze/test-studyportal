/**
 * @file login-helpers.ts
 * @description Re-exports used by LoginPage to keep the component file clean.
 *   Centralises the IS_MOCK_AUTH flag and MOCK_PROFILES so the login page
 *   doesn't import directly from services (avoids circular deps).
 */

export { IS_MOCK_AUTH } from '@services/keycloak.service'
export { MOCK_PROFILES } from '@services/mock/auth.mock'