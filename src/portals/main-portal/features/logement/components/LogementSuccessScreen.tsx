import type { JSX } from 'react'
import { AVIStepper } from '../../avi/AVIStepper'

export interface LogementSuccessScreenProps {
  onGoToDemandes: () => void
}

const stepper = [
  { number: 1, label: 'Informations\nPersonnelles' },
  { number: 2, label: 'Détails du\nlogement' },
  { number: 3, label: 'Documents &\nConfirmation' },
]

export function LogementSuccessScreen({ onGoToDemandes }: LogementSuccessScreenProps): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.4s ease' }}>
      {/* Stepper with all steps completed */}
      <AVIStepper steps={stepper} current={4} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        paddingTop: 24,
        paddingBottom: 40,
      }}>
        {/* Success icon */}
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #34D399, #10B981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(16,185,129,0.35)',
          animation: 'fadeIn 0.5s ease',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.3rem',
            color: '#374151',
            lineHeight: 1.35,
            margin: 0,
          }}>
            Demande envoyé<br />avec succès
          </h2>
        </div>

        {/* CTA button */}
        <button
          onClick={onGoToDemandes}
          style={{
            padding: '13px 36px',
            borderRadius: 10,
            border: 'none',
            background: '#2563EB',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 16px rgba(37,99,235,0.35)',
            marginTop: 8,
          }}
        >
          Aller à mes demandes
        </button>
      </div>
    </div>
  )
}