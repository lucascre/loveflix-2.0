"use client";
import { UserMenu } from "@/components/UserMenu";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Verifica se a página foi rolada (em qualquer dispositivo)
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Limpa o evento quando o componente é desmontado
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <header 
      className={`
        relative md:fixed top-0 left-0 right-0 z-40 transition-colors duration-300
        bg-[#141414] // ESTILO BASE (CELULAR): Fundo sólido e 'relative' (não-fixo)
        
        ${isScrolled 
          ? 'md:bg-[#141414] md:shadow-lg' // ESTILO DESKTOP ROLADO: Fundo sólido
          : 'md:bg-black/50 md:backdrop-blur-sm md:shadow-none' // ESTILO DESKTOP NO TOPO: Semi-transparente
        }
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