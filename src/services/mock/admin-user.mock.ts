/**
 * @file admin-user.mock.ts
 * @description Mock JWT payload for an ADMIN profile.
 *   Has ALL permissions — use this profile to verify every protected
 *   UI element is visible (PERM-002 evaluator scenario).
 */

import type { AuthUser } from '@contracts/api-contracts'

export const ADMIN_USER_MOCK: AuthUser = {
  sub: 'admin-uuid-0001',
  preferred_username: 'admin.boaz',
  email: 'admin@boaz-study.com',
  realm_access: {
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  resource_access: {
    'studyportal-app': {
      roles: ['ADMIN'],
    },
  },
  scope: 'openid profile',
  // ⚠ Protection is based ONLY on this array — never on realm_access.roles
  authorities: [
    'ticket:create',
    'ticket:read',
    'ticket:update',
    'ticket:comment',
    'document:upload',
    'document:read',
    'document:download',
    'notification:read',
    'admin:access',
    'user:manage',
  ],
  exp: Math.floor(Date.now() / 1000) + 3600,
}