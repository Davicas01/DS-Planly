"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Target, DollarSign, Heart, Brain, ChevronRight, ChevronLeft, Check, Zap, TrendingUp, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { setCookie, deleteCookie } from "cookies-next"
import { markOnboardingComplete } from "@/lib/user-status"

interface OnboardingData {
  name: string
  goals: string[]
  habits: string[]
  financialGoal: string
  healthFocus: string[]
  notifications: boolean
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    name: "",
    goals: [],
    habits: [],
    financialGoal: "",
    healthFocus: [],
    notifications: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to save onboarding data
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Save to localStorage for demo
      localStorage.setItem(
        "planly_onboarding",
        JSON.stringify({
          ...data,
          completedAt: new Date().toISOString(),
        }),
      )

      // Mark onboarding as complete using our utility function
      markOnboardingComplete(data)

      // Remove the incomplete flag
      deleteCookie('planly_onboarding_incomplete')

      toast({
        title: "Configuração concluída!",
        description: "Bem-vindo ao Planly. Vamos começar sua jornada!",
      })

      // Redirecionar imediatamente para o dashboard
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Erro na configuração",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item))
    } else {
      setter([...array, item])
    }
  }

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-2xl">👋</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Planly!</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Vamos personalizar sua experiência em alguns passos simples
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Como você gostaria de ser chamado?</Label>
          <Input
            id="name"
            placeholder="Seu nome"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="text-lg"
          />
        </div>

        <div className="space-y-4">
          <Label>Quais são seus principais objetivos?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "habits", label: "Criar hábitos saudáveis", icon: Target },
              { id: "finance", label: "Organizar finanças", icon: DollarSign },
              { id: "health", label: "Melhorar saúde", icon: Heart },
              { id: "productivity", label: "Ser mais produtivo", icon: Brain },
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={data.goals.includes(id) ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => toggleArrayItem(data.goals, id, (goals) => setData({ ...data, goals }))}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm text-center">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
          <Target className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Configure suas metas</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Vamos definir alguns objetivos iniciais para você começar
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Que hábitos você gostaria de desenvolver?</Label>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Exercitar-se",
              "Ler mais",
              "Meditar",
              "Beber água",
              "Dormir cedo",
              "Estudar",
              "Caminhar",
              "Cozinhar",
            ].map((habit) => (
              <Button
                key={habit}
                variant={data.habits.includes(habit) ? "default" : "outline"}
                className="h-12"
                onClick={() => toggleArrayItem(data.habits, habit, (habits) => setData({ ...data, habits }))}
              >
                {habit}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="financial-goal">Meta financeira mensal (opcional)</Label>
          <Input
            id="financial-goal"
            placeholder="Ex: Economizar R$ 500"
            value={data.financialGoal}
            onChange={(e) => setData({ ...data, financialGoal: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <Label>Áreas de saúde que você quer focar:</Label>
          <div className="grid grid-cols-2 gap-3">
            {["Humor", "Sono", "Hidratação", "Peso", "Energia", "Estresse"].map((focus) => (
              <Button
                key={focus}
                variant={data.healthFocus.includes(focus) ? "default" : "outline"}
                className="h-12"
                onClick={() =>
                  toggleArrayItem(data.healthFocus, focus, (healthFocus) => setData({ ...data, healthFocus }))
                }
              >
                {focus}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto">
          <Zap className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Tutorial Interativo</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">Conheça os principais recursos do Planly</p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Dashboard Unificado</CardTitle>
                  <p className="text-sm text-gray-600">Veja tudo em um só lugar</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700">
                Acompanhe hábitos, finanças e saúde com widgets personalizáveis e insights da IA.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tracking Inteligente</CardTitle>
                  <p className="text-sm text-gray-600">Registre rapidamente</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700">
                Marque hábitos, adicione gastos e registre humor com poucos cliques.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">IA Contextual</CardTitle>
                  <p className="text-sm text-gray-600">Insights personalizados</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700">Descubra padrões e receba recomendações baseadas nos seus dados.</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Bell className="h-5 w-5 text-gray-600" />
            <Label className="font-medium">Notificações</Label>
          </div>
          <p className="text-sm text-gray-600 mb-3">Receba lembretes personalizados para manter seus hábitos em dia</p>
          <Button
            variant={data.notifications ? "default" : "outline"}
            size="sm"
            onClick={() => setData({ ...data, notifications: !data.notifications })}
          >
            {data.notifications ? "Ativado" : "Desativado"}
          </Button>
        </div>
      </div>
    </div>
  )

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.name.trim().length > 0 && data.goals.length > 0
      case 2:
        return data.habits.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="text-sm">
              Passo {currentStep} de {totalSteps}
            </Badge>
            <div className="text-sm text-gray-500">{Math.round(progress)}% concluído</div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              <span>{currentStep === totalSteps ? (isLoading ? "Finalizando..." : "Finalizar") : "Próximo"}</span>
              {currentStep === totalSteps ? <Check className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
