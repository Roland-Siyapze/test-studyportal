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

      {/* Document cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {filtered.map(doc => (
          <ProtectedComponent key={doc.id} requires="document:download" fallback={<DocumentCardLocked doc={doc} />}>
            <DocumentCard doc={doc} />
          </ProtectedComponent>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ background: '#fff', borderRadius: 14, border: '1px dashed #E5E9F2', padding: 40, textAlign: 'center' }}>
          <p style={{ color: '#94A3B8', fontFamily: 'var(--font-body)' }}>Aucun document trouvé</p>
        </div>
      )}
    </div>
  )
}

function DocumentCard({ doc }: { doc: Document }): JSX.Element {
  return (
    <div
      onClick={() => { window.open(doc.downloadUrl, '_blank') }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.3)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Document Preview */}
      <div style={{
        background: '#F5F5F5',
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {doc.previewUrl ? (
          <img
            src={doc.previewUrl}
            alt={doc.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4rem',
            color: '#CBD5E1',
          }}>
            📄
          </div>
        )}
      </div>

      {/* Blue Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '16px 20px',
          background: '#2563EB',
          color: '#FFFFFF',
        }}
      >
        {/* Icons container */}
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          {/* Download icon */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>

          {/* View icon */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>

        {/* File name - centered */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <p style={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: 'var(--font-display)',
            margin: 0,
            letterSpacing: '0.3px',
          }}>
            {doc.name}
          </p>
        </div>
      </div>
    </div>
  )
}

function DocumentCardLocked({ doc }: { doc: Document }): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '16px 20px',
        borderRadius: 12,
        background: '#CBD5E1',
        color: '#FFFFFF',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Icons container */}
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        {/* Download icon (disabled) */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>

        {/* View icon (disabled) */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid rgba(255, 255, 255, 0.3)',
          opacity: 0.5,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
      </div>

      {/* File name */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 700,
          fontSize: '0.95rem',
          color: '#FFFFFF',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'var(--font-display)',
          margin: 0,
        }}>
          {doc.name}
        </p>
      </div>

      {/* Lock icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>
  )
}
