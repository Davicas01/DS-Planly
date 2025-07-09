"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

interface HeaderProps {
  onMenuClick?: () => void
}

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export function Header({ onMenuClick }: HeaderProps) {
  const [userName, setUserName] = useState("Usuário")
  const [userInitials, setUserInitials] = useState("U")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Get user data from auth
    const authData = localStorage.getItem("planly_auth")
    if (authData) {
      try {
        const { user } = JSON.parse(authData)
        if (user && user.name) {
          setUserName(user.name)

          // Get initials
          const names = user.name.split(" ")
          if (names.length > 1) {
            setUserInitials(`${names[0][0]}${names[names.length - 1][0]}`)
          } else if (names.length === 1) {
            setUserInitials(names[0].substring(0, 2))
          }
        }
      } catch (error) {
        console.error("Error parsing auth data:", error)
      }
    }

    // Mock notifications
    setNotifications([
      {
        id: "1",
        title: "Hábito completado!",
        message: "Parabéns! Você completou o hábito 'Exercitar-se' hoje.",
        time: "há 2 horas",
        read: false
      },
      {
        id: "2", 
        title: "Meta financeira",
        message: "Você está próximo da sua meta de economia mensal.",
        time: "há 4 horas",
        read: false
      },
      {
        id: "3",
        title: "Lembrete de saúde",
        message: "Não esqueça de registrar seu humor hoje!",
        time: "há 6 horas",
        read: true
      }
    ])
  }, [])

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("planly_auth")

    // Redirect to home page
    router.push("/")
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="lg:hidden" />

          <div className="hidden md:block">
            <p className="text-sm text-gray-500 capitalize">{currentDate}</p>
            <p className="font-medium text-gray-900">
              {getGreeting()}, {userName.split(" ")[0]}! 👋
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-gray-600 hover:text-gray-900"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-4 py-2 border-b">
                <h3 className="font-semibold text-gray-900">Notificações</h3>
              </div>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="px-4 py-3 cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                        <p className="text-gray-600 text-sm truncate">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="px-4 py-6 text-center text-gray-500">
                  Nenhuma notificação
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium text-gray-900">{userName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="font-medium text-gray-900">{userName}</p>
                <p className="text-sm text-gray-500">Minha Conta</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-gray-700">Perfil</DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700">Configurações</DropdownMenuItem>
              <DropdownMenuItem className="text-gray-700">Ajuda</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}