/**
 * @file notifications.mock.ts
 * @description Static mock data for the Notifications feature.
 */

import type { Notification, ApiResponse } from '@contracts/api-contracts'

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    type: 'SUCCESS',
    title: 'Ticket résolu',
    message: 'Votre ticket "Correction d\'inscription" a été résolu.',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif-002',
    type: 'INFO',
    title: 'Nouveau document disponible',
    message: 'Votre relevé de notes du semestre 1 est disponible.',
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif-003',
    type: 'WARNING',
    title: 'Délai de paiement',
    message: 'Le paiement des frais de scolarité est dû dans 7 jours.',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
]

export const MOCK_NOTIFICATIONS_RESPONSE: ApiResponse<Notification[]> = {
  data: MOCK_NOTIFICATIONS,
  success: true,
  total: MOCK_NOTIFICATIONS.length,
}