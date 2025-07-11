"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  children: ReactNode
  className?: string
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50",
        "flex items-center justify-center p-4",
        className,
      )}
    >
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
