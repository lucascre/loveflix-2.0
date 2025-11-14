// Este é um Server Component!
import { db } from "@/lib/prisma"; // Nosso client do DB
import Image from "next/image";

// Importe o NOVO componente que cuidará do login/upload
import { UploadSection } from "@/components/UploadSection";

export default async function HomePage() {
  // 1. REMOVEMOS A VERIFICAÇÃO DE SESSÃO DAQUI
  //    (Não há mais 'getServerSession' ou 'redirect')

  // 2. Buscamos TODOS os momentos, não apenas de um usuário
  const moments = await db.moment.findMany({
    orderBy: {
      createdAt: "desc", // Mais recentes primeiro
    },
  });

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-red-600">Loveflix</h1>
        {/* O botão de Sair foi movido para dentro do UploadSection */}
      </header>

      {/* Seção de Upload (Agora é inteligente) */}
      <section className="mb-12 p-6 bg-neutral-800 rounded-lg max-w-lg mx-auto">
        {/* 3. Usamos o novo componente inteligente */}
        <UploadSection />
      </section>

      {/* Seção "Nossos Momentos" (Estilo Netflix) */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Nossos Momentos</h2>
        
        {moments.length === 0 && (
          <p className="text-gray-400">Nenhum momento salvo ainda. Adicione o primeiro!</p>
        )}

        {/* O Grid "Netflix" */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="group aspect-video bg-neutral-800 rounded-lg overflow-hidden 
                         transition-transform duration-300 ease-in-out 
                         hover:scale-110 hover:z-10 cursor-pointer"
            >
              <Image
                src={moment.imageUrl}
                alt={moment.title || "Nosso momento"}
                width={500}
                height={281} // Proporção 16:9
                className="w-full h-full object-cover"
                priority
              />
              <div className="absolute bottom-0 left-0 p-2 bg-gradient-to-t from-black/80 to-transparent w-full 
                              opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-sm font-bold">{moment.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}