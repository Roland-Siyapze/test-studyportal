/**
 * @file usePermissions.ts
 * @description CRITICAL hook — drives all component-level access control.
 *
 *   Reads `authorities[]` from the global auth store (never from
 *   realm_access.roles) and exposes helper methods consumed by
 *   ProtectedComponent and any component needing conditional rendering.
 *
 *   Satisfies: PERM-001 (hook present, hasPermission based on authorities[])
 *              TEST-001 (unit-tested in usePermissions.test.ts)
 */

import { useAuthStore, selectAuthorities } from '@store/auth.store'
import type { Permission } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UsePermissionsReturn {
  /**
   * Returns true when the current user holds the given permission scope.
   * Protection is based EXCLUSIVELY on authorities[] — never on roles.
   */
  hasPermission: (scope: Permission) => boolean

  /**
   * Returns true when the user holds AT LEAST ONE of the given scopes.
   * Useful for OR-gated UI sections.
   */
  hasAnyPermission: (scopes: Permission[]) => boolean

  /**
   * Returns true when the user holds ALL of the given scopes.
   * Useful for AND-gated UI sections.
   */
  hasAllPermissions: (scopes: Permission[]) => boolean

  /** The raw authorities array — exposed for debugging/display. */
  authorities: string[]
}

export function usePermissions(): UsePermissionsReturn {
  // Read from the Zustand store — this re-renders the component whenever the
  // user profile changes (login / logout / profile switch).
  const authorities = useAuthStore(selectAuthorities)

  const hasPermission = (scope: Permission): boolean =>
    authorities.includes(scope)

  const hasAnyPermission = (scopes: Permission[]): boolean =>
    scopes.some((scope) => authorities.includes(scope))

  const hasAllPermissions = (scopes: Permission[]): boolean =>
    scopes.every((scope) => authorities.includes(scope))

  return { hasPermission, hasAnyPermission, hasAllPermissions, authorities }
}