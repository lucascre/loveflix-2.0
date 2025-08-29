// src/components/Header.tsx
"use client"; // Necessário para usar o estado (useState)

import { useState } from 'react';
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-papiro-light/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gold-accent/30">
      <div className="container mx-auto flex items-center justify-between p-4 text-ink-dark">
        <Link href="/" className="text-xl font-serif text-gold-accent hover:text-ink-dark transition-colors">
          Nosso Diário 📜
        </Link>

        {/* Botão Hambúrguer - Visível apenas em telas pequenas (até 'md') */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Abrir menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Menu Principal - Visível em telas médias e grandes */}
        <nav className="hidden md:flex items-center gap-6 font-sans text-sm">
          <Link href="/timeline" className="hover:text-gold-accent transition-colors">Linha do Tempo</Link>
          <Link href="/map" className="hover:text-gold-accent transition-colors">Mapa de Aventuras</Link>
        </nav>
      </div>

      {/* Menu Mobile - Aparece abaixo do header quando o botão é clicado */}
      {isMenuOpen && (
        <nav className="md:hidden flex flex-col items-center gap-4 py-4 border-t border-gold-accent/20">
          <Link href="/timeline" onClick={() => setIsMenuOpen(false)} className="hover:text-gold-accent transition-colors">Linha do Tempo</Link>
          <Link href="/map" onClick={() => setIsMenuOpen(false)} className="hover:text-gold-accent transition-colors">Mapa de Aventuras</Link>
        </nav>
      )}
    </header>
  )
}