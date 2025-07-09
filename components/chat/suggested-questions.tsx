"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, TrendingUp, DollarSign, Heart, Target } from "lucide-react"

interface SuggestedQuestionsProps {
  onSuggestionClick: (suggestion: string) => void
}

export function SuggestedQuestions({ onSuggestionClick }: SuggestedQuestionsProps) {
  const suggestions = [
    {
      icon: TrendingUp,
      text: "Como foi minha semana?",
      category: "geral",
    },
    {
      icon: DollarSign,
      text: "Por que gastei mais este mês?",
      category: "finanças",
    },
    {
      icon: Heart,
      text: "Que padrões você vê no meu humor?",
      category: "saúde",
    },
    {
      icon: Target,
      text: "Sugestões para melhorar meus hábitos?",
      category: "hábitos",
    },
    {
      icon: Sparkles,
      text: "Qual meu maior progresso recente?",
      category: "conquistas",
    },
  ]

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="mb-2">
        <p className="text-sm text-gray-600 font-medium">Perguntas sugeridas:</p>
      </div>
      <ScrollArea className="w-full">
        <div className="flex space-x-2 pb-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              className="flex items-center space-x-2 whitespace-nowrap bg-gray-50 hover:bg-gray-100 border-gray-200"
            >
              <suggestion.icon className="h-3 w-3" />
              <span className="text-sm">{suggestion.text}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
