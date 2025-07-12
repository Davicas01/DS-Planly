'use client'

import React, { createContext, useContext } from 'react'
import { useFirebaseAuthSafe, AuthUser } from '@/hooks/use-firebase-auth-safe'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, displayName: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  resendEmailVerification: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuthSafe()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}