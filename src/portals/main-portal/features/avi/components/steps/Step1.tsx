import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons, Label, inputStyle, addFocus, removeFocus } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step1Props {
  onNext: () => void
  onCancel: () => void
  canEdit: boolean
}

export function Step1({ onNext, onCancel, canEdit }: Step1Props): JSX.Element {
  const [firstName, setFirstName] = useState('Moni')
  const [lastName, setLastName] = useState('Roy')
  const [email, setEmail] = useState('Moniroy22@mail.com')
  const [phone, setPhone] = useState('696418984')
  const [passportNumber, setPassportNumber] = useState('')
  const [passportDelivery, setPassportDelivery] = useState('')
  const [passportExpiry, setPassportExpiry] = useState('')
  const [fileName, setFileName] = useState('Aucun fichier sélectionné')

  const stepper = [
    { number: 1, label: 'Informations\nPersonnelles' },
    { number: 2, label: 'Détails de\nla Formation' },
    { number: 3, label: 'Informations Financières\net Autres Détails' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px' }}>
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            value={firstName}
            readOnly={!canEdit}
            onChange={e => { canEdit && setFirstName(e.target.value) }}
            placeholder="Prénom"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <input
            style={inputStyle}
            value={passportNumber}
            readOnly={!canEdit}
            onChange={e => { canEdit && setPassportNumber(e.target.value) }}
            placeholder="Numéro de passeport"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            value={lastName}
            readOnly={!canEdit}
            onChange={e => { canEdit && setLastName(e.target.value) }}
            placeholder="Nom"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <Label text="Date de délivrance du passeport" />
          <input
            type="date"
            style={inputStyle}
            value={passportDelivery}
            readOnly={!canEdit}
            onChange={e => { canEdit && setPassportDelivery(e.target.value) }}
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            type="email"
            value={email}
            readOnly={!canEdit}
            onChange={e => { canEdit && setEmail(e.target.value) }}
            placeholder="Email"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <Label text="Date d'expiration du passeport" />
          <input
            type="date"
            style={inputStyle}
            value={passportExpiry}
            readOnly={!canEdit}
            onChange={e => { canEdit && setPassportExpiry(e.target.value) }}
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        <div>
          <Label text="Numéro de téléphone" />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 14px',
              border: '1.5px solid #E5E9F2',
              borderRadius: 10,
              background: '#F8FAFC',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              color: '#374151',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              🇨🇲 +237
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={phone}
              readOnly={!canEdit}
              onChange={e => { canEdit && setPhone(e.target.value) }}
              placeholder="6XX XXX XXX"
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
        </div>

        <div>
          <Label text="Scan du passeport" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf,.jpg,.png'
                input.onchange = (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0]
                  if (f) setFileName(f.name)
                }
                input.click()
              }}
              style={{
                padding: '11px 16px',
                borderRadius: 10,
                border: '1.5px solid #E5E9F2',
                background: canEdit ? '#fff' : '#F1F5F9',
                color: '#374151',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: canEdit ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
              }}
            >
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName}
            </span>
          </div>
        </div>
      </div>

      <NavButtons
        onBack={onCancel}
        backLabel="Annuler"
        onNext={canEdit ? onNext : undefined}
        nextLabel="Suivant"
      />
    </div>
  )
}
