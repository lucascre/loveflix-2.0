import Link from "next/link";
import { Home, AlertCircle } from "lucide-react";

export default function MomentNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-8 text-center">
      <AlertCircle size={80} className="text-red-600 mb-6 animate-pulse" />
      
      <h1 className="mb-4 text-4xl md:text-5xl font-bold text-red-600">
        Momento Não Encontrado
      </h1>
      
      <p className="mb-8 text-lg md:text-xl text-gray-300 max-w-md">
        Este momento não existe ou foi removido.
        Que tal voltar para a página inicial e reviver outros momentos especiais?
      </p>

      <Link
        href="/"
        className="flex items-center gap-2 rounded-lg bg-red-600 px-8 py-3 
                 font-bold text-white transition-all hover:bg-red-700 
                 active:scale-95 shadow-lg"
      >
        <Home size={20} />
        Voltar ao Início
      </Link>
    </div>
  );
}