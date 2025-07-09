"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Download, 
  Trash2,
  Settings as SettingsIcon,
  Moon,
  Sun
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const [userSettings, setUserSettings] = useState({
    name: "Usuário Demo",
    email: "demo@planly.app",
    notifications: {
      habits: true,
      finance: true,
      health: true,
      insights: true
    },
    privacy: {
      dataCollection: true,
      analytics: false
    }
  })

  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados serão enviados por email em breve.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Conta excluída",
      description: "Sua conta foi excluída permanentemente.",
      variant: "destructive"
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
      </div>

      {/* Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={userSettings.name}
                onChange={(e) => setUserSettings({
                  ...userSettings,
                  name: e.target.value
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={userSettings.email}
                onChange={(e) => setUserSettings({
                  ...userSettings,
                  email: e.target.value
                })}
              />
            </div>
          </div>
          <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
        </CardContent>
      </Card>

      {/* Tema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Aparência</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Tema</Label>
              <p className="text-sm text-gray-600">Escolha entre modo claro ou escuro</p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificações</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Lembretes de hábitos</Label>
              <p className="text-sm text-gray-600">Receba lembretes para completar seus hábitos</p>
            </div>
            <Switch
              checked={userSettings.notifications.habits}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: { ...userSettings.notifications, habits: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Alertas financeiros</Label>
              <p className="text-sm text-gray-600">Notificações sobre gastos e metas</p>
            </div>
            <Switch
              checked={userSettings.notifications.finance}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: { ...userSettings.notifications, finance: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Lembretes de saúde</Label>
              <p className="text-sm text-gray-600">Lembretes para registrar dados de saúde</p>
            </div>
            <Switch
              checked={userSettings.notifications.health}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: { ...userSettings.notifications, health: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Insights da IA</Label>
              <p className="text-sm text-gray-600">Receba insights personalizados</p>
            </div>
            <Switch
              checked={userSettings.notifications.insights}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                notifications: { ...userSettings.notifications, insights: checked }
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacidade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacidade e Dados</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Coleta de dados</Label>
              <p className="text-sm text-gray-600">Permitir coleta de dados para melhorar o serviço</p>
            </div>
            <Switch
              checked={userSettings.privacy.dataCollection}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                privacy: { ...userSettings.privacy, dataCollection: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Analytics</Label>
              <p className="text-sm text-gray-600">Compartilhar dados anônimos de uso</p>
            </div>
            <Switch
              checked={userSettings.privacy.analytics}
              onCheckedChange={(checked) => setUserSettings({
                ...userSettings,
                privacy: { ...userSettings.privacy, analytics: checked }
              })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Exportar dados</Label>
              <p className="text-sm text-gray-600">Baixe uma cópia de todos os seus dados</p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plano */}
      <Card>
        <CardHeader>
          <CardTitle>Plano Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-100 text-blue-700">Gratuito</Badge>
                <span className="font-medium">Plano Gratuito</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                3 hábitos ativos • 30 dias de histórico • 10 perguntas IA/dia
              </p>
            </div>
            <Button>Fazer Upgrade</Button>
          </div>
        </CardContent>
      </Card>

      {/* Zona de Perigo */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Zona de Perigo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium text-red-600">Excluir conta</Label>
              <p className="text-sm text-gray-600">
                Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}