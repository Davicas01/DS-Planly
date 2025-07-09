"use client"

import { useState } from "react"
import { Plus, Target, DollarSign, Heart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: Target, label: "Novo Hábito", color: "bg-green-500 hover:bg-green-600" },
    { icon: DollarSign, label: "Adicionar Gasto", color: "bg-red-500 hover:bg-red-600" },
    { icon: Heart, label: "Registrar Humor", color: "bg-pink-500 hover:bg-pink-600" },
  ]

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-4">
      {/* Action buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {actions.map((action, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center space-x-3 transform transition-all duration-300",
                isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span className="bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>
              <Button
                size="icon"
                className={cn("h-12 w-12 rounded-full shadow-lg", action.color)}
                onClick={() => setIsOpen(false)}
              >
                <action.icon className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  )
}
