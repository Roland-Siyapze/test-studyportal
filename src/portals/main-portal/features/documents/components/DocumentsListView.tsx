import type { JSX } from 'react'
import type { Document, DocumentCategory } from '@contracts/api-contracts'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { DocumentsList } from './DocumentsList'

export interface DocumentsListViewProps {
  docs: Document[]
  onUploadClick: () => void
  filterCat: DocumentCategory | 'ALL'
  onFilterChange: (cat: DocumentCategory | 'ALL') => void
}

export function DocumentsListView({ docs, onUploadClick, filterCat, onFilterChange }: DocumentsListViewProps): JSX.Element {
  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
          {docs.length} document{docs.length > 1 ? 's' : ''} disponible{docs.length > 1 ? 's' : ''}
        </p>
        <ProtectedComponent requires="document:upload">
          <button
            onClick={onUploadClick}
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

      {/* Documents list */}
      <DocumentsList docs={docs} filterCat={filterCat} onFilterChange={onFilterChange} />
    </div>
  )
}
