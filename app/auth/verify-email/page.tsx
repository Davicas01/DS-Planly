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

export default function VerifyEmailPage() {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get user data from signup
    const signupData = localStorage.getItem("planly_signup")
    if (signupData) {
      const { email, name } = JSON.parse(signupData)
      setUserEmail(email || "")
      setUserName(name || "")
    }
  }, [])

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

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    if (!/^\d*$/.test(value) && value !== "") {
      return
    }

    const newCode = [...verificationCode]
    newCode[index] = value
    setVerificationCode(newCode)

    // Auto-focus next input
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    if (!/^\d+$/.test(pastedData)) {
      return
    }

    const digits = pastedData.slice(0, 6).split("")
    const newCode = [...verificationCode]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit
      }
    })

    setVerificationCode(newCode)

    // Focus the next empty input or the last one
    for (let i = digits.length; i < 6; i++) {
      const nextInput = document.getElementById(`code-${i}`)
      if (nextInput) {
        nextInput.focus()
        break
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const code = verificationCode.join("")
    if (code.length !== 6) {
      toast({
        title: "Código incompleto",
        description: "Por favor, digite o código de 6 dígitos.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, any code is valid
      setIsVerified(true)

      toast({
        title: "Email verificado com sucesso!",
        description: "Redirecionando para o onboarding...",
      })

      setTimeout(() => {
        router.push("/onboarding")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erro na verificação",
        description: "Código inválido ou expirado. Tente novamente.",
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
        title: "Código reenviado!",
        description: "Verifique sua caixa de entrada.",
      })
    } catch (error) {
      toast({
        title: "Erro ao reenviar código",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
