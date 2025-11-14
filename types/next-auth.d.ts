import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// "Aumenta" (estende) os tipos padrão do NextAuth
declare module "next-auth" {
  /**
   * Retornado pela `useSession`, `getSession` e recebido 
   * como prop pelo `SessionProvider`
   */
  interface Session {
    user: {
      /** O ID do utilizador no banco de dados. */
      id: string;
    } & DefaultSession["user"]; // Preserva os tipos padrão (name, email, image)
  }

  /** O objeto do utilizador como é retornado do banco de dados */
  interface User {
    id: string;
  }
}