"use client"

import { Home, Target, DollarSign, Heart, MessageCircle, Settings, User, HelpCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hábitos", href: "/dashboard/habits", icon: Target },
  { name: "Finanças", href: "/dashboard/finance", icon: DollarSign },
  { name: "Saúde", href: "/dashboard/health", icon: Heart },
  { name: "Chat IA", href: "/dashboard/ai-chat", icon: MessageCircle },
  { name: "Perfil", href: "/dashboard/profile", icon: User },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  { name: "Ajuda", href: "/dashboard/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem("planly_auth")

    toast({
      title: "Logout realizado com sucesso",
      description: "Redirecionando para a página inicial...",
    })

    // Redirect to home page
    setTimeout(() => {
      router.push("/")
    }, 500)
  }

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-2 px-4 py-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-xl text-gray-900">Planly</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 bg-white">
        <SidebarMenu>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                  <Link 
                    href={item.href} 
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                      isActive ? 'bg-blue-100 text-blue-600 font-medium' : ''
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 p-2 bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sair" className="w-full">
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Sair</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}