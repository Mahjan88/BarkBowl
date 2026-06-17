import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { MOCK_USER } from '../lib/mockData'

const IS_MOCK   = import.meta.env.VITE_MOCK_MODE === 'true'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(IS_MOCK ? MOCK_USER : null)
  const [loading, setLoading] = useState(!IS_MOCK)

  useEffect(() => {
    if (IS_MOCK) return  // skip Supabase entirely

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Mock auth handlers — instant, no network
  const mockSignIn  = async () => { setUser(MOCK_USER); return { error: null } }
  const mockSignUp  = async () => { setUser(MOCK_USER); return { error: null } }
  const mockSignOut = async () => { setUser(null) }

  const signUp  = IS_MOCK ? mockSignUp  : (email, password, fullName) =>
    supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })

  const signIn  = IS_MOCK ? mockSignIn  : (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signOut = IS_MOCK ? mockSignOut : () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
