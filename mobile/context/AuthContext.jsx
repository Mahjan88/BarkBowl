import React, { createContext, useContext, useState } from 'react'
import { MOCK_USER } from '../lib/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER)
  const [loading, setLoading] = useState(false)

  const signIn = async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setUser(MOCK_USER)
    setLoading(false)
  }

  const signUp = async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setUser({ ...MOCK_USER, email: email || MOCK_USER.email })
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 200))
    setUser(null)
    setLoading(false)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
