// src/components/Modal.tsx
"use client";

import { useEffect, useRef } from 'react';
// CORREÇÃO: Mude a importação para usar o tipo do Prisma Client
import type { Memory } from '@prisma/client';
import Image from 'next/image';

interface ModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export function Modal({ memory, onClose }: ModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // O seu Modal tem lógica para vídeo, mas o schema atual do Prisma não.
  // Vamos manter a lógica, mas ela não será usada até que adicione `videoSrc` ao schema.
  useEffect(() => {
    // @ts-ignore - Ignorando o erro pois videoSrc não existe no tipo Memory do Prisma
    if (memory?.videoSrc && videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Autoplay do vídeo bloqueado:", e));
    }
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
  }, [memory]);

  if (!memory) {
    return null;
  }

  // Formata a data para exibição no modal
  const displayDate = new Date(memory.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#181818] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-black">
          {/* Lógica condicional para vídeo (não usado atualmente) ou imagem */}
          {/* @ts-ignore */}
          {memory.videoSrc ? (
            <video
              ref={videoRef}
              // @ts-ignore
              src={memory.videoSrc}
              controls
              playsInline
              className="w-full max-h-[70vh] object-contain"
            />
          ) : memory.coverImage ? (
            <Image
              src={memory.coverImage}
              alt={memory.title}
              width={1200}
              height={800}
              className="w-full max-h-[70vh] object-contain"
            />
          ) : null}
          <button 
            onClick={onClose}
            className="absolute top-2 right-3 text-white/70 hover:text-white text-4xl font-bold"
            aria-label="Fechar"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <h2 className="text-3xl font-serif text-gold-accent mb-2">{memory.title}</h2>
          <p className="text-sm text-rose-accent mb-4">{displayDate}</p>
          <p className="text-papiro-light/90 leading-relaxed">{memory.description}</p>
        </div>
      </div>
    </div>
  );
}