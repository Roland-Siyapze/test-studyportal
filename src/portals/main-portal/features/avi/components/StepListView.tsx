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
    <div style={{ padding: '28px 24px 24px', animation: 'fadeIn 0.3s ease', fontFamily: 'var(--font-body)', maxWidth: 900, margin: '0 auto' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.15rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: '-0.01em',
      }}>
        Parcours à suivre
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {steps.map((step) => {
          const isCurrent = step.status === 'current'
          const isDone = step.status === 'done'
          const isBlue = isCurrent || isDone

          const actionLabel = step.number === 10
            ? 'Déposer la preuve'
            : isCurrent
              ? 'Revenir'
              : "Aller à l'étape"

          return (
            <div key={step.number}>
              {/* Row: [circle]--[connector]--[card] */}
              <div style={{ display: 'flex', alignItems: 'center' }}>

                {/* Step number circle — OUTSIDE the card */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  border: `2px solid ${isBlue ? '#2563EB' : '#94A3B8'}`,
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  zIndex: 1,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: isBlue ? '#2563EB' : '#94A3B8',
                    letterSpacing: '0.02em',
                  }}>
                    {String(step.number).padStart(2, '0')}
                  </span>
                </div>

                {/* Horizontal connector line */}
                <div style={{
                  width: 18,
                  height: 2,
                  background: isBlue ? '#2563EB' : '#94A3B8',
                  flexShrink: 0,
                }} />

                {/* Card */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 10,
                  border: `1.5px solid ${isCurrent ? '#2563EB' : '#D1D5DB'}`,
                  background: '#fff',
                  overflow: 'hidden',
                  minHeight: 52,
                  transition: 'border-color 0.15s',
                }}>
                  {/* Title */}
                  <p style={{
                    flex: 1,
                    fontWeight: isCurrent ? 700 : 500,
                    fontSize: '0.88rem',
                    color: isCurrent ? '#2563EB' : '#6B7280',
                    fontFamily: 'var(--font-body)',
                    padding: '14px 14px',
                    margin: 0,
                    lineHeight: 1.3,
                  }}>
                    {step.title}
                  </p>

                  {/* Action button */}
                  <div style={{ paddingRight: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => { onStepSelect(step.number) }}
                      style={{
                        padding: '7px 16px',
                        borderRadius: 20,
                        border: isCurrent ? 'none' : '1.5px solid #D1D5DB',
                        background: isCurrent ? '#2563EB' : '#fff',
                        color: isCurrent ? '#fff' : '#374151',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s',
                      }}
                    >
                      {actionLabel}
                    </button>
                  </div>

                  {/* Gray chevron block — far right, with left border separator */}
                  <div
                    onClick={() => { onStepSelect(step.number) }}
                    style={{
                      width: 40,
                      alignSelf: 'stretch',
                      borderLeft: '1.5px solid #E5E9F2',
                      background: '#E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      cursor: 'pointer',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expanded description — joined below, same color as active */}
              {isCurrent && (
                <div style={{
                  marginLeft: 45 + 30,
                  width: '90%',
                  padding: '14px 16px',
                  background: '#EFF6FF',
                  border: '1.5px solid #2563EB',
                  borderTopWidth: 0,
                  borderRadius: '0 0 10px 10px',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <p style={{
                    fontSize: '0.83rem',
                    color: '#1E40AF',
                    fontFamily: 'var(--font-body)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}>
                    Ici, veuillez remplir vos informations personnelles
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 28,
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '12px 22px',
          borderRadius: 10,
          border: 'none',
          background: '#6B7280',
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger un résumé
        </button>

        {canEdit && (
          <button
            onClick={onStart}
            style={{
              padding: '12px 36px',
              borderRadius: 10,
              border: 'none',
              background: '#2563EB',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            Commencer
          </button>
        )}
      </div>
    </div>
  )
}