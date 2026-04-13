import type { JSX } from 'react'

export type NotificationType = 'success' | 'warning' | 'error' | 'confirm'

interface NotificationIconProps {
  type: NotificationType
  size?: number
}

const sizeDefault = 72

function SuccessIcon({ size = sizeDefault }: { size?: number }): JSX.Element {
  const iconSize = (size / 72) * 36
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #34D399, #10B981)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
    }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  )
}

function WarningIcon({ size = sizeDefault }: { size?: number }): JSX.Element {
  const iconSize = (size / 72) * 36
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
    }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>
  )
}

function ErrorIcon({ size = sizeDefault }: { size?: number }): JSX.Element {
  const iconSize = (size / 72) * 36
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #F87171, #EF4444)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(239,68,68,0.3)',
    }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    </div>
  )
}

function ConfirmIcon({ size = sizeDefault }: { size?: number }): JSX.Element {
  const iconSize = (size / 72) * 36
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #FCD34D, #F59E0B)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(245,158,11,0.3)',
    }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  )
}

export function NotificationIcon({ type, size }: NotificationIconProps): JSX.Element {
  switch (type) {
    case 'success':
      return <SuccessIcon size={size} />
    case 'warning':
      return <WarningIcon size={size} />
    case 'error':
      return <ErrorIcon size={size} />
    case 'confirm':
      return <ConfirmIcon size={size} />
  }
}

export const notificationConfig = {
  success: {
    titleColor: '#10B981',
    label: 'SUCCESS!',
    defaultConfirm: 'Continuer',
    confirmBg: '#10B981',
    confirmHover: '#059669',
    showCancel: false,
  },
  warning: {
    titleColor: '#F59E0B',
    label: 'ATTENTION!',
    defaultConfirm: 'Confirmer',
    confirmBg: '#F59E0B',
    confirmHover: '#D97706',
    showCancel: true,
  },
  error: {
    titleColor: '#EF4444',
    label: 'ERREUR!',
    defaultConfirm: 'RÉESSAYER',
    confirmBg: '#EF4444',
    confirmHover: '#DC2626',
    showCancel: false,
  },
  confirm: {
    titleColor: '#374151',
    label: null,
    defaultConfirm: 'Confirmer',
    confirmBg: '#10B981',
    confirmHover: '#059669',
    showCancel: true,
  },
}
