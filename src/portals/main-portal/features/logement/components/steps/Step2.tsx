import type { JSX } from 'react'
import { NavButtons, Label, inputStyle, addFocus, removeFocus } from '../ui'
import { AVIStepper } from '../../../avi/AVIStepper'

export interface LogementStep2Data {
  etablissement: string
  formation: string
  ville: string
  dateArrivee: string
  dateDepart: string
  typeLogement: string
  adresseLogement: string
  codePostal: string
  lettreAdmissionName: string
}

export interface LogementStep2Props {
  data: LogementStep2Data
  onChange: (key: keyof LogementStep2Data, value: string) => void
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}

const stepper = [
  { number: 1, label: 'Informations\nPersonnelles' },
  { number: 2, label: 'Détails du\nlogement' },
  { number: 3, label: 'Documents &\nConfirmation' },
]

const TYPE_LOGEMENT_OPTIONS = [
  'Résidence universitaire',
  'Appartement privé',
  'Famille d\'accueil',
  'Foyer étudiant',
  'Autre',
]

export function LogementStep2({
  data,
  onChange,
  onNext,
  onBack,
  canEdit,
}: LogementStep2Props): JSX.Element {
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none',
    cursor: canEdit ? 'pointer' : 'not-allowed',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
  }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <AVIStepper steps={stepper} current={2} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 560, margin: '0 auto' }}>
        {/* Nom de l'établissement */}
        <input
          style={inputStyle}
          value={data.etablissement}
          readOnly={!canEdit}
          onChange={e => { canEdit && onChange('etablissement', e.target.value) }}
          placeholder="Nom de l'établissement d'accueil"
          onFocus={addFocus}
          onBlur={removeFocus}
        />

        {/* Titre de la formation */}
        <input
          style={inputStyle}
          value={data.formation}
          readOnly={!canEdit}
          onChange={e => { canEdit && onChange('formation', e.target.value) }}
          placeholder="Titre de la formation"
          onFocus={addFocus}
          onBlur={removeFocus}
        />

        {/* Ville */}
        <input
          style={inputStyle}
          value={data.ville}
          readOnly={!canEdit}
          onChange={e => { canEdit && onChange('ville', e.target.value) }}
          placeholder="Ville"
          onFocus={addFocus}
          onBlur={removeFocus}
        />

        {/* Type de logement */}
        <div>
          <Label text="Type de logement" />
          <div style={{ position: 'relative' }}>
            <select
              style={selectStyle}
              value={data.typeLogement}
              disabled={!canEdit}
              onChange={e => { canEdit && onChange('typeLogement', e.target.value) }}
              onFocus={addFocus}
              onBlur={removeFocus}
            >
              <option value="">Sélectionner un type...</option>
              {TYPE_LOGEMENT_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Adresse du logement */}
        <input
          style={inputStyle}
          value={data.adresseLogement}
          readOnly={!canEdit}
          onChange={e => { canEdit && onChange('adresseLogement', e.target.value) }}
          placeholder="Adresse du logement"
          onFocus={addFocus}
          onBlur={removeFocus}
        />

        {/* Code postal */}
        <input
          style={inputStyle}
          value={data.codePostal}
          readOnly={!canEdit}
          onChange={e => { canEdit && onChange('codePostal', e.target.value) }}
          placeholder="Code postal"
          onFocus={addFocus}
          onBlur={removeFocus}
        />

        {/* Dates */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
          <div>
            <Label text="Date d'arrivée prévue" />
            <input
              type="date"
              style={inputStyle}
              value={data.dateArrivee}
              readOnly={!canEdit}
              onChange={e => { canEdit && onChange('dateArrivee', e.target.value) }}
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
          <div>
            <Label text="Date de départ prévue" />
            <input
              type="date"
              style={inputStyle}
              value={data.dateDepart}
              readOnly={!canEdit}
              onChange={e => { canEdit && onChange('dateDepart', e.target.value) }}
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
        </div>

        {/* Lettre d'admission */}
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
                  if (f) onChange('lettreAdmissionName', f.name)
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
              color: data.lettreAdmissionName ? '#1A2332' : '#94A3B8',
              fontFamily: 'var(--font-body)',
            }}>
              {data.lettreAdmissionName || 'Aucun fichier sélectionné'}
            </span>
          </div>
        </div>
      </div>

      <NavButtons
        onBack={onBack}
        onNext={canEdit ? onNext : undefined}
        nextLabel="Suivant"
      />
    </div>
  )
}