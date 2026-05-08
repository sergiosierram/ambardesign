import { useNavigate } from 'react-router-dom'
import Wordmark from './Wordmark'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer style={{ marginTop: 80, background: 'var(--cream-2)', borderTop: '1px solid var(--line)' }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '60px 32px 24px',
        display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48,
      }}>
        <div>
          <Wordmark size={22} />
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: 280 }}>
            Tiny stitched-bead jewelry. Each piece is woven by hand in small batches in Armenia, Quindío, then sent your way.
          </p>
        </div>
        {([
          ['Shop', [['/shop', 'All designs'], ['/builder', 'Custom design'], ['/shop', 'Bestsellers'], ['/shop', 'New arrivals']]],
          ['Account', [['/login', 'Sign in'], ['/signup', 'Create account'], ['/account', 'My orders'], ['/account', 'Wishlist']]],
          ['About', [['/about', 'Our story'], ['/about', 'Care & repair'], ['/about', 'Shipping & returns'], ['/about', 'Contact']]],
        ] as [string, [string, string][]][]).map(([title, links]) => (
          <div key={title}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--ink)', marginBottom: 14,
            }}>{title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map(([path, label]) => (
                <a key={label} onClick={() => navigate(path)} style={{ cursor: 'pointer', fontSize: 13, color: 'var(--ink-soft)' }}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '20px 32px',
        borderTop: '1px solid var(--line)',
        display: 'flex', justifyContent: 'space-between',
        fontSize: 12, color: 'var(--ink-mute)',
      }}>
        <span>© 2026 Ambar Design</span>
        <span>Hecho a mano · Armenia, Quindío → todo el mundo</span>
        <a onClick={() => navigate('/admin-login')} style={{ cursor: 'pointer', color: 'var(--ink-mute)' }}>Admin</a>
      </div>
    </footer>
  )
}
