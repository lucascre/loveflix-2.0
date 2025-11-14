import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SplashScreen } from "@/components/SplashScreen";

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
        {/* 1. Adicionar a cor do tema */}
        <meta name="theme-color" content="#e50914" />
        
        {/* 2. Adicionar o link para o manifesto */}
        <link rel="manifest" href="/manifest.json" />

        {/* 3. ESTA É A MUDANÇA: Favicon de Coração ❤️ */}
        <link 
          rel="icon" 
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>❤️</text></svg>" 
        />
      </head>
      
      <body className={inter.className}>
        <Providers>
          <SplashScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}