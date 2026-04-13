import type { JSX } from 'react'
import { InputField, FilePickerField, Stepper, NavButtons } from '../ui'

interface FormData {
  scanCNIName: string
  demiCartePhotoName: string
  nomPrenomParent1: string
  telephoneParent1: string
  lieuResidenceParent1: string
  nomPrenomParent2: string
  telephoneParent2: string
  lieuResidenceParent2: string
}

interface Step2Props {
  data: FormData
  onChange: (key: keyof FormData, value: string) => void
  onNext: () => void
  onBack: () => void
}

const STEPS_META = [
  { label: 'Informations\npersonnelles' },
  { label: 'Identité' },
  { label: 'Détails du\nfiancement' },
]

export function Step2({ data, onChange, onNext, onBack }: Step2Props): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={2} totalVisibleSteps={3} startStep={1} />

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

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}