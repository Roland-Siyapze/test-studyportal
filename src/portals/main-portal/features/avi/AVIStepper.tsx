/**
 * @file AVIStepper.tsx
 * @description Reusable stepper/progress indicator for the AVI multi-step flow.
 *   Matches the design:
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
      paddingTop: 8,
    }}>
      {steps.map((step, idx) => {
        const isDone = step.number < current
        const isCurrent = step.number === current

        return (
          <div key={step.number} style={{ display: 'flex', alignItems: 'flex-start' }}>
            {/* Step node + label */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
              {/* Circle */}
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isDone ? '#fff' : isCurrent ? '#2563EB' : '#fff',
                border: isDone ? '2px solid #2563EB' : isCurrent ? 'none' : '2px solid #D1D5DB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}>
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: isCurrent ? '#fff' : '#94A3B8',
                  }}>
                    {String(step.number).padStart(2, '0')}
                  </span>
                )}
              </div>

              {/* Label */}
              <p style={{
                fontSize: '0.72rem',
                fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                color: isCurrent ? '#2563EB' : isDone ? '#374151' : '#94A3B8',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.3,
                textAlign: 'center',
                maxWidth: 90,
              }}>
                {step.label}
                {step.sublabel && `\n${step.sublabel}`}
              </p>
            </div>

            {/* Connector line — between steps only */}
            {idx < steps.length - 1 && (
              <div style={{
                width: 80,
                height: 2,
                background: step.number < current ? '#2563EB' : '#E5E9F2',
                marginTop: 19,
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