"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  DollarSign,
  Heart,
  TrendingUp,
  Calendar,
  Zap,
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useUserData } from "@/hooks/useUserData"
import { useDashboardHabits } from "@/hooks/useDashboardHabits"
import { useFinanceStats } from "@/hooks/useFinanceStats"
import { useMoodStats } from "@/hooks/useMoodStats"
import { useTaskStats } from "@/hooks/useTaskStats"
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user } = useAuth()
  const { userData, loading: userLoading } = useUserData()
  const { todayProgress, todayHabits, loading: habitsLoading } = useDashboardHabits(user?.uid)
  const { stats: financeStats, loading: financeLoading } = useFinanceStats(user?.uid)
  const { stats: moodStats, loading: moodLoading } = useMoodStats(user?.uid)
  const { stats: taskStats, loading: taskLoading } = useTaskStats(user?.uid)
  const { toast } = useToast()

  const userName = userData?.displayName?.split(" ")[0] || 
                   user?.displayName?.split(" ")[0] || 
                   user?.email?.split("@")[0] || 
                   "Usuário"

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  // Função para marcar/desmarcar hábito
  const toggleHabit = async (habitId: string) => {
    if (!user?.uid) return
    
    try {
      const today = new Date().toISOString().split('T')[0]
      const logRef = doc(db, `habitLogs/${user.uid}/logs/${today}`)
      
      // Encontrar o hábito atual
      const currentHabit = todayHabits.find(h => h.id === habitId)
      if (!currentHabit) return
      
      const isCompleted = !currentHabit.completed
      
      // Atualizar o log do hábito
      await setDoc(logRef, {
        date: today,
        logs: {
          [habitId]: {
            completed: isCompleted,
            completedAt: isCompleted ? serverTimestamp() : null
          }
        }
      }, { merge: true })
      
      toast({
        title: isCompleted ? "Hábito completado!" : "Hábito desmarcado",
        description: `${currentHabit.name} foi ${isCompleted ? 'marcado como completo' : 'desmarcado'}.`,
      })
      
      // Recarregar a página para atualizar os dados
      window.location.reload()
    } catch (error) {
      console.error('Erro ao atualizar hábito:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o hábito. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  // Loading state
  if (userLoading || habitsLoading || financeLoading || moodLoading || taskLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  // Estatísticas com dados reais
  const stats = [
    {
      title: "Hábitos Hoje",
      value: todayProgress.total > 0 ? `${todayProgress.completed}/${todayProgress.total}` : "0/0",
      description: todayProgress.total > 0 ? `${todayProgress.total - todayProgress.completed} restantes` : "Nenhum hábito cadastrado",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: todayProgress.percentage,
    },
    {
      title: "Saldo Atual",
      value: `R$ ${financeStats.currentBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      description: financeStats.monthlyChangePercentage !== 0 ? `${financeStats.trend} este mês` : "Sem movimentação",
      icon: DollarSign,
      color: financeStats.currentBalance >= 0 ? "text-green-600" : "text-red-600",
      bgColor: financeStats.currentBalance >= 0 ? "bg-green-100" : "bg-red-100",
      trend: financeStats.trend,
    },
    {
      title: "Humor Médio",
      value: moodStats.averageRating > 0 ? `${moodStats.averageRating}/10` : "0/10",
      description: moodStats.totalEntries > 0 ? "Baseado em suas anotações" : "Nenhuma anotação",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: moodStats.trend !== '+0.0' ? moodStats.trend : null,
    },
    {
      title: "Tarefas Pendentes",
      value: taskStats.pendingTasks.toString(),
      description: taskStats.overdueTasks > 0 ? `${taskStats.overdueTasks} em atraso` : "Tudo em dia",
      icon: Clock,
      color: taskStats.overdueTasks > 0 ? "text-orange-600" : "text-green-600",
      bgColor: taskStats.overdueTasks > 0 ? "bg-orange-100" : "bg-green-100",
      badge: taskStats.completedToday > 0 ? `${taskStats.completedToday} hoje` : null,
    },
  ]

  // Insights personalizados baseados nos dados reais
  const insights = []
  
  if (todayProgress.total > 0 && todayProgress.percentage < 50) {
    insights.push({
      title: "Foco nos Hábitos",
      description: `Você completou apenas ${todayProgress.completed} de ${todayProgress.total} hábitos hoje. Que tal dar uma olhada nos pendentes?`,
      type: "warning",
    })
  }

  if (financeStats.currentBalance < 0) {
    insights.push({
      title: "Atenção às Finanças",
      description: "Seu saldo está negativo. Considere revisar seus gastos recentes.",
      type: "warning",
    })
  }

  if (todayProgress.percentage === 100 && todayProgress.total > 0) {
    insights.push({
      title: "Parabéns!",
      description: "Você completou todos os seus hábitos hoje. Continue assim!",
      type: "success",
    })
  }

  if (moodStats.averageRating >= 8) {
    insights.push({
      title: "Humor Excelente",
      description: `Seu humor médio está em ${moodStats.averageRating}/10. Você está indo muito bem!`,
      type: "success",
    })
  }

  // Se não há insights, mostrar uma mensagem motivacional
  if (insights.length === 0) {
    insights.push({
      title: "Bem-vindo ao Planly!",
      description: "Comece adicionando alguns hábitos e registrando suas atividades para receber insights personalizados.",
      type: "info",
    })
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getGreeting()}, {userName}! 👋
        </h1>
        <p className="text-gray-600">Aqui está um resumo do seu progresso hoje</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">{stat.description}</p>
                {stat.badge && <Badge className="bg-yellow-100 text-yellow-800 text-xs">{stat.badge}</Badge>}
                {stat.trend && <span className="text-xs text-green-600 font-medium">{stat.trend}</span>}
              </div>
              {stat.progress && <Progress value={stat.progress} className="mt-2 h-2" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habits */}
        <Card className="lg:col-span-2 bg-white border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Hábitos de Hoje</CardTitle>
                <CardDescription className="text-gray-600">Acompanhe seu progresso diário</CardDescription>
              </div>
              <Link href="/dashboard/habits">
                <Button size="sm" variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayHabits.length > 0 ? (
                todayHabits.map((habit, index) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center cursor-pointer ${
                          habit.completed ? "bg-green-500" : "bg-gray-300"
                        }`}
                        onClick={() => toggleHabit(habit.id)}
                      >
                        {habit.completed && <CheckCircle className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className={`font-medium ${habit.completed ? "text-gray-900" : "text-gray-600"}`}>
                          {habit.name}
                        </p>
                        <p className="text-sm text-gray-500">{habit.time}</p>
                      </div>
                    </div>
                    {!habit.completed && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => toggleHabit(habit.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Nenhum hábito cadastrado</p>
                  <p className="text-sm text-gray-400">Crie seus primeiros hábitos para começar!</p>
                  <Link href="/dashboard/habits">
                    <Button size="sm" className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Hábito
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Próximas Tarefas</CardTitle>
            <CardDescription className="text-gray-600">Agenda do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taskStats.upcomingTasks.length > 0 ? (
                taskStats.upcomingTasks.map((task, index) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')} às {new Date(task.dueDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Nenhuma tarefa próxima</p>
                  <p className="text-sm text-gray-400">Adicione tarefas para organizar seu dia</p>
                </div>
              )}
              <Link href="/dashboard/tasks">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Calendar className="mr-2 h-4 w-4" />
                  {taskStats.upcomingTasks.length > 0 ? 'Ver Todas as Tarefas' : 'Adicionar Tarefa'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Insights da IA
          </CardTitle>
          <CardDescription className="text-gray-600">Descobertas personalizadas sobre seus hábitos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === "success" 
                    ? "bg-green-50 border-green-500" 
                    : insight.type === "warning"
                    ? "bg-yellow-50 border-yellow-500"
                    : "bg-blue-50 border-blue-500"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {insight.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : insight.type === "warning" ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900">{insight.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/ai-chat">
            <Button className="w-full mt-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Mais Insights
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/habits">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Adicionar Hábito</h3>
              <p className="text-sm text-gray-600 mt-1">Crie um novo hábito</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/finance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Lançar Gasto</h3>
              <p className="text-sm text-gray-600 mt-1">Registre uma transação</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/health">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200">
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Registrar Humor</h3>
              <p className="text-sm text-gray-600 mt-1">Como você está hoje?</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}