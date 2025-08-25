// src/app/map/page.tsx
"use client"; // <--- ADICIONE ESTA LINHA NO TOPO

import { memories } from '@/data/memories';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

export default function MapPage() {
  // Como agora estamos em um Client Component, a importação dinâmica funciona perfeitamente.
  // O useMemo ainda é uma boa prática para evitar recarregar o componente desnecessariamente.
  const Map = useMemo(() => dynamic(
    () => import('@/components/MapComponent').then(mod => mod.MapComponent),
    { 
      loading: () => <p className='text-center p-10'>Carregando mapa...</p>,
      ssr: false 
    }
  ), []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-serif text-star-gold">Mapa de Aventuras</h1>
        <p className="text-xl text-text-dark mt-4">Todos os lugares que se tornaram parte da nossa história.</p>
      </div>
      <div className="rounded-lg overflow-hidden shadow-2xl">
        <Map memories={memories} />
      </div>
    </div>
  );
}