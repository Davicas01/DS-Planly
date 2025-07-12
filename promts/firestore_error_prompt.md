# Prompt para IA: Correção de Erros Firebase Firestore e JavaScript

## Contexto do Problema

Estou enfrentando múltiplos erros em uma aplicação Next.js 15.2.4 que usa Firebase Firestore. Os erros são:

### 1. Erro de Índice do Firestore
```
FirebaseError: [code=failed-precondition]: The query requires an index. 
You can create it here: https://console.firebase.google.com/v1/r/project/dsplanly/firestore/indexes?create_composite=CkZwcm9qZWN0cy9kc3BsYW5seS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvdGFza3MvaW5kZXhlcy9fEAEaCAoEZGF0ZRABGggKBHRpbWUQARoMCghfX25hbWVfXxAB
```

### 2. Erro de JavaScript
```
Error: Cannot read properties of undefined (reading 'filter')
```
Localização: `app\dashboard\page.tsx (66:30)`

Código problemático:
```javascript
const todayHabits = habits.filter(habit => !habit.archived)
```

## Solicitação para IA

Por favor, me ajude a:

1. **Resolver o erro de índice do Firestore:**
   - Decodificar o link de criação de índice fornecido
   - Explicar qual consulta está causando o problema
   - Mostrar como criar o índice necessário
   - Fornecer alternativas para evitar a necessidade do índice
   - **CONECTAR:** Mostrar como a falta de índice impacta a performance e causa falhas

2. **Corrigir o erro de JavaScript:**
   - Identificar por que a variável `habits` está undefined
   - Mostrar como implementar verificações de segurança
   - Sugerir padrões de carregamento de dados assíncronos
   - Implementar tratamento de estado de loading
   - **CONECTAR:** Explicar como dados assíncronos causam erros de undefined

3. **Melhorar a arquitetura do código:**
   - Sugerir padrões de tratamento de erros
   - Implementar states de loading e error
   - Mostrar como usar React hooks adequadamente
   - Criar componentes mais robustos
   - **CONECTAR:** Demonstrar como erros em cascata afetam a UX

4. **Configuração do Firebase:**
   - Verificar se há problemas na configuração
   - Sugerir melhores práticas para queries
   - Implementar cache offline se necessário
   - **CONECTAR:** Mostrar como configuração inadequada gera múltiplos erros

## Dicas Específicas para Conectar os Erros

### 🔗 Como os Erros Estão Conectados:

1. **Cadeia de Problemas:**
   - Query do Firestore falha (falta de índice)
   - Dados não carregam corretamente
   - Variável `habits` fica undefined
   - Interface quebra ao tentar usar `.filter()`

2. **Ordem de Investigação:**
   - Primeiro: Verificar se dados estão chegando do Firebase
   - Segundo: Implementar tratamento de loading states
   - Terceiro: Criar índices necessários
   - Quarto: Adicionar error boundaries

3. **Pontos de Falha Comuns:**
   - Dados assíncronos sem tratamento adequado
   - Falta de verificação de estados de carregamento
   - Queries complexas sem índices
   - Ausência de fallbacks para dados undefined

### 🎯 Estratégias de Debugging:

1. **Console.log estratégico:**
   ```javascript
   console.log('Habits state:', habits)
   console.log('Loading state:', loading)
   console.log('Error state:', error)
   ```

2. **Verificar fluxo de dados:**
   - Firebase connection status
   - Query execution
   - State updates
   - Component re-renders

3. **Implementar defensive programming:**
   - Optional chaining (`?.`)
   - Nullish coalescing (`??`)
   - Default values
   - Type guards

## Informações Adicionais

- **Framework:** Next.js 15.2.4
- **Firebase:** @firebase/firestore 4.8.0
- **Coleção:** `tasks`
- **Campos envolvidos:** `date`, `time`, `__name__`
- **Funcionalidade:** Dashboard com estatísticas de hábitos

## Formato de Resposta Desejado

1. **Análise de Conexão dos Erros** (como se relacionam)
2. **Diagnóstico Passo-a-Passo** (ordem de investigação)
3. **Solução Imediata** (código corrigido com explicações)
4. **Implementação Robusta** (código melhorado com tratamento de erros)
5. **Configuração do Firebase** (índices e rules)
6. **Debugging Tools** (como investigar problemas similares)
7. **Prevenção Futura** (boas práticas e padrões)

### 📋 Checklist de Verificação:
- [ ] Dados chegando do Firebase?
- [ ] Estados de loading implementados?
- [ ] Índices criados corretamente?
- [ ] Error boundaries configurados?
- [ ] Defensive programming aplicado?
- [ ] Performance otimizada?

Por favor, forneça código completo e funcional, com comentários explicativos, estratégias de debugging e considerações de performance e UX.