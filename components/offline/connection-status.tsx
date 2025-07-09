"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine
      setIsOnline(online)

      // Show status badge when connection changes
      setShowStatus(true)
      setTimeout(() => setShowStatus(false), 3000)
    }

    // Set initial status
    setIsOnline(navigator.onLine)

    // Listen for connection changes
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  if (!showStatus) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center space-x-2 px-3 py-2">
        {isOnline ? (
          <>
            <Wifi className="h-4 w-4" />
            <span>Online</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4" />
            <span>Offline</span>
          </>
        )}
      </Badge>
    </div>
  )
}
