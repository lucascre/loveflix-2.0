// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // Senha segura
const AUTH_COOKIE_NAME = 'admin-auth';

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    console.error('A variável de ambiente ADMIN_PASSWORD não está definida.');
    return new NextResponse('Erro de configuração do servidor.', { status: 500 });
  }

  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Se a senha estiver correta, criamos um "cookie" seguro
      // que funciona como um passe de entrada para as áreas protegidas.
      cookies().set(AUTH_COOKIE_NAME, 'true', {
        httpOnly: true, // O cookie não pode ser acessado por scripts de frontend
        secure: process.env.NODE_ENV === 'production', // Use https em produção
        maxAge: 60 * 60 * 24, // Expira em 24 horas
        path: '/',
      });
      return new NextResponse('Login bem-sucedido!', { status: 200 });
    } else {
      // Senha incorreta
      return new NextResponse('Senha inválida.', { status: 401 });
    }
  } catch (error) {
    return new NextResponse('Ocorreu um erro.', { status: 400 });
  }
}