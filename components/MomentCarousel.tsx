"use client";
import { useState, useRef } from "react";
import type { Moment } from "@prisma/client";
import Image from "next/image";
import { ChevronLeft, ChevronRight, PlayCircle, Info, Images } from "lucide-react";

interface MomentCarouselProps {
  categoryName: string;
  moments: (Moment & { albumImages?: string[] })[];
  onMomentClick: (moment: Moment & { albumImages?: string[] }) => void;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredMoment, setHoveredMoment] = useState<string | null>(null);

  if (moments.length === 0) {
    return null;
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeftArrow(scrollRef.current.scrollLeft > 10);
          setShowRightArrow(
            scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
          );
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 10);
      setShowRightArrow(
        scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
      );
    }
  };

  const isVideo = (moment: Moment) => moment.fileType?.startsWith("video/");
  const isAlbum = (moment: Moment & { albumImages?: string[] }) => 
    (moment.albumImages && moment.albumImages.length > 0);
  const getAlbumCount = (moment: Moment & { albumImages?: string[] }) => 
    1 + (moment.albumImages?.length || 0);

  return (
    <section className="relative group mb-8 md:mb-12">
      {/* Título da categoria */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white px-4 md:px-12 text-hover-glow">
        {categoryName}
      </h2>
      
      {/* Container do carrossel */}
      <div className="relative">
        {/* Seta esquerda */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 md:w-16 bg-gradient-to-r from-black/80 to-transparent 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     transition-opacity duration-300 hover:from-black/90"
            aria-label="Scroll left"
          >
            <ChevronLeft size={40} className="text-white drop-shadow-lg" />
          </button>
        )}

        {/* Seta direita */}
        {showRightArrow && moments.length > 3 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     transition-opacity duration-300 hover:from-black/90"
            aria-label="Scroll right"
          >
            <ChevronRight size={40} className="text-white drop-shadow-lg" />
          </button>
        )}

        {/* Grid de momentos */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-2 md:gap-3 overflow-x-auto pb-4 px-4 md:px-12 hide-scrollbar scroll-smooth"
        >
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="moment-card relative h-36 w-64 md:h-44 md:w-80 flex-shrink-0 
                       bg-neutral-900 rounded-lg overflow-hidden cursor-pointer
                       shadow-lg image-hover-brightness"
              onMouseEnter={() => setHoveredMoment(moment.id)}
              onMouseLeave={() => setHoveredMoment(null)}
              onClick={() => onMomentClick(moment)}
            >
              {/* Imagem/Vídeo */}
              {isVideo(moment) ? (
                <video
                  src={moment.imageUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay={hoveredMoment === moment.id}
                />
              ) : (
                <Image
                  src={moment.imageUrl}
                  alt={moment.title || "Momento"}
                  width={320}
                  height={176}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}

              {/* Badge de álbum (canto superior esquerdo) */}
              {isAlbum(moment) && (
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm 
                              px-2 py-1 rounded flex items-center gap-1 text-xs text-white font-bold">
                  <Images size={14} className="text-red-600" />
                  {getAlbumCount(moment)}
                </div>
              )}

              {/* Badge de vídeo (canto superior direito) */}
              {isVideo(moment) && (
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm 
                              px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                  <PlayCircle size={14} />
                  Vídeo
                </div>
              )}

              {/* Overlay com informações (aparece no hover) */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent 
                            flex flex-col justify-end p-3 md:p-4 transition-opacity duration-300
                            ${hoveredMoment === moment.id ? 'opacity-100' : 'opacity-0'}`}>
                <div className="transform transition-transform duration-300"
                     style={{ transform: hoveredMoment === moment.id ? 'translateY(0)' : 'translateY(10px)' }}>
                  <h3 className="text-sm md:text-base font-bold text-white mb-1 line-clamp-1">
                    {moment.title || "Momento Especial"}
                  </h3>
                  <p className="text-xs text-gray-300 mb-3">
                    {formatDate(moment.momentDate)}
                    {isAlbum(moment) && (
                      <span className="ml-2 text-red-400">
                        • {getAlbumCount(moment)} {getAlbumCount(moment) === 1 ? 'foto' : 'fotos'}
                      </span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="flex items-center gap-1 bg-white text-black px-3 py-1.5 
                               rounded-full text-xs font-semibold hover:bg-gray-200 
                               transition-colors btn-transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMomentClick(moment);
                      }}
                    >
                      <PlayCircle size={14} />
                      {isAlbum(moment) ? 'Ver Álbum' : 'Ver'}
                    </button>
                    <button 
                      className="flex items-center justify-center w-8 h-8 
                               bg-neutral-800/80 text-white rounded-full 
                               hover:bg-neutral-700 transition-colors btn-transition
                               border border-neutral-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info básica (sempre visível em mobile) */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t 
                            from-black/90 to-transparent p-2">
                <h3 className="text-xs font-bold text-white truncate">
                  {moment.title || "Momento Especial"}
                </h3>
                <p className="text-xs text-gray-300">
                  {formatDate(moment.momentDate)}
                  {isAlbum(moment) && (
                    <span className="ml-1 text-red-400">
                      • {getAlbumCount(moment)} fotos
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}