// src/components/AudioPlayer.tsx
"use client";

// Importa os hooks necessários do React
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

// --- Ícones SVG ---
// (Estes são componentes simples para os botões, sem lógica)
const PlayIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /> </svg> );
const PauseIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3zm7.5 0a.75.75 0 00-.75.75v12c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" /> </svg> );
const VolumeUpIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" /> <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" /> </svg> );
const VolumeOffIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"> <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06L19.5 13.06l1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 10-1.06-1.06L19.5 10.94l-1.72-1.72z" /> </svg> );

// 1. **Definição da Ref Externa**
// Define um "contrato" (interface) para as funções que este componente vai "exportar" para o seu pai.
// O componente pai (TimelinePage) poderá chamar qualquer função listada aqui.
export interface AudioPlayerRef {
  playWithSound: () => void;
}

// 2. **forwardRef**
// `forwardRef` é uma função do React que permite que um componente receba uma `ref` e a "passe para a frente", 
// para um dos seus próprios elementos filhos, ou, como neste caso, use-a para expor funções.
export const AudioPlayer = forwardRef<AudioPlayerRef, {}>((props, ref) => {
  // 3. **Referências e Estados Internos**
  // `audioRef` é uma referência direta ao elemento <audio> no HTML. É como um `getElementById` do React.
  const audioRef = useRef<HTMLAudioElement>(null);
  // `isPlaying` controla o ícone (Play/Pause).
  const [isPlaying, setIsPlaying] = useState(false);
  // `volume` controla o nível do som e a posição do slider.
  const [volume, setVolume] = useState(0.5); // Começa com 50% de volume
  // `isMuted` controla se o som está ativo ou não.
  const [isMuted, setIsMuted] = useState(true);

  // 4. **Expondo a Função de Autoplay**
  // `useImperativeHandle` é o hook que "conecta" a ref do pai com as funções que queremos expor.
  // Ele diz: "Quando o componente pai usar a ref deste componente, dê a ele acesso a este objeto".
  useImperativeHandle(ref, () => ({
    // Esta é a função que será chamada pela página da linha do tempo após o clique do utilizador.
    playWithSound() {
      const audio = audioRef.current;
      if (audio) {
        audio.muted = false; // Tira o som do modo mudo
        setIsMuted(false);   // Atualiza o nosso estado para refletir a mudança
        audio.play().catch(e => console.error("Erro ao tocar áudio:", e)); // Toca a música com som
      }
    }
  }));

  // Este useEffect garante que, se o volume for alterado, ele seja aplicado ao elemento de áudio.
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  // 5. **Funções de Controlo Manual**
  // Estas são as funções para os controlos que o utilizador vê no ecrã (play/pause manual, volume, etc.).
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
      // Se o utilizador clicar em play e a música estiver muda, ativamos o som.
      if (isMuted) {
        setIsMuted(false);
        audio.muted = false;
      }
    }
    // `setIsPlaying(!isPlaying)` é desnecessário aqui, pois os eventos `onPlay` e `onPause` já fazem isso.
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      // Ativa o som se o utilizador aumentar o volume.
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const musicSrc = "/music/princesa-mandona.mp3";

  // 6. **O Elemento JSX**
  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 p-2 bg-papiro-dark/80 backdrop-blur-sm rounded-full shadow-lg border border-gold-accent/30 group">
      {/* O elemento <audio> fica escondido, mas é a fonte da verdade. */}
      {/* `preload="auto"` sugere ao navegador que comece a carregar a música assim que possível. */}
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        preload="auto"
        // Estes eventos sincronizam o estado do React com o estado real do áudio.
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Botões que chamam as nossas funções de controlo */}
      <button onClick={togglePlayPause} className="text-ink-dark hover:text-gold-accent transition-colors p-1" aria-label={isPlaying ? "Pausar música" : "Tocar música"}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className="flex items-center">
        <button onClick={toggleMute} className="text-ink-dark hover:text-gold-accent transition-colors p-1" aria-label={isMuted ? "Ativar som" : "Desativar som"}>
            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-0 group-hover:w-20 transition-all duration-300 ml-1 h-2 bg-rose-accent/30 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
});

// Adiciona um nome de exibição para facilitar a depuração no React DevTools
AudioPlayer.displayName = 'AudioPlayer';