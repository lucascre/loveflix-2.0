// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Memory } from '@prisma/client';

export default function AdminDashboardPage() {
  // Estado para a lista de memórias existentes
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para feedback de carregamento
  
  // Estados para o formulário de criação de nova memória
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [locationName, setLocationName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [message, setMessage] = useState('');

  // Função para buscar as memórias da API
  const fetchMemories = async () => {
    setIsLoading(true); // Começa a carregar
    try {
      const response = await fetch('/api/memories');
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      } else {
        console.error("Falha ao buscar memórias");
        setMemories([]); // Garante que a lista fique vazia em caso de erro
      }
    } catch (error) {
      console.error("Erro na rede ao buscar memórias:", error);
    } finally {
      setIsLoading(false); // Termina de carregar
    }
  };

  // useEffect para carregar as memórias quando a página carregar
  useEffect(() => {
    fetchMemories();
  }, []);

  // Função para lidar com o envio do formulário de criação
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!image) {
      setMessage('Por favor, selecione uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('date', date);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('locationName', locationName);
    formData.append('lat', lat);
    formData.append('lng', lng);

    const response = await fetch('/api/memories', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      setMessage('Memória adicionada com sucesso!');
      // Limpar formulário
      setTitle('');
      setDate('');
      setDescription('');
      setImage(null);
      (document.getElementById('image') as HTMLInputElement).value = '';
      setLocationName('');
      setLat('');
      setLng('');
      // Atualiza a lista de memórias para mostrar a nova
      fetchMemories(); 
    } else {
      const errorData = await response.json();
      setMessage(`Erro ao adicionar memória: ${errorData.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-star-gold mb-8">
        Painel de Administração
      </h1>
      
      {/* Formulário para CRIAR NOVA MEMÓRIA */}
      <form
        onSubmit={handleCreateSubmit}
        className="max-w-2xl p-8 bg-papiro-dark rounded-lg shadow-lg space-y-4 mb-16"
      >
        <h2 className="text-2xl font-serif text-ink-dark">
          Adicionar Nova Memória
        </h2>
        {/* Campos do formulário (título, data, etc.) */}
        <div>
          <label htmlFor="title" className="block text-ink-light">Título</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        <div>
          <label htmlFor="date" className="block text-ink-light">Data</label>
          <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        <div>
          <label htmlFor="description" className="block text-ink-light">Descrição</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        <div>
          <label htmlFor="image" className="block text-ink-light">Imagem de Capa</label>
          <input type="file" id="image" onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} required accept="image/*" className="w-full mt-1 p-2 rounded bg-white border border-papiro-light" />
        </div>
        <button
          type="submit"
          className="w-full bg-gold-accent text-papiro-light font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all"
        >
          Salvar Memória
        </button>
        {message && <p className="mt-4 text-center text-ink-dark">{message}</p>}
      </form>

      {/* Secção para GERENCIAR MEMÓRIAS EXISTENTES */}
      <div>
        <h2 className="text-3xl font-serif text-ink-dark mb-6">
          Gerenciar Memórias Existentes
        </h2>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-ink-light">A carregar memórias...</p>
          ) : memories.length > 0 ? (
            memories.map((memory) => (
              <div
                key={memory.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-papiro-dark rounded-lg shadow gap-4"
              >
                <div>
                  <p className="font-bold text-ink-dark">{memory.title}</p>
                  <p className="text-sm text-ink-light">{new Date(memory.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <Link
                    href={`/admin/dashboard/edit/${memory.id}`}
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/admin/dashboard/delete/${memory.id}`}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Excluir
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-ink-light">Nenhuma memória encontrada. Adicione uma no formulário acima!</p>
          )}
        </div>
      </div>
    </div>
  );
}
