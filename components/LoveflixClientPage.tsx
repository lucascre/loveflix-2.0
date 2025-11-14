"use client";
import { useState } from "react";
import type { Moment, Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { MomentUploader } from "@/components/MomentUploader";
import { TrailerHero } from "@/components/TrailerHero";
import { MomentHero } from "@/components/MomentHero";
import { MomentModal } from "@/components/MomentModal";
import { MomentCarousel } from "@/components/MomentCarousel";

// Definir o tipo para Categoria-com-Momentos
type CategoryWithMoments = Category & { moments: Moment[] };

// Props da página
interface LoveflixClientPageProps {
  categories: CategoryWithMoments[];
  momentsWithoutCategory: Moment[];
  categoryNames: string[];
}

// Função de formatar data
const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

export function LoveflixClientPage({ 
  categories, 
  momentsWithoutCategory,
  categoryNames // <-- 1. RECEBE OS NOMES
}: LoveflixClientPageProps) {
  
  const { status } = useSession();
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderHeroSection = () => {
    if (selectedMoment) {
      return (
        <MomentHero 
          moment={selectedMoment} 
          onClose={() => setSelectedMoment(null)}
          onOpenModal={() => setIsModalOpen(true)}
        />
      );
    }
    if (status === "loading") {
      return (
        <div className="h-[350px] md:h-[500px] w-full max-w-4xl mx-auto rounded-lg bg-neutral-800 animate-pulse mb-12"></div>
      );
    }
    if (status === "authenticated") {
      return (
        <section className="mb-12 p-4 md:p-6 bg-neutral-800 rounded-lg max-w-lg mx-auto">
          {/* 2. PASSA OS NOMES PARA O UPLOADER */}
          <MomentUploader categoryNames={categoryNames} /> 
        </section>
      );
    }
    return <TrailerHero />;
  };

  const handleMomentClick = (moment: Moment) => {
    setSelectedMoment(moment);
  };

  return (
    <>
      {renderHeroSection()}

      <section>
        {categories.map((category) => (
          <MomentCarousel
            key={category.id}
            categoryName={category.name}
            moments={category.moments}
            onMomentClick={handleMomentClick}
          />
        ))}

        {momentsWithoutCategory.length > 0 && (
          <MomentCarousel
            categoryName="Outros"
            moments={momentsWithoutCategory}
            onMomentClick={handleMomentClick}
          />
        )}
      </section>

      {isModalOpen && selectedMoment && (
        <MomentModal 
          moment={selectedMoment} 
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}