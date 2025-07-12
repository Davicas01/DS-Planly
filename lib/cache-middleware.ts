import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware para otimização de cache e detecção de problemas
export function cacheMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Verificar se é um arquivo estático
  if (pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next()
    
    // Cache agressivo para arquivos estáticos
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    response.headers.set('Expires', new Date(Date.now() + 31536000000).toUTCString())
    
    return response
  }
  
  // Verificar se é um arquivo de imagem
  if (pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/)) {
    const response = NextResponse.next()
    
    // Cache moderado para imagens
    response.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
    
    return response
  }
  
  // Verificar se é uma API route
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // Sem cache para APIs
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  }
  
  // Para páginas HTML
  const response = NextResponse.next()
  
  // Cache moderado para páginas
  response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  
  // Headers de debug em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    response.headers.set('X-Cache-Status', 'MISS')
    response.headers.set('X-Cache-Debug', 'true')
    response.headers.set('X-Pathname', pathname)
  }
  
  return response
}

// Função para verificar integridade de arquivos
export function checkFileIntegrity(filePath: string): boolean {
  try {
    // Verificações básicas de integridade
    if (!filePath || filePath.includes('..')) {
      return false
    }
    
    // Verificar se é um arquivo permitido
    const allowedExtensions = ['.js', '.css', '.json', '.html', '.png', '.jpg', '.svg']
    const hasValidExtension = allowedExtensions.some(ext => filePath.endsWith(ext))
    
    return hasValidExtension
  } catch (error) {
    console.error('Erro ao verificar integridade do arquivo:', error)
    return false
  }
}

// Função para limpar cache automaticamente
export function autoCleanCache() {
  if (typeof window !== 'undefined' && 'caches' in window) {
    caches.keys().then(cacheNames => {
      cacheNames.forEach(cacheName => {
        if (cacheName.includes('workbox') || cacheName.includes('next')) {
          caches.delete(cacheName)
        }
      })
    })
  }
}

// Função para detectar problemas de cache
export function detectCacheIssues(): Promise<string[]> {
  return new Promise((resolve) => {
    const issues: string[] = []
    
    // Verificar se há muitos arquivos em cache
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then(cacheNames => {
        if (cacheNames.length > 10) {
          issues.push('Muitos caches ativos')
        }
        
        resolve(issues)
      }).catch(() => resolve(issues))
    } else {
      resolve(issues)
    }
  })
}

export default cacheMiddleware
