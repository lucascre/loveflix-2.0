// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-papiro-light">
      {/* Ajustes de tamanho de fonte para sm, md e lg */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-ink-dark mb-4">
        Nosso Diário de Memórias
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-ink-light max-w-2xl mx-auto mb-8">
        Cada página, uma lembrança. Cada palavra, um sentimento. <br /> A história de um amor que o tempo só faz florescer.
      </p>
      <Link
        href="/timeline"
        className="bg-gold-accent text-papiro-light font-bold py-3 px-6 sm:px-8 rounded-full hover:bg-opacity-80 transition-all text-base sm:text-lg shadow-lg shadow-gold-accent/30"
      >
        Ler nossa história &rarr;
      </Link>
    </div>
  );
}