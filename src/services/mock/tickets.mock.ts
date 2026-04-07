/**
 * @file tickets.mock.ts
 * @description Static mock data for the Tickets feature.
 *   Consumed by the Axios interceptor fallback when the backend
 *   is unavailable (MOCK-003 evaluator scenario).
 */

import type { Ticket, ApiResponse } from '@contracts/api-contracts'

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'ticket-001',
    title: 'Problème accès espace documents',
    description: 'Je ne peux pas accéder à mes documents de scolarité depuis hier.',
    status: 'OPEN',
    priority: 'HIGH',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    authorId: 'user-uuid-0042',
    authorName: 'John Doe',
    comments: [
      {
        id: 'comment-001',
        content: 'Nous allons vérifier cela rapidement.',
        authorId: 'admin-uuid-0001',
        authorName: 'Admin BOAZ',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ],
  },
  {
    id: 'ticket-002',
    title: 'Demande de relevé de notes',
    description: 'J\'ai besoin de mon relevé de notes officiel pour une candidature.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    authorId: 'user-uuid-0042',
    authorName: 'John Doe',
    comments: [],
  },
  {
    id: 'ticket-003',
    title: 'Correction d\'inscription',
    description: 'Mon prénom est mal orthographié sur les documents officiels.',
    status: 'RESOLVED',
    priority: 'LOW',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    authorId: 'user-uuid-0042',
    authorName: 'John Doe',
    comments: [],
  },
]

export const MOCK_TICKETS_RESPONSE: ApiResponse<Ticket[]> = {
  data: MOCK_TICKETS,
  success: true,
  total: MOCK_TICKETS.length,
}