# Prompt para Resolver Erros Firebase

## Contexto dos Erros

Você está debugando uma aplicação Next.js 15.2.4 com Firebase Authentication e Firestore que apresenta os seguintes erros:

1. **FirebaseError: Firebase: Error (auth/invalid-credential)** - Erro de autenticação
2. **FirebaseError: Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore** - Erro do Firestore

## Instruções de Debugging

### 1. Para o Erro de Autenticação (auth/invalid-credential)

**Verifique sistematicamente:**

```javascript
// 1. Configuração do Firebase
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Definido' : '✗ Faltando',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Definido' : '✗ Faltando',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Definido' : '✗ Faltando',
  // ... outras configurações
});

// 2. Validação dos dados de entrada
const handleSubmit = async (email, password) => {
  // Debug dos dados
  console.log('Dados de login:', {
    email: email?.trim(),
    emailLength: email?.length,
    hasPassword: !!password,
    passwordLength: password?.length
  });
  
  // Validações básicas
  if (!email || !password) {
    console.error('Email ou senha faltando');
    return;
  }
  
  if (!email.includes('@')) {
    console.error('Email inválido');
    return;
  }
  
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    console.log('Login bem-sucedido:', result.user.uid);
  } catch (error) {
    console.error('Erro detalhado:', {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString()
    });
  }
};
```

**Checklist de verificação:**
- [ ] Credenciais estão corretas no Firebase Console
- [ ] Usuário existe no Firebase Authentication
- [ ] Email/senha não possuem espaços extras
- [ ] Método de autenticação está habilitado no Firebase Console
- [ ] Domínio está autorizado no Firebase Console
- [ ] Variáveis de ambiente estão corretas

### 2. Para o Erro do Firestore Collection

**Identifique o problema:**

```javascript
// ❌ Erro comum - auth não inicializado
const db = getFirestore(); // Sem app específico
const collectionRef = collection(db, 'users'); // Pode falhar se db não estiver pronto

// ✅ Solução correta
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Aguarde a inicialização antes de usar
const useFirestore = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    if (db) {
      setIsReady(true);
    }
  }, []);
  
  return { db, isReady };
};

// Use apenas quando pronto
if (isReady) {
  const collectionRef = collection(db, 'users');
}
```

**Debug do Firestore:**

```javascript
// Adicione logs para identificar quando o erro ocorre
console.log('Firestore instance:', db);
console.log('Is Firestore ready:', !!db);

try {
  const collectionRef = collection(db, 'collection-name');
  console.log('Collection reference created successfully');
} catch (error) {
  console.error('Erro ao criar referência da collection:', {
    error: error.message,
    dbInstance: !!db,
    dbType: typeof db
  });
}
```

## Código de Exemplo Completo para Debugging

```javascript
// hooks/use-firebase-auth-safe.ts
import { useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug da inicialização
  useEffect(() => {
    console.log('Firebase Auth inicializado:', !!auth);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Estado de autenticação mudou:', !!user);
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Debug detalhado
      console.log('Tentativa de login:', {
        email: email?.trim(),
        hasPassword: !!password,
        authInstance: !!auth
      });
      
      const result = await signInWithEmailAndPassword(
        auth, 
        email.trim(), 
        password
      );
      
      console.log('Login bem-sucedido:', result.user.uid);
      return result;
      
    } catch (error: any) {
      console.error('Erro completo de autenticação:', {
        code: error.code,
        message: error.message,
        details: error,
        timestamp: new Date().toISOString()
      });
      
      // Tratamento específico de erros
      switch (error.code) {
        case 'auth/invalid-credential':
          setError('Email ou senha incorretos');
          break;
        case 'auth/user-not-found':
          setError('Usuário não encontrado');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta');
          break;
        default:
          setError('Erro de autenticação: ' + error.message);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signIn };
};
```

## Passos de Resolução Ordenados

1. **Verifique as variáveis de ambiente** (.env.local)
2. **Confirme a configuração do Firebase** (lib/firebase.ts)
3. **Teste com credenciais conhecidas** (usuário que existe)
4. **Verifique inicialização do Firestore** antes de usar collections
5. **Adicione logs detalhados** para identificar o ponto exato do erro
6. **Teste em ambiente de desenvolvimento** isoladamente

## Comandos de Teste

```bash
# Verifique se as variáveis estão sendo carregadas
npm run dev
# No console do navegador, digite:
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

# Limpe cache se necessário
rm -rf .next
npm run dev
```

Execute este debugging sistemático e reporte quais logs aparecem no console para identificar a causa raiz dos erros.