/* eslint-disable @typescript-eslint/restrict-plus-operands */
/**
 * @file AVIPage.tsx
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
import { NotificationModal } from '@components/shared'
import {
  Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10,
  StepListView, SuccessScreen, ReadOnlyBanner,
} from './components'

type StepStatus = 'done' | 'current' | 'upcoming'

interface AVIStep {
  number: number
  title: string
  status: StepStatus
}

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

type AVIView = 'list' | 'step'

export function AVIPage({ onBack }: { onBack: () => void }): JSX.Element {
  const { hasPermission } = usePermissions()

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
      <div style={{ background: '#fff', borderRadius: 20, padding: 48, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1A2332', marginBottom: 8 }}>
          Accès non autorisé
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
          Vous n'avez pas les permissions nécessaires pour accéder au service AVI.
        </p>
        <button onClick={onBack} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 10, border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Retour à l'accueil
        </button>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div style={{ animation: 'fadeIn 0.35s ease' }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E9F2', boxShadow: '0 4px 24px rgba(42,79,135,0.08)', overflow: 'hidden' }}>
          <SuccessScreen onGoToDemandes={onBack} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <div style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Retour à l'accueil
        </button>
      </div>

      {!canEdit && <ReadOnlyBanner />}

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #E5E9F2', boxShadow: '0 4px 24px rgba(42,79,135,0.08)', overflow: 'hidden' }}>
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
