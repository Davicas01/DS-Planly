# Guia de Melhorias e Otimização - Sistema Planly

## 🚀 Performance

### 1. Otimização de Bundle

#### Code Splitting Avançado
```typescript
// Implementar lazy loading para rotas pesadas
const FinancePage = lazy(() => import('./dashboard/finance/page'))
const HealthPage = lazy(() => import('./dashboard/health/page'))

// Usar Suspense para loading states
<Suspense fallback={<PageSkeleton />}>
  <FinancePage />
</Suspense>
```

#### Bundle Analysis
```bash
# Adicionar ao package.json
"analyze": "cross-env ANALYZE=true next build"

# Instalar dependência
npm install --save-dev @next/bundle-analyzer
```

#### Tree Shaking
```typescript
// Importações específicas ao invés de importar tudo
import { format } from 'date-fns/format'
import { addDays } from 'date-fns/addDays'
// Ao invés de: import * as dateFns from 'date-fns'
```

### 2. Otimização de Imagens

#### Next.js Image Component
```typescript
import Image from 'next/image'

// Implementar em todos os componentes
<Image
  src="/placeholder-user.jpg"
  alt="Avatar do usuário"
  width={40}
  height={40}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

#### WebP e AVIF Support
```javascript
// next.config.mjs
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```

### 3. Caching Estratégico

#### Service Worker Avançado
```javascript
// public/sw.js - Melhorar estratégias de cache
const CACHE_NAME = 'planly-v1.2.0'
const STATIC_CACHE = 'planly-static-v1.2.0'
const DYNAMIC_CACHE = 'planly-dynamic-v1.2.0'

// Cache First para recursos estáticos
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(cacheFirst(event.request))
  }
})

// Network First para dados dinâmicos
if (event.request.url.includes('/api/')) {
  event.respondWith(networkFirst(event.request))
}
```

#### React Query/SWR Implementation
```typescript
// Implementar cache de dados
import useSWR from 'swr'

const { data, error, mutate } = useSWR('/api/habits', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 30000, // 30 segundos
})
```

### 4. Otimização de Renderização

#### React.memo e useMemo
```typescript
// Memoizar componentes pesados
const HabitCard = React.memo(({ habit, onToggle }) => {
  return (
    <Card>
      {/* Conteúdo do card */}
    </Card>
  )
})

// Memoizar cálculos complexos
const expensiveCalculation = useMemo(() => {
  return habits.reduce((acc, habit) => {
    return acc + habit.completionRate
  }, 0) / habits.length
}, [habits])
```

#### Virtual Scrolling
```typescript
// Para listas grandes (histórico de transações, etc.)
import { FixedSizeList as List } from 'react-window'

const TransactionList = ({ transactions }) => (
  <List
    height={400}
    itemCount={transactions.length}
    itemSize={60}
    itemData={transactions}
  >
    {TransactionRow}
  </List>
)
```

## 🔒 Segurança

### 1. Autenticação e Autorização

#### JWT Security
```typescript
// Implementar refresh tokens
interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Rotação automática de tokens
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${refreshToken}` }
  })
  return response.json()
}
```

#### Content Security Policy
```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.planly.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

#### Input Validation
```typescript
// Usar Zod para validação rigorosa
import { z } from 'zod'

const habitSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  target: z.number().positive().max(1000),
})

// Sanitização de dados
const sanitizeInput = (input: string) => {
  return input.replace(/<script[^>]*>.*?<\/script>/gi, '')
               .replace(/<[^>]*>/g, '')
               .trim()
}
```

### 2. Proteção de Dados

#### Criptografia Local
```typescript
// Criptografar dados sensíveis no localStorage
import CryptoJS from 'crypto-js'

const encryptData = (data: any, key: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString()
}

const decryptData = (encryptedData: string, key: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}
```

#### Rate Limiting
```typescript
// Implementar rate limiting no middleware
const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  const limit = 100 // requests per hour
  const windowMs = 60 * 60 * 1000 // 1 hour
  
  const now = Date.now()
  const userRequests = rateLimitMap.get(ip) || []
  
  // Remove requests older than window
  const validRequests = userRequests.filter(
    (timestamp: number) => now - timestamp < windowMs
  )
  
  if (validRequests.length >= limit) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  validRequests.push(now)
  rateLimitMap.set(ip, validRequests)
  
  return NextResponse.next()
}
```

## 🔍 SEO

### 1. Metadata Dinâmica

```typescript
// app/dashboard/habits/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hábitos - Planly | Organize sua rotina diária',
    description: 'Acompanhe e desenvolva hábitos saudáveis com o Planly. Monitore seu progresso e alcance seus objetivos.',
    keywords: ['hábitos', 'rotina', 'produtividade', 'organização'],
    openGraph: {
      title: 'Hábitos - Planly',
      description: 'Desenvolva hábitos saudáveis e monitore seu progresso',
      images: ['/og-habits.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hábitos - Planly',
      description: 'Desenvolva hábitos saudáveis e monitore seu progresso',
      images: ['/twitter-habits.jpg'],
    }
  }
}
```

### 2. Structured Data

```typescript
// Adicionar JSON-LD para rich snippets
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Planly",
  "description": "Super app de organização pessoal",
  "url": "https://planly.app",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web, iOS, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "BRL"
  }
}
```

### 3. Sitemap Dinâmico

```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://planly.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://planly.app/dashboard',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Adicionar mais URLs dinamicamente
  ]
}
```

## ⚡ Otimização de Carregamento

### 1. Preloading Estratégico

```typescript
// Preload de recursos críticos
const preloadCriticalResources = () => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = '/fonts/inter-var.woff2'
  link.as = 'font'
  link.type = 'font/woff2'
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}
```

### 2. Resource Hints

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.planly.com" />
        <link rel="prefetch" href="/dashboard" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. Critical CSS

```css
/* Extrair CSS crítico para above-the-fold */
.critical-css {
  /* Estilos para header, navigation, hero section */
  display: inline;
}
```

## 📱 PWA Avançado

### 1. Background Sync

```javascript
// Service Worker - Sincronização em background
self.addEventListener('sync', (event) => {
  if (event.tag === 'habit-sync') {
    event.waitUntil(syncHabits())
  }
})

const syncHabits = async () => {
  const pendingHabits = await getStoredHabits()
  for (const habit of pendingHabits) {
    try {
      await fetch('/api/habits', {
        method: 'POST',
        body: JSON.stringify(habit)
      })
      await removeStoredHabit(habit.id)
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}
```

### 2. Push Notifications

```typescript
// Implementar notificações inteligentes
const scheduleHabitReminder = async (habit: Habit) => {
  const registration = await navigator.serviceWorker.ready
  
  registration.showNotification('Lembrete de Hábito', {
    body: `Hora de ${habit.name}!`,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: `habit-${habit.id}`,
    actions: [
      { action: 'complete', title: 'Marcar como feito' },
      { action: 'snooze', title: 'Lembrar em 1h' }
    ],
    data: { habitId: habit.id }
  })
}
```

## 🎯 Monitoramento e Analytics

### 1. Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

const sendToAnalytics = (metric: any) => {
  // Enviar métricas para serviço de analytics
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### 2. Error Tracking

```typescript
// Error boundary global
class GlobalErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Global error:', error, errorInfo)
    
    // Send to error tracking service
    fetch('/api/errors', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
    })
  }
}
```

## 🔧 Ferramentas de Desenvolvimento

### 1. Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
```

### 2. Bundle Analyzer

```javascript
// Configurar análise automática
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

## 📊 Métricas de Sucesso

### Performance Targets
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **TTI**: < 3.8s
- **Speed Index**: < 3.4s

### Security Checklist
- ✅ HTTPS obrigatório
- ✅ CSP implementado
- ✅ Rate limiting ativo
- ✅ Input validation
- ✅ XSS protection
- ✅ CSRF protection

### SEO Targets
- **Core Web Vitals**: Todos verdes
- **Mobile Usability**: 100%
- **Accessibility**: > 95%
- **Best Practices**: > 90%

Este guia fornece um roadmap completo para otimizar o sistema Planly em todos os aspectos críticos de performance, segurança e experiência do usuário.