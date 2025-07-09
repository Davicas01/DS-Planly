"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { user, loading } = useAuth()

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    // Redirect if email is already verified
    if (user && user.emailVerified) {
      router.push('/onboarding')
      return
    }

    // Check email verification status periodically
    const checkVerification = setInterval(async () => {
      if (user && user.emailVerified) {
        setIsVerified(true)
        clearInterval(checkVerification)
        
        toast({
          title: "Email verificado com sucesso!",
          description: "Redirecionando para o onboarding...",
        })

        setTimeout(() => {
          router.push('/onboarding')
        }, 2000)
      }
    }, 3000)

    return () => clearInterval(checkVerification)
  }, [user, loading, router, toast])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Carregando...</h1>
              <p className="text-gray-600 mt-2">Verificando status de autenticação...</p>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email verificado!</h1>
              <p className="text-gray-600 mt-2">Redirecionando para o onboarding...</p>
            </div>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <Mail className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Verifique seu email</h1>
            <p className="text-gray-600 mt-2 text-sm">
              Enviamos um link de verificação para seu email.
            </p>
            <p className="font-medium text-gray-900">{user?.email || "seu email"}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Clique no link enviado para seu email para verificar sua conta.
              Esta página será atualizada automaticamente quando a verificação for concluída.
            </p>

            <Link
              href="/auth/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
