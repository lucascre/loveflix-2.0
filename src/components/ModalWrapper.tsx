// src/components/ModalWrapper.tsx
"use client";

import { useState } from 'react';
import { Modal } from '@/components/Modal';
import type { Memory } from '@/data/memories';

interface ModalWrapperProps {
  memories: Memory[];
  children: (handleOpenModal: (memory: Memory) => void) => React.ReactNode;
}

export function ModalWrapper({ memories, children }: ModalWrapperProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const handleOpenModal = (memory: Memory) => setSelectedMemory(memory);
  const handleCloseModal = () => setSelectedMemory(null);

  return (
    <>
      {children(handleOpenModal)}
      <Modal memory={selectedMemory} onClose={handleCloseModal} />
    </>
  );
}