// src/app/timeline/page.tsx
"use client"; 

import { useState } from 'react';
import { TimelineItem } from '@/components/TimelineItem';
import { memories, Memory } from '@/data/memories'; 
import { Modal } from '@/components/Modal';

export default function TimelinePage() {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const handleOpenModal = (memory: Memory) => setSelectedMemory(memory);
  const handleCloseModal = () => setSelectedMemory(null);

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-serif text-gold-accent">Nossa Linha do Tempo</h1>
          <p className="text-lg sm:text-xl text-ink-light mt-4">Uma jornada pelas nossas estrelas mais brilhantes.</p>
        </div>

        {/* A linha agora fica à esquerda em telas pequenas e no centro em telas maiores */}
        <div className="relative">
          <div className="absolute left-2 top-0 h-full w-0.5 bg-rose-accent/30 md:left-1/2"></div>
          {sortedMemories.map((memory, index) => (
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