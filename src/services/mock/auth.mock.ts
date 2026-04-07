/**
 * @file auth.mock.ts
 * @description Simulates Keycloak authentication in offline/mock mode.
 *   Returns the appropriate AuthUser based on credentials, with a
 *   simulated network delay so the UI loading states are exercised.
 */

import type { AuthUser } from '@contracts/api-contracts'
import { ADMIN_USER_MOCK } from './admin-user.mock'
import { BASIC_USER_MOCK } from './basic-user.mock'

// Mock credential registry — in production this is handled by Keycloak
const MOCK_CREDENTIALS: Record<string, AuthUser> = {
  'admin@boaz-study.com': ADMIN_USER_MOCK,
  'john.doe@boaz-study.com': BASIC_USER_MOCK,
}

/** Simulated network delay (ms) */
const MOCK_DELAY_MS = 800

/**
 * Simulates a Keycloak token exchange.
 * Returns the mock AuthUser or throws on bad credentials.
 */
export async function mockAuthenticate(
  email: string,
  _password: string  // password not validated in mock — any value works
): Promise<AuthUser> {
  await new Promise<void>((resolve) => setTimeout(resolve, MOCK_DELAY_MS))

  const user = MOCK_CREDENTIALS[email.toLowerCase()]
  if (!user) {
    throw new Error('Invalid credentials')
  }

  return user
}

/**
 * Available mock profiles documented for README / evaluator reference.
 */
export const MOCK_PROFILES = [
  {
    label: 'Admin (all permissions)',
    email: 'admin@boaz-study.com',
    password: 'any-value',
    authorities: ADMIN_USER_MOCK.authorities,
  },
  {
    label: 'Basic User (limited permissions)',
    email: 'john.doe@boaz-study.com',
    password: 'any-value',
    authorities: BASIC_USER_MOCK.authorities,
  },
]