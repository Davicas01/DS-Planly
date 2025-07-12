# Guia Completo: Integração Firebase com Dashboard e Perfil - Planly

## 🎯 Objetivo
Substituir todos os dados mockados nas telas de Dashboard e Perfil por dados reais do usuário autenticado via Firebase, criando uma experiência personalizada e dinâmica.

## 📋 Problemas Identificados

### Dashboard (`/dashboard`)
- ✅ **Problema**: Nome do usuário nao pode esta mockado
- ✅ **Problema**: Estatísticas estão com valores fixos (7/10 hábitos, R$ 2.847, etc.)
- ✅ **Problema**: Hábitos do dia estão mockados
- ✅ **Problema**: Tarefas próximas estão mockadas
- ✅ **Problema**: Insights da IA estão mockados

### Perfil (`/dashboard/profile`)
- ✅ **Problema**: Informações pessoais mockadas
- ✅ **Problema**: Estatísticas de progresso fixas
- ✅ **Problema**: Conquistas mockadas
- ✅ **Problema**: Avatar não conectado ao usuário real

## 🏗️ Estrutura de Dados no Firebase

### Firestore Collections Necessárias

```javascript
// Exemplo de estrutura - adapte conforme necessário
users/{userId} = {
  displayName: "Nome do Usuário",
  email: "usuario@email.com",
  photoURL: "url_do_avatar",
  phone: "+55 11 99999-9999",
  location: "São Paulo, SP",
  bio: "Biografia do usuário",
  joinDate: "2024-01-15T10:00:00Z",
  createdAt: timestamp,
  updatedAt: timestamp
}

habits/{userId}/userHabits/{habitId} = {
  name: "Exercício",
  category: "saude",
  targetTime: "07:00",
  isActive: true,
  streak: 23,
  createdAt: timestamp
}

habitLogs/{userId}/logs/{date} = {
  date: "2025-07-11",
  completedHabits: ["habitId1", "habitId2"],
  logs: {
    habitId1: {
      completed: true,
      completedAt: timestamp
    }
  }
}

finances/{userId}/transactions/{transactionId} = {
  amount: 150.50,
  type: "expense" | "income",
  category: "alimentacao",
  description: "Almoço",
  date: "2025-07-11",
  createdAt: timestamp
}

moods/{userId}/entries/{date} = {
  date: "2025-07-11",
  rating: 8,
  notes: "Dia produtivo",
  createdAt: timestamp
}

tasks/{userId}/tasks/{taskId} = {
  title: "Revisar orçamento mensal",
  description: "Revisar gastos do mês",
  dueDate: "2025-07-11T14:00:00Z",
  completed: false,
  category: "finance",
  createdAt: timestamp
}
```

## 🔧 Implementação Técnica

### 1. Custom Hooks para Dados do Firebase

```javascript
// hooks/useUserData.js - EXEMPLO DE IMPLEMENTAÇÃO
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';

export const useUserData = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // DICA: Use onSnapshot para dados em tempo real
    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { userData, loading };
};
```

### 2. Hook para Hábitos do Dashboard

```javascript
// hooks/useDashboardHabits.js - EXEMPLO DE IMPLEMENTAÇÃO
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useDashboardHabits = (userId) => {
  const [habits, setHabits] = useState([]);
  const [todayProgress, setTodayProgress] = useState({ completed: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchHabits = async () => {
      try {
        // DICA: Buscar hábitos ativos do usuário
        const habitsRef = collection(db, `habits/${userId}/userHabits`);
        const q = query(habitsRef, where('isActive', '==', true));
        const snapshot = await getDocs(q);
        
        const habitsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setHabits(habitsData);
        
        // DICA: Calcular progresso do dia atual
        const today = new Date().toISOString().split('T')[0];
        // Implementar lógica para verificar hábitos completados hoje
        
      } catch (error) {
        console.error('Erro ao buscar hábitos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [userId]);

  return { habits, todayProgress, loading };
};
```

### 3. Hook para Estatísticas Financeiras

```javascript
// hooks/useFinanceStats.js - EXEMPLO DE IMPLEMENTAÇÃO
export const useFinanceStats = (userId) => {
  const [stats, setStats] = useState({
    currentBalance: 0,
    monthlyChange: 0,
    trend: 0
  });

  useEffect(() => {
    if (!userId) return;

    const fetchFinanceStats = async () => {
      // DICA: Implementar cálculo de saldo atual
      // Somar todas as receitas e subtrair despesas
      // Calcular variação percentual do mês
    };

    fetchFinanceStats();
  }, [userId]);

  return { stats };
};
```

## 🔄 Atualização dos Componentes

### Dashboard Component - Principais Alterações

```javascript
// pages/dashboard/page.js - EXEMPLO DE REFATORAÇÃO
export default function DashboardPage() {
  const { user } = useAuth();
  const { userData, loading: userLoading } = useUserData();
  const { habits, todayProgress } = useDashboardHabits(user?.uid);
  const { stats: financeStats } = useFinanceStats(user?.uid);
  const { moodAverage } = useMoodStats(user?.uid);

  // DICA: Implementar loading states
  if (userLoading) {
    return <LoadingSpinner />;
  }

  // DICA: Usar dados reais em vez de mockados
  const userName = userData?.displayName?.split(' ')[0] || 
                   user?.displayName?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'Usuário';

  const stats = [
    {
      title: "Hábitos Hoje",
      value: `${todayProgress.completed}/${todayProgress.total}`,
      progress: todayProgress.total > 0 ? (todayProgress.completed / todayProgress.total) * 100 : 0,
      // ... resto da configuração
    },
    {
      title: "Saldo Atual",
      value: `R$ ${financeStats.currentBalance.toLocaleString('pt-BR')}`,
      trend: `${financeStats.monthlyChange > 0 ? '+' : ''}${financeStats.monthlyChange}%`,
      // ... resto da configuração
    }
    // ... outros stats
  ];

  return (
    // JSX com dados reais
  );
}
```

### Profile Component - Principais Alterações

```javascript
// pages/dashboard/profile/page.js - EXEMPLO DE REFATORAÇÃO
export default function ProfilePage() {
  const { user } = useAuth();
  const { userData, loading } = useUserData();
  const { userStats } = useUserStats(user?.uid);
  const [isEditing, setIsEditing] = useState(false);

  // DICA: Inicializar com dados reais do Firebase
  const [userProfile, setUserProfile] = useState({
    name: userData?.displayName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: userData?.location || '',
    bio: userData?.bio || '',
    avatar: userData?.photoURL || user?.photoURL || ''
  });

  // DICA: Atualizar estado quando dados do Firebase chegarem
  useEffect(() => {
    if (userData) {
      setUserProfile({
        name: userData.displayName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        avatar: userData.photoURL || user?.photoURL || ''
      });
    }
  }, [userData, user]);

  const handleSaveProfile = async () => {
    try {
      // DICA: Salvar no Firebase
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: userProfile.name,
        phone: userProfile.phone,
        location: userProfile.location,
        bio: userProfile.bio,
        updatedAt: serverTimestamp()
      });
      
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    }
  };

  return (
    // JSX com dados reais
  );
}
```

## 🔒 Segurança e Regras do Firestore

```javascript
// firestore.rules - EXEMPLO DE REGRAS DE SEGURANÇA
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /habits/{userId}/userHabits/{habitId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /finances/{userId}/transactions/{transactionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Aplicar mesmo padrão para todas as coleções
  }
}
```

## 🎨 Melhorias de UX

### Loading States
```javascript
// components/LoadingSpinner.js - EXEMPLO DE LOADING
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);
```

### Error Handling
```javascript
// DICA: Implementar tratamento de erros
const ErrorBoundary = ({ children, fallback }) => {
  // Implementar error boundary para capturar erros
};
```

## 🚀 Checklist de Implementação

### Fase 1: Configuração Base
- [ ] Criar estrutura de dados no Firestore
- [ ] Implementar regras de segurança
- [ ] Criar hooks customizados para dados

### Fase 2: Dashboard
- [ ] Substituir dados mockados por dados reais
- [ ] Implementar loading states
- [ ] Conectar estatísticas ao Firebase
- [ ] Implementar hábitos dinâmicos

### Fase 3: Perfil
- [ ] Conectar informações pessoais ao Firebase
- [ ] Implementar edição de perfil
- [ ] Conectar estatísticas reais
- [ ] Implementar upload de avatar

### Fase 4: Otimizações
- [ ] Implementar cache local
- [ ] Otimizar queries do Firestore
- [ ] Implementar offline support
- [ ] Adicionar analytics

## 🔍 Dicas Importantes

1. **Performance**: Use `onSnapshot` apenas quando necessário, prefira `getDocs` para dados que não mudam frequentemente
2. **Segurança**: Sempre valide dados no cliente E no servidor
3. **UX**: Implemente loading states para melhor experiência
4. **Estrutura**: Mantenha a estrutura de dados normalizada
5. **Backup**: Implemente backup regular dos dados do usuário

## 📝 Notas Finais

Este guia fornece uma base sólida para integrar o Firebase com suas telas de Dashboard e Perfil. Lembre-se de adaptar os exemplos de código às suas necessidades específicas e sempre testar em ambiente de desenvolvimento antes de implementar em produção.

Os códigos apresentados são **exemplos e dicas de implementação** - você deve adaptá-los à sua arquitetura específica e às suas necessidades de negócio.