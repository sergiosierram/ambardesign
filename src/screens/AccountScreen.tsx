import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Icon from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import { useAuth } from '../contexts/AuthContext'

type Tab = 'orders' | 'customs' | 'saved' | 'profile' | 'addresses'

interface MockOrder {
  id: string
  date: string
  total: number
  status: string
  items: typeof PRODUCTS
}

interface MockCustom {
  id: string
  date: string
  shape: string
  est: string
  status: string
}

const MOCK_ORDERS: MockOrder[] = [
  { id: '#A-1285', date: 'May 8', total: 50, status: 'paid', items: [PRODUCTS[0], PRODUCTS[2]] },
  { id: '#A-1282', date: 'May 3', total: 102, status: 'packed', items: [PRODUCTS[1], PRODUCTS[4], PRODUCTS[6]] },
  { id: '#A-1279', date: 'Apr 28', total: 44, status: 'delivered', items: [PRODUCTS[3], PRODUCTS[5]] },
]

const MOCK_CUSTOMS: MockCustom[] = [
  { id: '#CR-218', date: 'May 7', shape: 'Flower', est: '$48–$60', status: 'in-progress' },
  { id: '#CR-214', date: 'Apr 30', shape: 'Heart', est: '$22–$30', status: 'quoted' },
]

function statusChipClass(status: string): string {
  if (status === 'paid' || status === 'delivered') return 'chip chip-sage'
  if (status === 'shipped') return 'chip chip-lav'
  if (status === 'packed') return 'chip chip-amber'
  if (status === 'in-progress') return 'chip chip-amber'
  if (status === 'quoted') return 'chip chip-lav'
  return 'chip chip-ink'
}

function statusLabel(status: string): string {
  if (status === 'in-progress') return 'In progress'
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function AccountScreen() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [tab, setTab] = useState<Tab>('orders')
  const [profileName, setProfileName] = useState(user?.name ?? '')
  const [profileEmail, setProfileEmail] = useState(user?.email ?? '')
  const [profilePhone, setProfilePhone] = useState('')

  const firstName = (user?.name ?? 'there').split(' ')[0]

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const NAV_ITEMS: { key: Tab; label: string; count?: number }[] = [
    { key: 'orders', label: 'Orders', count: MOCK_ORDERS.length },
    { key: 'customs', label: 'Custom requests', count: MOCK_CUSTOMS.length },
    { key: 'saved', label: 'Saved designs', count: 4 },
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'Addresses' },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 48,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <span className="chip chip-lav" style={{ marginBottom: 16, display: 'inline-flex' }}>
            My account
          </span>
          <h1 className="serif" style={{ fontSize: 48, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 6 }}>
            Hi, {firstName}.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{user?.email}</p>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleSignOut}
          style={{ gap: 6, marginTop: 8 }}
        >
          <Icon name="logout" size={14} />
          Sign out
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40, alignItems: 'start' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--r-md)',
                border: 'none',
                background: tab === item.key ? 'var(--lavender-soft)' : 'transparent',
                color: tab === item.key ? 'var(--lavender-deep)' : 'var(--ink-soft)',
                fontSize: 14,
                fontWeight: tab === item.key ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--sans)',
                transition: 'background .12s, color .12s',
              }}
            >
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  background: tab === item.key ? 'var(--lavender-deep)' : 'var(--line)',
                  color: tab === item.key ? 'white' : 'var(--ink-soft)',
                  borderRadius: 'var(--r-pill)',
                  padding: '1px 7px',
                  minWidth: 20,
                  textAlign: 'center',
                }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h2 className="serif" style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>Orders</h2>
              {MOCK_ORDERS.map(order => (
                <div key={order.id} className="card" style={{ padding: 24 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    flexWrap: 'wrap',
                    marginBottom: 16,
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{order.id}</span>
                        <span className={statusChipClass(order.status)}>
                          {statusLabel(order.status)}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                        {order.date} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {order.items.map(p => (
                      <div
                        key={p.id}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 'var(--r-sm)',
                          background: 'var(--cream-2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <BeadArt pattern={p.pattern} palette={p.palette} size={40} />
                      </div>
                    ))}
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => navigate('/shop')}
                    >
                      Buy again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'customs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h2 className="serif" style={{ fontSize: 28, color: 'var(--ink)' }}>Custom requests</h2>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate('/builder')}
                >
                  <Icon name="plus" size={13} />
                  Start new custom
                </button>
              </div>
              {MOCK_CUSTOMS.map(cr => (
                <div key={cr.id} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 'var(--r-md)',
                    background: 'var(--lavender-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <BeadArt
                      pattern={cr.shape === 'Flower' ? PRODUCTS[1].pattern : PRODUCTS[4].pattern}
                      palette={PRODUCTS[cr.shape === 'Flower' ? 1 : 4].palette}
                      size={52}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{cr.id}</span>
                      <span className={statusChipClass(cr.status)}>
                        {statusLabel(cr.status)}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>
                      {cr.shape} · {cr.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{cr.est}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>estimate</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'saved' && (
            <div>
              <h2 className="serif" style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 24 }}>Saved designs</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {PRODUCTS.slice(0, 4).map(p => (
                  <ProductCard key={p.id} p={p} size="sm" />
                ))}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <h2 className="serif" style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 24 }}>Profile</h2>
              <div className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label className="label" htmlFor="acc-name">Full name</label>
                    <input
                      id="acc-name"
                      className="input"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      placeholder="Sofia García"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="acc-email">Email address</label>
                    <input
                      id="acc-email"
                      className="input"
                      type="email"
                      value={profileEmail}
                      onChange={e => setProfileEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="acc-phone">Phone number</label>
                    <input
                      id="acc-phone"
                      className="input"
                      type="tel"
                      value={profilePhone}
                      onChange={e => setProfilePhone(e.target.value)}
                      placeholder="+1 555 000 0000"
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ alignSelf: 'flex-start', marginTop: 4 }}
                    onClick={() => {}}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'addresses' && (
            <div>
              <h2 className="serif" style={{ fontSize: 28, color: 'var(--ink)', marginBottom: 24 }}>Addresses</h2>
              <div className="card" style={{ padding: 28 }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>Default address</span>
                    <span className="chip chip-lav" style={{ fontSize: 10 }}>Default</span>
                  </div>
                  <button
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
                    Edit
                  </button>
                </div>
                <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.8 }}>
                  <div>{user?.name ?? 'Sofia García'}</div>
                  <div>123 Calle Florida</div>
                  <div>Buenos Aires, C1000</div>
                  <div>Argentina</div>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                style={{ marginTop: 16, gap: 6 }}
              >
                <Icon name="plus" size={13} />
                Add new address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
