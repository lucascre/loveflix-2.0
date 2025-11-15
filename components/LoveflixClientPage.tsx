"use client";
import { useState } from "react";
import type { Moment, Category } from "@prisma/client";
import { useSession } from "next-auth/react";

import { MomentUploader } from "@/components/MomentUploader";
import { TrailerHero } from "@/components/TrailerHero";
import { MomentHero } from "@/components/MomentHero";
import { MomentModal } from "@/components/MomentModal";
import { MomentCarousel } from "@/components/MomentCarousel";

type CategoryWithMoments = Category & { moments: Moment[] };

interface LoveflixClientPageProps {
  categories: CategoryWithMoments[];
  momentsWithoutCategory: Moment[];
  categoryNames: string[];
}

export function LoveflixClientPage({ 
  categories, 
  momentsWithoutCategory,
  categoryNames
}: LoveflixClientPageProps) {
  
  const { status } = useSession();
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderHeroSection = () => {
    if (selectedMoment) {
      return (
        <div className="fade-in">
          <MomentHero 
            moment={selectedMoment} 
            onClose={() => setSelectedMoment(null)}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      );
    }
    if (status === "loading") {
      return (
        <div className="h-[350px] md:h-[500px] w-full max-w-6xl mx-auto rounded-lg overflow-hidden mb-12 shimmer"></div>
      );
    }
    if (status === "authenticated") {
      return (
        <section className="mb-12 fade-in">
          <div className="max-w-2xl mx-auto glass-effect rounded-xl p-6 md:p-8 netflix-glow">
            <MomentUploader categoryNames={categoryNames} /> 
          </div>
        </section>
      );
    }
    return (
      <div className="fade-in">
        <TrailerHero />
      </div>
    );
  };

  const handleMomentClick = (moment: Moment) => {
    setSelectedMoment(moment);
  };

  return (
    <div className="min-h-screen">
      {renderHeroSection()}

      {/* Gradiente de transição */}
      <div className="netflix-gradient h-32 -mt-32 relative z-10"></div>

      <section className="relative z-20 space-y-8 md:space-y-12">
        {categories.map((category, index) => (
          <div 
            key={category.id}
            className="slide-in-left"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <MomentCarousel
              categoryName={category.name}
              moments={category.moments}
              onMomentClick={handleMomentClick}
            />
          </div>
        ))}

        {momentsWithoutCategory.length > 0 && (
          <div className="slide-in-left" style={{ animationDelay: `${categories.length * 0.1}s` }}>
            <MomentCarousel
              categoryName="Outros"
              moments={momentsWithoutCategory}
              onMomentClick={handleMomentClick}
            />
          </div>
        )}
      </section>

      {isModalOpen && selectedMoment && (
        <div className="modal-overlay">
          <MomentModal 
            moment={selectedMoment} 
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
}