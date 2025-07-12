// Firebase Client Services - CLIENT-SIDE ONLY
import { Auth, getAuth } from 'firebase/auth'
import { Firestore, getFirestore } from 'firebase/firestore'
import { FirebaseStorage, getStorage } from 'firebase/storage'
import { Analytics, getAnalytics } from 'firebase/analytics'
import { getFirebaseApp } from './firebaseApp'

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
    try {
      const app = getFirebaseApp()
      auth = getAuth(app)
    } catch (error) {
      console.error('Failed to initialize Firebase Auth:', error)
      throw error
    }
  }
  
  return auth
}

// Safe Firestore getter - CLIENT ONLY
export const getFirebaseFirestore = (): Firestore => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Firestore can only be used on the client side')
  }
  
  if (!db) {
    try {
      const app = getFirebaseApp()
      db = getFirestore(app)
      console.log('Firestore initialized successfully:', !!db)
    } catch (error) {
      console.error('Failed to initialize Firebase Firestore:', error)
      throw error
    }
  }
  
  return db
}

// Safe Storage getter - CLIENT ONLY
export const getFirebaseStorage = (): FirebaseStorage => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Storage can only be used on the client side')
  }
  
  if (!storage) {
    try {
      const app = getFirebaseApp()
      storage = getStorage(app)
    } catch (error) {
      console.error('Failed to initialize Firebase Storage:', error)
      throw error
    }
  }
  
  return storage
}

// Safe Analytics getter - CLIENT ONLY
export const getFirebaseAnalytics = (): Analytics => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Analytics can only be used on the client side')
  }
  
  if (!analytics) {
    try {
      const app = getFirebaseApp()
      analytics = getAnalytics(app)
    } catch (error) {
      console.error('Failed to initialize Firebase Analytics:', error)
      throw error
    }
  }
  
  return analytics
}

// Utility function to check if Firebase is properly initialized
export const isFirebaseInitialized = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  
  try {
    getFirebaseApp()
    return true
  } catch (error) {
    return false
  }
}