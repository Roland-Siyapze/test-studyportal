import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'
import societeGeneraleImg from '@assets/societe-generale.png'
import atlantiqueImg from '@assets/atlantiquebanque.png'

export interface Step6Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
  onBankSelected: (bank: string) => void
}

const BANKS = [
  { id: 'societe-generale', name: 'Société Générale', logo: <img src={societeGeneraleImg} alt="Société Générale" style={{ height: 85 }} /> },
  { id: 'banque-atlantique', name: 'Banque Atlantique', logo: <img src={atlantiqueImg} alt="Banque Atlantique" style={{ height: 70 }} /> },
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
              padding: '5px',
              borderRadius: 12,
              border: `2px solid ${selectedBank === bank.id ? '#2563EB' : '#D1D5DB'}`,
              background: selectedBank === bank.id ? '#EFF6FF' : '#fff',
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
