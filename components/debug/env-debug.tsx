"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

interface EnvStatus {
  name: string
  value: string | undefined
  isSet: boolean
  preview: string
}

export function EnvDebugComponent() {
  const [envStatus, setEnvStatus] = useState<EnvStatus[]>([])
  const [isClient, setIsClient] = useState(false)
  const [copied, setCopied] = useState(false)

  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID', 
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]

  useEffect(() => {
    setIsClient(true)
    checkEnvVars()
  }, [])

  const checkEnvVars = () => {
    const status = requiredVars.map(varName => {
      const value = process.env[varName]
      return {
        name: varName,
        value,
        isSet: !!value,
        preview: value ? `${value.substring(0, 15)}...` : 'undefined'
      }
    })
    setEnvStatus(status)
  }

  const copyToClipboard = async () => {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      platform: typeof window !== 'undefined' ? 'Client' : 'Server',
      variables: envStatus.map(env => ({
        name: env.name,
        status: env.isSet ? 'SET' : 'MISSING',
        preview: env.preview
      }))
    }
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!isClient) {
    return <div>Loading debug info...</div>
  }

  const missingVars = envStatus.filter(env => !env.isSet)
  const allSet = missingVars.length === 0

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allSet ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          Firebase Environment Variables Debug
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant={allSet ? "default" : "destructive"}>
            {allSet ? "✅ All Variables Set" : `❌ ${missingVars.length} Missing`}
          </Badge>
          <Badge variant="outline">
            Environment: {process.env.NODE_ENV}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!allSet && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">🚨 Action Required</h3>
            <p className="text-red-700 mb-3">
              Missing environment variables detected. Follow these steps:
            </p>
            <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
              <li>Go to <strong>vercel.com/dashboard</strong></li>
              <li>Select your <strong>DS-Planly</strong> project</li>
              <li>Navigate to <strong>Settings → Environment Variables</strong></li>
              <li>Add the missing variables with <strong>NEXT_PUBLIC_</strong> prefix</li>
              <li>Select <strong>Production, Preview, Development</strong> for each</li>
              <li>Redeploy your application</li>
            </ol>
          </div>
        )}

        <div className="grid gap-3">
          {envStatus.map((env) => (
            <div 
              key={env.name}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                env.isSet 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex-1">
                <code className="text-sm font-mono">{env.name}</code>
                <div className="text-xs text-gray-600 mt-1">
                  Value: <span className="font-mono">{env.preview}</span>
                </div>
              </div>
              <Badge variant={env.isSet ? "default" : "destructive"}>
                {env.isSet ? "✅ SET" : "❌ MISSING"}
              </Badge>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={checkEnvVars} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={copyToClipboard} variant="outline" size="sm">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy Debug Info"}
          </Button>
        </div>

        {!allSet && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Quick Copy Values</h3>
            <div className="text-xs font-mono bg-white p-3 rounded border space-y-1">
              <div>NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAf1IlS8gcXIVhDMXbmLGdt0t-Y-wtM7mw</div>
              <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dsplanly.firebaseapp.com</div>
              <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID=dsplanly</div>
              <div>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dsplanly.appspot.com</div>
              <div>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=141441112536</div>
              <div>NEXT_PUBLIC_FIREBASE_APP_ID=1:141441112536:web:35c449bc3c7b0db365faad</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EnvDebugComponent