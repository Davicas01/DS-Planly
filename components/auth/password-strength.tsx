"use client"

import { cn } from "@/lib/utils"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const getStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: "weak", color: "bg-red-500", text: "Fraca", width: "33%" }
    if (strength <= 3) return { level: "medium", color: "bg-yellow-500", text: "Média", width: "66%" }
    return { level: "strong", color: "bg-green-500", text: "Forte", width: "100%" }
  }

  if (!password) return null

  const strength = getStrength(password)

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">Força da senha:</span>
        <span className="text-xs font-medium">{strength.text}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div
          className={cn("h-1 rounded-full transition-all duration-300", strength.color)}
          style={{ width: strength.width }}
        />
      </div>
    </div>
  )
}
