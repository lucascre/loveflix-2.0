// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'admin-auth';

export function middleware(request: NextRequest) {
  // Pega o cookie de autenticação da requisição
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Se o usuário está tentando acessar o dashboard sem o cookie de autenticação...
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    if (!authCookie || authCookie.value !== 'true') {
      // ...redirecionamos ele para a página de login.
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // Permite que a requisição continue
  return NextResponse.next();
}

// Define quais rotas serão protegidas pelo middleware
export const config = {
  matcher: ['/admin/dashboard/:path*'],
};