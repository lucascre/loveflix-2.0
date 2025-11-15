import { db } from "@/lib/prisma";
import { UserMenu } from "@/components/UserMenu";
import { LoveflixClientPage } from "@/components/LoveflixClientPage";
import type { Category, Moment } from "@prisma/client";

type CategoryWithMoments = Category & { moments: Moment[] };

export default async function HomePage() {
  
  const categories: CategoryWithMoments[] = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      moments: {
        orderBy: { momentDate: "desc" },
      },
    },
  });

  const categoryNames = await db.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  const names = categoryNames.map(c => c.name);

  const momentsWithoutCategory: Moment[] = await db.moment.findMany({
    where: { categoryId: null },
    orderBy: { momentDate: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#141414]">
      {/* Header fixo estilo Netflix */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300
                       bg-gradient-to-b from-black/80 via-black/40 to-transparent
                       backdrop-blur-sm">
        <div className="flex justify-between items-center px-4 md:px-12 py-4 md:py-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl md:text-4xl font-black text-red-600 
                         tracking-tight netflix-glow cursor-pointer
                         hover:scale-105 transition-transform duration-300">
              LOVEFLIX
            </h1>
            
            {/* Navigation (opcional - pode adicionar depois) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm">
              <a href="#" className="text-white hover:text-gray-300 transition-colors font-medium">
                Início
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Minha Lista
              </a>
            </nav>
          </div>

          {/* User menu */}
          <UserMenu />
        </div>
      </header>

      {/* Spacer para compensar o header fixo */}
      <div className="h-20 md:h-24"></div>

      {/* Content */}
      <LoveflixClientPage 
        categories={categories}
        momentsWithoutCategory={momentsWithoutCategory}
        categoryNames={names}
      />

      {/* Footer estilo Netflix */}
      <footer className="mt-16 md:mt-24 border-t border-neutral-800 bg-[#141414]">
        <div className="px-4 md:px-12 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-6 text-sm">
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Perguntas Frequentes
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Centro de Ajuda
                </a>
              </div>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Conta
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Preferências
                </a>
              </div>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Termos de Uso
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Privacidade
                </a>
              </div>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Contato
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Legal
                </a>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 space-y-2">
              <p>© {new Date().getFullYear()} Loveflix. Todos os direitos reservados.</p>
              <p className="text-gray-600">
                Feito com ❤️ para preservar nossos momentos especiais.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}