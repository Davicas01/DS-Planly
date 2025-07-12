# Prompt Completo para GitHub Copilot - Correção de Redirecionamento após Login

## Contexto do Problema
Após fazer login com sucesso (login é validado e aprovado), o sistema não está redirecionando automaticamente para o dashboard. O usuário fica na tela de login mesmo após autenticação bem-sucedida. Preciso implementar um sistema de redirecionamento automático e confiável.

## Instruções Detalhadas para Implementação

### 1. Verificação de Estado de Autenticação
```
Implemente verificação robusta que:
- Confirme se o login foi realmente bem-sucedido
- Verifique se o token/sessão foi criado corretamente
- Valide se os dados do usuário foram salvos
- Confirme se o estado de autenticação está atualizado
- Detecte automaticamente mudanças no estado de auth
```

### 2. Sistema de Redirecionamento Automático
```
Crie lógica que:
- Redirecione IMEDIATAMENTE após login bem-sucedido
- Use diferentes estratégias de redirecionamento (router.push, window.location, etc.)
- Implemente fallbacks em caso de falha no redirecionamento
- Mantenha histórico de navegação limpo
- Evite loops de redirecionamento
```

### 3. Gerenciamento de Estado de Autenticação
```
Implemente sistema que:
- Atualize estado global imediatamente após login
- Sincronize estado entre todos os componentes
- Persista estado de autenticação corretamente
- Limpe estados antigos antes de definir novos
- Notifique todos os componentes sobre mudanças de auth
```

### 4. Hook de Autenticação Inteligente
```
Crie hook personalizado que:
- Monitore mudanças no estado de autenticação
- Execute redirecionamento automático
- Gerencie loading states durante transições
- Trate erros de autenticação graciosamente
- Mantenha sincronização entre abas/janelas
```

### 5. Componente de Proteção de Rotas
```
Implemente AuthGuard que:
- Verifique autenticação antes de renderizar páginas
- Redirecione usuários não autenticados para login
- Redirecione usuários autenticados para dashboard
- Gerencie estados de loading durante verificações
- Previna renderização desnecessária
```

### 6. Middleware de Redirecionamento
```
Configure middleware que:
- Intercepte todas as rotas protegidas
- Verifique autenticação a nível de servidor
- Redirecione automaticamente baseado no estado
- Mantenha URLs limpos e consistentes
- Otimize performance de redirecionamentos
```

### 7. Sistema de Callback pós-Login
```
Implemente callbacks que:
- Executem após login bem-sucedido
- Limpem formulários e estados temporários
- Atualizem contextos globais
- Disparem events customizados
- Preparem dados para dashboard
```

### 8. Tratamento de Erros de Redirecionamento
```
Configure tratamento para:
- Falhas no redirecionamento
- Problemas de permissão
- Erros de rota
- Timeouts de redirecionamento
- Conflitos de estado
```

### 9. Otimização de Performance
```
Implemente otimizações para:
- Redirecionamentos mais rápidos
- Preload de dados do dashboard
- Lazy loading de componentes
- Cache de rotas frequentes
- Minimizar re-renders desnecessários
```

### 10. Debugging e Monitoramento
```
Adicione sistema de logs para:
- Rastrear fluxo de autenticação
- Monitorar redirecionamentos
- Detectar falhas no processo
- Gerar relatórios de problemas
- Facilitar debugging em produção
```

## Exemplos de Implementação

### Hook de Autenticação com Redirecionamento
```javascript
// hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Usuário autenticado - redirecionar para dashboard
        console.log('Usuário autenticado, redirecionando para dashboard');
        router.replace('/dashboard');
      } else if (!isAuthenticated && router.pathname !== '/login') {
        // Usuário não autenticado - redirecionar para login
        console.log('Usuário não autenticado, redirecionando para login');
        router.replace('/login');
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
};
```

### Componente de Login com Redirecionamento
```javascript
// components/LoginForm.jsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('Login bem-sucedido, redirecionando...');
        
        // Múltiplas estratégias de redirecionamento
        await router.push('/dashboard');
        
        // Fallback após timeout
        setTimeout(() => {
          if (router.pathname === '/login') {
            window.location.href = '/dashboard';
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // JSX do formulário
  );
}
```

### Context de Autenticação Otimizado
```javascript
// contexts/AuthContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });
  
  const router = useRouter();

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Salvar token
        localStorage.setItem('token', data.token);
        
        // Atualizar estado
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token
          }
        });
        
        // Redirecionamento automático
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
        
        return { success: true };
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  // Verificar autenticação ao carregar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar se token é válido
      fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: data.user,
              token: token
            }
          });
        } else {
          localStorage.removeItem('token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout: () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        router.push('/login');
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Middleware de Redirecionamento
```javascript
// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Rotas protegidas
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const authRoutes = ['/login', '/register'];

  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  try {
    if (token) {
      // Verificar se token é válido
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      
      // Se está autenticado e tentando acessar rota de auth
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // Se não está autenticado e tentando acessar rota protegida
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  } catch (error) {
    // Token inválido
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Componente AuthGuard
```javascript
// components/AuthGuard.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
```

## Checklist de Implementação
- [ ] Hook de autenticação com redirecionamento implementado
- [ ] Context de autenticação otimizado
- [ ] Componente de login com redirecionamento automático
- [ ] Middleware de redirecionamento configurado
- [ ] AuthGuard para proteção de rotas
- [ ] Sistema de callback pós-login
- [ ] Tratamento de erros implementado
- [ ] Logs de debugging adicionados
- [ ] Fallbacks para falhas de redirecionamento
- [ ] Otimizações de performance aplicadas

## Testes Necessários
- [ ] Login com usuário válido → deve ir para dashboard
- [ ] Login com usuário inválido → deve mostrar erro
- [ ] Acesso direto ao dashboard sem login → deve ir para login
- [ ] Refresh na página após login → deve manter no dashboard
- [ ] Logout → deve ir para login
- [ ] Múltiplas abas abertas → deve sincronizar estado

## Variáveis de Ambiente
```env
# .env.local
JWT_SECRET=sua_chave_secreta_aqui
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Resultado Esperado
Após implementar essas correções:
- ✅ Login bem-sucedido redireciona automaticamente para dashboard
- ✅ Usuários não autenticados são direcionados para login
- ✅ Estado de autenticação é mantido entre navegações
- ✅ Fallbacks funcionam em caso de falha
- ✅ Performance otimizada
- ✅ Experiência do usuário melhorada

## Notas Importantes
- Teste o fluxo completo após implementação
- Monitore logs durante desenvolvimento
- Considere diferentes cenários de uso
- Mantenha tokens seguros
- Implemente refresh de tokens se necessário

**Objetivo**: Criar um sistema de redirecionamento robusto que funcione perfeitamente após login bem-sucedido, direcionando o usuário automaticamente para o dashboard.