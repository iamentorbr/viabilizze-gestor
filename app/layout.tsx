import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ClientProvider } from '@/contexts/client-context'
import { IndustriaProvider } from '@/contexts/IndustriaContext'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gerenciamento Integrado - Sistema de Gestão Industrial',
  description: 'Sistema completo para gestão de produção de bebidas e néctares',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1f2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="font-sans antialiased">
        <ClientProvider>
          <IndustriaProvider>
            {children}
          </IndustriaProvider>
        </ClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
