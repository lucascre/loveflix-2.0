import Link from 'next/link';
import { Code, MessageCircle } from 'lucide-react'; 

export default function AcessoNegadoPage() {
  
  const seuNumeroWhatsApp = "5514988151796"; 
  const mensagemWhatsApp = "Olá! Vi seu projeto Loveflix e gostaria de um site parecido.";
  const linkWhatsApp = `https://wa.me/${seuNumeroWhatsApp}?text=${encodeURIComponent(mensagemWhatsApp)}`;

  return (
    // Removido h-screen e bg-black (vem do layout)
    // Adicionado min-h para centralizar entre header/footer
    <div className="flex flex-col items-center justify-center text-white p-8 text-center min-h-[calc(100vh-20rem)] md:pt-24">
      <Code size={64} className="text-red-600 mb-6" />
      
      <h1 className="mb-4 text-4xl font-bold text-red-600">Gostou deste site?</h1>
      
      <p className="mb-8 text-lg max-w-md">
        Este site é um projeto personalizado. Se você gostou da ideia e quer um
        portal de momentos especial para sua família (ou um projeto diferente),
        entre em contato!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={linkWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-bold text-white transition-transform hover:scale-105"
        >
          <MessageCircle size={18} />
          Solicitar um Orçamento (WhatsApp)
        </a>
        
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