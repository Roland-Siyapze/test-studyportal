/**
 * @file DashboardPage.tsx  (v3 — pixel-perfect Figma match)
 *
 * Layout:
 *   - Gray (#EEF0F5) full-page background
 *   - Sidebar width = 260px (with its own 14px outer padding → effective offset 260px)
 *   - TopBar = floating white card in gray strip
 *   - Content = white rounded card with inner padding
 *
 * Service cards (matching Figma screen 3):
 *   - Real photo background images via Unsplash (matching subject matter)
 *   - Dark gradient overlay so text is legible
 *   - Small white icon + title text centered over photo
 *   - Orange "Souscrire" bar at the bottom, no gap
 *   - Overall card has large border-radius
 */

import type { JSX} from 'react';
import { useState } from 'react'
import { Sidebar, type ActivePage } from '../components/Sidebar'
import { TopBar } from '../components/TopBar'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { usePermissions } from '@hooks/usePermissions'
import type { Permission } from '@contracts/api-contracts'

// Sub-pages
import { TicketsPage } from '../features/tickets/TicketsPage'
import { DocumentsPage } from '../features/documents/DocumentsPage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { AVIPage } from '../features/avi/AVIPage'

// ─────────────────────────────────────────────────────────────────────────────
// Service definitions
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceDef {
  id: string
  title: string
  permissions: Permission[]
  // Unsplash photo matched to each service subject
  photo: string
  icon: JSX.Element
  avi?: boolean
}

const SERVICES: ServiceDef[] = [
  {
    id: 'avi',
    title: 'Attestation de virement irrévocable',
    permissions: ['document:upload', 'document:read'],
    photo: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80&fit=crop',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    avi: true,
  },
  {
    id: 'logement',
    title: 'Attestation de logement',
    permissions: ['document:upload', 'document:read'],
    photo: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80&fit=crop',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'assurance',
    title: 'Assurance',
    permissions: ['document:read'],
    photo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80&fit=crop',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
      </svg>
    ),
  },
  {
    id: 'financement',
    title: 'Demande de financement',
    permissions: ['ticket:create'],
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80&fit=crop',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Service Card — exact Figma match
// ─────────────────────────────────────────────────────────────────────────────

function ServiceCard({
  service,
  onSubscribe,
}: {
  service: ServiceDef
  onSubscribe: (s: ServiceDef) => void
}): JSX.Element {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: hovered
          ? '0 12px 32px rgba(0,0,0,0.18)'
          : '0 3px 14px rgba(0,0,0,0.10)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => { setHovered(true); }}
      onMouseLeave={() => { setHovered(false); }}
    >
      {/* Photo + overlay section */}
      <div style={{
        position: 'relative',
        height: 180,
        overflow: 'hidden',
      }}>
        {/* Photo */}
        <img
          src={service.photo}
          alt={service.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s ease',
          }}
        />
        {/* Dark gradient overlay — bottom-heavy so text is readable */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
        }} />

        {/* Icon + Title — centered in the photo */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 16px',
          gap: 10,
        }}>
          {/* Icon */}
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(255,255,255,0.25)',
          }}>
            {service.icon}
          </div>

          {/* Title */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.3,
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            {service.title}
          </p>
        </div>
      </div>

      {/* Orange Souscrire button — flush to card bottom, no gap */}
      <button
        onClick={() => { onSubscribe(service); }}
        style={{
          display: 'block',
          width: '100%',
          padding: '15px',
          background: '#F18F01',
          color: '#FFFFFF',
          border: 'none',
          fontFamily: 'var(--font-body)',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          textAlign: 'center',
          letterSpacing: '0.01em',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#D97E00' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F18F01' }}
      >
        Souscrire
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Accueil content
// ─────────────────────────────────────────────────────────────────────────────

function AccueilContent({ onSubscribe }: { onSubscribe: (s: ServiceDef) => void }): JSX.Element {
  const { hasAnyPermission } = usePermissions()

  const available = SERVICES.filter(s =>
    s.permissions.length === 0 || hasAnyPermission(s.permissions)
  )

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* White content card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '28px 28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        {/* Section header */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: '#2563EB',
          marginBottom: 24,
        }}>
          Les services Boaz
        </h2>

        {/* 2-column grid of service cards */}
        {available.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            margin: '0 auto',
            gap: 30,
            width: '70%',
          }}>
            {available.map(service => (
              <ProtectedComponent
                key={service.id}
                requires={service.permissions}
                mode="any"
                fallback={null}
              >
                <ServiceCard service={service} onSubscribe={onSubscribe} />
              </ProtectedComponent>
            ))}
          </div>
        ) : (
          <div style={{
            padding: 40,
            textAlign: 'center',
            background: '#F8F9FD',
            borderRadius: 14,
            border: '1px dashed #E5E9F2',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔒</div>
            <p style={{ fontWeight: 700, color: '#374151', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
              Aucun service disponible
            </p>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
              Vos permissions actuelles ne donnent pas accès aux services.
            </p>
          </div>
        )}
      </div>

      {/* Admin stats card */}
      <ProtectedComponent requires="admin:access">
        <div style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '24px 28px',
          marginTop: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#1A2332', marginBottom: 16 }}>
            🔐 Section Administrative
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            {[
              { label: 'Utilisateurs', value: '128', color: '#2563EB', bg: '#EEF2FF' },
              { label: 'Tickets actifs', value: '14',  color: '#D97E00', bg: '#FFF7ED' },
              { label: 'Documents',     value: '47',   color: '#428959', bg: '#ECFDF5' },
              { label: 'Souscriptions', value: '89',   color: '#7C3AED', bg: '#F5F3FF' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{
                background: bg, borderRadius: 12, padding: '16px 14px',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color, lineHeight: 1 }}>{value}</p>
                <p style={{ fontSize: '0.78rem', color: '#64748B', fontFamily: 'var(--font-body)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </ProtectedComponent>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page title map
// ─────────────────────────────────────────────────────────────────────────────

const TITLES: Record<string, string> = {
  accueil: 'Acceuil',
  'mon-agence': 'Mon agence',
  services: 'Services',
  'subscriptions-services': 'Mes souscriptions',
  'subscriptions-financement': 'Financement',
  'subscriptions-remboursements': 'Remboursements',
  preuves: 'Preuves de versement',
  'wallet-historiques': 'Mon Wallet Boaz',
  affiliation: 'Programme d\'affiliation',
  'tableau-de-bord': 'Tableau de bord',
  parametres: 'Paramètres',
  tickets: 'Mes Tickets',
  documents: 'Documents',
  notifications: 'Notifications',
  avi: 'Obtenir mon A.V.I',
}

// ─────────────────────────────────────────────────────────────────────────────
// Access denied fallback
// ─────────────────────────────────────────────────────────────────────────────

function AccessDenied(): JSX.Element {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: 48, textAlign: 'center',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1A2332', marginBottom: 8, fontSize: '1.1rem' }}>
        Accès non autorisé
      </h3>
      <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
        Vous n'avez pas les permissions nécessaires pour accéder à cette section.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main DashboardPage
// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage(): JSX.Element {
  const [activePage, setActivePage] = useState<ActivePage>('accueil')
  const [showAVI, setShowAVI] = useState(false)

  function handleNavigate(page: ActivePage): void {
    setShowAVI(false)
    setActivePage(page)
  }

  function handleSubscribe(service: ServiceDef): void {
    if (service.avi) {
      setShowAVI(true)
    }
    // Other services could route elsewhere
  }

  const pageTitle = showAVI ? 'Obtenir mon A.V.I' : (TITLES[activePage] ?? 'Acceuil')

  function renderContent(): JSX.Element {
    if (showAVI) {
      return <AVIPage onBack={() => { setShowAVI(false); setActivePage('accueil') }} />
    }

    switch (activePage) {
      case 'tickets':
        return (
          <ProtectedComponent requires={['ticket:read', 'ticket:create']} mode="any" fallback={<AccessDenied />}>
            <TicketsPage />
          </ProtectedComponent>
        )
      case 'documents':
        return (
          <ProtectedComponent requires="document:read" fallback={<AccessDenied />}>
            <DocumentsPage />
          </ProtectedComponent>
        )
      case 'notifications':
        return (
          <ProtectedComponent requires="notification:read" fallback={<AccessDenied />}>
            <NotificationsPage />
          </ProtectedComponent>
        )
      default:
        return <AccueilContent onSubscribe={handleSubscribe} />
    }
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#EEF0F5',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Sidebar */}
      <Sidebar activePage={showAVI ? 'services' : activePage} onNavigate={handleNavigate} />

      {/* Main area — offset by sidebar width */}
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopBar pageTitle={pageTitle} />

        {/* Page content — with gray padding so cards appear floating */}
        <main style={{
          flex: 1,
          padding: '16px 14px 24px',
          background: '#EEF0F5',
        }}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}