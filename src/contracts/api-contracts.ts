/**
 * @file api-contracts.ts
 * @description Canonical TypeScript interfaces for every API entity.
 *   These contracts are the single source of truth shared by services,
 *   hooks, components and mocks.  No `any` allowed — strict types only.
 *
 *   Mirrors the JWT structure from the spec (section 3.3) and all
 *   domain entities referenced in section 4.3 (permissions table).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Auth / Identity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decoded JWT payload as returned by Keycloak (or simulated in mocks).
 * Protection MUST be based on `authorities[]` — never on `realm_access.roles`.
 */
export interface AuthUser {
  sub: string
  preferred_username: string
  email: string
  realm_access: {
    roles: string[]
  }
  resource_access: {
    'studyportal-app': {
      roles: string[]
    }
  }
  scope: string
  /** ⚠ CRITICAL — component visibility is driven exclusively by this array */
  authorities: Permission[]
  exp: number
}

/**
 * Exhaustive list of permission scopes (authorities) used throughout the app.
 * Adding a new scope here forces TypeScript to surface every unhandled case.
 */
export type Permission =
  | 'ticket:create'
  | 'ticket:read'
  | 'ticket:update'
  | 'ticket:comment'
  | 'document:upload'
  | 'document:read'
  | 'document:download'
  | 'notification:read'
  | 'admin:access'
  | 'user:manage'

// ─────────────────────────────────────────────────────────────────────────────
// Tickets
// ─────────────────────────────────────────────────────────────────────────────

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: string
  updatedAt: string
  authorId: string
  authorName: string
  comments: TicketComment[]
}

export interface TicketComment {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export interface CreateTicketDto {
  title: string
  description: string
  priority: TicketPriority
}

// ─────────────────────────────────────────────────────────────────────────────
// Documents
// ─────────────────────────────────────────────────────────────────────────────

export type DocumentCategory = 'TRANSCRIPT' | 'CERTIFICATE' | 'INVOICE' | 'OTHER'

export interface Document {
  id: string
  name: string
  category: DocumentCategory
  size: number        // bytes
  mimeType: string
  uploadedAt: string
  uploadedById: string
  downloadUrl: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic API wrapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Standard envelope for all API responses.
 * Services always return `ApiResponse<T>` so callers never access raw HTTP.
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  total?: number   // for paginated list responses
}

/**
 * Standard shape for paginated list queries.
 */
export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Financement (Financing Requests)
// ─────────────────────────────────────────────────────────────────────────────
 
export type FinancementStatut =
  | 'EN_PREPARATION'
  | 'EN_ATTENTE_PAIEMENT'
  | 'PAIEMENT_EN_ATTENTE'
  | 'EN_COURS'
  | 'EN_REMBOURSEMENT'
  | 'CLOTURE'
  | 'ECHEANCE_PASSEE'
  | 'REJETE'
  | 'ACCEPTE'
 
export interface FinancementDemande {
  id: string
  nom: string | null
  sommeFinancement: number           // in XAF
  pourService: string | null
  dateDemande: string | null         // ISO date string (YYYY-MM-DD)
  sommeDejaRembourse: number
  sommeRestante: number
  documentAssocie: string | null     // null | 'document' | 'signer'
  statut: FinancementStatut
  createdAt: string
  updatedAt: string
  authorId: string
}
 
export interface FinancementEcheance {
  id: string
  date: string
  somme: number
}
 
export interface CreateFinancementDto {
  // Step 1 — Personal Info
  prenom: string
  nom: string
  lieuNaissance: string
  dateNaissance: string
  adresseComplete: string
  pays: string
  ville: string
  quartier: string
  telephone: string
 
  // Step 2 — Identity
  nomPrenomParent1: string
  telephoneParent1: string
  lieuResidenceParent1: string
  nomPrenomParent2: string
  telephoneParent2: string
  lieuResidenceParent2: string
 
  // Step 3 — Financing Details
  serviceAFinancer: string
  sommeDemandee: number
  fraisFinancement: number
  sommeTotaleARembourser: number
 
  // Step 4 — Schedule
  nombreEcheances: number
  echeances: FinancementEcheance[]
 
  // Step 5 — Justification
  justification: string
}