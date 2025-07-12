"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2, UserPlus } from 'lucide-react'
import { useFirebaseAuth } from '@/hooks/use-firebase-auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebaseClient'

export default function DebugFirebasePage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('123456')
  const [testResults, setTestResults] = useState<any[]>([])
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [createUserMessage, setCreateUserMessage] = useState('')
  const { signIn, loading, error, user } = useFirebaseAuth()

  useEffect(() => {
    const results = []
    
    // Test 1: Environment Variables
    const envVars = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }
    
    Object.entries(envVars).forEach(([key, value]) => {
      results.push({
        name: key,
        status: value ? 'success' : 'error',
        message: value ? 'Definido' : 'Faltando',
        value: value ? `${value.substring(0, 20)}...` : 'N/A'
      })
    })
    
    setTestResults(results)
  }, [])

  const handleTestLogin = async () => {
    try {
      console.log('=== TESTE DE LOGIN ===')
      console.log('Email:', email)
      console.log('Password length:', password.length)
      
      await signIn(email, password)
      console.log('Login test completed')
    } catch (error) {
      console.error('Login test failed:', error)
    }
  }

  const handleCreateTestUser = async () => {
    setIsCreatingUser(true)
    setCreateUserMessage('')
    
    try {
      console.log('=== CRIANDO USUÁRIO DE TESTE ===')
      const auth = getFirebaseAuth()
      const db = getFirebaseFirestore()
      
      console.log('Firebase Auth:', !!auth)
      console.log('Firebase Firestore:', !!db)
      
      // Tentar criar usuário
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const newUser = userCredential.user
      
      console.log('Usuário criado com sucesso:', newUser.uid)
      
      // Criar documento do usuário no Firestore
      await setDoc(doc(db, 'users', newUser.uid), {
        email: newUser.email,
        displayName: 'Test User',
        createdAt: new Date(),
        onboardingCompleted: false
      })
      
      console.log('Documento do usuário criado no Firestore')
      setCreateUserMessage('✅ Usuário de teste criado com sucesso!')
      
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error)
      
      if (error.code === 'auth/email-already-in-use') {
        setCreateUserMessage('ℹ️ Usuário já existe, pode tentar fazer login')
      } else {
        setCreateUserMessage('❌ Erro ao criar usuário: ' + error.message)
      }
    } finally {
      setIsCreatingUser(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔥 Debug Firebase Configuration</CardTitle>
          <CardDescription>
            Verificação sistemática da configuração Firebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-semibold">Variáveis de Ambiente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                  {getStatusIcon(result.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{result.name}</p>
                    <p className="text-sm text-gray-500 truncate">{result.value}</p>
                  </div>
                  <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                    {result.message}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔐 Teste de Autenticação</CardTitle>
          <CardDescription>
            Teste de login com debug detalhado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="123456"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleTestLogin}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando Login...
                  </>
                ) : (
                  'Testar Login'
                )}
              </Button>
              
              <Button 
                onClick={handleCreateTestUser}
                disabled={isCreatingUser}
                variant="outline"
                className="flex-1"
              >
                {isCreatingUser ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Usuário Teste
                  </>
                )}
              </Button>
            </div>
            
            {createUserMessage && (
              <div className={`p-3 border rounded ${
                createUserMessage.includes('✅') ? 'bg-green-50 border-green-200' :
                createUserMessage.includes('ℹ️') ? 'bg-blue-50 border-blue-200' :
                'bg-red-50 border-red-200'
              }`}>
                <p className="text-sm">{createUserMessage}</p>
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            {user && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">
                  ✅ Login bem-sucedido! UID: {user.uid}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📋 Checklist de Verificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Credenciais estão corretas no Firebase Console</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Usuário existe no Firebase Authentication</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Email/senha não possuem espaços extras</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Método de autenticação está habilitado no Firebase Console</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Domínio está autorizado no Firebase Console</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Variáveis de ambiente estão corretas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
