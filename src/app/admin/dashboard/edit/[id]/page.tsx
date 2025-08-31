// src/app/admin/dashboard/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Memory } from '@/data/memories';

export default function EditMemoryPage() {
  const [memory, setMemory] = useState<Partial<Memory>>({});
  const [message, setMessage] = useState('');
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetch(`/api/memories/${id}`)
        .then((res) => res.json())
        .then((data) => {
          // Formata a data para o formato YYYY-MM-DD para o input type="date"
          if (data.date) {
            data.date = data.date.split('T')[0];
          }
          setMemory(data);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMemory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const response = await fetch(`/api/memories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memory),
    });

    if (response.ok) {
      setMessage('Memória atualizada com sucesso!');
      router.push('/admin/dashboard');
    } else {
      setMessage('Erro ao atualizar a memória.');
    }
  };
  
  if (!memory.id) return <p>Carregando...</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-star-gold mb-8">
        Editar Memória
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl p-8 bg-papiro-dark rounded-lg shadow-lg space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-ink-light">Título</label>
          <input type="text" id="title" name="title" value={memory.title || ''} onChange={handleChange} required className="w-full mt-1 p-2 rounded" />
        </div>
        <div>
          <label htmlFor="date" className="block text-ink-light">Data</label>
          <input type="date" id="date" name="date" value={memory.date || ''} onChange={handleChange} required className="w-full mt-1 p-2 rounded" />
        </div>
        <div>
          <label htmlFor="description" className="block text-ink-light">Descrição</label>
          <textarea id="description" name="description" value={memory.description || ''} onChange={handleChange} required rows={6} className="w-full mt-1 p-2 rounded" />
        </div>
        
        {/* Adicione aqui os campos de localização se desejar editá-los também */}

        <button
          type="submit"
          className="w-full bg-gold-accent text-papiro-light font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all"
        >
          Salvar Alterações
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </form>
    </div>
  );
}