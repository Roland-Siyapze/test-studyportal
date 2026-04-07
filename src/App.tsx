/**
 * @file App.tsx
 * @description Root component.
 *   Kicks off the auth initialisation on mount, then renders the router.
 *   The PageLoader is shown while keycloak.init() / mock setup is in-flight.
 */

import { JSX, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { AppRouter } from '@router/index'
import { PageLoader } from '@components/shared/PageLoader'

export default function App(): JSX.Element {
  const { initAuth, isInitialized } = useAuth()

  // Run auth initialisation exactly once on mount
  useEffect(() => {
    void initAuth()
  }, [initAuth])

  // Block rendering until Keycloak (or mock) has resolved
  if (!isInitialized) return <PageLoader />

  return <AppRouter />
}