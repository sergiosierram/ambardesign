import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Icon from './Icons'
import Wordmark from './Wordmark'
import type { CartItem } from '../types'

interface Props {
  cart: CartItem[]
  user: { name: string } | null
}

export default function Header({ cart, user }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const cartCount = cart.reduce((a, i) => a + i.qty, 0)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'rgba(250,246,240,0.85)',
      backdropFilter: 'blur(10px) saturate(160%)',
      WebkitBackdropFilter: 'blur(10px) saturate(160%)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        background: 'var(--ink)', color: 'var(--cream)',
        textAlign: 'center', fontSize: 12, padding: '7px 16px', letterSpacing: '0.04em',
      }}>
        Hand-stitched in small batches · Free shipping on orders over $60
      </div>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '14px 32px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24,
      }}>
        <nav style={{ display: 'flex', gap: 22, fontSize: 13, fontWeight: 500 }}>
          {([['shop', '/shop', 'Shop'], ['builder', '/builder', 'Custom design'], ['about', '/about', 'Our story']] as const).map(([, path, label]) => (
            <a key={path} onClick={() => navigate(path)} style={{
              cursor: 'pointer',
              color: pathname === path ? 'var(--ink)' : 'var(--ink-soft)',
              borderBottom: pathname === path ? '1.5px solid var(--ink)' : '1.5px solid transparent',
              paddingBottom: 2, transition: 'color .15s',
            }}>{label}</a>
          ))}
        </nav>

        <a onClick={() => navigate('/')} style={{ cursor: 'pointer', justifySelf: 'center' }}>
          <Wordmark size={22} />
        </a>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6 }}>
          <button className="btn btn-ghost btn-sm"
            onClick={() => setSearchOpen(!searchOpen)}
            style={{ border: 'none', background: 'transparent', color: 'var(--ink-soft)' }}>
            <Icon name="search" size={18} />
          </button>
          <a onClick={() => navigate(user ? '/account' : '/login')} style={{
            cursor: 'pointer', padding: 8, color: 'var(--ink-soft)',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13,
          }}>
            <Icon name="user" size={18} />
            <span>{user ? user.name.split(' ')[0] : 'Sign in'}</span>
          </a>
          <a onClick={() => navigate('/cart')} style={{
            cursor: 'pointer', padding: 8, position: 'relative', color: 'var(--ink-soft)',
            display: 'inline-flex', alignItems: 'center',
          }}>
            <Icon name="cart" size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2,
                background: 'var(--brand, var(--lavender))', color: 'white',
                fontSize: 10, fontWeight: 700, borderRadius: 999,
                width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{cartCount}</span>
            )}
          </a>
        </div>
      </div>

      {searchOpen && (
        <div style={{ padding: '0 32px 16px', maxWidth: 1280, margin: '0 auto' }}>
          <input
            autoFocus
            className="input"
            placeholder="Search designs…"
            onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false) }}
            style={{ maxWidth: 480 }}
          />
        </div>
      )}
    </header>
  )
}
