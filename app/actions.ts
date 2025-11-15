"use server"; 

import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveMoment(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const title = formData.get("title") as string;
  const momentDate = formData.get("momentDate") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const fileType = formData.get("fileType") as string;
  const categoryName = formData.get("categoryName") as string;
  const albumImagesJson = formData.get("albumImages") as string;

  if (!imageUrl || !fileType || !momentDate || !categoryName || categoryName.trim() === "") {
    throw new Error("Dados incompletos (arquivo, tipo, data e categoria são obrigatórios).");
  }

  try {
    const category = await db.category.upsert({
      where: { name: categoryName.trim() },
      update: {},
      create: { name: categoryName.trim() },
    });

    // Parse do array de imagens do álbum (se existir)
    let albumImages: string[] = [];
    if (albumImagesJson) {
      try {
        albumImages = JSON.parse(albumImagesJson);
      } catch (e) {
        console.error("Erro ao parsear albumImages:", e);
      }
    }

    await db.moment.create({
      data: {
        imageUrl: imageUrl,
        fileType: fileType,
        title: title || "Novo Momento",
        momentDate: new Date(momentDate),
        userId: session.user.id,
        categoryId: category.id,
        albumImages: albumImages, // Adiciona o array de imagens
      },
    });

    revalidatePath("/"); 

  } catch (error) {
    console.error("Erro ao salvar momento:", error);
    throw new Error("Falha ao salvar no banco de dados.");
  }
}

export async function deleteMoment(momentId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  try {
    const moment = await db.moment.findUnique({
      where: { id: momentId },
    });

    if (moment?.userId !== session.user.id) {
      throw new Error("Não autorizado a apagar este momento.");
    }

    await db.moment.delete({
      where: {
        id: momentId,
      },
    });

    revalidatePath("/"); 
    return { success: true };

  } catch (error) {
    console.error("Erro ao apagar momento:", error);
    throw new Error("Falha ao apagar do banco de dados.");
  }
}