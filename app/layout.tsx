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
      {/* 1. ADICIONAR O <head> AQUI */}
      <head>
        {/* 2. Adicionar a cor do tema para a barra do telemóvel */}
        <meta name="theme-color" content="#e50914" />
        
        {/* 3. Adicionar o link para o manifesto */}
        <link rel="manifest" href="/manifest.json" />
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