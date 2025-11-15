export function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#141414]">
      <div className="px-4 md:px-12 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-6 text-sm">
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Perguntas Frequentes
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Centro de Ajuda
              </a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Conta
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Preferências
              </a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Termos de Uso
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Privacidade
              </a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contato
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Legal
              </a>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-2">
            <p>© {new Date().getFullYear()} Loveflix. Todos os direitos reservados.</p>
            <p className="text-gray-600">
              Feito com ❤️ para preservar nossos momentos especiais.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}