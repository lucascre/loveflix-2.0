"use client";
import { useState, useEffect } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Toca o áudio apenas uma vez
    if (!audioPlayed) {
      try {
        const audio = new Audio("/turun.mp3"); // Caminho do arquivo na pasta /public
        audio.play().catch(() => {
          // Navegadores podem bloquear o autoplay, ignora o erro
          setIsVisible(false); // Se o áudio falhar, apenas pule o splash
        });
        setAudioPlayed(true);
      } catch (e) {
        console.error("Erro ao tocar áudio:", e);
        setIsVisible(false); // Pula se houver erro
      }
    }

    // Esconde o splash após 2.5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500); // Duração do "turun"

    return () => clearTimeout(timer);
  }, [audioPlayed]);

  if (!isVisible) {
    return null; // Não renderiza nada se não estiver visível
  }

  // O "L" gigante (de Loveflix)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <h1 className="text-9xl font-extrabold text-red-600 animate-pulse">
        L
      </h1>
    </div>
  );
}