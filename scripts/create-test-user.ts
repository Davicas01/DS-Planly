// Script para criar usuário de teste no Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseFirestore } from '../lib/firebaseClient'

const createTestUser = async () => {
  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseFirestore()
    
    const email = 'test@example.com'
    const password = '123456'
    
    console.log('Criando usuário de teste...')
    
    // Tentar criar usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    console.log('Usuário criado com sucesso:', user.uid)
    
    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: 'Test User',
      createdAt: new Date(),
      onboardingCompleted: false
    })
    
    console.log('Documento do usuário criado no Firestore')
    
    return user
  } catch (error: any) {
    console.log('Erro ao criar usuário (pode já existir):', error.code)
    
    if (error.code === 'auth/email-already-in-use') {
      console.log('Usuário já existe, tentando fazer login...')
      
      try {
        const auth = getFirebaseAuth()
        const userCredential = await signInWithEmailAndPassword(auth, 'test@example.com', '123456')
        console.log('Login realizado com sucesso:', userCredential.user.uid)
        return userCredential.user
      } catch (loginError: any) {
        console.error('Erro no login:', loginError)
        throw loginError
      }
    }
    
    throw error
  }
}

// Executar apenas no cliente
if (typeof window !== 'undefined') {
  createTestUser().catch(console.error)
}

export default createTestUser
