"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { MomentUploader } from "./MomentUploader"; // Reutilizamos o uploader
import { Lock } from "lucide-react";

export function UploadSection() {
  const { data: session, status } = useSession();

  // 1. Estado de Carregamento
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4 text-gray-400">
        <p>Carregando...</p>
      </div>
    );
  }

  // 2. Estado LOGADO
  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg">
          Olá, <span className="font-bold">{session.user?.name}</span>!
        </p>
        <MomentUploader />
        <button
          onClick={() => signOut()} // Botão de sair
          className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-500"
        >
          Sair
        </button>
      </div>
    );
  }

  // 3. Estado DESLOGADO
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-semibold text-center">Adicionar Novo Momento</h2>
      <p className="text-gray-300">Faça login para enviar suas fotos e vídeos.</p>
      <button
        onClick={() => signIn("google")} // Botão de login
        className="flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-black transition-transform hover:scale-105"
      >
        <Lock size={18} />
        Entrar com Google
      </button>
    </div>
  );
}