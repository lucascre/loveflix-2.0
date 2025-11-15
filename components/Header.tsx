"use client";
import { UserMenu } from "@/components/UserMenu";
import Link from "next/link";
// Removidos useState e useEffect, pois não são mais necessários

export function Header() {
  // O estado 'isScrolled' e o 'useEffect' foram removidos

  return (
    <header 
      className={`
        hidden md:block  /* 1. ESCONDIDO no celular, 'block' no desktop */
        relative top-0 left-0 right-0 z-40 
        bg-[#141414]  /* 2. Fundo sólido permanente (no desktop) */
        
        /* As classes 'md:fixed', 'transition-colors' e a lógica 'isScrolled' 
          foram removidas para que o header não sobreponha o conteúdo.
        */
      `}
    >
      <div className="flex justify-between items-center px-4 md:px-12 py-4 md:py-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 
              className="text-2xl md:text-4xl font-black text-red-600 
                         tracking-tight cursor-pointer
                         hover:scale-105 transition-transform duration-300
                         text-hover-glow" 
            >
              LOVEFLIX
            </h1>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            <Link href="/" className="text-white hover:text-gray-300 transition-colors font-medium">
              Início
            </Link>
          </nav>
        </div>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}