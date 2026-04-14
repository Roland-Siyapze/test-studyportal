import type { JSX } from 'react'
import { useMemo } from 'react'
import { InputField, FilePickerField, Stepper, NavButtons } from '../ui'

interface FormData {
  scanCNIName: string
  scanCNIFile: File | null
  demiCartePhotoName: string
  demiCartePhotoFile: File | null
  nomPrenomParent1: string
  telephoneParent1: string
  lieuResidenceParent1: string
  nomPrenomParent2: string
  telephoneParent2: string
  lieuResidenceParent2: string
}

interface Step2Props {
  data: FormData
  onChange: (key: keyof FormData, value: string | File | null) => void
  onNext: () => void
  onBack: () => void
}

const STEPS_META = [
  { label: 'Informations\npersonnelles' },
  { label: 'Identité' },
  { label: 'Détails du\nfiancement' },
]

function DocumentPreview({ file }: { file: File | null }): JSX.Element {
  const objectUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  const isImage = file?.type.startsWith('image/')
  const isPdf = file?.type === 'application/pdf'

  return (
    <div style={{
      width: 110, height: 90, borderRadius: 10,
      background: file ? '#F1F5F9' : '#E5E7EB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.78rem', color: '#94A3B8', fontFamily: 'var(--font-body)',
      overflow: 'hidden',
      position: 'relative' as const,
    }}>
      {file ? (
        isImage ? (
          <img 
            src={objectUrl!} 
            alt="Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        ) : isPdf ? (
          <div style={{ padding: 8, textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <div style={{ marginTop: 4, fontSize: '0.65rem', color: '#2563EB' }}>PDF</div>
          </div>
        ) : (
          <div style={{ padding: 8, textAlign: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
        )
      ) : (
        'Aperçu'
      )}
    </div>
  )
}

export function Step2({ data, onChange, onNext, onBack }: Step2Props): JSX.Element {
  return (
    <div style={{ padding: '32px 40px', animation: 'fadeIn 0.3s ease' }}>
      <Stepper steps={STEPS_META} currentStep={2} totalVisibleSteps={3} startStep={1} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, marginBottom: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FilePickerField
            label="Scan CNI"
            fileName={data.scanCNIName}
            onPick={(name, file) => { onChange('scanCNIName', name); if (file) onChange('scanCNIFile', file); }}
          />
          <FilePickerField
            label="Demi carte photo"
            fileName={data.demiCartePhotoName}
            onPick={(name, file) => { onChange('demiCartePhotoName', name); if (file) onChange('demiCartePhotoFile', file); }}
          />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <DocumentPreview file={data.scanCNIFile} />
          <DocumentPreview file={data.demiCartePhotoFile} />
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