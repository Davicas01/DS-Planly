'use client'

import { useState, useEffect } from 'react'
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'

interface UserData {
  displayName: string
  email: string
  photoURL?: string
  phone?: string
  location?: string
  bio?: string
  joinDate: string
  createdAt: any
  updatedAt: any
}

export const useUserData = () => {
  const { user } = useAuth()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false)
      return
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      async (doc) => {
        try {
          if (doc.exists()) {
            setUserData(doc.data() as UserData)
          } else {
            // Criar documento do usuário se não existir
            const newUserData: UserData = {
              displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
              email: user.email || '',
              photoURL: user.photoURL || '',
              phone: '',
              location: '',
              bio: '',
              joinDate: new Date().toISOString(),
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }
            
            await setDoc(doc.ref, newUserData)
            setUserData(newUserData)
          }
        } catch (err) {
          console.error('Erro ao carregar dados do usuário:', err)
          setError('Erro ao carregar dados do usuário')
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error('Erro no listener do usuário:', err)
        setError('Erro ao conectar com o banco de dados')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid, user?.displayName, user?.email, user?.photoURL])

  return { userData, loading, error }
}
