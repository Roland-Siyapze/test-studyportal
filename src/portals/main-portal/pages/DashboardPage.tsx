/**
 * @file DashboardPage.tsx
 * @description Main portal dashboard — placeholder.
 *   Replace this with the full dashboard implementation.
 *   Demonstrates: auth state read, permissions conditional render,
 *   logout action.
 */

import { useAuth } from '@hooks/useAuth'
import { usePermissions } from '@hooks/usePermissions'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { JSX } from 'react'

export default function DashboardPage(): JSX.Element {
  const { user, logout } = useAuth()
  const { authorities } = usePermissions()

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: 'var(--color-navy)', color: 'var(--color-text)' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Tableau de bord
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
            >
              Bienvenue,{' '}
              <span style={{ color: 'var(--color-blue-light)' }}>
                {user?.preferred_username}
              </span>
            </p>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#FCA5A5',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* Permission-gated elements — for evaluator testing (PERM-002, PERM-003) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          <ProtectedComponent requires="ticket:create">
            <div
              className="p-5 rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
                ticket:create ✓
              </p>
              <button className="btn-primary">Créer un ticket</button>
            </div>
          </ProtectedComponent>

          <ProtectedComponent requires="document:upload">
            <div
              className="p-5 rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
                document:upload ✓
              </p>
              <button className="btn-primary">Joindre un fichier</button>
            </div>
          </ProtectedComponent>

          <ProtectedComponent requires="admin:access">
            <div
              className="p-5 rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
                admin:access ✓
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
                Section Admin — visible uniquement pour les admins
              </p>
            </div>
          </ProtectedComponent>

          <ProtectedComponent requires="notification:read">
            <div
              className="p-5 rounded-xl"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <p className="text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}>
                notification:read ✓
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem' }}>
                Centre de notifications — badge compteur
              </p>
            </div>
          </ProtectedComponent>
        </div>

        {/* Authorities debug panel */}
        <div
          className="p-5 rounded-xl"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            Permissions actives
          </p>
          <div className="flex flex-wrap gap-2">
            {authorities.map((auth) => (
              <span
                key={auth}
                className="px-2 py-1 rounded-lg text-xs font-mono"
                style={{
                  background: 'rgba(37,99,235,0.15)',
                  color: 'var(--color-blue-light)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {auth}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}