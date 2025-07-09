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
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [userName, setUserName] = useState("Usuário")

  useEffect(() => {
    // Get user data from auth
    const authData = localStorage.getItem("planly_auth")
    if (authData) {
      try {
        const { user } = JSON.parse(authData)
        if (user && user.name) {
          setUserName(user.name.split(" ")[0])
        }
      } catch (error) {
        console.error("Error parsing auth data:", error)
      }
    }
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const stats = [
    {
      title: "Hábitos Hoje",
      value: "7/10",
      description: "3 restantes",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: 70,
    },
    {
      title: "Saldo Atual",
      value: "R$ 2.847",
      description: "+12% este mês",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: "+12%",
    },
    {
      title: "Humor Médio",
      value: "8.2/10",
      description: "Excelente semana",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "+0.5",
    },
    {
      title: "Streak Record",
      value: "23 dias",
      description: "Melhor sequência",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      badge: "Recorde!",
    },
  ]

  const todayHabits = [
    { name: "Exercício", completed: true, time: "07:00" },
    { name: "Leitura", completed: true, time: "08:30" },
    { name: "Meditação", completed: true, time: "09:00" },
    { name: "Água (2L)", completed: false, time: "Durante o dia" },
    { name: "Estudar", completed: false, time: "19:00" },
  ]

  const upcomingTasks = [
    { title: "Revisar orçamento mensal", time: "14:00", type: "finance" },
    { title: "Consulta médica", time: "16:30", type: "health" },
    { title: "Planejar semana", time: "20:00", type: "planning" },
  ]

  const insights = [
    {
      title: "Padrão Identificado",
      description: "Você gasta 15% mais quando não faz exercícios. Que tal manter a rotina?",
      type: "warning",
    },
    {
      title: "Meta Alcançada",
      description: "Parabéns! Você completou 7 dias consecutivos de leitura.",
      type: "success",
    },
  ]

  return (
    <div className="space-y-6">
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
          <Card key={index} className="hover:shadow-lg transition-shadow">
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Hábitos de Hoje</CardTitle>
                <CardDescription>Acompanhe seu progresso diário</CardDescription>
              </div>
              <Link href="/dashboard/habits">
                <Button size="sm" variant="outline">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayHabits.map((habit, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        habit.completed ? "bg-green-500" : "bg-gray-300"
                      }`}
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
                    <Button size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Próximas Tarefas</CardTitle>
            <CardDescription>Agenda do dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.time}</p>
                  </div>
                </div>
              ))}
              <Link href="/dashboard/calendar">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Agenda Completa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Zap className="mr-2 h-5 w-5 text-yellow-500" />
            Insights da IA
          </CardTitle>
          <CardDescription>Descobertas personalizadas sobre seus hábitos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === "success" ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-500"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {insight.type === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
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
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Ver Mais Insights
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/habits">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Adicionar Hábito</h3>
              <p className="text-sm text-gray-600 mt-1">Crie um novo hábito</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/finance">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold text-gray-900">Lançar Gasto</h3>
              <p className="text-sm text-gray-600 mt-1">Registre uma transação</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/health">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
