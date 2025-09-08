// src/app/api/memories/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- GET: Obter uma única memória pelo ID ---
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const memory = await prisma.memory.findUnique({
      where: { id: parseInt(params.id, 10) },
    });
    if (memory) {
      return NextResponse.json(memory);
    }
    return new NextResponse('Memória não encontrada.', { status: 404 });
  } catch (error) {
    return new NextResponse('Erro ao buscar memória.', { status: 500 });
  }
}

// --- PUT: Atualizar uma memória ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, date, description, coverImage, locationName, lat, lng } = body;

    const updatedMemory = await prisma.memory.update({
      where: { id: parseInt(params.id, 10) },
      data: {
        title,
        date: new Date(date),
        description,
        coverImage,
        locationName,
        lat: lat ? parseFloat(lat) : null,
        lng: lng ? parseFloat(lng) : null,
      },
    });

    return NextResponse.json(updatedMemory);
  } catch (error) {
    console.error('Erro ao atualizar memória:', error);
    return new NextResponse('Erro ao atualizar memória.', { status: 500 });
  }
}

// --- DELETE: Excluir uma memória ---
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.memory.delete({
      where: { id: parseInt(params.id, 10) },
    });
    return new NextResponse('Memória excluída com sucesso.', { status: 200 });
  } catch (error) {
    return new NextResponse('Memória não encontrada.', { status: 404 });
  }
}