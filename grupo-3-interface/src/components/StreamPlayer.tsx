import { useState, useRef, useEffect } from "react";
const gameplayVideos = [
  "/videos/gameplay-1.mp4",
  "/videos/gameplay-2.mp4",
  "/videos/gameplay-3.mp4",
  "/videos/gameplay-4.mp4"

];
import { Settings, Play, Pause, Volume2, VolumeX, Maximize, SkipForward } from "lucide-react";
import { SettingsMenu } from "./SettingsMenu";
import { LibrasOverlay } from "./LibrasOverlay";

export function StreamPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLibras, setShowLibras] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (!showSettings) setShowControls(false);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (!showSettings) {
      setShowControls(false);
    }
  };

  useEffect(() => {
    if (showSettings) setShowControls(true);
  }, [showSettings]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, currentVideoIndex]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  const handleVideoEnded = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % gameplayVideos.length);
  };

  const handleSkip = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % gameplayVideos.length);
  };

  return (
    <div
      className="relative w-full aspect-video bg-background rounded-xl overflow-hidden cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (!showSettings) setIsPlaying(!isPlaying);
      }}
    >
     <video
  src="/videos/gameplay-1.mp4"
  controls
  autoPlay
  muted
  className="w-full h-full object-cover"
/>
      

      {/* Live badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <span className="flex items-center gap-1.5 bg-live px-3 py-1 rounded-md text-sm font-semibold font-display tracking-wide text-foreground">
          <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
          AO VIVO
        </span>
        <span className="bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-md text-sm font-medium text-muted-foreground">
          1.2K assistindo
        </span>
      </div>

      {/* Play/Pause center indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-primary-foreground ml-1" />
          </div>
        </div>
      )}

      {/* Bottom controls gradient */}
      <div
        className={`absolute bottom-0 left-0 right-0 stream-controls-gradient transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="px-4 pt-12">
          <div className="w-full h-1 bg-muted/40 rounded-full overflow-hidden cursor-pointer group/progress">
            <div
              className="h-full bg-primary rounded-full transition-all group-hover/progress:h-1.5 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={handleSkip}
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button
              className="text-foreground hover:text-primary transition-colors"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-sm text-muted-foreground font-body ml-1">AO VIVO</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="text-foreground hover:text-primary transition-colors relative"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className={`w-5 h-5 transition-transform duration-300 ${showSettings ? "rotate-45" : ""}`} />
            </button>
            <button className="text-foreground hover:text-primary transition-colors">
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Menu */}
      {showSettings && (
        <SettingsMenu
          onClose={() => setShowSettings(false)}
          showLibras={showLibras}
          onToggleLibras={() => setShowLibras(!showLibras)}
        />
      )}

      {/* Libras Overlay */}
      {showLibras && <LibrasOverlay />}
    </div>
  );
}