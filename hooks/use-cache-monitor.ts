'use client'

import { useEffect, useState, useCallback } from 'react'
import { detectCacheIssues, autoCleanCache } from '@/lib/cache-middleware'

interface CacheStatus {
  isHealthy: boolean
  issues: string[]
  lastChecked: Date | null
  cacheSize: number
  autoCleanEnabled: boolean
}

export const useCacheMonitor = () => {
  const [cacheStatus, setCacheStatus] = useState<CacheStatus>({
    isHealthy: true,
    issues: [],
    lastChecked: null,
    cacheSize: 0,
    autoCleanEnabled: true
  })

  const [isMonitoring, setIsMonitoring] = useState(false)

  // Função para verificar o status do cache
  const checkCacheHealth = useCallback(async () => {
    try {
      const issues = await detectCacheIssues()
      
      // Estimar tamanho do cache
      let cacheSize = 0
      if (typeof window !== 'undefined' && 'caches' in window) {
        try {
          const cacheNames = await caches.keys()
          cacheSize = cacheNames.length
        } catch (error) {
          console.warn('Erro ao verificar cache:', error)
        }
      }

      setCacheStatus({
        isHealthy: issues.length === 0,
        issues,
        lastChecked: new Date(),
        cacheSize,
        autoCleanEnabled: cacheStatus.autoCleanEnabled
      })

      // Auto-limpeza se necessário
      if (cacheStatus.autoCleanEnabled && issues.length > 0) {
        await autoCleanCache()
      }

    } catch (error) {
      console.error('Erro ao verificar cache:', error)
      setCacheStatus(prev => ({
        ...prev,
        isHealthy: false,
        issues: ['Erro ao verificar cache'],
        lastChecked: new Date()
      }))
    }
  }, [cacheStatus.autoCleanEnabled])

  // Função para limpar cache manualmente
  const clearCache = useCallback(async () => {
    try {
      await autoCleanCache()
      await checkCacheHealth()
    } catch (error) {
      console.error('Erro ao limpar cache:', error)
    }
  }, [checkCacheHealth])

  // Função para alternar monitoramento automático
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(prev => !prev)
  }, [])

  // Função para alternar limpeza automática
  const toggleAutoClean = useCallback(() => {
    setCacheStatus(prev => ({
      ...prev,
      autoCleanEnabled: !prev.autoCleanEnabled
    }))
  }, [])

  // Monitoramento automático
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(checkCacheHealth, 30000) // Verificar a cada 30 segundos
    
    return () => clearInterval(interval)
  }, [isMonitoring, checkCacheHealth])

  // Verificação inicial
  useEffect(() => {
    checkCacheHealth()
  }, [checkCacheHealth])

  // Verificar cache em caso de erro de chunk
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.message.includes('Loading chunk') || event.message.includes('ChunkLoadError')) {
        console.warn('Erro de chunk detectado, limpando cache...')
        clearCache()
      }
    }

    window.addEventListener('error', handleChunkError)
    return () => window.removeEventListener('error', handleChunkError)
  }, [clearCache])

  // Verificar cache em caso de navigation error
  useEffect(() => {
    const handleNavigationError = () => {
      console.warn('Erro de navegação detectado, verificando cache...')
      checkCacheHealth()
    }

    window.addEventListener('unhandledrejection', handleNavigationError)
    return () => window.removeEventListener('unhandledrejection', handleNavigationError)
  }, [checkCacheHealth])

  return {
    cacheStatus,
    isMonitoring,
    checkCacheHealth,
    clearCache,
    toggleMonitoring,
    toggleAutoClean
  }
}

export default useCacheMonitor
