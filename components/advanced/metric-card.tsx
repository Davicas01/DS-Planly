"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  color?: "blue" | "green" | "red" | "yellow" | "purple"
  size?: "sm" | "md" | "lg"
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  trend,
  color = "blue",
  size = "md",
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />
      case "down":
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50"
      case "down":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getColorClasses = () => {
    switch (color) {
      case "green":
        return "text-green-600"
      case "red":
        return "text-red-600"
      case "yellow":
        return "text-yellow-600"
      case "purple":
        return "text-purple-600"
      default:
        return "text-blue-600"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          card: "p-3",
          title: "text-xs",
          value: "text-lg",
          change: "text-xs",
        }
      case "lg":
        return {
          card: "p-6",
          title: "text-base",
          value: "text-3xl",
          change: "text-sm",
        }
      default:
        return {
          card: "p-4",
          title: "text-sm",
          value: "text-2xl",
          change: "text-xs",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className={sizeClasses.card}>
        <div className="flex items-center justify-between mb-2">
          <p className={cn("font-medium text-gray-600", sizeClasses.title)}>{title}</p>
          {Icon && <Icon className={cn("h-4 w-4", getColorClasses())} />}
        </div>

        <div className="flex items-end justify-between">
          <div className={cn("font-bold text-gray-900", sizeClasses.value)}>{value}</div>

          {change !== undefined && (
            <Badge
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full border-0",
                getTrendColor(),
                sizeClasses.change,
              )}
            >
              {getTrendIcon()}
              <span>
                {change > 0 ? "+" : ""}
                {change}%
              </span>
            </Badge>
          )}
        </div>

        {changeLabel && <p className={cn("text-gray-500 mt-1", sizeClasses.change)}>{changeLabel}</p>}
      </CardContent>
    </Card>
  )
}
