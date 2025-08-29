// src/components/Modal.tsx
"use client";

import { useEffect, useRef } from 'react';
import type { Memory } from '@/data/memories';
import Image from 'next/image';

interface ModalProps {
  memory: Memory | null;
  onClose: () => void;
}

export function Modal({ memory, onClose }: ModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Toca o vídeo automaticamente quando o modal abre
    if (memory?.videoSrc && videoRef.current) {
      videoRef.current.play().catch(e => console.warn("Autoplay do vídeo bloqueado:", e));
    }

    // Pausa o vídeo quando o modal fecha
    return () => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
  }, [memory]);

  if (!memory) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4"
      onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      <div 
        className="bg-[#181818] rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Impede que o clique no conteúdo feche o modal
      >
        <div className="relative bg-black">
          {memory.videoSrc ? (
            <video
              ref={videoRef}
              src={memory.videoSrc}
              controls
              playsInline
              className="w-full max-h-[70vh] object-contain"
            >
              Seu navegador não suporta a tag de vídeo.
            </video>
          ) : (
            <Image
              src={memory.coverImage}
              alt={memory.title}
              width={1200}
              height={800}
              className="w-full max-h-[70vh] object-contain"
            />
          )}
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
          <p className="text-sm text-rose-accent mb-4">{memory.date}</p>
          <p className="text-papiro-light/90 leading-relaxed">{memory.description}</p>
        </div>
      </div>
    </div>
  );
}