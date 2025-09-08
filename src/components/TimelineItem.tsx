// src/components/TimelineItem.tsx
import Image from 'next/image';
// CORREÇÃO: Mude a importação para usar o tipo do Prisma Client
import type { Memory } from '@prisma/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineItemProps {
  memory: Memory;
  isLeft?: boolean;
  onClick: () => void;
}

export function TimelineItem({ memory, isLeft = false, onClick }: TimelineItemProps) {
  // O new Date() é necessário porque a data vem do Prisma como objeto Date
  const displayDate = format(new Date(memory.date), "d 'de' MMMM, yyyy", {
    locale: ptBR,
  });

  return (
    <div className={`relative w-full my-6 flex justify-end md:${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`hidden md:block absolute top-1/2 h-0.5 w-1/2 bg-rose-accent/40 ${isLeft ? 'right-1/2' : 'left-1/2'}`}></div>
      <div className="absolute top-1/2 -translate-y-1/2 left-2 -translate-x-1/2 w-4 h-4 bg-gold-accent rounded-full z-10 border-2 border-papiro-light md:left-1/2"></div>

      <button onClick={onClick} className={`w-10/12 md:w-1/2 px-4 md:px-8 text-left`}>
        <div className="bg-papiro-dark p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-rose-accent/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          {/* Garante que coverImage não é nulo antes de passar para o Image */}
          {memory.coverImage && (
             <Image src={memory.coverImage} alt={memory.title} width={500} height={300} className="w-full h-auto object-cover rounded-md mb-4 border-4 border-papiro-light shadow-md"/>
          )}
          <p className="text-xs sm:text-sm text-rose-accent font-serif">{displayDate}</p>
          <h3 className="text-xl sm:text-2xl font-serif text-ink-dark mt-2 mb-3">{memory.title}</h3>
          {/* Garante que a descrição não é nula */}
          <p className="text-sm sm:text-base text-ink-light font-sans line-clamp-3 leading-relaxed">{memory.description || ''}</p>
          <span className="inline-block mt-4 text-gold-accent font-semibold text-sm sm:text-base">
            Ver detalhes &rarr;
          </span>
        </div>
      </button>
    </div>
  );
}