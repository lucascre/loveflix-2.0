"use client";
import type { Moment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { X, Download, Trash2 } from "lucide-react";
import { deleteMoment } from "@/app/actions";
import { useState } from "react";

interface MomentModalProps {
  moment: Moment;
  onClose: () => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
};

export function MomentModal({ moment, onClose }: MomentModalProps) {
  const { status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const isVideo = moment.fileType?.startsWith("video/");

  const handleDownload = () => {
    // 1. Cria um link invisível
    const link = document.createElement('a');
    link.href = moment.imageUrl;
    
    // 2. Define o nome do ficheiro
    link.download = moment.title || "loveflix";
    
    // 3. Diz ao telemóvel para abrir numa nova aba (importante!)
    link.target = "_blank"; 
    
    // 4. "Clica" no link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que quer apagar este momento?")) {
      setIsDeleting(true);
      try {
        await deleteMoment(moment.id);
        onClose();
      } catch (error) {
        alert("Erro ao apagar. Tente novamente.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-neutral-900 max-w-4xl w-full max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          title="Fechar"
          className="absolute top-3 right-3 z-20 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full h-auto max-h-[70vh] flex items-center justify-center bg-black">
          {isVideo ? (
            <video
              src={moment.imageUrl}
              controls
              autoPlay
              className="w-auto h-auto max-w-full max-h-[70vh]"
            />
          ) : (
            <img 
              src={moment.imageUrl} 
              alt={moment.title || "Momento"} 
              className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
            />
          )}
        </div>

        {/* Esta secção já é responsiva graças ao `flex-col sm:flex-row` */}
        <div className="p-4 md:p-6 bg-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              {moment.title || "Momento Especial"}
            </h2>
            <p className="text-sm sm:text-md text-gray-300">
              {formatDate(moment.momentDate)}
            </p>
          </div>
          {status === "authenticated" && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                title="Baixar"
                className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handleDelete}
                title="Apagar"
                disabled={isDeleting}
                className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors disabled:bg-gray-500"
              >
                {isDeleting ? "..." : <Trash2 size={20} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}