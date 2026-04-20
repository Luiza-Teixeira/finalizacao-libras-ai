import { ThumbsUp, ThumbsDown, Share2, MoreHorizontal, BadgeCheck, Gamepad2 } from "lucide-react";

export function StreamInfo() {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground leading-tight">
            PeB 2025: MT7 se consagra melhor atleta de Free Fire
          </h1>
          <p className="text-sm text-muted-foreground mt-1">32.458 visualizações • Transmitido ao vivo há 1 hora</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-secondary rounded-full overflow-hidden">
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>12K</span>
            </button>
            <div className="w-px h-6 bg-border" />
            <button className="px-3 py-2 text-foreground hover:bg-muted transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 bg-secondary hover:bg-muted px-4 py-2 rounded-full text-sm text-foreground transition-colors">
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
          <button className="bg-secondary hover:bg-muted p-2 rounded-full text-foreground transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Channel info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-brand-foreground">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-foreground">Jogos</p>
              <BadgeCheck className="w-4 h-4 text-brand" />
            </div>
            <p className="text-xs text-muted-foreground">5.8M inscritos</p>
          </div>
        </div>
        <button className="bg-brand hover:bg-brand/90 text-brand-foreground px-5 py-2 rounded-full text-sm font-semibold transition-colors">
          Inscrever-se
        </button>
      </div>

      {/* Description */}
      <div className="bg-secondary/50 rounded-xl p-4">
        <p className="text-sm text-foreground leading-relaxed">
          Assista à cobertura completa do PeB 2025! MT7 dominou a competição e se consagrou como o melhor atleta de Free Fire do torneio. Confira os melhores momentos e lances decisivos. Ative o recurso de Libras nas configurações do player para acessibilidade em língua de sinais. 🎮🏆
        </p>
      </div>
    </div>
  );
}
