/**
 * @file PageLoader.tsx  (light theme)
 * @description Full-page loading indicator — light theme version.
 *   Satisfies: VIS-003
 */

import type { JSX } from "react";
import logo from '@assets/logo.png'

export function PageLoader(): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F4F6FA',
        flexDirection: 'column',
        gap: 16,
      }}
      role="status"
      aria-label="Chargement en cours…"
    >
      {/* Spinner */}
      <div style={{ position: 'relative', width: 48, height: 48 }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#2A4F87',
          borderRightColor: '#F18F01',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: 8,
          borderRadius: '50%',
          background: '#F4F6FA',
        }} />
      </div>

      {/* Logo */}
      <div style={{ padding: '22px 20px 18px' }}>
        <img
          src={logo}
          alt="Boaz Study"
          style={{ height: 65, width: 'auto', display: 'flex', margin: 'auto', objectFit: 'contain' }}
        />
      </div>

      <p style={{
        fontFamily: 'Nunito, sans-serif',
        fontSize: '0.82rem',
        color: '#94A3B8',
        letterSpacing: '0.05em',
      }}>
        Chargement…
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}