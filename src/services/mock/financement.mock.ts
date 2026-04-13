/**
 * @file financement.mock.ts
 * @description Static mock data for the Financement (Financing) feature.
 *   Consumed by the Axios interceptor fallback when the backend
 *   is unavailable (MOCK-003 evaluator scenario).
 */

import type { FinancementDemande, ApiResponse } from '@contracts/api-contracts'

export const MOCK_FINANCEMENT_DEMANDES: FinancementDemande[] = [
  {
    id: 'fin-001',
    nom: 'YONKE',
    sommeFinancement: 3000000,
    pourService: 'A.V.I',
    dateDemande: '2025-02-23',
    sommeDejaRembourse: 0,
    sommeRestante: 0,
    documentAssocie: null,
    statut: 'EN_COURS',
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    authorId: 'user-uuid-0042',
  },
  {
    id: 'fin-002',
    nom: null,
    sommeFinancement: 2000000,
    pourService: null,
    dateDemande: null,
    sommeDejaRembourse: 2000000,
    sommeRestante: 1000000,
    documentAssocie: 'document',
    statut: 'EN_REMBOURSEMENT',
    createdAt: new Date(Date.now() - 3600000 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    authorId: 'user-uuid-0042',
  },
  {
    id: 'fin-003',
    nom: null,
    sommeFinancement: 2000000,
    pourService: null,
    dateDemande: null,
    sommeDejaRembourse: 2000000,
    sommeRestante: 0,
    documentAssocie: 'document',
    statut: 'CLOTURE',
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    authorId: 'user-uuid-0042',
  },
  {
    id: 'fin-004',
    nom: null,
    sommeFinancement: 3000000,
    pourService: null,
    dateDemande: null,
    sommeDejaRembourse: 500000,
    sommeRestante: 2500000,
    documentAssocie: 'document',
    statut: 'ECHEANCE_PASSEE',
    createdAt: new Date(Date.now() - 3600000 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    authorId: 'user-uuid-0042',
  },
  {
    id: 'fin-005',
    nom: null,
    sommeFinancement: 1000000,
    pourService: null,
    dateDemande: null,
    sommeDejaRembourse: 0,
    sommeRestante: 0,
    documentAssocie: null,
    statut: 'REJETE',
    createdAt: new Date(Date.now() - 3600000 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    authorId: 'user-uuid-0042',
  },
  {
    id: 'fin-006',
    nom: null,
    sommeFinancement: 5000000,
    pourService: 'A.V.I',
    dateDemande: '2025-03-20',
    sommeDejaRembourse: 0,
    sommeRestante: 0,
    documentAssocie: 'signer',
    statut: 'ACCEPTE',
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    authorId: 'user-uuid-0042',
  },
]

export const MOCK_FINANCEMENT_RESPONSE: ApiResponse<FinancementDemande[]> = {
  data: MOCK_FINANCEMENT_DEMANDES,
  success: true,
  total: MOCK_FINANCEMENT_DEMANDES.length,
}