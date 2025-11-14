import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma"; ///route.ts]

// Crie e EXPORTE as opções de configuração
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db), ///route.ts]
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ], ///route.ts]
  callbacks: {
    // A nossa lógica de "lista VIP"
    async signIn({ user }) {
      const userEmail = user.email;
      if (!userEmail) {
        console.error("NextAuth: Tentativa de login sem email.");
        return '/acesso-negado';
      }
      const allowedEmail1 = process.env.ALLOWED_EMAIL_1;
      const allowedEmail2 = process.env.ALLOWED_EMAIL_2;
      if (!allowedEmail1 || !allowedEmail2) {
        console.error("NextAuth ERRO: Emails permitidos não configurados no .env");
        return '/acesso-negado';
      }
      if (userEmail === allowedEmail1 || userEmail === allowedEmail2) {
        console.log(`NextAuth: Acesso permitido para ${userEmail}`);
        return true;
      } else {
        console.warn(`NextAuth: Acesso NEGADO para ${userEmail}`);
        return '/acesso-negado';
      }
    }, ///route.ts]
    
    // Adicionar o ID do usuário à sessão
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }, ///route.ts]
  },
};