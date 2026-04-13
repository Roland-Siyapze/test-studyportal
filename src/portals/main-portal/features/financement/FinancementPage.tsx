/**
 * @file FinancementPage.tsx
 * @description "Demande de financement" — 6-step multi-form flow + list table.
 *
 *   Steps (matching Figma screenshots):
 *     1. Informations Personnelles
 *     2. Identité (CNI scan + parental info)
 *     3. Détails du financement
 *     4. Échéancier
 *     5. Justificatifs de demande de financement
 *     6. Marche à suivre (summary + confirmation)
 *
 *   After submission → List view (Figma screens 9-10)
 *
 *   Satisfies: PERM-002 (ticket:create gate for create button)
 */

import type { JSX } from 'react'
import { useState, useCallback } from 'react'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { MOCK_FINANCEMENT_DEMANDES } from '@services/mock/financement.mock'
import type { FinancementDemande, FinancementStatut } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface EcheanceItem {
  id: string
  date: string
  somme: string
}

interface JustificatifItem {
  id: string
  nom: string
}

interface FormData {
  // Step 1
  prenom: string
  nom: string
  lieuNaissance: string
  dateNaissance: string
  adresseComplete: string
  pays: string
  ville: string
  quartier: string
  telephone: string
  scanPasseportName: string
  planLocalisationName: string

  // Step 2
  scanCNIName: string
  demiCartePhotoName: string
  nomPrenomParent1: string
  telephoneParent1: string
  lieuResidenceParent1: string
  nomPrenomParent2: string
  telephoneParent2: string
  lieuResidenceParent2: string

  // Step 3
  serviceAFinancer: string
  coutService: string
  financementMaximal: string
  sommeDemandee: string
  fraisFinancement: string
  sommeTotaleARembourser: string

  // Step 4
  nombreEcheances: number
  echeances: EcheanceItem[]

  // Step 5
  justification: string
  justificatifs: JustificatifItem[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Status Config
// ─────────────────────────────────────────────────────────────────────────────

const STATUT_CONFIG: Record<FinancementStatut, { label: string; color: string; dotColor: string; borderColor: string; bg: string }> = {
  EN_PREPARATION:      { label: 'En préparation',       color: '#D97E00', dotColor: '#F18F01', borderColor: '#F18F01', bg: '#FFF7ED' },
  EN_ATTENTE_PAIEMENT: { label: 'En attente de paiement', color: '#D97E00', dotColor: '#F5B942', borderColor: '#F5B942', bg: '#FFFBEB' },
  PAIEMENT_EN_ATTENTE: { label: 'Paiement en attente',  color: '#2A4F87', dotColor: '#2563EB', borderColor: '#2563EB', bg: '#EBF0FA' },
  EN_COURS:            { label: 'En cours',              color: '#D97E00', dotColor: '#D97E00', borderColor: 'transparent', bg: 'transparent' },
  EN_REMBOURSEMENT:    { label: 'En remboursement',      color: '#2A4F87', dotColor: '#2563EB', borderColor: 'transparent', bg: 'transparent' },
  CLOTURE:             { label: 'Clôturé',               color: '#64748B', dotColor: '#94A3B8', borderColor: 'transparent', bg: 'transparent' },
  ECHEANCE_PASSEE:     { label: 'Échéance passée',       color: '#D97E00', dotColor: '#D97E00', borderColor: 'transparent', bg: 'transparent' },
  REJETE:              { label: 'Rejeté',                color: '#C73E1D', dotColor: '#C73E1D', borderColor: 'transparent', bg: 'transparent' },
  ACCEPTE:             { label: 'Accepté',               color: '#428959', dotColor: '#428959', borderColor: 'transparent', bg: 'transparent' },
}

const FILTER_STATUTS: FinancementStatut[] = [
  'EN_PREPARATION', 'EN_ATTENTE_PAIEMENT', 'PAIEMENT_EN_ATTENTE',
  'CLOTURE', 'ACCEPTE', 'EN_COURS',
]

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI Helpers
// ─────────────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
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

function InputField({
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
          onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; e.currentTarget.style.background = '#fff' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = disabled ? '#F1F5F9' : '#F8FAFC' }}
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

function FilePickerField({ label, fileName, onPick }: { label: string; fileName: string; onPick: (name: string) => void }): JSX.Element {
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

// ─────────────────────────────────────────────────────────────────────────────
// Stepper Component
// ─────────────────────────────────────────────────────────────────────────────

interface StepperProps {
  steps: Array<{ label: string }>
  currentStep: number  // 1-based
  totalVisibleSteps?: number
  startStep?: number
}

function Stepper({ steps, currentStep, totalVisibleSteps = 3, startStep = 1 }: StepperProps): JSX.Element {
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
              {/* Label */}
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
            {/* Connector line */}
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

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Informations Personnelles
// ─────────────────────────────────────────────────────────────────────────────

function Step1({ data, onChange, onNext, onCancel }: {
  data: FormData
  onChange: (key: keyof FormData, value: string) => void
  onNext: () => void
  onCancel: () => void
}): JSX.Element {
  const STEPS_META = [
    { label: 'Informations\nPersonnelles' },
    { label: 'Identités' },
    { label: 'Informations\nFinancières\net Autres Détails' },
  ]

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={1} totalVisibleSteps={3} startStep={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px' }}>
        <InputField
          value={data.prenom}
          onChange={v => { onChange('prenom', v); }}
          placeholder="Moni"
        />
        <InputField
          value={data.nom}
          onChange={v => { onChange('nom', v); }}
          placeholder="Roy"
        />

        <InputField
          label="Lieu de naissance"
          value={data.lieuNaissance}
          onChange={v => { onChange('lieuNaissance', v); }}
          placeholder="Moncton"
        />
        <InputField
          label="Date de naissance"
          type="date"
          value={data.dateNaissance}
          onChange={v => { onChange('dateNaissance', v); }}
          placeholder="jj/mm/aa"
        />

        <InputField
          label="Adresse complète"
          value={data.adresseComplete}
          onChange={v => { onChange('adresseComplete', v); }}
          placeholder="Moncton"
        />
        <InputField
          label="Pays"
          value={data.pays}
          onChange={v => { onChange('pays', v); }}
          placeholder="Moncton"
        />

        <InputField
          label="Ville"
          value={data.ville}
          onChange={v => { onChange('ville', v); }}
          placeholder="Moncton"
        />
        <InputField
          label="Quartier"
          value={data.quartier}
          onChange={v => { onChange('quartier', v); }}
          placeholder="Riverview"
        />

        {/* Phone */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Numéro de téléphone
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 12px',
              border: '1px solid #E5E9F2', borderRadius: 8,
              background: '#F8FAFC', fontSize: '0.88rem', fontFamily: 'var(--font-body)',
              color: '#374151', whiteSpace: 'nowrap', flexShrink: 0,
            }}>
              🇨🇲 +237
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
            </div>
            <input
              value={data.telephone}
              onChange={e => { onChange('telephone', e.target.value); }}
              placeholder="696418984"
              style={{ ...inputStyle, flex: 1 }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.background = '#F8FAFC' }}
            />
          </div>
        </div>

        {/* Plan de localisation */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Plan de localisation
          </label>
          <FilePickerField
            label="Plan de localisation"
            fileName={data.planLocalisationName}
            onPick={name => { onChange('planLocalisationName', name); }}
          />
        </div>
      </div>

      <ActionButtons onBack={onCancel} onNext={onNext} backLabel="Annuler" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Identité
// ─────────────────────────────────────────────────────────────────────────────

function Step2({ data, onChange, onNext, onBack }: {
  data: FormData
  onChange: (key: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}): JSX.Element {
  const STEPS_META = [
    { label: 'Informations\npersonnelles' },
    { label: 'Identité' },
    { label: 'Détails du\nfiancement' },
  ]

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={2} totalVisibleSteps={3} startStep={1} />

      {/* CNI + Photo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FilePickerField
            label="Scan CNI"
            fileName={data.scanCNIName}
            onPick={name => { onChange('scanCNIName', name); }}
          />
          <FilePickerField
            label="Demi carte photo"
            fileName={data.demiCartePhotoName}
            onPick={name => { onChange('demiCartePhotoName', name); }}
          />
        </div>
        {/* Previews */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 110, height: 90, borderRadius: 10,
              background: '#E5E7EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-body)',
            }}>
              Aperçu
            </div>
          ))}
        </div>
      </div>

      {/* Parental Info */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 20,
      }}>
        Informations parentales
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 28px' }}>
        <InputField
          label="Nom et prénom parent 1"
          value={data.nomPrenomParent1}
          onChange={v => { onChange('nomPrenomParent1', v); }}
          placeholder=""
        />
        <InputField
          label="Nom et prénom parent 2"
          value={data.nomPrenomParent2}
          onChange={v => { onChange('nomPrenomParent2', v); }}
          placeholder=""
        />
        <InputField
          label="Numéro de téléphone"
          value={data.telephoneParent1}
          onChange={v => { onChange('telephoneParent1', v); }}
          placeholder=""
        />
        <InputField
          label="Numéro de téléphone"
          value={data.telephoneParent2}
          onChange={v => { onChange('telephoneParent2', v); }}
          placeholder=""
        />
        <InputField
          label="lieu de résidence"
          value={data.lieuResidenceParent1}
          onChange={v => { onChange('lieuResidenceParent1', v); }}
          placeholder=""
        />
        <InputField
          label="lieu de résidence"
          value={data.lieuResidenceParent2}
          onChange={v => { onChange('lieuResidenceParent2', v); }}
          placeholder=""
        />
      </div>

      <ActionButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Détails du financement
// ─────────────────────────────────────────────────────────────────────────────

function Step3({ data, onChange, onNext, onBack }: {
  data: FormData
  onChange: (key: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}): JSX.Element {
  const STEPS_META = [
    { label: 'Mes\ninformations' },
    { label: 'Identité' },
    { label: 'Détails du\nfinancement' },
  ]

  const SERVICES = ['A.V.I', 'Attestation de logement', 'Assurance', 'Autre']

  // Auto-calculate totals
  const frais = data.sommeDemandee ? (parseFloat(data.sommeDemandee) * 0.05).toFixed(0) : ''
  const total = data.sommeDemandee && frais ? (parseFloat(data.sommeDemandee) + parseFloat(frais)).toFixed(0) : ''

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Stepper</p>
      <Stepper steps={STEPS_META} currentStep={3} totalVisibleSteps={3} startStep={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', marginBottom: 24 }}>
        {/* Service dropdown */}
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748B', marginBottom: 5, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            Choisissez le service à financer
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={data.serviceAFinancer}
              onChange={e => { onChange('serviceAFinancer', e.target.value); }}
              style={{ ...inputStyle, appearance: 'none', paddingRight: 40, cursor: 'pointer' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2563EB' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2' }}
            >
              <option value="">Sélectionner...</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>

        <InputField
          label="Coût du service choisi"
          value={data.coutService}
          onChange={v => { onChange('coutService', v); }}
          placeholder="xxxxxx XAF"
          disabled
        />
        <InputField
          label="Financement maximal possible"
          value={data.financementMaximal}
          onChange={v => { onChange('financementMaximal', v); }}
          placeholder="Exemple: 700€"
        />
      </div>

      {/* Calculator sub-card */}
      <div style={{
        border: '1px solid #E5E9F2',
        borderRadius: 12,
        padding: '20px 24px',
        background: '#FAFBFE',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px 28px',
      }}>
        <InputField
          label="De qu'elle somme avez-vous besoin ?"
          value={data.sommeDemandee}
          onChange={v => {
            onChange('sommeDemandee', v)
            onChange('fraisFinancement', v ? (parseFloat(v) * 0.05).toFixed(0) : '')
            onChange('sommeTotaleARembourser', v ? (parseFloat(v) * 1.05).toFixed(0) : '')
          }}
          placeholder=""
          suffix="XAF"
        />
        <InputField
          label="Frais de financements"
          value={data.fraisFinancement || frais}
          onChange={v => { onChange('fraisFinancement', v); }}
          placeholder=""
          suffix="XAF"
          disabled
        />
        <div style={{ gridColumn: '1 / -1' }}>
          <InputField
            label="Somme totale à rembourser"
            value={data.sommeTotaleARembourser || total}
            onChange={v => { onChange('sommeTotaleARembourser', v); }}
            placeholder=""
            suffix="XAF"
            disabled
          />
        </div>
      </div>

      <ActionButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 4 — Échéancier
// ─────────────────────────────────────────────────────────────────────────────

function Step4({ data, onChangeEcheances, onChangeNombre, onNext, onBack }: {
  data: FormData
  onChangeEcheances: (echeances: EcheanceItem[]) => void
  onChangeNombre: (n: number) => void
  onNext: () => void
  onBack: () => void
}): JSX.Element {
  const STEPS_META = [
    { label: 'Informations\nPersonnelles' },
    { label: 'Identité' },
    { label: 'Détails du\nfinancement' },
    { label: 'Échéancier' },
    { label: 'Justificatifs de demande\nde financement' },
    { label: 'Marche à suivre' },
  ]

  function handleNombreChange(n: number): void {
    onChangeNombre(n)
    const current = data.echeances
    if (n > current.length) {
      const added = Array.from({ length: n - current.length }, (_, i) => ({
        id: `ech-${Date.now()}-${i}`,
        date: '',
        somme: '',
      }))
      onChangeEcheances([...current, ...added])
    } else {
      onChangeEcheances(current.slice(0, n))
    }
  }

  function updateEcheance(idx: number, field: 'date' | 'somme', value: string): void {
    const updated = data.echeances.map((e, i) => i === idx ? { ...e, [field]: value } : e)
    onChangeEcheances(updated)
  }

  const echeanceLabels: Record<number, string> = { 0: '1', 1: '2', 2: 'x' }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={4} totalVisibleSteps={3} startStep={4} />

      {/* Number of échéances */}
      <div style={{ marginBottom: 28, maxWidth: 240 }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: '#374151', marginBottom: 8, fontFamily: 'var(--font-body)', fontWeight: 500 }}>
          Choisissez le nombre d'échéances
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="number"
            min={1}
            max={12}
            value={data.nombreEcheances}
            onChange={e => { handleNombreChange(parseInt(e.target.value) || 1); }}
            style={{ ...inputStyle, paddingRight: 36 }}
            onFocus={e => { e.currentTarget.style.borderColor = '#2563EB' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2' }}
          />
          <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <button onClick={() => { handleNombreChange(Math.min(12, data.nombreEcheances + 1)); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', lineHeight: 1, padding: 0 }}>▲</button>
            <button onClick={() => { handleNombreChange(Math.max(1, data.nombreEcheances - 1)); }} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', lineHeight: 1, padding: 0 }}>▼</button>
          </div>
        </div>
      </div>

      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#1A2332', textAlign: 'center', marginBottom: 20 }}>
        Veuillez renseigner les différentes dates
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {data.echeances.map((ech, idx) => (
          <div key={ech.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
            <InputField
              label={`Échéance ${echeanceLabels[idx] ?? idx + 1}`}
              type="date"
              value={ech.date}
              onChange={v => { updateEcheance(idx, 'date', v); }}
              placeholder="jj/mm/aa"
            />
            <InputField
              label="Somme à verser"
              value={ech.somme}
              onChange={v => { updateEcheance(idx, 'somme', v); }}
              placeholder=""
              suffix="XAF"
            />
          </div>
        ))}
      </div>

      <ActionButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 5 — Justificatifs
// ─────────────────────────────────────────────────────────────────────────────

function Step5({ data, onChangeJustification, onChangeJustificatifs, onNext, onBack }: {
  data: FormData
  onChangeJustification: (v: string) => void
  onChangeJustificatifs: (items: JustificatifItem[]) => void
  onNext: () => void
  onBack: () => void
}): JSX.Element {
  const STEPS_META = [
    { label: 'Informations\nPersonnelles' },
    { label: 'Identité' },
    { label: 'Détails du\nfinancement' },
    { label: 'Échéancier' },
    { label: 'Justificatifs de demande\nde financement' },
    { label: 'Marche à suivre' },
  ]

  const MAX_CHARS = 5000

  function addJustificatif(): void {
    const i = document.createElement('input')
    i.type = 'file'
    i.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0]
      if (f) {
        onChangeJustificatifs([...data.justificatifs, { id: `j-${Date.now()}`, nom: f.name }])
      }
    }
    i.click()
  }

  function removeJustificatif(id: string): void {
    onChangeJustificatifs(data.justificatifs.filter(j => j.id !== id))
  }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginBottom: 4, fontFamily: 'var(--font-body)' }}>Content</p>
      <Stepper steps={STEPS_META} currentStep={5} totalVisibleSteps={3} startStep={4} />

      <p style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', marginBottom: 16, fontFamily: 'var(--font-body)' }}>
        Expliquez votre situation, et dites pourquoi vous sollicitez un financement
      </p>

      {/* Textarea */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <textarea
          value={data.justification}
          onChange={e => { if (e.target.value.length <= MAX_CHARS) onChangeJustification(e.target.value) }}
          rows={8}
          style={{
            width: '100%',
            padding: '16px',
            border: '1px solid #E5E9F2',
            borderRadius: 10,
            fontSize: '0.88rem',
            fontFamily: 'var(--font-body)',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
            background: '#F8FAFC',
            color: '#1A2332',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.background = '#fff' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.background = '#F8FAFC' }}
        />
        <span style={{ position: 'absolute', bottom: 10, right: 14, fontSize: '0.75rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
          {data.justification.length}/{MAX_CHARS}
        </span>
      </div>

      {/* Justificatifs uploader */}
      <div style={{ border: '1px solid #E5E9F2', borderRadius: 12, padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <button
            onClick={addJustificatif}
            style={{
              padding: '10px 28px',
              borderRadius: 8,
              border: 'none',
              background: '#428959',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            Ajouter un justificatif
          </button>
        </div>

        {data.justificatifs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.justificatifs.map(j => (
              <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid #F18F01',
                }}>
                  <div style={{
                    background: '#F18F01',
                    color: '#fff',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    whiteSpace: 'nowrap',
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {j.nom}
                  </div>
                  <div style={{ flex: 1, height: 10, background: '#FFF4E0', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: '#F18F01', opacity: 0.3 }} />
                  </div>
                </div>
                <button
                  onClick={() => {/* rename */ }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, color: '#F18F01' }}
                  title="Renommer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button
                  onClick={() => { removeJustificatif(j.id); }}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, color: '#C73E1D' }}
                  title="Supprimer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ActionButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 6 — Marche à suivre (Summary + Confirmation)
// ─────────────────────────────────────────────────────────────────────────────

function Step6({ onBack, onTerminer, onCancel }: {
  onBack: () => void
  onTerminer: () => void
  onCancel: () => void
}): JSX.Element {
  const STEPS_META = [
    { label: 'Informations\nPersonnelles' },
    { label: 'Identité' },
    { label: 'Détails du\nfinancement' },
    { label: 'Échéancier' },
    { label: 'Justificatifs de demande\nde financement' },
    { label: 'Marche à suivre' },
  ]

  const [confirmModal, setConfirmModal] = useState<'submit' | 'cancel' | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const ETAPES = [
    { label: 'Etape 1', done: true },
    { label: 'Etape 2', done: false },
    { label: 'Etape x', done: false },
  ]

  async function handleConfirmSubmit(): Promise<void> {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setConfirmModal(null)
    onTerminer()
  }

  function handleConfirmCancel(): void {
    setConfirmModal(null)
    onCancel()
  }

  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={6} totalVisibleSteps={3} startStep={4} />

      {/* Vertical timeline */}
      <div style={{ maxWidth: 400, margin: '0 auto 32px', position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: 19,
          top: 20,
          bottom: 20,
          width: 2,
          background: '#D1D5DB',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {ETAPES.map((etape, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: etape.done ? '#2563EB' : '#fff',
                border: '2px solid #2563EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: etape.done ? '#fff' : '#2563EB',
                flexShrink: 0,
                zIndex: 1,
              }}>
                {etape.done ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB', opacity: 0.4 }} />
                )}
              </div>
              <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1A2332', fontFamily: 'var(--font-display)' }}>
                {etape.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Download button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 24px', borderRadius: 8,
          border: 'none', background: '#428959', color: '#fff',
          fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Télécharger le résumé de ma demande
        </button>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        <button
          onClick={() => { setConfirmModal('cancel'); }}
          style={{
            padding: '11px 24px', borderRadius: 8, border: '1.5px solid #E5E9F2',
            background: '#E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.9rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Annuler
        </button>
        <button
          onClick={() => { setConfirmModal('submit'); }}
          style={{
            padding: '11px 28px', borderRadius: 8, border: 'none',
            background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          Terminer
        </button>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          message={
            confirmModal === 'submit'
              ? "Confirmez-vous l'envoie de votre demande de financement ?"
              : 'Voulez-vous vraiment annuler votre demande en cours ?'
          }
          onConfirm={() => {
            if (confirmModal === 'submit') void handleConfirmSubmit()
            else handleConfirmCancel()
          }}
          onCancel={() => { setConfirmModal(null); }}
          submitting={submitting}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────

function ConfirmModal({ message, onConfirm, onCancel, submitting = false }: {
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
        {/* Warning icon — positioned at top center */}
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

// ─────────────────────────────────────────────────────────────────────────────
// Shared Action Buttons
// ─────────────────────────────────────────────────────────────────────────────

function ActionButtons({ onBack, onNext, backLabel = 'Retour', nextLabel = 'Suivant' }: {
  onBack: () => void
  onNext: () => void
  backLabel?: string
  nextLabel?: string
}): JSX.Element {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 36 }}>
      <button
        onClick={onBack}
        style={{
          padding: '11px 28px', borderRadius: 8, border: '1.5px solid #E5E9F2',
          background: '#E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.9rem',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}
      >
        {backLabel}
      </button>
      <button
        onClick={onNext}
        style={{
          padding: '11px 32px', borderRadius: 8, border: 'none',
          background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: '0.9rem',
          cursor: 'pointer', fontFamily: 'var(--font-body)',
          boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
        }}
      >
        {nextLabel}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// List View — Demandes de financement table
// ─────────────────────────────────────────────────────────────────────────────

function FinancementListView({ demandes, onNew }: {
  demandes: FinancementDemande[]
  onNew: () => void
}): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FinancementStatut | 'ALL'>('ALL')

  const FILTER_BUTTONS: Array<{ statut: FinancementStatut; label: string; dotColor: string; borderColor: string; activeBg: string }> = [
    { statut: 'EN_PREPARATION',      label: 'En préparation',        dotColor: '#F18F01', borderColor: '#F18F01', activeBg: '#FFF7ED' },
    { statut: 'EN_ATTENTE_PAIEMENT', label: 'En attente de paiement', dotColor: '#F5B942', borderColor: '#F5B942', activeBg: '#FFFBEB' },
    { statut: 'PAIEMENT_EN_ATTENTE', label: 'Paiement en attente',   dotColor: '#2563EB', borderColor: '#2563EB', activeBg: '#EBF0FA' },
    { statut: 'CLOTURE',             label: 'Clôturée',              dotColor: '#94A3B8', borderColor: '#94A3B8', activeBg: '#F1F5F9' },
    { statut: 'ACCEPTE',             label: 'Payée',                 dotColor: '#428959', borderColor: '#428959', activeBg: '#EAF5EE' },
    { statut: 'EN_COURS',            label: 'Livré',                 dotColor: '#2563EB', borderColor: '#2563EB', activeBg: '#EBF0FA' },
  ]

  function formatMontant(n: number): string {
    return n === 0 ? '0' : `${(n / 1000).toFixed(0)}.000.000 XAF`
  }

  function renderDocumentCell(doc: string | null, statut: FinancementStatut): JSX.Element {
    if (!doc || statut === 'EN_COURS' || statut === 'REJETE') {
      return <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Aucun document</span>
    }
    if (doc === 'signer') {
      return (
        <button style={{
          padding: '5px 14px', borderRadius: 999, border: 'none',
          background: '#7C3AED', color: '#fff',
          fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}>
          Signer
        </button>
      )
    }
    return (
      <button style={{
        padding: '5px 14px', borderRadius: 999, border: 'none',
        background: '#2563EB', color: '#fff',
        fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
        fontFamily: 'var(--font-body)',
      }}>
        Télécharger
      </button>
    )
  }

  const filtered = activeFilter === 'ALL'
    ? demandes
    : demandes.filter(d => d.statut === activeFilter)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* New request button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <ProtectedComponent requires="ticket:create">
          <button
            onClick={onNew}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: '#F18F01', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(241,143,1,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Nouvelle demande
          </button>
        </ProtectedComponent>
      </div>

      {/* White card */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        {/* Status filter pills — 2 rows like Figma */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {FILTER_BUTTONS.map(btn => {
            const isActive = activeFilter === btn.statut
            return (
              <button
                key={btn.statut}
                onClick={() => { setActiveFilter(isActive ? 'ALL' : btn.statut); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: `1.5px solid ${isActive ? btn.borderColor : '#E5E9F2'}`,
                  background: isActive ? btn.activeBg : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#1A2332' : '#64748B',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isActive ? btn.dotColor : '#D1D5DB',
                  flexShrink: 0,
                }} />
                {btn.label}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                {['No', 'Nom', 'Somme financement', 'Pour service', 'Date de la demande', 'Somme déjà remboursé', 'Somme restante', 'Document associé', 'Statut', 'Action'].map(col => (
                  <th key={col} style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #E5E9F2',
                    borderRight: '1px solid #F0F2F8',
                    fontSize: '0.78rem',
                    background: '#FAFBFE',
                    whiteSpace: col === 'Somme déjà remboursé' || col === 'Somme restante' ? 'normal' : 'nowrap',
                    maxWidth: col === 'Somme déjà remboursé' || col === 'Somme restante' ? 90 : 'auto',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => {
                const cfg = STATUT_CONFIG[d.statut]
                return (
                  <tr
                    key={d.id}
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#FAFBFE' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                  >
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151', fontWeight: 600 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.nom ?? '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151', fontWeight: 600 }}>
                      {formatMontant(d.sommeFinancement)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.pourService ?? '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.dateDemande
                        ? new Intl.DateTimeFormat('fr-FR').format(new Date(d.dateDemande))
                        : '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.sommeDejaRembourse === 0 ? '0' : formatMontant(d.sommeDejaRembourse)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.sommeRestante === 0 ? '0' : formatMontant(d.sommeRestante)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8' }}>
                      {renderDocumentCell(d.documentAssocie, d.statut)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <button title="Voir" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#2563EB', padding: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <button title="Modifier" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button title="Supprimer" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#C73E1D', padding: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer nav */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button style={{
            padding: '10px 28px', borderRadius: 8, border: '1.5px solid #E5E9F2',
            background: '#E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            Retour
          </button>
          <button style={{
            padding: '10px 28px', borderRadius: 8, border: 'none',
            background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main FinancementPage
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  // Step 1
  prenom: 'Moni',
  nom: 'Roy',
  lieuNaissance: '',
  dateNaissance: '',
  adresseComplete: '',
  pays: '',
  ville: '',
  quartier: '',
  telephone: '696418984',
  scanPasseportName: '',
  planLocalisationName: '',
  // Step 2
  scanCNIName: '',
  demiCartePhotoName: '',
  nomPrenomParent1: '',
  telephoneParent1: '',
  lieuResidenceParent1: '',
  nomPrenomParent2: '',
  telephoneParent2: '',
  lieuResidenceParent2: '',
  // Step 3
  serviceAFinancer: 'A.V.I',
  coutService: '',
  financementMaximal: '',
  sommeDemandee: '',
  fraisFinancement: '',
  sommeTotaleARembourser: '',
  // Step 4
  nombreEcheances: 3,
  echeances: [
    { id: 'e1', date: '', somme: '' },
    { id: 'e2', date: '', somme: '' },
    { id: 'e3', date: '', somme: '' },
  ],
  // Step 5
  justification: '',
  justificatifs: [
    { id: 'j1', nom: 'Document_1.pdf' },
    { id: 'j2', nom: 'Document_2.pdf' },
  ],
}

export function FinancementPage({ initialView = 'list' }: { initialView?: 'list' | 'form' }): JSX.Element {
  const [view, setView] = useState<'list' | 'form'>(initialView)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({ ...INITIAL_FORM })
  const [demandes, setDemandes] = useState([...MOCK_FINANCEMENT_DEMANDES])

  const handleChange = useCallback((key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }, [])

  function startNew(): void {
    setForm({ ...INITIAL_FORM })
    setStep(1)
    setView('form')
  }

  function handleSubmit(): void {
    const newDemande: FinancementDemande = {
      id: `fin-${Date.now()}`,
      nom: form.nom || null,
      sommeFinancement: form.sommeDemandee ? parseFloat(form.sommeDemandee) : 1000000,
      pourService: form.serviceAFinancer || null,
      dateDemande: new Date().toISOString().split('T')[0],
      sommeDejaRembourse: 0,
      sommeRestante: form.sommeTotaleARembourser ? parseFloat(form.sommeTotaleARembourser) : 0,
      documentAssocie: null,
      statut: 'EN_PREPARATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'current-user',
    }
    setDemandes(prev => [newDemande, ...prev])
    setView('list')
    setStep(1)
  }

  // Render the multi-step form
  function renderStep(): JSX.Element {
    switch (step) {
      case 1:
        return (
          <Step1
            data={form}
            onChange={handleChange}
            onNext={() => { setStep(2); }}
            onCancel={() => { setView('list'); }}
          />
        )
      case 2:
        return (
          <Step2
            data={form}
            onChange={handleChange}
            onNext={() => { setStep(3); }}
            onBack={() => { setStep(1); }}
          />
        )
      case 3:
        return (
          <Step3
            data={form}
            onChange={handleChange}
            onNext={() => { setStep(4); }}
            onBack={() => { setStep(2); }}
          />
        )
      case 4:
        return (
          <Step4
            data={form}
            onChangeEcheances={echeances => { setForm(prev => ({ ...prev, echeances })); }}
            onChangeNombre={n => { setForm(prev => ({ ...prev, nombreEcheances: n })); }}
            onNext={() => { setStep(5); }}
            onBack={() => { setStep(3); }}
          />
        )
      case 5:
        return (
          <Step5
            data={form}
            onChangeJustification={v => { setForm(prev => ({ ...prev, justification: v })); }}
            onChangeJustificatifs={items => { setForm(prev => ({ ...prev, justificatifs: items })); }}
            onNext={() => { setStep(6); }}
            onBack={() => { setStep(4); }}
          />
        )
      case 6:
        return (
          <Step6
            onBack={() => { setStep(5); }}
            onTerminer={handleSubmit}
            onCancel={() => { setView('list'); }}
          />
        )
      default:
        return <div />
    }
  }

  if (view === 'list') {
    return <FinancementListView demandes={demandes} onNew={startNew} />
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Back button */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => { setView('list'); setStep(1); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B',
            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour aux demandes
        </button>
      </div>

      {/* Form card */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E5E9F2',
        boxShadow: '0 4px 24px rgba(37,99,235,0.07)',
        overflow: 'hidden',
      }}>
        {renderStep()}
      </div>
    </div>
  )
}