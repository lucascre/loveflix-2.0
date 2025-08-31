// src/app/admin/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Faremos uma chamada para uma API interna para verificar a senha
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      // Se a senha estiver correta, redireciona para o painel
      router.push('/admin/dashboard');
    } else {
      // Se errada, mostra uma mensagem de erro
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-papiro-light">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-serif text-center text-ink-dark">
          Área Restrita
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="text-sm font-bold text-ink-light block"
            >
              Senha de Acesso
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-papiro-dark rounded-md focus:ring-gold-accent focus:border-gold-accent"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-papiro-light bg-gold-accent rounded-md hover:bg-opacity-90 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}