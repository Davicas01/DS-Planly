"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface HabitCalendarProps {
  habitId: string
  habitName: string
  data: Record<string, boolean>
  compact?: boolean
}

export function HabitCalendar({ habitId, habitName, data, compact = false }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      days.push({
        day,
        dateKey,
        completed: data[dateKey] || false,
        isToday: new Date().toDateString() === new Date(year, month, day).toDateString(),
      })
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getStreakCount = () => {
    const today = new Date()
    let streak = 0
    const currentDate = new Date(today)

    while (true) {
      const dateKey = currentDate.toISOString().split("T")[0]
      if (data[dateKey]) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }

  const getCompletionRate = () => {
    const totalDays = Object.keys(data).length
    const completedDays = Object.values(data).filter(Boolean).length
    return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0
  }

  const days = getDaysInMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm">{habitName}</h3>
            <div className="flex items-center space-x-2">
              <Badge className="bg-orange-100 text-orange-700">
                <Flame className="h-3 w-3 mr-1" />
                {getStreakCount()}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.slice(-14).map((day, index) => (
              <div
                key={index}
                className={cn(
                  "w-6 h-6 rounded-sm flex items-center justify-center text-xs",
                  day?.completed ? "bg-green-500 text-white" : "bg-gray-200",
                  day?.isToday && "ring-2 ring-blue-500",
                )}
              >
                {day?.day}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{habitName}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium capitalize">{monthYear}</span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{getStreakCount()} dias seguidos</span>
          </div>
          <div>
            <span className="text-gray-600">{getCompletionRate()}% de conclusão</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all hover:scale-105",
                !day && "invisible",
                day?.completed && "bg-green-500 text-white shadow-sm",
                !day?.completed && day && "bg-gray-100 text-gray-600 hover:bg-gray-200",
                day?.isToday && "ring-2 ring-blue-500",
              )}
            >
              {day?.day}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Não feito</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
