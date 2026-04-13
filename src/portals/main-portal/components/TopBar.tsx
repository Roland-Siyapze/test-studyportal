/**
 * @file TopBar.tsx  (v2 — pixel-perfect Figma match)
 * @description Floating white pill/card topbar.
 *   - Bold blue page title on the left
 *   - "Mon organisation" building icon selector
 *   - User avatar circle + name + role pill + chevron
 *   Sits on gray bg with margin, appears floating (matches Figma screen 1)
 */

import type { JSX } from 'react'
import { useAuth } from '@hooks/useAuth'
import { usePermissions } from '@hooks/usePermissions'

interface TopBarProps {
  pageTitle: string
  onMenuClick?: () => void
}

export function TopBar({ pageTitle, onMenuClick }: TopBarProps): JSX.Element {
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const isAdmin = hasPermission('admin:access')

  return (
    /* Gray strip that provides the outer gap */
    <div className="topbar-container" style={{
      background: '#EEF0F5',
      padding: '14px 14px 0',
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      {/* White floating pill */}
      <div className="topbar-content" style={{
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>

        {/* Page title — bold blue, matches Figma "Acceuil" style */}
        <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="mobile-nav-toggle in-topbar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}
          <h1 className="topbar-title" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.45rem',
            color: '#2563EB',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            {pageTitle}
          </h1>
        </div>

        {/* Right controls */}
        <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* Mon organisation */}
          <button className="org-btn" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            border: '1.5px solid #E5E9F2',
            borderRadius: 10,
            background: '#FAFBFE',
            color: '#374151',
            fontSize: '0.84rem',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'border-color 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2563EB' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E9F2' }}
          >
            {/* Building icon */}
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span className="org-label">Mon organisation</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* User pill — avatar + name + role + chevron */}
          <button className="user-btn" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px 6px 6px',
            border: '1.5px solid #E5E9F2',
            borderRadius: 999,
            background: '#FAFBFE',
            cursor: 'pointer',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2563EB'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(37,99,235,0.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E9F2'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none' }}
          >
            {/* Avatar circle */}
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F18F01 0%, #2A4F87 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-display)',
              flexShrink: 0,
              border: '2px solid #fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            }}>
              {(user?.preferred_username[0] ?? 'U').toUpperCase()}
            </div>

            {/* Name + role */}
            <div className="user-info" style={{ textAlign: 'left' }}>
              <p style={{
                fontWeight: 700,
                fontSize: '0.84rem',
                color: '#1A2332',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.2,
                margin: 0,
              }}>
                {user?.preferred_username ?? 'User'}
              </p>
              <p style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.2,
                margin: 0,
              }}>
                {isAdmin ? 'Admin' : 'Étudiant'}
              </p>
            </div>

            {/* Chevron */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}