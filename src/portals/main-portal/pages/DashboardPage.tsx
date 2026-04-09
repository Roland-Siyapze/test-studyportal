/**
 * @file DashboardPage.tsx
 * @description Main dashboard portal page.
 *   - Displays services available to users based on permissions
 *   - Implements permission-based UI rendering (authorities[] only)
 *   - Follows BOAZ-STUDY brand design system (light theme)
 *   - Architecture: portal feature page with shared components
 *
 * Satisfies:
 *   - ARCH-001 (main portal page)
 *   - PERM-002 (permission-gated sections via ProtectedComponent)
 *   - PERM-001 (usePermissions hook with hasPermission/hasAnyPermission)
 *   - DESIGN-001 (Figma-compliant light layout)
 */

import type { JSX } from 'react'
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { usePermissions } from '@hooks/usePermissions'
import { ProtectedComponent } from '@components/ProtectedComponent'
import type { Permission } from '@contracts/api-contracts'
import logo from '@assets/logo.png'

// ─────────────────────────────────────────────────────────────────────────────
// Service data — permission-gated
// ─────────────────────────────────────────────────────────────────────────────

interface Service {
  id: string
  title: string
  description: string
  icon: string
  permissions?: Permission[]
}

const services: Service[] = [
  {
    id: 'attestation-virement',
    title: 'Attestation de virement irrévocable',
    description: 'Obtenir une attestation de virement',
    icon: '🏦',
    permissions: ['document:upload', 'document:read'],
  },
  {
    id: 'attestation-logement',
    title: 'Attestation de logement',
    description: 'Certifier votre domicile',
    icon: '🏠',
    permissions: ['document:upload', 'document:read'],
  },
  {
    id: 'assurance',
    title: 'Assurance',
    description: 'Gérer vos assurances',
    icon: '🛡️',
    permissions: ['document:read'],
  },
  {
    id: 'financement',
    title: 'Demande de financement',
    description: 'Soumettre une demande',
    icon: '💰',
    permissions: ['ticket:create'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Navigation Items
// ─────────────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
}

const navItems: NavItem[] = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'mon-agence', label: 'Mon agence' },
  { id: 'services', label: 'Services' },
  { id: 'subscriptions', label: 'Mes souscriptions' },
  { id: 'proof', label: 'Preuves de versement' },
  { id: 'wallet', label: 'Mon Wallet Boaz' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Service Card Component
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: Service
  onSubscribe: (serviceId: string) => Promise<void>
  isLoading: boolean
}

function ServiceCard({
  service,
  onSubscribe,
  isLoading,
}: ServiceCardProps): JSX.Element {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-56 bg-white border border-gray-200">
      {/* Large icon background */}
      <div className="absolute top-4 right-4 text-6xl opacity-10 group-hover:opacity-15 transition-opacity">
        {service.icon}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-6">
        <div>
          <div className="text-3xl mb-3">{service.icon}</div>
          <h3 className="text-gray-900 font-semibold text-lg leading-tight">
            {service.title}
          </h3>
          <p className="text-gray-600 text-sm mt-2">{service.description}</p>
        </div>

        {/* Subscribe Button - Orange */}
        <button
          onClick={(): void => {
            onSubscribe(service.id).catch(() => {
              // Handle error silently
            })
          }}
          disabled={isLoading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          {isLoading ? 'Chargement...' : 'Souscrire'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage(): JSX.Element {
  const { user, logout } = useAuth()
  const { hasAnyPermission, authorities } = usePermissions()
  const [activeNav, setActiveNav] = useState('accueil')
  const [loadingServiceId, setLoadingServiceId] = useState<string | null>(null)

  // Handle subscription action
  const handleSubscribe = async (serviceId: string): Promise<void> => {
    setLoadingServiceId(serviceId)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))
    setLoadingServiceId(null)
    // In a real app, this would call an API endpoint
    // For now, just update the loading state
  }

  // Filter services based on user permissions
  const availableServices = services.filter((service) => {
    if (!service.permissions || service.permissions.length === 0) {
      return true
    }
    return hasAnyPermission(service.permissions)
  })

  return (
    <div className="flex min-h-screen bg-white">
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm sticky top-0 h-screen overflow-y-auto">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
          <img src={logo} alt="BOAZ Study" className="h-10 w-10 object-contain" />
          <span className="text-lg font-bold text-blue-600">boaz study</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 flex flex-col gap-2 mb-6">
          {navItems.map((item): JSX.Element => (
            <button
              key={item.id}
              onClick={(): void => {
                setActiveNav(item.id)
              }}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                activeNav === item.id
                  ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Admin Section */}
        <ProtectedComponent requires="admin:access">
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="w-full px-4 py-3 rounded-lg text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 transition-all duration-200">
              ⚙️ Paramètres Admin
            </button>
          </div>
        </ProtectedComponent>

        {/* User Profile & Logout */}
        <div className="mt-auto pt-6 border-t border-gray-200 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Connecté en tant que</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.preferred_username || 'User'}
            </p>
          </div>

          <button
            onClick={(): void => {
              logout().catch(() => {
                // Handle error silently
              })
            }}
            className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all duration-200"
          >
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 p-10 overflow-y-auto bg-gray-50">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Bienvenue, {user?.preferred_username}
          </h1>
          <p className="text-gray-600">
            Gérez vos services BOAZ-STUDY en toute confiance
          </p>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Email</p>
            <p className="text-gray-900 font-semibold truncate">{user?.email}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <p className="text-gray-600 text-sm mb-2">Permissions obtenues</p>
            <p className="text-gray-900 font-semibold">{authorities.length}</p>
          </div>

          <ProtectedComponent requires="admin:access" mode="any">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <p className="text-green-600 text-sm mb-2">Statut</p>
              <p className="text-green-900 font-semibold">✓ Administrateur</p>
            </div>
          </ProtectedComponent>
        </div>

        {/* Main Services Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Les services Boaz
          </h2>
          <p className="text-gray-600 text-sm">
            Sélectionnez un service pour commencer
          </p>
        </div>

        {/* Services Grid */}
        {availableServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {availableServices.map((service): JSX.Element => (
              <ProtectedComponent
                key={service.id}
                requires={service.permissions || []}
                mode="any"
                fallback={null}
              >
                <ServiceCard
                  service={service}
                  onSubscribe={handleSubscribe}
                  isLoading={loadingServiceId === service.id}
                />
              </ProtectedComponent>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-gray-600">
              Vous ne disposez pas des permissions pour accéder aux services.
            </p>
          </div>
        )}

        {/* Admin Stats Section */}
        <ProtectedComponent requires="admin:access">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              🔐 Section Administrative
            </h3>
            <p className="text-gray-600 mb-4">
              Vous avez accès aux fonctionnalités administrateur.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-600 text-xs mb-2">Permissions</p>
                <p className="text-gray-900 font-mono text-sm break-words">
                  {authorities.join(', ')}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-600 text-xs mb-2">ID utilisateur</p>
                <p className="text-gray-900 font-mono text-sm break-all">
                  {user?.sub}
                </p>
              </div>
            </div>
          </div>
        </ProtectedComponent>
      </main>
    </div>
  )
}