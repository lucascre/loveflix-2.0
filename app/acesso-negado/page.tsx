import Link from 'next/link';
// Mudei o ícone de 'Lock' para 'Code' (Código), que faz mais sentido
import { Code, MessageCircle } from 'lucide-react'; 

export default function AcessoNegadoPage() {
  
  // ----- IMPORTANTE -----
  // Verifique se este é o número de WhatsApp correto
  const seuNumeroWhatsApp = "5514988151796"; 
  
  // Mudei a mensagem para refletir o novo objetivo
  const mensagemWhatsApp = "Olá! Vi seu projeto Loveflix e gostaria de um site parecido.";
  const linkWhatsApp = `https://wa.me/${seuNumeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-8 text-center">
      <Code size={64} className="text-red-600 mb-6" />
      
      {/* Título novo */}
      <h1 className="mb-4 text-4xl font-bold text-red-600">Gostou deste site?</h1>
      
      {/* Texto novo */}
      <p className="mb-8 text-lg max-w-md">
        Este site é um projeto personalizado. Se você gostou da ideia e quer um
        portal de momentos especial para sua família (ou um projeto diferente),
        entre em contato!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Botão do WhatsApp */}
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white transition-transform hover:scale-105"
        >
          <MessageCircle size={18} />
          Solicitar um Orçamento (WhatsApp)
        </a>
        
        {/* Botão de Voltar (para a galeria pública) */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-6 py-3 font-bold text-white transition-transform hover:scale-105"
        >
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}