"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, DollarSign, Heart, Zap, Brain, Calendar, Clock, Award } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bem-vinda de volta, Ana! 🌟</h1>
        <p className="opacity-90">Você está indo muito bem! Vamos continuar essa jornada.</p>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resumo Diário */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumo Diário</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${70 * 2.51} ${100 * 2.51}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">70%</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">7 de 10 hábitos completos</p>
              <Badge className="mt-2 bg-green-100 text-green-700">Ótimo progresso!</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Saldo Atual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 2.847,50</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% este mês
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receitas</span>
                <span className="font-medium text-green-600">R$ 4.200</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gastos</span>
                <span className="font-medium text-red-600">R$ 1.352,50</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood & Health */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humor & Saúde</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="text-3xl mb-1">😊</div>
                <p className="text-sm text-muted-foreground">Humor</p>
                <p className="font-semibold">8/10</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1">😴</div>
                <p className="text-sm text-muted-foreground">Sono</p>
                <p className="font-semibold">7h 30m</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Energia</span>
                <span className="font-medium">Alta</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Streak Record */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak Record</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🔥</div>
                <div className="text-3xl font-bold text-orange-500">23</div>
                <p className="text-sm text-muted-foreground">dias consecutivos</p>
              </div>
            </div>
            <div className="text-center">
              <Badge className="bg-orange-100 text-orange-700">Recorde pessoal!</Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Insights da IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Padrão Identificado</h3>
                  <p className="text-sm text-purple-700 mb-3">
                    Seus gastos com alimentação aumentam 25% nos dias em que você não pratica exercícios. Que tal manter
                    a rotina de exercícios para economizar e se sentir melhor?
                  </p>
                  <Badge className="bg-purple-100 text-purple-700">Economia potencial: R$ 180/mês</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Esta semana</p>
                <p className="font-semibold">6 dias ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tempo médio</p>
                <p className="font-semibold">45 min/dia</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Produtividade</p>
                <p className="font-semibold">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Melhoria</p>
                <p className="font-semibold">+15%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
