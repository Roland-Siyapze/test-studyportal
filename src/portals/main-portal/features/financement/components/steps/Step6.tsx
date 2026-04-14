import type { JSX } from 'react'
import { useState } from 'react'
import { Stepper, ConfirmModal } from '../ui'

interface Step6Props {
  onBack: () => void
  onTerminer: () => void
  onCancel: () => void
}

const STEPS_META = [
  { label: 'Informations\nPersonnelles' },
  { label: 'Identité' },
  { label: 'Détails du\nfinancement' },
  { label: 'Échéancier' },
  { label: 'Justificatifs de demande\nde financement' },
  { label: 'Marche à suivre' },
]

const ETAPES = [
  { label: 'Etape 1', done: true },
  { label: 'Etape 2', done: false },
  { label: 'Etape x', done: false },
]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Step6({ onBack: _onBack, onTerminer, onCancel }: Step6Props): JSX.Element {
  const [confirmModal, setConfirmModal] = useState<'submit' | 'cancel' | null>(null)
  const [submitting, setSubmitting] = useState(false)

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

      <div style={{ maxWidth: 400, margin: '0 auto 32px', position: 'relative' }}>
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