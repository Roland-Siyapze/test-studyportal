/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * @file Sidebar.tsx  (v2 — pixel-perfect Figma match)
 * @description Floating white card sidebar with large rounded corners.
 *   - Uses logo.png from @assets
 *   - Gray outer bg, white rounded inner card
 *   - Exact nav items matching Figma screenshots
 */

import type { JSX} from 'react';
import { useState } from 'react'
import { useAuth } from '@hooks/useAuth'
import { ProtectedComponent } from '@components/ProtectedComponent'
import logo from '@assets/logo.png'

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

const Icon = {
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  agency: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  box: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  file: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  wallet: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  link: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  ),
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  ticket: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevron: (open: boolean) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      style={{ transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ActivePage =
  | 'accueil'
  | 'mon-agence'
  | 'services'
  | 'subscriptions-services'
  | 'subscriptions-financement'
  | 'subscriptions-remboursements'
  | 'preuves'
  | 'wallet-historiques'
  | 'affiliation'
  | 'tableau-de-bord'
  | 'parametres'
  | 'tickets'
  | 'documents'
  | 'notifications'

interface SidebarProps {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Nav components
// ─────────────────────────────────────────────────────────────────────────────

function NavBtn({
  label, icon, active, onClick,
}: {
  label: string
  icon: JSX.Element
  active: boolean
  onClick: () => void
}): JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '10px 14px',
        borderRadius: 10,
        border: 'none',
        background: active ? '#EEF0F8' : 'transparent',
        color: active ? '#2563EB' : '#64748B',
        fontWeight: active ? 700 : 500,
        fontSize: '0.875rem',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.12s, color 0.12s',
        lineHeight: 1,
      }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = '#F5F6FB'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B' } }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }}>{icon}</span>
      {label}
    </button>
  )
}

function SubBtn({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }): JSX.Element {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px 14px 8px 46px',
        borderRadius: 8,
        border: 'none',
        background: active ? '#EEF0F8' : 'transparent',
        color: active ? '#2563EB' : '#64748B',
        fontWeight: active ? 600 : 400,
        fontSize: '0.845rem',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.12s, color 0.12s',
      }}
      onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = '#F5F6FB'; (e.currentTarget as HTMLButtonElement).style.color = '#374151' } }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B' } }}
    >
      {label}
    </button>
  )
}

function Expandable({
  label, icon, open, onToggle, active, children,
}: {
  label: string; icon: JSX.Element; open: boolean
  onToggle: () => void; active: boolean; children: JSX.Element
}): JSX.Element {
  return (
    <div>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          padding: '10px 14px',
          borderRadius: 10,
          border: 'none',
          background: 'transparent',
          color: active ? '#2563EB' : '#64748B',
          fontWeight: active ? 700 : 500,
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
          cursor: 'pointer',
          transition: 'background 0.12s, color 0.12s',
          lineHeight: 1,
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F6FB' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
      >
        <span style={{ flexShrink: 0, opacity: active ? 1 : 0.65 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {Icon.chevron(open)}
      </button>
      {open && <div style={{ marginTop: 2 }}>{children}</div>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export function Sidebar({ activePage, onNavigate }: SidebarProps): JSX.Element {
  const { user, logout } = useAuth()
  const [suscOpen, setSuscOpen] = useState(activePage.startsWith('subscriptions'))
  const [walletOpen, setWalletOpen] = useState(activePage === 'wallet-historiques')
  const [agenceOpen, setAgenceOpen] = useState(false)

  const go = (page: ActivePage) => () => { onNavigate(page); }

  return (
    /* Gray outer shell — same color as page background so card appears to float */
    <div style={{
      width: 260,
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 40,
      padding: '14px 10px',
      background: '#EEF0F5',
      boxSizing: 'border-box',
    }}>
      {/* White floating card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px 18px' }}>
          <img
            src={logo}
            alt="Boaz Study"
            style={{ height: 65, width: 'auto', display: 'flex', margin: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 1 }}>

          <NavBtn label="Acceuil" icon={Icon.home} active={activePage === 'accueil'} onClick={go('accueil')} />

          <Expandable label="Mon agence" icon={Icon.agency} open={agenceOpen}
            onToggle={() => { setAgenceOpen(o => !o); }} active={activePage === 'mon-agence'}>
            <>
              <SubBtn label="Vue générale" active={activePage === 'mon-agence'} onClick={go('mon-agence')} />
            </>
          </Expandable>

          <NavBtn label="Services" icon={Icon.grid} active={activePage === 'services'} onClick={go('services')} />

          <Expandable label="Mes suscriptions" icon={Icon.box} open={suscOpen}
            onToggle={() => { setSuscOpen(o => !o); }} active={activePage.startsWith('subscriptions')}>
            <>
              <SubBtn label="Services" active={activePage === 'subscriptions-services'} onClick={go('subscriptions-services')} />
              <SubBtn label="Financement" active={activePage === 'subscriptions-financement'} onClick={go('subscriptions-financement')} />
              <SubBtn label="Remboursements" active={activePage === 'subscriptions-remboursements'} onClick={go('subscriptions-remboursements')} />
            </>
          </Expandable>

          <NavBtn label="Preuves de versement" icon={Icon.file} active={activePage === 'preuves'} onClick={go('preuves')} />

          <Expandable label="Mon Wallet Boaz" icon={Icon.wallet} open={walletOpen}
            onToggle={() => { setWalletOpen(o => !o); }} active={activePage === 'wallet-historiques'}>
            <>
              <SubBtn label="Mes historiques" active={activePage === 'wallet-historiques'} onClick={go('wallet-historiques')} />
            </>
          </Expandable>

          <NavBtn label="Programme d'affiliation" icon={Icon.link} active={activePage === 'affiliation'} onClick={go('affiliation')} />

          {/* GENERAL divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 4px 8px', margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E9ECF3' }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#C4C9D9', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>GENERAL</span>
            <div style={{ flex: 1, height: 1, background: '#E9ECF3' }} />
          </div>

          <NavBtn label="Tableau de bord" icon={Icon.dashboard} active={activePage === 'tableau-de-bord'} onClick={go('tableau-de-bord')} />

          <ProtectedComponent requires={['ticket:read', 'ticket:create']} mode="any">
            <NavBtn label="Mes tickets" icon={Icon.ticket} active={activePage === 'tickets'} onClick={go('tickets')} />
          </ProtectedComponent>

          <ProtectedComponent requires="notification:read">
            <NavBtn label="Notifications" icon={Icon.bell} active={activePage === 'notifications'} onClick={go('notifications')} />
          </ProtectedComponent>

          <ProtectedComponent requires="admin:access">
            <NavBtn label="Paramètres" icon={Icon.settings} active={activePage === 'parametres'} onClick={go('parametres')} />
          </ProtectedComponent>
        </nav>

        {/* User + logout */}
        <div style={{ padding: '10px 10px 14px', borderTop: '1px solid #F0F2F8' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 12, background: '#F8F9FD', marginBottom: 8,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F18F01, #2A4F87)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '0.88rem',
              fontFamily: 'var(--font-display)', flexShrink: 0,
            }}>
              {(user?.preferred_username[0] ?? 'U').toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1A2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', lineHeight: 1.3 }}>
                {user?.preferred_username ?? 'User'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: 'var(--font-body)', lineHeight: 1.2 }}>
                {user?.email ?? ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => { void logout() }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, width: '100%',
              padding: '9px 12px', borderRadius: 10,
              border: '1px solid #FECDC8', background: 'transparent',
              color: '#C73E1D', fontWeight: 600, fontSize: '0.82rem',
              fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'background 0.12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F0' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            {Icon.logout} Déconnexion
          </button>
        </div>
      </div>
    </div>
  )
}