// src/components/Header.tsx
import Link from "next/link";

export function Header() {
  return (
    <header className="bg-space-dark/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-space-blue">
      <div className="container mx-auto flex items-center justify-between p-4 text-text-light">
        <Link href="/" className="text-xl font-serif text-star-gold hover:text-white transition-colors">
          Nossa Constelação ✨
        </Link>
        <nav className="flex items-center gap-6 font-sans text-sm">
          <Link href="/timeline" className="hover:text-star-gold transition-colors">Linha do Tempo</Link>
          <Link href="/map" className="hover:text-star-gold transition-colors">Mapa de Aventuras</Link>
        </nav>
      </div>
    </header>
  )
}