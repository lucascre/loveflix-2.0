"use client";
import { PlayCircle } from "lucide-react";

export function TrailerHero() {
  return (
    <div
      // MUDANÇA AQUI: h-[350px] (telemóvel), md:h-[500px] (desktop)
      className="relative flex flex-col justify-center items-center h-[350px] md:h-[500px] w-full 
                 mx-auto bg-gradient-to-r from-red-800 via-neutral-900 to-black 
                 rounded-lg p-4 md:p-8 overflow-hidden shadow-2xl mb-12"
      style={{
        // backgroundImage: "url('/your-epic-background.jpg')",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
      }}
    >
      <div className="z-10 text-center">
        {/* MUDANÇA AQUI: Fontes responsivas */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Loveflix
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-6 drop-shadow">
          Nossos momentos inesquecíveis,
          <br />
          organizados em um só lugar.
        </p>
        {/* MUDANÇA AQUI: Ícone responsivo */}
        <PlayCircle size={64} className="text-white opacity-80 animate-pulse mx-auto md:size={80}" />
      </div>
      <div className="absolute inset-0 bg-black opacity-40"></div>
    </div>
  );
}