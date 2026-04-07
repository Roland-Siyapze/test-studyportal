/**
 * @file routes.tsx  (auth-portal)
 * @description Route definitions for the auth portal.
 *   Imported and merged into the root router (src/router/index.tsx).
 */

import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const LoginPage = lazy(() => import('./pages/LoginPage'))

export const authPortalRoutes: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
]