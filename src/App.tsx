import { useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import CatalogScreen from './screens/CatalogScreen'
import ProductScreen from './screens/ProductScreen'
import BuilderScreen from './screens/BuilderScreen'
import CartScreen from './screens/CartScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import AuthScreen from './screens/AuthScreen'
import AccountScreen from './screens/AccountScreen'
import AboutScreen from './screens/AboutScreen'
import AdminLoginScreen from './screens/admin/AdminLoginScreen'
import AdminDashboard from './screens/admin/AdminDashboard'
import type { CartItem, Product } from './types'

function AppShell() {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isAdmin, setIsAdmin] = useState(false)

  function addToCart(p: Product, qty: number) {
    setCart(prev => {
      const existing = prev.find(i => i.p.id === p.id)
      if (existing) return prev.map(i => i.p.id === p.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { p, qty }]
    })
  }

  const isAdminRoute = window.location.hash.startsWith('#/admin')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--cream)' }}>
      {!isAdminRoute && <Header cart={cart} user={user} />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomeScreen addToCart={addToCart} />} />
          <Route path="/shop" element={<CatalogScreen />} />
          <Route path="/product/:id" element={<ProductScreen addToCart={addToCart} />} />
          <Route path="/builder" element={<BuilderScreen />} />
          <Route path="/cart" element={<CartScreen cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<CheckoutScreen cart={cart} setCart={setCart} user={user} />} />
          <Route path="/login" element={<AuthScreen mode="login" />} />
          <Route path="/signup" element={<AuthScreen mode="signup" />} />
          <Route path="/account" element={user ? <AccountScreen /> : <Navigate to="/login" />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/admin-login" element={<AdminLoginScreen onLogin={() => setIsAdmin(true)} />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard onLogout={() => setIsAdmin(false)} /> : <Navigate to="/admin-login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppShell />
      </HashRouter>
    </AuthProvider>
  )
}
