"use client";

import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { useState } from "react";

interface ImageUploaderProps {
  // Uma função que será chamada com o URL da imagem após o upload bem-sucedido.
  onUploadComplete: (url: string) => void;
}

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      {/* A correção é feita aqui, adicionando "imageUploader" como o segundo tipo */}
      <UploadButton<OurFileRouter, "imageUploader">
        endpoint="imageUploader" // O nome do endpoint que definimos em `core.ts`
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            // Chama a função passada por props com o novo URL
            onUploadComplete(res[0].url);
            setError(null);
            alert("Upload concluído com sucesso!");
          }
        }}
        onUploadError={(error: Error) => {
          setError(`Erro no upload: ${error.message}`);
          alert(`Erro no upload: ${error.message}`);
        }}
        // Personalização da aparência do botão
        appearance={{
          button: "bg-gold-accent text-papiro-light font-bold py-2 px-4 rounded-md",
          container: "w-full",
        }}
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}