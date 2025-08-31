// src/app/api/memories/[id]/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { memories } from '@/data/memories';
import type { Memory } from '@/data/memories';

const memoriesFilePath = path.join(process.cwd(), 'src/data/memories.ts');

// Função para reescrever o arquivo de memórias
async function updateMemoriesFile(newMemories: Memory[]) {
  const fileContent = `
// src/data/memories.ts
export interface Memory {
  id: string;
  title: string;
  date: string;
  description: string;
  coverImage: string;
  galleryImages?: string[];
  videoSrc?: string;
  location?: { name: string; lat: number; lng: number; };
}

export const memories: Memory[] = ${JSON.stringify(newMemories, null, 2)};
`;
  await fs.writeFile(memoriesFilePath, fileContent.trim());
}

// GET: Obter uma única memória
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const memory = memories.find((m) => m.id === params.id);
  if (memory) {
    return NextResponse.json(memory);
  }
  return new NextResponse('Memória não encontrada.', { status: 404 });
}

// PUT: Atualizar uma memória
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updatedData = await request.json();
  const memoryIndex = memories.findIndex((m) => m.id === params.id);

  if (memoryIndex === -1) {
    return new NextResponse('Memória não encontrada.', { status: 404 });
  }

  // Atualiza a memória com os novos dados
  const allMemories = [...memories];
  allMemories[memoryIndex] = {
    ...allMemories[memoryIndex], // Mantém dados existentes como ID e imagem
    ...updatedData,             // Sobrescreve com os dados do formulário
  };

  await updateMemoriesFile(allMemories);

  return NextResponse.json(allMemories[memoryIndex]);
}


// DELETE: Excluir uma memória
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const newMemories = memories.filter((m) => m.id !== params.id);

    if (newMemories.length === memories.length) {
        return new NextResponse('Memória não encontrada.', { status: 404 });
    }

    await updateMemoriesFile(newMemories);

    return new NextResponse('Memória excluída com sucesso.', { status: 200 });
}