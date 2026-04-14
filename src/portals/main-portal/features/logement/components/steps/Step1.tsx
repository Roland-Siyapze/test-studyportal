import type { JSX } from 'react'
import { NavButtons, Label, inputStyle, addFocus, removeFocus } from '../ui'
import { AVIStepper } from '../../../avi/AVIStepper'

export interface LogementStep1Data {
  prenom: string
  nom: string
  email: string
  telephone: string
  passportNumber: string
  passportDelivery: string
  passportExpiry: string
  passportScanName: string
}

export interface LogementStep1Props {
  data: LogementStep1Data
  onChange: (key: keyof LogementStep1Data, value: string) => void
  onNext: () => void
  onCancel: () => void
  canEdit: boolean
}

const stepper = [
  { number: 1, label: 'Informations\nPersonnelles' },
  { number: 2, label: 'Détails du\nlogement' },
  { number: 3, label: 'Documents &\nConfirmation' },
]

export function LogementStep1({
  data,
  onChange,
  onNext,
  onCancel,
  canEdit,
}: LogementStep1Props): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <AVIStepper steps={stepper} current={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px' }}>
        {/* Prénom */}
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            value={data.prenom}
            readOnly={!canEdit}
            onChange={e => { canEdit && onChange('prenom', e.target.value) }}
            placeholder="Prénom"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Numéro de passeport */}
        <div>
          <input
            style={inputStyle}
            value={data.passportNumber}
            readOnly={!canEdit}
            onChange={e => { canEdit && onChange('passportNumber', e.target.value) }}
            placeholder="Numéro de passeport"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Nom */}
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            value={data.nom}
            readOnly={!canEdit}
            onChange={e => { canEdit && onChange('nom', e.target.value) }}
            placeholder="Nom"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Date de délivrance du passeport */}
        <div>
          <Label text="Date de délivrance du passeport" />
          <input
            type="date"
            style={inputStyle}
            value={data.passportDelivery}
            readOnly={!canEdit}
            onChange={e => { canEdit && onChange('passportDelivery', e.target.value) }}
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Email */}
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            type="email"
            value={data.email}
            readOnly={!canEdit}
            onChange={e => { canEdit && onChange('email', e.target.value) }}
            placeholder="Adresse e-mail"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Date d'expiration du passeport */}
        <div>
          <Label text="Date d'expiration du passeport" />
          <input
            type="date"
            style={inputStyle}
            value={data.passportExpiry}
            readOnly={!canEdit}
            onChange={e => { canEdit && onChange('passportExpiry', e.target.value) }}
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Numéro de téléphone */}
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
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={data.telephone}
              readOnly={!canEdit}
              onChange={e => { canEdit && onChange('telephone', e.target.value) }}
              placeholder="6XX XXX XXX"
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
        </div>

        {/* Scan du passeport */}
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
                  if (f) onChange('passportScanName', f.name)
                }
                input.click()
              }}
              style={{
                padding: '11px 16px',
                borderRadius: 10,
                border: '1.5px solid #E5E9F2',
                background: canEdit ? '#E5E7EB' : '#F1F5F9',
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
            <span style={{
              fontSize: '0.8rem',
              color: data.passportScanName ? '#1A2332' : '#94A3B8',
              fontFamily: 'var(--font-body)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {data.passportScanName || 'Aucun fichier sélectionné'}
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