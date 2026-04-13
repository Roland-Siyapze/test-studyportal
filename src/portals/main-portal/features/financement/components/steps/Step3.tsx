import type { JSX } from 'react'
import { InputField, Stepper, NavButtons, getSelectStyle } from '../ui'

interface FormData {
  serviceAFinancer: string
  coutService: string
  financementMaximal: string
  sommeDemandee: string
  fraisFinancement: string
  sommeTotaleARembourser: string
}

interface Step3Props {
  data: FormData
  onChange: (key: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

const STEPS_META = [
  { label: 'Mes\ninformations' },
  { label: 'Identité' },
  { label: 'Détails du\nfinancement' },
]

const SERVICES = ['A.V.I', 'Attestation de logement', 'Assurance', 'Autre']

export function Step3({ data, onChange, onNext, onBack }: Step3Props): JSX.Element {
  const frais = data.sommeDemandee ? (parseFloat(data.sommeDemandee) * 0.05).toFixed(0) : ''
  const total = data.sommeDemandee && frais ? (parseFloat(data.sommeDemandee) + parseFloat(frais)).toFixed(0) : ''

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Stepper</p>
      <Stepper steps={STEPS_META} currentStep={3} totalVisibleSteps={3} startStep={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Choisissez le service à financer
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={data.serviceAFinancer}
              onChange={e => { onChange('serviceAFinancer', e.target.value); }}
              style={{ ...getSelectStyle(), paddingRight: 40 }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2563EB' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2' }}
            >
              <option value="">Sélectionner...</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>

        <InputField
          label="Coût du service choisi"
          value={data.coutService}
          onChange={v => { onChange('coutService', v); }}
          placeholder="xxxxxx XAF"
          disabled
        />
        <InputField
          label="Financement maximal possible"
          value={data.financementMaximal}
          onChange={v => { onChange('financementMaximal', v); }}
          placeholder="Exemple: 700€"
        />
      </div>

      <div style={{
        border: '1px solid #E5E9F2',
        borderRadius: 12,
        padding: '20px 24px',
        background: '#FAFBFE',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px 28px',
      }}>
        <InputField
          label="De qu'elle somme avez-vous besoin ?"
          value={data.sommeDemandee}
          onChange={v => {
            onChange('sommeDemandee', v)
            onChange('fraisFinancement', v ? (parseFloat(v) * 0.05).toFixed(0) : '')
            onChange('sommeTotaleARembourser', v ? (parseFloat(v) * 1.05).toFixed(0) : '')
          }}
          placeholder=""
          suffix="XAF"
        />
        <InputField
          label="Frais de financements"
          value={data.fraisFinancement || frais}
          onChange={v => { onChange('fraisFinancement', v); }}
          placeholder=""
          suffix="XAF"
          disabled
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <InputField
            label="Somme totale à remboursement"
            value={data.sommeTotaleARembourser || total}
            onChange={v => { onChange('sommeTotaleARembourser', v); }}
            placeholder=""
            suffix="XAF"
            disabled
          />
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}