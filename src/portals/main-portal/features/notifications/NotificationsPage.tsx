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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {notifications.map(n => {
          const cfg = TYPE_CONFIG[n.type]
          return (
            <div
              key={n.id}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: `2px solid ${cfg.bg}`,
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: n.read ? '0 2px 8px rgba(0,0,0,0.04)' : `0 4px 16px ${cfg.color}20`,
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => { markRead(n.id); }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${cfg.color}30`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = n.read ? '0 2px 8px rgba(0,0,0,0.04)' : `0 4px 16px ${cfg.color}20`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Unread indicator */}
              {!n.read && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: cfg.color,
                }} />
              )}

              {/* Icon + Type Badge */}
              <div style={{
                width: 50,
                height: 50,
                borderRadius: 12,
                background: cfg.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                marginBottom: 12,
              }}>
                {cfg.icon}
              </div>

              {/* Title + Type label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <p style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#1A2332',
                  fontFamily: 'var(--font-display)',
                  margin: 0,
                }}>
                  {n.title}
                </p>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: cfg.bg,
                  color: cfg.color,
                  flexShrink: 0,
                }}>
                  {cfg.label}
                </span>
              </div>

              {/* Message */}
              <p style={{
                fontSize: '0.85rem',
                color: '#64748B',
                lineHeight: 1.6,
                marginBottom: 12,
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}>
                {n.message}
              </p>

              {/* Date + Read status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid #EBF0FA',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
                  {formatDate(n.createdAt)}
                </span>
                {!n.read && (
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: cfg.color,
                    flexShrink: 0,
                  }} />
                )}
              </div>
            </div>
          )
        })}

        {notifications.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            background: '#fff',
            borderRadius: 14,
            border: '1px dashed #E5E9F2',
            padding: '80px 40px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔔</div>
            <p style={{
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#1A2332',
              fontFamily: 'var(--font-display)',
              marginBottom: 6,
            }}>
              Aucune notification
            </p>
            <p style={{
              fontSize: '0.85rem',
              color: '#94A3B8',
              fontFamily: 'var(--font-body)',
            }}>
              Vous n'avez pas de notification pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}