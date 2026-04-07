/**
 * @file PageLoader.tsx
 * @description Full-page loading indicator shown while lazy route chunks
 *   are being fetched (Suspense fallback).
 *   Also used as a generic loading state across the app.
 *
 *   Satisfies: VIS-003 (loaders present, transitions fluid)
 */

import { JSX } from "react";

export function PageLoader(): JSX.Element {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: 'var(--color-navy)' }}
      role="status"
      aria-label="Chargement en cours…"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated BOAZ-STUDY logo mark */}
        <div className="relative w-12 h-12">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: 'var(--color-blue-light)',
              borderRightColor: 'var(--color-gold)',
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{ background: 'var(--color-surface)' }}
          />
        </div>
        <p
          className="text-sm tracking-widest uppercase animate-pulse-slow"
          style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
        >
          Chargement…
        </p>
      </div>
    </div>
  )
}