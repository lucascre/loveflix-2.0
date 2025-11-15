"use client";
import { UploadDropzone } from "@/utils/uploadthing";
import { saveMoment } from "@/app/actions";
import { useState, useRef } from "react";
import { File, X, Images, Plus } from "lucide-react";

interface UploadedFile {
  url: string;
  type: string;
}

export function MomentUploader({ categoryNames }: { categoryNames: string[] }) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploadingMore, setIsUploadingMore] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSaveMoment(formData: FormData) {
    try {
      if (uploadedFiles.length === 0) {
        alert("Por favor, envie pelo menos um arquivo.");
        return;
      }
      
      // A primeira imagem é a capa
      const mainFile = uploadedFiles[0];
      formData.append("imageUrl", mainFile.url);
      formData.append("fileType", mainFile.type);
      
      // Se houver mais imagens, adicionar como álbum
      if (uploadedFiles.length > 1) {
        const albumUrls = uploadedFiles.slice(1).map(f => f.url);
        formData.append("albumImages", JSON.stringify(albumUrls));
      }
      
      await saveMoment(formData);
      alert(`Momento salvo com ${uploadedFiles.length} ${uploadedFiles.length > 1 ? 'arquivos' : 'arquivo'}! ❤️`);
      setUploadedFiles([]);
      setIsUploadingMore(false);
      formRef.current?.reset();
      
    } catch (error) {
      alert("Erro ao salvar o momento.");
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderFilePreview = (file: UploadedFile, index: number) => {
    const isVideo = file.type.startsWith("video/");
    
    return (
      <div key={index} className="relative group">
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-800">
          {isVideo ? (
            <video src={file.url} className="w-full h-full object-cover" />
          ) : (
            <img src={file.url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
          )}
          
          {/* Badge de capa */}
          {index === 0 && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
              CAPA
            </div>
          )}
          
          {/* Número da imagem */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {index + 1}
          </div>
          
          {/* Botão remover */}
          <button
            onClick={() => removeFile(index)}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                     transition-opacity flex items-center justify-center"
            type="button"
          >
            <div className="bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors">
              <X size={20} className="text-white" />
            </div>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="text-center mb-2">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Images className="text-red-600" size={24} />
          Adicionar Novo Momento
        </h3>
        <p className="text-sm text-gray-400 mt-1">
          {uploadedFiles.length === 0 
            ? "Envie uma ou várias fotos/vídeos para criar um álbum"
            : `${uploadedFiles.length} arquivo(s) adicionado(s)`}
        </p>
      </div>

      {/* Mostrar preview das imagens já enviadas */}
      {uploadedFiles.length > 0 && (
        <div className="w-full max-w-2xl">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {uploadedFiles.map((file, index) => renderFilePreview(file, index))}
            
            {/* Botão para adicionar mais imagens */}
            {uploadedFiles.length < 10 && !isUploadingMore && (
              <button
                onClick={() => setIsUploadingMore(true)}
                className="aspect-square rounded-lg border-2 border-dashed border-neutral-600 
                         hover:border-red-600 transition-colors flex flex-col items-center 
                         justify-center gap-2 bg-neutral-800/50 hover:bg-neutral-800"
                type="button"
              >
                <Plus size={32} className="text-gray-400" />
                <span className="text-xs text-gray-400">Adicionar mais</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload zone */}
      {(uploadedFiles.length === 0 || isUploadingMore) && (
        <div className="w-full max-w-md">
          <UploadDropzone
            endpoint="momentUploader"
            onClientUploadComplete={(res) => {
              if (res && res[0]) {
                setUploadedFiles(prev => [...prev, {
                  url: res[0].url,
                  type: res[0].type
                }]);
                setIsUploadingMore(false);
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERRO no upload! ${error.message}`);
              setIsUploadingMore(false);
            }}
            className="w-full ut-label:text-lg ut-label:text-red-600 
                     ut-upload-icon:text-gray-400 ut-allowed-content:text-gray-400 
                     ut-button:bg-red-600 ut-button:ut-readying:bg-red-700"
            content={{
              label: isUploadingMore ? "Adicionar mais arquivos" : "Arraste e solte ou clique para enviar",
              allowedContent: "Imagens (até 4MB) ou Vídeos (até 32MB)",
              uploadIcon: <File size={48} />,
            }}
          />
          
          {isUploadingMore && (
            <button
              onClick={() => setIsUploadingMore(false)}
              className="mt-2 w-full text-sm text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              Cancelar
            </button>
          )}
        </div>
      )}

      {/* Formulário de detalhes */}
      {uploadedFiles.length > 0 && !isUploadingMore && (
        <form 
          ref={formRef}
          action={handleSaveMoment}
          className="flex flex-col gap-4 w-full max-w-md mt-4"
        >
          <div className="glass-effect rounded-lg p-4 border border-neutral-700">
            <p className="text-center text-sm text-gray-300 mb-4">
              {uploadedFiles.length === 1 
                ? "Preencha os detalhes deste momento:"
                : `Criar álbum com ${uploadedFiles.length} arquivos:`}
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="title" className="mb-1 text-sm font-medium text-gray-200">
                  Título do {uploadedFiles.length > 1 ? 'Álbum' : 'Momento'}:
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder={uploadedFiles.length > 1 
                    ? "Ex: Férias em Portugal 2024" 
                    : "Ex: Nosso primeiro natal..."}
                  className="bg-neutral-700 text-white p-3 rounded-lg border border-neutral-600 
                           focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="momentDate" className="mb-1 text-sm font-medium text-gray-200">
                  Data do Momento:
                </label>
                <input
                  type="date"
                  name="momentDate"
                  id="momentDate"
                  required
                  className="bg-neutral-700 text-white p-3 rounded-lg border border-neutral-600
                           focus:border-red-600 focus:outline-none transition-colors"
                />
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="categoryName" className="mb-1 text-sm font-medium text-gray-200">
                  Categoria:
                </label>
                <input
                  type="text"
                  name="categoryName"
                  id="categoryName"
                  placeholder="Ex: Viagens, Feriados, Família"
                  required
                  list="categories-list"
                  className="bg-neutral-700 text-white p-3 rounded-lg border border-neutral-600
                           focus:border-red-600 focus:outline-none transition-colors"
                />
                <datalist id="categories-list">
                  {categoryNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            className="bg-red-600 text-white font-bold p-4 rounded-lg 
                     hover:bg-red-700 transition-all duration-300 
                     shadow-lg hover:shadow-red-600/50 netflix-glow
                     flex items-center justify-center gap-2"
          >
            <Images size={20} />
            Salvar {uploadedFiles.length > 1 ? 'Álbum' : 'Momento'}
          </button>
        </form>
      )}
    </div>
  );
}