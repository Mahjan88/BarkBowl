import React, { createContext, useContext, useState } from 'react'
import { MOCK_USER } from '../lib/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,          setUser]          = useState(MOCK_USER)
  const [loading,       setLoading]       = useState(false)
  // hasOnboarded: true = returning user, false = just signed up
  const [hasOnboarded,  setHasOnboarded]  = useState(true)   // mock existing user
  const [petType,       setPetType]       = useState('dog')   // 'dog' | 'cat' | null

  const signIn = async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setUser(MOCK_USER)
    setHasOnboarded(true)   // returning user — skip onboarding
    setPetType('dog')
    setLoading(false)
  }

  const signUp = async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setUser({ ...MOCK_USER, email: email || MOCK_USER.email })
    setHasOnboarded(false)  // new user — show onboarding
    setPetType(null)
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 200))
    setUser(null)
    setHasOnboarded(false)
    setPetType(null)
    setLoading(false)
  }

  const completeOnboarding = (type) => {
    setPetType(type)
    setHasOnboarded(true)
  }

  return (
    <AuthContext.Provider value={{
      user, loading,
      hasOnboarded, petType,
      signIn, signUp, signOut,
      completeOnboarding,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
