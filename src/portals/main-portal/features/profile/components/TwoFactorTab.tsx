import { useState } from 'react'
import type { JSX } from 'react'

export function TwoFactorTab(): JSX.Element {
  const [enabled, setEnabled] = useState(false)
  const [formEnabled, setFormEnabled] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [setupCode, setSetupCode] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSave(): Promise<void> {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (formEnabled && setupCode) {
        setEnabled(true)
        setShowSetup(false)
        setSetupCode('')
      }
    } finally {
      setSaving(false)
    }
  }

  function handleCancel(): void {
    setFormEnabled(enabled)
    setShowSetup(false)
    setSetupCode('')
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Form Section - Centered */}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* 2FA Status */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 24,
            borderBottom: '1px solid #E5E9F2',
          }}>
            <div>
              <p style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A2332',
                fontFamily: 'var(--font-body)',
                margin: 0,
                marginBottom: 4,
              }}>
                Authentificateur TOTP
              </p>
              <p style={{
                fontSize: '0.82rem',
                color: '#64748B',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}>
                Utilisez une application d'authentification (Google Authenticator, Authy)
              </p>
            </div>
            {/* Toggle Switch */}
            <button
              onClick={() => { setFormEnabled(!formEnabled); setShowSetup(!showSetup) }}
              style={{
                width: 50,
                height: 28,
                borderRadius: 999,
                border: 'none',
                background: formEnabled ? '#2563EB' : '#CBD5E1',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.25s ease',
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: formEnabled ? 24 : 2,
                  width: 24,
                  height: 24,
                  background: '#fff',
                  borderRadius: '50%',
                  transition: 'left 0.25s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
              />
            </button>
          </div>
        </div>

        {/* Setup Section */}
        {showSetup && formEnabled && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              background: '#EBF0FA',
              borderRadius: 12,
              border: '1px solid #D0DCFF',
              padding: 16,
              marginBottom: 24,
            }}>
              <p style={{
                fontSize: '0.82rem',
                color: '#2A4F87',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}>
                Scannez ce code QR avec votre application d'authentification
              </p>
            </div>

            {/* QR Code Display */}
            <div style={{
              background: '#F3F5F7',
              borderRadius: 12,
              padding: 20,
              textAlign: 'center',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 200,
            }}>
              <div style={{
                width: 140,
                height: 140,
                background: '#fff',
                borderRadius: 8,
                border: '2px solid #E5E9F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                color: '#94A3B8',
              }}>
                [QR Code]
              </div>
            </div>

            {/* Verification Code Input */}
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
                Entrez le code 6 chiffres
              </label>
              <input
                type="text"
                value={setupCode}
                onChange={e => { setSetupCode(e.target.value.replace(/\D/g, '').slice(0, 6)) }}
                placeholder="000000"
                maxLength={6}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: '1.2rem',
                  fontFamily: 'monospace',
                  background: '#F3F5F7',
                  color: '#1A2332',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'background 0.15s',
                  textAlign: 'center',
                  letterSpacing: '8px',
                }}
                onFocus={e => {
                  (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9'
                }}
                onBlur={e => {
                  (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7'
                }}
              />
            </div>
          </div>
        )}

        {enabled && !showSetup && (
          <div style={{
            background: '#EAF5EE',
            borderRadius: 12,
            border: '1px solid #C1E4D4',
            padding: 16,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: '1.1rem' }}>✅</span>
            <span style={{
              fontSize: '0.85rem',
              color: '#428959',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
            }}>
              Authentification à deux facteurs activée
            </span>
          </div>
        )}

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
            disabled={saving || (formEnabled && !setupCode)}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              border: 'none',
              background: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: saving || (formEnabled && !setupCode) ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              opacity: saving || (formEnabled && !setupCode) ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!saving && !(formEnabled && !setupCode)) (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8'
            }}
            onMouseLeave={e => {
              if (!saving && !(formEnabled && !setupCode)) (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'
            }}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
