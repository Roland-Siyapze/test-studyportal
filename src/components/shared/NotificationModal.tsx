import type { JSX, ReactNode } from 'react'
import { NotificationIcon, notificationConfig, type NotificationType } from './NotificationIcon'

export type { NotificationType }

export interface NotificationModalProps {
  type: NotificationType
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  onClose: () => void
  children?: ReactNode
}

export function NotificationModal({
  type,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Annuler',
  onConfirm,
  onClose,
  children,
}: NotificationModalProps): JSX.Element {
  const cfg = notificationConfig[type]
  const handleConfirm = (): void => {
    if (onConfirm) onConfirm()
    else onClose()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(2px)',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '40px 36px 32px',
        width: '100%',
        maxWidth: 400,
        textAlign: 'center',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        animation: 'slideUp 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <NotificationIcon type={type} />
        </div>

        {cfg.label && (
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.1rem',
            color: cfg.titleColor,
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}>
            {cfg.label}
          </p>
        )}

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: type === 'confirm' ? '1.1rem' : '1rem',
          color: '#1A2332',
          marginBottom: description ? 8 : 0,
          lineHeight: 1.4,
        }}>
          {title}
        </h3>

        {description && (
          <p style={{
            fontSize: '0.87rem',
            color: '#64748B',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)',
            marginBottom: children ? 0 : 0,
          }}>
            {description}
          </p>
        )}

        {children && (
          <div style={{ marginTop: 12 }}>
            {children}
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginTop: 28,
          flexDirection: cfg.showCancel ? 'row' : 'column',
        }}>
          {cfg.showCancel && (
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: 10,
                border: 'none',
                background: '#374151',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
            >
              {cancelLabel}
            </button>
          )}

          <button
            onClick={handleConfirm}
            style={{
              flex: cfg.showCancel ? 1 : undefined,
              width: cfg.showCancel ? undefined : '100%',
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background: cfg.confirmBg,
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.1s',
              boxShadow: `0 4px 14px ${cfg.confirmBg}50`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = cfg.confirmHover }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = cfg.confirmBg }}
          >
            {confirmLabel ?? cfg.defaultConfirm}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
