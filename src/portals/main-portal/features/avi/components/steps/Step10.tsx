import type { JSX } from 'react'
import { useState } from 'react'
import { NavButtons } from '../ui'

export interface Step10Props {
  onFinish: () => void
  onBack: () => void
  canEdit: boolean
}

export function Step10({ onFinish, onBack, canEdit }: Step10Props): JSX.Element {
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
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: '#1A2332', textAlign: 'center', marginBottom: 8 }}>
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
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#EAF5EE', borderRadius: 8, border: '1px solid #86EFAC' }}>
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
