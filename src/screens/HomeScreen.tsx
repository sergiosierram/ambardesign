import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Icon from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, PALETTES, PATTERNS } from '../data/products'
import type { Product, CartItem } from '../types'

interface Props {
  addToCart: (p: Product, qty: number) => void
}

interface SectionHeadProps {
  title: string
  sub?: string
  link?: { label: string; href: string }
}

function SectionHead({ title, sub, link }: SectionHeadProps) {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
      <div>
        <h2 className="serif" style={{ fontSize: 38, color: 'var(--ink)', lineHeight: 1.1 }}>{title}</h2>
        {sub && <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginTop: 6 }}>{sub}</p>}
      </div>
      {link && (
        <button
          onClick={() => navigate(link.href)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)',
            display: 'flex', alignItems: 'center', gap: 6,
            fontFamily: 'var(--sans)',
          }}
        >
          {link.label} <Icon name="arrow-r" size={14} />
        </button>
      )}
    </div>
  )
}

interface FloatingTileProps {
  rotation: number
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  children: React.ReactNode
}

function FloatingTile({ rotation, top, left, right, bottom, children }: FloatingTileProps) {
  return (
    <div style={{
      position: 'absolute',
      top: top !== undefined ? top : undefined,
      left: left !== undefined ? left : undefined,
      right: right !== undefined ? right : undefined,
      bottom: bottom !== undefined ? bottom : undefined,
      background: 'var(--paper)',
      borderRadius: 'var(--r-xl)',
      boxShadow: 'var(--shadow-3)',
      transform: `rotate(${rotation}deg)`,
      padding: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {children}
    </div>
  )
}

const CATEGORY_TILES = [
  { label: 'Earrings',      pattern: PATTERNS.daisy,     palette: PALETTES.amberSun      },
  { label: 'Necklaces',     pattern: PATTERNS.strand1,   palette: PALETTES.lavenderField  },
  { label: 'Rings',         pattern: PATTERNS.heart,     palette: PALETTES.rosyClay       },
  { label: 'Bracelets',     pattern: PATTERNS.strand3,   palette: PALETTES.mintFrost      },
  { label: 'Keychains',     pattern: PATTERNS.butterfly, palette: PALETTES.sageMeadow     },
  { label: 'Phone charms',  pattern: PATTERNS.smiley,    palette: PALETTES.honeyCream     },
]

const BEAD_TILES_CTA = [
  { pattern: PATTERNS.flower,    palette: PALETTES.lavenderField },
  { pattern: PATTERNS.heart,     palette: PALETTES.rosyClay      },
  { pattern: PATTERNS.star,      palette: PALETTES.honeyCream    },
  { pattern: PATTERNS.butterfly, palette: PALETTES.sageMeadow    },
]

export default function HomeScreen({ addToCart }: Props) {
  const navigate = useNavigate()

  const firstFour = PRODUCTS.slice(0, 4)
  const bestsellers = PRODUCTS.filter(p => p.tags.includes('Bestseller'))

  return (
    <div>
      <section style={{
        background: 'var(--bg-hero)',
        padding: '80px 0 100px',
        overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}>
          <div>
            <h1 className="serif" style={{
              fontSize: 92,
              lineHeight: 1.0,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              marginBottom: 24,
            }}>
              Tiny beads,{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--brand)' }}>quiet</em>
              {' '}jewelry.
            </h1>
            <p style={{
              fontSize: 18,
              color: 'var(--ink-soft)',
              lineHeight: 1.6,
              marginBottom: 36,
              maxWidth: 440,
            }}>
              Hand-woven Miyuki bead jewelry made one piece at a time in the coffee hills of Armenia, Quindío.
            </p>
            <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                Shop now
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/builder')}>
                <Icon name="sparkles" size={16} /> Design yours
              </button>
            </div>
            <div style={{
              display: 'flex',
              gap: 24,
              fontSize: 12,
              color: 'var(--ink-mute)',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}>
              <span>Made in Armenia, Quindío</span>
              <span style={{ color: 'var(--line-2)' }}>·</span>
              <span>Tiny batches</span>
              <span style={{ color: 'var(--line-2)' }}>·</span>
              <span>Ships in 5 days</span>
            </div>
          </div>

          <div style={{ position: 'relative', height: 480 }}>
            <FloatingTile rotation={-6} top={20} left={40}>
              <BeadArt pattern={PATTERNS.daisy} palette={PALETTES.amberSun} size={140} bg="var(--cream-2)" radius={12} />
            </FloatingTile>
            <FloatingTile rotation={5} top={120} right={20}>
              <BeadArt pattern={PATTERNS.flower} palette={PALETTES.lavenderField} size={120} bg="var(--lavender-soft)" radius={12} />
            </FloatingTile>
            <FloatingTile rotation={-3} bottom={40} left={80}>
              <BeadArt pattern={PATTERNS.heart} palette={PALETTES.rosyClay} size={130} bg="var(--cream-2)" radius={12} />
            </FloatingTile>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 0', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 12,
          }}>
            {CATEGORY_TILES.map(({ label, pattern, palette }) => (
              <button
                key={label}
                onClick={() => navigate('/shop')}
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-lg)',
                  padding: '20px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'transform .15s, box-shadow .15s',
                  fontFamily: 'var(--sans)',
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
                <BeadArt pattern={pattern} palette={palette} size={64} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-2)', letterSpacing: '0.02em' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--cream-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <SectionHead
            title="The collection"
            sub="Each piece woven by hand, never twice the same."
            link={{ label: 'View all', href: '/shop' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {firstFour.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--brand-soft)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div>
              <h2 className="serif" style={{ fontSize: 56, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 20 }}>
                Dream a piece. We'll weave it.
              </h2>
              <p style={{ fontSize: 16, color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
                Send us a shape, a color, a feeling. We'll design a custom piece just for you — and show you a preview before we string a single bead.
              </p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/builder')}>
                  <Icon name="sparkles" size={16} /> Start designing
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/about')}>
                  How it works
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              transform: 'rotate(-3deg)',
            }}>
              {BEAD_TILES_CTA.map(({ pattern, palette }, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--paper)',
                    borderRadius: 'var(--r-xl)',
                    boxShadow: 'var(--shadow-3)',
                    padding: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BeadArt pattern={pattern} palette={palette} size={100} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <SectionHead
            title="Most loved"
            sub="The pieces our customers keep coming back for."
            link={{ label: 'See all bestsellers', href: '/shop' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {bestsellers.map(p => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--cream-2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="serif" style={{ fontSize: 40, color: 'var(--ink)' }}>
              How it works
            </h2>
            <p style={{ fontSize: 15, color: 'var(--ink-soft)', marginTop: 10 }}>
              From first click to your door in five days.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {[
              {
                num: '01',
                title: 'Browse or design',
                desc: 'Pick from the collection or use the bead builder to design something entirely your own. Choose your pattern, palette, and size.',
              },
              {
                num: '02',
                title: 'We weave it',
                desc: 'Each order is hand-stitched in a small studio in Armenia, Quindío using Japanese Miyuki seed beads. No machines, no shortcuts.',
              },
              {
                num: '03',
                title: 'Arrives in 5 days',
                desc: 'Your piece ships within two business days, wrapped in recycled tissue and tucked into a small kraft box ready to gift or keep.',
              },
            ].map(({ num, title, desc }) => (
              <div key={num} style={{ textAlign: 'center', padding: '0 16px' }}>
                <div className="serif" style={{
                  fontSize: 64,
                  fontStyle: 'italic',
                  color: 'var(--brand)',
                  lineHeight: 1,
                  marginBottom: 16,
                }}>
                  {num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
