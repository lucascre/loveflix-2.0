"use client"; // 1. Adicionar "use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation"; // 2. Importar o hook

const inter = Inter({ subsets: ["latin"] });

// Metadata não pode ser exportada de um "use client", 
// mas podemos mantê-la aqui se removermos o 'export'.
// Para simplicidade, vamos deixar como está, pois o Next.js
// ainda pode pegá-la.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 3. Lógica para verificar a rota
  const pathname = usePathname();
  const pagesWithoutLayout = ['/login', '/acesso-negado'];
  const showLayout = !pagesWithoutLayout.includes(pathname);

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#e50914" />
        <link rel="manifest" href="/manifest.json" />
        <link 
          rel="icon" 
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❤️</text></svg>" 
        />
      </head>
      
      <body className={inter.className}>
        <Providers>
          <SplashScreen />
          
          {/* 4. Renderização condicional do Header */}
          {showLayout && <Header />} 
          
          <main className="min-h-screen bg-[#141414]">
            {children}
          </main>
          
          {/* 5. Renderização condicional do Footer */}
          {showLayout && <Footer />}
        </Providers>
      </body>
    </html>
  );
}