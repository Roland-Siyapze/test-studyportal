import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step6Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
  onBankSelected: (bank: string) => void
}

const BANKS = [
  { id: 'societe-generale', name: 'Société Générale', logo: <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 28, height: 20, background: '#CC0000', borderRadius: 2 }} /><span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#CC0000', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>SOCIETE<br/>GENERALE</span></div> },
  { id: 'banque-atlantique', name: 'Banque Atlantique', logo: <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg></div><span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#F59E0B', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>BANQUE<br/>ATLANTIQUE</span></div> },
]

export function Step6({ onNext, onBack, canEdit, onBankSelected }: Step6Props): JSX.Element {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  function selectBank(id: string): void {
    if (!canEdit) return
    setSelectedBank(id)
    onBankSelected(id)
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={6} />

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#1A2332', textAlign: 'center', marginBottom: 32 }}>
        Choix de l'établissement bancaire
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440, margin: '0 auto' }}>
        {BANKS.map(bank => (
          <button
            key={bank.id}
            onClick={() => { selectBank(bank.id) }}
            style={{
              padding: '20px 28px',
              borderRadius: 12,
              border: `2px solid ${selectedBank === bank.id ? '#2A4F87' : '#E5E9F2'}`,
              background: selectedBank === bank.id ? '#EBF0FA' : '#fff',
              cursor: canEdit ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              boxShadow: selectedBank === bank.id ? '0 4px 12px rgba(42,79,135,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {bank.logo}
          </button>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit && selectedBank ? onNext : undefined} nextLabel="Envoyer" nextDisabled={!selectedBank} />
    </div>
  )
}
