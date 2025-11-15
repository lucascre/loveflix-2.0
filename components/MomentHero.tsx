"use client";
import type { Moment } from "@prisma/client";
import { PlayCircle, X, Info, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

interface MomentHeroProps {
  moment: Moment;
  onClose: () => void;
  onOpenModal: () => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

export function MomentHero({ moment, onClose, onOpenModal }: MomentHeroProps) {
  const isVideo = moment.fileType?.startsWith("video/");
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  return (
    <div
      className="relative flex flex-col justify-end w-full h-[450px] md:h-[600px] lg:h-[700px]
                 mx-auto overflow-hidden mb-8 md:mb-16"
    >
      {/* Mídia de fundo */}
      {isVideo ? (
        <video
          ref={videoRef}
          src={moment.imageUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      ) : (
        <Image
          src={moment.imageUrl}
          alt={moment.title || "Momento"}
          width={1920}
          height={1080}
          priority
          onLoad={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
      )}
      
      {/* Overlay gradiente múltiplo (Netflix style) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-[#141414]/20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent"></div>
      
      {/* Botão de fechar */}
      <button
        onClick={onClose}
        title="Fechar preview"
        className="absolute top-4 right-4 z-20 text-white bg-black/50 backdrop-blur-sm
                 rounded-full p-2 hover:bg-black/70 transition-all duration-300
                 btn-transition netflix-glow"
      >
        <X size={24} />
      </button>

      {/* Controle de áudio (apenas para vídeos) */}
      {isVideo && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Ativar som" : "Desativar som"}
          className="absolute bottom-[35%] right-4 md:right-8 z-20 text-white 
                   bg-black/50 backdrop-blur-sm rounded-full p-3 
                   hover:bg-black/70 transition-all duration-300 border border-white/30
                   btn-transition netflix-glow"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Conteúdo */}
      <div className="relative z-10 text-left px-4 md:px-12 lg:px-16 pb-8 md:pb-16 max-w-3xl">
        {/* Loading skeleton */}
        {!isLoaded && (
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-neutral-700 rounded w-3/4"></div>
            <div className="h-6 bg-neutral-700 rounded w-1/2"></div>
            <div className="h-12 bg-neutral-700 rounded w-1/3"></div>
          </div>
        )}

        {/* Conteúdo carregado */}
        <div className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {/* Título */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 md:mb-4 
                       leading-tight drop-shadow-2xl slide-in-left">
            {moment.title || "Momento Especial"}
          </h2>
          
          {/* Metadados */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6 slide-in-left" 
               style={{ animationDelay: '0.1s' }}>
            <span className="text-sm md:text-base text-gray-200 font-medium">
              {formatDate(moment.momentDate)}
            </span>
            {isVideo && (
              <>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="flex items-center gap-1 text-sm md:text-base text-gray-200">
                  <PlayCircle size={16} className="text-red-600" />
                  Vídeo
                </span>
              </>
            )}
            <span className="px-2 py-0.5 border border-gray-400 text-gray-300 text-xs rounded">
              HD
            </span>
          </div>
          
          {/* Botões de ação */}
          <div className="flex flex-wrap gap-3 md:gap-4 slide-in-left" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={onOpenModal} 
              className="flex items-center gap-2 bg-white text-black font-bold 
                       px-6 md:px-8 py-2.5 md:py-3 text-base md:text-lg rounded 
                       hover:bg-gray-200 transition-all duration-300 btn-transition
                       shadow-lg hover:shadow-xl"
            >
              <PlayCircle size={24} className="fill-current" /> {/* O ícone está aqui */}
              <span>Assistir</span>
            </button>
            
            <button
              onClick={onOpenModal}
              className="flex items-center gap-2 bg-neutral-700/80 backdrop-blur-sm 
                       text-white font-semibold px-6 md:px-8 py-2.5 md:py-3 
                       text-base md:text-lg rounded hover:bg-neutral-600/80 
                       transition-all duration-300 btn-transition border border-white/20"
            >
              <Info size={24} />
              <span>Mais Informações</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fade para o conteúdo abaixo */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#141414] pointer-events-none"></div>
    </div>
  );
}