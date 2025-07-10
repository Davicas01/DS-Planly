// Firebase Configuration Helper
// Este arquivo garante que o Firebase seja usado apenas no client-side

// Verificação de ambiente
export const isClientSide = typeof window !== 'undefined'
export const isServerSide = typeof window === 'undefined'

// Função para verificar se estamos no cliente
export const ensureClientSide = (functionName: string) => {
  if (isServerSide) {
    throw new Error(`${functionName} can only be called on the client side`)
  }
}

// Configurações de runtime para páginas
export const clientOnlyConfig = {
  runtime: 'edge' as const,
  dynamic: 'force-dynamic' as const,
}

// Lista de páginas que devem ser client-side only
export const clientOnlyPages = [
  '/dashboard',
  '/auth/login',
  '/auth/signup',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/onboarding',
  '/dashboard/profile',
  '/dashboard/settings',
]

// Verificar se uma página deve ser client-side only
export const shouldBeClientOnly = (pathname: string): boolean => {
  return clientOnlyPages.some(page => pathname.startsWith(page))
}

// Configuração de ambiente para Firebase
export const firebaseEnvConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

// Validar configuração do Firebase
export const validateFirebaseConfig = (): boolean => {
  const requiredKeys = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ]
  
  return requiredKeys.every(key => {
    const value = firebaseEnvConfig[key as keyof typeof firebaseEnvConfig]
    return value && value.length > 0
  })
}

// Log de configuração e validação
if (isClientSide) {
  const isValid = validateFirebaseConfig()
  console.log('Firebase Config Validation:', isValid)
  
  if (!isValid) {
    console.error('Firebase configuration is invalid or incomplete')
    console.error('Missing environment variables:', {
      NEXT_PUBLIC_FIREBASE_API_KEY: !firebaseEnvConfig.apiKey ? 'MISSING' : 'OK',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !firebaseEnvConfig.authDomain ? 'MISSING' : 'OK',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !firebaseEnvConfig.projectId ? 'MISSING' : 'OK',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !firebaseEnvConfig.storageBucket ? 'MISSING' : 'OK',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !firebaseEnvConfig.messagingSenderId ? 'MISSING' : 'OK',
      NEXT_PUBLIC_FIREBASE_APP_ID: !firebaseEnvConfig.appId ? 'MISSING' : 'OK',
    })
  }
}