import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, roomExists } from '../services/roomService';
import { Mic2, Tv, Smartphone, ArrowRight, Sparkles, Music2, RadioTower } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinError, setJoinError] = useState('');

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const id = await createRoom();
      navigate(`/host/${id}`);
    } catch (err) {
      console.error('Create room error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    setJoinError('');
    setLoading(true);
    try {
      const exists = await roomExists(roomId.trim().toUpperCase());
      if (exists) {
        navigate(`/remote/${roomId.trim().toUpperCase()}`);
      } else {
        setJoinError('Không tìm thấy phòng này!');
      }
    } catch (err) {
      setJoinError('Lỗi kết nối. Thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-karaoke noise-overlay flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Floating decorations */}
      <div className="absolute top-10 left-10 text-4xl animate-float opacity-20 pointer-events-none select-none">🎵</div>
      <div className="absolute top-1/4 right-16 text-3xl animate-float opacity-15 pointer-events-none select-none" style={{ animationDelay: '1s' }}>🎶</div>
      <div className="absolute bottom-20 left-1/4 text-5xl animate-float opacity-10 pointer-events-none select-none" style={{ animationDelay: '2s' }}>🎤</div>
      <div className="absolute top-1/3 left-1/3 text-2xl animate-float opacity-10 pointer-events-none select-none" style={{ animationDelay: '3s' }}>♪</div>
      <div className="absolute bottom-1/3 right-1/4 text-3xl animate-float opacity-10 pointer-events-none select-none" style={{ animationDelay: '1.5s' }}>♫</div>

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-violet/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-neon-magenta/8 blur-[100px] rounded-full pointer-events-none" />

      {/* Logo & Title */}
      <div className="text-center mb-10 animate-fade-in relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-neon-magenta to-neon-violet mb-6 shadow-neon-magenta animate-glow-pulse">
          <Mic2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-3 tracking-tight">
          Karaoke
          <span className="bg-gradient-to-r from-neon-magenta via-neon-pink to-neon-violet bg-clip-text text-transparent"> at Home</span>
        </h1>
        <p className="text-white/40 font-body text-lg flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-cyan/60" />
          Hát karaoke cùng bạn bè — ngay tại nhà
          <Sparkles className="w-4 h-4 text-neon-cyan/60" />
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-lg space-y-5 relative z-10">
        {/* Host Card */}
        <div className="glass-card-strong p-7 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neon-magenta/15 flex items-center justify-center">
              <Tv className="w-5 h-5 text-neon-magenta" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">Tạo Phòng Hát</h2>
              <p className="text-white/35 text-xs">Dùng cho TV / Laptop</p>
            </div>
          </div>
          <p className="text-white/45 text-sm mb-5 leading-relaxed">
            Mở trên TV hoặc laptop để hiển thị video karaoke. Chia sẻ mã phòng cho bạn bè để cùng chọn bài.
          </p>
          <button
            onClick={handleCreateRoom}
            disabled={loading}
            className="btn-neon-magenta w-full flex items-center justify-center gap-2 text-base disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <RadioTower className="w-5 h-5" />
                Tạo Phòng Mới
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-white/20 text-xs font-display uppercase tracking-widest">hoặc</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Remote Card */}
        <div className="glass-card-strong p-7 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/15 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-neon-cyan" />
            </div>
            <div>
              <h2 className="font-display font-bold text-white text-lg">Tham Gia Phòng</h2>
              <p className="text-white/35 text-xs">Dùng cho Điện thoại</p>
            </div>
          </div>
          <p className="text-white/45 text-sm mb-5 leading-relaxed">
            Nhập mã phòng để kết nối. Tìm bài hát yêu thích và thêm vào hàng chờ!
          </p>
          <form onSubmit={handleJoinRoom} className="flex gap-3">
            <input
              type="text"
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value.toUpperCase());
                setJoinError('');
              }}
              placeholder="Nhập mã phòng..."
              maxLength={6}
              className="input-neon flex-1 text-center font-display text-xl tracking-[0.2em] uppercase"
            />
            <button
              type="submit"
              disabled={!roomId.trim() || loading}
              className="btn-neon-cyan px-5 disabled:opacity-50 flex items-center gap-1"
            >
              <Music2 className="w-5 h-5" />
            </button>
          </form>
          {joinError && (
            <p className="text-red-400 text-xs mt-2 text-center animate-fade-in">
              {joinError}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center relative z-10 animate-fade-in">
        <p className="text-white/25 text-sm font-display font-medium flex justify-center items-center gap-1">
          Made by{' '}
          <div
            className="text-neon-cyan hover:text-neon-magenta transition-colors duration-300 font-bold"
          >
            HonPhan
          </div>
        </p>
        <p className="text-white/10 text-xs mt-1 font-display">
          Karaoke at Home © 2026 — 🎤 & ❤️
        </p>
      </div>
    </div>
  );
}
