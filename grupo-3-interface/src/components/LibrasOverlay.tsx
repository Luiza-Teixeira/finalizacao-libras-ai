export function LibrasOverlay() {
  return (
    <div
      className="absolute bottom-20 left-4 z-40"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-40 h-44 border-2 rounded-none overflow-hidden bg-black" style={{ borderColor: '#e81823' }}>
        <video
          src="/libras-avatar.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ mixBlendMode: "screen" }}
        />
      </div>
    </div>
  );
}
