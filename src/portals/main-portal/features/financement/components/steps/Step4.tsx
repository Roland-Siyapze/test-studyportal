import type { JSX } from 'react'
import { InputField, Stepper, NavButtons } from '../ui'

interface EcheanceItem {
  id: string
  date: string
  somme: string
}

interface FormData {
  nombreEcheances: number
  echeances: EcheanceItem[]
}

interface Step4Props {
  data: FormData
  onChangeEcheances: (echeances: EcheanceItem[]) => void
  onChangeNombre: (n: number) => void
  onNext: () => void
  onBack: () => void
}

const STEPS_META = [
  { label: 'Informations\nPersonnelles' },
  { label: 'Identité' },
  { label: 'Détails du\nfinancement' },
  { label: 'Échéancier' },
  { label: 'Justificatifs de demande\nde financement' },
  { label: 'Marche à suivre' },
]

export function Step4({ data, onChangeEcheances, onChangeNombre, onNext, onBack }: Step4Props): JSX.Element {
  function handleNombreChange(n: number): void {
    onChangeNombre(n)
    const current = data.echeances
    if (n > current.length) {
      const added = Array.from({ length: n - current.length }, (_, i) => ({
        id: `ech-${Date.now()}-${i}`,
        date: '',
        somme: '',
      }))
      onChangeEcheances([...current, ...added])
    } else {
      onChangeEcheances(current.slice(0, n))
    }
  }

  function updateEcheance(idx: number, field: 'date' | 'somme', value: string): void {
    const updated = data.echeances.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    onChangeEcheances(updated)
  }

  const echeanceLabels: Record<number, string> = { 0: '1', 1: '2', 2: 'x' }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={4} totalVisibleSteps={3} startStep={4} />

      <div style={{ marginBottom: 28, maxWidth: 240, margin: '15px auto' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: '#374151', marginBottom: 8, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          Choisissez le nombre d'échéances
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            min={1}
            max={12}
            value={data.nombreEcheances}
            onChange={e => { handleNombreChange(parseInt(e.target.value) || 1); }}
            style={{ width: '100%', padding: '12px 16px', paddingRight: 36, border: '1px solid #E5E9F2', borderRadius: 8, fontSize: '0.9rem', fontFamily: 'var(--font-body)', color: '#1A2332', background: '#F8FAFC', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#2563EB' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2' }}
          />
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <button onClick={() => { handleNombreChange(Math.min(12, data.nombreEcheances + 1)); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', lineHeight: 1, padding: 0 }}>▲</button>
            <button onClick={() => { handleNombreChange(Math.max(1, data.nombreEcheances - 1)); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', lineHeight: 1, padding: 0 }}>▼</button>
          </div>
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '1rem', color: '#1A2332', textAlign: 'center', marginBottom: 20 }}>
        Veuillez renseigner les différentes dates
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.echeances.map((ech, idx) => (
          <div key={ech.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
            <InputField
              label={`Échéance ${echeanceLabels[idx] ?? idx + 1}`}
              type="date"
              value={ech.date}
              onChange={v => { updateEcheance(idx, 'date', v); }}
              placeholder="jj/mm/aa"
            />
            <InputField
              label="Somme à verser"
              value={ech.somme}
              onChange={v => { updateEcheance(idx, 'somme', v); }}
              placeholder=""
              suffix="XAF"
            />
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}