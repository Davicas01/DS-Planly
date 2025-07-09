import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Planly - Sua vida, organizada e inteligente",
  description:
    "Super app PWA de organização pessoal que unifica hábitos, finanças, saúde e bem-estar em uma única plataforma inteligente.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Planly",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192x192.png", sizes: "192x192", type: "image/png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Planly" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                      
                      // Check for updates
                      registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New version available
                            if (confirm('Nova versão disponível! Deseja atualizar?')) {
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }
                          }
                        });
                      });
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
              
              // PWA install prompt
              let deferredPrompt;
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                // Show install button after 30 seconds
                setTimeout(() => {
                  if (deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
                    const installBanner = document.createElement('div');
                    installBanner.innerHTML = \`
                      <div style="position: fixed; bottom: 20px; left: 20px; right: 20px; background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                          <div style="font-weight: 600; margin-bottom: 4px;">Instalar Planly</div>
                          <div style="font-size: 14px; opacity: 0.9;">Acesse rapidamente do seu celular</div>
                        </div>
                        <div>
                          <button id="install-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; margin-right: 8px; cursor: pointer;">Instalar</button>
                          <button id="dismiss-btn" style="background: none; border: none; color: white; padding: 8px; cursor: pointer;">✕</button>
                        </div>
                      </div>
                    \`;
                    document.body.appendChild(installBanner);
                    
                    document.getElementById('install-btn').addEventListener('click', () => {
                      deferredPrompt.prompt();
                      deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                          console.log('User accepted the install prompt');
                        }
                        deferredPrompt = null;
                        document.body.removeChild(installBanner);
                      });
                    });
                    
                    document.getElementById('dismiss-btn').addEventListener('click', () => {
                      document.body.removeChild(installBanner);
                    });
                  }
                }, 30000);
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
