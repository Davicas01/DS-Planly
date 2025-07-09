# Documentação Completa do Sistema Planly

## Visão Geral

O **Planly** é um Progressive Web App (PWA) desenvolvido em Next.js 15 que funciona como um super app de organização pessoal. O sistema unifica hábitos, finanças, saúde e bem-estar em uma única plataforma inteligente.

## Arquitetura do Sistema

### Tecnologias Principais
- **Framework**: Next.js 15 com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **PWA**: next-pwa
- **Gerenciamento de Estado**: React Hooks + localStorage
- **Validação**: Zod + React Hook Form

## Estrutura de Pastas e Arquivos

### 📁 Raiz do Projeto

#### Arquivos de Configuração
- **`package.json`**: Dependências e scripts do projeto
- **`next.config.mjs`**: Configuração do Next.js com PWA
- **`tailwind.config.ts`**: Configuração do Tailwind CSS
- **`tsconfig.json`**: Configuração do TypeScript
- **`components.json`**: Configuração do shadcn/ui
- **`postcss.config.mjs`**: Configuração do PostCSS
- **`middleware.ts`**: Middleware de autenticação e roteamento
- **`.gitignore`**: Arquivos ignorados pelo Git
- **`.replit`**: Configuração para Replit

### 📁 app/ - Estrutura de Rotas (App Router)

#### Arquivos Principais
- **`layout.tsx`**: Layout raiz com PWA, Service Worker e tema
- **`page.tsx`**: Página inicial/landing page
- **`globals.css`**: Estilos globais
- **`manifest.json`**: Manifesto PWA

#### 📁 app/auth/ - Sistema de Autenticação
- **`login/`**: Tela de login
- **`signup/`**: Tela de cadastro
- **`forgot-password/`**: Recuperação de senha
- **`verify-email/`**: Verificação de email

#### 📁 app/dashboard/ - Painel Principal
- **`layout.tsx`**: Layout do dashboard com sidebar e header
- **`page.tsx`**: Dashboard principal com resumo geral
- **`header.tsx`**: Cabeçalho do dashboard

##### Módulos do Dashboard:
- **`ai-chat/`**: Chat com IA para insights
- **`finance/`**: Gestão financeira
- **`habits/`**: Acompanhamento de hábitos
- **`health/`**: Monitoramento de saúde
- **`profile/`**: Perfil do usuário
- **`settings/`**: Configurações

#### 📁 app/onboarding/ - Processo de Integração
- **`page.tsx`**: Fluxo de onboarding para novos usuários

#### 📁 app/offline/ - Funcionalidade Offline
- **`page.tsx`**: Página exibida quando offline

### 📁 components/ - Componentes Reutilizáveis

#### 📁 components/ui/ - Componentes Base (shadcn/ui)
Componentes fundamentais da interface:
- **`button.tsx`**: Botões com variações
- **`card.tsx`**: Cards para conteúdo
- **`input.tsx`**: Campos de entrada
- **`form.tsx`**: Formulários
- **`dialog.tsx`**: Modais e diálogos
- **`toast.tsx`**: Notificações
- **`progress.tsx`**: Barras de progresso
- **`calendar.tsx`**: Componente de calendário
- **`chart.tsx`**: Gráficos
- **`badge.tsx`**: Badges e etiquetas
- **`avatar.tsx`**: Avatares de usuário
- **`accordion.tsx`**: Acordeões
- **`alert.tsx`**: Alertas
- **`checkbox.tsx`**: Checkboxes
- **`dropdown-menu.tsx`**: Menus dropdown
- **`navigation-menu.tsx`**: Menus de navegação
- **`popover.tsx`**: Popovers
- **`radio-group.tsx`**: Grupos de radio
- **`select.tsx`**: Seletores
- **`separator.tsx`**: Separadores
- **`sheet.tsx`**: Painéis laterais
- **`sidebar.tsx`**: Sidebar
- **`skeleton.tsx`**: Skeletons de carregamento
- **`slider.tsx`**: Sliders
- **`switch.tsx`**: Switches
- **`table.tsx`**: Tabelas
- **`tabs.tsx`**: Abas
- **`textarea.tsx`**: Áreas de texto
- **`toggle.tsx`**: Toggles
- **`tooltip.tsx`**: Tooltips

#### 📁 components/auth/ - Componentes de Autenticação
- **`auth-layout.tsx`**: Layout para páginas de auth
- **`password-strength.tsx`**: Indicador de força da senha

#### 📁 components/dashboard/ - Componentes do Dashboard
- **`header.tsx`**: Cabeçalho com navegação
- **`sidebar.tsx`**: Barra lateral de navegação
- **`mobile-nav.tsx`**: Navegação mobile
- **`floating-action-button.tsx`**: Botão de ação flutuante

#### 📁 components/advanced/ - Componentes Avançados
- **`achievement-badge.tsx`**: Badges de conquistas
- **`confetti-celebration.tsx`**: Animação de confete
- **`habit-calendar.tsx`**: Calendário de hábitos
- **`metric-card.tsx`**: Cards de métricas
- **`progress-ring.tsx`**: Anéis de progresso
- **`welcome-tour.tsx`**: Tour de boas-vindas

#### 📁 components/chat/ - Componentes do Chat IA
- **`chat-message.tsx`**: Mensagens do chat
- **`insight-card.tsx`**: Cards de insights
- **`suggested-questions.tsx`**: Perguntas sugeridas
- **`typing-indicator.tsx`**: Indicador de digitação

#### 📁 components/charts/ - Componentes de Gráficos
- **`mini-chart.tsx`**: Mini gráficos para dashboard

#### 📁 components/notifications/ - Sistema de Notificações
- **`push-notifications.tsx`**: Notificações push

#### 📁 components/offline/ - Componentes Offline
- **`connection-status.tsx`**: Status da conexão

#### Componentes Globais
- **`theme-provider.tsx`**: Provedor de tema (dark/light)

### 📁 hooks/ - Hooks Customizados
- **`use-auth.ts`**: Hook de autenticação
- **`use-mobile.tsx`**: Hook para detecção mobile
- **`use-toast.ts`**: Hook para toasts

### 📁 lib/ - Utilitários
- **`utils.ts`**: Funções utilitárias (cn, formatters, etc.)

### 📁 public/ - Arquivos Estáticos
- **`icon-192x192.png`**: Ícone PWA 192x192
- **`icon-512x512.png`**: Ícone PWA 512x512
- **`maskable_icon.svg`**: Ícone maskable
- **`placeholder-logo.png/svg`**: Logo placeholder
- **`placeholder-user.jpg`**: Avatar placeholder
- **`placeholder.jpg/svg`**: Imagens placeholder
- **`splash.html`**: Tela de splash
- **`sw.js`**: Service Worker

### 📁 styles/ - Estilos
- **`globals.css`**: Estilos globais adicionais

## Funcionalidades Principais

### 1. Sistema de Autenticação
- Login/Cadastro com validação
- Recuperação de senha
- Verificação de email
- Middleware de proteção de rotas
- Persistência de sessão

### 2. Dashboard Inteligente
- Resumo geral do progresso
- Métricas em tempo real
- Cards de estatísticas
- Hábitos do dia
- Tarefas próximas
- Insights personalizados

### 3. Gestão de Hábitos
- Criação e acompanhamento de hábitos
- Calendário visual
- Streaks e conquistas
- Progresso diário/semanal/mensal

### 4. Controle Financeiro
- Acompanhamento de gastos
- Categorização automática
- Metas financeiras
- Relatórios e gráficos

### 5. Monitoramento de Saúde
- Registro de humor
- Acompanhamento de peso
- Exercícios e atividades
- Métricas de bem-estar

### 6. Chat com IA
- Insights personalizados
- Sugestões inteligentes
- Análise de padrões
- Perguntas sugeridas

### 7. PWA (Progressive Web App)
- Instalação no dispositivo
- Funcionamento offline
- Service Worker
- Notificações push
- Sincronização em background

## Fluxo de Dados

### Autenticação
1. Login/Cadastro → Validação → Token → localStorage
2. Middleware verifica token em rotas protegidas
3. Redirecionamento automático baseado no status

### Estado da Aplicação
- **localStorage**: Dados de autenticação e preferências
- **React State**: Estado local dos componentes
- **Context API**: Tema e configurações globais

### Persistência
- Dados salvos localmente no localStorage
- Service Worker para cache offline
- Sincronização quando online

## Padrões de Desenvolvimento

### Estrutura de Componentes
```typescript
// Padrão de componente
export default function ComponentName() {
  // Hooks
  // Estado local
  // Efeitos
  // Funções
  // Render
}
```

### Tipagem TypeScript
- Interfaces para props
- Types para dados
- Validação com Zod

### Estilização
- Tailwind CSS para utilitários
- CSS Modules quando necessário
- Variáveis CSS para temas

### Responsividade
- Mobile-first approach
- Breakpoints do Tailwind
- Componentes adaptativos

## Configurações Importantes

### PWA (next.config.mjs)
- Service Worker automático
- Cache de recursos
- Instalação offline

### Middleware (middleware.ts)
- Proteção de rotas
- Redirecionamentos
- Verificação de onboarding

### Tema (theme-provider.tsx)
- Dark/Light mode
- Persistência de preferência
- Transições suaves

## Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Verificação de código
```

## Considerações de Performance

- **Code Splitting**: Automático com App Router
- **Lazy Loading**: Componentes carregados sob demanda
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Análise de tamanho do bundle
- **Service Worker**: Cache inteligente de recursos

## Acessibilidade

- **Semantic HTML**: Estrutura semântica
- **ARIA Labels**: Acessibilidade para screen readers
- **Keyboard Navigation**: Navegação por teclado
- **Color Contrast**: Contraste adequado
- **Focus Management**: Gerenciamento de foco

Esta documentação fornece uma visão completa da estrutura e funcionamento do sistema Planly, servindo como guia para desenvolvimento e manutenção.