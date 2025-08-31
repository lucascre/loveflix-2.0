// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { memories as localMemories } from '../src/data/memories';

const prisma = new PrismaClient();

async function main() {
  console.log(`A iniciar a migração de dados...`);

  // Limpa a tabela para evitar duplicados se o script for corrido várias vezes
  await prisma.memory.deleteMany({});
  console.log('Tabela de memórias antiga limpa.');

  // Mapeia os dados do ficheiro local para o formato esperado pela base de dados
  const formattedMemories = localMemories.map(memory => {
    // O 'id' original em string não é necessário, a base de dados irá gerar um numérico
    const { id, galleryImages, videoSrc, ...restOfMemory } = memory;
    
    return {
      ...restOfMemory,
      date: new Date(memory.date), // Converte a string de data para um objeto Date
      lat: memory.location?.lat,
      lng: memory.location?.lng,
      locationName: memory.location?.name,
    };
  });

  // Insere todas as memórias na base de dados de uma só vez
  const result = await prisma.memory.createMany({
    data: formattedMemories,
    skipDuplicates: true, // Ignora se houver algum duplicado por segurança
  });

  console.log(`Migração concluída com sucesso! Foram criados ${result.count} registos de memórias.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Ocorreu um erro durante a migração:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
