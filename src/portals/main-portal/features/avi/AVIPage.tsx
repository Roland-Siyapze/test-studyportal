/* eslint-disable @typescript-eslint/restrict-plus-operands */
/**
 * @file AVIPage.tsx  (v3 — complete Figma match)
 * @description "Obtenir mon A.V.I" — full 10-step multi-page flow.
 *
 *   Steps (matching Figma screenshots):
 *     1  Informations Personnelles          (image 2)
 *     2  Détails de la Formation            (image 3)
 *     3  Informations Financières & Autres  (image 4)
 *     4  Principe de paiement               (image 5, 6, 7)
 *     5  Mode de paiement                   (image 8, 9)
 *     6  Établissement bancaire             (image 10)
 *     7  Coordonnées bancaires              (image 11, 12)
 *     8  Proforma                           (image 13)
 *     9  Mon contrat                        (image 16)
 *     10 Dépôt de preuve                    (step 10 in list)
 *
 *   List view matches Figma image 1 (Parcours à suivre).
 *   Notifications match Figma image 19.
 *   Signature modal matches Figma image 18.
 *   Success screen matches Figma image 15.
 *   Félicitations modal matches Figma image 17.
 *
 *   Permissions:
 *     - document:read   → can view AVI flow (read-only)
 *     - document:upload → can fill & submit forms
 */

import type { JSX } from 'react'
import { useState } from 'react'
import { usePermissions } from '@hooks/usePermissions'
import { NotificationModal, SignatureModal } from './NotificationModal'
import { AVIStepper } from './AVIStepper'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type StepStatus = 'done' | 'current' | 'upcoming'

interface AVIStep {
  number: number
  title: string
  status: StepStatus
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI helpers
// ─────────────────────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
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

function addFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
  e.currentTarget.style.borderColor = '#2A4F87'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.12)'
  e.currentTarget.style.background = '#fff'
}

function removeFocus(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void {
  e.currentTarget.style.borderColor = '#E5E9F2'
  e.currentTarget.style.boxShadow = 'none'
  e.currentTarget.style.background = '#F8FAFC'
}

function Label({ text, required }: { text: string; required?: boolean }): JSX.Element {
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

function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Suivant',
  backLabel = 'Retour',
  nextDisabled = false,
  loading = false,
}: {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  backLabel?: string
  nextDisabled?: boolean
  loading?: boolean
}): JSX.Element {
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

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Informations Personnelles  (image 2)
// ─────────────────────────────────────────────────────────────────────────────

function Step1({ onNext, onCancel, canEdit }: { onNext: () => void; onCancel: () => void; canEdit: boolean }): JSX.Element {
  const [firstName, setFirstName] = useState('Moni')
  const [lastName, setLastName] = useState('Roy')
  const [email, setEmail] = useState('Moniroy22@mail.com')
  const [phone, setPhone] = useState('696418984')
  const [passportNumber, setPassportNumber] = useState('')
  const [passportDelivery, setPassportDelivery] = useState('')
  const [passportExpiry, setPassportExpiry] = useState('')
  const [fileName, setFileName] = useState('Aucun fichier sélectionné')

  const stepper = [
    { number: 1, label: 'Informations\nPersonnelles' },
    { number: 2, label: 'Détails de\nla Formation' },
    { number: 3, label: 'Informations Financières\net Autres Détails' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px' }}>
        {/* Prénom */}
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            value={firstName}
            readOnly={!canEdit}
            onChange={e => { canEdit && setFirstName(e.target.value) }}
            placeholder="Prénom"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Numéro de passeport */}
        <div>
          <input
            style={inputStyle}
            value={passportNumber}
            readOnly={!canEdit}
            onChange={e => { canEdit && setPassportNumber(e.target.value) }}
            placeholder="Numéro de passeport"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Nom */}
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            value={lastName}
            readOnly={!canEdit}
            onChange={e => { canEdit && setLastName(e.target.value) }}
            placeholder="Nom"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Date de délivrance du passeport */}
        <div>
          <Label text="Date de délivrance du passeport" />
          <input
            type="date"
            style={inputStyle}
            value={passportDelivery}
            readOnly={!canEdit}
            onChange={e => { canEdit && setPassportDelivery(e.target.value) }}
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Email */}
        <div>
          <input
            style={{ ...inputStyle, background: !canEdit ? '#F1F5F9' : undefined }}
            type="email"
            value={email}
            readOnly={!canEdit}
            onChange={e => { canEdit && setEmail(e.target.value) }}
            placeholder="Email"
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Date d'expiration du passeport */}
        <div>
          <Label text="Date d'expiration du passeport" />
          <input
            type="date"
            style={inputStyle}
            value={passportExpiry}
            readOnly={!canEdit}
            onChange={e => { canEdit && setPassportExpiry(e.target.value) }}
            onFocus={addFocus}
            onBlur={removeFocus}
          />
        </div>

        {/* Phone */}
        <div>
          <Label text="Numéro de téléphone" />
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 14px',
              border: '1.5px solid #E5E9F2',
              borderRadius: 10,
              background: '#F8FAFC',
              fontSize: '0.88rem',
              fontFamily: 'var(--font-body)',
              color: '#374151',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}>
              🇨🇲 +237
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={phone}
              readOnly={!canEdit}
              onChange={e => { canEdit && setPhone(e.target.value) }}
              placeholder="6XX XXX XXX"
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
        </div>

        {/* Scan du passeport */}
        <div>
          <Label text="Scan du passeport" />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = '.pdf,.jpg,.png'
                input.onchange = (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0]
                  if (f) setFileName(f.name)
                }
                input.click()
              }}
              style={{
                padding: '11px 16px',
                borderRadius: 10,
                border: '1.5px solid #E5E9F2',
                background: canEdit ? '#fff' : '#F1F5F9',
                color: '#374151',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: canEdit ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
              }}
            >
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'var(--font-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {fileName}
            </span>
          </div>
        </div>
      </div>

      <NavButtons
        onBack={onCancel}
        backLabel="Annuler"
        onNext={canEdit ? onNext : undefined}
        nextLabel="Suivant"
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Détails de la Formation  (image 3)
// ─────────────────────────────────────────────────────────────────────────────

function Step2({ onNext, onBack, canEdit }: { onNext: () => void; onBack: () => void; canEdit: boolean }): JSX.Element {
  const [etablissement, setEtablissement] = useState('')
  const [formation, setFormation] = useState('')
  const [ville, setVille] = useState('')
  const [dateDebut, setDateDebut] = useState('')
  const [fileName, setFileName] = useState('Aucun fichier sélectionné')

  const stepper = [
    { number: 1, label: 'Mes informations' },
    { number: 2, label: 'Détails de la formation' },
    { number: 3, label: 'Payment info\nLorem Ipsum is simply' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={2} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 500, margin: '0 auto' }}>
        <input style={inputStyle} value={etablissement} readOnly={!canEdit}
          onChange={e => { canEdit && setEtablissement(e.target.value) }}
          placeholder="Nom de l'établissement d'accueil"
          onFocus={addFocus} onBlur={removeFocus}
        />
        <input style={inputStyle} value={formation} readOnly={!canEdit}
          onChange={e => { canEdit && setFormation(e.target.value) }}
          placeholder="Titre de la formation"
          onFocus={addFocus} onBlur={removeFocus}
        />
        <input style={inputStyle} value={ville} readOnly={!canEdit}
          onChange={e => { canEdit && setVille(e.target.value) }}
          placeholder="Ville"
          onFocus={addFocus} onBlur={removeFocus}
        />
        <div>
          <Label text="Date de début de la formation" />
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              style={inputStyle}
              value={dateDebut}
              readOnly={!canEdit}
              onChange={e => { canEdit && setDateDebut(e.target.value) }}
              onFocus={addFocus}
              onBlur={removeFocus}
            />
          </div>
        </div>
        <div>
          <Label text="Attestation d'inscription / Lettre d'admission" />
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              disabled={!canEdit}
              onClick={() => {
                if (!canEdit) return
                const input = document.createElement('input')
                input.type = 'file'
                input.onchange = (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0]
                  if (f) setFileName(f.name)
                }
                input.click()
              }}
              style={{
                padding: '11px 16px',
                borderRadius: 10,
                border: '1.5px solid #E5E9F2',
                background: canEdit ? '#fff' : '#F1F5F9',
                color: '#374151',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: canEdit ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)',
              }}
            >
              Choisir un fichier
            </button>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{fileName}</span>
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={canEdit ? onNext : undefined} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Informations Financières  (image 4)
// ─────────────────────────────────────────────────────────────────────────────

function Step3({ onNext, onBack, canEdit }: { onNext: () => void; onBack: () => void; canEdit: boolean }): JSX.Element {
  const [annee, setAnnee] = useState('2024/2025')
  const [renouvellement, setRenouvellement] = useState('Non')
  const [montant, setMontant] = useState('')
  const [destination, setDestination] = useState('Etudes')
  const [devise, setDevise] = useState('FCFA')
  const [assurance, setAssurance] = useState('Oui')
  const [duree, setDuree] = useState('12 mois')

  const stepper = [
    { number: 1, label: 'Mes informations' },
    { number: 2, label: 'Détails de la formation' },
    { number: 3, label: 'Informations Financières\net Autres Détails' },
  ]

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: canEdit ? 'pointer' : 'not-allowed',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      {/* Stepper label from Figma */}
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={3} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 28px', maxWidth: 640, margin: '0 auto' }}>
        <div>
          <Label text="Année scolaire" />
          <select style={selectStyle} value={annee} disabled={!canEdit} onChange={e => { canEdit && setAnnee(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>2024/2025</option>
            <option>2025/2026</option>
            <option>2023/2024</option>
          </select>
        </div>
        <div>
          <Label text="Est ce un renouvellement ?" />
          <select style={selectStyle} value={renouvellement} disabled={!canEdit} onChange={e => { canEdit && setRenouvellement(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>Non</option>
            <option>Oui</option>
          </select>
        </div>
        <div>
          <Label text="Montant à recevoir par mois en euro" />
          <input style={inputStyle} value={montant} readOnly={!canEdit}
            onChange={e => { canEdit && setMontant(e.target.value) }}
            placeholder="Exemple: 700€"
            onFocus={addFocus} onBlur={removeFocus}
          />
        </div>
        <div>
          <Label text="Je vais en France pour" />
          <select style={selectStyle} value={destination} disabled={!canEdit} onChange={e => { canEdit && setDestination(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>Etudes</option>
            <option>Stage</option>
            <option>Formation professionnelle</option>
          </select>
        </div>
        <div>
          <Label text="Devise de votre pays d'origine" />
          <select style={selectStyle} value={devise} disabled={!canEdit} onChange={e => { canEdit && setDevise(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>FCFA</option>
            <option>EUR</option>
            <option>USD</option>
          </select>
        </div>
        <div>
          <Label text="ACS Assurance France" />
          <select style={selectStyle} value={assurance} disabled={!canEdit} onChange={e => { canEdit && setAssurance(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>Oui</option>
            <option>Non</option>
          </select>
        </div>
        <div>
          <Label text="Durée de l'AVI" />
          <select style={selectStyle} value={duree} disabled={!canEdit} onChange={e => { canEdit && setDuree(e.target.value) }} onFocus={addFocus} onBlur={removeFocus}>
            <option>12 mois</option>
            <option>6 mois</option>
            <option>24 mois</option>
          </select>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={canEdit ? onNext : undefined} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Principe de paiement  (images 5, 6, 7)
// ─────────────────────────────────────────────────────────────────────────────

function Step4({ onNext, onBack, canEdit }: { onNext: () => void; onBack: () => void; canEdit: boolean }): JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null)

  const options = [
    { id: 'depot', label: 'Dépôt Bancaire', description: null },
    { id: 'virement', label: 'Virement Bancaire Direct', description: null },
  ]

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={4} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Sélectionnez votre mode de paiement
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
        {options.map(opt => (
          <div key={opt.id}>
            <button
              onClick={() => { if (canEdit) setExpanded(expanded === opt.id ? null : opt.id) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderRadius: 12,
                border: `1.5px solid ${expanded === opt.id ? '#2A4F87' : '#E5E9F2'}`,
                background: expanded === opt.id ? '#EBF0FA' : '#fff',
                cursor: canEdit ? 'pointer' : 'default',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A2332',
                transition: 'all 0.15s',
              }}
            >
              {opt.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"
                style={{ transition: 'transform 0.2s', transform: expanded === opt.id ? 'rotate(180deg)' : 'none' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit ? onNext : undefined} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Mode de paiement  (images 8, 9)
// ─────────────────────────────────────────────────────────────────────────────

const PAYMENT_OPTIONS = [
  {
    id: 'paiement-total',
    label: 'Paiement total',
    description: 'Choisissez cette option si vous souhaitez payer la totalité des frais.',
  },
  {
    id: 'paiement-financement',
    label: 'Paiement par financement',
    description: 'Choisissez cette option si vous avez souscrit à un financement.',
  },
]

function Step5({ onNext, onBack, canEdit }: { onNext: () => void; onBack: () => void; canEdit: boolean }): JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  function toggle(id: string): void {
    if (!canEdit) return
    if (expanded === id) {
      setExpanded(null)
    } else {
      setExpanded(id)
      setSelected(id)
    }
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Content</p>
      <AVIStepper steps={stepper} current={5} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Sélectionnez votre mode de paiement
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
        {PAYMENT_OPTIONS.map(opt => (
          <div key={opt.id}>
            <button
              onClick={() => { toggle(opt.id) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderRadius: expanded === opt.id ? '12px 12px 0 0' : 12,
                border: `1.5px solid ${expanded === opt.id ? '#2A4F87' : '#E5E9F2'}`,
                borderBottom: expanded === opt.id ? 'none' : undefined,
                background: '#fff',
                cursor: canEdit ? 'pointer' : 'default',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A2332',
              }}
            >
              {opt.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"
                style={{ transition: 'transform 0.2s', transform: expanded === opt.id ? 'rotate(180deg)' : 'none' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {expanded === opt.id && (
              <div style={{
                padding: '14px 20px',
                background: '#F8FAFC',
                border: '1.5px solid #2A4F87',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#2A4F87',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  {opt.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit && selected ? onNext : undefined} nextDisabled={!selected} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5b — Mode de paiement étendu  (image 8 — Dépôt Bancaire + Virement + Mobile Money)
// Shown after step 4 selection — reusing Step5 above but with banking options
// ─────────────────────────────────────────────────────────────────────────────

const BANKING_OPTIONS = [
  {
    id: 'depot-bancaire',
    label: 'Dépôt Bancaire',
    description: 'Effectuez un dépôt sur le compte Boaz Study, puis téléchargez la preuve de paiement directement dans l\'application.',
  },
  {
    id: 'virement-direct',
    label: 'Virement Bancaire Direct',
    description: 'Effectuez un virement bancaire direct sur le compte Boaz Study.',
  },
  {
    id: 'mobile-money',
    label: 'Mobile Money',
    description: 'Payez via Mobile Money (Orange Money, MTN Mobile Money).',
  },
]

function Step5b({ onNext, onBack, canEdit }: { onNext: () => void; onBack: () => void; canEdit: boolean }): JSX.Element {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  function toggle(id: string): void {
    if (!canEdit) return
    if (expanded === id) {
      setExpanded(null)
    } else {
      setExpanded(id)
      setSelected(id)
    }
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={5} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Sélectionnez votre mode de paiement
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
        {BANKING_OPTIONS.map(opt => (
          <div key={opt.id}>
            <button
              onClick={() => { toggle(opt.id) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderRadius: expanded === opt.id ? '12px 12px 0 0' : 12,
                border: `1.5px solid ${expanded === opt.id ? '#2A4F87' : '#E5E9F2'}`,
                borderBottom: expanded === opt.id ? 'none' : undefined,
                background: '#fff',
                cursor: canEdit ? 'pointer' : 'default',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A2332',
              }}
            >
              {opt.label}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5"
                style={{ transition: 'transform 0.2s', transform: expanded === opt.id ? 'rotate(180deg)' : 'none' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {expanded === opt.id && (
              <div style={{
                padding: '14px 20px',
                background: '#F8FAFC',
                border: '1.5px solid #2A4F87',
                borderTop: 'none',
                borderRadius: '0 0 12px 12px',
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#2A4F87',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-body)',
                  textAlign: 'center',
                  lineHeight: 1.5,
                }}>
                  {opt.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit && selected ? onNext : undefined} nextDisabled={!selected} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Établissement bancaire  (image 10)
// ─────────────────────────────────────────────────────────────────────────────

const BANKS = [
  {
    id: 'societe-generale',
    name: 'Société Générale',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 20, background: '#CC0000', borderRadius: 2 }} />
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#CC0000', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
          SOCIETE<br/>GENERALE
        </span>
      </div>
    ),
  },
  {
    id: 'banque-atlantique',
    name: 'Banque Atlantique',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#F59E0B', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
          BANQUE<br/>ATLANTIQUE
        </span>
      </div>
    ),
  },
]

function Step6({ onNext, onBack, canEdit, onBankSelected }: {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
  onBankSelected: (bank: string) => void
}): JSX.Element {
  const [selectedBank, setSelectedBank] = useState<string | null>(null)

  const stepper = [
    { number: 4, label: 'Principe de paiement' },
    { number: 5, label: 'Mode de paiement' },
    { number: 6, label: 'Etablissement bancaire' },
  ]

  function selectBank(id: string): void {
    if (!canEdit) return
    setSelectedBank(id)
    onBankSelected(id)
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={6} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 32,
      }}>
        Choix de l'établissement bancaire
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440, margin: '0 auto' }}>
        {BANKS.map(bank => (
          <button
            key={bank.id}
            onClick={() => { selectBank(bank.id) }}
            style={{
              padding: '20px 28px',
              borderRadius: 12,
              border: `2px solid ${selectedBank === bank.id ? '#2A4F87' : '#E5E9F2'}`,
              background: selectedBank === bank.id ? '#EBF0FA' : '#fff',
              cursor: canEdit ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
              boxShadow: selectedBank === bank.id ? '0 4px 12px rgba(42,79,135,0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {bank.logo}
          </button>
        ))}
      </div>

      <NavButtons onBack={onBack} onNext={canEdit && selectedBank ? onNext : undefined} nextLabel="Envoyer" nextDisabled={!selectedBank} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Coordonnées bancaires  (images 11, 12)
// ─────────────────────────────────────────────────────────────────────────────

const RIB_DATA = {
  'societe-generale': {
    titulaire: 'BOAZ STUDY',
    adresse: '16 RUE DE BOISDENIER',
    ville: '37000 TOURS',
    domiciliation: 'TOURS (02130)',
    banque: '30003',
    guichet: '02130',
    compte: '00020999101',
    cle: '35',
    iban: 'FR76 3000 3021 3000 0209 9910 135',
    bic: 'SOGEFRPP',
    logo: (
      <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#CC0000', letterSpacing: '0.03em', fontFamily: 'var(--font-display)', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', width: 24, height: 18, background: '#CC0000', borderRadius: 2, marginRight: 6, verticalAlign: 'middle' }} />
        SOCIETE GENERALE
      </div>
    ),
  },
  'banque-atlantique': {
    titulaire: 'R37 SARL',
    adresse: '16 RUE DE BOISDENIER',
    ville: '37000 TOURS',
    domiciliation: 'TOURS (02130)',
    banque: '30003',
    guichet: '02130',
    compte: '00020999101',
    cle: '35',
    iban: 'FR76 3000 3021 3000 0209 9910 135',
    bic: 'SOGEFRPP',
    logo: (
      <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#F59E0B', letterSpacing: '0.03em', fontFamily: 'var(--font-display)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.7rem' }}>BA</span>
        </div>
        BANQUE ATLANTIQUE
      </div>
    ),
  },
}

function Step7({ onNext, onBack, selectedBank }: {
  onNext: () => void
  onBack: () => void
  selectedBank: string
}): JSX.Element {
  const rib = RIB_DATA[selectedBank as keyof typeof RIB_DATA] ?? RIB_DATA['societe-generale']

  const stepper = [
    { number: 7, label: 'Coordonnées\nbancaires' },
    { number: 8, label: 'Proforma' },
    { number: 9, label: 'Mon contrat' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={7} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 28,
      }}>
        Informations bancaires
      </h2>

      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Bank logo card */}
        <div style={{
          padding: '18px 24px',
          borderRadius: 12,
          border: '1.5px solid #E5E9F2',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {rib.logo}
        </div>

        {/* RIB Card */}
        <div style={{
          border: '1.5px solid #E5E9F2',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <div style={{ padding: '20px 24px', background: '#F8FAFC' }}>
            {/* RIB header */}
            <div style={{
              border: '1px solid #D1D5DB',
              borderRadius: 6,
              overflow: 'hidden',
              background: '#fff',
            }}>
              <div style={{
                background: '#F3F4F6',
                padding: '8px 14px',
                fontWeight: 700,
                fontSize: '0.78rem',
                color: '#374151',
                textAlign: 'center',
                letterSpacing: '0.05em',
                fontFamily: 'var(--font-body)',
                borderBottom: '1px solid #D1D5DB',
              }}>
                RELEVE D'IDENTITE BANCAIRE
              </div>
              <div style={{ padding: '14px 14px' }}>
                <p style={{ fontSize: '0.75rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 4 }}>TITULAIRE DU COMPTE</p>
                <p style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1A2332', fontFamily: 'var(--font-display)', marginBottom: 10 }}>{rib.titulaire}</p>
                <p style={{ fontSize: '0.78rem', color: '#374151', fontFamily: 'var(--font-body)' }}>{rib.adresse}</p>
                <p style={{ fontSize: '0.78rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 12 }}>{rib.ville}</p>

                <p style={{ fontSize: '0.75rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 4 }}>DOMICILIATION : {rib.domiciliation}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 10 }}>
                  {[
                    { label: 'Banque', val: rib.banque },
                    { label: 'Guichet', val: rib.guichet },
                    { label: 'N° de compte', val: rib.compte },
                    { label: 'Clé RIB', val: rib.cle },
                  ].map(col => (
                    <div key={col.label}>
                      <p style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>{col.label}</p>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A2332', fontFamily: 'var(--font-body)' }}>{col.val}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: '0.72rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 2 }}>Identification Internationale (IBAN)</p>
                <p style={{ fontWeight: 800, fontSize: '0.78rem', color: '#1A2332', fontFamily: 'var(--font-body)', marginBottom: 8 }}>{rib.iban}</p>

                <p style={{ fontSize: '0.72rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 2 }}>Identification Internationale de la Banque (BIC)</p>
                <p style={{ fontWeight: 800, fontSize: '0.78rem', color: '#1A2332', fontFamily: 'var(--font-body)' }}>{rib.bic}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Voir la proforma" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 8 — Proforma  (image 13)
// ─────────────────────────────────────────────────────────────────────────────

function Step8({ onNext, onBack }: { onNext: () => void; onBack: () => void }): JSX.Element {
  const [showDoc, setShowDoc] = useState(false)

  const stepper = [
    { number: 7, label: 'Coordonnées bancaires' },
    { number: 8, label: 'Proforma' },
    { number: 9, label: 'Mon contrat' },
  ]

  const proformaLines = [
    { desc: "Montant de la caution bancaire/AVI", qty: 1, unit: "6 812 000 FCFA", total: "6 812 000 FCFA" },
    { desc: "Frais de transfert de Fonds", qty: 1, unit: "170 300 FCFA", total: "170 300 FCFA" },
    { desc: "Frais AVI", qty: 1, unit: "230 000 FCFA", total: "230 000 FCFA" },
    { desc: "Frais ACS Assurance France", qty: 1, unit: "50 435 FCFA", total: "50 435 FCFA" },
    { desc: "Frais recherche logement", qty: 0, unit: "0", total: "0" },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={8} />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Left: Click targets */}
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.2rem',
            color: '#1A2332',
            marginBottom: 20,
          }}>
            Cliquez pour voir vos proformas
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Proforma de service', 'Proforma de financement'].map((label, idx) => (
              <button
                key={label}
                onClick={() => { setShowDoc(idx === 0) }}
                style={{
                  padding: '22px 24px',
                  borderRadius: 12,
                  border: `2px solid ${showDoc && idx === 0 ? '#2A4F87' : '#E5E9F2'}`,
                  background: showDoc && idx === 0 ? '#EBF0FA' : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#1A2332',
                  textAlign: 'left',
                  borderLeft: '4px solid #2A4F87',
                  transition: 'all 0.15s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Preview */}
        {showDoc && (
          <div style={{
            width: 340,
            flexShrink: 0,
            border: '1px solid #E5E9F2',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-body)',
            animation: 'fadeIn 0.2s ease',
          }}>
            {/* Header */}
            <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E5E9F2' }}>
              <p style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: 2 }}>AVI</p>
              <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1A2332', fontFamily: 'var(--font-display)' }}>Ma Proforma</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: '0.65rem', color: '#2A4F87', cursor: 'pointer', textDecoration: 'underline' }}>Proforma</span>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', cursor: 'pointer' }}>Preuve de paiement</span>
              </div>
            </div>

            <div style={{ padding: '14px 16px' }}>
              {/* Company header */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, background: '#2A4F87', borderRadius: 4 }} />
                  <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#2A4F87' }}>BOAZ-STUDY</span>
                </div>
                <p style={{ fontSize: '0.68rem', color: '#374151', lineHeight: 1.4 }}>
                  Boaz Study Cameroun SAS<br/>
                  Yaoundé-Total Ecole de Police<br/>
                  389 Rue Toyota Bonapriso<br/>
                  B.P: 1230 Douala
                </p>
                <p style={{ fontSize: '0.68rem', color: '#374151', marginTop: 4 }}>Date : 11/03/2025</p>
              </div>

              {/* Client info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: '0.68rem', color: '#374151', lineHeight: 1.4 }}>
                    Payable à BOAZ-STUDY CAMROUN<br/>
                    Banque : Société Générale Cameroun<br/>
                    Code Banque : 10003<br/>
                    Code Agence : 00100
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.72rem', color: '#1A2332' }}>YONKE TONY VALDEZ</p>
                  <p style={{ fontSize: '0.65rem', color: '#94A3B8' }}>CAMEROUN</p>
                </div>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                <thead>
                  <tr style={{ background: '#F3F4F6', borderBottom: '1px solid #E5E9F2' }}>
                    {['Description', 'Qté', 'Prix unitaire', 'Montant'].map(h => (
                      <th key={h} style={{ padding: '4px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#374151', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {proformaLines.map((line, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F2F8' }}>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151' }}>{line.desc}</td>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151', textAlign: 'center' }}>{line.qty}</td>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151' }}>{line.unit}</td>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151' }}>{line.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div style={{ textAlign: 'right', marginBottom: 8 }}>
                <p style={{ fontSize: '0.68rem', color: '#374151' }}>Total HT : <strong>7 262 735 FCFA</strong></p>
                <p style={{ fontSize: '0.68rem', color: '#374151' }}>Total TTC : <strong>7 262 735 FCFA</strong></p>
              </div>

              <p style={{ fontSize: '0.65rem', color: '#F59E0B', fontStyle: 'italic', fontWeight: 700 }}>
                PS : RECOMMANDEZ-NOUS et RECEVEZ 25000 FCFA
              </p>
            </div>
          </div>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Voir le contrat" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 9 — Mon contrat  (image 16)
// ─────────────────────────────────────────────────────────────────────────────

function Step9({
  onNext,
  onBack,
  canEdit,
}: {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}): JSX.Element {
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const stepper = [
    { number: 1, label: 'Mes informations' },
    { number: 2, label: 'Détails de la formation' },
    { number: 3, label: 'Informations Financières\net Autres Détails' },
  ]

  function handleSign(): void {
    setShowSignatureModal(false)
    setShowSuccessModal(true)
  }

  function handleSuccessContinue(): void {
    setShowSuccessModal(false)
    onNext()
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <AVIStepper steps={stepper} current={3} />

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 24,
      }}>
        Mon contrat
      </h2>

      {/* Contract preview card */}
      <div style={{
        border: '1.5px solid #E5E9F2',
        borderRadius: 12,
        overflow: 'hidden',
        maxWidth: 560,
        margin: '0 auto',
        maxHeight: 420,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '24px', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#374151', lineHeight: 1.7 }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, background: '#2A4F87', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: '0.75rem' }}>BS</span>
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2A4F87', fontFamily: 'var(--font-display)' }}>BOAZ STUDY</span>
            </div>
          </div>

          <h3 style={{ textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#1A2332', marginBottom: 20, textDecoration: 'underline', fontFamily: 'var(--font-display)' }}>
            CONTRAT DE PRESTATIONS DE SERVICES
          </h3>

          <p style={{ marginBottom: 8 }}>Entre les soussignés :</p>

          <p style={{ marginBottom: 12 }}>
            <strong>BOAZ STUDY CAMEROUN</strong>, Société par Actions Simplifiées, au capital de FCFA 7 000 000, dont le siège social est situé 389, rue 1239 Bonapriso Douala ; immatriculée au registre du commerce et du crédit mobilier de Douala sous le numéro RC/DLN/2020/B/1412 représentée dans le présent par Madame KOOH II Pamela Nadette épse BISSECK, en sa qualité de Country Manager Ci-après désignée « <strong>Groupe BOAZ</strong> »D'une part, et ;
          </p>

          <p style={{ marginBottom: 12 }}>
            Madame/Monsieur <strong>Mr OUMAROU BAKOURA</strong>, né le <strong>2002-09-19</strong> au CAMEROUN est étudiant(e), demeurant au <strong>CAMEROUN</strong> Tél <strong>00237658175037</strong>, mail : <strong style={{ color: '#2A4F87' }}>bakoura.oumarou@2027.icam.fr</strong>
          </p>

          <p style={{ marginBottom: 12 }}>Ci-après désigné l'<strong>ETUDIANT(e)</strong> d'autre part.</p>
          <p style={{ marginBottom: 12 }}>Les deux étant collectivement désignés les « <strong>PARTIES</strong> »</p>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>IL A ETE PREALABLEMENT EXPOSE CE QUI SUIT</p>

          <p style={{ marginBottom: 10 }}>
            <strong>1 – BOAZ-STUDY France</strong>, Associé majoritaire de <strong>BOAZ STUDY CAMEROUN</strong>, est une société innovante qui a pour objet, le cautionnement bancaire pour étudiants (délivrance des attestation de virement irrévocable – AVI) et la conciergerie estudiantine (tous services annexes répondant aux besoins des étudiants).
          </p>

          <p style={{ marginBottom: 10 }}>
            <strong>2 –</strong> Madame/Monsieur <strong>Mr OUMAROU BAKOURA</strong> souhaite poursuivre ses études en France.
          </p>

          <p style={{ marginBottom: 10 }}>
            <strong>3 –</strong> En vue de se faire délivrer une attestation de virement irrévocable (ci-après AVI) dans le cadre des formalités auprès du consulat de France au <strong>CAMEROUN</strong> pour l'obtention d'un visa étudiant, l'étudiant a souhaité recourir aux services du groupe BOAZ.
          </p>
        </div>
      </div>

      {canEdit && (
        <NavButtons
          onBack={onBack}
          onNext={() => { setShowSignatureModal(true) }}
          nextLabel="Cliquer pour signer"
        />
      )}
      {!canEdit && (
        <NavButtons onBack={onBack} />
      )}

      {/* Signature modal */}
      {showSignatureModal && (
        <SignatureModal onConfirm={handleSign} onClose={() => { setShowSignatureModal(false) }} />
      )}

      {/* Félicitations modal — image 17 */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          backdropFilter: 'blur(2px)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '40px 36px',
            width: '100%',
            maxWidth: 380,
            textAlign: 'center',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            animation: 'slideUp 0.25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #34D399, #10B981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem', color: '#10B981', marginBottom: 8 }}>
              Félicitations!
            </h3>
            <p style={{ fontWeight: 700, color: '#1A2332', marginBottom: 6, fontFamily: 'var(--font-display)' }}>Contrat signé avec succès</p>
            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
              Accédez aux instructions<br/>pour la suite de votre procédure
            </p>
            <button
              onClick={handleSuccessContinue}
              style={{
                display: 'block',
                width: '100%',
                marginTop: 24,
                padding: '13px',
                borderRadius: 10,
                border: 'none',
                background: '#10B981',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
              }}
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 10 — Dépôt de preuve
// ─────────────────────────────────────────────────────────────────────────────

function Step10({ onFinish, onBack, canEdit }: { onFinish: () => void; onBack: () => void; canEdit: boolean }): JSX.Element {
  const [files, setFiles] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function addFile(name: string): void {
    setFiles(prev => [...prev, name])
  }

  async function handleSubmit(): Promise<void> {
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setTimeout(onFinish, 1500)
  }

  return (
    <div style={{ padding: '32px 40px' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
        color: '#1A2332',
        textAlign: 'center',
        marginBottom: 8,
      }}>
        Dépôt de preuve de paiement
      </h2>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-body)', marginBottom: 28 }}>
        Téléchargez votre preuve de virement/dépôt bancaire
      </p>

      {canEdit && (
        <div
          onDragEnter={() => { setDragging(true) }}
          onDragLeave={() => { setDragging(false) }}
          onDragOver={e => { e.preventDefault() }}
          onDrop={e => {
            e.preventDefault()
            setDragging(false)
            const f = e.dataTransfer.files[0]
            if (f) addFile(f.name)
          }}
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.multiple = true
            input.onchange = ev => {
              const fileList = (ev.target as HTMLInputElement).files
              if (fileList) {
                Array.from(fileList).forEach(f => { addFile(f.name) })
              }
            }
            input.click()
          }}
          style={{
            border: `2px dashed ${dragging ? '#2A4F87' : '#E5E9F2'}`,
            borderRadius: 14,
            padding: '40px',
            textAlign: 'center',
            background: dragging ? '#EBF0FA' : '#F8FAFC',
            cursor: 'pointer',
            transition: 'all 0.15s',
            maxWidth: 480,
            margin: '0 auto 20px',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📤</div>
          <p style={{ fontWeight: 700, color: '#374151', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
            Glisser-déposer ou cliquer pour choisir
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>PDF, JPG, PNG — max 10 MB</p>
        </div>
      )}

      {files.length > 0 && (
        <div style={{ maxWidth: 480, margin: '0 auto 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {files.map((name, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: '#EAF5EE',
              borderRadius: 8,
              border: '1px solid #86EFAC',
            }}>
              <span style={{ fontSize: '1rem' }}>✅</span>
              <span style={{ fontSize: '0.85rem', color: '#374151', fontFamily: 'var(--font-body)', flex: 1 }}>{name}</span>
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <NavButtons
          onBack={onBack}
          onNext={files.length > 0 ? () => void handleSubmit() : undefined}
          nextLabel={submitted ? 'Envoi en cours…' : 'Envoyer'}
          nextDisabled={files.length === 0}
        />
      )}
      {!canEdit && <NavButtons onBack={onBack} />}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS screen — image 15
// ─────────────────────────────────────────────────────────────────────────────

function SuccessScreen({ onGoToDemandes }: { onGoToDemandes: () => void }): JSX.Element {
  const stepper = [
    { number: 1, label: 'Mes informations' },
    { number: 2, label: 'Détails de la formation' },
    { number: 3, label: 'Informations Financières\net Autres Détails' },
  ]

  return (
    <div style={{ padding: '32px 40px', textAlign: 'center' }}>
      <AVIStepper steps={stepper} current={4} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, paddingTop: 20 }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #34D399, #10B981)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 32px rgba(16,185,129,0.3)',
          animation: 'fadeIn 0.5s ease',
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.4rem',
            color: '#374151',
            lineHeight: 1.3,
          }}>
            Demande envoyée<br/>avec succès
          </h2>
        </div>

        <button
          onClick={onGoToDemandes}
          style={{
            padding: '13px 32px',
            borderRadius: 10,
            border: 'none',
            background: '#2A4F87',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 4px 14px rgba(42,79,135,0.35)',
            marginTop: 8,
          }}
        >
          Aller à mes demandes
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP LIST VIEW  (image 1 — Parcours à suivre)
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STEPS: AVIStep[] = [
  { number: 1, title: 'Informations Personnelles', status: 'current' },
  { number: 2, title: 'Détails de la Formation', status: 'upcoming' },
  { number: 3, title: 'Informations Financières et Autres', status: 'upcoming' },
  { number: 4, title: 'Principe de paiement', status: 'upcoming' },
  { number: 5, title: 'Mode de paiement', status: 'upcoming' },
  { number: 6, title: 'Établissement bancaire', status: 'upcoming' },
  { number: 7, title: 'Coordonnées bancaires', status: 'upcoming' },
  { number: 8, title: 'Proforma', status: 'upcoming' },
  { number: 9, title: 'Mon contrat', status: 'upcoming' },
  { number: 10, title: 'Dépôt de preuve', status: 'upcoming' },
]

function StepListView({
  steps,
  onStart,
  onStepSelect,
  canEdit,
}: {
  steps: AVIStep[]
  onStart: () => void
  onStepSelect: (n: number) => void
  canEdit: boolean
}): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '1.35rem',
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
            <div key={step.number}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                borderRadius: isCurrent ? '12px 12px 0 0' : 12,
                background: isCurrent ? '#EBF0FA' : '#fff',
                border: `1px solid ${isCurrent ? '#2A4F87' : isDone ? '#86EFAC' : '#E5E9F2'}`,
                borderBottom: isCurrent ? 'none' : undefined,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.15s',
              }}>
                {/* Number circle */}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isDone ? '#428959' : isCurrent ? '#2A4F87' : '#fff',
                  border: isDone || isCurrent ? 'none' : '2px solid #E5E9F2',
                  color: isDone || isCurrent ? '#fff' : '#94A3B8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                }}>
                  {isDone ? '✓' : String(step.number).padStart(2, '0')}
                </div>

                {/* Title */}
                <p style={{
                  flex: 1,
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.92rem',
                  color: isCurrent ? '#2A4F87' : '#374151',
                  fontFamily: 'var(--font-body)',
                }}>
                  {step.title}
                </p>

                {/* Action */}
                <button
                  onClick={() => { onStepSelect(step.number) }}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: isCurrent ? 'none' : '1.5px solid #E5E9F2',
                    background: isCurrent ? '#2A4F87' : '#fff',
                    color: isCurrent ? '#fff' : '#64748B',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    flexShrink: 0,
                  }}
                >
                  {isCurrent ? 'Revenir' : step.number === 10 ? 'Déposer la preuve' : 'Aller à l\'étape'}
                </button>

                {/* Chevron */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>

              {/* Expanded description under current */}
              {isCurrent && (
                <div style={{
                  padding: '12px 18px',
                  background: '#EBF0FA',
                  border: '1px solid #2A4F87',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  animation: 'fadeIn 0.2s ease',
                }}>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
                    Ici, veuillez remplir vos informations personnelles
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 32,
        maxWidth: 600,
        margin: '32px auto 0',
      }}>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 20px',
          borderRadius: 10,
          border: '1.5px solid #E5E9F2',
          background: '#fff',
          color: '#374151',
          fontWeight: 600,
          fontSize: '0.88rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger un résumé
        </button>

        {canEdit && (
          <button
            onClick={onStart}
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              border: 'none',
              background: '#2A4F87',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 14px rgba(42,79,135,0.35)',
            }}
          >
            Commencer
          </button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Read-only banner
// ─────────────────────────────────────────────────────────────────────────────

function ReadOnlyBanner(): JSX.Element {
  return (
    <div style={{
      background: '#FFF9E6',
      border: '1px solid #FCD34D',
      borderRadius: 10,
      padding: '10px 16px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <span style={{ fontSize: '1rem' }}>👁️</span>
      <p style={{ fontSize: '0.82rem', color: '#92400E', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
        Mode lecture seule — vous n'avez pas la permission de modifier ce formulaire. Contactez un administrateur pour obtenir l'accès.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AVIPage
// ─────────────────────────────────────────────────────────────────────────────

type AVIView = 'list' | 'step'

export function AVIPage({ onBack }: { onBack: () => void }): JSX.Element {
  const { hasPermission } = usePermissions()

  // document:upload = can fill & submit forms
  // document:read   = read-only view
  const canEdit = hasPermission('document:upload')
  const canView = hasPermission('document:read') || canEdit

  const [view, setView] = useState<AVIView>('list')
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState<AVIStep[]>(INITIAL_STEPS)
  const [selectedBank, setSelectedBank] = useState('societe-generale')
  const [showSuccess, setShowSuccess] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'warning' | 'error' | 'confirm'
    title: string
    description?: string
    onConfirm?: () => void
  } | null>(null)

  // Step navigation helpers
  function goToStep(n: number): void {
    setCurrentStep(n)
    setView('step')
    setSteps(prev => prev.map(s => ({
      ...s,
      status: s.number === n ? 'current' : s.number < n ? 'done' : 'upcoming',
    })))
  }

  function goNext(): void {
    const next = currentStep + 1
    if (next > 10) {
      setShowSuccess(true)
      return
    }
    goToStep(next)
  }

  function goBack(): void {
    const prev = currentStep - 1
    if (prev < 1) {
      setView('list')
      return
    }
    goToStep(prev)
  }

  function handleStart(): void {
    goToStep(1)
  }

  if (!canView) {
    return (
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 48,
        textAlign: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1A2332', marginBottom: 8 }}>
          Accès non autorisé
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
          Vous n'avez pas les permissions nécessaires pour accéder au service AVI.
        </p>
        <button
          onClick={onBack}
          style={{
            marginTop: 24,
            padding: '10px 24px',
            borderRadius: 10,
            border: '1.5px solid #E5E9F2',
            background: '#fff',
            color: '#64748B',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid #E5E9F2',
          boxShadow: '0 4px 24px rgba(42,79,135,0.08)',
          overflow: 'hidden',
        }}>
          <SuccessScreen onGoToDemandes={onBack} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Back button */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 8,
            border: '1.5px solid #E5E9F2',
            background: '#fff',
            color: '#64748B',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Retour à l'accueil
        </button>
      </div>

      {/* Read-only banner */}
      {!canEdit && <ReadOnlyBanner />}

      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E5E9F2',
        boxShadow: '0 4px 24px rgba(42,79,135,0.08)',
        overflow: 'hidden',
      }}>
        {view === 'list' ? (
          <StepListView
            steps={steps}
            onStart={handleStart}
            onStepSelect={(n) => { goToStep(n) }}
            canEdit={canEdit}
          />
        ) : (
          <>
            {currentStep === 1 && (
              <Step1
                onNext={() => {
                  if (canEdit) {
                    setNotification({
                      type: 'success',
                      title: 'Informations sauvegardées',
                      description: 'Vos informations personnelles ont été enregistrées.',
                      onConfirm: goNext,
                    })
                  }
                }}
                onCancel={() => { setView('list') }}
                canEdit={canEdit}
              />
            )}
            {currentStep === 2 && (
              <Step2 onNext={goNext} onBack={goBack} canEdit={canEdit} />
            )}
            {currentStep === 3 && (
              <Step3 onNext={goNext} onBack={goBack} canEdit={canEdit} />
            )}
            {currentStep === 4 && (
              <Step4 onNext={goNext} onBack={goBack} canEdit={canEdit} />
            )}
            {currentStep === 5 && (
              <Step5 onNext={goNext} onBack={goBack} canEdit={canEdit} />
            )}
            {currentStep === 51 && (
              <Step5b onNext={goNext} onBack={() => { goToStep(5) }} canEdit={canEdit} />
            )}
            {currentStep === 6 && (
              <Step6
                onNext={goNext}
                onBack={goBack}
                canEdit={canEdit}
                onBankSelected={(bank) => { setSelectedBank(bank) }}
              />
            )}
            {currentStep === 7 && (
              <Step7 onNext={goNext} onBack={goBack} selectedBank={selectedBank} />
            )}
            {currentStep === 8 && (
              <Step8 onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 9 && (
              <Step9 onNext={goNext} onBack={goBack} canEdit={canEdit} />
            )}
            {currentStep === 10 && (
              <Step10
                onFinish={() => {
                  setNotification({
                    type: 'success',
                    title: 'Demande envoyée avec succès',
                    description: 'Votre dossier AVI a été soumis. Vous recevrez une confirmation par email.',
                    onConfirm: () => { setNotification(null); setShowSuccess(true) },
                  })
                }}
                onBack={goBack}
                canEdit={canEdit}
              />
            )}
          </>
        )}
      </div>

      {/* Notification modal */}
      {notification && (
        <NotificationModal
          type={notification.type}
          title={notification.title}
          description={notification.description}
          onConfirm={() => {
            if (notification.onConfirm) notification.onConfirm()
            setNotification(null)
          }}
          onClose={() => { setNotification(null) }}
        />
      )}
    </div>
  )
}