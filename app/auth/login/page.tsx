
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Save mock auth data
      localStorage.setItem("planly_auth", JSON.stringify({
        user: { 
          id: "1", 
          name: "Usuario Demo", 
          email: email,
          onboardingCompleted: true 
        },
        token: "mock-token"
      }))

      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para o dashboard...",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setIsLoading(true)

    // Save demo auth data
    localStorage.setItem("planly_auth", JSON.stringify({
      user: { 
        id: "demo", 
        name: "Usuario Demo", 
        email: "demo@planly.app",
        onboardingCompleted: true 
      },
      token: "demo-token"
    }))

    setTimeout(() => {
      router.push("/dashboard")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Bem-vindo de volta</h1>
          <p className="text-gray-600 text-lg">Entre na sua conta para continuar</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium text-base">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11 h-12 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600 rounded-lg text-base"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium text-base">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600 rounded-lg text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              href="/auth/forgot-password" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-colors duration-200"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>

          {/* Demo Button */}
          <Button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base rounded-lg transition-colors duration-200"
          >
            Entrar como Demo
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            Não tem uma conta?{" "}
            <Link 
              href="/auth/signup" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            © 2024 Planly. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
