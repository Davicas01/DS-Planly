'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CacheMonitor from '@/components/debug/cache-monitor'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Settings, Monitor, HardDrive } from 'lucide-react'

export default function CacheTestPage() {
  const router = useRouter()

  const handleRunScript = (script: string) => {
    alert(`Execute no terminal: npm run ${script}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-6 w-6" />
                    Otimização de Cache Next.js
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitore e otimize o cache do seu projeto Next.js
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="monitor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monitor">
              <Monitor className="h-4 w-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="scripts">
              <Settings className="h-4 w-4 mr-2" />
              Scripts
            </TabsTrigger>
            <TabsTrigger value="config">
              <HardDrive className="h-4 w-4 mr-2" />
              Configuração
            </TabsTrigger>
          </TabsList>

          {/* Monitor Tab */}
          <TabsContent value="monitor" className="space-y-4">
            <CacheMonitor />
          </TabsContent>

          {/* Scripts Tab */}
          <TabsContent value="scripts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Scripts de Otimização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Limpeza Básica</h3>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleRunScript('cache:clear')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        cache:clear - Limpa cache básico
                      </Button>
                      <Button
                        onClick={() => handleRunScript('dev:clean')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        dev:clean - Dev limpo
                      </Button>
                      <Button
                        onClick={() => handleRunScript('build:clean')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        build:clean - Build limpo
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Limpeza Avançada</h3>
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleRunScript('cache:clear:full')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        cache:clear:full - Limpeza completa
                      </Button>
                      <Button
                        onClick={() => handleRunScript('fresh:install')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        fresh:install - Reinstala deps
                      </Button>
                      <Button
                        onClick={() => handleRunScript('health:check')}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        health:check - Verifica saúde
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comandos Manuais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-100 p-3 rounded">
                    <code>npm run cache:clear && npm run dev</code>
                    <p className="text-gray-600 mt-1">Para resolver erros de chunk loading</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <code>npm run fresh:install && npm run build</code>
                    <p className="text-gray-600 mt-1">Para resolver problemas de dependências</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <code>node scripts/clean-rebuild-new.js</code>
                    <p className="text-gray-600 mt-1">Script avançado de limpeza</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config Tab */}
          <TabsContent value="config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Implementadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Next.js Config</h3>
                    <ul className="space-y-1 text-sm">
                      <li>✅ Cache desabilitado em desenvolvimento</li>
                      <li>✅ Watch options otimizadas</li>
                      <li>✅ Split chunks configurado</li>
                      <li>✅ Fallbacks de resolução</li>
                      <li>✅ Headers de cache otimizados</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Webpack</h3>
                    <ul className="space-y-1 text-sm">
                      <li>✅ Cache desabilitado em dev</li>
                      <li>✅ Snapshot otimizado</li>
                      <li>✅ Performance configurada</li>
                      <li>✅ Externals para Firebase</li>
                      <li>✅ Aliases configurados</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Middleware</h3>
                    <ul className="space-y-1 text-sm">
                      <li>✅ Cache inteligente por tipo</li>
                      <li>✅ Headers otimizados</li>
                      <li>✅ Verificação de integridade</li>
                      <li>✅ Debug headers</li>
                      <li>✅ Limpeza automática</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variáveis de Ambiente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="bg-gray-100 p-3 rounded">
                    <code>NEXT_CACHE_STRATEGY=minimal</code>
                    <p className="text-gray-600">Estratégia de cache minimalista</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <code>NEXT_WEBPACK_CACHE=false</code>
                    <p className="text-gray-600">Desabilita cache webpack em dev</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <code>NODE_OPTIONS=--max-old-space-size=4096</code>
                    <p className="text-gray-600">Aumenta memória disponível</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
