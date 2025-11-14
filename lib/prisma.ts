import { PrismaClient } from '@prisma/client';
// 1. NÃO precisamos mais importar o 'Pool'
import { PrismaNeon } from '@prisma/adapter-neon';

// Declara um 'cachedPrisma' global para persistir no ambiente de desenvolvimento
declare global {
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // 2. ESTA É A MUDANÇA:
  // Em vez de criar um 'Pool', passamos a string de conexão
  // DIRETAMENTE para o adaptador PrismaNeon.
  const adapter = new PrismaNeon(process.env.DATABASE_URL!); 
  prisma = new PrismaClient({ adapter });
} else {
  // Configuração de desenvolvimento (para evitar múltiplas conexões)
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

export const db = prisma;