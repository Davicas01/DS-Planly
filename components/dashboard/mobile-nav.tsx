"use client"

import { Home, Target, DollarSign, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Hábitos", href: "/dashboard/habits", icon: Target },
  { name: "Finanças", href: "/dashboard/finance", icon: DollarSign },
  { name: "Saúde", href: "/dashboard/health", icon: Heart },
  { name: "IA", href: "/dashboard/ai-chat", icon: MessageCircle },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 text-xs",
                isActive ? "text-blue-500 bg-blue-50" : "text-gray-500 hover:text-gray-700",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
