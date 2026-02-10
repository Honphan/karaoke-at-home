import { useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';

export default function VideoPlayer({ videoId, onEnded, onReady }) {
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef(null);

  if (!videoId) {
    return (
      <div className="relative w-full aspect-video bg-surface-800 rounded-2xl overflow-hidden flex items-center justify-center neon-border-magenta">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce-subtle">🎤</div>
          <h2 className="font-display text-2xl font-bold text-white/80 mb-2">
            Chờ bài hát...
          </h2>
          <p className="text-white/40 text-sm">
            Thêm bài hát từ Remote Control để bắt đầu!
          </p>
          {/* Animated bars */}
          <div className="flex justify-center items-end gap-1 mt-6 h-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-neon-magenta/60"
                style={{
                  animation: `now-playing-bar 1.2s ease-in-out ${i * 0.15}s infinite`,
                  height: '8px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden neon-border-magenta group">
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${videoId}`}
        playing={playing}
        controls
        width="100%"
        height="100%"
        onEnded={onEnded}
        onReady={onReady}
        config={{
          youtube: {
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
            },
          },
        }}
      />
      {/* Neon glow border effect */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border border-neon-magenta/20 group-hover:border-neon-magenta/40 transition-colors duration-500" />
    </div>
  );
}
