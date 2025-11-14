"use client";
import { useState, useEffect } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    if (!audioPlayed) {
      try {
        const audio = new Audio("/turun.mp3");
        audio.play().catch(() => setIsVisible(false));
        setAudioPlayed(true);
      } catch (e) {
        setIsVisible(false);
      }
    }

    // Aumentamos o tempo para a animação CSS + áudio
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500); // 3.5 segundos

    return () => clearTimeout(timer);
  }, [audioPlayed]);

  if (!isVisible) {
    return null;
  }

  // Novo HTML para a animação
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Usamos "L" de Loveflix, mas com a classe "netflix-n" */}
      <div className="netflix-n">
        L
      </div>
    </div>
  );
}