import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header"; // 1. Importar Header
import { Footer } from "@/components/Footer"; // 2. Importar Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loveflix",
  description: "Nossos melhores momentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <Header /> {/* 3. Adicionar Header aqui */}
          
          {/* 4. Mover o fundo principal para a tag <main> */}
          <main className="min-h-screen bg-[#141414]">

            {children}
          </main>
          
          <Footer /> {/* 6. Adicionar Footer aqui */}
        </Providers>
      </body>
    </html>
  );
}