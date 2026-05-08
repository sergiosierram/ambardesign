import { supabase, isConfigured } from './supabase'
import { PRODUCTS, ORDERS_SEED, CUSTOM_REQUESTS_SEED } from '../data/products'
import type { Product, Order, CustomRequest } from '../types'

// ── Products ──────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  if (!isConfigured) return PRODUCTS

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id')

  if (error || !data?.length) return PRODUCTS

  return data.map(row => ({
    id:           row.id,
    name:         row.name,
    cat:          row.category,
    price:        row.price,
    stock:        row.stock,
    tags:         row.tags ?? [],
    desc:         row.description,
    materials:    row.materials,
    palette_name: row.palette_name,
    palette:      row.palette,
    pattern:      row.pattern,
  }))
}

export async function updateStock(productId: string, stock: number): Promise<void> {
  if (!isConfigured) return
  await supabase.from('products').update({ stock }).eq('id', productId)
}

// ── Orders ────────────────────────────────────────────────────

export async function fetchOrders(userId: string): Promise<Order[]> {
  if (!isConfigured) return ORDERS_SEED as Order[]

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name, price, palette_name))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(o => ({
    id:     `#A-${o.id.slice(0, 4).toUpperCase()}`,
    user:   userId,
    items:  o.order_items?.length ?? 0,
    total:  o.total,
    status: o.status,
    date:   new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (!isConfigured) return ORDERS_SEED as Order[]

  const { data, error } = await supabase
    .from('orders')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(o => ({
    id:     `#A-${o.id.slice(0, 4).toUpperCase()}`,
    user:   o.profiles?.name ?? o.user_id?.slice(0, 8) ?? '—',
    items:  0,
    total:  o.total,
    status: o.status,
    date:   new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))
}

export async function createOrder(
  userId: string,
  items: { productId: string; qty: number; price: number }[],
  total: number
): Promise<string | null> {
  if (!isConfigured) return `#A-${Math.floor(Math.random() * 9000 + 1000)}`

  const { data: order, error } = await supabase
    .from('orders')
    .insert({ user_id: userId, total, status: 'paid' })
    .select()
    .single()

  if (error || !order) return null

  await supabase.from('order_items').insert(
    items.map(i => ({
      order_id:   order.id,
      product_id: i.productId,
      qty:        i.qty,
      unit_price: i.price,
    }))
  )

  return `#A-${order.id.slice(0, 4).toUpperCase()}`
}

// ── Custom requests ───────────────────────────────────────────

export async function fetchCustomRequests(userId?: string): Promise<CustomRequest[]> {
  if (!isConfigured) return CUSTOM_REQUESTS_SEED as CustomRequest[]

  let query = supabase
    .from('custom_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) query = query.eq('user_id', userId)

  const { data, error } = await query
  if (error || !data) return []

  return data.map(r => ({
    id:         `cr-${r.id.slice(0, 6)}`,
    user:       r.user_id?.slice(0, 8) ?? '—',
    shape:      r.shape,
    size:       r.size_id,
    colors:     0,
    complexity: '',
    est:        r.est_low ?? 0,
    status:     r.status,
    date:       new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }))
}

export async function createCustomRequest(payload: {
  userId: string
  shape: string
  sizeId: string
  type: string
  patternData: unknown
  palette: string[]
  estLow: number
  estHigh: number
  notes: string
}): Promise<string | null> {
  if (!isConfigured) return `#CR-${Math.floor(Math.random() * 900 + 100)}`

  const { data, error } = await supabase
    .from('custom_requests')
    .insert({
      user_id:      payload.userId,
      shape:        payload.shape,
      size_id:      payload.sizeId,
      type:         payload.type,
      pattern_data: payload.patternData,
      palette:      payload.palette,
      est_low:      payload.estLow,
      est_high:     payload.estHigh,
      notes:        payload.notes,
      status:       'review',
    })
    .select()
    .single()

  if (error || !data) return null
  return `#CR-${data.id.slice(0, 6).toUpperCase()}`
}

// ── Profile / role ────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<{ name: string; role: string } | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data
}
