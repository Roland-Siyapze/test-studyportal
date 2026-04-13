/**
 * @file NotificationModal.tsx
 * @description Reusable notification/confirmation modal system.
 *   Matches the Figma notification designs (image 19):
 *     - SUCCESS (green checkmark)
 *     - WARNING / ATTENTION (orange triangle)
 *     - ERROR (red sad face)
 *     - CONFIRM (yellow exclamation — "Êtes-vous sûr?")
 *
 *   Usage:
 *     <NotificationModal type="success" title="Action effectuée" onClose={...} />
 *     <NotificationModal type="confirm" title="Êtes-vous sûr?" onConfirm={...} onClose={...} />
 */

import type { JSX, ReactNode } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ModalType = 'success' | 'warning' | 'error' | 'confirm'

export interface NotificationModalProps {
  type: ModalType
  title: string
  description?: string
  /** Primary CTA label — defaults vary by type */
  confirmLabel?: string
  /** Secondary CTA label (confirm type only) */
  cancelLabel?: string
  /** Called when user clicks the primary CTA */
  onConfirm?: () => void
  /** Called when user clicks cancel or closes */
  onClose: () => void
  /** Optional custom content below description */
  children?: ReactNode
}

// ─────────────────────────────────────────────────────────────────────────────
// Icon components
// ─────────────────────────────────────────────────────────────────────────────

function SuccessIcon(): JSX.Element {
  return (
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34D399, #10B981)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  )
}

function WarningIcon(): JSX.Element {
  return (
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
  )
}

function ErrorIcon(): JSX.Element {
  return (
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #F87171, #EF4444)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    </div>
  )
}

function ConfirmIcon(): JSX.Element {
  return (
    <div style={{
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Config per type
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  success: {
    icon: <SuccessIcon />,
    titleColor: '#10B981',
    label: 'SUCCESS!',
    defaultConfirm: 'Continuer',
    confirmBg: '#10B981',
    confirmHover: '#059669',
    showCancel: false,
  },
  warning: {
    icon: <WarningIcon />,
    titleColor: '#F59E0B',
    label: 'ATTENTION!',
    defaultConfirm: 'Confirmer',
    confirmBg: '#F59E0B',
    confirmHover: '#D97706',
    showCancel: true,
  },
  error: {
    icon: <ErrorIcon />,
    titleColor: '#EF4444',
    label: 'ERREUR!',
    defaultConfirm: 'RÉESSAYER',
    confirmBg: '#EF4444',
    confirmHover: '#DC2626',
    showCancel: false,
  },
  confirm: {
    icon: <ConfirmIcon />,
    titleColor: '#374151',
    label: null,
    defaultConfirm: 'Confirmer',
    confirmBg: '#10B981',
    confirmHover: '#059669',
    showCancel: true,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

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
  const cfg = CONFIG[type]
  const handleConfirm = (): void => {
    if (onConfirm) onConfirm()
    else onClose()
  }

  return (
    /* Backdrop */
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
      {/* Card */}
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
        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          {cfg.icon}
        </div>

        {/* Type label (e.g. "SUCCESS!") */}
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

        {/* Title */}
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

        {/* Description */}
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

        {/* Optional children */}
        {children && (
          <div style={{ marginTop: 12 }}>
            {children}
          </div>
        )}

        {/* Actions */}
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

// ─────────────────────────────────────────────────────────────────────────────
// Signature modal — matches image 18 (contract signing)
// ─────────────────────────────────────────────────────────────────────────────

export interface SignatureModalProps {
  onConfirm: () => void
  onClose: () => void
  contractPreview?: string
}

export function SignatureModal({ onConfirm, onClose }: SignatureModalProps): JSX.Element {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backdropFilter: 'blur(2px)',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 20,
        padding: '32px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.25s ease',
        position: 'relative',
      }}>
        {/* Warning banner */}
        <div style={{
          background: '#FFF9E6',
          border: '1px solid #FCD34D',
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 24,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#F59E0B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem' }}>!</span>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: '#374151',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)',
          }}>
            En acceptant et en signant, vous approuvez toutes les proformas et contrats qui vous ont été présentés, et autres indications
          </p>
        </div>

        {/* Signature area */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#1A2332',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            Votre Signature
          </p>
          <div style={{
            border: '2px dashed #E5E9F2',
            borderRadius: 14,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F8FAFC',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 10,
              border: '1.5px solid #E5E9F2',
              background: '#fff',
              color: '#64748B',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Annuler
          </button>

          {/* Eraser icon button */}
          <button style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            border: '2px solid #F59E0B',
            background: '#FFF9E6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 20H7L3 16l11-11 7 7-1 8z"/>
              <line x1="6" y1="14" x2="12" y2="8"/>
            </svg>
          </button>

          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: 10,
              border: 'none',
              background: '#2A4F87',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(42,79,135,0.3)',
            }}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  )
}