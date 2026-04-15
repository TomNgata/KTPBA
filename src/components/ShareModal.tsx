import React, { useRef } from 'react';
import { X, Download, Instagram, MessageCircle, Twitter } from 'lucide-react';
import { captureElementAsPng, downloadPng, shareNative, shareToWhatsApp, shareToX } from '../lib/share';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Ref to the element to capture as a PNG card */
  cardRef: React.RefObject<HTMLElement>;
  filename?: string;
  shareTitle?: string;
  shareText?: string;
  shareUrl?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  cardRef,
  filename = 'ktpba-share',
  shareTitle = 'KTPBA Teams Marathon 2026',
  shareText = '🎳 Check out the KTPBA Teams Marathon 2026 action!',
  shareUrl,
}: ShareModalProps) {
  const [capturing, setCapturing] = React.useState(false);
  const [showIGHelp, setShowIGHelp] = React.useState(false);
  const capturedUrl = React.useRef<string | null>(null);

  if (!isOpen) return null;

  const capture = async () => {
    if (!cardRef.current) return null;
    setCapturing(true);
    try {
      const url = await captureElementAsPng(cardRef.current);
      capturedUrl.current = url;
      return url;
    } finally {
      setCapturing(false);
    }
  };

  const handleDownload = async () => {
    const url = capturedUrl.current ?? await capture();
    if (url) downloadPng(url, filename);
  };

  const handleNativeShare = async () => {
    const url = capturedUrl.current ?? await capture();
    if (!url) return;
    const shared = await shareNative(url, shareTitle, shareText);
    if (!shared) {
      // Fallback to download
      downloadPng(url, filename);
    }
  };

  const handleWhatsApp = async () => {
    const url = capturedUrl.current ?? await capture();
    if (url) downloadPng(url, filename);
    const text = shareText + (shareUrl ? `\n${shareUrl}` : `\nktpba.vercel.app`);
    shareToWhatsApp(text);
  };

  const handleX = () => {
    shareToX(shareText, shareUrl ?? 'https://ktpba.vercel.app');
  };

  const handleInstagram = async () => {
    const url = capturedUrl.current ?? await capture();
    if (url) downloadPng(url, filename);
    setShowIGHelp(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative bg-white w-full max-w-sm mx-4 mb-4 md:mb-0 rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg uppercase tracking-widest text-ktpba-black">Share</h3>
            <p className="text-xs text-gray-400">Download or share your card</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {showIGHelp ? (
          <div className="px-6 py-6 space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl p-4 text-sm">
              <p className="font-bold text-purple-700 mb-2">📸 Image Downloaded!</p>
              <ol className="text-purple-600 space-y-1.5 text-xs leading-relaxed">
                <li><strong>1.</strong> Open <strong>Instagram</strong> on your phone</li>
                <li><strong>2.</strong> Tap <strong>+</strong> → <strong>Story</strong></li>
                <li><strong>3.</strong> Select the downloaded image from your gallery</li>
                <li><strong>4.</strong> Share to your Story! 🎳</li>
              </ol>
            </div>
            <button
              onClick={() => setShowIGHelp(false)}
              className="w-full py-3 bg-ktpba-black text-white font-bold text-sm uppercase tracking-widest rounded-lg"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="px-6 py-6 grid grid-cols-2 gap-3">
            {/* Native Share (Mobile) */}
            <button
              onClick={handleNativeShare}
              disabled={capturing}
              className="col-span-2 flex items-center justify-center gap-3 bg-ktpba-red text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {capturing ? 'Generating...' : 'Share / Download Card'}
            </button>

            <button
              onClick={handleWhatsApp}
              disabled={capturing}
              className="flex flex-col items-center justify-center gap-2 bg-green-500 text-white py-5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <MessageCircle className="w-6 h-6" />
              WhatsApp
            </button>

            <button
              onClick={handleInstagram}
              disabled={capturing}
              className="flex flex-col items-center justify-center gap-2 rounded-xl font-bold text-xs uppercase tracking-wider text-white py-5 transition-colors disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
            >
              <Instagram className="w-6 h-6" />
              Instagram
            </button>

            <button
              onClick={handleX}
              className="flex flex-col items-center justify-center gap-2 bg-black text-white py-5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-900 transition-colors"
            >
              <Twitter className="w-6 h-6" />
              X / Twitter
            </button>

            <button
              onClick={handleDownload}
              disabled={capturing}
              className="flex flex-col items-center justify-center gap-2 bg-gray-100 text-gray-700 py-5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Download className="w-6 h-6" />
              Download PNG
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
