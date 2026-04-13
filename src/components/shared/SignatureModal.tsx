import type { JSX } from 'react'

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
