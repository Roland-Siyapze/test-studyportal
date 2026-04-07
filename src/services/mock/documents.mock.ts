/**
 * @file documents.mock.ts
 * @description Static mock data for the Documents feature.
 */

import type { Document, ApiResponse } from '@contracts/api-contracts'

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc-001',
    name: 'Relevé de notes S1 2024',
    category: 'TRANSCRIPT',
    size: 245760,
    mimeType: 'application/pdf',
    uploadedAt: new Date(Date.now() - 2592000000).toISOString(),
    uploadedById: 'admin-uuid-0001',
    downloadUrl: '/mock/documents/releve-s1-2024.pdf',
  },
  {
    id: 'doc-002',
    name: 'Certificat de scolarité 2024-2025',
    category: 'CERTIFICATE',
    size: 102400,
    mimeType: 'application/pdf',
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    uploadedById: 'admin-uuid-0001',
    downloadUrl: '/mock/documents/certificat-scolarite.pdf',
  },
  {
    id: 'doc-003',
    name: 'Facture inscription 2024',
    category: 'INVOICE',
    size: 153600,
    mimeType: 'application/pdf',
    uploadedAt: new Date(Date.now() - 7776000000).toISOString(),
    uploadedById: 'admin-uuid-0001',
    downloadUrl: '/mock/documents/facture-2024.pdf',
  },
]

export const MOCK_DOCUMENTS_RESPONSE: ApiResponse<Document[]> = {
  data: MOCK_DOCUMENTS,
  success: true,
  total: MOCK_DOCUMENTS.length,
}