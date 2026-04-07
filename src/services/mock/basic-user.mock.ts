/**
 * @file basic-user.mock.ts
 * @description Mock JWT payload for a basic USER profile.
 *   Has limited permissions — use this profile to verify that
 *   protected UI elements are absent (not errored) for restricted users.
 *   (PERM-002 evaluator scenario — the "USER simple" profile)
 */

import type { AuthUser } from '@contracts/api-contracts'

export const BASIC_USER_MOCK: AuthUser = {
  sub: 'user-uuid-0042',
  preferred_username: 'john.doe',
  email: 'john.doe@boaz-study.com',
  realm_access: {
    roles: ['USER'],
  },
  resource_access: {
    'studyportal-app': {
      roles: ['USER'],
    },
  },
  scope: 'openid profile',
  // ⚠ Protection is based ONLY on this array — never on realm_access.roles
  authorities: [
    'ticket:read',
    'ticket:comment',
    'document:read',
    'notification:read',
  ],
  exp: Math.floor(Date.now() / 1000) + 3600,
}