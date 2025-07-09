"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Loader2, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [error, setError] = useState("")

  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const startCountdown = () => {
    setCanResend(false)
    setCountdown(60)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email é obrigatório")
      return
    }

    if (!validateEmail(email)) {
      setError("Digite um email válido")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsEmailSent(true)
      startCountdown()

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada e spam.",
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      startCountdown()

      toast({
        title: "Email reenviado!",
        description: "Verifique sua caixa de entrada novamente.",
      })
    } catch (error) {
      toast({
        title: "Erro ao reenviar email",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-md border border-gray-200">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email enviado!</h1>
              <p className="text-gray-600 mt-2">Enviamos um link de recuperação para</p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Mail className="mx-auto h-10 w-10 text-blue-500 mb-3" />
                <p className="text-sm text-gray-600 leading-relaxed">
                  Verifique sua caixa de entrada e pasta de spam. O link de recuperação expira em 15 minutos.
                </p>
              </div>

              <Button
                variant="outline"
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className="w-full bg-transparent"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : canResend ? (
                  "Reenviar email"
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Reenviar em {countdown}s
                  </>
                )}
              </Button>

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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Esqueceu sua senha?</h1>
            <p className="text-gray-600 mt-2 text-sm">Não se preocupe, vamos te ajudar a recuperar o acesso</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError("")
                  }}
                  className={cn("pl-10", error && "border-red-500 focus-visible:ring-red-500")}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>
          </form>

          <div className="text-center">
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
