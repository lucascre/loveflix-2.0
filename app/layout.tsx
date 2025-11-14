import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SplashScreen } from "@/components/SplashScreen"; // 1. Importe

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
      <body className={inter.className}>
        <Providers>
          <SplashScreen /> {/* 2. Adicione o Splash aqui */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
