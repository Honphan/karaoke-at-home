import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  onRoomChange,
  addToQueue,
  removeFromQueue,
  prioritizeSong,
  nextSong,
} from '../services/roomService';
import { searchVideos } from '../services/youtubeService';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../services/favoriteService';
import SearchBar from '../components/SearchBar';
import SearchResult from '../components/SearchResult';
import QueueList from '../components/QueueList';
import FavoriteList from '../components/FavoriteList';
import { Search, ListMusic, Heart, Home, Mic2, User, SkipForward } from 'lucide-react';

export default function RemoteControl() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [toast, setToast] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // Derive a set of favorite IDs for quick lookup in search results
  const favoriteIds = new Set(favorites.map((s) => s.id));

  // Load saved username
  useEffect(() => {
    const saved = localStorage.getItem(`karaoke-user-${roomId}`);
    if (saved) {
      setUserName(saved);
      setShowNameInput(false);
    }
  }, [roomId]);

  // Load favorites when username is available
  useEffect(() => {
    if (!userName || showNameInput) return;
    loadFavorites();
  }, [userName, showNameInput]);

  const loadFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const favs = await getFavorites(userName);
      setFavorites(favs);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // Listen for room changes
  useEffect(() => {
    const unsubscribe = onRoomChange(roomId, (data) => {
      setRoomData(data);
    });
    return () => unsubscribe();
  }, [roomId]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleSearch = useCallback(async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchVideos(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleAddToQueue = async (song) => {
    try {
      await addToQueue(roomId, {
        id: song.id,
        title: song.title,
        thumbnail: song.thumbnail,
        user: userName || 'Khách',
      });
      showToast('Đã thêm vào hàng chờ! 🎤');
    } catch (err) {
      showToast('Lỗi khi thêm bài!', 'error');
    }
  };

  const handleAddFavorite = async (song) => {
    try {
      const added = await addFavorite(userName, song);
      if (added) {
        setFavorites((prev) => [
          ...prev,
          {
            id: song.id,
            title: song.title,
            thumbnail: song.thumbnail,
            channelTitle: song.channelTitle || '',
          },
        ]);
        showToast('Đã thêm vào yêu thích! ❤️');
      } else {
        showToast('Bài này đã có trong yêu thích rồi!', 'info');
      }
    } catch (err) {
      showToast('Lỗi khi thêm yêu thích!', 'error');
    }
  };

  const handleRemoveFavorite = async (songId) => {
    try {
      await removeFavorite(userName, songId);
      setFavorites((prev) => prev.filter((s) => s.id !== songId));
      showToast('Đã xóa khỏi yêu thích! 💔');
    } catch (err) {
      showToast('Lỗi khi xóa yêu thích!', 'error');
    }
  };

  const handleAddFavoriteToQueue = async (song) => {
    await handleAddToQueue(song);
  };

  const handlePrioritize = async (index) => {
    await prioritizeSong(roomId, index);
    showToast('Đã đưa lên đầu! ⬆️');
  };

  const handleRemove = async (index) => {
    await removeFromQueue(roomId, index);
    showToast('Đã xóa bài! 🗑️');
  };

  const handleSkip = async () => {
    await nextSong(roomId);
    showToast('Đã chuyển bài! ⏭️');
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem(`karaoke-user-${roomId}`, userName.trim());
      setShowNameInput(false);
    }
  };

  const currentVideo = roomData?.currentVideo || null;
  const queue = roomData?.queue || [];

  // Name input screen
  if (showNameInput) {
    return (
      <div className="min-h-screen bg-gradient-karaoke noise-overlay flex items-center justify-center p-4">
        <div className="glass-card-strong p-8 w-full max-w-sm text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet mx-auto mb-5 flex items-center justify-center shadow-neon-cyan">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display font-bold text-xl text-white mb-2">
            Chào mừng đến phòng!
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Phòng <span className="text-neon-cyan font-display font-bold">{roomId}</span>
          </p>
          <form onSubmit={handleSaveName}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nhập tên của bạn..."
              className="input-neon text-center text-lg mb-4"
              autoFocus
              maxLength={20}
            />
            <button
              type="submit"
              disabled={!userName.trim()}
              className="btn-neon-violet w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Mic2 className="w-5 h-5" />
              Bắt đầu hát!
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-karaoke noise-overlay flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/')}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-white/40" />
          </button>
          <div>
            <p className="font-display font-bold text-white text-xs">
              🎤 Phòng {roomId}
            </p>
            <p className="text-white/30 text-[10px]">
              Xin chào, <span className="text-neon-cyan">{userName}</span>
            </p>
          </div>
        </div>

        {/* Now playing mini + Skip */}
        {currentVideo && (
          <div className="flex items-center gap-2 max-w-[55%]">
            <button
              onClick={handleSkip}
              className="px-3 py-1.5 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/25 flex items-center gap-1.5 transition-colors flex-shrink-0 cursor-pointer border border-neon-cyan/20"
            >
              <SkipForward className="w-4 h-4 text-neon-cyan" />
              <span className="text-neon-cyan text-xs font-display font-semibold">Bỏ qua</span>
            </button>
            <div className="now-playing-bars flex items-end h-3 flex-shrink-0">
              <span /><span /><span /><span />
            </div>
            <p className="text-white/50 text-[10px] truncate">
              {currentVideo.title}
            </p>
          </div>
        )}
      </header>

      {/* Tabs */}
      <nav className="flex border-b border-white/5">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-display font-medium transition-all duration-300 cursor-pointer ${
            activeTab === 'search'
              ? 'text-neon-cyan border-b-2 border-neon-cyan bg-neon-cyan/5'
              : 'text-white/35 hover:text-white/60'
          }`}
        >
          <Search className="w-4 h-4" />
          Tìm bài
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-display font-medium transition-all duration-300 cursor-pointer relative ${
            activeTab === 'favorites'
              ? 'text-neon-pink border-b-2 border-neon-pink bg-neon-pink/5'
              : 'text-white/35 hover:text-white/60'
          }`}
        >
          <Heart className={`w-4 h-4 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
          Yêu thích
          {favorites.length > 0 && (
            <span className="absolute top-2 right-[calc(50%-40px)] w-5 h-5 rounded-full bg-neon-pink text-white text-[10px] font-bold flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-display font-medium transition-all duration-300 cursor-pointer relative ${
            activeTab === 'queue'
              ? 'text-neon-violet border-b-2 border-neon-violet bg-neon-violet/5'
              : 'text-white/35 hover:text-white/60'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          Hàng chờ
          {queue.length > 0 && (
            <span className="absolute top-2 right-[calc(50%-40px)] w-5 h-5 rounded-full bg-neon-violet text-white text-[10px] font-bold flex items-center justify-center">
              {queue.length}
            </span>
          )}
        </button>
      </nav>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'search' && (
          <div>
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
            <SearchResult
              results={searchResults}
              onAddToQueue={handleAddToQueue}
              onAddFavorite={handleAddFavorite}
              favoriteIds={favoriteIds}
            />

            {/* Empty state */}
            {searchResults.length === 0 && !isSearching && (
              <div className="text-center py-16 animate-fade-in">
                <div className="text-5xl mb-4 animate-bounce-subtle">🎵</div>
                <p className="text-white/25 font-display text-sm">
                  Tìm bài hát karaoke yêu thích
                </p>
                <p className="text-white/15 text-xs mt-1">
                  Nhập tên bài hát hoặc ca sĩ...
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <FavoriteList
            favorites={favorites}
            onAddToQueue={handleAddFavoriteToQueue}
            onRemoveFavorite={handleRemoveFavorite}
            isLoading={favoritesLoading}
          />
        )}

        {activeTab === 'queue' && (
          <QueueList
            queue={queue}
            currentVideo={currentVideo}
            onPrioritize={handlePrioritize}
            onRemove={handleRemove}
            showControls={true}
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast glass-card-strong px-5 py-3 text-sm font-display font-medium ${
          toast.type === 'error' ? 'text-red-400 neon-border-magenta' : 'text-neon-cyan neon-border-cyan'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
