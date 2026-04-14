import type { JSX } from 'react'
import { NavButtons, Label, inputStyle, addFocus, removeFocus } from '../ui'
import { AVIStepper } from '../../../avi/AVIStepper'

export interface LogementStep3Data {
  montantLoyer: string
  dureeContrat: string
  garant: string
  justificatifRevenuName: string
  contratLogementName: string
  photoLogementName: string
  commentaires: string
}

export interface LogementStep3Props {
  data: LogementStep3Data
  onChange: (key: keyof LogementStep3Data, value: string) => void
  onBack: () => void
  onSubmit: () => void
  canEdit: boolean
}

const stepper = [
  { number: 1, label: 'Informations\nPersonnelles' },
  { number: 2, label: 'Détails du\nlogement' },
  { number: 3, label: 'Documents &\nConfirmation' },
]

const DUREE_OPTIONS = ['6 mois', '12 mois', '18 mois', '24 mois', 'Indéterminée']
const GARANT_OPTIONS = ['Parents / Famille', 'Garant français (VISALE)', 'Établissement', 'Aucun', 'Autre']

export function LogementStep3({
  data,
  onChange,
  onBack,
  onSubmit,
  canEdit,
}: LogementStep3Props): JSX.Element {
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    cursor: canEdit ? 'pointer' : 'not-allowed',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
  }

  function pickFile(key: keyof LogementStep3Data): void {
    if (!canEdit) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf,.jpg,.png,.docx'
    input.onchange = (ev) => {
      const f = (ev.target as HTMLInputElement).files?.[0]
      if (f) onChange(key, f.name)
    }
    input.click()
  }

  const fileButtonStyle: React.CSSProperties = {
    padding: '11px 16px',
    borderRadius: 10,
    border: '1.5px solid #E5E9F2',
    background: canEdit ? '#E5E7EB' : '#F1F5F9',
    color: '#374151',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: canEdit ? 'pointer' : 'not-allowed',
    fontFamily: 'var(--font-body)',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <AVIStepper steps={stepper} current={3} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', maxWidth: 640, margin: '0 auto' }}>
        {/* Montant du loyer */}
        <div>
          <Label text="Montant du loyer mensuel" />
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inputStyle, paddingRight: 52 }}
              value={data.montantLoyer}
              readOnly={!canEdit}
              onChange={e => { if (canEdit) onChange('montantLoyer', e.target.value); }}
              placeholder="Exemple: 500"
              onFocus={addFocus}
              onBlur={removeFocus}
            />
            <span style={{
              position: 'absolute', right: 14, top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.82rem', color: '#94A3B8',
              fontFamily: 'var(--font-body)',
              pointerEvents: 'none',
            }}>EUR</span>
          </div>
        </div>

        {/* Durée du contrat */}
        <div>
          <Label text="Durée du contrat" />
          <div style={{ position: 'relative' }}>
            <select
              style={selectStyle}
              value={data.dureeContrat}
              disabled={!canEdit}
              onChange={e => { if (canEdit) onChange('dureeContrat', e.target.value); }}
              onFocus={addFocus}
              onBlur={removeFocus}
            >
              <option value="">Sélectionner...</option>
              {DUREE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Garant */}
        <div>
          <Label text="Type de garant" />
          <div style={{ position: 'relative' }}>
            <select
              style={selectStyle}
              value={data.garant}
              disabled={!canEdit}
              onChange={e => { if (canEdit) onChange('garant', e.target.value); }}
              onFocus={addFocus}
              onBlur={removeFocus}
            >
              <option value="">Sélectionner...</option>
              {GARANT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Justificatif de revenu */}
        <div>
          <Label text="Justificatif de revenu (garant)" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={!canEdit} onClick={() => { pickFile('justificatifRevenuName') }} style={fileButtonStyle}>
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.78rem', color: data.justificatifRevenuName ? '#1A2332' : '#94A3B8', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.justificatifRevenuName || 'Aucun fichier'}
            </span>
          </div>
        </div>

        {/* Contrat de logement */}
        <div>
          <Label text="Contrat de logement (si disponible)" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={!canEdit} onClick={() => { pickFile('contratLogementName') }} style={fileButtonStyle}>
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.78rem', color: data.contratLogementName ? '#1A2332' : '#94A3B8', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.contratLogementName || 'Aucun fichier'}
            </span>
          </div>
        </div>

        {/* Photo du logement */}
        <div>
          <Label text="Photo du logement (optionnel)" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button disabled={!canEdit} onClick={() => { pickFile('photoLogementName') }} style={fileButtonStyle}>
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.78rem', color: data.photoLogementName ? '#1A2332' : '#94A3B8', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data.photoLogementName || 'Aucun fichier'}
            </span>
          </div>
        </div>

        {/* Commentaires - full width */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Label text="Commentaires ou informations complémentaires" />
          <textarea
            value={data.commentaires}
            readOnly={!canEdit}
            onChange={e => { if (canEdit) onChange('commentaires', e.target.value); }}
            placeholder="Informations supplémentaires sur votre situation de logement..."
            rows={4}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: 100,
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#2A4F87'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.12)'
              e.currentTarget.style.background = '#fff'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#E5E9F2'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.background = '#F8FAFC'
            }}
          />
        </div>
      </div>

      <NavButtons
        onBack={onBack}
        onNext={canEdit ? onSubmit : undefined}
        nextLabel="Envoyer"
      />
    </div>
  )
}