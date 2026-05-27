export function Footer() {
  const sections = [
    {
      title: "Navegação",
      links: ["Início", "Agora na TV", "Novelas", "Séries", "Filmes", "Esportes", "BBB", "Catálogo"],
    },
    {
      title: "Conta",
      links: ["Meu Perfil", "Minha Lista", "Histórico", "Configurações", "Assinatura"],
    },
    {
      title: "Ajuda",
      links: ["Central de Ajuda", "Dispositivos Compatíveis", "Termos de Uso", "Política de Privacidade"],
    },
    {
      title: "Institucional",
      links: ["Sobre", "Imprensa", "Trabalhe Conosco", "Anuncie"],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-foreground mb-4 font-display uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black font-display">
              <span className="text-brand">tv</span>
              <span className="text-foreground">Globinho</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 tvGlobinho. Todos os direitos reservados. Conteúdo protegido por direitos autorais.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Acessibilidade</span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Cookies</span>
            <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
