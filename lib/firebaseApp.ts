// Firebase App initialization - Safe for both client and server
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { firebaseEnvConfig, validateFirebaseConfig } from './firebase-config'

// Initialize Firebase App safely - prevents multiple instances
let app: FirebaseApp | null = null

// Safe initialization function
const initializeFirebaseApp = (): FirebaseApp => {
  // Only initialize Firebase on client-side
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be initialized on the client side')
  }

  // Return existing app if already initialized
  if (app) {
    return app
  }

  // Debug da configuração do Firebase
  console.log('Firebase Config:', {
    apiKey: firebaseEnvConfig.apiKey ? '✓ Definido' : '✗ Faltando',
    authDomain: firebaseEnvConfig.authDomain ? '✓ Definido' : '✗ Faltando',
    projectId: firebaseEnvConfig.projectId ? '✓ Definido' : '✗ Faltando',
    storageBucket: firebaseEnvConfig.storageBucket ? '✓ Definido' : '✗ Faltando',
    messagingSenderId: firebaseEnvConfig.messagingSenderId ? '✓ Definido' : '✗ Faltando',
    appId: firebaseEnvConfig.appId ? '✓ Definido' : '✗ Faltando',
  })

  // Check if Firebase is already initialized
  const existingApps = getApps()
  if (existingApps.length > 0) {
    app = existingApps[0]
    return app
  }

  // Validate Firebase configuration
  if (!validateFirebaseConfig()) {
    const missingVars = []
    if (!firebaseEnvConfig.apiKey) missingVars.push('NEXT_PUBLIC_FIREBASE_API_KEY')
    if (!firebaseEnvConfig.authDomain) missingVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
    if (!firebaseEnvConfig.projectId) missingVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID')
    if (!firebaseEnvConfig.storageBucket) missingVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
    if (!firebaseEnvConfig.messagingSenderId) missingVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
    if (!firebaseEnvConfig.appId) missingVars.push('NEXT_PUBLIC_FIREBASE_APP_ID')
    
    console.error('Firebase configuration is invalid. Missing variables:', missingVars)
    throw new Error(`Firebase configuration is invalid. Missing: ${missingVars.join(', ')}`)
  }

  try {
    app = initializeApp(firebaseEnvConfig)
    console.log('Firebase app initialized successfully')
    return app
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error)
    throw new Error('Firebase initialization failed. Check your configuration.')
  }
}

// Export the initialization function instead of the app directly
export const getFirebaseApp = (): FirebaseApp => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase can only be used on the client side')
  }
  
  if (!app) {
    app = initializeFirebaseApp()
  }
  
  return app
}

// For backwards compatibility, return the function that gets the app
const getAppWrapper = () => {
  if (typeof window === 'undefined') {
    // Return a dummy object on server side to prevent build errors
    return {} as FirebaseApp
  }
  try {
    return getFirebaseApp()
  } catch (error) {
    console.error('Failed to get Firebase app:', error)
    throw error
  }
}

export default getAppWrapper

// Export the config for debugging
export { firebaseEnvConfig as firebaseConfig }