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
import { getFirebaseAuth } from '@/lib/firebaseClient'
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
  const [auth, setAuth] = useState<Auth | null>(null)

  // Debug da inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const authInstance = getFirebaseAuth()
        setAuth(authInstance)
        console.log('Firebase Auth inicializado:', !!authInstance)
      } catch (error) {
        console.error('Failed to initialize Firebase Auth:', error)
        setError('Failed to initialize authentication')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!auth) return
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Estado de autenticação mudou:', !!firebaseUser)
      
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
  }, [auth])

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase Auth not initialized')
    
    try {
      setError(null)
      setLoading(true)
      
      // Debug detalhado
      console.log('Tentativa de login:', {
        email: email?.trim(),
        hasPassword: !!password,
        authInstance: !!auth,
        emailLength: email?.length,
        passwordLength: password?.length
      })
      
      // Validações básicas
      if (!email || !password) {
        console.error('Email ou senha faltando')
        throw new Error('Email ou senha faltando')
      }
      
      if (!email.includes('@')) {
        console.error('Email inválido')
        throw new Error('Email inválido')
      }
      
      const result = await signInWithEmailAndPassword(auth, email.trim(), password)
      
      console.log('Login bem-sucedido:', result.user.uid)
      
      const token = await result.user.getIdToken()
      setCookie('firebase-auth-token', token, {
        maxAge: 60 * 60 * 24 * 7, // 7 dias
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
      return result.user
    } catch (error: any) {
      console.error('Erro completo de autenticação:', {
        code: error.code,
        message: error.message,
        details: error,
        timestamp: new Date().toISOString()
      })
      
      // Tratamento específico de erros
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('Email ou senha incorretos')
          break
        case 'auth/user-not-found':
          setError('Usuário não encontrado')
          break
        case 'auth/wrong-password':
          setError('Senha incorreta')
          break
        case 'auth/invalid-email':
          setError('Email inválido')
          break
        case 'auth/user-disabled':
          setError('Conta desabilitada')
          break
        case 'auth/too-many-requests':
          setError('Muitas tentativas. Tente novamente mais tarde')
          break
        default:
          setError('Erro de autenticação: ' + error.message)
      }
      
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
    if (!auth) throw new Error('Firebase Auth not initialized')
    
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
    if (!auth) throw new Error('Firebase Auth not initialized')
    
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
    if (!auth) throw new Error('Firebase Auth not initialized')
    
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      setError(getErrorMessage(error.code))
      throw error
    }
  }

  const resendEmailVerification = async () => {
    if (!auth) throw new Error('Firebase Auth not initialized')
    
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
    case 'auth/invalid-credential':
      return 'Email ou senha incorretos'
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
    case 'auth/invalid-api-key':
      return 'Chave API inválida. Verifique a configuração do Firebase'
    case 'auth/app-deleted':
      return 'Aplicação Firebase foi deletada'
    case 'auth/app-not-authorized':
      return 'Aplicação não autorizada'
    case 'auth/argument-error':
      return 'Erro nos argumentos fornecidos'
    case 'auth/invalid-user-token':
      return 'Token de usuário inválido'
    case 'auth/user-token-expired':
      return 'Token de usuário expirado'
    case 'auth/null-user':
      return 'Usuário nulo'
    case 'auth/tenant-id-mismatch':
      return 'ID do tenant não coincide'
    case 'auth/requires-recent-login':
      return 'Operação requer login recente'
    default:
      return 'Erro de autenticação: ' + errorCode
  }
}