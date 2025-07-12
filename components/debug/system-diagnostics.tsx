'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface DiagnosticResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: string
}

export function SystemDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([])
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    const results: DiagnosticResult[] = []

    // Test 1: Client-side hydration
    results.push({
      name: 'Client-side Hydration',
      status: typeof window !== 'undefined' ? 'success' : 'error',
      message: typeof window !== 'undefined' ? 'Executando no cliente' : 'Executando no servidor',
      details: `User Agent: ${typeof window !== 'undefined' ? navigator.userAgent : 'N/A'}`
    })

    // Test 2: Environment variables
    const hasFirebaseVars = !!(
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    )
    
    results.push({
      name: 'Environment Variables',
      status: hasFirebaseVars ? 'success' : 'error',
      message: hasFirebaseVars ? 'Variáveis Firebase configuradas' : 'Variáveis Firebase não encontradas',
      details: `API Key: ${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Configurada' : 'Não encontrada'}`
    })

    // Test 3: Module imports
    try {
      const { isFirebaseInitialized } = await import('@/lib/firebaseClient')
      const isInitialized = isFirebaseInitialized()
      results.push({
        name: 'Module Imports',
        status: 'success',
        message: 'Módulos importados com sucesso',
        details: `Firebase Client: ${isInitialized ? 'Inicializado' : 'Não inicializado'}`
      })
    } catch (error) {
      results.push({
        name: 'Module Imports',
        status: 'error',
        message: 'Erro ao importar módulos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }

    // Test 4: Local Storage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('test', 'test')
        localStorage.removeItem('test')
        results.push({
          name: 'Local Storage',
          status: 'success',
          message: 'Local Storage funcionando',
          details: 'Leitura e escrita OK'
        })
      }
    } catch (error) {
      results.push({
        name: 'Local Storage',
        status: 'error',
        message: 'Erro no Local Storage',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }

    // Test 5: Webpack chunks
    try {
      const chunks = typeof window !== 'undefined' ? 
        Object.keys((window as any).__webpack_require__?.cache || {}).length : 0
      
      results.push({
        name: 'Webpack Chunks',
        status: chunks > 0 ? 'success' : 'warning',
        message: `${chunks} chunks carregados`,
        details: `Webpack cache: ${chunks > 0 ? 'Ativo' : 'Inativo'}`
      })
    } catch (error) {
      results.push({
        name: 'Webpack Chunks',
        status: 'error',
        message: 'Erro ao acessar webpack',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      })
    }

    setDiagnostics(results)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Diagnóstico do Sistema
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnostics}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Reexecutar
          </Button>
        </CardTitle>
        <CardDescription>
          Verificação de componentes críticos do sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnostics.map((diagnostic, index) => (
            <Alert key={index}>
              <div className="flex items-start gap-3">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{diagnostic.name}</span>
                    <Badge className={getStatusColor(diagnostic.status)}>
                      {diagnostic.status.toUpperCase()}
                    </Badge>
                  </div>
                  <AlertDescription className="text-sm text-gray-600">
                    {diagnostic.message}
                  </AlertDescription>
                  {diagnostic.details && (
                    <AlertDescription className="text-xs text-gray-500 mt-1">
                      {diagnostic.details}
                    </AlertDescription>
                  )}
                </div>
              </div>
            </Alert>
          ))}
        </div>
        
        {diagnostics.length === 0 && !loading && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nenhum diagnóstico executado. Clique em "Reexecutar" para iniciar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
