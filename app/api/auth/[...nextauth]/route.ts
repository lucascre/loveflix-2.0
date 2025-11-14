import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // 1. Importar do novo local

// 2. Criar o handler usando as opções
const handler = NextAuth(authOptions);

// 3. Exportar APENAS o handler (GET e POST)
export { handler as GET, handler as POST };