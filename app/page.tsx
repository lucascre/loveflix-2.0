import { db } from "@/lib/prisma";
import { UserMenu } from "@/components/UserMenu";
import { LoveflixClientPage } from "@/components/LoveflixClientPage";
import type { Category, Moment } from "@prisma/client"; // Importar tipos

// Tipo para Categoria com Momentos
type CategoryWithMoments = Category & { moments: Moment[] };

export default async function HomePage() {
  
  // 1. Buscar as categorias, incluindo os momentos de cada uma
  const categories: CategoryWithMoments[] = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      moments: {
        orderBy: { momentDate: "desc" },
      },
    },
  });

  // 2. Buscar uma lista simples de nomes para o uploader
  const categoryNames = await db.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });
  const names = categoryNames.map(c => c.name);

  // 3. Buscar momentos que ainda não têm categoria
  const momentsWithoutCategory: Moment[] = await db.moment.findMany({
    where: { categoryId: null },
    orderBy: { momentDate: "desc" },
  });

  return (
    // p-4 (telemóvel), md:p-8 (desktop)
    <main className="min-h-screen bg-neutral-900 text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-600">Loveflix</h1>
        <UserMenu />
      </header>

      {/* 4. Passar TODOS os dados para o componente cliente */}
      <LoveflixClientPage 
        categories={categories}
        momentsWithoutCategory={momentsWithoutCategory}
        categoryNames={names}
      />
    </main>
  );
}