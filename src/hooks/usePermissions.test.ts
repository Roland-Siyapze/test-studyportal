/**
 * @file usePermissions.test.ts
 * @description Unit tests for the usePermissions hook.
 *
 *   Satisfies: TEST-001
 *   Tests:
 *     - hasPermission returns true/false based on authorities mock
 *     - hasAnyPermission / hasAllPermissions behave correctly
 *     - Unauthenticated state (empty authorities) denies all
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePermissions } from '@hooks/usePermissions'
import { useAuthStore } from '@store/auth.store'
import { ADMIN_USER_MOCK } from '@services/mock/admin-user.mock'
import { BASIC_USER_MOCK } from '@services/mock/basic-user.mock'

// Helper: reset the Zustand store before each test
function resetStore(): void {
  useAuthStore.setState({ user: null })
}

describe('usePermissions', () => {
  beforeEach(resetStore)

  // ── Unauthenticated state ─────────────────────────────────────────────────

  it('denies all permissions when no user is authenticated', () => {
    const { result } = renderHook(() => usePermissions())
    expect(result.current.hasPermission('ticket:create')).toBe(false)
    expect(result.current.hasPermission('document:read')).toBe(false)
    expect(result.current.authorities).toHaveLength(0)
  })

  // ── Admin profile (full permissions) ─────────────────────────────────────

  describe('with ADMIN profile', () => {
    beforeEach(() => {
      useAuthStore.setState({ user: ADMIN_USER_MOCK })
    })

    it('grants ticket:create', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('ticket:create')).toBe(true)
    })

    it('grants document:upload', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('document:upload')).toBe(true)
    })

    it('grants admin:access', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('admin:access')).toBe(true)
    })

    it('hasAnyPermission returns true when at least one scope matches', () => {
      const { result } = renderHook(() => usePermissions())
      expect(
        result.current.hasAnyPermission(['ticket:create', 'user:manage'])
      ).toBe(true)
    })

    it('hasAllPermissions returns true when all scopes match', () => {
      const { result } = renderHook(() => usePermissions())
      expect(
        result.current.hasAllPermissions(['ticket:create', 'ticket:read'])
      ).toBe(true)
    })
  })

  // ── Basic user profile (limited permissions) ──────────────────────────────

  describe('with BASIC USER profile', () => {
    beforeEach(() => {
      useAuthStore.setState({ user: BASIC_USER_MOCK })
    })

    it('denies ticket:create', () => {
      const { result } = renderHook(() => usePermissions())
      // PERM-003 evaluator scenario — basic user must NOT have ticket:create
      expect(result.current.hasPermission('ticket:create')).toBe(false)
    })

    it('grants ticket:read', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('ticket:read')).toBe(true)
    })

    it('denies document:upload', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('document:upload')).toBe(false)
    })

    it('denies admin:access', () => {
      const { result } = renderHook(() => usePermissions())
      expect(result.current.hasPermission('admin:access')).toBe(false)
    })

    it('hasAnyPermission returns false when no scopes match', () => {
      const { result } = renderHook(() => usePermissions())
      expect(
        result.current.hasAnyPermission(['ticket:create', 'admin:access'])
      ).toBe(false)
    })

    it('hasAllPermissions returns false when not all scopes match', () => {
      const { result } = renderHook(() => usePermissions())
      expect(
        result.current.hasAllPermissions(['ticket:read', 'ticket:create'])
      ).toBe(false)
    })
  })
})