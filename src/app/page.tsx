// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4 bg-gradient-radial from-space-blue to-space-dark">
      <h1 className="text-5xl md:text-7xl font-serif text-white mb-4">
        Nossa Constelação de Memórias
      </h1>
      <p className="text-lg md:text-xl text-text-dark max-w-2xl mx-auto mb-8">
        Para nós, cada momento juntos é uma estrela no céu.
      </p>
      <Link href="/timeline" className="bg-star-gold text-space-dark font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors text-lg">
        Explorar nossa jornada &rarr;
      </Link>
    </div>
  );
}