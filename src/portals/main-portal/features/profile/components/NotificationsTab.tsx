import { useState } from 'react'
import type { JSX } from 'react'


export function NotificationsTab(): JSX.Element {
  const [prefs, setPrefs] = useState([
    { id: 'email-updates', label: 'Mises à jour par email', description: 'Recevez les mises à jour importantes par email', enabled: true },
    { id: 'email-marketing', label: 'Emails marketing', description: 'Offres spéciales et contenu promotionnel', enabled: false },
    { id: 'sms-alerts', label: 'Alertes SMS', description: 'Notifications critiques via SMS', enabled: true },
    { id: 'push-notifications', label: 'Notifications push', description: 'Notifications en temps réel dans l\'application', enabled: true },
    { id: 'weekly-digest', label: 'Résumé hebdomadaire', description: 'Raccourci des activités de la semaine', enabled: false },
  ])

  const [saving, setSaving] = useState(false)

  function togglePref(id: string): void {
    setPrefs(prev => prev.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p))
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setSaving(false)
    }
  }

  function handleCancel(): void {
    // Reset to initial state
    setPrefs([
      { id: 'email-updates', label: 'Mises à jour par email', description: 'Recevez les mises à jour importantes par email', enabled: true },
      { id: 'email-marketing', label: 'Emails marketing', description: 'Offres spéciales et contenu promotionnel', enabled: false },
      { id: 'sms-alerts', label: 'Alertes SMS', description: 'Notifications critiques via SMS', enabled: true },
      { id: 'push-notifications', label: 'Notifications push', description: 'Notifications en temps réel dans l\'application', enabled: true },
      { id: 'weekly-digest', label: 'Résumé hebdomadaire', description: 'Raccourci des activités de la semaine', enabled: false },
    ])
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Form Section - Centered */}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Preferences List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {prefs.map(pref => (
            <div
              key={pref.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                paddingBottom: 16,
                borderBottom: '1px solid #E5E9F2',
              }}
            >
              <div style={{ flex: 1, marginRight: 16 }}>
                <p style={{
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#1A2332',
                  fontFamily: 'var(--font-body)',
                  margin: 0,
                  marginBottom: 4,
                }}>
                  {pref.label}
                </p>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#64748B',
                  fontFamily: 'var(--font-body)',
                  margin: 0,
                }}>
                  {pref.description}
                </p>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={() => { togglePref(pref.id) }}
                style={{
                  width: 50,
                  height: 28,
                  borderRadius: 999,
                  border: 'none',
                  background: pref.enabled ? '#2563EB' : '#CBD5E1',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.25s ease',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: pref.enabled ? 24 : 2,
                    width: 24,
                    height: 24,
                    background: '#fff',
                    borderRadius: '50%',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              border: 'none',
              background: '#CBD5E1',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#B0B8C3'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#CBD5E1'
            }}
          >
            Annuler
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            style={{
              padding: '12px 28px',
              borderRadius: 999,
              border: 'none',
              background: '#2563EB',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8'
            }}
            onMouseLeave={e => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#2563EB'
            }}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
