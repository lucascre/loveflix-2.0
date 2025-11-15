"use client";
import { PlayCircle, Heart, Sparkles, Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";

export function TrailerHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`relative flex flex-col justify-center items-center 
                 min-h-[500px] md:min-h-[700px] w-full mx-auto overflow-hidden mb-8 md:mb-16
                 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-neutral-900 to-black"></div>
      
      {/* Efeito de partículas/brilho */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full 
                      blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full 
                      blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Conteúdo (COM PADDING CORRIGIDO) */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-16">
        {/* Logo/Icon animado */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600 rounded-full blur-2xl opacity-50 
                          animate-pulse"></div>
            <Heart 
              size={80} 
              className="text-red-600 fill-red-600 relative z-10
                       md:w-24 md:h-24 drop-shadow-2xl" 
            />
          </div>
        </div>

        {/* Título principal */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 
                     leading-tight drop-shadow-2xl slide-in-left">
          Nossos Momentos
          <br />
          <span className="text-red-600 text-hover-glow">Inesquecíveis</span>
        </h2>

        {/* Subtítulo */}
        <p className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto 
                    leading-relaxed slide-in-left" 
           style={{ animationDelay: '0.2s' }}>
          Uma coleção especial dos nossos melhores momentos,
          <br className="hidden md:block" />
          organizados e guardados com carinho em um só lugar.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 
                      max-w-3xl mx-auto slide-in-left"
             style={{ animationDelay: '0.4s' }}>
          <div className="glass-effect rounded-lg p-4 md:p-6 hover:bg-neutral-800/50 
                        transition-all duration-300 btn-transition">
            <PlayCircle className="text-red-600 mx-auto mb-3" size={32} />
            <h3 className="text-white font-bold mb-2 text-sm md:text-base">Fotos & Vídeos</h3>
            <p className="text-gray-400 text-xs md:text-sm">
              Reviva cada momento especial
            </p>
          </div>

          <div className="glass-effect rounded-lg p-4 md:p-6 hover:bg-neutral-800/50 
                        transition-all duration-300 btn-transition">
            <Sparkles className="text-red-600 mx-auto mb-3" size={32} />
            <h3 className="text-white font-bold mb-2 text-sm md:text-base">Organizado</h3>
            <p className="text-gray-400 text-xs md:text-sm">
              Por categorias e datas
            </p>
          </div>

          <div className="glass-effect rounded-lg p-4 md:p-6 hover:bg-neutral-800/50 
                        transition-all duration-300 btn-transition">
            <Lock className="text-red-600 mx-auto mb-3" size={32} />
            <h3 className="text-white font-bold mb-2 text-sm md:text-base">Privado</h3>
            <p className="text-gray-400 text-xs md:text-sm">
              Apenas para nós dois
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center 
                      slide-in-left"
             style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => signIn("google")}
            className="group flex items-center gap-3 bg-red-600 text-white font-bold 
                     px-8 md:px-12 py-3 md:py-4 text-base md:text-lg rounded 
                     hover:bg-red-700 transition-all duration-300 
                     shadow-2xl hover:shadow-red-600/50 netflix-glow
                     btn-transition w-full sm:w-auto justify-center"
          >
            <Heart size={20} className="group-hover:scale-110 transition-transform" />
            <span>Entrar Agora</span>
          </button>

          <button
            onClick={() => {
              document.querySelector('main')?.scrollBy({ 
                top: window.innerHeight, 
                behavior: 'smooth' 
              });
            }}
            className="flex items-center gap-3 bg-neutral-700/80 backdrop-blur-sm 
                     text-white font-semibold px-8 md:px-12 py-3 md:py-4 
                     text-base md:text-lg rounded hover:bg-neutral-600/80 
                     transition-all duration-300 border border-white/20
                     btn-transition w-full sm:w-auto justify-center"
          >
            <PlayCircle size={20} />
            <span>Saber Mais</span>
          </button>
        </div>

        {/* Indicador de scroll */}
        <div className="mt-12 md:mt-16 pulse-animation">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full mx-auto 
                        flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce"></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Role para ver mais</p>
        </div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 pointer-events-none 
                    shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
    </div>
  );
}