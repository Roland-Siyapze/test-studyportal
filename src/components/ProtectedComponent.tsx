/**
 * @file ProtectedComponent.tsx
 * @description Wrapper that shows or hides children based on the current
 *   user's authorities[].  When permissions are insufficient the children
 *   are simply absent from the DOM — no error message is rendered.
 *
 *   Satisfies: PERM-002 (components hide/show per permissions)
 *              PERM-003 (ticket:create gate)
 *              TEST-002 (unit-tested in ProtectedComponent.test.tsx)
 *
 * @example
 *   // Single permission gate
 *   <ProtectedComponent requires="ticket:create">
 *     <button>Créer un ticket</button>
 *   </ProtectedComponent>
 *
 *   // OR gate — show if user has at least one of the given permissions
 *   <ProtectedComponent requires={['document:read', 'document:download']} mode="any">
 *     <DocumentList />
 *   </ProtectedComponent>
 */

import type { ReactNode } from 'react'
import type { Permission } from '@contracts/api-contracts'
import { usePermissions } from '@hooks/usePermissions'

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

interface ProtectedComponentProps {
  /** Single scope or array of scopes required to display children. */
  requires: Permission | Permission[]

  /**
   * "all" (default) — user must hold every listed scope.
   * "any"           — user must hold at least one of the listed scopes.
   */
  mode?: 'all' | 'any'

  /** Content shown when the permission check passes. */
  children: ReactNode

  /**
   * Optional fallback rendered when permission check fails.
   * Defaults to null (element is completely absent from the DOM).
   */
  fallback?: ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function ProtectedComponent({
  requires,
  mode = 'all',
  children,
  fallback = null,
}: ProtectedComponentProps): ReactNode {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  // Normalise to array for uniform handling
  const scopes = Array.isArray(requires) ? requires : [requires]

  const isAllowed =
    scopes.length === 1
      ? hasPermission(scopes[0])            // single scope — fast path
      : mode === 'any'
        ? hasAnyPermission(scopes)
        : hasAllPermissions(scopes)

  // ⚠ Spec requirement: hidden elements must be ABSENT, not error-messaged
  return isAllowed ? <>{children}</> : <>{fallback}</>
}