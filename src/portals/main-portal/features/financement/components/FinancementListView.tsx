import type { JSX } from 'react'
import { useState } from 'react'
import type { FinancementDemande, FinancementStatut } from '@contracts/api-contracts'
import { ProtectedComponent } from '@components/ProtectedComponent'

interface FinancementListViewProps {
  demandes: FinancementDemande[]
  onNew: () => void
}




const STATUT_CONFIG: Record<FinancementStatut, { label: string; color: string; dotColor: string; borderColor: string; bg: string }> = {
  EN_PREPARATION:      { label: 'En préparation',       color: '#D97E00', dotColor: '#F18F01', borderColor: '#F18F01', bg: '#FFF7ED' },
  EN_ATTENTE_PAIEMENT: { label: 'En attente de paiement', color: '#D97E00', dotColor: '#F5B942', borderColor: '#F5B942', bg: '#FFFBEB' },
  PAIEMENT_EN_ATTENTE: { label: 'Paiement en attente',  color: '#2A4F87', dotColor: '#2563EB', borderColor: '#2563EB', bg: '#EBF0FA' },
  EN_COURS:            { label: 'En cours',              color: '#D97E00', dotColor: '#D97E00', borderColor: 'transparent', bg: 'transparent' },
  EN_REMBOURSEMENT:    { label: 'En remboursement',      color: '#2A4F87', dotColor: '#2563EB', borderColor: 'transparent', bg: 'transparent' },
  CLOTURE:             { label: 'Clôturé',               color: '#64748B', dotColor: '#94A3B8', borderColor: 'transparent', bg: 'transparent' },
  ECHEANCE_PASSEE:     { label: 'Échéance passée',       color: '#D97E00', dotColor: '#D97E00', borderColor: 'transparent', bg: 'transparent' },
  REJETE:              { label: 'Rejeté',                color: '#C73E1D', dotColor: '#C73E1D', borderColor: 'transparent', bg: 'transparent' },
  ACCEPTE:             { label: 'Accepté',               color: '#428959', dotColor: '#428959', borderColor: 'transparent', bg: 'transparent' },
}

const FILTER_BUTTONS: Array<{ statut: FinancementStatut; label: string; dotColor: string; borderColor: string; activeBg: string }> = [
  { statut: 'EN_PREPARATION',      label: 'En préparation',        dotColor: '#F18F01', borderColor: '#F18F01', activeBg: '#FFF7ED' },
  { statut: 'EN_ATTENTE_PAIEMENT', label: 'En attente de paiement', dotColor: '#F5B942', borderColor: '#F5B942', activeBg: '#FFFBEB' },
  { statut: 'PAIEMENT_EN_ATTENTE', label: 'Paiement en attente',   dotColor: '#2563EB', borderColor: '#2563EB', activeBg: '#EBF0FA' },
  { statut: 'CLOTURE',             label: 'Clôturée',              dotColor: '#94A3B8', borderColor: '#94A3B8', activeBg: '#F1F5F9' },
  { statut: 'ACCEPTE',             label: 'Payée',                 dotColor: '#428959', borderColor: '#428959', activeBg: '#EAF5EE' },
  { statut: 'EN_COURS',            label: 'Livré',                 dotColor: '#2563EB', borderColor: '#2563EB', activeBg: '#EBF0FA' },
]

export function FinancementListView({ demandes, onNew }: FinancementListViewProps): JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FinancementStatut | 'ALL'>('ALL')

  function formatMontant(n: number): string {
    return n === 0 ? '0' : `${(n / 1000).toFixed(0)}.000.000 XAF`
  }

  function renderDocumentCell(doc: string | null, statut: FinancementStatut): JSX.Element {
    if (!doc || statut === 'EN_COURS' || statut === 'REJETE') {
      return <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Aucun document</span>
    }
    if (doc === 'signer') {
      return (
        <button style={{
          padding: '5px 14px', borderRadius: 999, border: 'none',
          background: '#7C3AED', color: '#fff',
          fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
          fontFamily: 'var(--font-body)',
        }}>
          Signer
        </button>
      )
    }
    return (
      <button style={{
        padding: '5px 14px', borderRadius: 999, border: 'none',
        background: '#2563EB', color: '#fff',
        fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
        fontFamily: 'var(--font-body)',
      }}>
        Télécharger
      </button>
    )
  }

  const filtered = activeFilter === 'ALL'
    ? demandes
    : demandes.filter(d => d.statut === activeFilter)

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <ProtectedComponent requires="ticket:create">
          <button
            onClick={onNew}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: '#F18F01', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
              cursor: 'pointer', fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 12px rgba(241,143,1,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span className="desktop-only">Nouvelle demande</span>
            <span className="mobile-only">Nouveau</span>
          </button>
        </ProtectedComponent>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: '28px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {FILTER_BUTTONS.map(btn => {
            const isActive = activeFilter === btn.statut
            return (
              <button
                key={btn.statut}
                onClick={() => { setActiveFilter(isActive ? 'ALL' : btn.statut); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: `1.5px solid ${isActive ? btn.borderColor : '#E5E9F2'}`,
                  background: isActive ? btn.activeBg : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#1A2332' : '#64748B',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isActive ? btn.dotColor : '#D1D5DB',
                  flexShrink: 0,
                }} />
                {btn.label}
              </button>
            )
          })}
        </div>

        {/* Desktop Table */}
        <div className="desktop-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr>
                {['No', 'Nom', 'Somme financement', 'Pour service', 'Date de la demande', 'Somme déjà remboursé', 'Somme restante', 'Document associé', 'Statut', 'Action'].map(col => (
                  <th key={col} style={{
                    padding: '10px 12px',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#374151',
                    borderBottom: '1px solid #E5E9F2',
                    borderRight: '1px solid #F0F2F8',
                    fontSize: '0.78rem',
                    background: '#FAFBFE',
                  }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, idx) => {
                const cfg = STATUT_CONFIG[d.statut]
                return (
                  <tr
                    key={d.id}
                    style={{ transition: 'background 0.1s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#FAFBFE' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
                  >
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151', fontWeight: 600 }}>
                      {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.nom ?? '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151', fontWeight: 600 }}>
                      {formatMontant(d.sommeFinancement)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.pourService ?? '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.dateDemande
                        ? new Intl.DateTimeFormat('fr-FR').format(new Date(d.dateDemande))
                        : '-'}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.sommeDejaRembourse === 0 ? '0' : formatMontant(d.sommeDejaRembourse)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8', color: '#374151' }}>
                      {d.sommeRestante === 0 ? '0' : formatMontant(d.sommeRestante)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8' }}>
                      {renderDocumentCell(d.documentAssocie, d.statut)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.78rem', color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #F0F2F8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                        <button title="Voir" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#2563EB', padding: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <button title="Modifier" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button title="Supprimer" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#C73E1D', padding: 2 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '48px', textAlign: 'center', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
                    Aucune demande trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-cards" style={{ display: 'none' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#94A3B8', fontFamily: 'var(--font-body)' }}>
              Aucune demande trouvée
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filtered.map((d, idx) => {
                const cfg = STATUT_CONFIG[d.statut]
                return (
                  <div
                    key={d.id}
                    style={{
                      background: '#FAFBFE',
                      borderRadius: 12,
                      padding: '16px',
                      border: '1px solid #E5E9F2',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: '#2563EB', color: '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.7rem', fontFamily: 'var(--font-display)',
                        }}>
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                        <span style={{ fontWeight: 600, color: '#374151', fontSize: '0.85rem' }}>
                          {d.nom ?? '-'}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 10px', borderRadius: 999,
                        background: cfg.bg, color: cfg.color,
                        fontWeight: 700, fontSize: '0.7rem',
                      }}>
                        {cfg.label}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: 2 }}>Somme financement</span>
                        <span style={{ fontWeight: 600, color: '#1A2332', fontSize: '0.85rem' }}>{formatMontant(d.sommeFinancement)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: 2 }}>Service</span>
                        <span style={{ color: '#374151', fontSize: '0.85rem' }}>{d.pourService ?? '-'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: 2 }}>Date</span>
                        <span style={{ color: '#374151', fontSize: '0.85rem' }}>
                          {d.dateDemande ? new Intl.DateTimeFormat('fr-FR').format(new Date(d.dateDemande)) : '-'}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'block', marginBottom: 2 }}>Remboursé</span>
                        <span style={{ color: '#374151', fontSize: '0.85rem' }}>{d.sommeDejaRembourse === 0 ? '0' : formatMontant(d.sommeDejaRembourse)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Restante: </span>
                        <span style={{ fontWeight: 600, color: '#1A2332', fontSize: '0.85rem' }}>
                          {d.sommeRestante === 0 ? '0' : formatMontant(d.sommeRestante)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {renderDocumentCell(d.documentAssocie, d.statut)}
                        <button title="Voir" style={{ border: 'none', background: '#E5E9F2', cursor: 'pointer', color: '#2563EB', padding: '6px 10px', borderRadius: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        </button>
                        <button title="Modifier" style={{ border: 'none', background: '#E5E9F2', cursor: 'pointer', color: '#64748B', padding: '6px 10px', borderRadius: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        </button>
                        <button title="Supprimer" style={{ border: 'none', background: '#FEE2E2', cursor: 'pointer', color: '#C73E1D', padding: '6px 10px', borderRadius: 8 }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <style>{`
          @media (max-width: 768px) {
            .desktop-table { display: none !important; }
            .mobile-cards { display: block !important; }
            .desktop-only { display: none !important; }
            .mobile-only { display: inline !important; }
          }
          @media (min-width: 769px) {
            .desktop-only { display: inline !important; }
            .mobile-only { display: none !important; }
          }
        `}</style>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
          <button style={{
            padding: '10px 28px', borderRadius: 8, border: '1.5px solid #E5E9F2',
            background: '#E5E7EB', color: '#6B7280', fontWeight: 600, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            Retour
          </button>
          <button style={{
            padding: '10px 28px', borderRadius: 8, border: 'none',
            background: '#2563EB', color: '#fff', fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}