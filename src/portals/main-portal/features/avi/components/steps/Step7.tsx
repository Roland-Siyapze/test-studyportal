import type { JSX } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'
import societeGeneraleImg from '@assets/societe-generale.png'
import atlantiqueImg from '@assets/atlantiquebanque.png'

export interface Step7Props {
  onNext: () => void
  onBack: () => void
  selectedBank: string
}

const RIB_DATA: Record<string, { titulaire: string; adresse: string; ville: string; domiciliation: string; banque: string; guichet: string; compte: string; cle: string; iban: string; bic: string; logo: JSX.Element }> = {
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
    logo: <img src={societeGeneraleImg} alt="Société Générale" style={{ height: 80 }} />,
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
    logo: <img src={atlantiqueImg} alt="Banque Atlantique" style={{ height: 32 }} />,
  },
}

export function Step7({ onNext, onBack, selectedBank }: Step7Props): JSX.Element {
  const rib = RIB_DATA[selectedBank] ?? RIB_DATA['societe-generale']

  const stepper = [
    { number: 7, label: 'Coordonnées\nbancaires' },
    { number: 8, label: 'Proforma' },
    { number: 9, label: 'Mon contrat' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={7} />

      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#1A2332', textAlign: 'center', marginBottom: 28 }}>
        Informations bancaires
      </h2>

      <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ padding: '5px', borderRadius: 12, border: '1.5px solid #E5E9F2', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {rib.logo}
        </div>

        <div style={{ border: '1.5px solid #E5E9F2', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', background: '#F8FAFC' }}>
            <div style={{ border: '1px solid #D1D5DB', borderRadius: 6, overflow: 'hidden', background: '#fff' }}>
              <div style={{ background: '#F3F4F6', padding: '8px 14px', fontWeight: 700, fontSize: '0.78rem', color: '#374151', textAlign: 'center', letterSpacing: '0.05em', fontFamily: 'var(--font-body)', borderBottom: '1px solid #D1D5DB' }}>
                RELEVE D'IDENTITE BANCAIRE
              </div>
              <div style={{ padding: '14px 14px' }}>
                <p style={{ fontSize: '0.75rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 4 }}>TITULAIRE DU COMPTE</p>
                <p style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1A2332', fontFamily: 'var(--font-display)', marginBottom: 10 }}>{rib.titulaire}</p>
                <p style={{ fontSize: '0.78rem', color: '#374151', fontFamily: 'var(--font-body)' }}>{rib.adresse}</p>
                <p style={{ fontSize: '0.78rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 12 }}>{rib.ville}</p>

                <p style={{ fontSize: '0.75rem', color: '#374151', fontFamily: 'var(--font-body)', marginBottom: 4 }}>DOMICILIATION : {rib.domiciliation}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 10 }}>
                  {[{ label: 'Banque', val: rib.banque }, { label: 'Guichet', val: rib.guichet }, { label: 'N° de compte', val: rib.compte }, { label: 'Clé RIB', val: rib.cle }].map(col => (
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
