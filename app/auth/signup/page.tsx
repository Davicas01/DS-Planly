
"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para o onboarding...",
      })

      // Save auth data
      localStorage.setItem("planly_auth", JSON.stringify({
        user: { 
          id: "new-user", 
          name: name, 
          email: email,
          onboardingCompleted: false 
        },
        token: "new-user-token"
      }))

      router.push("/onboarding")
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8">
            <span className="text-3xl font-bold text-white">P</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Criar sua conta</h1>
          <p className="text-gray-600 text-lg">Comece sua jornada no Planly</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium text-base">
              Nome completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-11 h-12 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600 rounded-lg text-base"
                required
              />
            </div>
          </div>

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

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium text-base">
              Confirmar senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-11 pr-11 h-12 bg-white border-gray-300 text-black placeholder:text-gray-500 focus:border-blue-600 focus:ring-blue-600 rounded-lg text-base"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-colors duration-200"
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-base">
            Já tem uma conta?{" "}
            <Link 
              href="/auth/login" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Fazer login
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
