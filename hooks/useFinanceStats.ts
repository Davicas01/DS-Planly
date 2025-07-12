'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { getFirebaseFirestore } from '@/lib/firebaseClient'

interface Transaction {
  id: string
  amount: number
  type: 'expense' | 'income'
  category: string
  description: string
  date: string
  createdAt: any
}

interface FinanceStats {
  currentBalance: number
  monthlyChange: number
  monthlyChangePercentage: number
  totalIncome: number
  totalExpenses: number
  trend: string
}

export const useFinanceStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<FinanceStats>({
    currentBalance: 0,
    monthlyChange: 0,
    monthlyChangePercentage: 0,
    totalIncome: 0,
    totalExpenses: 0,
    trend: '+0%'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchFinanceStats = async () => {
      try {
        setLoading(true)
        
        // Debug do Firestore - ANTES de usar collection()
        console.log('=== DEBUG FIRESTORE FINANCE ===');
        
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
        
        // Buscar transações do usuário
        const transactionsRef = collection(db, `finances/${userId}/transactions`)
        const q = query(transactionsRef, orderBy('date', 'desc'), limit(1000))
        const snapshot = await getDocs(q)
        
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[]

        // Calcular estatísticas
        let totalIncome = 0
        let totalExpenses = 0
        let currentMonthIncome = 0
        let currentMonthExpenses = 0
        let lastMonthIncome = 0
        let lastMonthExpenses = 0
        
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
        
        transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.date)
          const transactionMonth = transactionDate.getMonth()
          const transactionYear = transactionDate.getFullYear()
          
          if (transaction.type === 'income') {
            totalIncome += transaction.amount
            
            if (transactionMonth === currentMonth && transactionYear === currentYear) {
              currentMonthIncome += transaction.amount
            }
            
            if (transactionMonth === lastMonth && transactionYear === lastMonthYear) {
              lastMonthIncome += transaction.amount
            }
          } else {
            totalExpenses += transaction.amount
            
            if (transactionMonth === currentMonth && transactionYear === currentYear) {
              currentMonthExpenses += transaction.amount
            }
            
            if (transactionMonth === lastMonth && transactionYear === lastMonthYear) {
              lastMonthExpenses += transaction.amount
            }
          }
        })
        
        const currentBalance = totalIncome - totalExpenses
        const currentMonthBalance = currentMonthIncome - currentMonthExpenses
        const lastMonthBalance = lastMonthIncome - lastMonthExpenses
        
        let monthlyChangePercentage = 0
        if (lastMonthBalance !== 0) {
          monthlyChangePercentage = ((currentMonthBalance - lastMonthBalance) / Math.abs(lastMonthBalance)) * 100
        } else if (currentMonthBalance > 0) {
          monthlyChangePercentage = 100
        }
        
        const trend = monthlyChangePercentage >= 0 ? `+${monthlyChangePercentage.toFixed(1)}%` : `${monthlyChangePercentage.toFixed(1)}%`
        
        setStats({
          currentBalance,
          monthlyChange: currentMonthBalance - lastMonthBalance,
          monthlyChangePercentage,
          totalIncome,
          totalExpenses,
          trend
        })
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas financeiras:', err)
        setError('Erro ao carregar dados financeiros')
      } finally {
        setLoading(false)
      }
    }

    fetchFinanceStats()
  }, [userId])

  return { stats, loading, error }
}
