# Prompt Completo para GitHub Copilot - Otimização de Cache Next.js

## Contexto do Problema
Meu projeto Next.js está apresentando erros constantes relacionados ao cache, especialmente o erro "UNKNOWN: unknown error, open" em arquivos da pasta .next. Preciso implementar uma solução completa que otimize o gerenciamento de cache e evite esses problemas de uma vez por todas.

## Instruções Detalhadas para Implementação

### 1. Configuração Avançada do next.config.js
```
Crie/atualize o arquivo next.config.js com as seguintes configurações:

- Desabilite cache em desenvolvimento para evitar arquivos corrompidos
- Configure watchOptions otimizadas para melhor detecção de mudanças
- Implemente limpeza automática de chunks
- Configure resolução de módulos para evitar conflitos
- Adicione configurações de webpack para estabilidade
- Configure experimental features para melhor performance
```

### 2. Scripts de Limpeza Automática no package.json
```
Adicione scripts personalizados que:
- Limpem automaticamente cache antes de builds
- Removam arquivos temporários problemáticos
- Façam rebuild completo quando necessário
- Incluam verificação de integridade dos arquivos

Exemplos de scripts necessários:
- "dev:clean" - limpa cache e inicia desenvolvimento
- "build:clean" - limpa tudo e faz build limpo
- "cache:clear" - limpa apenas cache
- "fresh:install" - reinstalação completa
```

### 3. Configurações de Webpack Otimizadas
```
Implemente configurações de webpack que:
- Desabilitem cache em desenvolvimento
- Melhorem detecção de mudanças de arquivos
- Evitem conflitos de módulos
- Otimizem splitChunks para evitar arquivos corrompidos
- Configurem resolução de aliases
- Implementem fallbacks para erros de arquivo
```

### 4. Middleware de Verificação de Integridade
```
Crie um middleware que:
- Verifique integridade dos arquivos antes de servir
- Detecte arquivos corrompidos automaticamente
- Limpe cache quando necessário
- Faça rebuild automático em caso de erro
- Registre logs de problemas de cache
```

### 5. Configurações de Ambiente
```
Configure variáveis de ambiente para:
- Controlar níveis de cache por ambiente
- Ativar/desativar limpeza automática
- Configurar timeouts de build
- Controlar logs de debug
- Definir estratégias de cache
```

### 6. Hook de Limpeza Automática
```
Implemente um hook React que:
- Detecte problemas de cache em tempo real
- Limpe cache automaticamente quando necessário
- Recarregue componentes após limpeza
- Mantenha estado da aplicação durante limpeza
- Notifique usuário sobre limpezas automáticas
```

### 7. Configurações de TypeScript/ESLint
```
Configure regras que:
- Evitem importações problemáticas
- Detectem dependências circulares
- Otimizem imports dinâmicos
- Melhorem tree-shaking
- Reduzam tamanho de bundles
```

### 8. Sistema de Monitoramento
```
Implemente sistema que:
- Monitore saúde do cache
- Detecte padrões de erro
- Gere relatórios de performance
- Alerte sobre problemas recorrentes
- Sugira otimizações automáticas
```

### 9. Configurações de Servidor de Desenvolvimento
```
Configure servidor dev que:
- Seja mais estável contra erros de arquivo
- Tenha melhor recuperação de erro
- Reinicie automaticamente quando necessário
- Mantenha logs detalhados
- Otimize uso de memória
```

### 10. Prevenção de Problemas Futuros
```
Implemente prevenções para:
- Evitar acúmulo de arquivos temporários
- Limpar cache automaticamente em intervalos
- Detectar e resolver dependências problemáticas
- Otimizar builds para diferentes ambientes
- Configurar CI/CD para limpeza automática
```

## Exemplos de Implementação

### next.config.js Otimizado
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações experimentais
  experimental: {
    forceSwcTransforms: true,
    optimizePackageImports: ['lucide-react'],
    turbotrace: {
      logLevel: 'error'
    }
  },
  
  // Configurações de webpack
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules/**', '**/.next/**']
      };
    }
    
    // Otimizações de resolução
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false
    };
    
    return config;
  },
  
  // Configurações de compilador
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  
  // Headers de cache otimizados
  headers: async () => [
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'
        }
      ]
    }
  ]
};

module.exports = nextConfig;
```

### Scripts do package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:clean": "npm run cache:clear && next dev",
    "build": "next build",
    "build:clean": "npm run cache:clear && npm run build",
    "start": "next start",
    "lint": "next lint",
    "cache:clear": "rimraf .next && rimraf node_modules/.cache",
    "fresh:install": "rimraf node_modules package-lock.json && npm install",
    "fresh:dev": "npm run fresh:install && npm run dev:clean",
    "analyze": "ANALYZE=true npm run build",
    "type-check": "tsc --noEmit"
  }
}
```

### Middleware de Verificação
```javascript
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Verificações de integridade
  const response = NextResponse.next();
  
  // Headers para evitar cache problemático
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

## Checklist de Implementação
- [ ] next.config.js otimizado criado/atualizado
- [ ] Scripts de limpeza adicionados ao package.json
- [ ] Configurações de webpack implementadas
- [ ] Middleware de verificação configurado
- [ ] Variáveis de ambiente definidas
- [ ] Sistema de monitoramento implementado
- [ ] Hooks de limpeza automática criados
- [ ] Configurações de TypeScript otimizadas
- [ ] Servidor de desenvolvimento configurado
- [ ] Prevenções automáticas implementadas

## Dependências Necessárias
```json
{
  "devDependencies": {
    "rimraf": "^5.0.0",
    "@next/bundle-analyzer": "^14.0.0",
    "cross-env": "^7.0.3"
  }
}
```

## Variáveis de Ambiente
```env
# .env.local
NEXT_CACHE_STRATEGY=minimal
NEXT_DEBUG_BUILD=true
NEXT_DISABLE_SWC_CACHE=true
NODE_ENV=development
```

## Resultado Esperado
Após implementar todas essas configurações:
- ✅ Eliminação completa de erros de cache
- ✅ Builds mais rápidos e estáveis
- ✅ Detecção automática de problemas
- ✅ Limpeza automática quando necessário
- ✅ Melhor performance geral
- ✅ Prevenção de problemas futuros

## Notas Importantes
- Teste em ambiente de desenvolvimento primeiro
- Monitore performance após implementação
- Ajuste configurações conforme necessário
- Mantenha logs para debugging
- Considere diferentes estratégias para produção

**Objetivo**: Criar um sistema robusto que elimine definitivamente os problemas de cache no Next.js, com limpeza automática e prevenção de erros futuros.