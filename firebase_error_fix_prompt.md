# PROMPT COMPLETO PARA IA RESOLVER ERRO FIREBASE SAAS

## 📋 CONTEXTO DO PROBLEMA
Sou desenvolvedor de um SaaS em Next.js hospedado na Vercel e estou enfrentando um erro crítico de configuração do Firebase que está impedindo o funcionamento da aplicação em produção. O erro ocorre porque as variáveis de ambiente do Firebase não estão sendo encontradas.

## 🔥 ERROS ESPECÍFICOS ENCONTRADOS
```
Missing environment variables:
- NEXT_PUBLIC_FIREBASE_API_KEY: 'MISSING'
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'MISSING' 
- NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'MISSING'
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'MISSING'
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'MISSING'

Firebase configuration is invalid or incomplete
Uncaught Error: Firebase configuration is invalid. Please check your environment variables in Vercel.
```

## 🎯 SOLICITAÇÃO ESPECÍFICA PARA IA
Preciso que você me forneça um plano de ação completo e detalhado para resolver este erro, incluindo:

1. **DIAGNÓSTICO COMPLETO**: Analise exatamente o que está causando o erro
2. **SOLUÇÃO PASSO A PASSO**: Instruções precisas para correção
3. **CÓDIGO NECESSÁRIO**: Exemplos de código para implementar
4. **CONFIGURAÇÕES VERCEL**: Como configurar as variáveis no ambiente
5. **VALIDAÇÃO**: Como verificar se foi corrigido
6. **PREVENÇÃO**: Como evitar que aconteça novamente

## 🛠️ INFORMAÇÕES TÉCNICAS DO PROJETO
- **Framework**: Next.js (versão mais recente)
- **Hospedagem**: Vercel
- **Banco de dados**: Firebase (Firestore)
- **Autenticação**: Firebase Auth
- **Ambiente**: Produção e desenvolvimento
- **Tipo de aplicação**: SaaS com autenticação de usuários

## 🚨 URGÊNCIA E IMPACTO
Este erro está:
- ❌ Impedindo login de usuários
- ❌ Bloqueando funcionalidades principais do SaaS
- ❌ Causando perda de receita
- ❌ Prejudicando experiência do usuário

## 📝 FORMATO DE RESPOSTA ESPERADO
Organize sua resposta da seguinte forma:

### 1. DIAGNÓSTICO DO PROBLEMA
Explique exatamente o que está acontecendo e por que.

### 2. SOLUÇÃO IMEDIATA (EMERGENCIAL)
Passos para resolver rapidamente em produção.

### 3. CONFIGURAÇÃO DETALHADA
Instruções completas para cada etapa:
- Onde encontrar as credenciais Firebase
- Como configurar no Vercel
- Códigos necessários
- Arquivos a serem modificados

### 4. CÓDIGO COMPLETO
Forneça exemplos completos de:
- Arquivo de configuração Firebase
- Validação de variáveis
- Tratamento de erros
- Arquivo .env.example

### 5. VERIFICAÇÃO E TESTES
Como testar se a correção funcionou:
- Checklist de verificação
- Comandos para testar
- Sinais de que está funcionando

### 6. PREVENÇÃO FUTURA
- Boas práticas para evitar o erro
- Configurações recomendadas
- Monitoramento e alertas

## 🔧 REQUISITOS ESPECÍFICOS
- Soluções devem funcionar em produção (Vercel)
- Manter segurança das credenciais
- Compatível com Next.js App Router
- Funcionar em ambientes de desenvolvimento e produção
- Incluir tratamento de erros robusto

## 📋 CHECKLIST DE ENTREGA
Confirme que sua resposta inclui:
- [ ] Diagnóstico preciso do problema
- [ ] Solução passo a passo detalhada
- [ ] Código completo funcional
- [ ] Instruções de configuração Vercel
- [ ] Método de verificação
- [ ] Prevenção de problemas futuros
- [ ] Tempo estimado para implementação

## 🚀 OBJETIVO FINAL
Quero que após seguir suas instruções, meu SaaS esteja funcionando perfeitamente em produção, com todos os usuários conseguindo fazer login e usar todas as funcionalidades sem qualquer erro relacionado ao Firebase.

**IMPORTANTE**: Seja extremamente específico e detalhado. Preciso de uma solução completa que funcione 100% na primeira tentativa, pois cada minuto offline representa perda de receita para o SaaS.