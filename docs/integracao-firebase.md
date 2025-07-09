# Integração Firebase com Sistema Planly

## 🔥 Visão Geral da Integração

Este guia detalha como integrar o Firebase ao sistema Planly, fornecendo autenticação robusta, banco de dados em tempo real, storage de arquivos e analytics.

## 📋 Pré-requisitos

### 1. Configuração do Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione existente
3. Ative os seguintes serviços:
   - **Authentication**
   - **Firestore Database**
   - **Storage**
   - **Analytics**
   - **Cloud Functions** (opcional)
   - **Hosting** (para deploy)

### 2. Configuração Web App

1. No Firebase Console, clique em "Adicionar app" → "Web"
2. Registre o app com nome "Planly"
3. Copie as configurações do Firebase

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install firebase
npm install --save-dev @types/firebase
```

### 2. Configuração do Firebase

#### Criar arquivo de configuração

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export default app
```

#### Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔐 Sistema de Autenticação

### 1. Hook de Autenticação

```typescript
// hooks/use-firebase-auth.ts
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
  signInWithPopup
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      await updateProfile(result.user, { displayName })
      
      return result.user
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      setError(error.message)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      setError(error.message)
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
    resetPassword
  }
}
```

### 2. Context Provider

```typescript
// contexts/auth-context.tsx
'use client'

import React, { createContext, useContext } from 'react'
import { useFirebaseAuth, AuthUser } from '@/hooks/use-firebase-auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, displayName: string) => Promise<any>
  signInWithGoogle: () => Promise<any>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuth()

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
```

### 3. Atualizar Layout Principal

```typescript
// app/layout.tsx
import { AuthProvider } from '@/contexts/auth-context'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
```

## 🗄️ Estrutura do Banco de Dados Firestore

### 1. Schema de Dados

```typescript
// types/firebase.ts
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  createdAt: Date
  updatedAt: Date
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    language: string
  }
  onboardingCompleted: boolean
}

export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  category: 'health' | 'productivity' | 'learning' | 'social' | 'other'
  frequency: 'daily' | 'weekly' | 'monthly'
  target: number
  unit: string
  color: string
  icon: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface HabitEntry {
  id: string
  habitId: string
  userId: string
  date: Date
  value: number
  completed: boolean
  notes?: string
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'income' | 'expense'
  category: string
  description: string
  date: Date
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface HealthMetric {
  id: string
  userId: string
  type: 'weight' | 'mood' | 'sleep' | 'exercise' | 'water'
  value: number
  unit: string
  date: Date
  notes?: string
  createdAt: Date
}
```

### 2. Serviços de Dados

```typescript
// services/firestore.ts
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Habit, HabitEntry, Transaction, HealthMetric, UserProfile } from '@/types/firebase'

// User Profile Services
export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now()
  })
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as UserProfile
  }
  return null
}

// Habit Services
export const createHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
  const habitsRef = collection(db, 'habits')
  const docRef = await addDoc(habitsRef, {
    ...habit,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  })
  return docRef.id
}

export const getUserHabits = async (userId: string): Promise<Habit[]> => {
  const habitsRef = collection(db, 'habits')
  const q = query(
    habitsRef,
    where('userId', '==', userId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Habit[]
}

export const updateHabit = async (habitId: string, updates: Partial<Habit>) => {
  const habitRef = doc(db, 'habits', habitId)
  await updateDoc(habitRef, {
    ...updates,
    updatedAt: Timestamp.now()
  })
}

export const deleteHabit = async (habitId: string) => {
  const habitRef = doc(db, 'habits', habitId)
  await updateDoc(habitRef, {
    isActive: false,
    updatedAt: Timestamp.now()
  })
}

// Habit Entry Services
export const createHabitEntry = async (entry: Omit<HabitEntry, 'id' | 'createdAt'>) => {
  const entriesRef = collection(db, 'habitEntries')
  const docRef = await addDoc(entriesRef, {
    ...entry,
    createdAt: Timestamp.now()
  })
  return docRef.id
}

export const getHabitEntries = async (habitId: string, startDate: Date, endDate: Date): Promise<HabitEntry[]> => {
  const entriesRef = collection(db, 'habitEntries')
  const q = query(
    entriesRef,
    where('habitId', '==', habitId),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'desc')
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as HabitEntry[]
}

// Transaction Services
export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
  const transactionsRef = collection(db, 'transactions')
  const docRef = await addDoc(transactionsRef, {
    ...transaction,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  })
  return docRef.id
}

export const getUserTransactions = async (userId: string, limitCount = 50): Promise<Transaction[]> => {
  const transactionsRef = collection(db, 'transactions')
  const q = query(
    transactionsRef,
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(limitCount)
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Transaction[]
}

// Health Metrics Services
export const createHealthMetric = async (metric: Omit<HealthMetric, 'id' | 'createdAt'>) => {
  const metricsRef = collection(db, 'healthMetrics')
  const docRef = await addDoc(metricsRef, {
    ...metric,
    createdAt: Timestamp.now()
  })
  return docRef.id
}

export const getHealthMetrics = async (userId: string, type: string, limitCount = 30): Promise<HealthMetric[]> => {
  const metricsRef = collection(db, 'healthMetrics')
  const q = query(
    metricsRef,
    where('userId', '==', userId),
    where('type', '==', type),
    orderBy('date', 'desc'),
    limit(limitCount)
  )
  
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as HealthMetric[]
}

// Real-time subscriptions
export const subscribeToUserHabits = (userId: string, callback: (habits: Habit[]) => void) => {
  const habitsRef = collection(db, 'habits')
  const q = query(
    habitsRef,
    where('userId', '==', userId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  
  return onSnapshot(q, (querySnapshot) => {
    const habits = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[]
    callback(habits)
  })
}
```

## 📁 Storage de Arquivos

### 1. Upload de Imagens

```typescript
// services/storage.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {
  const imageRef = ref(storage, `profiles/${userId}/avatar.jpg`)
  
  // Resize image before upload (optional)
  const resizedFile = await resizeImage(file, 400, 400)
  
  const snapshot = await uploadBytes(imageRef, resizedFile)
  const downloadURL = await getDownloadURL(snapshot.ref)
  
  return downloadURL
}

export const uploadHabitImage = async (userId: string, habitId: string, file: File): Promise<string> => {
  const imageRef = ref(storage, `habits/${userId}/${habitId}/${Date.now()}.jpg`)
  
  const snapshot = await uploadBytes(imageRef, file)
  const downloadURL = await getDownloadURL(snapshot.ref)
  
  return downloadURL
}

export const deleteImage = async (imageUrl: string) => {
  const imageRef = ref(storage, imageUrl)
  await deleteObject(imageRef)
}

// Helper function to resize images
const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      const { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      
      canvas.width = width * ratio
      canvas.height = height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        const resizedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now()
        })
        resolve(resizedFile)
      }, file.type, 0.8)
    }
    
    img.src = URL.createObjectURL(file)
  })
}
```

## 🔄 Sincronização Offline

### 1. Configurar Persistência

```typescript
// lib/firebase.ts (adicionar)
import { enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore'

// Enable offline persistence
if (typeof window !== 'undefined') {
  // Enable offline persistence
  enableNetwork(db)
}

// Offline/Online detection
export const goOffline = () => disableNetwork(db)
export const goOnline = () => enableNetwork(db)
```

### 2. Hook de Conectividade

```typescript
// hooks/use-connectivity.ts
import { useState, useEffect } from 'react'
import { goOffline, goOnline } from '@/lib/firebase'

export const useConnectivity = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      goOnline()
    }

    const handleOffline = () => {
      setIsOnline(false)
      goOffline()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
```

## 📊 Analytics e Monitoramento

### 1. Configurar Analytics

```typescript
// services/analytics.ts
import { logEvent, setUserId, setUserProperties } from 'firebase/analytics'
import { analytics } from '@/lib/firebase'

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters)
  }
}

export const setAnalyticsUserId = (userId: string) => {
  if (analytics) {
    setUserId(analytics, userId)
  }
}

export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  if (analytics) {
    setUserProperties(analytics, properties)
  }
}

// Custom events
export const trackHabitCompleted = (habitId: string, habitName: string) => {
  trackEvent('habit_completed', {
    habit_id: habitId,
    habit_name: habitName
  })
}

export const trackTransactionAdded = (amount: number, type: string, category: string) => {
  trackEvent('transaction_added', {
    amount,
    type,
    category
  })
}

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName
  })
}
```

## 🚀 Deploy e Hosting

### 1. Configurar Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init hosting
```

### 2. Configuração de Deploy

```json
// firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 3. Scripts de Deploy

```json
// package.json
{
  "scripts": {
    "build:firebase": "next build && next export",
    "deploy:firebase": "npm run build:firebase && firebase deploy",
    "deploy:preview": "npm run build:firebase && firebase hosting:channel:deploy preview"
  }
}
```

## 🔧 Regras de Segurança

### 1. Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habits - users can only access their own habits
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Habit entries - users can only access their own entries
    match /habitEntries/{entryId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Transactions - users can only access their own transactions
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Health metrics - users can only access their own metrics
    match /healthMetrics/{metricId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 2. Storage Security Rules

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile images - users can only access their own
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habit images - users can only access their own
    match /habits/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testes

### 1. Configurar Emuladores

```bash
# Instalar emuladores
firebase init emulators

# Iniciar emuladores
firebase emulators:start
```

### 2. Testes de Integração

```typescript
// __tests__/firebase.test.ts
import { connectAuthEmulator } from 'firebase/auth'
import { connectFirestoreEmulator } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

// Connect to emulators in test environment
if (process.env.NODE_ENV === 'test') {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8080)
}

describe('Firebase Integration', () => {
  test('should create user profile', async () => {
    // Test implementation
  })
  
  test('should create and retrieve habits', async () => {
    // Test implementation
  })
})
```

## 📈 Monitoramento e Performance

### 1. Performance Monitoring

```typescript
// lib/firebase.ts (adicionar)
import { getPerformance } from 'firebase/performance'

export const perf = typeof window !== 'undefined' ? getPerformance(app) : null
```

### 2. Crashlytics

```typescript
// services/crashlytics.ts
import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '@/lib/firebase'

const functions = getFunctions(app)

export const logError = httpsCallable(functions, 'logError')

export const reportCrash = async (error: Error, context?: Record<string, any>) => {
  try {
    await logError({
      message: error.message,
      stack: error.stack,
      context
    })
  } catch (e) {
    console.error('Failed to report crash:', e)
  }
}
```

Esta integração completa do Firebase fornece uma base sólida para autenticação, armazenamento de dados, sincronização em tempo real e analytics para o sistema Planly.