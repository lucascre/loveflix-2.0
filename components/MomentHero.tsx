"use client";
import type { Moment } from "@prisma/client";
import { PlayCircle, X } from "lucide-react";
import Image from "next/image";

interface MomentHeroProps {
  moment: Moment;
  onClose: () => void;
  onOpenModal: () => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

export function MomentHero({ moment, onClose, onOpenModal }: MomentHeroProps) {
  const isVideo = moment.fileType?.startsWith("video/");

  return (
    <div
      // MUDANÇA AQUI: h-[350px] (telemóvel), md:h-[500px] (desktop)
      className="relative flex flex-col justify-end w-full h-[350px] md:h-[500px] 
                 mx-auto rounded-lg overflow-hidden shadow-2xl mb-12 bg-black"
    >
      {isVideo ? (
        <video
          src={moment.imageUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <Image
          src={moment.imageUrl}
          alt={moment.title || "Momento"}
          width={1200}
          height={700}
          priority
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      
      <button
        onClick={onClose}
        title="Fechar preview"
        className="absolute top-4 right-4 z-20 text-white bg-black/50 rounded-full p-1 hover:bg-black/80 transition-colors"
      >
        <X size={20} />
      </button>

      {/* MUDANÇA AQUI: p-4 (telemóvel), md:p-8 (desktop) */}
      <div className="z-10 text-left p-4 md:p-8">
        {/* MUDANÇA AQUI: Fontes responsivas */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
          {moment.title || "Momento Especial"}
        </h2>
        <p className="text-base md:text-lg text-gray-200 mb-4">
          {formatDate(moment.momentDate)}
        </p>
        
        {/* MUDANÇA AQUI: Botão responsivo */}
        <button
          onClick={onOpenModal} 
          className="flex items-center gap-2 bg-white text-black font-bold px-4 py-2 text-sm rounded-lg md:px-6 md:text-base hover:bg-opacity-80 transition-colors"
        >
          <PlayCircle size={20} />
          Ver {isVideo ? "Vídeo" : "Foto"}
        </button>
      </div>
    </div>
  );
}