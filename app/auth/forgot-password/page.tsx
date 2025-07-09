
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setIsEmailSent(true)
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email. Tente novamente.",
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {isEmailSent ? "Email enviado!" : "Esqueceu sua senha?"}
          </h1>
          <p className="text-gray-600 text-lg">
            {isEmailSent 
              ? "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha."
              : "Digite seu email para receber um link de recuperação"
            }
          </p>
        </div>

        {/* Form */}
        {!isEmailSent ? (
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

            {/* Send Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-lg transition-colors duration-200"
            >
              {isLoading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 text-base">
                Um email foi enviado para:
              </p>
              <p className="font-semibold text-gray-900 text-base">{email}</p>
            </div>
            <p className="text-gray-600 text-sm">
              Não recebeu o email? Verifique sua pasta de spam ou tente novamente.
            </p>
            <Button
              onClick={() => {
                setIsEmailSent(false)
                setEmail("")
              }}
              variant="outline"
              className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-base rounded-lg"
            >
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold hover:underline text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao login
          </Link>
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
