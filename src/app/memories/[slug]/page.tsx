// src/app/memories/[slug]/page.tsx
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Memory } from '@/data/memories';

type Props = {
  params: { slug: string };
};

// Função para buscar uma memória específica
async function getMemory(slug: string): Promise<Memory | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/memories/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return null;
  }
  return res.json();
}

// Removemos a função generateStaticParams para tornar a página dinâmica
export default async function MemoryPage({ params }: Props) {
  const memory = await getMemory(params.slug);

  if (!memory) {
    notFound(); // Se não encontrar a memória, mostra a página 404
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
      
      <div className="prose prose-lg max-w-none text-ink-light font-sans leading-relaxed">
        <p className="text-ink-dark">{memory.description}</p>
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