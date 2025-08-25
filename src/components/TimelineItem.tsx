// src/components/TimelineItem.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Memory } from '@/data/memories';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineItemProps {
  memory: Memory;
  isLeft?: boolean;
}

export function TimelineItem({ memory, isLeft = false }: TimelineItemProps) {
  const displayDate = format(new Date(memory.date), "d 'de' MMMM, yyyy", {
    locale: ptBR,
  });

  return (
    <div className={`relative w-full my-6 flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
      {/* Linha e Ponto (A Estrela) */}
      <div className={`absolute top-1/2 h-0.5 w-1/2 bg-nebula-purple/30 ${isLeft ? 'right-1/2' : 'left-1/2'}`}></div>
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-4 h-4 bg-star-gold rounded-full z-10 border-2 border-space-dark animate-pulse"></div>

      {/* Card da Memória */}
      <div className={`w-11/12 md:w-1/2 px-4 md:px-8`}>
        <div className="bg-space-blue p-6 rounded-lg shadow-lg hover:shadow-nebula-purple/20 transition-all duration-300 transform hover:-translate-y-1">
          <Image src={memory.coverImage} alt={memory.title} width={500} height={300} className="w-full h-48 object-cover rounded-md mb-4"/>
          <p className="text-sm text-nebula-purple font-serif">{displayDate}</p>
          <h3 className="text-2xl font-serif text-text-light mt-2 mb-3">{memory.title}</h3>
          <p className="text-text-dark font-sans line-clamp-3 leading-relaxed">{memory.description}</p>
          <Link href={`/memories/${memory.id}`} className="inline-block mt-4 text-star-gold hover:underline font-semibold">
            Ver história completa &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}