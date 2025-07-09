// Firebase configuration - SAFE for Next.js with SSR/SSG
// This file re-exports from the modular Firebase setup

// Import the safe Firebase app
import app from './firebaseApp'

// Import client-safe Firebase services
export {
  getFirebaseAuth as getAuth,
  getFirebaseFirestore as getFirestore,
  getFirebaseStorage as getStorage,
  getFirebaseAnalytics as getAnalytics,
  useFirebaseServices,
  auth,
  db,
  storage,
  analytics
} from './firebaseClient'

// Export the app for backward compatibility
export default app

// Export config for debugging purposes
export { firebaseConfig } from './firebaseApp'