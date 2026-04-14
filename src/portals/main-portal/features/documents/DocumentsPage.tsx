/* eslint-disable @typescript-eslint/restrict-template-expressions */
/**
 * @file DocumentsPage.tsx
 * @description Document management page.
 *   - List documents with download links
 *   - Upload button gated behind document:upload
 *   - Download gated behind document:download
 *
 * Satisfies: PERM-002
 */

import type { JSX} from 'react';
import { useState } from 'react'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { MOCK_DOCUMENTS } from '@services/mock/documents.mock'
import type { Document, DocumentCategory } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<DocumentCategory, { label: string; icon: string; color: string; bg: string }> = {
  TRANSCRIPT:  { label: 'Relevé de notes',     icon: '📋', color: '#2A4F87', bg: '#EBF0FA' },
  CERTIFICATE: { label: 'Certificat',          icon: '🎓', color: '#428959', bg: '#EAF5EE' },
  INVOICE:     { label: 'Facture',             icon: '💳', color: '#D97E00', bg: '#FFF4E0' },
  OTHER:       { label: 'Autre',               icon: '📄', color: '#64748B', bg: '#F1F5F9' },
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

// ─────────────────────────────────────────────────────────────────────────────
// Upload Modal
// ─────────────────────────────────────────────────────────────────────────────

function UploadModal({ onClose, onUpload }: {
  onClose: () => void
  onUpload: (name: string, category: DocumentCategory) => void
}): JSX.Element {
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
          onClick={() => { const i = document.createElement('input'); i.type = 'file'; i.onchange = (e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) setName(f.name) }; i.click() }}
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

// ─────────────────────────────────────────────────────────────────────────────
// Main DocumentsPage
// ─────────────────────────────────────────────────────────────────────────────

export function DocumentsPage(): JSX.Element {
  const [docs, setDocs] = useState([...MOCK_DOCUMENTS])
  const [showUpload, setShowUpload] = useState(false)
  const [filterCat, setFilterCat] = useState<DocumentCategory | 'ALL'>('ALL')

  function handleUpload(name: string, category: DocumentCategory): void {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name,
      category,
      size: Math.floor(Math.random() * 500000) + 50000,
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedById: 'current-user',
      downloadUrl: '#',
    }
    setDocs(prev => [newDoc, ...prev])
  }

  const filtered = filterCat === 'ALL' ? docs : docs.filter(d => d.category === filterCat)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
          {docs.length} document{docs.length > 1 ? 's' : ''} disponible{docs.length > 1 ? 's' : ''}
        </p>
        <ProtectedComponent requires="document:upload">
          <button
            onClick={() => { setShowUpload(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(42,79,135,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Déposer un document
          </button>
        </ProtectedComponent>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['ALL', ...Object.keys(CATEGORY_CONFIG)] as const).map(cat => {
          const active = filterCat === cat
          const cfg = cat !== 'ALL' ? CATEGORY_CONFIG[cat as DocumentCategory] : null
          return (
            <button
              key={cat}
              onClick={() => { setFilterCat(cat as DocumentCategory | 'ALL'); }}
              style={{
                padding: '6px 14px', borderRadius: 999, fontSize: '0.8rem',
                fontWeight: active ? 700 : 500,
                border: active ? `1.5px solid ${cfg?.color ?? '#2A4F87'}` : '1.5px solid #E5E9F2',
                background: active ? (cfg?.bg ?? '#EBF0FA') : '#fff',
                color: active ? (cfg?.color ?? '#2A4F87') : '#64748B',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
              }}
            >
              {cat === 'ALL' ? 'Tous' : cfg?.label}
            </button>
          )
        })}
      </div>

      {/* Document list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(doc => {
          const cfg = CATEGORY_CONFIG[doc.category]
          return (
            <div key={doc.id} style={{
              background: '#fff',
              borderRadius: 14,
              border: '1px solid #E5E9F2',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(42,79,135,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
            >
              {/* File icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: cfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem', flexShrink: 0,
              }}>
                {cfg.icon}
              </div>

              {/* Info */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1A2332', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-display)' }}>
                  {doc.name}
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{formatSize(doc.size)}</span>
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>·</span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{formatDate(doc.uploadedAt)}</span>
                </div>
              </div>

              {/* Download button */}
              <ProtectedComponent requires="document:download">
                <a
                  href={doc.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8,
                    border: '1.5px solid #E5E9F2',
                    background: '#F8FAFC',
                    color: '#2A4F87',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textDecoration: 'none',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#EBF0FA'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#2A4F87' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#F8FAFC'; (e.currentTarget as HTMLAnchorElement).style.borderColor = '#E5E9F2' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Télécharger
                </a>
              </ProtectedComponent>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ background: '#fff', borderRadius: 14, border: '1px dashed #E5E9F2', padding: 40, textAlign: 'center' }}>
            <p style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}>Aucun document trouvé</p>
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => { setShowUpload(false); }} onUpload={handleUpload} />}
    </div>
  )
}