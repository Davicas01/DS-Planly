"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WifiOff, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-xl border-0">
        <CardHeader className="pb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-10 w-10 text-gray-400" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Você está offline</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-gray-600">
            Não foi possível conectar à internet. Verifique sua conexão e tente novamente.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">Enquanto isso, você ainda pode:</p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Visualizar dados já carregados</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Marcar hábitos (sincroniza quando voltar online)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Adicionar transações financeiras</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
              <RefreshCw className="mr-2 h-4 w-4" />
              Tentar Novamente
            </Button>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full bg-transparent">
                <Home className="mr-2 h-4 w-4" />
                Ir para Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-xs text-gray-400 mt-6">
            Seus dados serão sincronizados automaticamente quando a conexão for restaurada
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
