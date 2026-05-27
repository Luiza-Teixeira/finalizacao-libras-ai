import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Hand } from "lucide-react";

type MenuView = "main" | "quality" | "speed" | "subtitles";

interface SettingsMenuProps {
  onClose: () => void;
  showLibras: boolean;
  onToggleLibras: () => void;
}

const qualities = ["Auto (1080p)", "1080p", "720p", "480p", "360p", "144p"];
const speeds = ["0.25", "0.5", "0.75", "Normal", "1.25", "1.5", "1.75", "2"];
const subtitleOptions = ["Desativado", "Português", "English", "Español"];

export function SettingsMenu({ onClose, showLibras, onToggleLibras }: SettingsMenuProps) {
  const [view, setView] = useState<MenuView>("main");
  const [selectedQuality, setSelectedQuality] = useState("Auto (1080p)");
  const [selectedSpeed, setSelectedSpeed] = useState("Normal");
  const [selectedSubtitle, setSelectedSubtitle] = useState("Desativado");

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (view === "quality") {
    return (
      <div className="absolute bottom-16 right-4 settings-menu rounded-xl w-64 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200" onClick={handleClick}>
        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground settings-item" onClick={() => setView("main")}>
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Qualidade</span>
        </button>
        <div className="border-t border-border my-1" />
        {qualities.map((q) => (
          <button key={q} className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground settings-item" onClick={() => { setSelectedQuality(q); setView("main"); }}>
            <span>{q}</span>
            {selectedQuality === q && <Check className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </div>
    );
  }

  if (view === "speed") {
    return (
      <div className="absolute bottom-16 right-4 settings-menu rounded-xl w-64 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200" onClick={handleClick}>
        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground settings-item" onClick={() => setView("main")}>
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Velocidade de reprodução</span>
        </button>
        <div className="border-t border-border my-1" />
        {speeds.map((s) => (
          <button key={s} className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground settings-item" onClick={() => { setSelectedSpeed(s); setView("main"); }}>
            <span>{s === "Normal" ? "Normal" : `${s}x`}</span>
            {selectedSpeed === s && <Check className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </div>
    );
  }

  if (view === "subtitles") {
    return (
      <div className="absolute bottom-16 right-4 settings-menu rounded-xl w-64 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200" onClick={handleClick}>
        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground settings-item" onClick={() => setView("main")}>
          <ChevronLeft className="w-4 h-4" />
          <span className="font-medium">Legendas</span>
        </button>
        <div className="border-t border-border my-1" />
        {subtitleOptions.map((s) => (
          <button key={s} className="flex items-center justify-between w-full px-4 py-2 text-sm text-foreground settings-item" onClick={() => { setSelectedSubtitle(s); setView("main"); }}>
            <span>{s}</span>
            {selectedSubtitle === s && <Check className="w-4 h-4 text-primary" />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute bottom-16 right-4 settings-menu rounded-xl w-72 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200" onClick={handleClick}>
      <button className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground settings-item" onClick={() => setView("quality")}>
        <span>Qualidade</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{selectedQuality}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      <button className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground settings-item" onClick={() => setView("speed")}>
        <span>Velocidade de reprodução</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{selectedSpeed === "Normal" ? "Normal" : `${selectedSpeed}x`}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      <button className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground settings-item" onClick={() => setView("subtitles")}>
        <span>Legendas</span>
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs">{selectedSubtitle}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      <div className="border-t border-border my-1" />

      <button className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground settings-item" onClick={onToggleLibras}>
        <div className="flex items-center gap-2">
          <Hand className="w-4 h-4 text-accent" />
          <span>Libras</span>
        </div>
        <div className={`w-9 h-5 rounded-full transition-colors ${showLibras ? "bg-primary" : "bg-muted"} relative`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${showLibras ? "left-4.5" : "left-0.5"}`} />
        </div>
      </button>

      <button className="flex items-center justify-between w-full px-4 py-3 text-sm text-foreground settings-item">
        <span>Anotações</span>
      </button>
    </div>
  );
}
