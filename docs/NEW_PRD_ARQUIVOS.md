# Planly - Estrutura Refatorada Profissional

## 🎯 Análise da Estrutura Atual

### ❌ Problemas Identificados:
- **16 hooks** espalhados sem organização por domínio
- **Arquivos duplicados** (firebase.ts, firebaseApp.ts, firebaseClient.ts)
- **Componentes UI** misturados com lógica de negócio
- **Debugging** espalhado em várias pastas
- **Scripts** sem categorização clara
- **Documentação** desorganizada

## 🏗️ Nova Estrutura Proposta - Escalável e Profissional

```
📁 Planly/
├── 📁 app/                         # Next.js App Router
│   ├── 📄 layout.tsx               # Layout raiz
│   ├── 📄 page.tsx                 # Landing page
│   ├── 📄 globals.css              # Estilos globais
│   ├── 📄 manifest.json            # PWA manifest
│   │
│   ├── 📁 (auth)/                  # Grupo autenticação
│   │   ├── 📄 layout.tsx           # Layout auth
│   │   ├── 📁 login/
│   │   ├── 📁 signup/
│   │   ├── 📁 forgot-password/
│   │   └── 📁 verify-email/
│   │
│   ├── 📁 (dashboard)/             # Grupo dashboard
│   │   ├── 📄 layout.tsx           # Layout dashboard
│   │   ├── 📁 dashboard/           # Home dashboard
│   │   ├── 📁 habits/              # Módulo hábitos
│   │   ├── 📁 finance/             # Módulo finanças
│   │   ├── 📁 health/              # Módulo saúde
│   │   ├── 📁 ai-chat/             # Módulo IA
│   │   ├── 📁 profile/             # Perfil usuário
│   │   └── 📁 settings/            # Configurações
│   │
│   ├── 📁 api/                     # API Routes
│   │   └── 📁 auth/                # Auth endpoints
│   │
│   └── 📁 onboarding/              # Onboarding
│
├── 📁 src/                         # Source code principal
│   │
│   ├── 📁 components/              # Componentes organizados
│   │   ├── 📁 ui/                  # Design system base
│   │   │   ├── 📄 index.ts         # Barrel exports
│   │   │   └── 📄 [49 components]  # Componentes UI puros
│   │   │
│   │   ├── 📁 forms/               # Componentes de formulários
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 auth-form.tsx
│   │   │   ├── 📄 habit-form.tsx
│   │   │   └── 📄 profile-form.tsx
│   │   │
│   │   ├── 📁 layout/              # Componentes de layout
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 header.tsx
│   │   │   ├── 📄 sidebar.tsx
│   │   │   └── 📄 mobile-nav.tsx
│   │   │
│   │   ├── 📁 features/            # Componentes específicos
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 habit-calendar.tsx
│   │   │   ├── 📄 progress-ring.tsx
│   │   │   ├── 📄 achievement-badge.tsx
│   │   │   └── 📄 metric-card.tsx
│   │   │
│   │   └── 📁 providers/           # Providers e Guards
│   │       ├── 📄 index.ts
│   │       ├── 📄 auth-provider.tsx
│   │       ├── 📄 theme-provider.tsx
│   │       └── 📄 toast-provider.tsx
│   │
│   ├── 📁 hooks/                   # Hooks organizados por domínio
│   │   ├── 📄 index.ts             # Barrel exports
│   │   │
│   │   ├── 📁 auth/                # Hooks de autenticação
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 use-auth.ts
│   │   │   ├── 📄 use-auth-redirect.ts
│   │   │   └── 📄 use-onboarding.ts
│   │   │
│   │   ├── 📁 data/                # Hooks de dados/API
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 use-user-data.ts
│   │   │   ├── 📄 use-habits.ts
│   │   │   ├── 📄 use-finance.ts
│   │   │   └── 📄 use-health.ts
│   │   │
│   │   ├── 📁 ui/                  # Hooks de interface
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 use-mobile.ts
│   │   │   ├── 📄 use-toast.ts
│   │   │   └── 📄 use-theme.ts
│   │   │
│   │   └── 📁 system/              # Hooks de sistema
│   │       ├── 📄 index.ts
│   │       ├── 📄 use-cache-monitor.ts
│   │       └── 📄 use-connection.ts
│   │
│   ├── 📁 lib/                     # Bibliotecas e utilitários
│   │   ├── 📄 index.ts             # Barrel exports
│   │   │
│   │   ├── 📁 firebase/            # Firebase unificado
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 config.ts        # Configuração
│   │   │   ├── 📄 auth.ts          # Auth methods
│   │   │   ├── 📄 firestore.ts     # Firestore methods
│   │   │   └── 📄 storage.ts       # Storage methods
│   │   │
│   │   ├── 📁 utils/               # Utilitários organizados
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 cn.ts            # className utils
│   │   │   ├── 📄 date.ts          # Date utils
│   │   │   ├── 📄 format.ts        # Format utils
│   │   │   └── 📄 validation.ts    # Validation utils
│   │   │
│   │   ├── 📁 constants/           # Constantes
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 routes.ts        # Rotas
│   │   │   ├── 📄 config.ts        # Configurações
│   │   │   └── 📄 messages.ts      # Mensagens
│   │   │
│   │   └── 📁 types/               # Tipos TypeScript
│   │       ├── 📄 index.ts
│   │       ├── 📄 auth.ts          # Tipos auth
│   │       ├── 📄 user.ts          # Tipos usuário
│   │       ├── 📄 habit.ts         # Tipos hábitos
│   │       └── 📄 api.ts           # Tipos API
│   │
│   └── 📁 styles/                  # Estilos organizados
│       ├── 📄 globals.css          # Estilos globais
│       ├── 📄 components.css       # Estilos componentes
│       └── 📄 themes.css           # Temas
│
├── 📁 public/                      # Assets públicos
│   ├── 📁 icons/                   # Ícones PWA
│   ├── 📁 images/                  # Imagens
│   └── 📁 sw/                      # Service Worker
│
├── 📁 scripts/                     # Scripts organizados
│   ├── 📁 build/                   # Scripts de build
│   ├── 📁 dev/                     # Scripts de desenvolvimento
│   ├── 📁 cache/                   # Scripts de cache
│   └── 📁 health/                  # Scripts de saúde
│
├── 📁 docs/                        # Documentação
│   ├── 📄 README.md                # Documentação principal
│   ├── 📄 CONTRIBUTING.md          # Guia contribuição
│   ├── 📁 setup/                   # Guias de setup
│   └── 📁 architecture/            # Documentação arquitetura
│
└── 📁 config/                      # Configurações
    ├── 📄 next.config.mjs          # Next.js config
    ├── 📄 tailwind.config.ts       # Tailwind config
    ├── 📄 tsconfig.json            # TypeScript config
    └── 📄 eslint.config.js         # ESLint config
```

## 🔧 Melhorias Implementadas

### 1. **Hooks Organizados por Domínio**
```typescript
// hooks/auth/index.ts
export { useAuth } from './use-auth'
export { useAuthRedirect } from './use-auth-redirect'
export { useOnboarding } from './use-onboarding'

// hooks/data/index.ts
export { useUserData } from './use-user-data'
export { useHabits } from './use-habits'
export { useFinance } from './use-finance'

// hooks/index.ts - Barrel export principal
export * from './auth'
export * from './data'
export * from './ui'
export * from './system'
```

### 2. **Firebase Unificado**
```typescript
// lib/firebase/index.ts
export { auth, signIn, signOut, signUp } from './auth'
export { db, createUser, updateUser, deleteUser } from './firestore'
export { storage, uploadFile, deleteFile } from './storage'
export { app, config } from './config'
```

### 3. **Componentes Categorizados**
```typescript
// components/ui/index.ts - Design System
export { Button } from './button'
export { Card } from './card'
export { Dialog } from './dialog'
// ... todos os 49 componentes UI

// components/forms/index.ts - Formulários
export { AuthForm } from './auth-form'
export { HabitForm } from './habit-form'
export { ProfileForm } from './profile-form'

// components/layout/index.ts - Layout
export { Header } from './header'
export { Sidebar } from './sidebar'
export { MobileNav } from './mobile-nav'
```

### 4. **Tipos Organizados**
```typescript
// lib/types/index.ts
export type * from './auth'
export type * from './user'
export type * from './habit'
export type * from './api'
```

### 5. **Utilitários Separados**
```typescript
// lib/utils/index.ts
export { cn } from './cn'
export { formatDate, parseDate } from './date'
export { formatCurrency, formatNumber } from './format'
export { validateEmail, validatePassword } from './validation'
```

## 📊 Benefícios da Nova Estrutura

### ✅ **Escalabilidade**
- Fácil adição de novos módulos
- Estrutura consistente e previsível
- Separação clara de responsabilidades

### ✅ **Profissionalismo**
- Padrões industry-standard
- Documentação organizada
- Configurações centralizadas

### ✅ **Simplicidade**
- Barrel exports para imports limpos
- Organização por domínio
- Estrutura intuitiva

### ✅ **Manutenibilidade**
- Fácil localização de arquivos
- Redução de duplicação
- Código modular e testável

## 🚀 Plano de Migração

### **Fase 1: Reorganização de Hooks**
1. Criar pastas por domínio em `src/hooks/`
2. Mover hooks para categorias apropriadas
3. Criar barrel exports
4. Atualizar imports nos componentes

### **Fase 2: Unificação Firebase**
1. Criar `src/lib/firebase/`
2. Consolidar configurações Firebase
3. Remover arquivos duplicados
4. Atualizar imports

### **Fase 3: Reorganização Componentes**
1. Categorizar componentes por função
2. Criar barrel exports
3. Atualizar imports
4. Documentar componentes

### **Fase 4: Estrutura Final**
1. Mover arquivos para `src/`
2. Organizar scripts por categoria
3. Consolidar documentação
4. Atualizar configurações

## 📝 Exemplo de Uso Simplificado

```typescript
// Antes (confuso)
import { useAuth } from '../../hooks/use-auth'
import { useUserData } from '../../hooks/useUserData'
import { useAuthRedirect } from '../../hooks/use-auth-redirect'

// Depois (limpo)
import { useAuth, useUserData, useAuthRedirect } from '@/hooks'
import { Button, Card, Dialog } from '@/components/ui'
import { Header, Sidebar } from '@/components/layout'
import { firebase } from '@/lib/firebase'
```

Esta estrutura mantém o projeto **profissional**, **escalável** e **fácil de entender**, eliminando a bagunça atual e criando um sistema organizacional claro e consistente.