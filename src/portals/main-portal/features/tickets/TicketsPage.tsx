/**
 * @file TicketsPage.tsx
 * @description Ticket management feature page.
 *   - List of tickets with status + priority
 *   - Create ticket button (gated behind ticket:create)
 *   - Comment input (gated behind ticket:comment)
 *
 * Satisfies: PERM-002, PERM-003
 */

import type { JSX} from 'react';
import { useState } from 'react'
import { ProtectedComponent } from '@components/ProtectedComponent'
import { MOCK_TICKETS } from '@services/mock/tickets.mock'
import type { Ticket, TicketStatus, TicketPriority, CreateTicketDto } from '@contracts/api-contracts'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TicketStatus, { label: string; bg: string; color: string }> = {
  OPEN:        { label: 'Ouvert',       bg: '#EBF0FA', color: '#2A4F87' },
  IN_PROGRESS: { label: 'En cours',     bg: '#FFF4E0', color: '#D97E00' },
  RESOLVED:    { label: 'Résolu',       bg: '#EAF5EE', color: '#428959' },
  CLOSED:      { label: 'Fermé',        bg: '#F1F5F9', color: '#64748B' },
}

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  HIGH:   { label: 'Haute',   color: '#C73E1D' },
  MEDIUM: { label: 'Moyenne', color: '#D97E00' },
  LOW:    { label: 'Basse',   color: '#428959' },
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

// ─────────────────────────────────────────────────────────────────────────────
// Create Ticket Modal
// ─────────────────────────────────────────────────────────────────────────────

function CreateTicketModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (dto: CreateTicketDto) => void
}): JSX.Element {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(): Promise<void> {
    if (!title.trim() || !description.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    onCreate({ title: title.trim(), description: description.trim(), priority })
    setSubmitting(false)
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
        background: '#fff',
        borderRadius: 20,
        padding: 32,
        width: '100%',
        maxWidth: 480,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#1A2332' }}>
            Créer un ticket
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Titre *</label>
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); }}
              placeholder="Décrivez brièvement le problème"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E9F2', borderRadius: 10, fontSize: '0.9rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2A4F87'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Priorité</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['LOW', 'MEDIUM', 'HIGH'] as TicketPriority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPriority(p); }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: `1.5px solid ${priority === p ? PRIORITY_CONFIG[p].color : '#E5E9F2'}`,
                    background: priority === p ? `${PRIORITY_CONFIG[p].color}15` : '#fff',
                    color: priority === p ? PRIORITY_CONFIG[p].color : '#64748B',
                    fontWeight: priority === p ? 700 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.15s',
                  }}
                >
                  {PRIORITY_CONFIG[p].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Description *</label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); }}
              placeholder="Décrivez en détail votre problème ou demande..."
              rows={4}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E9F2', borderRadius: 10, fontSize: '0.88rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2A4F87'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(42,79,135,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E5E9F2', background: '#fff', color: '#64748B', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Annuler
            </button>
            <button
              onClick={() => void handleSubmit()}
              disabled={submitting || !title.trim() || !description.trim()}
              style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: 'var(--font-body)' }}
            >
              {submitting ? 'Création…' : 'Créer le ticket'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Ticket detail panel
// ─────────────────────────────────────────────────────────────────────────────

function TicketDetail({ ticket, onClose }: { ticket: Ticket; onClose: () => void }): JSX.Element {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submitComment(): Promise<void> {
    if (!comment.trim()) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setComment('')
    setSubmitting(false)
  }

  const st = STATUS_CONFIG[ticket.status]
  const pr = PRIORITY_CONFIG[ticket.priority]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: 32, width: '100%', maxWidth: 540,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#1A2332', marginBottom: 8 }}>
              {ticket.title}
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: st.bg, color: st.color }}>{st.label}</span>
              <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, background: '#F8FAFC', color: pr.color }}>{pr.label}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', fontSize: '1.4rem', lineHeight: 1 }}>×</button>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#374151', lineHeight: 1.6, marginBottom: 20, background: '#F8FAFC', padding: 16, borderRadius: 10 }}>
          {ticket.description}
        </p>

        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: 20 }}>
          Par <strong style={{ color: '#64748B' }}>{ticket.authorName}</strong> · {formatDate(ticket.createdAt)}
        </p>

        {/* Comments */}
        {ticket.comments.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#1A2332', marginBottom: 12 }}>
              Commentaires ({ticket.comments.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ticket.comments.map(c => (
                <div key={c.id} style={{ background: '#F8FAFC', borderRadius: 10, padding: '12px 14px', border: '1px solid #F0F2F7' }}>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2A4F87', marginBottom: 4 }}>{c.authorName}</p>
                  <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>{c.content}</p>
                  <p style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: 6 }}>{formatDate(c.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment input — permission gated */}
        <ProtectedComponent requires="ticket:comment">
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Ajouter un commentaire</label>
            <textarea
              value={comment}
              onChange={e => { setComment(e.target.value); }}
              placeholder="Votre commentaire..."
              rows={3}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E9F2', borderRadius: 10, fontSize: '0.88rem', fontFamily: 'var(--font-body)', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }}
              onFocus={e => { e.currentTarget.style.borderColor = '#2A4F87' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#E5E9F2' }}
            />
            <button
              onClick={() => void submitComment()}
              disabled={submitting || !comment.trim()}
              style={{ padding: '10px 20px', borderRadius: 10, border: 'none', background: '#2A4F87', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: submitting ? 0.7 : 1, fontFamily: 'var(--font-body)' }}
            >
              {submitting ? 'Envoi…' : 'Envoyer'}
            </button>
          </div>
        </ProtectedComponent>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main TicketsPage
// ─────────────────────────────────────────────────────────────────────────────

export function TicketsPage(): JSX.Element {
  // unused: hasPermission
  const [tickets, setTickets] = useState([...MOCK_TICKETS])
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [filter, setFilter] = useState<TicketStatus | 'ALL'>('ALL')

  function handleCreate(dto: CreateTicketDto): void {
    const newTicket: Ticket = {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      id: `ticket-${Date.now()}`,
      ...dto,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'current-user',
      authorName: 'Moi',
      comments: [],
    }
    setTickets(prev => [newTicket, ...prev])
  }

  const filtered = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
            {tickets.length} ticket{tickets.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <ProtectedComponent requires="ticket:create">
          <button
            onClick={() => { setShowCreate(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              border: 'none',
              background: '#F18F01',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(241,143,1,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Créer un ticket
          </button>
        </ProtectedComponent>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map(s => {
          const active = filter === s
          const config = s !== 'ALL' ? STATUS_CONFIG[s] : null
          return (
            <button
              key={s}
              onClick={() => { setFilter(s); }}
              style={{
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: active ? 700 : 500,
                border: active ? `1.5px solid ${config?.color ?? '#2A4F87'}` : '1.5px solid #E5E9F2',
                background: active ? (config?.bg ?? '#EBF0FA') : '#fff',
                color: active ? (config?.color ?? '#2A4F87') : '#64748B',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.15s',
              }}
            >
              {s === 'ALL' ? 'Tous' : STATUS_CONFIG[s].label}
            </button>
          )
        })}
      </div>

      {/* Ticket list */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map(ticket => {
          const st = STATUS_CONFIG[ticket.status]
          const pr = PRIORITY_CONFIG[ticket.priority]
          return (
            <div
              key={ticket.id}
              onClick={() => { setSelectedTicket(ticket); }}
              style={{
                background: '#fff',
                borderRadius: 14,
                border: '1.5px solid #E5E9F2',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(42,79,135,0.15)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Priority indicator bar */}
              <div style={{
                height: 4,
                background: pr.color,
              }} />

              {/* Card content */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#1A2332',
                    margin: 0,
                    flex: 1,
                    lineHeight: 1.4,
                  }}>
                    {ticket.title}
                  </h3>
                  {ticket.comments.length > 0 && (
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: '#F0F2F7',
                      color: '#64748B',
                      padding: '4px 10px',
                      borderRadius: 999,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      flexShrink: 0,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {ticket.comments.length}
                    </span>
                  )}
                </div>

                {/* Description preview */}
                <p style={{
                  fontSize: '0.85rem',
                  color: '#64748B',
                  lineHeight: 1.5,
                  marginBottom: 14,
                  fontFamily: 'var(--font-body)',
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {ticket.description}
                </p>

                {/* Metadata - Status, Priority, Date */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  paddingTop: 12,
                  borderTop: '1px solid #F0F2F7',
                }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: st.bg,
                    color: st.color,
                  }}>
                    {st.label}
                  </span>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: '#F8FAFC',
                    color: pr.color,
                  }}>
                    {pr.label}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#CBD5E1' }}>·</span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>

                {/* Action - View/Edit button */}
                <ProtectedComponent requires="ticket:update">
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedTicket(ticket) }}
                    style={{
                      width: '100%',
                      marginTop: 14,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1.5px solid #E5E9F2',
                      background: '#F8FAFC',
                      color: '#2A4F87',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#EBF0FA';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#2A4F87';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E9F2';
                    }}
                  >
                    Voir les détails
                  </button>
                </ProtectedComponent>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div style={{
            gridColumn: '1 / -1',
            background: '#fff',
            borderRadius: 14,
            border: '1px dashed #E5E9F2',
            padding: '60px 40px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎫</div>
            <p style={{
              fontWeight: 700,
              fontSize: '1.1rem',
              color: '#1A2332',
              fontFamily: 'var(--font-display)',
              marginBottom: 6,
            }}>
              Aucun ticket trouvé
            </p>
            <p style={{
              fontSize: '0.85rem',
              color: '#94A3B8',
              fontFamily: 'var(--font-body)',
              marginBottom: 20,
            }}>
              {filter === 'ALL'
                ? 'Vous n\'avez pas encore de ticket. Créez-en un pour démarrer.'
                : `Aucun ticket avec le statut "${STATUS_CONFIG[filter].label}"`}
            </p>
            {filter !== 'ALL' && (
              <button
                onClick={() => { setFilter('ALL'); }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 8,
                  border: '1.5px solid #E5E9F2',
                  background: '#EBF0FA',
                  color: '#2A4F87',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                }}
              >
                Voir tous les tickets
              </button>
            )}
          </div>
        )}
      </div>

      {showCreate && <CreateTicketModal onClose={() => { setShowCreate(false); }} onCreate={handleCreate} />}
      {selectedTicket && <TicketDetail ticket={selectedTicket} onClose={() => { setSelectedTicket(null); }} />}
    </div>
  )
}