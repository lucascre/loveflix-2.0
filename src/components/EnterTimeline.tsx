// src/components/EnterTimeline.tsx
"use client";

interface EnterTimelineProps {
  onEnter: () => void;
}

export function EnterTimeline({ onEnter }: EnterTimelineProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-papiro-light text-center p-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-ink-dark mb-4">
        Nossa Linha do Tempo
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-ink-light max-w-2xl mx-auto mb-8">
        Esta jornada é acompanhada por uma trilha sonora especial.
      </p>
      <button
        onClick={onEnter}
        className="bg-gold-accent text-papiro-light font-bold py-3 px-8 rounded-full hover:bg-opacity-80 transition-all text-lg shadow-lg shadow-gold-accent/30"
      >
        Começar a viagem &rarr;
      </button>
    </div>
  );
}