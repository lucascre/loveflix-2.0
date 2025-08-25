// src/app/timeline/page.tsx
import { TimelineItem } from '@/components/TimelineItem';
import { memories } from '@/data/memories';

export default function TimelinePage() {
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif text-star-gold">Nossa Linha do Tempo</h1>
        <p className="text-xl text-text-dark mt-4">Uma jornada pelas nossas estrelas mais brilhantes.</p>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 h-full w-0.5 bg-nebula-purple/30"></div>
        {sortedMemories.map((memory, index) => (
          <TimelineItem key={memory.id} memory={memory} isLeft={index % 2 !== 0} />
        ))}
      </div>
    </div>
  );
}