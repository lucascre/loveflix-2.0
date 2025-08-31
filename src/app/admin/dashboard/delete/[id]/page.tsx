// src/app/admin/dashboard/delete/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Memory } from '@/data/memories';
import Link from 'next/link';

export default function DeleteMemoryPage() {
    const [memory, setMemory] = useState<Memory | null>(null);
    const [message, setMessage] = useState('');
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (id) {
            fetch(`/api/memories/${id}`)
                .then((res) => res.json())
                .then(setMemory);
        }
    }, [id]);

    const handleDelete = async () => {
        setMessage('');

        const response = await fetch(`/api/memories/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setMessage('Memória excluída com sucesso!');
            router.push('/admin/dashboard');
        } else {
            setMessage('Erro ao excluir a memória.');
        }
    };

    if (!memory) return <p>Carregando...</p>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-lg text-center">
            <h1 className="text-4xl font-serif text-red-600 mb-4">
                Confirmar Exclusão
            </h1>
            <p className="text-ink-dark text-lg mb-8">
                Você tem certeza que deseja excluir a memória: <br />
                <strong className="font-serif text-xl">"{memory.title}"</strong>?
            </p>
            <p className="text-sm text-ink-light mb-8">
                Esta ação não poderá ser desfeita.
            </p>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Sim, Excluir
                </button>
                <Link
                    href="/admin/dashboard"
                    className="bg-gray-300 text-ink-dark font-bold py-3 px-8 rounded-lg hover:bg-gray-400 transition-colors"
                >
                    Cancelar
                </Link>
            </div>
            {message && <p className="mt-6 text-center">{message}</p>}
        </div>
    );
}