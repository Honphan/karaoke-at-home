import { ArrowUpToLine, Trash2, Music, Mic2 } from 'lucide-react';

export default function QueueList({
  queue = [],
  currentVideo,
  onPrioritize,
  onRemove,
  showControls = true,
}) {
  return (
    <div className="animate-fade-in">
      {/* Currently Playing */}
      {currentVideo && (
        <div className="glass-card neon-border-magenta p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="now-playing-bars flex items-end h-4">
              <span /><span /><span /><span />
            </div>
            <span className="text-neon-magenta text-xs font-display font-semibold uppercase tracking-wider">
              Đang hát
            </span>
          </div>
          <div className="flex items-center gap-3">
            {currentVideo.thumbnail && (
              <img
                src={currentVideo.thumbnail}
                alt=""
                className="w-14 h-10 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <h4 className="font-display font-semibold text-sm text-white leading-tight line-clamp-2">
              {currentVideo.title}
            </h4>
          </div>
        </div>
      )}

      {/* Queue Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-neon-violet" />
          <h3 className="font-display font-semibold text-sm text-white/80 uppercase tracking-wider">
            Hàng chờ
          </h3>
        </div>
        <span className="text-white/30 text-xs font-display">
          {queue.length} bài
        </span>
      </div>

      {/* Queue Items */}
      {queue.length === 0 ? (
        <div className="text-center py-10 animate-fade-in">
          <Mic2 className="w-10 h-10 text-white/10 mx-auto mb-3 animate-bounce-subtle" />
          <p className="text-white/25 text-sm font-display">Chưa có bài nào</p>
          <p className="text-white/15 text-xs mt-1">Thêm bài hát để bắt đầu!</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {queue.map((song, index) => (
            <div
              key={`${song.id}-${index}`}
              className="glass-card p-3 flex items-center gap-3 group hover:border-white/10 transition-all duration-300"
            >
              {/* Index */}
              <div className="w-6 h-6 rounded-full bg-surface-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-display font-bold text-white/50">
                  {index + 1}
                </span>
              </div>

              {/* Thumbnail */}
              {song.thumbnail && (
                <img
                  src={song.thumbnail}
                  alt=""
                  className="w-12 h-8 rounded-md object-cover flex-shrink-0"
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-medium text-xs text-white/85 leading-tight line-clamp-1">
                  {song.title}
                </h4>
                {song.user && (
                  <p className="text-white/30 text-[10px] mt-0.5">
                    bởi {song.user}
                  </p>
                )}
              </div>

              {/* Controls */}
              {showControls && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {index > 0 && (
                    <button
                      onClick={() => onPrioritize?.(index)}
                      className="w-7 h-7 rounded-lg bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-surface-900 flex items-center justify-center transition-all duration-200 cursor-pointer"
                      title="Ưu tiên lên đầu"
                    >
                      <ArrowUpToLine className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onRemove?.(index)}
                    className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                    title="Xóa bài"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
