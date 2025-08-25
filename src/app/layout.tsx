// src/app/layout.tsx
import type { Metadata } from 'next'
import { Quicksand, Playfair_Display } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'; // Import do CSS do Leaflet
import { Header } from '@/components/Header';

const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Nossa Constelação de Memórias',
  description: 'Um lugar para guardar os momentos que nos fazem brilhar.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${quicksand.variable} ${playfair.variable} font-sans`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}