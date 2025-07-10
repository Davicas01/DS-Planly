// Firebase App initialization - Safe for both client and server
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { firebaseEnvConfig, validateFirebaseConfig } from './firebase-config'

// Initialize Firebase App safely - prevents multiple instances
let app: FirebaseApp

// Only initialize Firebase on client-side with valid config
if (typeof window !== 'undefined') {
  // Validate Firebase configuration on client-side
  if (!validateFirebaseConfig()) {
    console.error('Firebase configuration is invalid or incomplete')
    console.error('Missing environment variables:', {
      apiKey: !firebaseEnvConfig.apiKey ? 'NEXT_PUBLIC_FIREBASE_API_KEY' : '✓',
      authDomain: !firebaseEnvConfig.authDomain ? 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN' : '✓',
      projectId: !firebaseEnvConfig.projectId ? 'NEXT_PUBLIC_FIREBASE_PROJECT_ID' : '✓',
      storageBucket: !firebaseEnvConfig.storageBucket ? 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET' : '✓',
      messagingSenderId: !firebaseEnvConfig.messagingSenderId ? 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID' : '✓',
      appId: !firebaseEnvConfig.appId ? 'NEXT_PUBLIC_FIREBASE_APP_ID' : '✓',
    })
    throw new Error('Firebase configuration is invalid. Please check your environment variables in Vercel.')
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseEnvConfig)
      console.log('Firebase app initialized successfully')
    } else {
      app = getApp()
      console.log('Firebase app already exists, using existing instance')
    }
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error)
    throw new Error('Firebase initialization failed. Check your configuration.')
  }
} else {
  // Server-side: create a dummy app to prevent build errors
  // This will never be used since all Firebase operations are client-side only
  app = {} as FirebaseApp
}

export default app
export { firebaseEnvConfig as firebaseConfig }