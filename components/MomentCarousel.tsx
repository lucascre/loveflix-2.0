"use client";
import type { Moment } from "@prisma/client";
import Image from "next/image";

interface MomentCarouselProps {
  categoryName: string;
  moments: Moment[];
  onMomentClick: (moment: Moment) => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

export function MomentCarousel({ categoryName, moments, onMomentClick }: MomentCarouselProps) {
  if (moments.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* MUDANÇA AQUI: Fonte responsiva */}
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
        {categoryName}
      </h2>
      
      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4">
        {moments.map((moment) => (
          <div
            key={moment.id}
            // MUDANÇA AQUI: Tamanho responsivo dos cartões
            className="group relative h-32 w-56 md:h-40 md:w-72 flex-shrink-0 
                       bg-neutral-800 rounded-lg overflow-hidden
                       transition-transform duration-300 ease-in-out 
                       hover:scale-110 hover:z-10 cursor-pointer"
            
            onClick={() => onMomentClick(moment)}
          >
            <Image
              src={moment.imageUrl}
              alt={moment.title || "Momento"}
              width={300}
              height={160}
              className="w-full h-full object-cover"
            />
            {/* O overlay de texto continua o mesmo, já é responsivo */}
            <div className="absolute bottom-0 left-0 p-2 md:p-3 bg-gradient-to-t from-black/90 to-transparent w-full 
                            opacity-0 group-hover:opacity-100 transition-opacity">
              <h3 className="text-xs md:text-sm font-bold text-white truncate">
                {moment.title || "Momento Especial"}
              </h3>
              <p className="text-xs text-gray-300">
                {formatDate(moment.momentDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}