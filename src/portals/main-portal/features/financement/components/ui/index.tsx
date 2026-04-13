import type { JSX } from 'react'

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid #E5E9F2',
  borderRadius: 8,
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  color: '#1A2332',
  background: '#F8FAFC',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

export function addFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
  e.currentTarget.style.borderColor = '#2563EB'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'
  e.currentTarget.style.background = '#fff'
}

export function removeFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
  e.currentTarget.style.borderColor = '#E5E9F2'
  e.currentTarget.style.boxShadow = 'none'
  e.currentTarget.style.background = '#F8FAFC'
}

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  suffix,
}: {
  label?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
  suffix?: string
}): JSX.Element {
  return (
    <div>
      {label && (
        <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={e => { onChange(e.target.value); }}
          placeholder={placeholder}
          disabled={disabled}
          style={{ ...inputStyle, background: disabled ? '#F1F5F9' : '#F8FAFC', paddingRight: suffix ? 52 : 16 }}
          onFocus={addFocus}
          onBlur={removeFocus}
        />
        {suffix && (
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-body)', pointerEvents: 'none' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export function FilePickerField({ label, fileName, onPick }: { label: string; fileName: string; onPick: (name: string) => void }): JSX.Element {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={() => {
          const i = document.createElement('input')
          i.type = 'file'
          i.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) onPick(f.name) }
          i.click()
        }}
        style={{
          padding: '11px 18px',
          borderRadius: 8,
          border: '1px solid #D1D5DB',
          background: '#E5E7EB',
          color: '#374151',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Choisir un fichier
      </button>
      <span style={{
        flex: 1,
        padding: '11px 14px',
        border: '1px solid #E5E9F2',
        borderRadius: 8,
        background: '#F8FAFC',
        fontSize: '0.85rem',
        color: fileName ? '#1A2332' : '#94A3B8',
        fontFamily: 'var(--font-body)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {fileName || label}
      </span>
    </div>
  )
}

export interface NavButtonsProps {
  onBack?: () => void
  onNext?: () => void
  backLabel?: string
  nextLabel?: string
}

export function NavButtons({ onBack, onNext, backLabel = 'Retour', nextLabel = 'Suivant' }: NavButtonsProps): JSX.Element {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 36 }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            padding: '11px 28px',
            borderRadius: 8,
            border: '1.5px solid #E5E9F2',
            background: '#E5E7EB',
            color: '#6B7280',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          {backLabel}
        </button>
      )}
      {onNext && (
        <button
          onClick={onNext}
          style={{
            padding: '11px 32px',
            borderRadius: 8,
            border: 'none',
            background: '#2563EB',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}
        >
          {nextLabel}
        </button>
      )}
    </div>
  )
}

interface StepperProps {
  steps: Array<{ label: string }>
  currentStep: number
  totalVisibleSteps?: number
  startStep?: number
}

export function Stepper({ steps, currentStep, totalVisibleSteps = 3, startStep = 1 }: StepperProps): JSX.Element {
  const visibleSteps = steps.slice(startStep - 1, startStep - 1 + totalVisibleSteps)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 0, marginBottom: 40, paddingTop: 8 }}>
      {visibleSteps.map((step, i) => {
        const globalIndex = startStep + i
        const isDone = globalIndex < currentStep
        const isCurrent = globalIndex === currentStep

        return (
          <div key={globalIndex} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 80 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isDone ? '#fff' : isCurrent ? '#2563EB' : '#fff',
                border: isDone ? '2px solid #2563EB' : isCurrent ? 'none' : '2px solid #D1D5DB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.88rem',
                fontFamily: 'var(--font-display)',
                color: isDone ? '#2563EB' : isCurrent ? '#fff' : '#94A3B8',
                flexShrink: 0,
                transition: 'all 0.3s ease',
              }}>
                {isDone ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  String(globalIndex).padStart(2, '0')
                )}
              </div>
              <p style={{
                fontSize: '0.72rem',
                color: isCurrent ? '#2563EB' : isDone ? '#374151' : '#94A3B8',
                fontWeight: isCurrent ? 700 : isDone ? 600 : 400,
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.3,
                maxWidth: 90,
              }}>
                {step.label}
              </p>
            </div>
            {i < visibleSteps.length - 1 && (
              <div style={{
                width: 80,
                height: 2,
                background: globalIndex < currentStep ? '#2563EB' : '#E5E9F2',
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

export function ConfirmModal({ message, onConfirm, onCancel, submitting = false }: {
  message: string
  onConfirm: () => void
  onCancel: () => void
  submitting?: boolean
}): JSX.Element {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, padding: '40px 48px',
        maxWidth: 440, width: '100%', textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.2s ease',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: -24, left: '50%', transform: 'translateX(-50%)',
          width: 48, height: 48, borderRadius: '50%',
          background: '#F18F01',
          border: '4px solid #FFF4CC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(241,143,1,0.35)',
        }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>!</span>
        </div>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#1A2332',
          lineHeight: 1.5,
          marginBottom: 28,
          marginTop: 8,
        }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 28px', borderRadius: 8, border: '1.5px solid #E5E9F2',
              background: '#E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.9rem',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            style={{
              padding: '10px 28px', borderRadius: 8, border: 'none',
              background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              fontFamily: 'var(--font-body)',
            }}
          >
            {submitting ? 'Envoi…' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Label({ text }: { text: string }): JSX.Element {
  return (
    <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
      {text}
    </label>
  )
}

export function getSelectStyle(): React.CSSProperties {
  return {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 40,
  }
}