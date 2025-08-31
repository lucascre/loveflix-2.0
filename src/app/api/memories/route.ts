// src/app/api/memories/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { memories } from '@/data/memories'; // Importa as memórias atuais
import type { Memory } from '@/data/memories';

// --- GET: Retornar todas as memórias ---
// Esta função é chamada quando o painel de administração precisa listar as memórias.
export async function GET() {
  try {
    // Ordena as memórias da mais nova para a mais antiga para exibir na ordem correta
    const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json(sortedMemories);
  } catch (error) {
    console.error('Erro ao buscar memórias:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Erro interno do servidor ao buscar memórias.' }),
      { status: 500 }
    );
  }
}

// --- POST: Criar uma nova memória ---
// Esta função é chamada pelo formulário de "Adicionar Nova Memória".
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extrai os dados do formulário
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as File;
    const locationName = formData.get('locationName') as string | null;
    const lat = formData.get('lat') as string | null;
    const lng = formData.get('lng') as string | null;

    // Validação básica
    if (!title || !date || !description || !image) {
      return new NextResponse(
        JSON.stringify({ message: 'Campos obrigatórios (título, data, descrição, imagem) faltando.' }),
        { status: 400 }
      );
    }

    // 1. Salvar a imagem no servidor
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    // Cria um nome de arquivo único para evitar sobreposições
    const imageName = `${Date.now()}-${image.name.replace(/\s/g, '_')}`;
    
    // --- CORREÇÃO IMPORTANTE ---
    // Garante que o diretório de destino exista antes de tentar salvar o arquivo.
    const imagesDir = path.join(process.cwd(), 'public/images');
    await fs.mkdir(imagesDir, { recursive: true }); 
    // A opção { recursive: true } impede erros se a pasta já existir.
    // --- FIM DA CORREÇÃO ---
    
    const imagePath = path.join(imagesDir, imageName);
    
    await fs.writeFile(imagePath, imageBuffer);
    
    const coverImage = `/images/${imageName}`; // O caminho público para a imagem

    // 2. Criar o novo objeto de memória
    const newMemory: Memory = {
      id: title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') + '-' + Date.now(),
      title,
      date,
      description,
      coverImage,
    };
    
    // Adiciona a localização apenas se todos os campos relacionados forem fornecidos
    if (locationName && lat && lng) {
        newMemory.location = {
            name: locationName,
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        }
    }

    // 3. Atualizar o arquivo de dados `memories.ts`
    const allMemories = [...memories, newMemory];
    
    const memoriesFilePath = path.join(process.cwd(), 'src/data/memories.ts');
    
    // Monta o conteúdo completo do novo arquivo .ts
    const fileContent = `// src/data/memories.ts

export interface Memory {
  id: string;
  title: string;
  date: string; // Formato 'YYYY-MM-DD'
  description: string;
  coverImage: string; // Caminho para a imagem principal
  galleryImages?: string[]; // Imagens adicionais
  videoSrc?: string; // Caminho para o vídeo
  location?: { name: string; lat: number; lng: number; };
}

export const memories: Memory[] = ${JSON.stringify(allMemories, null, 2)};
`;

    await fs.writeFile(memoriesFilePath, fileContent.trim());

    // Retorna uma resposta de sucesso com a memória criada
    return new NextResponse(
      JSON.stringify({ message: 'Memória criada com sucesso!', memory: newMemory }),
      { status: 201 } // 201 significa "Created"
    );
  } catch (error) {
    console.error('Erro ao criar memória:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Erro interno do servidor.' }),
      { status: 500 }
    );
  }
}

