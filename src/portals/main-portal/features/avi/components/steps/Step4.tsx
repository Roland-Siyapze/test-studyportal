import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step4Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}

export function Step4({ onNext, onBack, canEdit }: Step4Props): JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null)

  const options = [
    { id: 'depot', label: 'Dépôt Bancaire', description: null },
    { id: 'virement', label: 'Virement Bancaire Direct', description: null },
  ]

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={4} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Sélectionnez votre mode de paiement
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
        {options.map(opt => (
          <div key={opt.id}>
            <button
              onClick={() => { if (canEdit) setExpanded(expanded === opt.id ? null : opt.id) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderRadius: 12,
                border: `1.5px solid ${expanded === opt.id ? '#2A4F87' : '#E5E9F2'}`,
                background: expanded === opt.id ? '#EBF0FA' : '#fff',
                cursor: canEdit ? 'pointer' : 'default',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A2332',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"
                style={{ transition: 'transform 0.2s', transform: expanded === opt.id ? 'rotate(180deg)' : 'none' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit ? onNext : undefined} />
    </div>
  )
}
