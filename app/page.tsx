import { db } from "@/lib/prisma";
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
    <LoveflixClientPage 
      categories={categories}
      momentsWithoutCategory={momentsWithoutCategory}
      categoryNames={names}
    />
  );
}