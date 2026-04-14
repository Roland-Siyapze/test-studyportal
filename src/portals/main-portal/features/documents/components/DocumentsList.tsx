/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { JSX } from 'react'
import { ProtectedComponent } from '@components/ProtectedComponent'
import type { Document, DocumentCategory } from '@contracts/api-contracts'

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

export interface DocumentsListProps {
  docs: Document[]
  filterCat: DocumentCategory | 'ALL'
  onFilterChange: (cat: DocumentCategory | 'ALL') => void
}

export function DocumentsList({ docs, filterCat, onFilterChange }: DocumentsListProps): JSX.Element {
  const filtered = filterCat === 'ALL' ? docs : docs.filter(d => d.category === filterCat)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['ALL', ...Object.keys(CATEGORY_CONFIG)] as const).map(cat => {
          const active = filterCat === cat
          const cfg = cat !== 'ALL' ? CATEGORY_CONFIG[cat as DocumentCategory] : null
          return (
            <button
              key={cat}
              onClick={() => { onFilterChange(cat as DocumentCategory | 'ALL'); }}
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
    </div>
  )
}
