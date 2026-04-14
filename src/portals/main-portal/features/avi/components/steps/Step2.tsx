import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons, Label, inputStyle, addFocus, removeFocus } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step2Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}

export function Step2({ onNext, onBack, canEdit }: Step2Props): JSX.Element {
  const [etablissement, setEtablissement] = useState('')
  const [formation, setFormation] = useState('')
  const [ville, setVille] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [fileName, setFileName] = useState('Aucun fichier sélectionné')

  const stepper = [
    { number: 1, label: 'Mes informations' },
    { number: 2, label: 'Détails de la formation' },
    { number: 3, label: 'Payment info\nLorem Ipsum is simply' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={2} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, margin: '0 auto' }}>
        <input style={inputStyle} value={etablissement} readOnly={!canEdit}
          onChange={e => { if (canEdit) setEtablissement(e.target.value); }}
          placeholder="Nom de l'établissement d'accueil"
          onFocus={addFocus} onBlur={removeFocus}
        />
        <input style={inputStyle} value={formation} readOnly={!canEdit}
          onChange={e => { if (canEdit) setFormation(e.target.value); }}
          placeholder="Titre de la formation"
          onFocus={addFocus} onBlur={removeFocus}
        />
        <input style={inputStyle} value={ville} readOnly={!canEdit}
          onChange={e => { if (canEdit) setVille(e.target.value); }}
          placeholder="Ville"
          onFocus={addFocus} onBlur={removeFocus}
        />
        <div>
          <Label text="Date de début de la formation" />
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              style={inputStyle}
              value={dateDebut}
              readOnly={!canEdit}
              onChange={e => { if (canEdit) setDateDebut(e.target.value); }}
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
        </div>
        <div>
          <Label text="Attestation d'inscription / Lettre d'admission" />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return
                const input = document.createElement('input')
                input.type = 'file'
                input.onchange = (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0]
                  if (f) setFileName(f.name)
                }
                input.click()
              }}
              style={{
                padding: '11px 16px',
                borderRadius: 10,
                border: '1.5px solid #D1D5DB',
                background: canEdit ? '#fff' : '#F1F5F9',
                color: '#374151',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: canEdit ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)',
              }}
            >
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{fileName}</span>
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={canEdit ? onNext : undefined} />
    </div>
  )
}
