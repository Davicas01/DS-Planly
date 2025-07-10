"use client"

import EnvDebugComponent from '@/components/debug/env-debug'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function DebugEnvPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Firebase Environment Variables Debug
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page helps you diagnose Firebase environment variable issues in your Vercel deployment.
            Use this to verify that all required variables are properly configured.
          </p>
        </div>

        <EnvDebugComponent />

        <div className="mt-8 bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium">Vercel Dashboard</h3>
              <p className="text-sm text-gray-600">
                Configure environment variables in your Vercel project settings.
              </p>
              <a 
                href="https://vercel.com/dashboard" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Open Vercel Dashboard
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Documentation</h3>
              <p className="text-sm text-gray-600">
                Step-by-step guide to fix environment variable issues.
              </p>
              <Link 
                href="/VERCEL_ENV_SETUP.md" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                View Setup Guide
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Environment variables require a redeploy to take effect</li>
            <li>• All Firebase variables must have the <code>NEXT_PUBLIC_</code> prefix</li>
            <li>• Variables must be set for Production, Preview, and Development environments</li>
            <li>• This debug page should be removed before production deployment</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Debug page created for Firebase environment variable troubleshooting</p>
          <p>Access this page at: <code>/debug-env</code></p>
        </div>
      </div>
    </div>
  )
}