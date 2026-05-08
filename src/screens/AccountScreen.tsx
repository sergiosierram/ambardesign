import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icons'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import { useAuth } from '../contexts/AuthContext'
import { fetchOrders, fetchCustomRequests } from '../lib/db'
import type { Order, CustomRequest } from '../types'

type Tab = 'orders' | 'customs' | 'saved' | 'profile' | 'addresses'

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
  const [orders, setOrders] = useState<Order[]>([])
  const [customs, setCustoms] = useState<CustomRequest[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)

  const firstName = (user?.name ?? 'there').split(' ')[0]

  useEffect(() => {
    if (!user) return
    Promise.all([fetchOrders(user.id), fetchCustomRequests(user.id)]).then(([o, c]) => {
      setOrders(o)
      setCustoms(c)
      setOrdersLoading(false)
    })
  }, [user])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const NAV_ITEMS: { key: Tab; label: string; count?: number }[] = [
    { key: 'orders', label: 'Orders', count: orders.length },
    { key: 'customs', label: 'Custom requests', count: customs.length },
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
              {ordersLoading ? (
                <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Loading…</p>
              ) : (
                orders.map(order => (
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
                          {order.date} · {order.items} {order.items === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => navigate('/shop')}
                      >
                        Buy again
                      </button>
                    </div>
                  </div>
                ))
              )}
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
              {customs.map(cr => (
                <div key={cr.id} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
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
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
                      {cr.est ? `$${cr.est}` : '—'}
                    </div>
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
