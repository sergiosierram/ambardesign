import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Icon from '../components/Icons'
import type { CartItem, Product } from '../types'

interface Props {
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
}

function Row({ k, v }: { k: React.ReactNode; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span>{k}</span>
      <span>{v}</span>
    </div>
  )
}

export default function CartScreen({ cart, setCart }: Props) {
  const navigate = useNavigate()

  const subtotal = cart.reduce((sum, ci) => sum + ci.p.price * ci.qty, 0)
  const shipping = subtotal >= 60 ? 0 : 5.9
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + shipping + tax).toFixed(2)

  function updateQty(id: string, delta: number) {
    setCart(
      cart
        .map(ci => ci.p.id === id ? { ...ci, qty: ci.qty + delta } : ci)
        .filter(ci => ci.qty > 0)
    )
  }

  function remove(id: string) {
    setCart(cart.filter(ci => ci.p.id !== id))
  }

  if (cart.length === 0) {
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        padding: '60px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'var(--lavender-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--lavender-deep)',
        }}>
          <Icon name="cart" size={32} color="var(--lavender-deep)" />
        </div>
        <p className="serif" style={{ fontSize: 28, color: 'var(--ink)' }}>
          Your bag is empty.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
            Browse the shop
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/builder')}>
            Design custom piece
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      <h1 className="serif" style={{ fontSize: 40, color: 'var(--ink)', marginBottom: 32 }}>
        Your bag
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {cart.map((ci, i) => (
            <div key={ci.p.id}>
              {i > 0 && <hr className="divider" />}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr auto',
                gap: 20,
                alignItems: 'center',
                padding: '24px 0',
              }}>
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: 'var(--r-lg)',
                  background: 'var(--cream-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <BeadArt pattern={ci.p.pattern} palette={ci.p.palette} size={80} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="serif" style={{ fontSize: 20, color: 'var(--ink)' }}>
                    {ci.p.name}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{ci.p.cat}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0,
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-pill)',
                      overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => updateQty(ci.p.id, -1)}
                        style={{
                          width: 32,
                          height: 32,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--ink)',
                        }}
                      >
                        <Icon name="minus" size={14} />
                      </button>
                      <span style={{
                        minWidth: 28,
                        textAlign: 'center',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--ink)',
                      }}>
                        {ci.qty}
                      </span>
                      <button
                        onClick={() => updateQty(ci.p.id, 1)}
                        style={{
                          width: 32,
                          height: 32,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--ink)',
                        }}
                      >
                        <Icon name="plus" size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(ci.p.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ color: 'var(--ink-soft)', gap: 4 }}
                    >
                      <Icon name="trash" size={13} />
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>
                    ${(ci.p.price * ci.qty).toFixed(2)}
                  </span>
                  {ci.qty > 1 && (
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 2 }}>
                      ${ci.p.price} each
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{
          padding: 28,
          position: 'sticky',
          top: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          <h2 className="serif" style={{ fontSize: 22, color: 'var(--ink)' }}>Order summary</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: 'var(--ink-soft)' }}>
            <Row
              k="Subtotal"
              v={<span style={{ color: 'var(--ink)', fontWeight: 500 }}>${subtotal.toFixed(2)}</span>}
            />
            <Row
              k="Shipping"
              v={
                shipping === 0
                  ? <span style={{ color: 'var(--ok)', fontWeight: 600 }}>Free</span>
                  : <span style={{ color: 'var(--ink)', fontWeight: 500 }}>${shipping.toFixed(2)}</span>
              }
            />
            {subtotal > 0 && subtotal < 60 && (
              <p style={{ fontSize: 12, color: 'var(--ink-mute)', background: 'var(--cream-2)', borderRadius: 'var(--r-sm)', padding: '8px 10px' }}>
                Add ${(60 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <Row
              k="Tax (8%)"
              v={<span style={{ color: 'var(--ink)', fontWeight: 500 }}>${tax.toFixed(2)}</span>}
            />
          </div>

          <hr className="divider" />

          <Row
            k={<span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Total</span>}
            v={<span style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>${total.toFixed(2)}</span>}
          />

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 4 }}
            onClick={() => navigate('/checkout')}
          >
            Checkout
          </button>

          <p style={{ fontSize: 12, color: 'var(--ink-mute)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Icon name="lock" size={12} color="var(--ink-mute)" />
            Secure checkout · SSL encrypted
          </p>
        </div>
      </div>
    </div>
  )
}
