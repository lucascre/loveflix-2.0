import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      // A única alteração é aqui. O resto do ficheiro permanece igual.
      console.log("Upload completo! URL do ficheiro:", file.url);
      
      // Retorna o URL para o cliente.
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;