import { QRCodeSVG } from 'qrcode.react';
import { Smartphone, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function QRCodeView({ roomId }) {
  const [copied, setCopied] = useState(false);
  const remoteUrl = `${window.location.origin}/remote/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(remoteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card-strong p-6 text-center animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Smartphone className="w-5 h-5 text-neon-cyan" />
        <h3 className="font-display font-semibold text-white/90 text-sm uppercase tracking-wider">
          Kết nối Remote
        </h3>
      </div>

      {/* QR Code */}
      <div className="inline-block p-4 rounded-2xl bg-white mb-4 shadow-neon-cyan">
        <QRCodeSVG
          value={remoteUrl}
          size={140}
          level="M"
          bgColor="#FFFFFF"
          fgColor="#0A0A0F"
        />
      </div>

      {/* Room ID */}
      <div className="mb-3">
        <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">Mã phòng</p>
        <div className="font-display text-3xl font-bold tracking-[0.3em] text-neon-cyan">
          {roomId}
        </div>
      </div>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="btn-ghost text-xs flex items-center gap-2 mx-auto"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400">Đã copy!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy link</span>
          </>
        )}
      </button>

      {/* Instructions */}
      <p className="text-white/30 text-xs mt-3 leading-relaxed">
        Quét QR hoặc nhập mã phòng<br />trên điện thoại để điều khiển
      </p>
    </div>
  );
}
