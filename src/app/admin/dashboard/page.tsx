// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Memory } from '@prisma/client';
import { ImageUploader } from '@/components/ImageUploader'; // Importa o componente de upload

// Define um tipo para o estado do formulário para maior clareza e segurança de tipos.
type NewMemoryForm = {
  title: string;
  date: string;
  description: string;
  coverImage: string | null; // Armazena o URL da imagem
  locationName: string;
  lat: string;
  lng: string;
};

// Define o estado inicial para limpar o formulário facilmente.
const initialFormState: NewMemoryForm = {
    title: '',
    date: '',
    description: '',
    coverImage: null,
    locationName: '',
    lat: '',
    lng: ''
};

export default function AdminDashboardPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<NewMemoryForm>(initialFormState);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Busca as memórias existentes quando o componente é montado.
  const fetchMemories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/memories');
      if (response.ok) setMemories(await response.json());
    } catch (error) {
      console.error("Erro ao buscar memórias:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { fetchMemories(); }, []);
  
  // Atualiza o estado do formulário a cada alteração nos inputs.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Lida com a submissão do formulário.
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!formData.coverImage) {
      setMessage('Por favor, faça o upload de uma imagem de capa.');
      return;
    }
    setIsSubmitting(true);

    // 2. Prepara os dados para serem enviados, convertendo tipos se necessário.
    const dataToSend = {
        ...formData,
        lat: formData.lat === '' ? null : parseFloat(formData.lat),
        // CORREÇÃO AQUI: Usar formData.lng em vez de apenas lng
        lng: formData.lng === '' ? null : parseFloat(formData.lng.toString()),
    };

    try {
      // 3. Envia os dados completos para a API via POST.
      const response = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar memória.');
      }

      setMessage('Memória adicionada com sucesso!');
      setFormData(initialFormState); // Limpa o formulário
      await fetchMemories(); // Recarrega a lista de memórias
      
    } catch (error: any) {
        setMessage(`Erro: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif text-star-gold mb-8">Painel de Administração</h1>
      
      <form onSubmit={handleCreateSubmit} className="max-w-2xl p-8 bg-papiro-dark rounded-lg shadow-lg space-y-4 mb-16">
        <h2 className="text-2xl font-serif text-ink-dark mb-4">Adicionar Nova Memória</h2>
        
        <div>
          <label htmlFor="title" className="block text-ink-light">Título</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        <div>
          <label htmlFor="date" className="block text-ink-light">Data</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        <div>
          <label htmlFor="description" className="block text-ink-light">Descrição</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        
        <div>
          <label className="block text-ink-light mb-2">Imagem de Capa</label>
          <ImageUploader 
            onUploadComplete={(url) => {
              // 4. PONTO-CHAVE: Quando o upload termina, o URL é recebido aqui...
              // ...e o estado do formulário é atualizado com esse URL.
              setFormData(prev => ({...prev, coverImage: url}));
            }}
          />
          {formData.coverImage && (
            <div className='mt-4'>
              <p className='text-sm text-ink-light'>Pré-visualização:</p>
              <img src={formData.coverImage} alt="Pré-visualização da imagem carregada" className="rounded-md max-h-40 mt-2"/>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="locationName" className="block text-ink-light">Nome do Local</label>
          <input type="text" name="locationName" value={formData.locationName} onChange={handleChange} className="w-full mt-1 p-2 rounded border border-papiro-light" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lat" className="block text-ink-light">Latitude</label>
            <input type="number" step="any" name="lat" value={formData.lat} onChange={handleChange} className="w-full mt-1 p-2 rounded border border-papiro-light" />
          </div>
          <div>
            <label htmlFor="lng" className="block text-ink-light">Longitude</label>
            <input type="number" step="any" name="lng" value={formData.lng} onChange={handleChange} className="w-full mt-1 p-2 rounded border border-papiro-light" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-gold-accent text-papiro-light font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all disabled:bg-gray-400">
          {isSubmitting ? 'A guardar...' : 'Salvar Memória'}
        </button>
        {message && <p className="mt-4 text-center text-ink-dark">{message}</p>}
      </form>

      <div>
        <h2 className="text-3xl font-serif text-ink-dark mb-6">Gerenciar Memórias Existentes</h2>
        <div className="space-y-4">
          {isLoading ? ( <p className="text-ink-light">A carregar memórias...</p> ) : 
            memories.length > 0 ? (
              memories.map((memory) => (
              <div key={memory.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-papiro-dark rounded-lg shadow gap-4">
                <div>
                  <p className="font-bold text-ink-dark">{memory.title}</p>
                  <p className="text-sm text-ink-light">{new Date(memory.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  <Link href={`/admin/dashboard/edit/${memory.id}`} className="text-sm font-semibold text-blue-600 hover:underline">Editar</Link>
                  <Link href={`/admin/dashboard/delete/${memory.id}`} className="text-sm font-semibold text-red-600 hover:underline">Excluir</Link>
                </div>
              </div>
            ))
          ) : ( <p className="text-ink-light">Nenhuma memória encontrada.</p> )}
        </div>
      </div>
    </div>
  );
}