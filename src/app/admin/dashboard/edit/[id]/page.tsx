"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Memory } from '@prisma/client';
import { ImageUploader } from '@/components/ImageUploader';

type MemoryFormData = {
  title?: string;
  date?: string;
  description?: string;
  coverImage?: string | null;
  locationName?: string | null;
  lat?: string;
  lng?: string;
};

export default function EditMemoryPage() {
    const [formData, setFormData] = useState<MemoryFormData>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (id) {
            fetch(`/api/memories/${id}`)
                .then((res) => {
                    if (!res.ok) throw new Error('Memória não encontrada ou falha ao carregar.');
                    return res.json();
                })
                .then((data: Memory) => {
                    setFormData({
                        title: data.title,
                        date: new Date(data.date).toISOString().split('T')[0],
                        description: data.description ?? '',
                        coverImage: data.coverImage ?? null,
                        locationName: data.locationName ?? '',
                        lat: data.lat?.toString() ?? '',
                        lng: data.lng?.toString() ?? '',
                    });
                })
                .catch(error => {
                    setMessage(`Erro: ${error.message}`);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const latValue = formData.lat;
            const lngValue = formData.lng;

            const dataToUpdate = {
                ...formData,
                lat: (latValue == null || latValue === '') ? null : parseFloat(latValue),
                lng: (lngValue == null || lngValue === '') ? null : parseFloat(lngValue),
            };

            const response = await fetch(`/api/memories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToUpdate)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao atualizar a memória.');
            }

            setMessage('Memória atualizada com sucesso!');
            setTimeout(() => router.push('/admin/dashboard'), 1500);
        } catch (error: any) {
            setMessage(`Erro: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="text-center p-12">A carregar memória para edição...</p>;
    if (!formData.title && !isLoading) return <p className="text-center p-12 text-red-600">Memória não encontrada.</p>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif text-star-gold mb-8">
                Editar Memória
            </h1>
            <form onSubmit={handleSubmit} className="max-w-2xl p-8 bg-papiro-dark rounded-lg shadow-lg space-y-4">
                <div>
                    <label htmlFor="title" className="block text-ink-light">Título</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleChange} required className="w-full mt-1 p-2 rounded border border-papiro-light" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-ink-light">Data</label>
                    <input type="date" name="date" value={formData.date || ''} onChange={handleChange} required className="w-full mt-1 p-2 rounded border border-papiro-light" />
                </div>
                <div>
                    <label htmlFor="description" className="block text-ink-light">Descrição</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} required rows={6} className="w-full mt-1 p-2 rounded border border-papiro-light" />
                </div>
                
                <div>
                    <label className="block text-ink-light mb-2">Imagem de Capa</label>
                    {formData.coverImage && <img src={formData.coverImage} alt="Pré-visualização da imagem de capa" className="rounded-md max-h-40 mb-4" />}
                    <ImageUploader 
                        onUploadComplete={(url) => {
                            setFormData(prev => ({...prev, coverImage: url}));
                        }}
                    />
                </div>
                
                <div>
                  <label htmlFor="locationName" className="block text-ink-light">Nome do Local</label>
                  <input type="text" name="locationName" value={formData.locationName || ''} onChange={handleChange} className="w-full mt-1 p-2 rounded border border-papiro-light" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lat" className="block text-ink-light">Latitude</label>
                    <input type="number" step="any" name="lat" value={formData.lat || ''} onChange={handleChange} className="w-full mt-1 p-2 rounded border border-papiro-light" />
                  </div>
                  <div>
                    <label htmlFor="lng" className="block text-ink-light">Longitude</label>
                    <input type="number" step="any" name="lng" value={formData.lng || ''} onChange={handleChange} className="w-full mt-1 p-2 rounded border border-papiro-light" />
                  </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold-accent text-papiro-light font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-all disabled:bg-gray-400"
                >
                    {isSubmitting ? 'A atualizar...' : 'Salvar Alterações'}
                </button>
                
                {message && <p className="mt-4 text-center text-ink-dark">{message}</p>}
            </form>
        </div>
    );
}