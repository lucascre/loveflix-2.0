"use client";
import { UploadButton } from "@/utils/uploadthing"; // Nosso helper
import { saveMoment } from "@/app/actions"; // Nossa Server Action
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MomentUploader() {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      {isUploading && <p className="text-gray-300">Enviando...</p>}
      <UploadButton
        endpoint="momentUploader" // O nome da rota que definimos no core.ts
        onUploadBegin={() => {
          setIsUploading(true);
        }}
        onClientUploadComplete={async (res) => {
          // Upload feito! 'res' contém a URL do arquivo
          if (res && res[0]) {
            try {
              // Chama a Server Action para salvar no DB
              await saveMoment(res[0].url);
              alert("Momento salvo! ❤️");
            } catch (error) {
              alert("Erro ao salvar o momento.");
            }
          }
          setIsUploading(false);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          alert(`ERRO! ${error.message}`);
        }}
      />
    </div>
  );
}