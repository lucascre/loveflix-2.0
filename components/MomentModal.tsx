"use client";
import type { Moment } from "@prisma/client";
import { useSession } from "next-auth/react";
import { X, Download, Trash2, Calendar, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { deleteMoment } from "@/app/actions";
import { useState, useEffect, useRef, TouchEvent } from "react";

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

export function MomentModal({ moment, onClose }: MomentModalProps) {
  const { status } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  const isVideo = moment.fileType?.startsWith("video/");
  const allImages = [moment.imageUrl, ...(moment.albumImages || [])];
  const isAlbum = allImages.length > 1;
  const currentImage = allImages[currentImageIndex];

  // Mínimo de distância para considerar swipe (50px)
  const minSwipeDistance = 50;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = 'hidden';
    
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
  }, [currentImageIndex]);

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

  // Handlers para touch/swipe
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      previousImage();
    }
  };

  const handleDownload = () => {
    try {
      // Para mobile, abrir em nova aba
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.open(currentImage, '_blank');
      } else {
        // Desktop: download direto
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `${moment.title || "loveflix"}-${currentImageIndex + 1}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      // Fallback: abrir em nova aba
      window.open(currentImage, '_blank');
    }
  };

  const handleDelete = async () => {
    const confirmMessage = isAlbum 
      ? `Apagar este álbum com ${allImages.length} ${allImages.length === 1 ? 'foto' : 'fotos'}?`
      : 'Apagar este momento?';
    
    if (window.confirm(confirmMessage)) {
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
      className={`fixed inset-0 z-50 flex items-center justify-center
                transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95"></div>
      
      {/* Modal content */}
      <div 
        className={`relative bg-[#181818] w-full h-full md:max-w-6xl md:h-auto md:max-h-[95vh] 
                  md:rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300
                  ${isVisible ? 'scale-100' : 'scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header fixo com botões */}
        <div className="absolute top-0 left-0 right-0 z-30 p-3 md:p-4 
                      bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
          {/* Album counter */}
          {isAlbum && (
            <div className="glass-effect px-3 py-2 rounded-full flex items-center gap-2 text-white shadow-lg">
              <Images size={16} className="text-red-600" />
              <span className="font-bold text-sm">
                {currentImageIndex + 1}/{allImages.length}
              </span>
            </div>
          )}
          
          <div className={!isAlbum ? 'w-full flex justify-end' : ''}>
            <button 
              onClick={handleClose} 
              className="bg-[#181818]/90 backdrop-blur-sm text-white rounded-full p-2 
                       hover:bg-neutral-700 active:scale-95 transition-all shadow-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="h-full md:max-h-[95vh] overflow-y-auto hide-scrollbar">
          {/* Media section com swipe support */}
          <div 
            ref={imageContainerRef}
            className="relative w-full h-[60vh] md:h-auto md:aspect-video bg-black touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Setas de navegação (desktop) */}
            {isAlbum && currentImageIndex > 0 && (
              <button
                onClick={previousImage}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
                         bg-black/70 backdrop-blur-sm text-white p-3 rounded-full
                         hover:bg-black/90 transition-all active:scale-95 shadow-lg"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {isAlbum && currentImageIndex < allImages.length - 1 && (
              <button
                onClick={nextImage}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
                         bg-black/70 backdrop-blur-sm text-white p-3 rounded-full
                         hover:bg-black/90 transition-all active:scale-95 shadow-lg"
              >
                <ChevronRight size={32} />
              </button>
            )}

            {/* Setas mobile (menores, nos cantos inferiores) */}
            {isAlbum && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={previousImage}
                    className="md:hidden absolute left-4 bottom-4 z-20
                             bg-black/70 backdrop-blur-sm text-white p-2 rounded-full
                             active:scale-95 transition-all shadow-lg"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                
                {currentImageIndex < allImages.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="md:hidden absolute right-4 bottom-4 z-20
                             bg-black/70 backdrop-blur-sm text-white p-2 rounded-full
                             active:scale-95 transition-all shadow-lg"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}
              </>
            )}

            {/* Indicador de swipe (mobile) */}
            {isAlbum && (
              <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-20
                            bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                Deslize para navegar ←→
              </div>
            )}

            {/* Imagem/Vídeo atual */}
            {isVideo && currentImageIndex === 0 ? (
              <video
                src={currentImage}
                controls
                playsInline
                className="w-full h-full object-contain"
                key={currentImage}
              />
            ) : (
              <img 
                src={currentImage} 
                alt={`${moment.title || "Momento"} - ${currentImageIndex + 1}`}
                className="w-full h-full object-contain select-none"
                draggable={false}
                key={currentImage}
              />
            )}
          </div>

          {/* Thumbnail strip (apenas desktop ou tablets) */}
          {isAlbum && allImages.length > 1 && (
            <div className="hidden md:block bg-[#0a0a0a] p-4 border-t border-neutral-800">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-14 rounded overflow-hidden
                              transition-all duration-200 border-2 active:scale-95
                              ${index === currentImageIndex 
                                ? 'border-red-600 scale-105' 
                                : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Dots indicator (mobile) */}
          {isAlbum && allImages.length > 1 && (
            <div className="md:hidden flex justify-center gap-2 py-4 bg-[#141414]">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all active:scale-125
                            ${index === currentImageIndex 
                              ? 'bg-red-600 w-6' 
                              : 'bg-gray-600'}`}
                />
              ))}
            </div>
          )}

          {/* Info section */}
          <div className="p-4 md:p-8 space-y-4 bg-[#141414]">
            {/* Title and date */}
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
                {moment.title || "Momento Especial"}
              </h2>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-red-600" />
                  <span>{formatDate(moment.momentDate)}</span>
                </div>
                
                {isAlbum && (
                  <>
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    <div className="flex items-center gap-1">
                      <Images size={14} className="text-red-600" />
                      <span>{allImages.length} {allImages.length === 1 ? 'foto' : 'fotos'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action buttons */}
            {status === "authenticated" && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 
                           bg-neutral-700 text-white px-6 py-3 rounded-lg 
                           hover:bg-neutral-600 active:scale-95
                           transition-all font-medium"
                >
                  <Download size={18} />
                  <span>Baixar</span>
                </button>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 
                           bg-red-600 text-white px-6 py-3 rounded-lg 
                           hover:bg-red-700 active:scale-95
                           transition-all disabled:bg-gray-600 
                           disabled:cursor-not-allowed font-medium"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent 
                                    rounded-full animate-spin"></div>
                      <span>Apagando...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      <span>Apagar</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}