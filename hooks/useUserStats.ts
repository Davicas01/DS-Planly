'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { getFirebaseFirestore } from '@/lib/firebaseClient'

interface UserStats {
  totalHabits: number
  activeHabits: number
  longestStreak: number
  totalDaysActive: number
  averageMood: number
  totalTransactions: number
  goalsCompleted: number
  joinDate: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: any
  category: string
}

export const useUserStats = (userId: string | undefined) => {
  const [userStats, setUserStats] = useState<UserStats>({
    totalHabits: 0,
    activeHabits: 0,
    longestStreak: 0,
    totalDaysActive: 0,
    averageMood: 0,
    totalTransactions: 0,
    goalsCompleted: 0,
    joinDate: ''
  })
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchUserStats = async () => {
      try {
        setLoading(true)
        
        // Debug: Verificar inicialização do Firestore
        console.log('🔍 useUserStats: Verificando inicialização do Firestore...')
        const db = getFirebaseFirestore()
        console.log('🔍 useUserStats: Firestore instance:', db)
        console.log('🔍 useUserStats: Firestore type:', typeof db)
        
        if (!db) {
          console.error('❌ useUserStats: Firestore não está inicializado')
          throw new Error('Firestore não está inicializado')
        }
        
        // Buscar dados do usuário
        const userDoc = await getDoc(doc(db, 'users', userId))
        const userData = userDoc.data()
        
        // Buscar hábitos
        console.log('🔍 useUserStats: Buscando hábitos...')
        const habitsSnapshot = await getDocs(collection(db, `habits/${userId}/userHabits`))
        const habits = habitsSnapshot.docs.map(doc => doc.data())
        const activeHabits = habits.filter(habit => habit.isActive).length
        const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak || 0), 0)
        
        // Buscar transações
        console.log('🔍 useUserStats: Buscando transações...')
        const transactionsSnapshot = await getDocs(collection(db, `finances/${userId}/transactions`))
        const totalTransactions = transactionsSnapshot.size
        
        // Buscar humor médio
        console.log('🔍 useUserStats: Buscando dados de humor...')
        const moodsSnapshot = await getDocs(
          query(collection(db, `moods/${userId}/entries`), orderBy('date', 'desc'), limit(30))
        )
        const moods = moodsSnapshot.docs.map(doc => doc.data())
        const averageMood = moods.length > 0 
          ? moods.reduce((sum, mood) => sum + mood.rating, 0) / moods.length
          : 0
        
        // Buscar conquistas
        console.log('🔍 useUserStats: Buscando conquistas...')
        const achievementsSnapshot = await getDocs(
          query(collection(db, `achievements/${userId}/userAchievements`), orderBy('unlockedAt', 'desc'))
        )
        const userAchievements = achievementsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Achievement[]
        
        // Calcular dias ativos (aproximação baseada em hábitos)
        const totalDaysActive = Math.max(
          habits.reduce((sum, habit) => sum + (habit.streak || 0), 0),
          moods.length,
          Math.floor(totalTransactions / 2) // Aproximação
        )
        
        console.log('✅ useUserStats: Dados carregados com sucesso')
        setUserStats({
          totalHabits: habits.length,
          activeHabits,
          longestStreak,
          totalDaysActive,
          averageMood: Number(averageMood.toFixed(1)),
          totalTransactions,
          goalsCompleted: userAchievements.length,
          joinDate: userData?.joinDate || userData?.createdAt?.toDate?.()?.toISOString() || ''
        })
        
        setAchievements(userAchievements)
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas do usuário:', err)
        setError('Erro ao carregar estatísticas do usuário')
      } finally {
        setLoading(false)
      }
    }

    fetchUserStats()
  }, [userId])

  return { userStats, achievements, loading, error }
}
