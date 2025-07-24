import type { Metadata } from 'next'
import './globals.css'
import { AppProvider } from '../contexts/AppContext'

export const metadata: Metadata = {
  title: 'EconoMarket - Supermercado App',
  description: 'Sistema de gerenciamento de listas de compras',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
