"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authData = localStorage.getItem("planly_auth")

    if (!authData) {
      router.push("/auth/login?redirect=/dashboard")
      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-gray-50">
          {/* Sidebar - Fixed positioning */}
          <AppSidebar />

          {/* Main content area */}
          <SidebarInset className="flex-1">
            <div className="flex flex-col min-h-screen">
              {/* Header */}
              <Header />

              {/* Main content */}
              <main className="flex-1 p-6">
                <div className="max-w-7xl mx-auto">{children}</div>
              </main>
            </div>
          </SidebarInset>
        </div>
        <Toaster />
      </SidebarProvider>
    </ThemeProvider>
  )
}
