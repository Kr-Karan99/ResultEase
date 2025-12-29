import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

/**
 * Firebase configuration using environment variables
 * All keys should start with NEXT_PUBLIC_ to be accessible in browser
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/**
 * Validate Firebase configuration
 */
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(
    'Firebase configuration is missing. Please ensure .env.local file exists with all required NEXT_PUBLIC_FIREBASE_* variables.'
  )
  if (process.env.NODE_ENV === 'development') {
    console.error('Expected variables:', {
      NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey ? '✓' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain ? '✓' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId ? '✓' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket ? '✓' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId ? '✓' : '✗ MISSING',
      NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId ? '✓' : '✗ MISSING',
    })
  }
}

/**
 * Initialize Firebase - reuse existing app if already initialized
 * This prevents errors when module is imported multiple times (e.g., in Next.js SSR)
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

/**
 * Initialize Firebase services with modular SDK (v9+)
 */
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

/**
 * Optional: Connect to Firebase Emulator Suite for development
 * Uncomment if running Firebase emulator locally
 */
// if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
//   connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
//   connectFirestoreEmulator(db, 'localhost', 8080)
//   connectStorageEmulator(storage, 'localhost', 9199)
// }

export default app
