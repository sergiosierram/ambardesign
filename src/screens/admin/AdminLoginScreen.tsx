import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Wordmark from '../../components/Wordmark'

interface Props {
  onLogin: () => void
}

export default function AdminLoginScreen({ onLogin }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your credentials.')
      return
    }
    setError('')
    onLogin()
    navigate('/admin')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ink)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 'var(--r-xl)',
        padding: '36px 36px 32px',
      }}>
        <div style={{ marginBottom: 28 }}>
          <Wordmark size={22} color="var(--cream)" />
        </div>

        <div style={{ marginBottom: 28 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            borderRadius: 'var(--r-pill)',
            background: 'rgba(159,143,201,0.18)',
            border: '1px solid rgba(159,143,201,0.3)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: 'var(--lavender-2)',
            marginBottom: 18,
          }}>
            Studio admin
          </span>
          <h1 className="serif" style={{
            fontSize: 36,
            color: 'var(--cream)',
            lineHeight: 1.1,
            marginBottom: 8,
          }}>
            Studio sign-in
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(250,246,240,0.45)' }}>
            For Laura only
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              color: 'rgba(250,246,240,0.5)',
              marginBottom: 7,
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="laura@ambardesign.co"
              autoComplete="username"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontFamily: 'var(--sans)',
                fontSize: 14,
                color: 'var(--cream)',
                outline: 'none',
                transition: 'border-color .15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(159,143,201,0.6)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              color: 'rgba(250,246,240,0.5)',
              marginBottom: 7,
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontFamily: 'var(--sans)',
                fontSize: 14,
                color: 'var(--cream)',
                outline: 'none',
                transition: 'border-color .15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(159,143,201,0.6)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              color: 'rgba(250,246,240,0.5)',
              marginBottom: 7,
            }}>
              2FA code
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                fontFamily: 'var(--mono)',
                fontSize: 18,
                letterSpacing: '0.18em',
                color: 'var(--cream)',
                outline: 'none',
                transition: 'border-color .15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'rgba(159,143,201,0.6)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
            />
          </div>

          {error && (
            <p style={{ fontSize: 13, color: '#e07070', margin: 0 }}>{error}</p>
          )}

          <button
            type="submit"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              width: '100%',
              padding: '13px 20px',
              marginTop: 4,
              borderRadius: 'var(--r-pill)',
              background: 'var(--lavender)',
              border: 'none',
              fontFamily: 'var(--sans)',
              fontSize: 14,
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              transition: 'filter .15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = '' }}
          >
            Enter studio
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              fontSize: 13,
              color: 'rgba(250,246,240,0.35)',
              transition: 'color .12s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,246,240,0.65)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,246,240,0.35)' }}
          >
            ← Back to shop
          </button>
        </div>
      </div>
    </div>
  )
}
