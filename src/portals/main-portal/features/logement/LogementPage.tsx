/**
 * @file LogementPage.tsx
 * @description "Attestation de Logement" — 3-step multi-page flow.
 *
 *   Steps:
 *     1  Informations Personnelles
 *     2  Détails du logement
 *     3  Documents & Confirmation
 *     → Success screen
 *
 *   Permissions:
 *     - document:read   → can view (read-only)
 *     - document:upload → can fill & submit forms
 */

import type { JSX } from 'react'
import { useState } from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { ReadOnlyBanner } from '../avi/components/ReadOnlyBanner'
import { LogementStep1, type LogementStep1Data } from './components/steps/Step1'
import { LogementStep2, type LogementStep2Data } from './components/steps/Step2'
import { LogementStep3, type LogementStep3Data } from './components/steps/Step3'
import { LogementSuccessScreen } from './components/LogementSuccessScreen'

// ─────────────────────────────────────────────────────────────────────────────
// Form shape
// ─────────────────────────────────────────────────────────────────────────────

interface LogementFormData {
  step1: LogementStep1Data
  step2: LogementStep2Data
  step3: LogementStep3Data
}

const INITIAL_FORM: LogementFormData = {
  step1: {
    prenom: 'Moni',
    nom: 'Roy',
    email: 'Moniroy22@mail.com',
    telephone: '696418984',
    passportNumber: '',
    passportDelivery: '',
    passportExpiry: '',
    passportScanName: '',
  },
  step2: {
    etablissement: '',
    formation: '',
    ville: '',
    dateArrivee: '',
    dateDepart: '',
    typeLogement: '',
    adresseLogement: '',
    codePostal: '',
    lettreAdmissionName: '',
  },
  step3: {
    montantLoyer: '',
    dureeContrat: '',
    garant: '',
    justificatifRevenuName: '',
    contratLogementName: '',
    photoLogementName: '',
    commentaires: '',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export function LogementPage({ onBack }: { onBack: () => void }): JSX.Element {
  const { hasPermission } = usePermissions()

  const canEdit = hasPermission('document:upload')
  const canView = hasPermission('document:read') || canEdit

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [showSuccess, setShowSuccess] = useState(false)

  // ── Access denied ──────────────────────────────────────────────────────────

  if (!canView) {
    return (
      <div style={{
        background: '#fff', borderRadius: 20, padding: 48, textAlign: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1A2332', marginBottom: 8 }}>
          Accès non autorisé
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
          Vous n'avez pas les permissions nécessaires pour accéder au service Attestation de Logement.
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: 24, padding: '10px 24px', borderRadius: 10,
            border: '1.5px solid #E5E9F2', background: '#fff',
            color: '#64748B', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (showSuccess) {
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          border: '1px solid #E5E9F2',
          boxShadow: '0 4px 24px rgba(42,79,135,0.08)',
          overflow: 'hidden',
        }}>
          <LogementSuccessScreen onGoToDemandes={onBack} />
        </div>
      </div>
    )
  }

  // ── Step handlers ──────────────────────────────────────────────────────────

  function handleStep1Change(key: keyof LogementStep1Data, value: string): void {
    setForm(prev => ({ ...prev, step1: { ...prev.step1, [key]: value } }))
  }

  function handleStep2Change(key: keyof LogementStep2Data, value: string): void {
    setForm(prev => ({ ...prev, step2: { ...prev.step2, [key]: value } }))
  }

  function handleStep3Change(key: keyof LogementStep3Data, value: string): void {
    setForm(prev => ({ ...prev, step3: { ...prev.step3, [key]: value } }))
  }

  function handleSubmit(): void {
    setShowSuccess(true)
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Back button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: '1.5px solid #E5E9F2', background: '#fff',
            color: '#64748B', fontWeight: 600, fontSize: '0.82rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour à l'accueil
        </button>
      </div>

      {/* Read-only banner */}
      {!canEdit && <ReadOnlyBanner />}

      {/* Form card */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E5E9F2',
        boxShadow: '0 4px 24px rgba(42,79,135,0.08)',
        overflow: 'hidden',
      }}>
        {step === 1 && (
          <LogementStep1
            data={form.step1}
            onChange={handleStep1Change}
            onNext={() => { setStep(2) }}
            onCancel={() => { onBack() }}
            canEdit={canEdit}
          />
        )}

        {step === 2 && (
          <LogementStep2
            data={form.step2}
            onChange={handleStep2Change}
            onNext={() => { setStep(3) }}
            onBack={() => { setStep(1) }}
            canEdit={canEdit}
          />
        )}

        {step === 3 && (
          <LogementStep3
            data={form.step3}
            onChange={handleStep3Change}
            onBack={() => { setStep(2) }}
            onSubmit={handleSubmit}
            canEdit={canEdit}
          />
        )}
      </div>
    </div>
  )
}