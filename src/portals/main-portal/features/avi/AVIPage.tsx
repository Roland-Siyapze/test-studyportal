/* eslint-disable @typescript-eslint/restrict-plus-operands */
/**
 * @file AVIPage.tsx
 * @description "Obtenir mon A.V.I" — multi-step flow matching Figma design.
 *   Step list view + form view per step.
 *   Satisfies: the service subscription flow shown in Figma screens 3 and 4.
 */

import type { JSX} from 'react';
import { useState } from 'react'

interface AVIStep {
  number: number
  title: string
  status: 'current' | 'upcoming' | 'done'
}

const INITIAL_STEPS: AVIStep[] = [
  { number: 1,  title: 'Informations Personnelles',     status: 'current' },
  { number: 2,  title: 'Détails de la Formation',       status: 'upcoming' },
  { number: 3,  title: 'Informations Financières et Autres', status: 'upcoming' },
  { number: 4,  title: 'Principe de paiement',          status: 'upcoming' },
  { number: 5,  title: 'Mode de paiement',              status: 'upcoming' },
  { number: 6,  title: 'Établissement bancaire',        status: 'upcoming' },
  { number: 7,  title: 'Coordonnées bancaires',         status: 'upcoming' },
  { number: 8,  title: 'Proforma',                      status: 'upcoming' },
  { number: 9,  title: 'Mon contrat',                   status: 'upcoming' },
  { number: 10, title: 'Dépôt de preuve',               status: 'upcoming' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Step form — Step 1: Personal info (matches Figma screen 4)
// ─────────────────────────────────────────────────────────────────────────────

interface PersonalInfoForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  passportNumber: string
  passportDelivery: string
  passportExpiry: string
}

function Step1Form({ onNext, onCancel }: { onNext: () => void; onCancel: () => void }): JSX.Element {
  const [form, setForm] = useState({
    firstName: 'Moni',
    lastName: 'Roy',
    email: 'Moniroy22@mail.com',
    phone: '696418984',
    passportNumber: '',
    passportDelivery: '',
    passportExpiry: '',
  })

  function update(key: keyof PersonalInfoForm, value: string): void {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const inputStyle = (disabled = false): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #E5E9F2',
    borderRadius: 10,
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    color: '#1A2332',
    background: disabled ? '#F8FAFC' : '#fff',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  })

  function addFocus(e: React.FocusEvent<HTMLInputElement>): void {
    e.currentTarget.style.borderColor = '#2A4F87'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.1)'
  }
  function removeFocus(e: React.FocusEvent<HTMLInputElement>): void {
    e.currentTarget.style.borderColor = '#E5E9F2'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      {/* Progress dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
        {[
          { n: 1, label: 'Informations\nPersonnelles' },
          { n: 2, label: 'Détails de\nla Formation' },
          { n: 3, label: 'Informations Financières\net Autres Détails' },
        ].map(({ n, label }, i) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: n === 1 ? '#2A4F87' : '#E5E9F2',
                color: n === 1 ? '#fff' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-display)',
              }}>
                {n === 1 ? '0' + n : '0' + n}
              </div>
              <p style={{
                fontSize: '0.72rem',
                color: n === 1 ? '#2A4F87' : '#94A3B8',
                fontWeight: n === 1 ? 700 : 400,
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                whiteSpace: 'pre-line',
                lineHeight: 1.3,
              }}>
                {label}
              </p>
            </div>
            {i < 2 && (
              <div style={{ width: 80, height: 2, background: '#E5E9F2', margin: '0 8px', marginBottom: 28 }} />
            )}
          </div>
        ))}
      </div>

      {/* Form grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
        <input style={inputStyle()} value={form.firstName} onChange={e => { update('firstName', e.target.value); }}
          placeholder="Prénom" onFocus={addFocus} onBlur={removeFocus} />

        <input style={inputStyle()} value={form.passportNumber} onChange={e => { update('passportNumber', e.target.value); }}
          placeholder="Numéro de passeport" onFocus={addFocus} onBlur={removeFocus} />

        <input style={inputStyle()} value={form.lastName} onChange={e => { update('lastName', e.target.value); }}
          placeholder="Nom" onFocus={addFocus} onBlur={removeFocus} />

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Date de délivrance du passeport</label>
          <input type="date" style={inputStyle()} value={form.passportDelivery} onChange={e => { update('passportDelivery', e.target.value); }}
            onFocus={addFocus} onBlur={removeFocus} />
        </div>

        <input style={inputStyle()} value={form.email} onChange={e => { update('email', e.target.value); }}
          placeholder="Email" type="email" onFocus={addFocus} onBlur={removeFocus} />

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Date d'expiration du passeport</label>
          <input type="date" style={inputStyle()} value={form.passportExpiry} onChange={e => { update('passportExpiry', e.target.value); }}
            onFocus={addFocus} onBlur={removeFocus} />
        </div>

        {/* Phone with flag */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Numéro de téléphone</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 12px',
              border: '1px solid #E5E9F2', borderRadius: 10,
              background: '#fff', fontSize: '0.88rem', fontFamily: 'var(--font-body)',
              color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              🇨🇲 +237
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <input style={{ ...inputStyle(), flex: 1 }} value={form.phone} onChange={e => { update('phone', e.target.value); }}
              placeholder="6XX XXX XXX" onFocus={addFocus} onBlur={removeFocus} />
          </div>
        </div>

        {/* Passport scan */}
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Scan du passeport</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{
              padding: '11px 16px', borderRadius: 10,
              border: '1px solid #E5E9F2', background: '#F8FAFC',
              color: '#374151', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
            }}>
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
              Mon_passeport.pdf
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 32 }}>
        <button
          onClick={onCancel}
          style={{
            padding: '11px 24px', borderRadius: 10, border: '1.5px solid #E5E9F2',
            background: '#fff', color: '#64748B', fontWeight: 600, fontSize: '0.9rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Annuler
        </button>
        <button
          onClick={onNext}
          style={{
            padding: '11px 28px', borderRadius: 10, border: 'none',
            background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 12px rgba(42,79,135,0.3)',
          }}
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step list view (Figma screen 3 — "Parcours à suivre")
// ─────────────────────────────────────────────────────────────────────────────

function StepListView({ steps, onStepSelect, onStart }: {
  steps: AVIStep[]
  onStepSelect: (n: number) => void
  onStart: () => void
}): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.3rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 28,
      }}>
        Parcours à suivre
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 600, margin: '0 auto' }}>
        {steps.map(step => {
          const isCurrent = step.status === 'current'
          const isDone = step.status === 'done'

          return (
            <div
              key={step.number}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: 12,
                background: isCurrent ? '#EBF0FA' : '#fff',
                border: `1px solid ${isCurrent ? '#2A4F87' : '#E5E9F2'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Step number circle */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isDone ? '#428959' : isCurrent ? '#2A4F87' : '#fff',
                border: isDone || isCurrent ? 'none' : '2px solid #E5E9F2',
                color: isDone || isCurrent ? '#fff' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-display)',
                flexShrink: 0,
              }}>
                {isDone ? '✓' : String(step.number).padStart(2, '0')}
              </div>

              {/* Title */}
              <p style={{
                flex: 1,
                fontWeight: isCurrent ? 700 : 500,
                fontSize: '0.9rem',
                color: isCurrent ? '#2A4F87' : '#374151',
                fontFamily: 'var(--font-body)',
              }}>
                {step.title}
              </p>

              {/* Action button */}
              {isCurrent ? (
                <button
                  onClick={() => { onStepSelect(step.number); }}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    border: 'none', background: '#2A4F87', color: '#fff',
                    fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  Revenir
                </button>
              ) : (
                <button
                  onClick={() => { onStepSelect(step.number); }}
                  style={{
                    padding: '7px 14px', borderRadius: 8,
                    border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B',
                    fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}
                >
                  Aller à l'étape
                </button>
              )}

              {/* Expand icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
          )
        })}
      </div>

      {/* Footer buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, maxWidth: 600, margin: '32px auto 0' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 20px', borderRadius: 10,
          border: '1.5px solid #E5E9F2', background: '#fff', color: '#374151',
          fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Télécharger un résumé
        </button>

        <button
          onClick={onStart}
          style={{
            padding: '12px 28px', borderRadius: 10, border: 'none',
            background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 14px rgba(42,79,135,0.35)',
          }}
        >
          Commencer
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AVIPage
// ─────────────────────────────────────────────────────────────────────────────

export function AVIPage({ onBack }: { onBack: () => void }): JSX.Element {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [steps, setSteps] = useState(INITIAL_STEPS)
  const [currentStep, setCurrentStep] = useState(1)

  function handleStart(): void {
    setView('form')
  }

  function handleStepSelect(n: number): void {
    setCurrentStep(n)
    setView('form')
    setSteps(prev => prev.map(s => ({
      ...s,
      status: s.number === n ? 'current' : s.number < n ? 'done' : 'upcoming',
    })))
  }

  function handleNext(): void {
    if (currentStep < 10) {
      const next = currentStep + 1
      setSteps(prev => prev.map(s => ({
        ...s,
        status: s.number === next ? 'current' : s.number < next ? 'done' : 'upcoming',
      })))
      setCurrentStep(next)
    } else {
      setView('list')
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Back button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Retour à l'accueil
        </button>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E5E9F2',
        boxShadow: '0 4px 24px rgba(42,79,135,0.08)',
        overflow: 'hidden',
      }}>
        {view === 'list' ? (
          <StepListView steps={steps} onStepSelect={handleStepSelect} onStart={handleStart} />
        ) : (
          <Step1Form onNext={handleNext} onCancel={() => { setView('list'); }} />
        )}
      </div>
    </div>
  )
}