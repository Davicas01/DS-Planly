'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { getFirebaseFirestore } from '@/lib/firebaseClient'

interface Habit {
  id: string
  name: string
  category: string
  targetTime: string
  isActive: boolean
  streak: number
  createdAt: any
}

interface HabitLog {
  completed: boolean
  completedAt?: any
}

interface TodayProgress {
  completed: number
  total: number
  percentage: number
}

interface TodayHabit {
  id: string
  name: string
  completed: boolean
  time: string
  category: string
}

export const useDashboardHabits = (userId: string | undefined) => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [todayProgress, setTodayProgress] = useState<TodayProgress>({ completed: 0, total: 0, percentage: 0 })
  const [todayHabits, setTodayHabits] = useState<TodayHabit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchHabits = async () => {
      try {
        setLoading(true)
        
        // Debug do Firestore - ANTES de usar collection()
        console.log('=== DEBUG FIRESTORE ===');
        
        let db;
        try {
          db = getFirebaseFirestore();
          console.log('Tipo da instância db:', typeof db);
          console.log('É uma instância Firestore?', db instanceof Object);
          console.log('Propriedades do db:', Object.keys(db || {}));
          console.log('db é null/undefined?', db === null || db === undefined);
        } catch (error) {
          console.error('Erro ao obter instância Firestore:', error);
          setError('Firestore não disponível');
          return;
        }
        
        console.log('========================');
        
        if (!db) {
          console.error('Firestore não inicializado!');
          throw new Error('Firestore não está disponível');
        }
        
        // Buscar hábitos ativos do usuário
        const habitsRef = collection(db, `habits/${userId}/userHabits`)
        const q = query(habitsRef, where('isActive', '==', true))
        const snapshot = await getDocs(q)
        
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Habit[]

        setHabits(habitsData)
        
        // Calcular progresso do dia atual
        const today = new Date().toISOString().split('T')[0]
        let completedCount = 0
        
        const todayHabitsData: TodayHabit[] = []
        
        for (const habit of habitsData) {
          // Verificar se hábito foi completado hoje
          const logRef = doc(db, `habitLogs/${userId}/logs/${today}`)
          const logDoc = await getDoc(logRef)
          
          const isCompleted = logDoc.exists() && 
                             logDoc.data()?.logs?.[habit.id]?.completed === true
          
          if (isCompleted) {
            completedCount++
          }
          
          todayHabitsData.push({
            id: habit.id,
            name: habit.name,
            completed: isCompleted,
            time: habit.targetTime,
            category: habit.category
          })
        }
        
        const total = habitsData.length
        const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0
        
        setTodayProgress({ completed: completedCount, total, percentage })
        setTodayHabits(todayHabitsData)
        
      } catch (err) {
        console.error('Erro ao buscar hábitos:', err)
        setError('Erro ao carregar hábitos')
      } finally {
        setLoading(false)
      }
    }

    fetchHabits()
  }, [userId])

  return { habits, todayProgress, todayHabits, loading, error }
}
