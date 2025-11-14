import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const f = createUploadthing();

// Função para pegar a sessão do usuário do NextAuth
const getUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const ourFileRouter = {
  // Define uma rota de upload chamada "momentUploader"
  momentUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    
    // Middleware: Define as permissões (só usuários logados)
    .middleware(async ({ req }) => {
      const user = await getUser();

      // Se o usuário não estiver logado, jogue um erro
      if (!user) throw new Error("Não autorizado");

      // Se logado, retorne o ID do usuário
      return { userId: user.id };
    })
    
    // onUploadComplete: O que fazer APÓS o upload (vamos salvar no DB)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload completo para o usuário:", metadata.userId);
      console.log("URL do arquivo:", file.url);

      // Aqui é onde salvamos no banco de dados!
      // Importe o 'db' do seu lib/prisma.ts
      // (Pode ser necessário mover o 'db' para um arquivo separado se houver problemas de importação)
      
      /* // Esta lógica será movida para uma Server Action no frontend,
      // mas a lógica principal é esta:
      
      await db.moment.create({
         data: {
           imageUrl: file.url,
           title: "Novo Momento", // Você pode adicionar um título depois
           userId: metadata.userId,
         }
       });
      */

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;