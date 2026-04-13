import type { JSX } from 'react'

export interface SuccessScreenProps {
  onGoToDemandes: () => void
}

export function SuccessScreen({ onGoToDemandes }: SuccessScreenProps): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', textAlign: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 20 }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #34D399, #10B981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(16,185,129,0.3)',
          animation: 'fadeIn 0.5s ease',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: '#374151', lineHeight: 1.3 }}>
            Demande envoyée<br/>avec succès
          </h2>
        </div>

        <button
          onClick={onGoToDemandes}
          style={{
            padding: '13px 32px',
            borderRadius: 10,
            border: 'none',
            background: '#2A4F87',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 14px rgba(42,79,135,0.35)',
            marginTop: 8,
          }}
        >
          Aller à mes demandes
        </button>
      </div>
    </div>
  )
}
