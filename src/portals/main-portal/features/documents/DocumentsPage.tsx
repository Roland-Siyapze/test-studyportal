/**
 * @file DocumentsPage.tsx
 * @description Document management feature page - component-based architecture.
 *   - List view showing all documents with category filter
 *   - Upload functionality gated behind document:upload permission
 *   - Download gated behind document:download permission
 *   - Can view documents with document:read permission
 *
 * Satisfies: PERM-002 (document:upload, document:download, document:read)
 */

import type { JSX } from 'react'
import { useState } from 'react'
import { MOCK_DOCUMENTS } from '@services/mock/documents.mock'
import type { Document, DocumentCategory } from '@contracts/api-contracts'
import { UploadModal, DocumentsListView } from './components'

type DocumentsView = 'list'

export function DocumentsPage(): JSX.Element {
  const [docs, setDocs] = useState([...MOCK_DOCUMENTS])
  const [showUpload, setShowUpload] = useState(false)
  const [filterCat, setFilterCat] = useState<DocumentCategory | 'ALL'>('ALL')
  const [view] = useState<DocumentsView>('list')

  function handleUpload(name: string, category: DocumentCategory): void {
    const newDoc: Document = {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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

  return (
    <div>
      {view === 'list' && (
        <DocumentsListView
          docs={docs}
          onUploadClick={() => { setShowUpload(true); }}
          filterCat={filterCat}
          onFilterChange={setFilterCat}
        />
      )}

      {showUpload && (
        <UploadModal
          onClose={() => { setShowUpload(false); }}
          onUpload={handleUpload}
        />
      )}
    </div>
  )
}