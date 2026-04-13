import type { JSX } from 'react'

export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid #E5E9F2',
  borderRadius: 10,
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  color: '#1A2332',
  background: '#F8FAFC',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
}

export function addFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
  e.currentTarget.style.borderColor = '#2A4F87'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.12)'
  e.currentTarget.style.background = '#fff'
}

export function removeFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
  e.currentTarget.style.borderColor = '#E5E9F2'
  e.currentTarget.style.boxShadow = 'none'
  e.currentTarget.style.background = '#F8FAFC'
}

export function Label({ text, required }: { text: string; required?: boolean }): JSX.Element {
  return (
    <label style={{
      display: 'block',
      fontSize: '0.78rem',
      fontWeight: 600,
      color: '#64748B',
      marginBottom: 6,
      fontFamily: 'var(--font-body)',
    }}>
      {text}{required && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
    </label>
  )
}

export interface NavButtonsProps {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  backLabel?: string
  nextDisabled?: boolean
  loading?: boolean
}

export function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Suivant',
  backLabel = 'Retour',
  nextDisabled = false,
  loading = false,
}: NavButtonsProps): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 14,
      marginTop: 40,
      paddingTop: 24,
      borderTop: '1px solid #F0F2F8',
    }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            padding: '12px 28px',
            borderRadius: 10,
            border: '1.5px solid #E5E9F2',
            background: '#fff',
            color: '#64748B',
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
          disabled={nextDisabled || loading}
          style={{
            padding: '12px 36px',
            borderRadius: 10,
            border: 'none',
            background: nextDisabled || loading ? '#94A3B8' : '#2A4F87',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: nextDisabled || loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: nextDisabled || loading ? 'none' : '0 4px 14px rgba(42,79,135,0.35)',
            transition: 'all 0.15s',
          }}
        >
          {loading ? 'Chargement…' : nextLabel}
        </button>
      )}
    </div>
  )
}

export function getSelectStyle(canEdit: boolean): React.CSSProperties {
  return {
    ...inputStyle,
    cursor: canEdit ? 'pointer' : 'not-allowed',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
  }
}
