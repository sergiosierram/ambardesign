import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import BeadArt from '../components/BeadArt'
import Icon from '../components/Icons'
import type { CartItem, User } from '../types'
import { createOrder } from '../lib/db'
import { useAuth } from '../contexts/AuthContext'

interface Props {
  cart: CartItem[]
  setCart: (c: CartItem[]) => void
  user: User | null
}

type Step = 'contact' | 'shipping' | 'payment'

interface CardData {
  number: string
  expiry: string
  cvc: string
  name: string
}

type PayMethod = 'card' | 'apple' | 'mercado'
type BrandName = 'visa' | 'mc' | 'amex'

function detectBrand(num: string): BrandName | null {
  if (num.startsWith('4')) return 'visa'
  if (num.startsWith('5')) return 'mc'
  if (num.startsWith('3')) return 'amex'
  return null
}

function CardBrand({ brand }: { brand: BrandName }) {
  const map: Record<BrandName, { label: string; bg: string; color: string }> = {
    visa: { label: 'VISA', bg: '#1A1F71', color: '#fff' },
    mc: { label: 'MC', bg: '#EB001B', color: '#fff' },
    amex: { label: 'AMEX', bg: '#2E77BC', color: '#fff' },
  }
  const { label, bg, color } = map[brand]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px 7px',
      borderRadius: 4,
      background: bg,
      color,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.04em',
    }}>
      {label}
    </span>
  )
}

interface SectionProps {
  num: string
  title: string
  open: boolean
  disabled?: boolean
  summary?: string
  onEdit?: () => void
  children: ReactNode
}

function CheckoutSection({ num, title, open, disabled, summary, onEdit, children }: SectionProps) {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 24px',
        borderBottom: open ? '1px solid var(--line)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: open ? 'var(--ink)' : disabled ? 'var(--line)' : 'var(--lavender-soft)',
            color: open ? 'var(--cream)' : disabled ? 'var(--ink-mute)' : 'var(--lavender-deep)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {num}
          </div>
          <span className="serif" style={{ fontSize: 18, color: disabled ? 'var(--ink-mute)' : 'var(--ink)' }}>
            {title}
          </span>
        </div>
        {!open && !disabled && summary && onEdit && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{summary}</span>
            <button
              onClick={onEdit}
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
        )}
      </div>
      {open && (
        <div style={{ padding: '24px 24px 28px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function CheckoutScreen({ cart, setCart, user }: Props) {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [step, setStep] = useState<Step>('contact')
  const [email, setEmail] = useState(user?.email ?? '')
  const [newsletter, setNewsletter] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postal, setPostal] = useState('')
  const [country, setCountry] = useState('US')
  const [shippingOpt, setShippingOpt] = useState<'standard' | 'express'>('standard')
  const [payMethod, setPayMethod] = useState<PayMethod>('card')
  const [card, setCard] = useState<CardData>({ number: '', expiry: '', cvc: '', name: '' })
  const [paying, setPaying] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('#A-1285')

  const subtotal = cart.reduce((sum, ci) => sum + ci.p.price * ci.qty, 0)
  const shippingCost = shippingOpt === 'express' ? 18 : subtotal >= 60 ? 0 : 5.9
  const tax = +(subtotal * 0.08).toFixed(2)
  const total = +(subtotal + shippingCost + tax).toFixed(2)

  const displayName = firstName || user?.name?.split(' ')[0] || 'there'

  async function handlePay() {
    setPaying(true)
    const id = await createOrder(
      authUser?.id || 'guest',
      cart.map(i => ({ productId: i.p.id, qty: i.qty, price: i.p.price })),
      total
    )
    setOrderId(id || '#A-1285')
    setPaying(false)
    setDone(true)
    setCart([])
  }

  if (done) {
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
          <Icon name="check" size={36} color="var(--lavender-deep)" />
        </div>
        <div>
          <p className="serif" style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 8 }}>
            Thank you, {displayName}.
          </p>
          <p style={{ fontSize: 15, color: 'var(--ink-soft)' }}>
            Your order <span style={{ fontWeight: 600 }}>{orderId}</span> is confirmed.
          </p>
          <p style={{ fontSize: 14, color: 'var(--ink-mute)', marginTop: 4 }}>
            We'll email {email} when it ships.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => navigate('/account')}>
            View order
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/shop')}>
            Keep shopping
          </button>
        </div>
      </div>
    )
  }

  const brand = detectBrand(card.number)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
      <button
        onClick={() => navigate('/cart')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: 'var(--ink-soft)',
          marginBottom: 32,
          padding: 0,
        }}
      >
        <Icon name="arrow-r" size={14} color="var(--ink-soft)" />
        Back to cart
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <CheckoutSection
            num="1"
            title="Contact"
            open={step === 'contact'}
            summary={email}
            onEdit={() => setStep('contact')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label" htmlFor="co-email">Email address</label>
                <input
                  id="co-email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                fontSize: 14,
                color: 'var(--ink-soft)',
              }}>
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={e => setNewsletter(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: 'var(--lavender-deep)', cursor: 'pointer' }}
                />
                Email me with news and offers
              </label>
              <button
                className="btn btn-primary"
                disabled={!email.includes('@')}
                onClick={() => setStep('shipping')}
                style={{ alignSelf: 'flex-start' }}
              >
                Continue to shipping
              </button>
            </div>
          </CheckoutSection>

          <CheckoutSection
            num="2"
            title="Shipping address"
            open={step === 'shipping'}
            disabled={step === 'contact'}
            summary={address ? `${address}, ${city}` : undefined}
            onEdit={() => setStep('shipping')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label" htmlFor="co-first">First name</label>
                  <input
                    id="co-first"
                    className="input"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Sofia"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="co-last">Last name</label>
                  <input
                    id="co-last"
                    className="input"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="García"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="co-address">Address</label>
                <input
                  id="co-address"
                  className="input"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="123 Calle Florida"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12 }}>
                <div>
                  <label className="label" htmlFor="co-city">City</label>
                  <input
                    id="co-city"
                    className="input"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Buenos Aires"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="co-postal">Postal code</label>
                  <input
                    id="co-postal"
                    className="input"
                    value={postal}
                    onChange={e => setPostal(e.target.value)}
                    placeholder="C1000"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="co-country">Country</label>
                <select
                  id="co-country"
                  className="input"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
                >
                  <option value="US">United States</option>
                  <option value="AR">Argentina</option>
                  <option value="MX">México</option>
                  <option value="CO">Colombia</option>
                  <option value="ES">España</option>
                  <option value="GB">United Kingdom</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                {(['standard', 'express'] as const).map(opt => (
                  <label
                    key={opt}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 'var(--r-md)',
                      border: `1px solid ${shippingOpt === opt ? 'var(--ink)' : 'var(--line)'}`,
                      background: shippingOpt === opt ? 'var(--lavender-soft)' : 'var(--paper)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input
                        type="radio"
                        name="shipping"
                        value={opt}
                        checked={shippingOpt === opt}
                        onChange={() => setShippingOpt(opt)}
                        style={{ accentColor: 'var(--lavender-deep)' }}
                      />
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                          {opt === 'standard' ? 'Standard' : 'Express'}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
                          {opt === 'standard' ? '5–7 business days' : '1–2 business days'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                      {opt === 'express' ? '$18.00' : subtotal >= 60 ? 'Free' : '$5.90'}
                    </span>
                  </label>
                ))}
              </div>

              <button
                className="btn btn-primary"
                disabled={!address || !city}
                onClick={() => setStep('payment')}
                style={{ alignSelf: 'flex-start' }}
              >
                Continue to payment
              </button>
            </div>
          </CheckoutSection>

          <CheckoutSection
            num="3"
            title="Payment"
            open={step === 'payment'}
            disabled={step === 'contact' || step === 'shipping'}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['card', 'apple', 'mercado'] as PayMethod[]).map(m => (
                  <button
                    key={m}
                    onClick={() => setPayMethod(m)}
                    className="btn btn-sm"
                    style={{
                      border: `1px solid ${payMethod === m ? 'var(--ink)' : 'var(--line)'}`,
                      background: payMethod === m ? 'var(--ink)' : 'var(--paper)',
                      color: payMethod === m ? 'var(--cream)' : 'var(--ink)',
                      borderRadius: 'var(--r-md)',
                    }}
                  >
                    {m === 'card' && 'Card'}
                    {m === 'apple' && 'Apple Pay'}
                    {m === 'mercado' && 'MercadoPago'}
                  </button>
                ))}
              </div>

              {payMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label className="label" htmlFor="co-card-num">Card number</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-mute)' }}>
                        <Icon name="card" size={16} color="var(--ink-mute)" />
                      </span>
                      <input
                        id="co-card-num"
                        className="input"
                        value={card.number}
                        onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                        placeholder="1234 5678 9012 3456"
                        style={{ paddingLeft: 40, paddingRight: brand ? 70 : 14 }}
                        inputMode="numeric"
                      />
                      {brand && (
                        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                          <CardBrand brand={brand} />
                        </span>
                      )}
                    </div>
                    {!brand && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <CardBrand brand="visa" />
                        <CardBrand brand="mc" />
                        <CardBrand brand="amex" />
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="label" htmlFor="co-expiry">Expiry</label>
                      <input
                        id="co-expiry"
                        className="input"
                        value={card.expiry}
                        onChange={e => setCard({ ...card, expiry: e.target.value })}
                        placeholder="MM / YY"
                        inputMode="numeric"
                        maxLength={7}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="co-cvc">CVC</label>
                      <input
                        id="co-cvc"
                        className="input"
                        value={card.cvc}
                        onChange={e => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                        placeholder="123"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="co-cardname">Name on card</label>
                    <input
                      id="co-cardname"
                      className="input"
                      value={card.name}
                      onChange={e => setCard({ ...card, name: e.target.value })}
                      placeholder="Sofia García"
                    />
                  </div>
                </div>
              )}

              {payMethod === 'apple' && (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--cream-2)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--ink-soft)',
                  fontSize: 14,
                }}>
                  Apple Pay will open on your device to complete payment.
                </div>
              )}

              {payMethod === 'mercado' && (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--cream-2)',
                  borderRadius: 'var(--r-md)',
                  color: 'var(--ink-soft)',
                  fontSize: 14,
                }}>
                  You'll be redirected to MercadoPago to complete your purchase.
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                disabled={paying || (payMethod === 'card' && (!card.number || !card.expiry || !card.cvc))}
                onClick={handlePay}
                style={{ width: '100%' }}
              >
                {paying ? 'Processing…' : `Pay $${total.toFixed(2)}`}
              </button>

              <p style={{
                fontSize: 12,
                color: 'var(--ink-mute)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}>
                <Icon name="lock" size={12} color="var(--ink-mute)" />
                SSL encrypted · your data is safe
              </p>
            </div>
          </CheckoutSection>
        </div>

        <div className="card" style={{ padding: 24, position: 'sticky', top: 100 }}>
          <h2 className="serif" style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 20 }}>
            Order summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cart.map(ci => (
              <div key={ci.p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--r-sm)',
                    background: 'var(--lavender-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}>
                    <BeadArt pattern={ci.p.pattern} palette={ci.p.palette} size={36} />
                  </div>
                  {ci.qty > 1 && (
                    <span style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: 'var(--ink)',
                      color: 'var(--cream)',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {ci.qty}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {ci.p.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{ci.p.cat}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', flexShrink: 0 }}>
                  ${(ci.p.price * ci.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <hr className="divider" style={{ margin: '20px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--ink-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal</span>
              <span style={{ color: 'var(--ink)' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span style={{ color: shippingCost === 0 ? 'var(--ok)' : 'var(--ink)', fontWeight: shippingCost === 0 ? 600 : 400 }}>
                {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tax</span>
              <span style={{ color: 'var(--ink)' }}>${tax.toFixed(2)}</span>
            </div>
          </div>

          <hr className="divider" style={{ margin: '16px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
