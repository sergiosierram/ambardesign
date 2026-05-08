export type Pattern = (number | null)[][]

export interface Product {
  id: string
  name: string
  cat: string
  price: number
  palette: string[]
  pattern: Pattern
  stock: number
  tags: string[]
  desc: string
  materials: string
  palette_name: string
}

export interface CartItem {
  p: Product
  qty: number
}

export interface User {
  id: string
  name: string
  email: string
  role?: 'admin' | 'customer'
}

export interface Order {
  id: string
  user: string
  items: number
  total: number
  status: string
  date: string
}

export interface CustomRequest {
  id: string
  user: string
  shape: string
  size: string
  colors: number
  complexity: string
  est: number
  status: string
  date: string
}

export type Route =
  | 'home'
  | 'shop'
  | 'product'
  | 'builder'
  | 'cart'
  | 'checkout'
  | 'login'
  | 'signup'
  | 'account'
  | 'about'
  | 'admin-login'
  | 'admin'
