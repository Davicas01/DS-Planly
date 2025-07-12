'use client'

import { useState, useEffect } from 'react'
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  Auth
} from 'firebase/auth'
import { getFirebaseAuth, isFirebaseInitialized } from '@/lib/firebaseClient'
import { deleteCookie, setCookie } from 'cookies-next'
import { getUserOnboardingStatus, markOnboardingComplete, clearOnboardingStatus } from '@/lib/user-status'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  isOnboardingComplete?: boolean
}

export const useFirebaseAuthSafe = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [auth, setAuth] = useState<Auth | null>(null)

  // Initialize Firebase Auth only on client-side
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Wait for client-side hydration
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }

        if (!isFirebaseInitialized()) {
          throw new Error('Firebase not initialized')
        }

        const authInstance = getFirebaseAuth()
        setAuth(authInstance)
      } catch (error) {
        console.error('Failed to initialize Firebase Auth:', error)
        setError('Failed to initialize authentication')
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    if (!auth) return
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            isOnboardingComplete: false // Will be updated below
          }
          
          // Check onboarding status using our improved logic
          authUser.isOnboardingComplete = getUserOnboardingStatus(authUser)
          
          setUser(authUser)
          
          // Set authentication cookie
          const token = await firebaseUser.getIdToken()
          setCookie('firebase-auth-token', token, {
            maxAge: 60 * 60 * 24 * 7, // 7 days
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
        } else {
          setUser(null)
          // Remove cookies
          deleteCookie('firebase-auth-token')
          clearOnboardingStatus()
        }
      } catch (error) {
        console.error('Error handling auth state change:', error)
        setError('Authentication error')
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [auth])

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized')
    
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      return result.user
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized')
    
    try {
      setError(null)
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile
      await updateProfile(result.user, { displayName })
      
      // Send verification email
      await sendEmailVerification(result.user)
      
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      // Mark new users as needing onboarding
      setCookie('planly_onboarding_incomplete', 'true', {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      return result.user
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Firebase Auth not initialized')
    
    try {
      setError(null)
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      
      return result.user
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    if (!auth) return
    
    try {
      await signOut(auth)
      deleteCookie('firebase-auth-token')
      deleteCookie('planly_onboarding_incomplete')
      clearOnboardingStatus()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized')
    
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  const resendEmailVerification = async () => {
    if (!auth || !auth.currentUser) {
      throw new Error('No user logged in')
    }
    
    try {
      await sendEmailVerification(auth.currentUser)
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    resendEmailVerification
  }
}

// Helper function to get error messages
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado'
    case 'auth/wrong-password':
      return 'Senha incorreta'
    case 'auth/email-already-in-use':
      return 'Email já está em uso'
    case 'auth/weak-password':
      return 'Senha muito fraca'
    case 'auth/invalid-email':
      return 'Email inválido'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde'
    default:
      return 'Erro de autenticação'
  }
}
