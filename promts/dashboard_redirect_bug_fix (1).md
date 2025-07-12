# 🐛 Bug Fix: Dashboard Infinite Redirect Loop

## 📋 Problema Identificado

O usuário está sendo automaticamente redirecionado para `/dashboard` sempre que tenta acessar outras páginas como `/dashboard/habits`, `/dashboard/finances`, `/dashboard/profile`, impedindo a navegação normal no aplicativo.

**Sintomas:**
- Usuário entra no dashboard normalmente
- Ao tentar navegar para outras seções (hábitos, finanças, perfil), é automaticamente redirecionado de volta para `/dashboard`
- Logs mostram redirecionamentos constantes para `/onboarding` e `/dashboard`

## 🔍 Análise dos Logs

```
[Middleware] GET /dashboard/habits
[Middleware] GET /onboarding
[Middleware] GET /dashboard
```

O padrão indica que o middleware está interceptando as requisições e forçando redirecionamentos desnecessários.

## 🛠️ Possíveis Soluções e Exemplos

### 1. Exemplo de Middleware Corrigido

**💡 DICA**: Verifique se seu middleware atual tem lógica similar a esta. Se não, considere implementar algo parecido:

```javascript
// Exemplo de middleware.js - USE COMO REFERÊNCIA
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Páginas que NÃO precisam de autenticação
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/']
  
  // Páginas que precisam de autenticação
  const protectedPaths = ['/dashboard', '/habits', '/finances', '/profile', '/settings', '/health']
  
  // APIs que precisam de autenticação
  const protectedApiPaths = ['/api/user', '/api/habits', '/api/finances']
  
  // Verificar se é uma página pública
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path))
  
  // Se é página pública, permitir acesso
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Verificar se é uma página protegida
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isProtectedApi = protectedApiPaths.some(path => pathname.startsWith(path))
  
  // Se não é página protegida nem API protegida, permitir acesso
  if (!isProtectedPath && !isProtectedApi) {
    return NextResponse.next()
  }
  
  // Verificar autenticação
  const token = request.cookies.get('auth-token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    console.log('[Middleware] No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  try {
    // Verificar se o token é válido
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    
    // Token válido, verificar se precisa completar onboarding
    const user = await getUserFromToken(token)
    
    // Se usuário não completou onboarding e não está na página de onboarding
    if (!user.onboardingCompleted && !pathname.startsWith('/onboarding')) {
      console.log('[Middleware] User needs onboarding, redirecting')
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    
    // Se usuário completou onboarding mas está na página de onboarding
    if (user.onboardingCompleted && pathname.startsWith('/onboarding')) {
      console.log('[Middleware] User completed onboarding, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    // Tudo OK, permitir acesso
    console.log(`[Middleware] Access granted to: ${pathname}`)
    return NextResponse.next()
    
  } catch (error) {
    console.log('[Middleware] Invalid token, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Função auxiliar para pegar dados do usuário
async function getUserFromToken(token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch user data')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

// Configurar em quais rotas o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
```

### 2. Exemplo de Layout do Dashboard

**💡 DICA**: Compare seu layout atual com este exemplo. Verifique se há verificações de autenticação duplicadas que podem causar loops:

```javascript
// Exemplo de app/dashboard/layout.js - ANALISE SEU CÓDIGO ATUAL
'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    // Verificar autenticação do lado do cliente
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token') || 
                     document.cookie.split(';')
                       .find(row => row.startsWith('auth-token='))
                       ?.split('=')[1]
        
        if (!token) {
          router.push('/login')
          return
        }
        
        // Verificar se o token é válido
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Invalid token')
        }
        
        const userData = await response.json()
        setUser(userData)
        
        // Verificar se precisa completar onboarding
        if (!userData.onboardingCompleted) {
          router.push('/onboarding')
          return
        }
        
        setIsLoading(false)
        
      } catch (error) {
        console.error('Auth check failed:', error)
        // Limpar token inválido
        localStorage.removeItem('auth-token')
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        router.push('/login')
      }
    }
    
    checkAuth()
  }, [router])
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### 3. Exemplo de Sidebar com Navegação

**💡 DICA**: Verifique se sua sidebar usa `Link` do Next.js corretamente e se não há JavaScript que intercepta os cliques:

```javascript
// Exemplo de components/dashboard/Sidebar.js - COMPARE COM SEU CÓDIGO
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  HeartIcon,
  UserIcon,
  CogIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Hábitos', href: '/dashboard/habits', icon: ChartBarIcon },
  { name: 'Finanças', href: '/dashboard/finances', icon: CurrencyDollarIcon },
  { name: 'Saúde', href: '/dashboard/health', icon: HeartIcon },
  { name: 'Perfil', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Chat IA', href: '/dashboard/chat', icon: ChatBubbleLeftIcon },
  { name: 'Configurações', href: '/dashboard/settings', icon: CogIcon },
]

export default function Sidebar({ user }) {
  const pathname = usePathname()
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="Planly"
            />
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    ${isActive
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  `}
                >
                  <item.icon
                    className={`
                      ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'}
                      mr-3 flex-shrink-0 h-6 w-6
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-9 w-9 rounded-full"
                  src={user?.avatar || '/default-avatar.png'}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  Ver perfil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 4. Exemplo de Hook de Autenticação

**💡 DICA**: Se você está usando Context API ou hooks personalizados, verifique se não há conflitos com o middleware:

```javascript
// Exemplo de hooks/useAuth.js - ANALISE SUA IMPLEMENTAÇÃO ATUAL
'use client'

import { useState, useEffect, useContext, createContext } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  useEffect(() => {
    checkAuth()
  }, [])
  
  const checkAuth = async () => {
    try {
      const token = getToken()
      
      if (!token) {
        setLoading(false)
        return
      }
      
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Invalid token')
      }
      
      const userData = await response.json()
      setUser(userData)
      
    } catch (error) {
      console.error('Auth check failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }
  
  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        throw new Error('Login failed')
      }
      
      const data = await response.json()
      setToken(data.token)
      setUser(data.user)
      
      // Verificar se precisa completar onboarding
      if (!data.user.onboardingCompleted) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
      
      return data
      
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  
  const logout = () => {
    removeToken()
    setUser(null)
    router.push('/login')
  }
  
  const getToken = () => {
    return localStorage.getItem('auth-token') || 
           document.cookie.split(';')
             .find(row => row.startsWith('auth-token='))
             ?.split('=')[1]
  }
  
  const setToken = (token) => {
    localStorage.setItem('auth-token', token)
    document.cookie = `auth-token=${token}; path=/; max-age=86400` // 24 hours
  }
  
  const removeToken = () => {
    localStorage.removeItem('auth-token')
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }
  
  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 5. Exemplo de Componente de Proteção

**💡 DICA**: Verifique se você tem múltiplas verificações de autenticação que podem entrar em conflito:

```javascript
// Exemplo de components/ProtectedRoute.js - COMPARE COM SUA LÓGICA
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, requireOnboarding = false }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }
      
      if (requireOnboarding && !user.onboardingCompleted) {
        router.push('/onboarding')
        return
      }
      
      if (!requireOnboarding && user.onboardingCompleted === false) {
        router.push('/onboarding')
        return
      }
    }
  }, [user, loading, router, requireOnboarding])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  if (!user) {
    return null
  }
  
  if (requireOnboarding && !user.onboardingCompleted) {
    return null
  }
  
  if (!requireOnboarding && user.onboardingCompleted === false) {
    return null
  }
  
  return children
}
```

### 6. Exemplo de Configuração Next.js

**💡 DICA**: Revise seu next.config.js para ver se há redirects ou rewrites que podem estar causando o problema:

```javascript
// Exemplo de next.config.js - VERIFIQUE SUAS CONFIGURAÇÕES
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/:path*',
        destination: '/dashboard/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'auth-token',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
```

## 🔧 Dicas de Debugging e Monitoramento

### 1. Exemplo de Sistema de Logs

**💡 DICA**: Adicione logs para entender onde está acontecendo o redirecionamento:

```javascript
// Exemplo de utils/logger.js - IMPLEMENTE ALGO SIMILAR
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  info: (message, data = {}) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data)
    }
  },
  error: (message, error = {}) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error)
    }
  },
  warn: (message, data = {}) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data)
    }
  }
}
```

### 2. Exemplo de Middleware de Debug

**💡 DICA**: Use logs para rastrear todas as requisições e entender o fluxo:

```javascript
// Exemplo de middleware/debug.js - ADAPTE PARA SEU CASO
import { logger } from '@/utils/logger'

export function debugMiddleware(request) {
  const { pathname, search } = request.nextUrl
  
  logger.info('Route Access', {
    pathname,
    search,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    cookies: Object.fromEntries(request.cookies.entries())
  })
}
```

## 🧪 Sugestões de Testes

### 1. Teste Manual Recomendado

**💡 DICA**: Siga estes passos para validar se o problema foi resolvido:

1. **Login**: Faça login normalmente
2. **Navegação**: Clique em "Hábitos" - deve navegar para `/dashboard/habits` sem redirecionamento
3. **Finanças**: Clique em "Finanças" - deve navegar para `/dashboard/finances` sem redirecionamento
4. **Refresh**: Recarregue a página - deve permanecer na mesma página
5. **URL Direta**: Digite `localhost:3000/dashboard/habits` diretamente - deve carregar a página

### 2. Exemplo de Teste Automatizado

**💡 DICA**: Considere implementar testes similares a estes:

```javascript
// Exemplo de __tests__/navigation.test.js - ADAPTE PARA SEU PROJETO
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/app/dashboard/layout'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/dashboard'),
}))

describe('Dashboard Navigation', () => {
  const mockPush = jest.fn()
  
  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush })
  })
  
  test('should not redirect when navigating to habits', () => {
    render(<DashboardLayout><div>Test</div></DashboardLayout>)
    
    const habitsLink = screen.getByText('Hábitos')
    fireEvent.click(habitsLink)
    
    expect(mockPush).not.toHaveBeenCalledWith('/dashboard')
  })
})
```

## 📝 Checklist de Verificação

**💡 INSTRUÇÃO**: Analise cada item e verifique se está implementado corretamente no seu projeto:

- [ ] Revisar middleware atual e comparar com o exemplo fornecido
- [ ] Verificar se há múltiplas verificações de autenticação conflitantes
- [ ] Analisar layout do dashboard e remover verificações duplicadas
- [ ] Examinar componentes de navegação (Sidebar, Links)
- [ ] Revisar configuração do next.config.js
- [ ] Implementar sistema de logs para debugging
- [ ] Testar navegação manual seguindo os passos sugeridos
- [ ] Considerar implementar testes automatizados
- [ ] Monitorar logs em desenvolvimento e produção

## 🚀 Informações para Deploy

### Variáveis de Ambiente Recomendadas

**💡 DICA**: Verifique se essas variáveis estão configuradas corretamente:

```bash
# Exemplo de .env.local - ADAPTE PARA SEU PROJETO
JWT_SECRET=your-secret-key-here
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Comandos Sugeridos para Deploy

**💡 DICA**: Use estes comandos como referência:

```bash
# Instalar dependências
npm install

# Build da aplicação
npm run build

# Iniciar em produção
npm start
```

## 📈 Melhorias Futuras

1. **Cache**: Implementar cache para dados do usuário
2. **Offline**: Adicionar suporte offline com service workers
3. **Analytics**: Implementar tracking de navegação
4. **Performance**: Otimizar carregamento de componentes
5. **Segurança**: Adicionar rate limiting e CSRF protection

---

**💡 INSTRUÇÕES IMPORTANTES PARA A IA:**

1. **ANALISE** o código atual do projeto antes de sugerir mudanças
2. **COMPARE** com os exemplos fornecidos para identificar discrepâncias
3. **VERIFIQUE** se há lógica duplicada ou conflitante
4. **ADAPTE** as soluções para a estrutura existente do projeto
5. **TESTE** cada mudança incrementalmente
6. **MONITORE** os logs para entender o fluxo de execução

**Prioridade**: 🔴 CRÍTICO - Identificar e corrigir imediatamente
**Abordagem**: Investigativa - Analise antes de implementar
**Impacto**: Resolve problema de navegação no dashboard

Use este documento como **guia de referência** para diagnosticar e corrigir o problema de redirecionamento infinito. Os exemplos de código servem como **padrões de comparação** para identificar onde está o problema no código atual.