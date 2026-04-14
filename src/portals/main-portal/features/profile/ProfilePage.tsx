import type { JSX } from 'react'
import { useState } from 'react'
import { ProfileInfoTab, SecurityTab, NotificationsTab, TwoFactorTab } from './components'

type ProfileTab = 'info' | 'security' | 'notifications' | 'two-factor'

const TABS: Array<{ id: ProfileTab; label: string; icon: JSX.Element }> = [
  {
    id: 'info',
    label: 'Mes informations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'security',
    label: 'Sécurité',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    id: 'two-factor',
    label: 'Identification à double facteur',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
]

export function ProfilePage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<ProfileTab>('info')

  function renderTab(): JSX.Element {
    switch (activeTab) {
      case 'info':
        return <ProfileInfoTab />
      case 'security':
        return <SecurityTab />
      case 'notifications':
        return <NotificationsTab />
      case 'two-factor':
        return <TwoFactorTab />
      default:
        return <ProfileInfoTab />
    }
  }

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 20,
      padding: '32px 36px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 2,
        marginBottom: 32,
        borderBottom: '2px solid #E5E9F2',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id) }}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? '#2563EB' : '#94A3B8',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              position: 'relative',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                (e.currentTarget as HTMLButtonElement).style.color = '#64748B';
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
                (e.currentTarget as HTMLButtonElement).style.color = '#94A3B8';
              }
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', opacity: activeTab === tab.id ? 1 : 0.65 }}>
              {tab.icon}
            </span>
            {tab.label}
            {activeTab === tab.id && (
              <div style={{
                position: 'absolute',
                bottom: -2,
                left: 0,
                right: 0,
                height: 2,
                background: '#2563EB',
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {renderTab()}
      </div>
    </div>
  )
}
