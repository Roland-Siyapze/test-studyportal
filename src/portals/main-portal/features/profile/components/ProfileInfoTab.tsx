import type { JSX } from 'react'
import { useState } from 'react'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  firstName: 'Fleming',
  lastName: 'Kevin',
  email: 'jaskoslski.brent@yahoo.com',
  phone: '546-933-2772',
}

export function ProfileInfoTab(): JSX.Element {
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [formData, setFormData] = useState(profile)
  const [saving, setSaving] = useState(false)

  function handleChange(field: keyof UserProfile, value: string): void {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave(): Promise<void> {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setProfile(formData)
    setSaving(false)
  }

  function handleCancel(): void {
    setFormData(profile)
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setProfile(prev => ({ ...prev, avatar: dataUrl }))
        setFormData(prev => ({ ...prev, avatar: dataUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={{ animation: 'fadeIn 0.35s ease' }}>
      {/* Profile Avatar Section - Centered */}
      <div style={{
        textAlign: 'center',
        marginBottom: 40,
        paddingBottom: 32,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Circular Avatar Button */}
        <input
          type="file"
          id="avatar-input"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => { document.getElementById('avatar-input')?.click() }}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: 'none',
            background: profile.avatar ? `url(${profile.avatar}) center/cover` : '#2563EB',
            backgroundImage: profile.avatar ? `url(${profile.avatar})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            position: 'relative',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.3)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.2)';
          }}
        >
          {!profile.avatar && (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          )}
        </button>
      </div>

      {/* Form Section - Centered */}
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Last Name (Nom) */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#94A3B8',
              marginBottom: 10,
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
            }}>
              Nom
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={e => { handleChange('lastName', e.target.value) }}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7';
              }}
            />
          </div>

          {/* First Name (Prénom) */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#94A3B8',
              marginBottom: 10,
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
            }}>
              Prénom
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={e => { handleChange('firstName', e.target.value) }}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
              }}
              onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9';
              }}
              onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7';
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Email */}
          <div>
            <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#94A3B8',
                marginBottom: 10,
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.02em',
            }}>
                Email
            </label>
            <input
                type="email"
                value={formData.email}
                onChange={e => { handleChange('email', e.target.value) }}
                style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
                }}
                onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9';
                }}
                onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7';
                }}
            />
          </div>

          {/* Phone */}
          <div>
            <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: '#94A3B8',
                marginBottom: 10,
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.02em',
            }}>
                Numéro de téléphone
            </label>
            <input
                type="tel"
                value={formData.phone}
                onChange={e => { handleChange('phone', e.target.value) }}
                style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 8,
                border: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)',
                background: '#F3F5F7',
                color: '#1A2332',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s',
                }}
                onFocus={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F0F4F9';
                }}
                onBlur={e => {
                (e.currentTarget as HTMLInputElement).style.background = '#F3F5F7';
                }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', marginTop: 30, gap: 12, justifyContent: 'flex-end' }}>
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
              (e.currentTarget as HTMLButtonElement).style.background = '#B0B8C3';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#CBD5E1';
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
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#1D4ED8';
            }}
            onMouseLeave={e => {
              if (!saving) (e.currentTarget as HTMLButtonElement).style.background = '#2563EB';
            }}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
