"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function VerifyEmailPage() {
  const [isVerified, setIsVerified] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const { user, loading, resendEmailVerification } = useAuth()

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





  const handleResend = async () => {
    if (!canResend || !user) return

    setIsResending(true)

    try {
      await resendEmailVerification()
      startCountdown()

      toast({
        title: "Email de verificação reenviado!",
        description: "Verifique sua caixa de entrada e spam.",
      })
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar email",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
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
              {userName ? `Olá ${userName.split(" ")[0]}, ` : ""}
              Enviamos um código de verificação para
            </p>
            <p className="font-medium text-gray-900">{userEmail || "seu email"}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code-0" className="text-gray-700">
                Código de verificação
              </Label>
              <div className="flex justify-between gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-lg font-medium"
                    maxLength={1}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isLoading || verificationCode.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              Não recebeu o código?{" "}
              <Button
                variant="link"
                onClick={handleResend}
                disabled={!canResend || isLoading}
                className="p-0 h-auto text-blue-600 hover:text-blue-500"
              >
                {canResend ? "Reenviar" : <>Reenviar em {countdown}s</>}
              </Button>
            </div>

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
