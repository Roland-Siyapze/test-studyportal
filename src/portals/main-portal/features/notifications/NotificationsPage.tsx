/* eslint-disable @typescript-eslint/restrict-template-expressions */
/**
 * @file NotificationsPage.tsx
 * @description Notification center — gated behind notification:read.
 */

import type { JSX} from 'react';
import { useState } from 'react'
import { MOCK_NOTIFICATIONS } from '@services/mock/notifications.mock'
import type {  NotificationType } from '@contracts/api-contracts'

const TYPE_CONFIG: Record<NotificationType, { icon: string; color: string; bg: string; label: string }> = {
  SUCCESS: { icon: '✅', color: '#428959', bg: '#EAF5EE', label: 'Succès' },
  INFO:    { icon: 'ℹ️', color: '#2A4F87', bg: '#EBF0FA', label: 'Info' },
  WARNING: { icon: '⚠️', color: '#D97E00', bg: '#FFF4E0', label: 'Attention' },
  ERROR:   { icon: '❌', color: '#C73E1D', bg: '#FEF2F0', label: 'Erreur' },
}

function formatDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Il y a ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `Il y a ${hours}h`
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(iso))
}

export function NotificationsPage(): JSX.Element {
  const [notifications, setNotifications] = useState([...MOCK_NOTIFICATIONS])

  function markRead(id: string): void {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead(): void {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unread = notifications.filter(n => !n.read).length

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
            {notifications.length} notification{notifications.length > 1 ? 's' : ''}
          </p>
          {unread > 0 && (
            <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: '#FEF2F0', color: '#C73E1D' }}>
              {unread} non lue{unread > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              padding: '8px 16px', borderRadius: 8, border: '1.5px solid #E5E9F2',
              background: '#fff', color: '#2A4F87', fontWeight: 600, fontSize: '0.82rem',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifications.map(n => {
          const cfg = TYPE_CONFIG[n.type]
          return (
            <div
              key={n.id}
              style={{
                background: n.read ? '#fff' : '#FAFBFF',
                borderRadius: 14,
                border: `1px solid ${n.read ? '#E5E9F2' : '#D0DCFF'}`,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                boxShadow: n.read ? '0 2px 8px rgba(0,0,0,0.04)' : '0 2px 12px rgba(42,79,135,0.08)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: cfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem', flexShrink: 0,
              }}>
                {cfg.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1A2332', fontFamily: 'var(--font-display)' }}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2A4F87', flexShrink: 0 }} />
                  )}
                </div>
                <p style={{ fontSize: '0.84rem', color: '#64748B', lineHeight: 1.5, marginBottom: 6, fontFamily: 'var(--font-body)' }}>
                  {n.message}
                </p>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{formatDate(n.createdAt)}</span>
              </div>

              {!n.read && (
                <button
                  onClick={() => { markRead(n.id); }}
                  style={{
                    padding: '6px 12px', borderRadius: 8, border: '1.5px solid #E5E9F2',
                    background: '#fff', color: '#64748B', fontSize: '0.75rem', fontWeight: 600,
                    cursor: 'pointer', flexShrink: 0, fontFamily: 'var(--font-body)',
                  }}
                >
                  Lu
                </button>
              )}
            </div>
          )
        })}

        {notifications.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px dashed #E5E9F2', padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔔</div>
            <p style={{ fontWeight: 600, color: '#64748B', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
              Aucune notification
            </p>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
              Vous n'avez pas de notification pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}