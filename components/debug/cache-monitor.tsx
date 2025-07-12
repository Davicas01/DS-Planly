'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Monitor,
  Settings,
  HardDrive,
  Clock
} from 'lucide-react'
import { useCacheMonitor } from '@/hooks/use-cache-monitor'

export const CacheMonitor: React.FC = () => {
  const {
    cacheStatus,
    isMonitoring,
    checkCacheHealth,
    clearCache,
    toggleMonitoring,
    toggleAutoClean
  } = useCacheMonitor()

  const [isLoading, setIsLoading] = useState(false)

  const handleClearCache = async () => {
    setIsLoading(true)
    try {
      await clearCache()
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckHealth = async () => {
    setIsLoading(true)
    try {
      await checkCacheHealth()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Monitor de Cache Next.js
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Geral */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {cacheStatus.isHealthy ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">
                Status: {cacheStatus.isHealthy ? 'Saudável' : 'Problemas Detectados'}
              </span>
            </div>
            <Badge variant={cacheStatus.isHealthy ? 'default' : 'destructive'}>
              {cacheStatus.isHealthy ? 'OK' : 'AVISO'}
            </Badge>
          </div>

          {/* Informações do Cache */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Caches Ativos: {cacheStatus.cacheSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Última Verificação: {cacheStatus.lastChecked?.toLocaleTimeString() || 'Nunca'}
              </span>
            </div>
          </div>

          {/* Problemas Detectados */}
          {cacheStatus.issues.length > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Problemas detectados:</strong>
                <ul className="mt-2 space-y-1">
                  {cacheStatus.issues.map((issue, index) => (
                    <li key={index} className="text-sm">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Controles */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleCheckHealth}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Verificar Saúde
            </Button>
            
            <Button 
              onClick={handleClearCache}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>
          </div>

          {/* Configurações */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Monitoramento Automático</span>
              </div>
              <Switch
                checked={isMonitoring}
                onCheckedChange={toggleMonitoring}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Limpeza Automática</span>
              </div>
              <Switch
                checked={cacheStatus.autoCleanEnabled}
                onCheckedChange={toggleAutoClean}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas de Otimização */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dicas de Otimização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Execute <code className="bg-gray-100 px-1 rounded">npm run cache:clear</code> quando encontrar erros de chunk</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Use <code className="bg-gray-100 px-1 rounded">npm run dev:clean</code> para desenvolvimento limpo</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Execute <code className="bg-gray-100 px-1 rounded">npm run health:check</code> para diagnóstico completo</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Ative o monitoramento automático para detectar problemas cedo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CacheMonitor
