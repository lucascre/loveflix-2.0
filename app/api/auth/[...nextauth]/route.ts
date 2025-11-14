import NextAuth, { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/prisma";

// Crie e EXPORTE as opções de configuração
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // --- ESTE É O NOVO BLOCO DE CÓDIGO ---
    // Esta verificação acontece ANTES de criar a sessão
    async signIn({ user, account, profile }) {
      
      // 1. Garante que temos um email do usuário
      const userEmail = user.email;
      if (!userEmail) {
        console.error("NextAuth: Tentativa de login sem email.");
        return false; // Bloqueia o login
      }

      // 2. Puxa a lista de emails permitidos do .env
      const allowedEmail1 = process.env.ALLOWED_EMAIL_1;
      const allowedEmail2 = process.env.ALLOWED_EMAIL_2;

      // 3. Verifica se os emails estão configurados no .env
      if (!allowedEmail1 || !allowedEmail2) {
        console.error("NextAuth ERRO: Emails permitidos não configurados no .env");
        return false; // Bloqueia todos os logins se a lista VIP não existir
      }

      // 4. Compara o email do usuário com a lista VIP
      if (userEmail === allowedEmail1 || userEmail === allowedEmail2) {
        console.log(`NextAuth: Acesso permitido para ${userEmail}`);
        return true; // Permite o login
      } else {
        console.warn(`NextAuth: Acesso NEGADO para ${userEmail}`);
        return false; // Bloqueia o login
        // Para redirecionar para uma página de "acesso negado":
        // return '/acesso-negado';
      }
    },
    // --- FIM DO NOVO BLOCO DE CÓDIGO ---

    // Este callback (que já tínhamos) adiciona o ID do usuário à sessão
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

// Crie o handler usando as opções
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };