// src/app/timeline/page.tsx
"use client"; 

import { useState, useEffect, useRef } from 'react'; // Adicione useRef
import { TimelineItem } from '@/components/TimelineItem';
import { Modal } from '@/components/Modal';
import type { Memory } from '@prisma/client';
import { AudioPlayer, type AudioPlayerRef } from '@/components/AudioPlayer'; // Importe o tipo AudioPlayerRef
import { EnterTimeline } from '@/components/EnterTimeline'; // Importe o ecrã de boas-vindas

export default function TimelinePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTimeline, setShowTimeline] = useState(false); // Novo estado para controlar a visibilidade

  const audioPlayerRef = useRef<AudioPlayerRef>(null); // Crie uma ref para o player

  useEffect(() => {
    async function loadMemories() {
      try {
        const res = await fetch('/api/memories');
        if (!res.ok) throw new Error('Falha ao buscar memórias');
        const data = await res.json();
        setMemories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMemories();
  }, []);

  const handleEnter = () => {
    setShowTimeline(true);
    // Chama a função `playWithSound` exposta pelo componente AudioPlayer
    audioPlayerRef.current?.playWithSound();
  };

  const handleOpenModal = (memory: Memory) => setSelectedMemory(memory);
  const handleCloseModal = () => setSelectedMemory(null);

  return (
    <>
      <AudioPlayer ref={audioPlayerRef} />

      {!showTimeline ? (
        <EnterTimeline onEnter={handleEnter} />
      ) : (
        <>
          <div className="container mx-auto px-4 py-8 sm:py-16">
            {isLoading ? (
              <p className="text-center p-12">A carregar linha do tempo...</p>
            ) : (
              <>
                <div className="text-center mb-12 sm:mb-16">
                  <h1 className="text-4xl sm:text-5xl font-serif text-gold-accent">Nossa Linha do Tempo</h1>
                  <p className="text-lg sm:text-xl text-ink-light mt-4">Uma jornada pelas nossas estrelas mais brilhantes.</p>
                </div>

                <div className="relative">
                  <div className="absolute left-2 top-0 h-full w-0.5 bg-rose-accent/30 md:left-1/2"></div>
                  {memories.map((memory, index) => (
                    <TimelineItem 
                      key={memory.id} 
                      memory={memory} 
                      isLeft={index % 2 !== 0}
                      onClick={() => handleOpenModal(memory)} 
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <Modal memory={selectedMemory} onClose={handleCloseModal} />
        </>
      )}
    </>
  );
}