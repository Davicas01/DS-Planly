'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Shield, User, CheckCircle } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredLevel?: 'public' | 'authenticated' | 'onboarded'
  fallback?: React.ReactNode
  showStatus?: boolean
}

// Componente de Loading personalizado
const AuthLoadingSpinner = ({ status }: { status?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <Card className="w-full max-w-md">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <Shield className="h-4 w-4 text-blue-400 absolute top-2 left-2" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Verificando Autenticação
            </h3>
            <p className="text-sm text-gray-600">
              {status || 'Carregando dados do usuário...'}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Componente de Status do Usuário
const UserStatusIndicator = ({ userStatus }: { userStatus: any }) => (
  <div className="fixed bottom-4 right-4 z-50">
    <Card className="w-80 bg-white shadow-lg border">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="font-medium">Status de Autenticação</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {userStatus.isAuthenticated ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-gray-300" />
            )}
            <span className="text-sm">
              {userStatus.isAuthenticated ? 'Autenticado' : 'Não autenticado'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {userStatus.isOnboardingComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-gray-300" />
            )}
            <span className="text-sm">
              {userStatus.isOnboardingComplete ? 'Onboarding completo' : 'Onboarding pendente'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {userStatus.isProfileComplete ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-gray-300" />
            )}
            <span className="text-sm">
              {userStatus.isProfileComplete ? 'Perfil completo' : 'Perfil incompleto'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

// Componente de Acesso Negado
const AccessDenied = ({ requiredLevel }: { requiredLevel: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
    <Card className="w-full max-w-md">
      <CardContent className="p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acesso Negado
            </h3>
            <p className="text-sm text-gray-600">
              Você não tem permissão para acessar esta página.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Nível necessário: {requiredLevel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
)

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredLevel = 'public', 
  fallback,
  showStatus = false 
}) => {
  const { user, loading } = useAuth()
  const { userStatus } = useAuthRedirect()
  const [hasAccess, setHasAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAccess = () => {
      if (loading) {
        setIsChecking(true)
        return
      }

      let access = false

      switch (requiredLevel) {
        case 'public':
          access = true
          break
        case 'authenticated':
          access = userStatus.isAuthenticated
          break
        case 'onboarded':
          access = userStatus.isAuthenticated && userStatus.isOnboardingComplete
          break
      }

      setHasAccess(access)
      setIsChecking(false)
    }

    checkAccess()
  }, [user, loading, userStatus, requiredLevel])

  // Mostrar loading durante verificação
  if (isChecking || loading) {
    return fallback || <AuthLoadingSpinner status="Verificando permissões..." />
  }

  // Mostrar acesso negado se não tiver permissão
  if (!hasAccess) {
    return fallback || <AccessDenied requiredLevel={requiredLevel} />
  }

  // Renderizar conteúdo com status opcional
  return (
    <>
      {children}
      {showStatus && process.env.NODE_ENV === 'development' && (
        <UserStatusIndicator userStatus={userStatus} />
      )}
    </>
  )
}

export default AuthGuard
