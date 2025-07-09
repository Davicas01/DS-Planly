"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Check, Calendar, TrendingUp, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface Habit {
  id: string
  name: string
  category: string
  streak: number
  completed: boolean
  target: number
  current: number
  color: string
  icon: string
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      name: "Exercitar-se",
      category: "Saúde",
      streak: 23,
      completed: true,
      target: 1,
      current: 1,
      color: "bg-green-500",
      icon: "💪",
    },
    {
      id: "2",
      name: "Ler 30 minutos",
      category: "Produtividade",
      streak: 12,
      completed: false,
      target: 30,
      current: 15,
      color: "bg-blue-500",
      icon: "📚",
    },
    {
      id: "3",
      name: "Meditar",
      category: "Bem-estar",
      streak: 8,
      completed: true,
      target: 1,
      current: 1,
      color: "bg-purple-500",
      icon: "🧘‍♀️",
    },
    {
      id: "4",
      name: "Beber 2L de água",
      category: "Saúde",
      streak: 15,
      completed: false,
      target: 8,
      current: 5,
      color: "bg-cyan-500",
      icon: "💧",
    },
  ])

  const toggleHabit = (id: string) => {
    setHabits(habits.map((habit) => (habit.id === id ? { ...habit, completed: !habit.completed } : habit)))
  }

  const completedToday = habits.filter((h) => h.completed).length
  const totalHabits = habits.length
  const completionRate = Math.round((completedToday / totalHabits) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hábitos</h1>
          <p className="text-gray-600">Construa uma rotina que transforma</p>
        </div>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Novo Hábito
        </Button>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Progresso de Hoje</h3>
              <p className="text-sm text-gray-600">
                {completedToday} de {totalHabits} hábitos completos
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-500">{completionRate}%</div>
              <p className="text-sm text-gray-600">Taxa de conclusão</p>
            </div>
          </div>
          <Progress value={completionRate} className="h-3" />
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className={cn(
              "transition-all duration-200 hover:shadow-md",
              habit.completed && "bg-green-50 border-green-200",
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    size="icon"
                    variant={habit.completed ? "default" : "outline"}
                    className={cn("h-12 w-12 rounded-full", habit.completed && "bg-green-500 hover:bg-green-600")}
                    onClick={() => toggleHabit(habit.id)}
                  >
                    {habit.completed ? <Check className="h-6 w-6" /> : <span className="text-xl">{habit.icon}</span>}
                  </Button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className={cn("font-semibold", habit.completed && "line-through text-gray-500")}>
                        {habit.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {habit.category}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>🔥</span>
                        <span>{habit.streak} dias</span>
                      </div>

                      {habit.target > 1 && (
                        <div className="flex items-center space-x-2">
                          <span>
                            {habit.current}/{habit.target}
                          </span>
                          <div className="w-20">
                            <Progress value={(habit.current / habit.target) * 100} className="h-2" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Visão Semanal</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{day}</div>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    index < 5 ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500",
                  )}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Completo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span>Pendente</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>71% esta semana</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
