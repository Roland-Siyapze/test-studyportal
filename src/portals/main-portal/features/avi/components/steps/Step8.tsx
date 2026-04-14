import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'
import { AVIStepper } from '../../AVIStepper'

export interface Step8Props {
  onNext: () => void
  onBack: () => void
}

const PROFORMA_LINES = [
  { desc: 'Montant de la caution bancaire/AVI', qty: 1, unit: '6 812 000 CFA', total: '6 812 000 CFA' },
  { desc: 'Frais de transfert de Fonds', qty: 1, unit: '170 300 CFA', total: '170 300 CFA' },
  { desc: 'Frais AVI', qty: 1, unit: '230 000 CFA', total: '230 000 CFA' },
  { desc: 'Frais ACS Assurance France', qty: 1, unit: '50 435 CFA', total: '50 435 CFA' },
  { desc: 'Frais recherche logement', qty: 0, unit: '0', total: '0' },
]

export function Step8({ onNext, onBack }: Step8Props): JSX.Element {
  const [showDoc, setShowDoc] = useState(false)

  const stepper = [
    { number: 7, label: 'Coordonnées bancaires' },
    { number: 8, label: 'Proforma' },
    { number: 9, label: 'Mon contrat' },
  ]

  return (
    <div style={{ padding: '32px 40px' }}>
      <p style={{ fontSize: '0.7rem', color: '#94A3B8', textAlign: 'center', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>Stepper</p>
      <AVIStepper steps={stepper} current={8} />

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#1A2332', marginBottom: 20 }}>
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
                  border: `2px solid ${showDoc && idx === 0 ? '#2563EB' : '#D1D5DB'}`,
                  background: showDoc && idx === 0 ? '#EFF6FF' : '#fff',
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

        {showDoc && (
          <div style={{ width: 340, flexShrink: 0, border: '1px solid #E5E9F2', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '0.72rem', fontFamily: 'var(--font-body)', animation: 'fadeIn 0.2s ease' }}>
            <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E5E9F2' }}>
              <p style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: 2 }}>AVI</p>
              <p style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1A2332', fontFamily: 'var(--font-display)' }}>Ma Proforma</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: '0.65rem', color: '#2A4F87', cursor: 'pointer', textDecoration: 'underline' }}>Proforma</span>
                <span style={{ fontSize: '0.65rem', color: '#94A3B8', cursor: 'pointer' }}>Preuve de paiement</span>
              </div>
            </div>

            <div style={{ padding: '14px 16px' }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 20, height: 20, background: '#2A4F87', borderRadius: 4 }} />
                  <span style={{ fontWeight: 800, fontSize: '0.72rem', color: '#2A4F87' }}>BOAZ-STUDY</span>
                </div>
                <p style={{ fontSize: '0.68rem', color: '#374151', lineHeight: 1.4 }}>Boaz Study Cameroun SAS<br/>Yaoundé-Total Ecole de Police<br/>389 Rue Toyota Bonapriso<br/>B.P: 1230 Douala</p>
                <p style={{ fontSize: '0.68rem', color: '#374151', marginTop: 4 }}>Date : 11/03/2025</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: '0.68rem', color: '#374151', lineHeight: 1.4 }}>
                    Payable à BOAZ-STUDY CAMROUN<br/>Banque : Société Générale Cameroun<br/>Code Banque : 10003<br/>Code Agence : 00100
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.72rem', color: '#1A2332' }}>YONKE TONY VALDEZ</p>
                  <p style={{ fontSize: '0.65rem', color: '#94A3B8' }}>CAMEROUN</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
                <thead>
                  <tr style={{ background: '#F3F4F6', borderBottom: '1px solid #E5E9F2' }}>
                    {['Description', 'Qté', 'Prix unitaire', 'Montant'].map(h => (
                      <th key={h} style={{ padding: '4px 6px', fontSize: '0.65rem', fontWeight: 700, color: '#374151', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROFORMA_LINES.map((line, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F2F8' }}>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151' }}>{line.desc}</td>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151', textAlign: 'center' }}>{line.qty}</td>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151' }}>{line.unit}</td>
                      <td style={{ padding: '4px 6px', fontSize: '0.65rem', color: '#374151' }}>{line.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: 'right', marginBottom: 8 }}>
                <p style={{ fontSize: '0.68rem', color: '#374151' }}>Total HT : <strong>7 262 735 CFA</strong></p>
                <p style={{ fontSize: '0.68rem', color: '#374151' }}>Total TTC : <strong>7 262 735 CFA</strong></p>
              </div>

              <p style={{ fontSize: '0.65rem', color: '#F59E0B', fontStyle: 'italic', fontWeight: 700 }}>PS : RECOMMANDEZ-NOUS et RECEVEZ 25000 CFA</p>
            </div>
          </div>
        )}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Voir le contrat" />
    </div>
  )
}
