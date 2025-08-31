// src/app/map/page.tsx
"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import type { Memory } from '@/data/memories';

export default function MapPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  
  // Busca os dados no lado do cliente
  useEffect(() => {
    fetch('/api/memories')
      .then(res => res.json())
      .then(data => setMemories(data));
  }, []);

  const Map = useMemo(() => dynamic(
    () => import('@/components/MapComponent').then(mod => mod.MapComponent),
    { 
      loading: () => <p className='text-center p-10'>A carregar mapa...</p>,
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