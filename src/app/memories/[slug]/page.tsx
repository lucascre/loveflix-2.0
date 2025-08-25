// src/app/memories/[slug]/page.tsx
import { memories } from '@/data/memories';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface MemoryPageProps {
  params: { slug: string };
}

// Gera as páginas estaticamente no momento da build para melhor performance
export async function generateStaticParams() {
  return memories.map(memory => ({
    slug: memory.id,
  }));
}

export default function MemoryPage({ params }: MemoryPageProps) {
  const memory = memories.find(m => m.id === params.slug);

  if (!memory) {
    notFound(); // Se não encontrar a memória, mostra página 404
  }

  const displayDate = format(new Date(memory.date), "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link href="/timeline" className="text-nebula-purple hover:underline mb-8 inline-block">&larr; Voltar para a linha do tempo</Link>
      
      <h1 className="text-5xl font-serif text-star-gold mb-2">{memory.title}</h1>
      <p className="text-text-dark text-lg mb-6 capitalize">{displayDate}</p>

      <Image src={memory.coverImage} alt={memory.title} width={900} height={500} className="w-full h-auto object-cover rounded-lg shadow-lg mb-8"/>
      
      <div className="prose prose-invert prose-lg max-w-none text-text-light font-sans leading-relaxed">
        <p>{memory.description}</p>
      </div>

      {memory.galleryImages && memory.galleryImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-serif text-star-gold mb-6">Galeria de Fotos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {memory.galleryImages.map((img, index) => (
              <Image key={index} src={img} alt={`Galeria ${index + 1}`} width={300} height={300} className="rounded-md object-cover w-full h-full shadow-md"/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}