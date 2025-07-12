# Planly - Sistema de Gestão de Hábitos e Produtividade
## Guia de Integração Firebase (Dashboard + Hábitos)

---

## 🎯 CONTEXTO: O QUE A IA PRECISA FAZER

### **SITUAÇÃO ATUAL:**
- ✅ Sistema de autenticação (login/cadastro) já funciona
- ✅ Firebase Authentication configurado
- ✅ Usuários conseguem se cadastrar e fazer login
- ❌ Dashboard e tela de hábitos ainda não conectados ao usuário logado
- ❌ Dados estão estáticos (mockados)

### **OBJETIVO:**
**Conectar o dashboard e a tela de hábitos ao usuário autenticado, tornando os dados dinâmicos e personalizados para cada usuário.**

### **O QUE A IA VAI PRECISAR IMPLEMENTAR:**

1. **🔗 Capturar o usuário logado** no dashboard e hábitos
2. **🗄️ Criar/buscar dados específicos** de cada usuário no Firestore
3. **🔄 Substituir dados estáticos** por dados dinâmicos do Firebase
4. **⚡ Implementar atualizações em tempo real** 
5. **💾 Sincronizar ações do usuário** com o banco de dados

---

## 📋 ANÁLISE DAS TELAS ATUAIS

### 🏠 **DASHBOARD PRINCIPAL**
**Dados estáticos que precisam virar dinâmicos:**

| Elemento Atual | Precisa Conectar | Coleção Firebase |
|---|---|---|
| "Boa tarde, davi!" | Nome do usuário logado | `users/{userId}.name` |
| Hábitos Hoje: 7/10 | Contagem real dos hábitos | `users/{userId}/habits` + `habitLogs` |
| Saldo: R$ 2.847 | Dados financeiros reais | `users/{userId}/finances` |
| Humor: 8.2/10 | Média real do humor | `users/{userId}/mood` |
| Streak: 23 dias | Maior sequência real | Cálculo baseado em `habitLogs` |
| Lista de hábitos | Hábitos do usuário atual | `users/{userId}/habits` |
| Próximas tarefas | Tarefas do usuário atual | `users/{userId}/tasks` |

### 📊 **TELA DE HÁBITOS**
**Dados estáticos que precisam virar dinâmicos:**

| Elemento Atual | Precisa Conectar | Ação Necessária |
|---|---|---|
| Progresso: 50% | Cálculo real baseado nos hábitos | Contar hábitos completos vs total |
| Lista de 4 hábitos | Hábitos reais do usuário | Buscar de `users/{userId}/habits` |
| Streaks (23, 12, 8, 15 dias) | Sequências reais | Calcular baseado em `habitLogs` |
| Botão "Novo Hábito" | Criar hábito no Firebase | Adicionar em `users/{userId}/habits` |
| Marcar como completo | Atualizar no Firebase | Criar/atualizar `habitLogs` |

---

## 🗄️ ESTRUTURA DE DADOS FIREBASE

### **1. Coleção Principal: `users/{userId}`**
```json
{
  "id": "firebase_user_uid",
  "name": "davi",
  "email": "davi@email.com",
  "createdAt": "2025-07-10T10:00:00Z",
  "lastActive": "2025-07-10T15:30:00Z",
  "stats": {
    "totalHabits": 4,
    "currentStreak": 23,
    "longestStreak": 23,
    "totalCompletedHabits": 156
  }
}
```

### **2. Subcoleção: `users/{userId}/habits`**
```json
{
  "id": "habit_001",
  "name": "Exercitar-se",
  "category": "Saúde",
  "icon": "🏃‍♂️",
  "color": "#10B981",
  "schedule": {
    "time": "07:00",
    "days": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  },
  "target": 1,
  "unit": "vez",
  "currentStreak": 23,
  "longestStreak": 23,
  "isActive": true,
  "createdAt": "2025-06-15T10:00:00Z"
}
```

### **3. Subcoleção: `users/{userId}/habitLogs`**
```json
{
  "id": "log_001",
  "habitId": "habit_001",
  "date": "2025-07-10",
  "completed": true,
  "completedAt": "2025-07-10T07:15:00Z",
  "value": 1
}
```

### **4. Outras coleções necessárias:**
- `users/{userId}/finances` → Dados financeiros
- `users/{userId}/mood` → Registro de humor
- `users/{userId}/tasks` → Tarefas e agenda

---

## 🔧 PLANO DE IMPLEMENTAÇÃO

### **FASE 1: PREPARAÇÃO (30 min)**
1. **Verificar autenticação atual**
   - Confirmar que `auth.currentUser` está disponível
   - Verificar se o userId está sendo capturado
   - Testar proteção de rotas

2. **Configurar Firestore**
   - Verificar se as regras de segurança estão corretas
   - Testar conexão com o banco
   - Criar índices necessários

### **FASE 2: DASHBOARD CONECTADO (2-3 horas)**

#### **2.1 Substituir dados estáticos por dinâmicos**
```javascript
// ANTES (estático)
const userData = {
  name: "davi",
  habitsToday: 7,
  totalHabits: 10
};

// DEPOIS (dinâmico)
const { user } = useAuth(); // Hook já existente
const { dashboardData, loading } = useDashboard(user.uid);
```

#### **2.2 Implementar hooks personalizados**
- `useDashboard(userId)` → Buscar dados do dashboard
- `useHabitsToday(userId)` → Hábitos do dia atual
- `useUserStats(userId)` → Estatísticas do usuário

#### **2.3 Conectar cada seção:**
- **Saudação**: `users/{userId}.name`
- **Métricas**: Calcular em tempo real
- **Hábitos do dia**: Filtrar por data atual
- **Tarefas**: Buscar agenda do usuário

### **FASE 3: TELA DE HÁBITOS CONECTADA (2-3 horas)**

#### **3.1 Listar hábitos do usuário**
```javascript
// Substituir lista estática
const habits = [
  { name: "Exercitar-se", streak: 23 },
  // ...
];

// Por busca dinâmica
const { habits, loading } = useHabits(user.uid);
```

#### **3.2 Implementar CRUD completo**
- **Criar**: Adicionar novo hábito
- **Ler**: Listar hábitos do usuário
- **Atualizar**: Marcar como completo/editar
- **Deletar**: Remover hábito

#### **3.3 Cálculos dinâmicos**
- **Progresso diário**: Completos/Total
- **Streaks**: Dias consecutivos
- **Estatísticas**: Médias e totais

---

## 💡 DICAS ESPECÍFICAS DE IMPLEMENTAÇÃO

### **🔥 CAPTURAR USUÁRIO LOGADO**
```javascript
// Em cada tela, usar o hook de autenticação
const { user, loading } = useAuth();

// Verificar se usuário está logado
if (!user) {
  // Redirecionar para login ou mostrar loading
  return <LoginPage />;
}

// Usar o user.uid para buscar dados específicos
const userId = user.uid;
```

### **📊 HOOKS PERSONALIZADOS SUGERIDOS**

#### **1. useDashboard(userId)**
```javascript
// Retorna dados do dashboard em tempo real
const { 
  userName, 
  habitsToday, 
  totalHabits, 
  currentBalance, 
  moodAverage, 
  longestStreak,
  upcomingTasks,
  loading 
} = useDashboard(userId);
```

#### **2. useHabits(userId)**
```javascript
// Gerencia hábitos do usuário
const { 
  habits, 
  loading, 
  addHabit, 
  updateHabit, 
  deleteHabit, 
  toggleComplete 
} = useHabits(userId);
```

#### **3. useHabitLogs(userId, date)**
```javascript
// Gerencia logs de hábitos
const { 
  logs, 
  markAsComplete, 
  getHabitStatus, 
  calculateStreak 
} = useHabitLogs(userId, date);
```

### **⚡ ATUALIZAÇÕES EM TEMPO REAL**
```javascript
// Usar onSnapshot para dados que mudam frequentemente
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'users', userId, 'habits'),
    (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHabits(habitsData);
    }
  );
  
  return () => unsubscribe();
}, [userId]);
```

---

## 🎯 FUNCIONALIDADES ESPECÍFICAS

### **DASHBOARD - Transformações necessárias:**

#### **1. Saudação personalizada**
```javascript
// ANTES
"Boa tarde, davi!"

// DEPOIS
`Boa tarde, ${user.name}!`
```

#### **2. Contador de hábitos**
```javascript
// ANTES
"Hábitos Hoje: 7/10"

// DEPOIS
const completedToday = habitLogs.filter(log => 
  log.date === today && log.completed
).length;
const totalHabits = habits.length;
`Hábitos Hoje: ${completedToday}/${totalHabits}`
```

#### **3. Streak record**
```javascript
// ANTES
"Streak Record: 23 dias"

// DEPOIS
const longestStreak = Math.max(...habits.map(h => h.longestStreak));
`Streak Record: ${longestStreak} dias`
```

### **HÁBITOS - Transformações necessárias:**

#### **1. Marcar como completo**
```javascript
// Quando usuário clica no hábito
const toggleComplete = async (habitId) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Verificar se já foi completado hoje
  const existingLog = habitLogs.find(log => 
    log.habitId === habitId && log.date === today
  );
  
  if (existingLog) {
    // Atualizar log existente
    await updateDoc(doc(db, 'users', userId, 'habitLogs', existingLog.id), {
      completed: !existingLog.completed
    });
  } else {
    // Criar novo log
    await addDoc(collection(db, 'users', userId, 'habitLogs'), {
      habitId,
      date: today,
      completed: true,
      completedAt: new Date()
    });
  }
  
  // Recalcular streak
  await updateHabitStreak(habitId);
};
```

#### **2. Calcular progresso**
```javascript
// Progresso diário
const calculateDailyProgress = (habits, habitLogs) => {
  const today = new Date().toISOString().split('T')[0];
  const completedToday = habitLogs.filter(log => 
    log.date === today && log.completed
  ).length;
  
  return Math.round((completedToday / habits.length) * 100);
};
```

---

## 📋 CHECKLIST DETALHADO

### **✅ PRÉ-REQUISITOS**
- [ ] Autenticação funcionando
- [ ] Firebase configurado
- [ ] Usuário logado sendo capturado
- [ ] Rotas protegidas

### **✅ DASHBOARD**
- [ ] Saudação com nome do usuário
- [ ] Contador de hábitos dinâmico
- [ ] Saldo atual conectado
- [ ] Humor médio calculado
- [ ] Streak record dinâmico
- [ ] Lista de hábitos do dia
- [ ] Próximas tarefas carregadas
- [ ] Ações de completar funcionando

### **✅ HÁBITOS**
- [ ] Lista de hábitos do usuário
- [ ] Progresso calculado corretamente
- [ ] Streaks atualizados
- [ ] Botão "Novo Hábito" funcionando
- [ ] Edição de hábitos
- [ ] Exclusão de hábitos
- [ ] Marcar como completo
- [ ] Categorias organizadas

### **✅ FUNCIONALIDADES EXTRAS**
- [ ] Loading states
- [ ] Error handling
- [ ] Offline support
- [ ] Atualizações em tempo real
- [ ] Backup automático

---

## 🚨 PONTOS CRÍTICOS

### **1. Gerenciamento de Estado**
- Usar Context API ou Redux para dados globais
- Implementar loading states em todas as telas
- Tratar erros de conexão

### **2. Performance**
- Usar `useMemo` para cálculos pesados
- Implementar lazy loading
- Otimizar consultas do Firebase

### **3. Segurança**
- Validar dados antes de salvar
- Sanitizar inputs do usuário
- Implementar rate limiting

---

## 🎨 MELHORIAS RECOMENDADAS

### **UX/UI**
- Skeleton loading para dados carregando
- Animações suaves ao marcar hábitos
- Feedback visual para ações do usuário
- Modo offline com sincronização

### **Funcionalidades**
- Notificações push para hábitos
- Gráficos de progresso
- Metas personalizadas
- Integração com calendário

### **Analytics**
- Rastrear engajamento do usuário
- Métricas de conclusão de hábitos
- Relatórios de produtividade

---

## 💻 PRÓXIMOS PASSOS

1. **Implementar hooks de autenticação** nas duas telas
2. **Substituir dados estáticos** por consultas Firebase
3. **Testar cada funcionalidade** individualmente
4. **Implementar atualizações em tempo real**
5. **Adicionar tratamento de erros** e loading states
6. **Otimizar performance** e experiência do usuário

---

**🎯 OBJETIVO FINAL**: Transformar o Planly de um sistema com dados estáticos em uma aplicação completamente dinâmica, onde cada usuário tem seus próprios dados personalizados e atualizados em tempo real.