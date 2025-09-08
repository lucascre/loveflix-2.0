// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { memories as localMemories } from '../src/data/memories';

const prisma = new PrismaClient();

async function main() {
  console.log(`A iniciar o processo de seeding...`);

  // 1. Limpa a tabela para evitar duplicados
  await prisma.memory.deleteMany({});
  console.log('Tabela de memórias antiga limpa com sucesso.');

  // 2. Mapeia os dados do arquivo local para o formato exato do banco de dados
  const formattedMemories = localMemories.map(memory => {
    // Retorna um novo objeto contendo apenas os campos que o schema do Prisma espera
    return {
      title: memory.title,
      date: new Date(memory.date), // Converte a string de data para um objeto Date
      description: memory.description,
      coverImage: memory.coverImage,
      // Usa o operador optional chaining (?) para evitar erros se 'location' não existir
      locationName: memory.location?.name,
      lat: memory.location?.lat,
      lng: memory.location?.lng,
    };
  });

  // 3. Insere todos os registros de uma só vez com os dados já formatados
  const result = await prisma.memory.createMany({
    data: formattedMemories,
    skipDuplicates: true, // Ignora se houver algum duplicado por segurança
  });

  console.log(`Seeding concluído com sucesso! Foram criados ${result.count} registos de memórias.`);
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });