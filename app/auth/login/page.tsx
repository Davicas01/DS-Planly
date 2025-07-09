"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Loader2, Mail, Lock, Chrome, Apple, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const { toast } = useToast()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }

    // Real-time email validation
    if (field === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: "Digite um email válido" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Digite um email válido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication logic - DEMO USER ADDED
      if (
        (formData.email === "demo@planly.com" && formData.password === "demo123") ||
        (formData.email === "demo" && formData.password === "demo")
      ) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        })

        // Store auth state
        localStorage.setItem(
          "planly_auth",
          JSON.stringify({
            user: { email: formData.email, name: "Usuário Demo" },
            token: "mock-jwt-token",
            rememberMe,
          }),
        )

        setTimeout(() => {
          router.push(redirect)
        }, 500)
      } else {
        throw new Error("Credenciais inválidas")
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente demo/demo para testar.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        name: "Usuário Demo",
        email: "demo@planly.com",
      }

      toast({
        title: "Login demo realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      })

      // Store auth state
      localStorage.setItem(
        "planly_auth",
        JSON.stringify({
          user: userData,
          token: "mock-demo-jwt-token",
          rememberMe: true,
        }),
      )

      setTimeout(() => {
        router.push(redirect)
      }, 500)
    } catch (error) {
      toast({
        title: "Erro ao fazer login demo",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const userData = {
        name: "Google User",
        email: "google@example.com",
      }

      toast({
        title: `Login com ${provider} realizado com sucesso!`,
        description: "Redirecionando para o dashboard...",
      })

      // Store auth state
      localStorage.setItem(
        "planly_auth",
        JSON.stringify({
          user: userData,
          token: "mock-google-jwt-token",
          rememberMe: true,
        }),
      )

      setTimeout(() => {
        router.push(redirect)
      }, 500)
    } catch (error) {
      toast({
        title: `Erro ao fazer login com ${provider}`,
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-600 mt-2 text-sm">Entre na sua conta para continuar organizando sua vida</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Demo Login Button - PROMINENT PLACEMENT */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 mb-3 font-medium">🎯 Teste rápido sem cadastro</p>
            <Button
              onClick={handleDemoLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
              disabled={isLoading}
            >
              <User className="mr-2 h-4 w-4" />
              Entrar como Demo
            </Button>
            <p className="text-xs text-blue-600 mt-2">Usuário: demo | Senha: demo</p>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              ou entre com sua conta
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={cn("pl-10", errors.email && "border-red-500 focus-visible:ring-red-500")}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={cn("pl-10 pr-10", errors.password && "border-red-500 focus-visible:ring-red-500")}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Lembrar de mim
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                ou continue com
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("Google")}
                disabled={isLoading}
                className="w-full"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("Apple")}
                disabled={isLoading}
                className="w-full"
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                Criar conta
              </Link>
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Termos de Uso
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
