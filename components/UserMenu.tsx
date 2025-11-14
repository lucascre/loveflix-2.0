"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Lock } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  // 1. Estado de Carregamento (mostra um placeholder)
  if (status === "loading") {
    return <div className="h-10 w-24 rounded-lg bg-neutral-800 animate-pulse"></div>;
  }

  // 2. Estado LOGADO (mostra nome e botão de Sair)
  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300 hidden sm:block">
          {/* Mostra só o primeiro nome */}
          Olá, {session.user?.name?.split(" ")[0]}
        </span>
        <button
          onClick={() => signOut()}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-500"
        >
          Sair
        </button>
      </div>
    );
  }

  // 3. Estado DESLOGADO (mostra botão de Entrar)
  return (
    <button
      onClick={() => signIn("google")}
      className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-transform hover:scale-105"
    >
      <Lock size={16} />
      Entrar
    </button>
  );
}