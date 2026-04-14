import { useState } from 'react'
import type { JSX } from 'react'

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function SecurityTab(): JSX.Element {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [saving, setSaving] = useState(false)

  function handleChange(field: keyof PasswordFormData, value: string): void {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  function togglePassword(field: 'current' | 'new' | 'confirm'): void {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Reset form after save
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } finally {
      setSaving(false)
    }
  }

  function handleCancel(): void {
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Form Section - Centered */}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Current Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#94A3B8',
            marginBottom: 10,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
          }}>
            Mon mot de passe
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={e => { handleChange('currentPassword', e.target.value) }}
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: 44,
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9'
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7'
              }}
            />
            <button
              type="button"
              onClick={() => { togglePassword('current') }}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                {showPasswords.current ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* New Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#94A3B8',
            marginBottom: 10,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
          }}>
            Nouveau mot de passe
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={e => { handleChange('newPassword', e.target.value) }}
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: 44,
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9'
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7'
              }}
            />
            <button
              type="button"
              onClick={() => { togglePassword('new') }}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                {showPasswords.new ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{
            display: 'block',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: '#94A3B8',
            marginBottom: 10,
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
          }}>
            Confirmer le nouveau mot de passe
          </label>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={e => { handleChange('confirmPassword', e.target.value) }}
              style={{
                width: '100%',
                padding: '14px 16px',
                paddingRight: 44,
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9'
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7'
              }}
            />
            <button
              type="button"
              onClick={() => { togglePassword('confirm') }}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                {showPasswords.confirm ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              border: 'none',
              background: '#CBD5E1',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#B0B8C3'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#CBD5E1'
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              border: 'none',
              background: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8'
            }}
            onMouseLeave={e => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'
            }}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
