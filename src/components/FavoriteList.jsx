import { Plus, Trash2, Heart, Check } from 'lucide-react';
import { useState } from 'react';

export default function FavoriteList({
  favorites = [],
  onAddToQueue,
  onRemoveFavorite,
  isLoading = false,
}) {
  const [addedIds, setAddedIds] = useState(new Set());

  const handleAddToQueue = (song) => {
    onAddToQueue?.(song);
    setAddedIds((prev) => new Set([...prev, song.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(song.id);
        return next;
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-10 h-10 rounded-full border-2 border-neon-pink/30 border-t-neon-pink mx-auto mb-4 animate-spin" />
        <p className="text-white/30 font-display text-sm">Đang tải...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <Heart className="w-12 h-12 text-white/10 mx-auto mb-4 animate-bounce-subtle" />
        <p className="text-white/25 font-display text-sm">
          Chưa có bài yêu thích
        </p>
        <p className="text-white/15 text-xs mt-1">
          Nhấn ❤️ khi tìm bài hát để lưu lại!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-neon-pink" />
          <h3 className="font-display font-semibold text-sm text-white/80 uppercase tracking-wider">
            Yêu thích
          </h3>
        </div>
        <span className="text-white/30 text-xs font-display">
          {favorites.length} bài
        </span>
      </div>

      <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
        {favorites.map((song, index) => {
          const isAdded = addedIds.has(song.id);

          return (
            <div
              key={song.id}
              className={`glass-card p-3 flex items-center gap-3 group hover:border-neon-pink/30 transition-all duration-300 animate-slide-up stagger-${Math.min(index + 1, 6)}`}
              style={{ animationFillMode: 'both' }}
            >
              {/* Thumbnail */}
              {song.thumbnail && (
                <div className="relative w-16 h-11 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={song.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-medium text-sm text-white/90 leading-tight line-clamp-2">
                  {song.title}
                </h4>
                {song.channelTitle && (
                  <p className="text-white/40 text-xs mt-0.5 truncate">
                    {song.channelTitle}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Add to queue */}
                <button
                  onClick={() => handleAddToQueue(song)}
                  disabled={isAdded}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isAdded
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan hover:text-surface-900 cursor-pointer hover:shadow-neon-cyan'
                  }`}
                  title="Thêm vào hàng chờ"
                >
                  {isAdded ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>

                {/* Remove from favorites */}
                <button
                  onClick={() => onRemoveFavorite?.(song.id)}
                  className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
