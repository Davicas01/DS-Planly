'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { getFirebaseFirestore } from '@/lib/firebaseClient'

interface MoodEntry {
  id: string
  date: string
  rating: number
  notes: string
  createdAt: any
}

interface MoodStats {
  averageRating: number
  weeklyAverage: number
  monthlyAverage: number
  trend: string
  totalEntries: number
}

export const useMoodStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<MoodStats>({
    averageRating: 0,
    weeklyAverage: 0,
    monthlyAverage: 0,
    trend: '+0.0',
    totalEntries: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchMoodStats = async () => {
      try {
        setLoading(true)
        
        // Debug do Firestore - ANTES de usar collection()
        console.log('=== DEBUG FIRESTORE MOOD ===');
        
        let db;
        try {
          db = getFirebaseFirestore();
          console.log('Tipo da instância db:', typeof db);
          console.log('db é null/undefined?', db === null || db === undefined);
        } catch (error) {
          console.error('Erro ao obter instância Firestore:', error);
          setError('Firestore não disponível');
          return;
        }
        
        if (!db) {
          console.error('Firestore não inicializado!');
          throw new Error('Firestore não está disponível');
        }
        
        // Buscar entradas de humor do usuário
        const moodsRef = collection(db, `moods/${userId}/entries`)
        const q = query(moodsRef, orderBy('date', 'desc'), limit(365)) // Último ano
        const snapshot = await getDocs(q)
        
        const moodEntries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MoodEntry[]

        if (moodEntries.length === 0) {
          setStats({
            averageRating: 0,
            weeklyAverage: 0,
            monthlyAverage: 0,
            trend: '+0.0',
            totalEntries: 0
          })
          return
        }

        // Calcular estatísticas
        const now = new Date()
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
        
        let totalRating = 0
        let weeklyEntries: MoodEntry[] = []
        let monthlyEntries: MoodEntry[] = []
        let lastWeekEntries: MoodEntry[] = []
        
        moodEntries.forEach(entry => {
          const entryDate = new Date(entry.date)
          totalRating += entry.rating
          
          if (entryDate >= oneWeekAgo) {
            weeklyEntries.push(entry)
          }
          
          if (entryDate >= oneMonthAgo) {
            monthlyEntries.push(entry)
          }
          
          if (entryDate >= twoWeeksAgo && entryDate < oneWeekAgo) {
            lastWeekEntries.push(entry)
          }
        })
        
        const averageRating = totalRating / moodEntries.length
        const weeklyAverage = weeklyEntries.length > 0 
          ? weeklyEntries.reduce((sum, entry) => sum + entry.rating, 0) / weeklyEntries.length
          : 0
        const monthlyAverage = monthlyEntries.length > 0 
          ? monthlyEntries.reduce((sum, entry) => sum + entry.rating, 0) / monthlyEntries.length
          : 0
        
        const lastWeekAverage = lastWeekEntries.length > 0
          ? lastWeekEntries.reduce((sum, entry) => sum + entry.rating, 0) / lastWeekEntries.length
          : 0
        
        const trendValue = weeklyAverage - lastWeekAverage
        const trend = trendValue >= 0 ? `+${trendValue.toFixed(1)}` : `${trendValue.toFixed(1)}`
        
        setStats({
          averageRating: Number(averageRating.toFixed(1)),
          weeklyAverage: Number(weeklyAverage.toFixed(1)),
          monthlyAverage: Number(monthlyAverage.toFixed(1)),
          trend,
          totalEntries: moodEntries.length
        })
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas de humor:', err)
        setError('Erro ao carregar dados de humor')
      } finally {
        setLoading(false)
      }
    }

    fetchMoodStats()
  }, [userId])

  return { stats, loading, error }
}
