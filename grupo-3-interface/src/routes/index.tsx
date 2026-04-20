import { createFileRoute } from "@tanstack/react-router";
import { StreamPlayer } from "@/components/StreamPlayer";
import { StreamInfo } from "@/components/StreamInfo";
import { Footer } from "@/components/Footer";
import { Home, Radio, Tv, Film, Trophy, LayoutGrid, Search, User } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "tvGlobinho — Sua Plataforma de Streaming" },
      { name: "description", content: "Assista transmissões ao vivo, novelas, séries e esportes com suporte a Libras e acessibilidade total." },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Globoplay style */}
      <header className="border-b border-border bg-surface px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <h2 className="text-xl font-black font-display tracking-tight">
            <span className="text-brand">tv</span>
            <span className="text-foreground">Globinho</span>
          </h2>
          <nav className="hidden md:flex items-center gap-1">
            {[
              { icon: Home, label: "Início" },
              { icon: Radio, label: "Agora na TV" },
              { icon: Tv, label: "Novelas" },
              { icon: Film, label: "Séries" },
              { icon: Trophy, label: "Esportes" },
              { icon: LayoutGrid, label: "Categorias" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-3 py-2 rounded-md hover:bg-secondary"
              >
                <Icon className="w-4 h-4" />
                {label}
              </span>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <Search className="w-5 h-5" />
          </button>
          <button className="bg-brand hover:bg-brand/90 text-brand-foreground px-4 py-1.5 rounded-md text-sm font-bold transition-colors">
            Assine
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <User className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <StreamPlayer />
        <StreamInfo />
      </main>

      <Footer />
    </div>
  );
}
