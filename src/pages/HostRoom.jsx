import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { onRoomChange, nextSong, removeFromQueue, prioritizeSong, deleteRoom } from '../services/roomService';
import VideoPlayer from '../components/VideoPlayer';
import QRCodeView from '../components/QRCodeView';
import QueueList from '../components/QueueList';
import { Home, SkipForward, Volume2 } from 'lucide-react';

export default function HostRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState(null);

  useEffect(() => {
    const unsubscribe = onRoomChange(roomId, (data) => {
      setRoomData(data);
    });
    return () => unsubscribe();
  }, [roomId]);

  // Delete room when closing browser/tab
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable cleanup on tab close
      deleteRoom(roomId);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [roomId]);

  const handleGoHome = async () => {
    await deleteRoom(roomId);
    navigate('/');
  };

  const handleVideoEnd = async () => {
    await nextSong(roomId);
  };

  const handleSkip = async () => {
    await nextSong(roomId);
  };

  const handlePrioritize = async (index) => {
    await prioritizeSong(roomId, index);
  };

  const handleRemove = async (index) => {
    await removeFromQueue(roomId, index);
  };

  const currentVideo = roomData?.currentVideo || null;
  const queue = roomData?.queue || [];

  return (
    <div className="min-h-screen bg-gradient-host noise-overlay">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoHome}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-white/50" />
          </button>
          <div>
            <h1 className="font-display font-bold text-white text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-neon-magenta" />
              Karaoke at Home
            </h1>
            <p className="text-white/30 text-[10px] font-display uppercase tracking-wider">
              Phòng: {roomId}
            </p>
          </div>
        </div>

        {/* Skip button */}
        {currentVideo && (
          <button
            onClick={handleSkip}
            className="btn-ghost text-xs flex items-center gap-1.5"
          >
            <SkipForward className="w-4 h-4 text-neon-cyan" />
            Bỏ qua
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-5 p-5 h-[calc(100vh-60px)]">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <VideoPlayer
            videoId={currentVideo?.id}
            onEnded={handleVideoEnd}
          />

          {/* Now Playing Info */}
          {currentVideo && (
            <div className="glass-card p-3 flex items-center gap-3 animate-fade-in">
              <div className="now-playing-bars flex items-end h-4">
                <span /><span /><span /><span />
              </div>
              <div className="min-w-0">
                <p className="text-neon-magenta text-[10px] font-display font-semibold uppercase tracking-wider">
                  Đang phát
                </p>
                <h3 className="font-display font-semibold text-sm text-white truncate">
                  {currentVideo.title}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0">
          {/* QR Code */}
          <QRCodeView roomId={roomId} />

          {/* Queue */}
          <div className="glass-card-strong p-4 flex-1 overflow-hidden flex flex-col">
            <QueueList
              queue={queue}
              currentVideo={currentVideo}
              onPrioritize={handlePrioritize}
              onRemove={handleRemove}
              showControls={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
