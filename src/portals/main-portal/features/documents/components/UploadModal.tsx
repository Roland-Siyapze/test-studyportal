import type { JSX } from 'react'
import { useState } from 'react'
import type { DocumentCategory } from '@contracts/api-contracts'

const CATEGORY_CONFIG: Record<DocumentCategory, { label: string; icon: string; color: string; bg: string }> = {
  TRANSCRIPT:  { label: 'Relevé de notes',     icon: '📋', color: '#2A4F87', bg: '#EBF0FA' },
  CERTIFICATE: { label: 'Certificat',          icon: '🎓', color: '#428959', bg: '#EAF5EE' },
  INVOICE:     { label: 'Facture',             icon: '💳', color: '#D97E00', bg: '#FFF4E0' },
  OTHER:       { label: 'Autre',               icon: '📄', color: '#64748B', bg: '#F1F5F9' },
}

export interface UploadModalProps {
  onClose: () => void
  onUpload: (name: string, category: DocumentCategory) => void
}

export function UploadModal({ onClose, onUpload }: UploadModalProps): JSX.Element {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<DocumentCategory>('OTHER')
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  async function handleUpload(): Promise<void> {
    if (!name.trim()) return
    setUploading(true)
    await new Promise(r => setTimeout(r, 800))
    onUpload(name.trim(), category)
    setUploading(false)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 460,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#1A2332' }}>
            Déposer un document
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
        </div>

        {/* Drop zone */}
        <div
          onDragEnter={() => { setDragging(true); }}
          onDragLeave={() => { setDragging(false); }}
          onDragOver={e => { e.preventDefault(); }}
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setName(f.name) }}
          style={{
            border: `2px dashed ${dragging ? '#2A4F87' : '#E5E9F2'}`,
            borderRadius: 14,
            padding: '32px',
            textAlign: 'center',
            background: dragging ? '#EBF0FA' : '#F8FAFC',
            transition: 'all 0.15s',
            marginBottom: 20,
            cursor: 'pointer',
          }}
          onClick={(): void => { const i = document.createElement('input'); i.type = 'file'; i.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) setName(f.name) }; i.click() }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📁</div>
          <p style={{ fontWeight: 600, color: '#374151', fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>
            Glisser-déposer ou cliquer pour choisir
          </p>
          <p style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: 4 }}>PDF, DOCX, XLSX — max 10 MB</p>
          {name && <p style={{ fontSize: '0.82rem', color: '#2A4F87', fontWeight: 700, marginTop: 10 }}>✓ {name}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nom du document *</label>
            <input
              value={name}
              onChange={e => { setName(e.target.value); }}
              placeholder="Ex: Relevé de notes S1 2024"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E9F2', borderRadius: 10, fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2A4F87'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Catégorie</label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value as DocumentCategory); }}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E9F2', borderRadius: 10, fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', background: '#fff', cursor: 'pointer', boxSizing: 'border-box' }}
            >
              {(Object.keys(CATEGORY_CONFIG) as DocumentCategory[]).map(c => (
                <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Annuler
            </button>
            <button
              onClick={() => void handleUpload()}
              disabled={uploading || !name.trim()}
              style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1, fontFamily: 'var(--font-body)' }}
            >
              {uploading ? 'Dépôt…' : 'Déposer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
