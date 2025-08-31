// src/app/timeline/page.tsx
import { TimelineItem } from '@/components/TimelineItem';
import { memories, Memory } from '@/data/memories';
import { ModalWrapper } from '@/components/ModalWrapper'; // Criaremos este componente

// Função para buscar os dados no servidor
async function getMemories() {
  // Usamos 'no-store' para garantir que os dados sejam sempre os mais recentes
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/memories`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Falha ao buscar memórias');
  }
  return res.json();
}

export default async function TimelinePage() {
  const memoriesData: Memory[] = await getMemories();

  return (
    // O ModalWrapper irá lidar com o estado do modal no lado do cliente
    <ModalWrapper memories={memoriesData}>
      {(handleOpenModal) => (
        <div className="container mx-auto px-4 py-8 sm:py-16">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-serif text-gold-accent">Nossa Linha do Tempo</h1>
            <p className="text-lg sm:text-xl text-ink-light mt-4">Uma jornada pelas nossas estrelas mais brilhantes.</p>
          </div>

          <div className="relative">
            <div className="absolute left-2 top-0 h-full w-0.5 bg-rose-accent/30 md:left-1/2"></div>
            {memoriesData.map((memory, index) => (
              <TimelineItem
                key={memory.id}
                memory={memory}
                isLeft={index % 2 !== 0}
                onClick={() => handleOpenModal(memory)}
              />
            ))}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
}