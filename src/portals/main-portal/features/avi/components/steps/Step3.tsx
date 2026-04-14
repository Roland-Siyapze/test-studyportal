import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons, Label, inputStyle, addFocus, removeFocus, getSelectStyle } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step3Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}

export function Step3({ onNext, onBack, canEdit }: Step3Props): JSX.Element {
  const [annee, setAnnee] = useState('2024/2025')
  const [renouvellement, setRenouvellement] = useState('Non')
  const [montant, setMontant] = useState('')
  const [destination, setDestination] = useState('Etudes')
  const [devise, setDevise] = useState('FCFA')
  const [assurance, setAssurance] = useState('Oui')
  const [duree, setDuree] = useState('12 mois')

  const stepper = [
    { number: 1, label: 'Mes informations' },
    { number: 2, label: 'Détails de la formation' },
    { number: 3, label: 'Informations Financières\net Autres Détails' },
  ]

  const selectStyle = getSelectStyle(canEdit)

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={3} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', maxWidth: 640, margin: '0 auto' }}>
        <div>
          <Label text="Année scolaire" />
          <select style={selectStyle} value={annee} disabled={!canEdit} onChange={e => { canEdit && setAnnee(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>2024/2025</option>
            <option>2025/2026</option>
            <option>2023/2024</option>
          </select>
        </div>
        <div>
          <Label text="Est ce un renouvellement ?" />
          <select style={selectStyle} value={renouvellement} disabled={!canEdit} onChange={e => { canEdit && setRenouvellement(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>Non</option>
            <option>Oui</option>
          </select>
        </div>
        <div>
          <Label text="Montant à recevoir par mois en euro" />
          <input style={inputStyle} value={montant} readOnly={!canEdit}
            onChange={e => { if (canEdit) setMontant(e.target.value); }}
            placeholder="Exemple: 700€"
            onFocus={addFocus} onBlur={removeFocus}
          />
        </div>
        <div>
          <Label text="Je vais en France pour" />
          <select style={selectStyle} value={destination} disabled={!canEdit} onChange={e => { canEdit && setDestination(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>Etudes</option>
            <option>Stage</option>
            <option>Formation professionnelle</option>
          </select>
        </div>
        <div>
          <Label text="Devise de votre pays d'origine" />
          <select style={selectStyle} value={devise} disabled={!canEdit} onChange={e => { canEdit && setDevise(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>FCFA</option>
            <option>EUR</option>
            <option>USD</option>
          </select>
        </div>
        <div>
          <Label text="ACS Assurance France" />
          <select style={selectStyle} value={assurance} disabled={!canEdit} onChange={e => { canEdit && setAssurance(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>Oui</option>
            <option>Non</option>
          </select>
        </div>
        <div>
          <Label text="Durée de l'AVI" />
          <select style={selectStyle} value={duree} disabled={!canEdit} onChange={e => { canEdit && setDuree(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>12 mois</option>
            <option>6 mois</option>
            <option>24 mois</option>
          </select>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={canEdit ? onNext : undefined} />
    </div>
  )
}
