/**
 * @file LoginPage.tsx
 * @description BOAZ-STUDY branded login page — LIGHT THEME matching Figma.
 *
 *   In MOCK mode  (VITE_USE_MOCK_AUTH=true):
 *     Renders email/password form with quick-login profile buttons.
 *   In PRODUCTION mode:
 *     Triggers Keycloak redirect (standard OpenID Connect).
 *
 *   Satisfies: AUTH-001, AUTH-002, AUTH-003, VIS-002, VIS-003
 */

import type { JSX } from 'react';
import { useState, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { IS_MOCK_AUTH, MOCK_PROFILES } from './login-helpers'
import logo from '@assets/logo.png'

// ─────────────────────────────────────────────────────────────────────────────
// Logo mark — BOAZ branding
// ─────────────────────────────────────────────────────────────────────────────

function BoazLogo(): JSX.Element {
  return (
    <div style={{ padding: '5px 0' }}>
      <img
        src={logo}
        alt="Boaz Study"
        style={{ height: 65, width: 'auto', display: 'flex', objectFit: 'contain' }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick login panel (mock mode)
// ─────────────────────────────────────────────────────────────────────────────

interface QuickLoginProps {
  onSelect: (email: string, password: string) => void
  disabled: boolean
}

function QuickLoginPanel({ onSelect, disabled }: QuickLoginProps): JSX.Element {
  return (
    <div style={{
      background: '#EBF0FA',
      border: '1px solid #C5D5F0',
      borderRadius: 12,
      padding: '14px 16px',
      marginBottom: 24,
    }}>
      <p style={{
        fontSize: '0.72rem',
        fontWeight: 700,
        color: '#2A4F87',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: 10,
        fontFamily: 'var(--font-body)',
      }}>
        🔧 Profils de test rapide
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {MOCK_PROFILES.map((profile) => (
          <button
            key={profile.email}
            type="button"
            disabled={disabled}
            onClick={() => { onSelect(profile.email, profile.password); }}
            style={{
              background: '#fff',
              border: '1.5px solid #C5D5F0',
              borderRadius: 8,
              padding: '8px 12px',
              textAlign: 'left',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              transition: 'border-color 0.15s, background 0.15s',
              fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2A4F87'
                ;(e.currentTarget as HTMLButtonElement).style.background = '#F0F5FF'
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#C5D5F0'
              ;(e.currentTarget as HTMLButtonElement).style.background = '#fff'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2A4F87' }}>
              {profile.label}
            </span>
            <br />
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{profile.email}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Input field
// ─────────────────────────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string
  type: string
  label: string
  value: string
  onChange: (v: string) => void
  hasError?: boolean
  autoComplete?: string
  disabled?: boolean
  icon?: JSX.Element
}

function InputField({
  id, type, label, value, onChange, hasError = false,
  autoComplete, disabled = false, icon,
}: InputFieldProps): JSX.Element {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: hasError ? '#EF4444' : '#374151',
          marginBottom: 6,
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', color: focused ? '#2A4F87' : '#94A3B8',
            transition: 'color 0.15s',
          }}>
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          disabled={disabled}
          onChange={(e) => { onChange(e.target.value); }}
          onFocus={() => { setFocused(true); }}
          onBlur={() => { setFocused(false); }}
          aria-label={label}
          aria-invalid={hasError}
          style={{
            width: '100%',
            padding: icon ? '12px 16px 12px 42px' : '12px 16px',
            border: `1.5px solid ${hasError ? '#EF4444' : focused ? '#2A4F87' : '#E5E9F2'}`,
            borderRadius: 10,
            fontSize: '0.9rem',
            fontFamily: 'var(--font-body)',
            color: '#1A2332',
            background: disabled ? '#F8FAFC' : '#fff',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused && !hasError ? '0 0 0 3px rgba(42,79,135,0.1)' : hasError ? '0 0 0 3px rgba(239,68,68,0.1)' : 'none',
            opacity: disabled ? 0.7 : 1,
            boxSizing: 'border-box',
          }}
          placeholder={`Votre ${label.toLowerCase()}`}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main LoginPage
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage(): JSX.Element {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => { setMounted(true); }, 60)
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => { clearTimeout(t); }
  }, [])

  const emailError = submitted && email.trim() === ''
  const passwordError = submitted && password.trim() === ''

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setSubmitted(true)
    if (!email.trim() || !password.trim()) return
    await login(email.trim(), password)
  }

  function handleQuickLogin(qEmail: string, qPassword: string): void {
    setEmail(qEmail)
    setPassword(qPassword)
    void login(qEmail, qPassword)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EBF0FA 0%, #F4F6FA 60%, #EDF4FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: 'var(--font-body)',
    }}>

      {/* ── Decorative blobs ── */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(42,79,135,0.08) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(241,143,1,0.08) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: 960,
        gap: 48,
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* ── Left panel — branding (hidden on mobile) ── */}
        <div
          className="hidden lg:block"
          style={{
            flex: 1,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <BoazLogo />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.6rem',
            fontWeight: 700,
            color: '#1A2332',
            lineHeight: 1.2,
            marginTop: 32,
            marginBottom: 16,
          }}>
            Gérez votre<br />
            <span style={{ color: '#2A4F87' }}>parcours</span>
            {' '}académique.
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7, maxWidth: 360 }}>
            Accédez à vos documents, tickets de support, notifications et bien
            plus — depuis un seul espace sécurisé.
          </p>
          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 28 }}>
            {['Documents', 'Tickets', 'Notifications', 'Administration'].map((f) => (
              <span key={f} style={{
                padding: '5px 14px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 600,
                background: '#EBF0FA',
                color: '#2A4F87',
                border: '1px solid #C5D5F0',
              }}>
                {f}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 24, marginTop: 36 }}>
            {[
              { value: '2K+', label: 'Étudiants' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: '#2A4F87' }}>{value}</div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel — login card ── */}
        <div style={{
          flex: '0 0 420px',
          width: '100%',
          maxWidth: 420,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 8px 40px rgba(42,79,135,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid #E5E9F2',
            padding: '36px 36px',
          }}>

            {/* Logo + heading */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <BoazLogo />
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#1A2332',
                marginBottom: 6,
              }}>
                Bienvenue !
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                {IS_MOCK_AUTH
                  ? 'Mode développement — choisissez un profil'
                  : 'Connectez-vous à votre espace étudiant'}
              </p>
            </div>

            {/* Mock quick-login */}
            {IS_MOCK_AUTH && (
              <QuickLoginPanel onSelect={handleQuickLogin} disabled={isLoading} />
            )}

            {/* Divider */}
            {IS_MOCK_AUTH && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: '#E5E9F2' }} />
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 500 }}>ou continuer avec</span>
                <div style={{ flex: 1, height: 1, background: '#E5E9F2' }} />
              </div>
            )}

            {/* Form */}
            <form onSubmit={(e) => void handleSubmit(e)} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <InputField
                  id="email"
                  type="email"
                  label="Adresse e-mail"
                  value={email}
                  onChange={setEmail}
                  hasError={emailError}
                  autoComplete="email"
                  disabled={isLoading}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  }
                />
                {emailError && (
                  <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: -8 }} role="alert">
                    L'adresse e-mail est requise.
                  </p>
                )}

                <InputField
                  id="password"
                  type="password"
                  label="Mot de passe"
                  value={password}
                  onChange={setPassword}
                  hasError={passwordError}
                  autoComplete="current-password"
                  disabled={isLoading}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  }
                />
                {passwordError && (
                  <p style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: -8 }} role="alert">
                    Le mot de passe est requis.
                  </p>
                )}

                {/* Forgot password */}
                <div style={{ textAlign: 'right', marginTop: -8 }}>
                  <a href="mailto:support@boaz-study.com" style={{
                    fontSize: '0.8rem',
                    color: '#2A4F87',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}>
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    background: '#FEF2F0',
                    border: '1px solid #FECDC8',
                    borderRadius: 10,
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    color: '#C73E1D',
                    fontWeight: 500,
                  }} role="alert">
                    {error === 'Invalid credentials'
                      ? '❌ Identifiants incorrects. Vérifiez votre e-mail et mot de passe.'
                      : error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  aria-busy={isLoading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-body)',
                    background: isLoading ? '#6B8FBF' : '#2A4F87',
                    color: '#fff',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s, transform 0.15s',
                    boxShadow: '0 4px 14px rgba(42,79,135,0.35)',
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Connexion en cours…
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <p style={{
              textAlign: 'center',
              fontSize: '0.78rem',
              color: '#94A3B8',
              marginTop: 20,
            }}>
              Problème de connexion ?{' '}
              <a href="mailto:support@boaz-study.com" style={{ color: '#2A4F87', fontWeight: 600 }}>
                Contacter le support
              </a>
            </p>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.74rem',
            color: '#CBD5E1',
            marginTop: 16,
            fontFamily: 'var(--font-body)',
          }}>
            © {new Date().getFullYear()} BOAZ-STUDY — Tous droits réservés
          </p>
        </div>

      </div>
    </div>
  )
}