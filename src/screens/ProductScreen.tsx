import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Icon from '../components/Icons'
import { PRODUCTS } from '../data/products'
import type { Product } from '../types'

interface Props {
  addToCart: (p: Product, qty: number) => void
}

type ViewIndex = 0 | 1 | 2

const VIEW_LABELS: [string, string, string] = ['Front', 'Detail', 'On wear']

function stockColor(stock: number): string {
  if (stock === 0) return 'var(--err)'
  if (stock <= 4) return 'var(--warn)'
  return 'var(--ok)'
}

function stockLabel(stock: number): string {
  if (stock === 0) return 'Sold out'
  if (stock <= 4) return `Only ${stock} left`
  return 'In stock'
}

export default function ProductScreen({ addToCart }: Props) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [qty, setQty] = useState<number>(1)
  const [view, setView] = useState<ViewIndex>(0)

  const p = PRODUCTS.find(x => x.id === id)

  if (!p) {
    return (
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '80px 32px',
        textAlign: 'center',
        color: 'var(--ink-soft)',
      }}>
        <p style={{ fontSize: 18, marginBottom: 20 }}>Product not found.</p>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/shop')}>
          Back to shop
        </button>
      </div>
    )
  }

  const related: Product[] = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4)
  const soldOut = p.stock === 0

  const beadSizes: [number, number, number] = [p.pattern[0].length > 5 ? 420 : 340, 160, 280]
  const currentSize = beadSizes[view]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 32px 80px' }}>
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        color: 'var(--ink-soft)',
        marginBottom: 36,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontFamily: 'var(--sans)', fontSize: 13, padding: 0 }}
        >
          Home
        </button>
        <span>/</span>
        <button
          onClick={() => navigate('/shop')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontFamily: 'var(--sans)', fontSize: 13, padding: 0 }}
        >
          Shop
        </button>
        <span>/</span>
        <button
          onClick={() => navigate(`/shop?cat=${encodeURIComponent(p.cat)}`)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-soft)', fontFamily: 'var(--sans)', fontSize: 13, padding: 0 }}
        >
          {p.cat}
        </button>
        <span>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.name}</span>
      </nav>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 56,
        marginBottom: 80,
        alignItems: 'start',
      }}>
        <div>
          <div style={{
            background: 'var(--cream-2)',
            borderRadius: 'var(--r-xl)',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: 16,
          }}>
            <BeadArt
              pattern={p.pattern}
              palette={p.palette}
              size={currentSize}
              bg="transparent"
              radius={0}
              strung={view === 2}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            {VIEW_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => setView(i as ViewIndex)}
                style={{
                  flex: 1,
                  aspectRatio: '1 / 1',
                  background: view === i ? 'var(--cream-2)' : 'var(--paper)',
                  border: view === i ? '2px solid var(--ink)' : '1px solid var(--line)',
                  borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'border-color .12s',
                  overflow: 'hidden',
                  padding: 8,
                }}
              >
                <BeadArt
                  pattern={p.pattern}
                  palette={p.palette}
                  size={64}
                  bg="transparent"
                  radius={0}
                  strung={i === 2}
                />
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: view === i ? 'var(--ink)' : 'var(--ink-soft)',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            {p.tags.map(tag => {
              const cls = tag === 'New' ? 'chip-sage' : tag === 'Sold out' ? 'chip-rose' : 'chip-lav'
              return (
                <span key={tag} className={`chip ${cls}`}>{tag}</span>
              )
            })}
            {p.tags.length === 0 && (
              <span className="chip chip-ink">{p.cat}</span>
            )}
          </div>

          <h1 className="serif" style={{
            fontSize: 48,
            lineHeight: 1.08,
            color: 'var(--ink)',
            marginBottom: 10,
          }}>
            {p.name}
          </h1>

          <p style={{
            fontSize: 13,
            color: 'var(--ink-soft)',
            marginBottom: 20,
          }}>
            {p.cat} · {p.palette_name}
          </p>

          <p className="serif" style={{
            fontSize: 36,
            color: 'var(--ink)',
            marginBottom: 24,
          }}>
            ${p.price}
          </p>

          <p style={{
            fontSize: 15,
            color: 'var(--ink-2)',
            lineHeight: 1.65,
            marginBottom: 28,
          }}>
            {p.desc}
          </p>

          <div style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--ink-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 10,
            }}>
              Palette
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {p.palette.map((hex, i) => (
                <div
                  key={i}
                  title={hex}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: hex,
                    border: '2px solid rgba(42,31,23,0.12)',
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}>
            <p style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--ink-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Qty
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-pill)',
              overflow: 'hidden',
              background: 'var(--paper)',
            }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={qty <= 1 || soldOut}
                style={{
                  width: 40,
                  height: 40,
                  background: 'none',
                  border: 'none',
                  cursor: qty <= 1 || soldOut ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: qty <= 1 || soldOut ? 'var(--ink-mute)' : 'var(--ink)',
                  opacity: qty <= 1 ? 0.4 : 1,
                }}
              >
                <Icon name="minus" size={14} />
              </button>
              <span style={{
                minWidth: 32,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--ink)',
              }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => Math.min(p.stock, q + 1))}
                disabled={qty >= p.stock || soldOut}
                style={{
                  width: 40,
                  height: 40,
                  background: 'none',
                  border: 'none',
                  cursor: qty >= p.stock || soldOut ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: qty >= p.stock || soldOut ? 'var(--ink-mute)' : 'var(--ink)',
                  opacity: qty >= p.stock ? 0.4 : 1,
                }}
              >
                <Icon name="plus" size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <button
              className="btn btn-primary btn-lg"
              disabled={soldOut}
              onClick={() => { if (!soldOut) addToCart(p, qty) }}
              style={{ flex: 1 }}
            >
              <Icon name="cart" size={16} color="var(--cream)" />
              {soldOut ? 'Sold out' : `Add to bag · $${p.price * qty}`}
            </button>

            <button
              className="btn btn-ghost"
              style={{ width: 52, height: 52, padding: 0, flexShrink: 0, borderRadius: 'var(--r-pill)' }}
            >
              <Icon name="heart" size={18} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 32,
          }}>
            <Icon name="dot" size={10} color={stockColor(p.stock)} />
            <span style={{ fontSize: 13, color: stockColor(p.stock), fontWeight: 600 }}>
              {stockLabel(p.stock)}
            </span>
          </div>

          <hr className="divider" style={{ marginBottom: 28 }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px 24px',
            marginBottom: 32,
          }}>
            {[
              { label: 'Materials', value: p.materials },
              { label: 'Made by', value: 'Ambar — handcrafted in Mexico' },
              { label: 'Ships in', value: '3–5 business days' },
              { label: 'Care', value: 'Keep dry · avoid pulls · store flat' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--ink-mute)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                }}>
                  {label}
                </p>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{value}</p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'var(--lavender-soft)',
            border: '1px solid #D8CEF0',
            borderRadius: 'var(--r-lg)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div>
              <p style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--lavender-deep)',
                marginBottom: 4,
              }}>
                Want this in your colors?
              </p>
              <p style={{ fontSize: 13, color: 'var(--lavender-deep)', opacity: 0.8 }}>
                Customize the palette in the design builder.
              </p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/builder')}
              style={{
                borderColor: 'var(--lavender)',
                color: 'var(--lavender-deep)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Open in builder
              <Icon name="arrow-r" size={14} color="var(--lavender-deep)" />
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="serif" style={{
            fontSize: 32,
            color: 'var(--ink)',
            marginBottom: 28,
          }}>
            You may also love
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
          }}>
            {related.map(rp => (
              <a
                key={rp.id}
                className="card"
                onClick={() => { navigate(`/product/${rp.id}`); setQty(1); setView(0) }}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'block',
                  textDecoration: 'none',
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
                  aspectRatio: '1 / 1',
                  background: 'var(--cream-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <BeadArt pattern={rp.pattern} palette={rp.palette} size={160} />
                </div>
                <div style={{ padding: '14px 16px 18px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 8,
                    marginBottom: 2,
                  }}>
                    <span className="serif" style={{ fontSize: 19, color: 'var(--ink)' }}>{rp.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>${rp.price}</span>
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'var(--ink-soft)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}>
                    <span>{rp.cat}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>{rp.palette_name}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
