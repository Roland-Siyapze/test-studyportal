/**
 * @file LoginPage.tsx
 * @description BOAZ-STUDY branded login page.
 *
 *   In MOCK mode  (VITE_USE_MOCK_AUTH=true):
 *     Renders an email/password form and calls mockAuthenticate().
 *     Quick-login buttons let the evaluator switch profiles instantly.
 *
 *   In PRODUCTION mode:
 *     The form triggers a Keycloak redirect (standard OpenID Connect flow).
 *     The visual matches the Figma charte graphique: deep navy background,
 *     blue gradient accents, gold highlights, Playfair Display headings.
 *
 *   Satisfies: AUTH-001, AUTH-002 (login page matches Figma charte)
 *              AUTH-003 (credentials → JWT stored in auth store)
 *              VIS-002  (responsive mobile + desktop)
 *              VIS-003  (loading states, error feedback)
 */

import { useState, useEffect, JSX } from 'react'
import { useAuth } from '@hooks/useAuth'
import { IS_MOCK_AUTH, MOCK_PROFILES } from './login-helpers'

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: decorative animated background orbs
// ─────────────────────────────────────────────────────────────────────────────

function BackgroundOrbs(): JSX.Element {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Large blue orb — top left */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, var(--color-blue-mid) 0%, transparent 70%)',
        }}
      />
      {/* Gold accent orb — bottom right */}
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)',
          animationDelay: '1.5s',
        }}
      />
      {/* Mid blue orb — center right */}
      <div
        className="absolute top-1/2 -right-16 w-64 h-64 rounded-full opacity-10 animate-pulse-slow"
        style={{
          background:
            'radial-gradient(circle, var(--color-blue-light) 0%, transparent 70%)',
          animationDelay: '3s',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: BOAZ-STUDY logo mark
// ─────────────────────────────────────────────────────────────────────────────

function LogoMark(): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      {/* Geometric logo mark */}
      <div className="relative w-14 h-14">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-2xl rotate-45"
          style={{
            background:
              'linear-gradient(135deg, var(--color-blue-mid), var(--color-blue-light))',
          }}
        />
        {/* Inner square */}
        <div
          className="absolute inset-2 rounded-xl rotate-45"
          style={{ background: 'var(--color-navy)' }}
        />
        {/* Gold dot centre */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: 'var(--color-gold)' }}
          />
        </div>
      </div>

      {/* Wordmark */}
      <div className="text-center">
        <h1
          className="text-2xl font-bold tracking-tight leading-none"
          style={{
            fontFamily: 'var(--font-display)',
            background:
              'linear-gradient(90deg, #E2E8F0 0%, var(--color-blue-light) 60%, var(--color-gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          BOAZ-STUDY
        </h1>
        <p
          className="text-xs tracking-widest uppercase mt-1"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          StudyPortal
        </p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: evaluator quick-login panel (mock mode only)
// ─────────────────────────────────────────────────────────────────────────────

interface QuickLoginProps {
  onSelect: (email: string, password: string) => void
  disabled: boolean
}

function QuickLoginPanel({ onSelect, disabled }: QuickLoginProps): JSX.Element {
  return (
    <div
      className="mb-6 p-4 rounded-xl"
      style={{
        background: 'rgba(245, 158, 11, 0.06)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-body)' }}
      >
        Profils de test rapide
      </p>
      <div className="flex flex-col gap-2">
        {MOCK_PROFILES.map((profile) => (
          <button
            key={profile.email}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(profile.email, profile.password)}
            className="w-full py-2 px-3 rounded-lg text-left transition-all duration-150"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  'var(--color-blue-light)'
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  'rgba(59,130,246,0.08)'
              }
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                'var(--color-border)'
              ;(e.currentTarget as HTMLButtonElement).style.background =
                'rgba(255,255,255,0.04)'
            }}
          >
            <span
              className="font-semibold"
              style={{ color: 'var(--color-blue-light)' }}
            >
              {profile.label}
            </span>
            <br />
            <span style={{ color: 'var(--color-text-muted)' }}>{profile.email}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: floating label input
// ─────────────────────────────────────────────────────────────────────────────

interface FloatingInputProps {
  id: string
  type: string
  label: string
  value: string
  onChange: (v: string) => void
  hasError?: boolean
  autoComplete?: string
  disabled?: boolean
}

function FloatingInput({
  id,
  type,
  label,
  value,
  onChange,
  hasError = false,
  autoComplete,
  disabled = false,
}: FloatingInputProps): JSX.Element {
  const [focused, setFocused] = useState(false)
  const isFloating = focused || value.length > 0

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`form-input pt-6 pb-2${hasError ? ' error' : ''}`}
        style={{ opacity: disabled ? 0.6 : 1 }}
        aria-label={label}
        aria-invalid={hasError}
      />
      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute left-4 pointer-events-none transition-all duration-200"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: isFloating ? '0.68rem' : '0.875rem',
          top: isFloating ? '0.4rem' : '50%',
          transform: isFloating ? 'none' : 'translateY(-50%)',
          color: hasError
            ? '#EF4444'
            : focused
              ? 'var(--color-blue-light)'
              : 'var(--color-text-muted)',
        }}
      >
        {label}
      </label>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function LoginPage(): JSX.Element {
  const { login, isLoading, error } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Stagger entrance animation flag
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const emailError = submitted && email.trim() === ''
  const passwordError = submitted && password.trim() === ''

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setSubmitted(true)
    if (!email.trim() || !password.trim()) return
    await login(email.trim(), password)
  }

  function handleQuickLogin(quickEmail: string, quickPassword: string): void {
    setEmail(quickEmail)
    setPassword(quickPassword)
    void login(quickEmail, quickPassword)
  }

  return (
    <div
      className="auth-bg min-h-screen flex items-center justify-center p-4 relative"
      role="main"
    >
      <BackgroundOrbs />

      {/* Left panel — branding (hidden on mobile) */}
      <div
        className="hidden lg:flex flex-col justify-center flex-1 max-w-lg pr-16"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateX(0)' : 'translateX(-24px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <div
          className="text-xs font-semibold tracking-widest uppercase mb-6"
          style={{ color: 'var(--color-blue-light)', fontFamily: 'var(--font-body)' }}
        >
          Portail Multi-espace
        </div>
        <h2
          className="text-5xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-display)', color: '#E2E8F0' }}
        >
          Gérez votre
          <br />
          <span
            style={{
              background:
                'linear-gradient(90deg, var(--color-blue-light), var(--color-gold-light))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            parcours
          </span>
          <br />
          académique.
        </h2>
        <p
          className="text-base leading-relaxed"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          Accédez à vos documents, tickets de support, notifications et bien
          plus — depuis un seul espace sécurisé.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 mt-8">
          {['Documents', 'Tickets', 'Notifications', 'Administration'].map(
            (f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(37,99,235,0.12)',
                  border: '1px solid rgba(37,99,235,0.25)',
                  color: 'var(--color-blue-light)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {f}
              </span>
            )
          )}
        </div>
      </div>

      {/* Right panel — login card */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
        }}
      >
        <div
          className="glass-card rounded-2xl p-8 shadow-2xl"
          style={{ boxShadow: 'var(--shadow-glow), var(--shadow-card)' }}
        >
          <LogoMark />

          {/* Heading */}
          <div className="text-center mb-8">
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: 'var(--font-display)', color: '#E2E8F0' }}
            >
              Bienvenue
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
            >
              {IS_MOCK_AUTH
                ? 'Mode développement — utilisez un profil ci-dessous'
                : 'Connectez-vous à votre espace étudiant'}
            </p>
          </div>

          {/* Quick-login panel — visible in mock mode only */}
          {IS_MOCK_AUTH && (
            <QuickLoginPanel onSelect={handleQuickLogin} disabled={isLoading} />
          )}

          {/* Login form */}
          <form onSubmit={(e) => void handleSubmit(e)} noValidate>
            <div className="flex flex-col gap-4">
              <FloatingInput
                id="email"
                type="email"
                label="Adresse e-mail"
                value={email}
                onChange={setEmail}
                hasError={emailError}
                autoComplete="email"
                disabled={isLoading}
              />
              {emailError && (
                <p
                  className="text-xs -mt-2"
                  style={{ color: '#EF4444', fontFamily: 'var(--font-body)' }}
                  role="alert"
                >
                  L'adresse e-mail est requise.
                </p>
              )}

              <FloatingInput
                id="password"
                type="password"
                label="Mot de passe"
                value={password}
                onChange={setPassword}
                hasError={passwordError}
                autoComplete="current-password"
                disabled={isLoading}
              />
              {passwordError && (
                <p
                  className="text-xs -mt-2"
                  style={{ color: '#EF4444', fontFamily: 'var(--font-body)' }}
                  role="alert"
                >
                  Le mot de passe est requis.
                </p>
              )}

              {/* API / auth error */}
              {error && (
                <div
                  className="px-4 py-3 rounded-xl text-sm"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    color: '#FCA5A5',
                    fontFamily: 'var(--font-body)',
                  }}
                  role="alert"
                >
                  {error === 'Invalid credentials'
                    ? 'Identifiants incorrects. Vérifiez votre e-mail et mot de passe.'
                    : error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary mt-2"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Connexion en cours…
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p
            className="text-center text-xs mt-6"
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
          >
            Problème de connexion ?{' '}
            <a
              href="mailto:support@boaz-study.com"
              className="underline transition-colors"
              style={{ color: 'var(--color-blue-light)' }}
            >
              Contacter le support
            </a>
          </p>
        </div>

        {/* Tagline below card */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          © {new Date().getFullYear()} BOAZ-STUDY — Tous droits réservés
        </p>
      </div>
    </div>
  )
}