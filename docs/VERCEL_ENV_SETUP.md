# 🚨 URGENTE: Configuração de Variáveis de Ambiente na Vercel

## ❌ Problema Atual

O erro `Firebase configuration is invalid or incomplete` e `auth/invalid-api-key` indica que **as variáveis de ambiente do Firebase NÃO estão configuradas na Vercel**.

**Status atual**: ❌ Variáveis ausentes na Vercel  
**Impacto**: 🔥 Aplicação não funciona em produção

## Solução: Configurar Variáveis de Ambiente na Vercel

### 1. Acessar o Painel da Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Selecione o projeto **DS-Planly**
4. Vá para **Settings** → **Environment Variables**

### 2. ⚡ AÇÃO IMEDIATA: Adicionar as Variáveis

**🔥 COPIE E COLE EXATAMENTE:**

```
Nome: NEXT_PUBLIC_FIREBASE_API_KEY
Valor: AIzaSyAf1IlS8gcXIVhDMXbmLGdt0t-Y-wtM7mw
Ambientes: ✅ Production ✅ Preview ✅ Development

Nome: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
Valor: dsplanly.firebaseapp.com
Ambientes: ✅ Production ✅ Preview ✅ Development

Nome: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Valor: dsplanly
Ambientes: ✅ Production ✅ Preview ✅ Development

Nome: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Valor: dsplanly.appspot.com
Ambientes: ✅ Production ✅ Preview ✅ Development

Nome: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Valor: 141441112536
Ambientes: ✅ Production ✅ Preview ✅ Development

Nome: NEXT_PUBLIC_FIREBASE_APP_ID
Valor: 1:141441112536:web:35c449bc3c7b0db365faad
Ambientes: ✅ Production ✅ Preview ✅ Development
```

### 3. Pontos Importantes

#### ✅ **OBRIGATÓRIO: Prefixo NEXT_PUBLIC_**
- Todas as variáveis do Firebase **DEVEM** ter o prefixo `NEXT_PUBLIC_`
- Sem este prefixo, o Next.js não disponibiliza as variáveis no client-side
- Este é o motivo principal do erro atual

#### ✅ **Selecionar Todos os Ambientes**
- Marque **Production**, **Preview** e **Development** para cada variável
- Isso garante que funcionem em todos os tipos de deploy

#### ✅ **Valores Exatos**
- Copie os valores exatamente como estão no arquivo `.env.local`
- Não adicione espaços ou caracteres extras

### 4. 🚀 REDEPLOY OBRIGATÓRIO

**⚠️ CRÍTICO**: Variáveis só funcionam após redeploy!

**Opção 1 - Via Vercel Dashboard:**
1. Vá para **Deployments**
2. Clique nos 3 pontos do último deploy
3. Selecione **Redeploy**
4. Confirme o redeploy

**Opção 2 - Via Git (Recomendado):**
```bash
git commit --allow-empty -m "trigger redeploy for env vars"
git push
```

### 5. ✅ Verificação de Sucesso

**✅ SUCESSO - Você deve ver:**
```
Firebase Config Validation: true
Firebase app initialized successfully
```

**❌ AINDA COM ERRO - Você verá:**
```
Firebase Config Validation: false
Firebase configuration is invalid or incomplete
Missing environment variables: { ... }
```

**🔧 Se ainda houver erro:**
1. Verifique se TODAS as 6 variáveis foram adicionadas
2. Confirme que selecionou Production, Preview E Development
3. Faça outro redeploy
4. Execute o script de debug: `node debug-env.js`

### 6. Comandos para Testar Localmente

```bash
# Verificar se as variáveis estão carregadas
vercel env pull

# Testar build local
npm run build

# Testar em modo de desenvolvimento
npm run dev
```

### 7. Troubleshooting

#### Se o erro persistir:

1. **Verificar Nomes**: Confirme que os nomes das variáveis estão exatos (case-sensitive)
2. **Verificar Valores**: Confirme que não há espaços extras nos valores
3. **Verificar Ambientes**: Certifique-se de que selecionou todos os ambientes
4. **Redeploy**: Sempre faça um novo deploy após modificar variáveis
5. **Cache**: Limpe o cache do browser e tente novamente

#### Comandos de Debug:

```bash
# Ver variáveis de ambiente no build
vercel logs [deployment-url]

# Verificar se as variáveis estão sendo carregadas
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
```

### 8. Segurança

- ✅ **Variáveis NEXT_PUBLIC_ são seguras**: Elas são destinadas ao client-side
- ✅ **Firebase Client SDK**: Usa apenas chaves públicas para identificar o projeto
- ✅ **Regras de Segurança**: A segurança real vem das regras do Firestore/Auth
- ❌ **Nunca use NEXT_PUBLIC_** para chaves privadas ou tokens de admin

---

## 🎯 CHECKLIST OBRIGATÓRIO

### Antes do Redeploy:
- [ ] ✅ Acessei vercel.com/dashboard
- [ ] ✅ Selecionei projeto DS-Planly  
- [ ] ✅ Fui em Settings → Environment Variables
- [ ] ✅ Adicionei NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] ✅ Adicionei NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] ✅ Adicionei NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] ✅ Adicionei NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] ✅ Adicionei NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] ✅ Adicionei NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] ✅ Selecionei Production, Preview, Development para TODAS

### Após Adicionar:
- [ ] ✅ Fiz redeploy via Vercel ou git push
- [ ] ✅ Aguardei deploy completar (2-3 minutos)
- [ ] ✅ Verifiquei logs do console
- [ ] ✅ Vi "Firebase Config Validation: true"

### Se Ainda Houver Erro:
- [ ] ✅ Executei `node debug-env.js` para debug
- [ ] ✅ Verifiquei se todas variáveis estão na Vercel
- [ ] ✅ Fiz novo redeploy
- [ ] ✅ Limpei cache do browser

---

## 🆘 SUPORTE EMERGENCIAL

Se o erro persistir após seguir TODOS os passos:

1. **Screenshot**: Tire print da tela de Environment Variables na Vercel
2. **Logs**: Copie os logs completos do erro
3. **Debug**: Execute `node debug-env.js` e copie o resultado
4. **Contato**: Envie essas informações para suporte

**⏰ Tempo estimado para resolução**: 5-10 minutos após configurar as variáveis