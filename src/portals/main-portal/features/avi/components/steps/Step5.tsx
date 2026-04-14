import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step5Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}

const PAYMENT_OPTIONS = [
  { id: 'paiement-total', label: 'Paiement total', description: 'Choisissez cette option si vous souhaitez payer la totalité des frais.' },
  { id: 'paiement-financement', label: 'Paiement par financement', description: 'Choisissez cette option si vous avez souscrit à un financement.' },
]

export function Step5({ onNext, onBack, canEdit }: Step5Props): JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  function toggle(id: string): void {
    if (!canEdit) return
    if (expanded === id) {
      setExpanded(null)
    } else {
      setExpanded(id)
      setSelected(id)
    }
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Content</p>
      <AVIStepper steps={stepper} current={5} />

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#1A2332', textAlign: 'center', marginBottom: 32 }}>
        Sélectionnez votre mode de paiement
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
        {PAYMENT_OPTIONS.map(opt => (
          <div key={opt.id}>
            <button
              onClick={() => { toggle(opt.id) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderRadius: expanded === opt.id ? '12px 12px 0 0' : 12,
                border: `1.5px solid ${expanded === opt.id ? '#2563EB' : '#D1D5DB'}`,
                borderBottom: expanded === opt.id ? 'none' : undefined,
                background: '#fff',
                cursor: canEdit ? 'pointer' : 'default',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A2332',
              }}
            >
              {opt.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" style={{ transition: 'transform 0.2s', transform: expanded === opt.id ? 'rotate(180deg)' : 'none' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {expanded === opt.id && (
              <div style={{ padding: '14px 20px', background: '#F8FAFC', border: '1.5px solid #2A4F87', borderTop: 'none', borderRadius: '0 0 12px 12px' }}>
                <p style={{ fontSize: '0.85rem', color: '#2A4F87', fontStyle: 'italic', fontFamily: 'var(--font-body)', textAlign: 'center', lineHeight: 1.5 }}>
                  {opt.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit && selected ? onNext : undefined} nextDisabled={!selected} />
    </div>
  )
}
