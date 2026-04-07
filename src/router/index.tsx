/**
 * @file index.tsx  (router)
 * @description Application router.
 *
 *   - All portal routes use React.lazy + Suspense for lazy loading (ARCH-002).
 *   - Unauthenticated users are redirected to /login (AUTH-003).
 *   - The portals/ folder structure drives the route tree (ARCH-001).
 */

import { JSX, lazy, Suspense } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from 'react-router-dom'
import { useAuthStore } from '@store/auth.store'
import { PageLoader } from '@components/shared/PageLoader'

// ─── Lazy-loaded portals ────────────────────────────────────────────────────
// Each portal is a separate chunk — loaded only when first navigated to.

const LoginPage = lazy(
  () => import('@portals/auth-portal/pages/LoginPage')
)

const DashboardPage = lazy(
  () => import('@portals/main-portal/pages/DashboardPage')
)

// ─── Route guards ───────────────────────────────────────────────────────────

/**
 * Redirects unauthenticated users to /login.
 * Wraps all protected portal routes.
 */
function RequireAuth(): JSX.Element {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" replace />
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  )
}

/**
 * Redirects already-authenticated users away from /login.
 */
function RedirectIfAuth(): JSX.Element {
  const user = useAuthStore((s) => s.user)
  if (user) return <Navigate to="/dashboard" replace />
  return (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  )
}

// ─── Router definition ──────────────────────────────────────────────────────

const router = createBrowserRouter([
  // Public routes (auth portal)
  {
    element: <RedirectIfAuth />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },

  // Protected routes (main portal)
  {
    element: <RequireAuth />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      // Future portals/features are registered here
    ],
  },

  // Fallback
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '*', element: <Navigate to="/login" replace /> },
])

export function AppRouter(): JSX.Element {
  return <RouterProvider router={router} />
}