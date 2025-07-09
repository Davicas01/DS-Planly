"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone,
  Edit,
  Camera,
  Trophy,
  Target,
  TrendingUp
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "Usuário Demo",
    email: "demo@planly.app",
    phone: "+55 (11) 99999-9999",
    location: "São Paulo, SP",
    bio: "Apaixonado por produtividade e bem-estar. Sempre buscando melhorar meus hábitos e qualidade de vida.",
    joinDate: "Janeiro 2024",
    avatar: ""
  })

  const [stats] = useState({
    totalHabits: 12,
    completedToday: 8,
    currentStreak: 23,
    totalDays: 45
  })

  const [achievements] = useState([
    { id: 1, name: "Primeira Semana", description: "Complete 7 dias consecutivos", earned: true },
    { id: 2, name: "Disciplinado", description: "Complete 30 dias consecutivos", earned: true },
    { id: 3, name: "Mestre dos Hábitos", description: "Complete 100 dias consecutivos", earned: false },
    { id: 4, name: "Equilibrado", description: "Use todos os módulos por 7 dias", earned: true },
  ])

  const { toast } = useToast()

  const handleSaveProfile = () => {
    // Aqui você salvaria no backend
    setIsEditing(false)
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    })
  }

  const handleAvatarChange = () => {
    // Aqui você implementaria o upload de avatar
    toast({
      title: "Avatar atualizado!",
      description: "Sua foto de perfil foi alterada.",
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e acompanhe seu progresso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Informações do Perfil */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={handleAvatarChange}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}</h3>
                  <p className="text-gray-600">{userProfile.email}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700">Ativo</Badge>
                </div>
              </div>

              {/* Campos do Perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={userProfile.location}
                    onChange={(e) => setUserProfile({...userProfile, location: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={userProfile.bio}
                  onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex space-x-3">
                  <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conquistas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Conquistas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}>
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Estatísticas */}
        <div className="space-y-6">
          {/* Estatísticas Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Estatísticas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.currentStreak}</div>
                <p className="text-sm text-gray-600">Dias consecutivos</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold text-gray-900">{stats.completedToday}</div>
                  <p className="text-xs text-gray-600">Hoje</p>
                </div>
                <div>
                  <div className="text-xl font-semibold text-gray-900">{stats.totalHabits}</div>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Membro desde</span>
                  <span className="font-medium">{userProfile.joinDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Dias ativos</span>
                  <span className="font-medium">{stats.totalDays}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Email verificado</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Membro desde {userProfile.joinDate}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{userProfile.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{userProfile.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle>Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <Badge className="bg-blue-100 text-blue-700">Gratuito</Badge>
                <p className="text-sm text-gray-600">
                  3 hábitos ativos<br />
                  30 dias de histórico<br />
                  10 perguntas IA/dia
                </p>
                <Button className="w-full" size="sm">
                  Fazer Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}