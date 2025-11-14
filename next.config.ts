import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa"; // 1. Importar o PWA

// A sua configuração Next.js existente
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "2wzyxd98zg.ufs.sh", // O seu domínio antigo
        port: "",
        pathname: "/f/**",
      },
    ],
  },
};

// 2. Configurar o PWA
export default withPWA({
  dest: "public", // Onde o Service Worker será gerado
  register: true, // Registar automaticamente o Service Worker
  disable: process.env.NODE_ENV === "development", // Desativar em modo 'dev'
  
  // ESTA É A MUDANÇA:
  // 'skipWaiting' deve estar dentro de 'workboxOptions'
  workboxOptions: {
    skipWaiting: true, // Instalar novo SW imediatamente
  },
  
  // 3. Juntar com a sua configuração
  ...nextConfig,
})(nextConfig);