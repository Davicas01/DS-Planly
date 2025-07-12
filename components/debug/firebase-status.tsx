'use client'

import { useEffect, useState } from 'react'
import { isFirebaseInitialized } from '@/lib/firebaseClient'

export function FirebaseStatus() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkFirebase = async () => {
      try {
        // Wait for client-side hydration
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (isFirebaseInitialized()) {
          setStatus('ready')
        } else {
          setStatus('error')
          setError('Firebase not initialized')
        }
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    }

    checkFirebase()
  }, [])

  if (status === 'loading') {
    return <div>Initializing Firebase...</div>
  }

  if (status === 'error') {
    return <div>Firebase Error: {error}</div>
  }

  return <div>Firebase Ready</div>
}
