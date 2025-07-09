"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, Sparkles, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { TypingIndicator } from "@/components/chat/typing-indicator"
import { SuggestedQuestions } from "@/components/chat/suggested-questions"
import { ChatMessage } from "@/components/chat/chat-message"

interface Message {
  id: string
  type: "user" | "ai" | "insight" | "report"
  content: string
  timestamp: Date
  data?: any
  saved?: boolean
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Olá, Ana! 👋 Sou sua assistente IA do Planly. Analisei seus dados e tenho algumas observações interessantes sobre seus hábitos e finanças. O que gostaria de saber?",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "2",
      type: "insight",
      content: "Padrão Identificado: Correlação Exercício-Gastos",
      timestamp: new Date(Date.now() - 240000),
      data: {
        type: "correlation",
        title: "Exercício vs Gastos com Alimentação",
        insight:
          "Nos dias em que você se exercita, seus gastos com alimentação diminuem em média 23%. Isso representa uma economia potencial de R$ 180/mês!",
        chart: {
          type: "line",
          data: [
            { day: "Seg", exercise: true, food: 45 },
            { day: "Ter", exercise: false, food: 78 },
            { day: "Qua", exercise: true, food: 52 },
            { day: "Qui", exercise: true, food: 41 },
            { day: "Sex", exercise: false, food: 89 },
            { day: "Sáb", exercise: true, food: 38 },
            { day: "Dom", exercise: false, food: 95 },
          ],
        },
      },
    },
  ])

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (input: string): string => {
    const responses = [
      "Baseado nos seus dados, posso ver que você tem mantido uma consistência impressionante! Seus hábitos de exercício estão diretamente correlacionados com seu humor positivo.",
      "Analisando suas finanças, notei que você economiza mais quando mantém sua rotina de exercícios. Que tal definirmos uma meta de exercícios para otimizar seus gastos?",
      "Seus padrões de sono mostram uma melhoria de 15% nas últimas duas semanas. Isso está impactando positivamente sua energia e produtividade!",
      "Identifiquei que seus gastos com saúde aumentaram, mas isso está gerando um ROI positivo no seu bem-estar geral. Continue investindo em você!",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    inputRef.current?.focus()
  }

  const toggleSaveMessage = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, saved: !msg.saved } : msg)))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                  isOnline ? "bg-green-500" : "bg-gray-400",
                )}
              />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Planly IA</h1>
              <p className="text-sm text-gray-500">{isTyping ? "Digitando..." : isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-700">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} onSave={() => toggleSaveMessage(message.id)} />
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 max-w-xs shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      <SuggestedQuestions onSuggestionClick={handleSuggestionClick} />

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte sobre seus hábitos, finanças ou saúde..."
              className="pr-12 py-3 text-base"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-3"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
