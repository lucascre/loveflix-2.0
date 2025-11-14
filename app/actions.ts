"use server"; // Mágico! Isso roda no servidor.

import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

// Ação para salvar o momento no banco de dados
export async function saveMoment(imageUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  try {
    await db.moment.create({
      data: {
        imageUrl: imageUrl,
        title: "Novo Momento", // Você pode adicionar um formulário para isso
        userId: session.user.id,
      },
    });

    // Limpa o cache da página inicial para que a nova foto apareça
    revalidatePath("/"); 

  } catch (error) {
    console.error("Erro ao salvar momento:", error);
    throw new Error("Falha ao salvar no banco de dados.");
  }
}