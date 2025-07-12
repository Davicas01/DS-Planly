'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { getFirebaseFirestore } from '@/lib/firebaseClient'

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  completed: boolean
  category: string
  createdAt: any
}

interface TaskStats {
  upcomingTasks: Task[]
  completedToday: number
  pendingTasks: number
  overdueTasks: number
}

export const useTaskStats = (userId: string | undefined) => {
  const [stats, setStats] = useState<TaskStats>({
    upcomingTasks: [],
    completedToday: 0,
    pendingTasks: 0,
    overdueTasks: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchTaskStats = async () => {
      try {
        setLoading(true)
        
        // Debug do Firestore - ANTES de usar collection()
        console.log('=== DEBUG FIRESTORE TASKS ===');
        
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
        
        // Buscar tarefas do usuário
        const tasksRef = collection(db, `tasks/${userId}/tasks`)
        const q = query(tasksRef, orderBy('dueDate', 'asc'), limit(100))
        const snapshot = await getDocs(q)
        
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[]

        // Calcular estatísticas
        const now = new Date()
        const today = now.toISOString().split('T')[0]
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        let completedToday = 0
        let pendingTasks = 0
        let overdueTasks = 0
        const upcomingTasks: Task[] = []
        
        tasks.forEach(task => {
          const taskDate = task.dueDate.split('T')[0]
          
          if (task.completed && taskDate === today) {
            completedToday++
          }
          
          if (!task.completed) {
            pendingTasks++
            
            if (taskDate < today) {
              overdueTasks++
            }
            
            // Tarefas para hoje e amanhã
            if (taskDate === today || taskDate === tomorrow) {
              upcomingTasks.push(task)
            }
          }
        })
        
        // Ordenar tarefas próximas por data
        upcomingTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        
        setStats({
          upcomingTasks: upcomingTasks.slice(0, 5), // Mostrar apenas 5 próximas
          completedToday,
          pendingTasks,
          overdueTasks
        })
        
      } catch (err) {
        console.error('Erro ao buscar estatísticas de tarefas:', err)
        setError('Erro ao carregar tarefas')
      } finally {
        setLoading(false)
      }
    }

    fetchTaskStats()
  }, [userId])

  return { stats, loading, error }
}
