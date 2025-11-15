"use client";
import { useState, useEffect, TouchEvent } from "react";
import { useRouter } from "next/navigation";
import type { Moment } from "@prisma/client";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Home,
  Info
} from "lucide-react";

interface MomentViewerProps {
  moment: Moment & { albumImages?: string[] };
}

export function MomentViewer({ moment }: MomentViewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const allImages = [moment.imageUrl, ...(moment.albumImages || [])];
  const isAlbum = allImages.length > 1;
  const currentImage = allImages[currentIndex];
  const isVideo = moment.fileType?.startsWith("video/") && currentIndex === 0;

  const minSwipeDistance = 50;

  useEffect(() => {
    // Esconder controles após 3 segundos de inatividade
    let timeout: NodeJS.Timeout;
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    resetTimeout();
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('touchstart', resetTimeout);

    // Atalhos de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
      if (e.key === 'ArrowLeft') previousImage();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === 'r' || e.key === 'R') handleRotate();
      if (e.key === 'i' || e.key === 'I') setShowInfo(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('touchstart', resetTimeout);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, router]); // Adicionado 'router' à dependência

  const nextImage = () => {
    if (isAlbum && currentIndex < allImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetView();
    }
  };

  const previousImage = () => {
    if (isAlbum && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetView();
    }
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    try {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.open(currentImage, '_blank');
      } else {
        const link = document.createElement('a');
        link.href = currentImage;
        link.download = `${moment.title || "loveflix"}-${currentIndex + 1}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch {
      window.open(currentImage, '_blank');
    }
  };

  // Touch handlers
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
    
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) previousImage();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header com controles */}
      <div 
        className={`absolute top-0 left-0 right-0 z-50 transition-all duration-300
                   bg-gradient-to-b from-black/80 to-transparent p-4
                   ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                       hover:bg-black/70 active:scale-95 transition-all"
              title="Voltar (Esc)"
            >
              <X size={24} />
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                       hover:bg-black/70 active:scale-95 transition-all"
              title="Ir para início"
            >
              <Home size={24} />
            </button>

            {isAlbum && (
              <div className="hidden md:block glass-effect px-4 py-2 rounded-full text-white text-sm font-bold">
                {currentIndex + 1} / {allImages.length}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="hidden md:block text-white text-lg font-bold truncate max-w-md">
            {moment.title || "Momento Especial"}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {!isVideo && (
              <>
                <button
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                           hover:bg-black/70 active:scale-95 transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={20} />
                </button>

                <span className="text-white text-sm font-bold min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>

                <button
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                           hover:bg-black/70 active:scale-95 transition-all
                           disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Zoom In (+)"
                >
                  <ZoomIn size={20} />
                </button>

                <button
                  onClick={handleRotate}
                  className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                           hover:bg-black/70 active:scale-95 transition-all"
                  title="Girar (R)"
                >
                  <RotateCw size={20} />
                </button>
              </>
            )}

            <button
              onClick={handleDownload}
              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                       hover:bg-black/70 active:scale-95 transition-all"
              title="Baixar"
            >
              <Download size={20} />
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full 
                       hover:bg-black/70 active:scale-95 transition-all"
              title="Informações (I)"
            >
              <Info size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content - Imagem/Vídeo */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {isVideo ? (
          <video
            src={currentImage}
            controls
            autoPlay
            playsInline
            className="max-w-full max-h-full object-contain"
            // O ATRIBUTO 'style' FOI REMOVIDO DAQUI
          />
        ) : (
          <img
            src={currentImage}
            alt={moment.title || "Momento"}
            className="max-w-full max-h-full object-contain select-none transition-transform duration-300"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              cursor: zoom > 1 ? 'move' : 'default',
            }}
            draggable={false}
          />
        )}

        {/* Navigation arrows (aparecem sempre que há álbum) */}
        {isAlbum && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={previousImage}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-40
                         bg-black/70 backdrop-blur-sm text-white p-3 md:p-4 rounded-full
                         hover:bg-black/90 active:scale-95 transition-all shadow-2xl
                         ${showControls ? 'opacity-100' : 'opacity-0 md:opacity-0 md:hover:opacity-100'}`}
                title="Anterior (←)"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {currentIndex < allImages.length - 1 && (
              <button
                onClick={nextImage}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-40
                         bg-black/70 backdrop-blur-sm text-white p-3 md:p-4 rounded-full
                         hover:bg-black/90 active:scale-95 transition-all shadow-2xl
                         ${showControls ? 'opacity-100' : 'opacity-0 md:opacity-0 md:hover:opacity-100'}`}
                title="Próxima (→)"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </>
        )}

        {/* Mobile swipe hint */}
        {isAlbum && (
          <div 
            className={`md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-40
                       bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm
                       transition-opacity duration-300
                       ${showControls ? 'opacity-100' : 'opacity-0'}`}
          >
            Deslize para navegar ←→
          </div>
        )}
      </div>

      {/* Bottom bar com thumbnails/dots */}
      {isAlbum && (
        <div 
          className={`absolute bottom-0 left-0 right-0 z-50 transition-all duration-300
                     bg-gradient-to-t from-black/80 to-transparent p-4
                     ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          {/* Desktop: Thumbnails */}
          <div className="hidden md:block max-w-7xl mx-auto">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar justify-center">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetView();
                  }}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden
                            transition-all duration-200 border-2 active:scale-95
                            ${index === currentIndex 
                              ? 'border-red-600 scale-110' 
                              : 'border-white/30 opacity-60 hover:opacity-100'}`}
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

          {/* Mobile: Dots */}
          <div className="md:hidden flex justify-center gap-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  resetView();
                }}
                className={`h-2 rounded-full transition-all active:scale-125
                          ${index === currentIndex 
                            ? 'bg-red-600 w-8' 
                            : 'bg-white/50 w-2 hover:bg-white/70'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info panel (lateral) */}
      {showInfo && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-full md:w-96 z-50 
                   bg-black/95 backdrop-blur-xl p-6 overflow-y-auto
                   animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-bold text-white">
                {moment.title || "Momento Especial"}
              </h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Data do Momento</p>
                <p className="text-white font-medium">{formatDate(moment.momentDate)}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Adicionado em</p>
                <p className="text-white font-medium">{formatDate(moment.createdAt)}</p>
              </div>

              {isAlbum && (
                <div>
                  <p className="text-gray-400 mb-1">Álbum</p>
                  <p className="text-white font-medium">
                    {allImages.length} {allImages.length === 1 ? 'foto' : 'fotos'}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-400 mb-1">Tipo</p>
                <p className="text-white font-medium">
                  {isVideo ? 'Vídeo' : 'Imagem'} • HD
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-white font-semibold mb-3">Atalhos de Teclado</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Fechar</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">Esc</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Anterior / Próxima</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">←</kbd>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">→</kbd>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Zoom</span>
                  <div className="flex gap-1">
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">+</kbd>
                    <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">-</kbd>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Girar</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">R</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Info</span>
                  <kbd className="px-2 py-1 bg-white/10 rounded text-white text-xs">I</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}