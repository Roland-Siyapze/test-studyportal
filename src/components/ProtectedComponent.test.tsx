/**
 * @file ProtectedComponent.test.tsx
 * @description Unit tests for the ProtectedComponent wrapper.
 *
 *   Satisfies: TEST-002
 *   Tests:
 *     - Children rendered when permission is granted
 *     - Children absent (not errored) when permission is missing
 *     - mode="any" and mode="all" behaviour
 *     - Custom fallback prop
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { useAuthStore } from '@store/auth.store'
import { ADMIN_USER_MOCK } from '@services/mock/admin-user.mock'
import { BASIC_USER_MOCK } from '@services/mock/basic-user.mock'

function resetStore(): void {
  useAuthStore.setState({ user: null })
}

describe('ProtectedComponent', () => {
  beforeEach(resetStore)

  // ── With permission ───────────────────────────────────────────────────────

  it('renders children when the user has the required permission', () => {
    useAuthStore.setState({ user: ADMIN_USER_MOCK })

    render(
      <ProtectedComponent requires="ticket:create">
        <button>Créer un ticket</button>
      </ProtectedComponent>
    )

    expect(screen.getByText('Créer un ticket')).toBeInTheDocument()
  })

  // ── Without permission ────────────────────────────────────────────────────

  it('does NOT render children when the user lacks the required permission', () => {
    useAuthStore.setState({ user: BASIC_USER_MOCK })

    render(
      <ProtectedComponent requires="ticket:create">
        <button>Créer un ticket</button>
      </ProtectedComponent>
    )

    // ⚠ Spec requirement: element must be absent, not error-messaged
    expect(screen.queryByText('Créer un ticket')).not.toBeInTheDocument()
  })

  it('renders nothing (no error message) when permission is missing', () => {
    useAuthStore.setState({ user: BASIC_USER_MOCK })

    const { container } = render(
      <ProtectedComponent requires="admin:access">
        <span>Admin zone</span>
      </ProtectedComponent>
    )

    // Container should be empty — no error, no fallback, just absent
    expect(container.firstChild).toBeNull()
  })

  // ── Unauthenticated ───────────────────────────────────────────────────────

  it('hides children when no user is authenticated', () => {
    render(
      <ProtectedComponent requires="notification:read">
        <span>Notifications</span>
      </ProtectedComponent>
    )

    expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
  })

  // ── mode="any" ────────────────────────────────────────────────────────────

  it('renders children in any-mode when at least one permission matches', () => {
    useAuthStore.setState({ user: BASIC_USER_MOCK })

    render(
      <ProtectedComponent
        requires={['ticket:create', 'ticket:read']}
        mode="any"
      >
        <span>Ticket section</span>
      </ProtectedComponent>
    )

    // basic user has ticket:read → should render
    expect(screen.getByText('Ticket section')).toBeInTheDocument()
  })

  it('hides children in any-mode when no permission matches', () => {
    useAuthStore.setState({ user: BASIC_USER_MOCK })

    render(
      <ProtectedComponent
        requires={['ticket:create', 'admin:access']}
        mode="any"
      >
        <span>Admin or creator</span>
      </ProtectedComponent>
    )

    expect(screen.queryByText('Admin or creator')).not.toBeInTheDocument()
  })

  // ── mode="all" ────────────────────────────────────────────────────────────

  it('renders children in all-mode when every permission matches', () => {
    useAuthStore.setState({ user: ADMIN_USER_MOCK })

    render(
      <ProtectedComponent
        requires={['ticket:create', 'ticket:update']}
        mode="all"
      >
        <span>Full ticket control</span>
      </ProtectedComponent>
    )

    expect(screen.getByText('Full ticket control')).toBeInTheDocument()
  })

  it('hides children in all-mode when any permission is missing', () => {
    useAuthStore.setState({ user: BASIC_USER_MOCK })

    render(
      <ProtectedComponent
        requires={['ticket:read', 'ticket:create']}
        mode="all"
      >
        <span>Full ticket control</span>
      </ProtectedComponent>
    )

    expect(screen.queryByText('Full ticket control')).not.toBeInTheDocument()
  })

  // ── Custom fallback ───────────────────────────────────────────────────────

  it('renders the fallback prop when permission is missing', () => {
    useAuthStore.setState({ user: BASIC_USER_MOCK })

    render(
      <ProtectedComponent
        requires="admin:access"
        fallback={<span>Accès refusé</span>}
      >
        <span>Admin zone</span>
      </ProtectedComponent>
    )

    expect(screen.queryByText('Admin zone')).not.toBeInTheDocument()
    expect(screen.getByText('Accès refusé')).toBeInTheDocument()
  })
})