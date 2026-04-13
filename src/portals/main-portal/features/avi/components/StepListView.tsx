import type { JSX } from 'react'

export interface AVIStep {
  number: number
  title: string
  status: 'done' | 'current' | 'upcoming'
}

export interface StepListViewProps {
  steps: AVIStep[]
  onStart: () => void
  onStepSelect: (n: number) => void
  canEdit: boolean
}

export function StepListView({ steps, onStart, onStepSelect, canEdit }: StepListViewProps): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#1A2332', textAlign: 'center', marginBottom: 28 }}>
        Parcours à suivre
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 600, margin: '0 auto' }}>
        {steps.map((step) => {
          const isCurrent = step.status === 'current'
          const isDone = step.status === 'done'

          return (
            <div key={step.number}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: isCurrent ? '12px 12px 0 0' : 12,
                background: isCurrent ? '#EBF0FA' : '#fff',
                border: `1px solid ${isCurrent ? '#2A4F87' : isDone ? '#86EFAC' : '#E5E9F2'}`,
                borderBottom: isCurrent ? 'none' : undefined,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isDone ? '#428959' : isCurrent ? '#2A4F87' : '#fff',
                  border: isDone || isCurrent ? 'none' : '2px solid #E5E9F2',
                  color: isDone || isCurrent ? '#fff' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                }}>
                  {isDone ? '✓' : String(step.number).padStart(2, '0')}
                </div>

                <p style={{ flex: 1, fontWeight: isCurrent ? 700 : 500, fontSize: '0.92rem', color: isCurrent ? '#2A4F87' : '#374151', fontFamily: 'var(--font-body)' }}>
                  {step.title}
                </p>

                <button
                  onClick={() => { onStepSelect(step.number) }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: isCurrent ? 'none' : '1.5px solid #E5E9F2',
                    background: isCurrent ? '#2A4F87' : '#fff',
                    color: isCurrent ? '#fff' : '#64748B',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    flexShrink: 0,
                  }}
                >
                  {isCurrent ? 'Revenir' : step.number === 10 ? 'Déposer la preuve' : "Aller à l'étape"}
                </button>

                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {isCurrent && (
                <div style={{ padding: '12px 18px', background: '#EBF0FA', border: '1px solid #2A4F87', borderTop: 'none', borderRadius: '0 0 12px 12px', animation: 'fadeIn 0.2s ease' }}>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                    Ici, veuillez remplir vos informations personnelles
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, maxWidth: 600, margin: '32px auto 0' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, border: '1.5px solid #E5E9F2', background: '#fff', color: '#374151', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger un résumé
        </button>

        {canEdit && (
          <button onClick={onStart} style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 4px 14px rgba(42,79,135,0.35)' }}>
            Commencer
          </button>
        )}
      </div>
    </div>
  )
}
