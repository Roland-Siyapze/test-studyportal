/**
 * @file AVIStepper.tsx
 * @description Reusable stepper/progress indicator for the AVI multi-step flow.
 *   Matches the Figma design:
 *     - Completed steps: blue circle with checkmark + blue connecting line
 *     - Current step: filled blue circle with number
 *     - Future steps: empty gray circle with number
 *     - Labels below each step
 */

import type { JSX } from 'react'

export interface StepDef {
  number: number
  label: string
  sublabel?: string
}

interface AVIStepperProps {
  steps: StepDef[]
  current: number  // 1-based
}

export function AVIStepper({ steps, current }: AVIStepperProps): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      gap: 0,
      marginBottom: 40,
      padding: '0 20px',
    }}>
      {steps.map((step, idx) => {
        const isDone = step.number < current
        const isCurrent = step.number === current

        return (
          <div key={step.number} style={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Step node + label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              {/* Circle */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isDone ? '#2A4F87' : isCurrent ? '#2A4F87' : '#fff',
                border: isDone || isCurrent ? 'none' : '2px solid #D1D5DB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: isCurrent ? '0 4px 12px rgba(42,79,135,0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {isDone ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: isCurrent ? '#fff' : '#9CA3AF',
                  }}>
                    {String(step.number).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Label */}
              <div style={{ textAlign: 'center', maxWidth: 120 }}>
                <p style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : isDone ? 500 : 400,
                  color: isCurrent ? '#2A4F87' : isDone ? '#374151' : '#9CA3AF',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.3,
                  whiteSpace: 'pre-line',
                }}>
                  {step.label}
                  {step.sublabel && `\n${step.sublabel}`}
                </p>
              </div>
            </div>

            {/* Connector line — between steps only */}
            {idx < steps.length - 1 && (
              <div style={{
                height: 2,
                width: 60,
                background: step.number < current ? '#2A4F87' : '#E5E9F2',
                marginTop: 19, // vertically center with circles
                flexShrink: 0,
                transition: 'background 0.3s ease',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}