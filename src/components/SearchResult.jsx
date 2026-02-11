import { Plus, Check, Heart } from 'lucide-react';
import { useState } from 'react';

export default function SearchResult({ results, onAddToQueue, onAddFavorite, favoriteIds = new Set() }) {
  const [addedIds, setAddedIds] = useState(new Set());
  const [heartAnimIds, setHeartAnimIds] = useState(new Set());

  const handleAdd = (song) => {
    onAddToQueue(song);
    setAddedIds((prev) => new Set([...prev, song.id]));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(song.id);
        return next;
      });
    }, 2000);
  };

  const handleFavorite = (song) => {
    onAddFavorite?.(song);
    setHeartAnimIds((prev) => new Set([...prev, song.id]));
    setTimeout(() => {
      setHeartAnimIds((prev) => {
        const next = new Set(prev);
        next.delete(song.id);
        return next;
      });
    }, 600);
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mt-4">
      {results.map((song, index) => {
        const isAdded = addedIds.has(song.id);
        const isFavorited = favoriteIds.has(song.id);
        const isHeartAnim = heartAnimIds.has(song.id);

        return (
          <div
            key={song.id}
            className={`glass-card p-3 flex items-center gap-3 group hover:border-neon-violet/30 transition-all duration-300 animate-slide-up stagger-${Math.min(index + 1, 6)}`}
            style={{ animationFillMode: 'both' }}
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden">
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4
                className="font-display font-medium text-sm text-white/90 leading-tight line-clamp-2"
                title={song.title}
                dangerouslySetInnerHTML={{ __html: song.title }}
              />
              <p className="text-white/40 text-xs mt-0.5 truncate">
                {song.channelTitle}
              </p>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => handleFavorite(song)}
              disabled={isFavorited}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isFavorited
                  ? 'bg-neon-pink/20 text-neon-pink cursor-default'
                  : 'bg-white/5 text-white/30 hover:bg-neon-pink/15 hover:text-neon-pink cursor-pointer'
              } ${isHeartAnim ? 'heart-pop' : ''}`}
              title={isFavorited ? 'Đã yêu thích' : 'Thêm yêu thích'}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            {/* Add to queue button */}
            <button
              onClick={() => handleAdd(song)}
              disabled={isAdded}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isAdded
                  ? 'bg-green-500/20 text-green-400 cursor-default'
                  : 'bg-neon-violet/10 text-neon-violet hover:bg-neon-violet hover:text-white hover:shadow-neon-violet cursor-pointer'
              }`}
              title="Thêm vào hàng chờ"
            >
              {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        );
      })}
    </div>
  );
}
