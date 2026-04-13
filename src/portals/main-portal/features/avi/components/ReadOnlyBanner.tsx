import type { JSX } from 'react'

export function ReadOnlyBanner(): JSX.Element {
  return (
    <div style={{
      background: '#FFF9E6',
      border: '1px solid #FCD34D',
      borderRadius: 10,
      padding: '10px 16px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <span style={{ fontSize: '1rem' }}>👁️</span>
      <p style={{ fontSize: '0.82rem', color: '#92400E', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
        Mode lecture seule — vous n'avez pas la permission de modifier ce formulaire. Contactez un administrateur pour obtenir l'accès.
      </p>
    </div>
  )
}
