import { useNavigate } from 'react-router-dom'
import BeadArt from './BeadArt'
import Icon from './Icons'
import type { Product } from '../types'

interface Props {
  p: Product
  size?: 'sm' | 'md'
}

export default function ProductCard({ p, size = 'md' }: Props) {
  const navigate = useNavigate()
  const tile = size === 'sm' ? 160 : 240

  const tagColor = p.tags[0] === 'New' ? 'sage' : p.tags[0] === 'Sold out' ? 'rose' : 'lav'

  return (
    <a className="card" onClick={() => navigate(`/product/${p.id}`)} style={{
      cursor: 'pointer', overflow: 'hidden', display: 'block', textDecoration: 'none',
      transition: 'transform .15s, box-shadow .15s',
    }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-2px)'
        el.style.boxShadow = 'var(--shadow-2)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = ''
        el.style.boxShadow = ''
      }}
    >
      <div style={{
        position: 'relative', aspectRatio: '1 / 1', background: 'var(--cream-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <BeadArt pattern={p.pattern} palette={p.palette} size={tile} />
        {p.tags[0] && (
          <span className={`chip chip-${tagColor}`} style={{ position: 'absolute', top: 12, left: 12 }}>
            {p.tags[0]}
          </span>
        )}
        <button style={{
          position: 'absolute', top: 12, right: 12, width: 32, height: 32,
          borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-soft)',
        }} onClick={e => e.stopPropagation()}>
          <Icon name="heart" size={15} />
        </button>
      </div>
      <div style={{ padding: '14px 16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span className="serif" style={{ fontSize: 19, color: 'var(--ink)' }}>{p.name}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>${p.price}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
          <span>{p.cat}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{p.palette_name}</span>
        </div>
      </div>
    </a>
  )
}
