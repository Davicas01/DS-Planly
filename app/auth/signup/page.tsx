"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowLeft,
  ArrowRight,
  Chrome,
  Apple,
  Target,
  DollarSign,
  Heart,
  Zap,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  objectives: string[]
  timezone: string
  notifications: boolean
  theme: "light" | "dark" | "system"
  acceptTerms: boolean
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    objectives: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: true,
    theme: "system",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()
  const { toast } = useToast()

  const objectives = [
    { id: "habits", label: "Criar hábitos saudáveis", icon: Target, color: "bg-blue-100 text-blue-700" },
    { id: "finance", label: "Organizar minhas finanças", icon: DollarSign, color: "bg-green-100 text-green-700" },
    { id: "health", label: "Cuidar da minha saúde", icon: Heart, color: "bg-red-100 text-red-700" },
    { id: "productivity", label: "Aumentar minha produtividade", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
  ]

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: "weak", color: "bg-red-500", text: "Fraca" }
    if (strength <= 3) return { level: "medium", color: "bg-yellow-500", text: "Média" }
    return { level: "strong", color: "bg-green-500", text: "Forte" }
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Digite um email válido"
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (formData.password.length < 8) {
      newErrors.password = "Senha deve ter pelo menos 8 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos para continuar"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleObjectiveToggle = (objectiveId: string) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.includes(objectiveId)
        ? prev.objectives.filter((id) => id !== objectiveId)
        : [...prev.objectives, objectiveId],
    }))
  }

  const handleSubmit = async () => {
    if (!validateStep3()) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Conta criada com sucesso!",
        description: "Redirecionando para verificação de email...",
      })

      // Store signup data
      localStorage.setItem(
        "planly_signup",
        JSON.stringify({
          email: formData.email,
          name: formData.name,
          objectives: formData.objectives,
        }),
      )

      setTimeout(() => {
        router.push("/auth/verify-email")
      }, 500)
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignup = (provider: string) => {
    toast({
      title: `Cadastro com ${provider}`,
      description: "Funcionalidade em desenvolvimento",
    })
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md border border-gray-200">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crie sua conta</h1>
            <p className="text-gray-600 mt-2 text-sm">Junte-se a milhares de pessoas que organizam melhor sua vida</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={(currentStep / 3) * 100} className="h-2" />
            <p className="text-sm text-gray-500">Etapa {currentStep} de 3</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Basic Data */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nome completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={cn("pl-10", errors.name && "border-red-500 focus-visible:ring-red-500")}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email Field */}
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
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={cn("pl-10", errors.email && "border-red-500 focus-visible:ring-red-500")}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
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
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className={cn("h-1 flex-1 rounded", passwordStrength.color)} />
                      <span className="text-xs text-gray-600">{passwordStrength.text}</span>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirmar senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={cn("pl-10 pr-10", errors.confirmPassword && "border-red-500 focus-visible:ring-red-500")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="h-3 w-3" />
                    <span className="text-xs">Senhas coincidem</span>
                  </div>
                )}
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Objectives */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Qual seu principal objetivo?</h3>
                <p className="text-sm text-gray-600">Selecione uma ou mais opções</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {objectives.map((objective) => {
                  const Icon = objective.icon
                  const isSelected = formData.objectives.includes(objective.id)

                  return (
                    <Card
                      key={objective.id}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:shadow-md border",
                        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "border-gray-200",
                      )}
                      onClick={() => handleObjectiveToggle(objective.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className={cn("p-2 rounded-lg", objective.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-gray-900">{objective.label}</span>
                          {isSelected && <Check className="h-5 w-5 text-blue-500 ml-auto" />}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Como podemos te ajudar melhor?</h3>
                <p className="text-sm text-gray-600">Configure suas preferências</p>
              </div>

              <div className="space-y-4">
                {/* Timezone */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Fuso horário</Label>
                  <Input
                    value={formData.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                    className="bg-gray-50"
                    readOnly
                  />
                  <p className="text-xs text-gray-500">Detectado automaticamente</p>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-700">Notificações</Label>
                    <p className="text-sm text-gray-600">Receber lembretes e insights</p>
                  </div>
                  <Checkbox
                    checked={formData.notifications}
                    onCheckedChange={(checked) => handleInputChange("notifications", checked)}
                  />
                </div>

                {/* Theme */}
                <div className="space-y-2">
                  <Label className="text-gray-700">Tema preferido</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "light", label: "Claro" },
                      { value: "dark", label: "Escuro" },
                      { value: "system", label: "Sistema" },
                    ].map((theme) => (
                      <Button
                        key={theme.value}
                        variant={formData.theme === theme.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange("theme", theme.value)}
                      >
                        {theme.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                      className={cn(errors.acceptTerms && "border-red-500")}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed text-gray-700">
                      Aceito os{" "}
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Termos de Uso
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Política de Privacidade
                      </Link>
                    </Label>
                  </div>
                  {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 1 || isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 text-white">
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600 text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            )}
          </div>

          {/* Social Signup - Only on Step 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  ou crie conta com
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleSocialSignup("Google")} className="w-full">
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={() => handleSocialSignup("Apple")} className="w-full">
                  <Apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                Entrar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
