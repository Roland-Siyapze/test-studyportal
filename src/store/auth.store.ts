/**
 * @file auth.store.ts
 * @description Global authentication state managed with Zustand.
 *
 *   Stores the decoded AuthUser (including `authorities[]`) so every
 *   component in the tree can read permissions without prop-drilling.
 *
 *   Satisfies: STATE-001 (centralized auth state with authorities[]).
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { AuthUser } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Stable empty array to prevent infinite loops in selectors */
const EMPTY_AUTHORITIES: string[] = []

// ─────────────────────────────────────────────────────────────────────────────
// Store shape
// ─────────────────────────────────────────────────────────────────────────────

interface AuthState {
  /** Decoded JWT payload, null when unauthenticated */
  user: AuthUser | null
  /** True while the Keycloak init / mock auth is in-flight */
  isLoading: boolean
  /** True once the initial auth check has completed */
  isInitialized: boolean
  /** Non-null on auth error */
  error: string | null
}

interface AuthActions {
  setUser: (user: AuthUser) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      // State
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      setUser: (user) =>
        { set({ user, error: null }, false, 'auth/setUser'); },

      clearUser: () =>
        { set({ user: null }, false, 'auth/clearUser'); },

      setLoading: (isLoading) =>
        { set({ isLoading }, false, 'auth/setLoading'); },

      setInitialized: (isInitialized) =>
        { set({ isInitialized }, false, 'auth/setInitialized'); },

      setError: (error) =>
        { set({ error }, false, 'auth/setError'); },
    }),
    { name: 'StudyPortal/Auth' }
  )
)

// ─────────────────────────────────────────────────────────────────────────────
// Selectors — memoized derived values for common queries
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true when a valid user session exists */
export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.user !== null

/** Returns the authorities array or empty array when unauthenticated */
export const selectAuthorities = (state: AuthState): string[] =>
  state.user?.authorities ?? EMPTY_AUTHORITIES