// src/app/timeline/page.tsx
"use client"; 

import { useState, useEffect } from 'react';
import { TimelineItem } from '@/components/TimelineItem';
import { Modal } from '@/components/Modal';
import type { Memory } from '@prisma/client';

export default function TimelinePage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/memories')
      .then(res => res.json())
      .then(data => {
        setMemories(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Falha ao buscar memórias:", error);
        setIsLoading(false);
      });
  }, []);

  const handleOpenModal = (memory: Memory) => setSelectedMemory(memory);
  const handleCloseModal = () => setSelectedMemory(null);

  if (isLoading) {
    return <p className="text-center p-12">A carregar linha do tempo...</p>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-16">
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
      </div>
      <Modal memory={selectedMemory} onClose={handleCloseModal} />
    </>
  );
}
