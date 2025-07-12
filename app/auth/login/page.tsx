
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { signIn, signInWithGoogle, user, loading, error } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      const redirectTo = searchParams.get('redirect') || '/dashboard'
      console.log('User authenticated, redirecting to:', redirectTo)
      
      // Use setTimeout to ensure state is fully updated
      setTimeout(() => {
        router.push(redirectTo)
      }, 100)
    }
  }, [user, loading, router, searchParams])

  const handleRedirectAfterLogin = () => {
    const redirectTo = searchParams.get('redirect') || '/dashboard'
    console.log('Login successful, redirecting to:', redirectTo)
    
    // Multiple redirect strategies for reliability
    setTimeout(() => {
      router.push(redirectTo)
    }, 100)
    
    // Fallback redirect
    setTimeout(() => {
      if (window.location.pathname === '/auth/login') {
        window.location.href = redirectTo
      }
    }, 1000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      })
      return
    }

    setIsLoggingIn(true)

    try {
      await signIn(email, password)
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      })

      // Wait for auth state to update before redirecting
      handleRedirectAfterLogin()
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Erro no login",
        description: error.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true)
    
    try {
      await signInWithGoogle()
      
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando...",
      })

      // Wait for auth state to update before redirecting
      handleRedirectAfterLogin()
    } catch (error: any) {
      console.error('Google login error:', error)
      toast({
        title: "Erro no login com Google",
        description: error.message || "Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoggingIn(true)
    
    try {
      // Use demo credentials
      await signIn("demo@planly.app", "demo123")
      
      toast({
        title: "Login demo realizado!",
        description: "Redirecionando para o dashboard...",
      })

      // Direct redirect for demo
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)
    } catch (error: any) {
      console.error('Demo login error:', error)
      toast({
        title: "Erro no login demo",
        description: "Tente criar uma conta demo primeiro.",
        variant: "destructive",
      })
    } finally {
      setIsLoggingIn(false)
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
            disabled={loading || isLoggingIn}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading || isLoggingIn ? "Entrando..." : "Entrar"}
          </Button>

          {/* Google Login Button */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || isLoggingIn}
            variant="outline"
            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading || isLoggingIn ? "Entrando..." : "Entrar com Google"}
          </Button>

          {/* Demo Button */}
          <Button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading || isLoggingIn}
            variant="outline"
            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading || isLoggingIn ? "Entrando..." : "Entrar como Demo"}
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
