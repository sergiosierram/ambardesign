import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Wordmark from '../components/Wordmark'
import { PATTERNS, PALETTES } from '../data/products'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  mode: 'login' | 'signup'
}

export default function AuthScreen({ mode }: Props) {
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name)
    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      navigate('/account')
    }
  }

  async function handleGoogle() {
    await signInWithGoogle()
    navigate('/account')
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>
      <div style={{
        background: 'var(--bg-hero)',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ marginBottom: 'auto' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Wordmark size={24} />
          </button>
        </div>

        <div style={{ padding: '48px 0 32px' }}>
          <h2 className="serif" style={{
            fontSize: 64,
            lineHeight: 1.05,
            color: 'var(--ink)',
            marginBottom: 20,
          }}>
            Bead by bead,{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--lavender-deep)' }}>your way.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 380, lineHeight: 1.6 }}>
            Handcrafted bead jewelry made with Miyuki Delicas — each piece woven just for you.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          maxWidth: 280,
          marginTop: 'auto',
          paddingTop: 40,
        }}>
          <div style={{
            background: 'var(--paper)',
            borderRadius: 'var(--r-lg)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-2)',
          }}>
            <BeadArt pattern={PATTERNS.flower} palette={PALETTES.lavenderField} size={80} />
          </div>
          <div style={{
            background: 'var(--paper)',
            borderRadius: 'var(--r-lg)',
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-2)',
          }}>
            <BeadArt pattern={PATTERNS.heart} palette={PALETTES.rosyClay} size={80} />
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--paper)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ marginBottom: 32 }}>
            <span className="chip chip-lav" style={{ marginBottom: 16, display: 'inline-flex' }}>
              {isLogin ? 'Welcome back' : 'New here'}
            </span>
            <h1 className="serif" style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 8 }}>
              {isLogin ? 'Sign in' : 'Create account'}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
              {isLogin
                ? 'Good to see you again. Enter your details below.'
                : 'Join to track orders, save designs, and more.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!isLogin && (
              <div>
                <label className="label" htmlFor="auth-name">Full name</label>
                <input
                  id="auth-name"
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Sofia García"
                  required
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="label" htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label className="label" htmlFor="auth-password" style={{ margin: 0 }}>Password</label>
                {isLogin && (
                  <button
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: 'var(--lavender-deep)',
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                id="auth-password"
                className="input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={isLogin ? '········' : 'At least 8 characters'}
                required
                minLength={isLogin ? undefined : 8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: 'var(--r-sm)',
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--err)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 4 }}
            >
              {loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '24px 0',
          }}>
            <hr className="divider" style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--ink-mute)', fontWeight: 600, whiteSpace: 'nowrap' }}>OR</span>
            <hr className="divider" style={{ flex: 1 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', gap: 10 }}
              onClick={handleGoogle}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: 'block' }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button
              className="btn btn-ghost"
              style={{ width: '100%', gap: 10 }}
              onClick={() => {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'block' }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Continue with Apple
            </button>
          </div>

          <p style={{ fontSize: 13, color: 'var(--ink-soft)', textAlign: 'center', marginTop: 28 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => navigate(isLogin ? '/signup' : '/login')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--lavender-deep)',
                padding: 0,
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
