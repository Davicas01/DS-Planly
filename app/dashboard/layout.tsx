"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AppSidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Handle redirect in useEffect to avoid render issues
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname))
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
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
            <div className="flex flex-col min-h-screen bg-white">
              {/* Header */}
              <Header />

              {/* Main content */}
              <main className="flex-1 p-6 bg-white">
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