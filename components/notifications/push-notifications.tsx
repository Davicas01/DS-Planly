"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, BellOff, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotificationSettings {
  habits: boolean
  finance: boolean
  health: boolean
  insights: boolean
}

export function PushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [settings, setSettings] = useState<NotificationSettings>({
    habits: true,
    finance: true,
    health: true,
    insights: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    // Check if notifications are supported
    if ("Notification" in window && "serviceWorker" in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }

    // Load saved settings
    const saved = localStorage.getItem("planly_notification_settings")
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return

    setIsLoading(true)

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)

      if (permission === "granted") {
        await subscribeToNotifications()
        toast({
          title: "Notificações ativadas!",
          description: "Você receberá lembretes personalizados.",
        })
      } else {
        toast({
          title: "Permissão negada",
          description: "Você pode ativar as notificações nas configurações do navegador.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast({
        title: "Erro ao ativar notificações",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready

      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        // Create new subscription
        const vapidKey =
          process.env.NEXT_PUBLIC_VAPID_KEY ||
          "BEl62iUYgUivxIkv69yViEuiBIa40HI6YUTpZrPfGrZmzwWWBSGVgNKSqU8xZzKx4N8XRuExUuDADzIDJpQVgQc"

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })
      }

      // Send subscription to server (mock for now)
      console.log("Push subscription:", subscription)

      // Save subscription to localStorage for demo
      localStorage.setItem("planly_push_subscription", JSON.stringify(subscription))
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      throw error
    }
  }

  const updateSettings = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("planly_notification_settings", JSON.stringify(newSettings))

    toast({
      title: "Configuração atualizada",
      description: `Notificações de ${key} ${value ? "ativadas" : "desativadas"}.`,
    })
  }

  const sendTestNotification = () => {
    if (permission === "granted") {
      new Notification("Planly - Teste", {
        body: "Esta é uma notificação de teste do Planly!",
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        vibrate: [100, 50, 100],
      })
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BellOff className="h-5 w-5" />
            <span>Notificações não suportadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Seu navegador não suporta notificações push.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Notificações Push</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {permission === "default" && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">Ative as notificações para receber lembretes personalizados</p>
            <Button onClick={requestPermission} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
              {isLoading ? "Ativando..." : "Ativar Notificações"}
            </Button>
          </div>
        )}

        {permission === "denied" && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <X className="h-5 w-5" />
              <span className="text-sm">Notificações bloqueadas</span>
            </div>
            <p className="text-sm text-gray-600">
              Para ativar, vá nas configurações do navegador e permita notificações para este site.
            </p>
          </div>
        )}

        {permission === "granted" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-green-600">
                <Check className="h-5 w-5" />
                <span className="text-sm font-medium">Notificações ativadas</span>
              </div>
              <Button variant="outline" size="sm" onClick={sendTestNotification}>
                Testar
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Tipos de notificação:</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="habits-notifications" className="text-sm">
                    Lembretes de hábitos
                  </Label>
                  <Switch
                    id="habits-notifications"
                    checked={settings.habits}
                    onCheckedChange={(checked) => updateSettings("habits", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="finance-notifications" className="text-sm">
                    Alertas financeiros
                  </Label>
                  <Switch
                    id="finance-notifications"
                    checked={settings.finance}
                    onCheckedChange={(checked) => updateSettings("finance", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="health-notifications" className="text-sm">
                    Lembretes de saúde
                  </Label>
                  <Switch
                    id="health-notifications"
                    checked={settings.health}
                    onCheckedChange={(checked) => updateSettings("health", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="insights-notifications" className="text-sm">
                    Insights da IA
                  </Label>
                  <Switch
                    id="insights-notifications"
                    checked={settings.insights}
                    onCheckedChange={(checked) => updateSettings("insights", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
