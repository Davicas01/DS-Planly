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
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { deleteCookie, setCookie } from 'cookies-next'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        })
        
        // Definir cookie de autenticação quando usuário está logado
        const token = await firebaseUser.getIdToken()
        setCookie('firebase-auth-token', token, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
      } else {
        setUser(null)
        // Remover cookie quando usuário não está logado
        deleteCookie('firebase-auth-token')
        deleteCookie('planly_onboarding_completed')
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
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
    try {
      setError(null)
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      await updateProfile(result.user, { displayName })
      
      // Send email verification
      await sendEmailVerification(result.user)
      
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
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
    try {
      setError(null)
      setLoading(true)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
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
    try {
      setError(null)
      await signOut(auth)
      deleteCookie('firebase-auth-token')
      deleteCookie('planly_onboarding_completed')
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  const resendEmailVerification = async () => {
    try {
      setError(null)
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
      }
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

// Helper function to translate Firebase error codes to Portuguese
const getErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado'
    case 'auth/wrong-password':
      return 'Senha incorreta'
    case 'auth/email-already-in-use':
      return 'Este email já está em uso'
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres'
    case 'auth/invalid-email':
      return 'Email inválido'
    case 'auth/user-disabled':
      return 'Esta conta foi desabilitada'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde'
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet'
    case 'auth/popup-closed-by-user':
      return 'Login cancelado pelo usuário'
    case 'auth/cancelled-popup-request':
      return 'Solicitação de login cancelada'
    default:
      return 'Erro desconhecido. Tente novamente'
  }
}