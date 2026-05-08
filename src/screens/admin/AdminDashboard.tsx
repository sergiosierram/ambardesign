import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BeadArt from '../../components/BeadArt'
import Icon from '../../components/Icons'
import Wordmark from '../../components/Wordmark'
import { PRODUCTS, ORDERS_SEED, CUSTOM_REQUESTS_SEED } from '../../data/products'
import type { Product } from '../../types'

interface Props {
  onLogout: () => void
}

type TabId = 'overview' | 'orders' | 'requests' | 'stock' | 'customers' | 'analytics'

const NAV_ITEMS: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview',   label: 'Overview',   icon: 'grid'     },
  { id: 'orders',     label: 'Orders',     icon: 'box'      },
  { id: 'requests',   label: 'Requests',   icon: 'sparkles' },
  { id: 'stock',      label: 'Stock',      icon: 'eye'      },
  { id: 'customers',  label: 'Customers',  icon: 'user'     },
  { id: 'analytics',  label: 'Analytics',  icon: 'star'     },
]

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending:      { bg: '#FFF3CD', color: '#856404' },
  paid:         { bg: 'var(--lavender-soft)', color: 'var(--lavender-deep)' },
  packed:       { bg: '#D1ECF1', color: '#0C5460' },
  shipped:      { bg: '#D4EDDA', color: '#155724' },
  delivered:    { bg: '#E0E8DC', color: '#4F6B4A' },
  review:       { bg: 'var(--amber-soft)', color: 'var(--amber-deep)' },
  quoted:       { bg: 'var(--lavender-soft)', color: 'var(--lavender-deep)' },
  'in-progress':{ bg: '#D1ECF1', color: '#0C5460' },
}

function StatusChip({ status }: { status: string }) {
  const s = STATUS_COLORS[status] ?? { bg: 'var(--cream-2)', color: 'var(--ink-2)' }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '3px 10px',
      borderRadius: 'var(--r-pill)',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'capitalize',
      background: s.bg,
      color: s.color,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{
      background: 'var(--paper)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--r-lg)',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mute)', letterSpacing: '0.04em', textTransform: 'uppercase' as const }}>
        {label}
      </span>
      <span className="serif" style={{ fontSize: 36, color: 'var(--ink)', lineHeight: 1.1 }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{sub}</span>}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 16 }}>
      {children}
    </h2>
  )
}

function TableHeader({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr>
        {cols.map(c => (
          <th key={c} style={{
            padding: '10px 16px',
            textAlign: 'left' as const,
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--ink-mute)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            borderBottom: '1px solid var(--line)',
            background: 'var(--cream)',
            whiteSpace: 'nowrap',
          }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function TabOverview() {
  const totalRevenue = ORDERS_SEED.reduce((s, o) => s + o.total, 0)
  const lowStock = PRODUCTS.filter(p => p.stock <= 5).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KpiCard label="Total orders"    value={ORDERS_SEED.length}  sub="All time" />
        <KpiCard label="Revenue"         value={`$${totalRevenue}`}  sub="Seed data" />
        <KpiCard label="Custom requests" value={CUSTOM_REQUESTS_SEED.length} sub="Active" />
        <KpiCard label="Low stock"       value={lowStock}            sub="≤5 units" />
      </div>

      <div>
        <SectionTitle>Recent orders</SectionTitle>
        <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <TableHeader cols={['Order', 'Customer', 'Items', 'Total', 'Status', 'Date']} />
            <tbody>
              {ORDERS_SEED.slice(0, 4).map((o, i) => (
                <tr key={o.id} style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--cream)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>{o.id}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink)' }}>{o.user}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--ink-2)' }}>{o.items}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>${o.total}</td>
                  <td style={{ padding: '12px 16px' }}><StatusChip status={o.status} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--ink-mute)' }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionTitle>Recent custom requests</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CUSTOM_REQUESTS_SEED.slice(0, 3).map(cr => (
            <div key={cr.id} style={{
              background: 'var(--paper)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--r-lg)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-mute)' }}>{cr.id}</span>
                  <StatusChip status={cr.status} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                  {cr.shape.charAt(0).toUpperCase() + cr.shape.slice(1)} · {cr.size} · {cr.complexity}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{cr.user} · {cr.date}</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>${cr.est}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TabOrders() {
  return (
    <div>
      <SectionTitle>All orders</SectionTitle>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date']} />
          <tbody>
            {ORDERS_SEED.map((o, i) => (
              <tr
                key={o.id}
                style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--cream)', transition: 'background .1s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--lavender-soft)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'var(--paper)' : 'var(--cream)' }}
              >
                <td style={{ padding: '13px 16px', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>{o.id}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--ink)' }}>{o.user}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--ink-2)' }}>{o.items}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>${o.total}</td>
                <td style={{ padding: '13px 16px' }}><StatusChip status={o.status} /></td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--ink-mute)' }}>{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TabRequests() {
  return (
    <div>
      <SectionTitle>Custom design requests</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CUSTOM_REQUESTS_SEED.map(cr => (
          <div key={cr.id} style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
          }}>
            <div style={{
              flexShrink: 0,
              width: 48,
              height: 48,
              borderRadius: 'var(--r-md)',
              background: 'var(--lavender-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon name="sparkles" size={20} color="var(--lavender-deep)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mute)' }}>{cr.id}</span>
                <StatusChip status={cr.status} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 3 }}>
                {cr.shape.charAt(0).toUpperCase() + cr.shape.slice(1)} · Size {cr.size}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                {cr.colors} colors · {cr.complexity} · by {cr.user}
              </div>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <div className="serif" style={{ fontSize: 28, color: 'var(--ink)', lineHeight: 1 }}>${cr.est}</div>
              <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 3 }}>{cr.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TabStock() {
  const [stocks, setStocks] = useState<Record<string, number>>(
    Object.fromEntries(PRODUCTS.map(p => [p.id, p.stock]))
  )
  const [editing, setEditing] = useState<string | null>(null)
  const [editVal, setEditVal] = useState<string>('')

  function startEdit(p: Product) {
    setEditing(p.id)
    setEditVal(String(stocks[p.id]))
  }

  function commitEdit(id: string) {
    const n = parseInt(editVal, 10)
    if (!isNaN(n) && n >= 0) {
      setStocks(prev => ({ ...prev, [id]: n }))
    }
    setEditing(null)
  }

  return (
    <div>
      <SectionTitle>Inventory</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {PRODUCTS.map(p => {
          const qty = stocks[p.id]
          const isLow = qty <= 5
          return (
            <div key={p.id} style={{
              background: 'var(--paper)',
              border: `1px solid ${isLow ? 'var(--amber)' : 'var(--line)'}`,
              borderRadius: 'var(--r-lg)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              position: 'relative' as const,
            }}>
              {isLow && (
                <div style={{
                  position: 'absolute' as const,
                  top: 10,
                  right: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--amber-deep)',
                  background: 'var(--amber-soft)',
                  padding: '2px 7px',
                  borderRadius: 'var(--r-pill)',
                }}>
                  Low
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <BeadArt pattern={p.pattern} palette={p.palette} size={64} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{p.cat}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {editing === p.id ? (
                  <>
                    <input
                      type="number"
                      value={editVal}
                      min={0}
                      onChange={e => setEditVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') commitEdit(p.id); if (e.key === 'Escape') setEditing(null) }}
                      autoFocus
                      style={{
                        width: 60,
                        padding: '5px 8px',
                        borderRadius: 'var(--r-sm)',
                        border: '1px solid var(--lavender)',
                        fontFamily: 'var(--mono)',
                        fontSize: 14,
                        fontWeight: 700,
                        color: 'var(--ink)',
                        background: 'var(--paper)',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={() => commitEdit(p.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--ink)',
                        border: 'none',
                        color: 'var(--cream)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'var(--sans)',
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: isLow ? 'var(--amber-deep)' : 'var(--ink)',
                    }}>
                      {qty}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>units</span>
                    <button
                      onClick={() => startEdit(p)}
                      style={{
                        marginLeft: 'auto',
                        padding: '4px 10px',
                        borderRadius: 'var(--r-sm)',
                        background: 'var(--cream)',
                        border: '1px solid var(--line)',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'var(--ink-2)',
                        cursor: 'pointer',
                        fontFamily: 'var(--sans)',
                        transition: 'background .12s',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--cream-2)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--cream)' }}
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TabAnalytics() {
  const stats = [
    { label: 'Page views this week',  value: '1,284' },
    { label: 'Builder sessions',      value: '312'   },
    { label: 'Cart abandonment rate', value: '54%'   },
    { label: 'Conversion rate',       value: '3.2%'  },
    { label: 'Avg. order value',      value: '$47'   },
    { label: 'Repeat customers',      value: '28%'   },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'var(--paper)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--r-lg)',
            padding: '20px 24px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-mute)', letterSpacing: '0.04em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
              {s.label}
            </div>
            <div className="serif" style={{ fontSize: 32, color: 'var(--ink)' }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-lg)',
        padding: '40px 32px',
        textAlign: 'center' as const,
        color: 'var(--ink-mute)',
      }}>
        <Icon name="star" size={32} color="var(--line-2)" />
        <p style={{ marginTop: 16, fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)' }}>
          Analytics coming soon
        </p>
        <p style={{ marginTop: 6, fontSize: 13 }}>
          Charts, funnels, and cohort reports will appear here.
        </p>
      </div>
    </div>
  )
}

function TabCustomers() {
  const customers = [
    { name: 'Lucia Bravo',    email: 'lucia.b@…',  orders: 3, spent: 122 },
    { name: 'Mia Chen',       email: 'mia@…',       orders: 1, spent: 22  },
    { name: 'Noor Khalil',    email: 'noor.k@…',   orders: 2, spent: 180 },
    { name: 'Paula Ramirez',  email: 'paula@…',     orders: 1, spent: 78  },
    { name: 'Sara Torres',    email: 'sara.t@…',   orders: 4, spent: 124 },
    { name: 'Eli Shapiro',    email: 'eli@…',       orders: 2, spent: 44  },
  ]

  return (
    <div>
      <SectionTitle>Customers</SectionTitle>
      <div style={{ border: '1px solid var(--line)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <TableHeader cols={['Name', 'Email', 'Orders', 'Total spent']} />
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.email} style={{ background: i % 2 === 0 ? 'var(--paper)' : 'var(--cream)' }}>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{c.name}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--ink-soft)' }}>{c.email}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--ink-2)' }}>{c.orders}</td>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>${c.spent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminDashboard({ onLogout }: Props) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  function handleLogout() {
    onLogout()
    navigate('/')
  }

  function renderContent() {
    switch (activeTab) {
      case 'overview':   return <TabOverview />
      case 'orders':     return <TabOrders />
      case 'requests':   return <TabRequests />
      case 'stock':      return <TabStock />
      case 'analytics':  return <TabAnalytics />
      case 'customers':  return <TabCustomers />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
      <aside style={{
        width: 220,
        flexShrink: 0,
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky' as const,
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px', marginBottom: 28 }}>
          <Wordmark size={20} color="var(--cream)" />
          <div style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            color: 'rgba(250,246,240,0.35)',
          }}>
            Studio · admin
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 'var(--r-md)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--sans)',
                  fontSize: 13,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--cream)' : 'rgba(250,246,240,0.5)',
                  textAlign: 'left' as const,
                  width: '100%',
                  transition: 'all .12s',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <Icon name={item.icon} size={16} color={isActive ? 'var(--cream)' : 'rgba(250,246,240,0.4)'} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div style={{ padding: '16px 10px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 16,
          }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'var(--lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: 12,
              fontWeight: 700,
              color: 'white',
            }}>
              L
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Laura
              </div>
              <div style={{ fontSize: 11, color: 'rgba(250,246,240,0.4)' }}>Studio owner</div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(250,246,240,0.4)',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
                transition: 'color .12s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(250,246,240,0.4)' }}
            >
              <Icon name="logout" size={16} color="currentColor" />
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', minWidth: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 4,
            textTransform: 'capitalize' as const,
          }}>
            {activeTab}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--ink-mute)' }}>
            ambar design studio
          </p>
        </div>
        {renderContent()}
      </main>
    </div>
  )
}
