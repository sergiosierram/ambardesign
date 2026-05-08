import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isConfigured } from '../lib/supabase'
import type { User as AppUser } from '../types'

interface AuthCtx {
  user: AppUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  setMockUser: (u: AppUser | null) => void
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email!,
          name: data.session.user.user_metadata?.name || data.session.user.email!.split('@')[0],
        })
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
        })
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    if (!isConfigured) {
      setUser({ id: 'mock', email, name: email.split('@')[0] })
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
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
      options: { redirectTo: window.location.origin + '/ambardesign/' },
    })
  }

  function setMockUser(u: AppUser | null) { setUser(u) }

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, setMockUser }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
