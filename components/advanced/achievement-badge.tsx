"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star, Flame, Target, Award, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  unlockedAt?: Date
  progress?: number
  maxProgress?: number
}

interface AchievementBadgeProps {
  achievement: Achievement
  size?: "sm" | "md" | "lg"
  showProgress?: boolean
}

export function AchievementBadge({ achievement, size = "md", showProgress = true }: AchievementBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      flame: Flame,
      target: Target,
      award: Award,
      zap: Zap,
    }
    const IconComponent = icons[iconName as keyof typeof icons] || Trophy
    return IconComponent
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "rare":
        return "from-blue-400 to-blue-600"
      case "epic":
        return "from-purple-400 to-purple-600"
      case "legendary":
        return "from-yellow-400 to-orange-500"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-16 h-16"
      case "lg":
        return "w-24 h-24"
      default:
        return "w-20 h-20"
    }
  }

  const IconComponent = getIcon(achievement.icon)
  const isUnlocked = !!achievement.unlockedAt
  const progressPercentage =
    achievement.progress && achievement.maxProgress ? (achievement.progress / achievement.maxProgress) * 100 : 0

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 cursor-pointer",
        isHovered && "scale-105 shadow-lg",
        !isUnlocked && "opacity-60 grayscale",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4 text-center">
        <div
          className={cn(
            "mx-auto rounded-full bg-gradient-to-br flex items-center justify-center mb-3",
            getSizeClasses(),
            getRarityColor(achievement.rarity),
            isUnlocked && "animate-pulse",
          )}
        >
          <IconComponent
            className={cn("text-white", size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8")}
          />
        </div>

        <h3 className={cn("font-semibold text-gray-900 mb-1", size === "sm" ? "text-xs" : "text-sm")}>
          {achievement.title}
        </h3>

        <p className={cn("text-gray-600 mb-2", size === "sm" ? "text-xs" : "text-xs")}>{achievement.description}</p>

        <Badge
          className={cn(
            "capitalize text-xs",
            achievement.rarity === "common" && "bg-gray-100 text-gray-700",
            achievement.rarity === "rare" && "bg-blue-100 text-blue-700",
            achievement.rarity === "epic" && "bg-purple-100 text-purple-700",
            achievement.rarity === "legendary" && "bg-yellow-100 text-yellow-700",
          )}
        >
          {achievement.rarity}
        </Badge>

        {showProgress && achievement.progress !== undefined && achievement.maxProgress && !isUnlocked && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {achievement.progress}/{achievement.maxProgress}
            </p>
          </div>
        )}

        {isUnlocked && achievement.unlockedAt && (
          <p className="text-xs text-green-600 mt-2">
            Desbloqueado em {achievement.unlockedAt.toLocaleDateString("pt-BR")}
          </p>
        )}
      </CardContent>

      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Star className="h-3 w-3 text-white fill-current" />
          </div>
        </div>
      )}
    </Card>
  )
}
