"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { Header } from "@/components/dashboard/header"
import { FloatingActionButton } from "@/components/dashboard/floating-action-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 pb-20 lg:pb-4">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  )
}
