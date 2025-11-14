import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth"; // <-- MUDANÇA AQUI

const f = createUploadthing();

// Função para pegar a sessão do usuário do NextAuth
const getUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const ourFileRouter = {
  // Define a rota de upload (AGORA ACEITA VÍDEOS)
  momentUploader: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    video: { maxFileSize: "32MB", maxFileCount: 1 }
  })
    // Middleware
    .middleware(async ({ req }) => {
      const user = await getUser();
      if (!user) throw new Error("Não autorizado");
      return { userId: user.id };
    })
    
    // onUploadComplete
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completo para o usuário:", metadata.userId);
      console.log("URL do arquivo:", file.url); //
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;