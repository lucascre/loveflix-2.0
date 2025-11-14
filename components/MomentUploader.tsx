"use client";
import { UploadDropzone } from "@/utils/uploadthing";
import { saveMoment } from "@/app/actions";
import { useState, useRef } from "react";
import { File } from "lucide-react";

export function MomentUploader({ categoryNames }: { categoryNames: string[] }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSaveMoment(formData: FormData) {
    try {
      if (imageUrl && fileType) {
        formData.append("imageUrl", imageUrl);
        formData.append("fileType", fileType);
      } else {
        alert("Por favor, envie um arquivo primeiro.");
        return;
      }
      
      await saveMoment(formData);
      alert("Momento salvo! ❤️");
      setImageUrl(null);
      setFileType(null);
      formRef.current?.reset();
      
    } catch (error) {
      alert("Erro ao salvar o momento.");
    }
  }

  const renderPreview = () => {
    if (!imageUrl || !fileType) return null;
    if (fileType.startsWith("video/")) {
      return <video src={imageUrl} controls className="w-full rounded-lg object-cover" />;
    }
    return <img src={imageUrl} alt="Preview" className="w-full rounded-lg object-cover" />;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {!imageUrl && (
        <UploadDropzone
          endpoint="momentUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              setImageUrl(res[0].ufsUrl);
              setFileType(res[0].type);
            }
          }}
          onUploadError={(error: Error) => {
            alert(`ERRO no upload! ${error.message}`);
          }}
          className="w-full max-w-md ut-label:text-lg ut-label:text-red-600 ut-upload-icon:text-gray-400 ut-allowed-content:text-gray-400 ut-button:bg-red-600 ut-button:ut-readying:bg-red-700"
          content={{
            label: "Arraste e solte ou clique para enviar",
            allowedContent: "Imagens (até 4MB) ou Vídeos (até 32MB)",
            uploadIcon: <File size={48} />,
          }}
        />
      )}

      {imageUrl && (
        <form 
          ref={formRef}
          action={handleSaveMoment}
          className="flex flex-col gap-4 w-full max-w-md"
        >
          <p className="text-center text-sm text-gray-300">Arquivo enviado! Adicione os detalhes:</p>
          {renderPreview()}
          
          <div className="flex flex-col">
            <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-200">Descrição:</label>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Ex: Nosso primeiro natal..."
              className="bg-neutral-700 text-white p-2 rounded-lg border border-neutral-600"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="momentDate" className="mb-1 text-sm font-medium text-gray-200">Data do Momento:</label>
            <input
              type="date"
              name="momentDate"
              id="momentDate"
              required
              className="bg-neutral-700 text-white p-2 rounded-lg border border-neutral-600"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="categoryName" className="mb-1 text-sm font-medium text-gray-200">Categoria:</label>
            <input
              type="text"
              name="categoryName"
              id="categoryName"
              placeholder="Ex: Viagens, Feriados, Família"
              required
              list="categories-list"
              className="bg-neutral-700 text-white p-2 rounded-lg border border-neutral-600"
            />
            <datalist id="categories-list">
              {categoryNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </div>
          
          <button 
            type="submit"
            className="bg-red-600 text-white font-bold p-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Salvar Momento
          </button>
        </form>
      )}
    </div>
  );
}