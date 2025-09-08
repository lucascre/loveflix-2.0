// src/app/api/memories/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET: Retorna todas as memórias do banco de dados.
 * Esta função é chamada pela página do dashboard e da timeline para exibir as memórias.
 */
export async function GET() {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: {
        date: 'desc', // Ordena as memórias da mais recente para a mais antiga
      },
    });
    return NextResponse.json(memories);
  } catch (error) {
    console.error('Erro ao buscar memórias:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Erro interno do servidor ao buscar memórias.' }),
      { status: 500 }
    );
  }
}

/**
 * POST: Cria uma nova memória no banco de dados.
 * Esta função recebe os dados do formulário do painel de administração.
 */
export async function POST(request: Request) {
  try {
    // 1. Recebe e interpreta o corpo do pedido como JSON.
    const body = await request.json();
    const { title, date, description, coverImage, locationName, lat, lng } = body;

    // 2. Validação no servidor: Garante que os campos essenciais não estão vazios.
    // A validação do `coverImage` é crucial aqui.
    if (!title || !date || !description || !coverImage) {
      return new NextResponse(
        JSON.stringify({ message: 'Campos obrigatórios (título, data, descrição, imagem) faltando.' }),
        { status: 400 }
      );
    }

    // 3. Cria o registo na base de dados usando o Prisma.
    const newMemory = await prisma.memory.create({
      data: {
        title,
        date: new Date(date), // Converte a string de data para um objeto Date
        description,
        coverImage, // O URL do UploadThing é guardado aqui
        locationName,
        lat, // O Prisma aceita `null` se não for fornecido
        lng,
      },
    });

    // 4. Retorna uma resposta de sucesso com a memória criada.
    return new NextResponse(
      JSON.stringify({ message: 'Memória criada com sucesso!', memory: newMemory }),
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error('Erro ao criar memória:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
}