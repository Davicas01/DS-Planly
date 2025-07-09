"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bot, User, Bookmark, BookmarkCheck, Copy, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { InsightCard } from "./insight-card"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Message {
  id: string
  type: "user" | "ai" | "insight" | "report"
  content: string
  timestamp: Date
  data?: any
  saved?: boolean
}

interface ChatMessageProps {
  message: Message
  onSave: () => void
}

export function ChatMessage({ message, onSave }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ptBR })
  }

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
          <div className="text-xs text-gray-500 mb-1">{formatTime(message.timestamp)}</div>
          <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm p-4 shadow-sm">
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    )
  }

  if (message.type === "insight") {
    return (
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <InsightCard data={message.data} />
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">{formatTime(message.timestamp)}</div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className={cn("h-8 w-8 p-0", message.saved && "text-yellow-500")}
              >
                {message.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex items-start space-x-3"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 max-w-xs lg:max-w-md">
        <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm">
          <p className="text-sm text-gray-900 leading-relaxed">{message.content}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-gray-500">{formatTime(message.timestamp)}</div>

          <div
            className={cn("flex items-center space-x-1 transition-opacity", showActions ? "opacity-100" : "opacity-0")}
          >
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className={cn("h-8 w-8 p-0", message.saved && "text-yellow-500")}
            >
              {message.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
