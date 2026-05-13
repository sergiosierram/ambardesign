import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import { fetchProfile } from '../lib/db'
import type { User as AppUser } from '../types'

interface AuthCtx {
  user: AppUser | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null; role: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  setMockUser: (u: AppUser | null) => void
}

const Ctx = createContext<AuthCtx | null>(null)

function getAppRedirectUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadUser(id: string, email: string, metaName?: string): Promise<string> {
    const profile = isConfigured ? await fetchProfile(id) : null
    const role = profile?.role || 'customer'
    const name = profile?.name || metaName || email.split('@')[0]
    setUser({ id, email, name, role: (role as AppUser['role']) })
    setIsAdmin(role === 'admin')
    return role
  }

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }

    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user) {
        const u = data.session.user
        await loadUser(u.id, u.email!, u.user_metadata?.name)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = session.user
        await loadUser(u.id, u.email!, u.user_metadata?.name)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    if (!isConfigured) {
      setUser({ id: 'mock', email, name: email.split('@')[0] })
      return { error: null, role: 'customer' }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) return { error: error?.message || null, role: null }
    const role = await loadUser(data.user.id, data.user.email!, data.user.user_metadata?.name)
    return { error: null, role }
  }

  async function signUp(email: string, password: string, name: string) {
    if (!isConfigured) {
      setUser({ id: 'mock', email, name })
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { name } },
    })
    return { error: error?.message || null }
  }

  async function signOut() {
    if (!isConfigured) { setUser(null); return }
    await supabase.auth.signOut()
    setUser(null)
  }

  async function signInWithGoogle() {
    if (!isConfigured) {
      setUser({ id: 'mock-google', email: 'demo@gmail.com', name: 'Demo User' })
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getAppRedirectUrl() },
    })
  }

  function setMockUser(u: AppUser | null) { setUser(u); setIsAdmin(u?.role === 'admin') }

  return (
    <Ctx.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut, signInWithGoogle, setMockUser }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
