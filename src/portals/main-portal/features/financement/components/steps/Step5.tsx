import type { JSX } from 'react'
import { Stepper, NavButtons } from '../ui'

interface JustificatifItem {
  id: string
  nom: string
}

interface FormData {
  justification: string
  justificatifs: JustificatifItem[]
}

interface Step5Props {
  data: FormData
  onChangeJustification: (v: string) => void
  onChangeJustificatifs: (items: JustificatifItem[]) => void
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

const MAX_CHARS = 5000

export function Step5({ data, onChangeJustification, onChangeJustificatifs, onNext, onBack }: Step5Props): JSX.Element {
  function addJustificatif(): void {
    const i = document.createElement('input')
    i.type = 'file'
    i.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]
      if (f) {
        onChangeJustificatifs([...data.justificatifs, { id: `j-${Date.now()}`, nom: f.name }])
      }
    }
    i.click()
  }

  function removeJustificatif(id: string): void {
    onChangeJustificatifs(data.justificatifs.filter(j => j.id !== id))
  }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Content</p>
      <Stepper steps={STEPS_META} currentStep={5} totalVisibleSteps={3} startStep={4} />

      <p style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
        Expliquez votre situation, et dites pourquoi vous sollicitez un financement
      </p>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <textarea
          value={data.justification}
          onChange={e => { if (e.target.value.length <= MAX_CHARS) onChangeJustification(e.target.value) }}
          rows={8}
          style={{
            width: '100%',
            padding: '16px',
            border: '1px solid #E5E9F2',
            borderRadius: 10,
            fontSize: '0.88rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
            background: '#F8FAFC',
            color: '#1A2332',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#fff' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.background = '#F8FAFC' }}
        />
        <span style={{ position: 'absolute', bottom: 10, right: 14, fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
          {data.justification.length}/{MAX_CHARS}
        </span>
      </div>

      <div style={{ border: '1px solid #E5E9F2', borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <button
            onClick={addJustificatif}
            style={{
              padding: '10px 28px',
              borderRadius: 8,
              border: 'none',
              background: '#428959',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Ajouter un justificatif
          </button>
        </div>

        {data.justificatifs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.justificatifs.map(j => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #F18F01',
                }}>
                  <div style={{
                    background: '#F18F01',
                    color: '#fff',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {j.nom}
                  </div>
                  <div style={{ flex: 1, height: 10, background: '#FFF4E0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: '#F18F01', opacity: 0.3 }} />
                  </div>
                </div>
                <button
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, color: '#F18F01' }}
                  title="Renommer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button
                  onClick={() => { removeJustificatif(j.id); }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, color: '#C73E1D' }}
                  title="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}