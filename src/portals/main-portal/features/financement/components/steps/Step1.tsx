import type { JSX } from 'react'
import { InputField, FilePickerField, Stepper, NavButtons } from '../ui'

interface FormData {
  prenom: string
  nom: string
  lieuNaissance: string
  dateNaissance: string
  adresseComplete: string
  pays: string
  ville: string
  quartier: string
  telephone: string
  scanPasseportName: string
  planLocalisationName: string
}

interface Step1Props {
  data: FormData
  onChange: (key: keyof FormData, value: string) => void
  onNext: () => void
  onCancel: () => void
}

const STEPS_META = [
  { label: 'Informations\nPersonnelles' },
  { label: 'Identités' },
  { label: 'Informations\nFinancières\net Autres Détails' },
]

export function Step1({ data, onChange, onNext, onCancel }: Step1Props): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={1} totalVisibleSteps={3} startStep={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px' }}>
        <InputField
          value={data.prenom}
          onChange={v => { onChange('prenom', v); }}
          placeholder="Moni"
        />
        <InputField
          value={data.nom}
          onChange={v => { onChange('nom', v); }}
          placeholder="Roy"
        />

        <InputField
          label="Lieu de naissance"
          value={data.lieuNaissance}
          onChange={v => { onChange('lieuNaissance', v); }}
          placeholder="Moncton"
        />
        <InputField
          label="Date de naissance"
          type="date"
          value={data.dateNaissance}
          onChange={v => { onChange('dateNaissance', v); }}
          placeholder="jj/mm/aa"
        />

        <InputField
          label="Adresse complète"
          value={data.adresseComplete}
          onChange={v => { onChange('adresseComplete', v); }}
          placeholder="Moncton"
        />
        <InputField
          label="Pays"
          value={data.pays}
          onChange={v => { onChange('pays', v); }}
          placeholder="Moncton"
        />

        <InputField
          label="Ville"
          value={data.ville}
          onChange={v => { onChange('ville', v); }}
          placeholder="Moncton"
        />
        <InputField
          label="Quartier"
          value={data.quartier}
          onChange={v => { onChange('quartier', v); }}
          placeholder="Riverview"
        />

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Numéro de téléphone
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 12px',
              border: '1px solid #E5E9F2', borderRadius: 8,
              background: '#F8FAFC', fontSize: '0.88rem', fontFamily: 'var(--font-body)',
              color: '#374151', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              🇨🇲 +237
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <input
              value={data.telephone}
              onChange={e => { onChange('telephone', e.target.value); }}
              placeholder="696418984"
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #E5E9F2', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: '#1A2332', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.background = '#F8FAFC' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Plan de localisation
          </label>
          <FilePickerField
            label="Plan de localisation"
            fileName={data.planLocalisationName}
            onPick={name => { onChange('planLocalisationName', name); }}
          />
        </div>
      </div>

      <NavButtons onBack={onCancel} onNext={onNext} backLabel="Annuler" />
    </div>
  )
}