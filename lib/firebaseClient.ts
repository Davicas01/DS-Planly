// Firebase Client Services - CLIENT-SIDE ONLY
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'
import { FirebaseStorage, getStorage } from 'firebase/storage'
import { Analytics, getAnalytics } from 'firebase/analytics'
import app from './firebaseApp'

// Client-side only Firebase services
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null
let analytics: Analytics | null = null

// Safe Auth getter - CLIENT ONLY
export const getFirebaseAuth = (): Auth => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used on the client side')
  }
  
  if (!auth) {
    auth = getAuth(app)
  }
  
  return auth
}

// Safe Firestore getter - CLIENT ONLY
export const getFirebaseFirestore = (): Firestore => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Firestore can only be used on the client side')
  }
  
  if (!db) {
    db = getFirestore(app)
  }
  
  return db
}

// Safe Storage getter - CLIENT ONLY
export const getFirebaseStorage = (): FirebaseStorage => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Storage can only be used on the client side')
  }
  
  if (!storage) {
    storage = getStorage(app)
  }
  
  return storage
}

// Safe Analytics getter - CLIENT ONLY
export const getFirebaseAnalytics = (): Analytics | null => {
  if (typeof window === 'undefined') {
    return null
  }
  
  if (!analytics) {
    try {
      analytics = getAnalytics(app)
    } catch (error) {
      console.warn('Analytics not available:', error)
      return null
    }
  }
  
  return analytics
}

// Hook-based Firebase services for React components
export const useFirebaseServices = () => {
  const getAuth = () => {
    if (typeof window === 'undefined') return null
    return getFirebaseAuth()
  }
  
  const getFirestore = () => {
    if (typeof window === 'undefined') return null
    return getFirebaseFirestore()
  }
  
  const getStorage = () => {
    if (typeof window === 'undefined') return null
    return getFirebaseStorage()
  }
  
  const getAnalytics = () => {
    if (typeof window === 'undefined') return null
    return getFirebaseAnalytics()
  }
  
  return {
    auth: getAuth(),
    db: getFirestore(),
    storage: getStorage(),
    analytics: getAnalytics()
  }
}

// Legacy exports for backward compatibility
// Note: Use the getter functions above for better error handling
export { getFirebaseAuth as auth }
export { getFirebaseFirestore as db }
export { getFirebaseStorage as storage }
export { getFirebaseAnalytics as analytics }