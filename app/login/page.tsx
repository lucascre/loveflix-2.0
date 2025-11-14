"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock } from "lucide-react"; // Lembre-se: npm install lucide-react

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário já estiver logado, redirecione para a home
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    // Mostra loading enquanto verifica a sessão ou redireciona
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="mb-4 text-5xl font-bold text-red-600">Loveflix</h1>
      <p className="mb-8 text-xl">Nossos momentos especiais.</p>
      <button
        onClick={() => signIn("google")} // Botão de login com Google
        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-black transition-transform hover:scale-105"
      >
        <Lock size={18} />
        Entrar com Google
      </button>
    </div>
  );
}