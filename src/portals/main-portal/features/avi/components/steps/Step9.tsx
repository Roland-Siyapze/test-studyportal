import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'
import { SignatureModal } from '@components/shared'

export interface Step9Props {
  onNext: () => void
  onBack: () => void
  canEdit: boolean
}

export function Step9({ onNext, onBack, canEdit }: Step9Props): JSX.Element {
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

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#1A2332', textAlign: 'center', marginBottom: 24 }}>
        Mon contrat
      </h2>

      <div style={{ border: '1.5px solid #E5E9F2', borderRadius: 12, overflow: 'hidden', maxWidth: 560, margin: '0 auto', maxHeight: 420, overflowY: 'auto' }}>
        <div style={{ padding: '24px', fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: '#374151', lineHeight: 1.7 }}>
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
            <strong>BOAZ STUDY CAMEROUN</strong>, Société par Actions Simplifiées, au capital de CFA 7 000 000, dont le siège social est situé 389, rue 1239 Bonapriso Douala ; immatriculée au registre du commerce et du crédit mobilier de Douala sous le numéro RC/DLN/2020/B/1412 représentée dans le présent par Madame KOOH II Pamela Nadette épse BISSECK, en sa qualité de Country Manager Ci-après désignée « <strong>Groupe BOAZ</strong> »D'une part, et ;
          </p>

          <p style={{ marginBottom: 12 }}>
            Madame/Monsieur <strong>Mr OUMAROU BAKOURA</strong>, né le <strong>2002-09-19</strong> au CAMEROUN est étudiant(e), demeurant au <strong>CAMEROUN</strong> Tél <strong>00237658175037</strong>, mail : <strong style={{ color: '#2A4F87' }}>bakoura.oumarou@2027.icam.fr</strong>
          </p>

          <p style={{ marginBottom: 12 }}>Ci-après désigné l'<strong>ETUDIANT(e)</strong> d'autre part.</p>
          <p style={{ marginBottom: 12 }}>Les deux étant collectivement désignés les « <strong>PARTIES</strong> »</p>
          <p style={{ fontWeight: 700, marginBottom: 12 }}>IL A ETE PREALABLEMENT EXPOSE CE QUI SUIT</p>

          <p style={{ marginBottom: 10 }}><strong>1 – BOAZ-STUDY France</strong>, Associé majoritaire de <strong>BOAZ STUDY CAMEROUN</strong>, est une société innovante qui a pour objet, le cautionnement bancaire pour étudiants (délivrance des attestation de virement irrévocable – AVI) et la conciergerie estudiantine (tous services annexes répondant aux besoins des étudiants).</p>

          <p style={{ marginBottom: 10 }}><strong>2 –</strong> Madame/Monsieur <strong>Mr OUMAROU BAKOURA</strong> souhaite poursuivre ses études en France.</p>

          <p style={{ marginBottom: 10 }}><strong>3 –</strong> En vue de se faire délivrer une attestation de virement irrévocable (ci-après AVI) dans le cadre des formalités auprès du consulat de France au <strong>CAMEROUN</strong> pour l'obtention d'un visa étudiant, l'étudiant a souhaité recourir aux services du groupe BOAZ.</p>
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

      {showSignatureModal && (
        <SignatureModal onConfirm={handleSign} onClose={() => { setShowSignatureModal(false) }} />
      )}

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
