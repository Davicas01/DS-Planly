"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
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

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [userName, setUserName] = useState("Usuário")
  const [userInitials, setUserInitials] = useState("U")
  const router = useRouter()

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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium text-gray-900">{userName}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Ajuda</DropdownMenuItem>
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
