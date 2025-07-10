# Configuração de Variáveis de Ambiente na Vercel

## Problema Identificado

O erro `Firebase configuration is invalid or incomplete` e `auth/invalid-api-key` indica que as variáveis de ambiente do Firebase não estão sendo carregadas corretamente na Vercel.

## Solução: Configurar Variáveis de Ambiente na Vercel

### 1. Acessar o Painel da Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login na sua conta
3. Selecione o projeto **DS-Planly**
4. Vá para **Settings** → **Environment Variables**

### 2. Adicionar as Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente **EXATAMENTE** como mostrado abaixo:

| Nome da Variável | Valor | Ambientes |
|------------------|-------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyAf1IlS8gcXIVhDMXbmLGdt0t-Y-wtM7mw` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `dsplanly.firebaseapp.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `dsplanly` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `dsplanly.appspot.com` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `141441112536` | Production, Preview, Development |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:141441112536:web:35c449bc3c7b0db365faad` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

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

### 4. Após Adicionar as Variáveis

1. **Redeploy Obrigatório**: Após adicionar/modificar variáveis de ambiente, você **DEVE** fazer um novo deploy
2. **Trigger Deploy**: Vá para **Deployments** → **Redeploy** ou faça um novo commit
3. **Verificar Logs**: Monitore os logs de build para confirmar que as variáveis estão sendo carregadas

### 5. Verificação

Após o deploy, você deve ver nos logs do console:
```
Firebase Config Validation: true
Firebase app initialized successfully
```

Se ainda houver erro, você verá:
```
Firebase configuration is invalid or incomplete
Missing environment variables: { ... }
```

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

## Resumo dos Passos

1. ✅ Acessar Vercel → Settings → Environment Variables
2. ✅ Adicionar todas as 6 variáveis NEXT_PUBLIC_FIREBASE_*
3. ✅ Selecionar Production, Preview, Development para cada uma
4. ✅ Fazer redeploy do projeto
5. ✅ Verificar logs para confirmar sucesso

Após seguir estes passos, o erro de Firebase na Vercel deve ser resolvido.