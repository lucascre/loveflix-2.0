"use client";
import type { Moment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { X, Download, Trash2, Calendar, Clock, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { deleteMoment } from "@/app/actions";
import { useState, useEffect } from "react";

interface MomentModalProps {
  moment: Moment & { albumImages?: string[] };
  onClose: () => void;
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};

export function MomentModal({ moment, onClose }: MomentModalProps) {
  const { status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isVideo = moment.fileType?.startsWith("video/");
  
  // Criar array com todas as imagens (capa + álbum)
  const allImages = [moment.imageUrl, ...(moment.albumImages || [])];
  const isAlbum = allImages.length > 1;
  const currentImage = allImages[currentImageIndex];

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = 'hidden';
    
    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const nextImage = () => {
    if (isAlbum && currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const previousImage = () => {
    if (isAlbum && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `${moment.title || "loveflix"}-${currentImageIndex + 1}`;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que quer apagar este ${isAlbum ? 'álbum' : 'momento'}? Esta ação não pode ser desfeita.`)) {
      setIsDeleting(true);
      try {
        await deleteMoment(moment.id);
        handleClose();
      } catch (error) {
        alert("Erro ao apagar. Tente novamente.");
        setIsDeleting(false);
      }
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4
                transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md"></div>
      
      {/* Modal content */}
      <div 
        className={`relative bg-[#181818] w-full max-w-6xl max-h-[95vh] rounded-none md:rounded-xl 
                  overflow-hidden shadow-2xl transform transition-all duration-300
                  ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={handleClose} 
          title="Fechar (Esc)"
          className="absolute top-4 right-4 z-30 text-white bg-[#181818]/90 backdrop-blur-sm
                   rounded-full p-2 hover:bg-neutral-700 transition-all duration-200
                   btn-transition shadow-lg"
        >
          <X size={28} />
        </button>

        {/* Album counter badge */}
        {isAlbum && (
          <div className="absolute top-4 left-4 z-30 glass-effect px-4 py-2 rounded-full
                        flex items-center gap-2 text-white shadow-lg">
            <Images size={18} className="text-red-600" />
            <span className="font-bold text-sm">
              {currentImageIndex + 1} / {allImages.length}
            </span>
          </div>
        )}

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[95vh] hide-scrollbar">
          {/* Media section with navigation */}
          <div className="relative w-full aspect-video bg-black group">
            {/* Previous button */}
            {isAlbum && currentImageIndex > 0 && (
              <button
                onClick={previousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20
                         bg-black/70 backdrop-blur-sm text-white p-3 rounded-full
                         hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100
                         btn-transition shadow-lg"
                title="Anterior (←)"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Next button */}
            {isAlbum && currentImageIndex < allImages.length - 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20
                         bg-black/70 backdrop-blur-sm text-white p-3 rounded-full
                         hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100
                         btn-transition shadow-lg"
                title="Próxima (→)"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Current media */}
            {isVideo && currentImageIndex === 0 ? (
              <video
                src={currentImage}
                controls
                autoPlay
                className="w-full h-full object-contain"
                key={currentImage}
              />
            ) : (
              <img 
                src={currentImage} 
                alt={`${moment.title || "Momento"} - ${currentImageIndex + 1}`}
                className="w-full h-full object-contain transition-opacity duration-300"
                key={currentImage}
              />
            )}
            
            {/* Gradient overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 
                          bg-gradient-to-t from-[#181818] to-transparent pointer-events-none"></div>
          </div>

          {/* Thumbnail strip for album */}
          {isAlbum && (
            <div className="bg-[#0a0a0a] p-4 border-t border-neutral-800">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded overflow-hidden
                              transition-all duration-200 border-2
                              ${index === currentImageIndex 
                                ? 'border-red-600 scale-105' 
                                : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 0 && isVideo && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-0.5"></div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info section */}
          <div className="p-6 md:p-10 space-y-6">
            {/* Title and actions */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                  {moment.title || "Momento Especial"}
                </h2>
                
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-red-600" />
                    <span>{formatDate(moment.momentDate)}</span>
                  </div>
                  
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-red-600" />
                    <span>Adicionado em {formatDateTime(moment.createdAt)}</span>
                  </div>
                  
                  {isAlbum && (
                    <>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <div className="flex items-center gap-2">
                        <Images size={16} className="text-red-600" />
                        <span>{allImages.length} {isVideo ? 'arquivos' : 'fotos'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {status === "authenticated" && (
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={handleDownload}
                    title="Baixar imagem atual"
                    className="flex items-center gap-2 bg-neutral-700 text-white 
                             px-4 py-2.5 rounded-full hover:bg-neutral-600 
                             transition-all duration-200 btn-transition font-medium"
                  >
                    <Download size={18} />
                    <span className="hidden sm:inline">Baixar</span>
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    title={`Apagar ${isAlbum ? 'álbum' : 'momento'}`}
                    disabled={isDeleting}
                    className="flex items-center gap-2 bg-red-600 text-white 
                             px-4 py-2.5 rounded-full hover:bg-red-700 
                             transition-all duration-200 btn-transition
                             disabled:bg-gray-600 disabled:cursor-not-allowed font-medium"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                      rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Apagando...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Apagar</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-700"></div>

            {/* Additional info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Sobre {isAlbum ? 'este álbum' : 'este momento'}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {moment.title || "Um momento especial guardado para sempre em nossa coleção de memórias."} 
                  {isAlbum && ` Este álbum contém ${allImages.length} ${isVideo ? 'arquivos' : 'fotos'} para você reviver cada detalhe.`}
                  {" "}Criado com amor e carinho para preservar os melhores momentos da nossa história.
                </p>
              </div>
              
              {/* Tags section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Detalhes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {isAlbum ? (
                    <span className="px-3 py-1 bg-neutral-800 text-gray-300 text-sm rounded-full flex items-center gap-1">
                      <Images size={14} />
                      Álbum
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-neutral-800 text-gray-300 text-sm rounded-full">
                      {isVideo ? 'Vídeo' : 'Imagem'}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-neutral-800 text-gray-300 text-sm rounded-full">
                    {new Date(moment.momentDate).getFullYear()}
                  </span>
                  <span className="px-3 py-1 bg-neutral-800 text-gray-300 text-sm rounded-full">
                    HD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}