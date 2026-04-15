import { toPng } from 'html-to-image';

/**
 * Captures a DOM element as a PNG and returns the blob URL.
 */
export async function captureElementAsPng(element: HTMLElement): Promise<string> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: 2, // High-res for IG/WhatsApp quality
  });
  return dataUrl;
}

/**
 * Triggers a download of a PNG data URL with the given filename.
 */
export function downloadPng(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Uses the Web Share API (mobile browsers) to share an image + text.
 * Falls back gracefully if not supported.
 */
export async function shareNative(dataUrl: string, title: string, text: string): Promise<boolean> {
  if (!navigator.share) return false;

  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], 'ktpba-share.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title, text });
      return true;
    }
    // Fallback: share URL only
    await navigator.share({ title, text, url: window.location.href });
    return true;
  } catch {
    return false;
  }
}

/**
 * Opens a WhatsApp share link with pre-filled text.
 */
export function shareToWhatsApp(text: string) {
  const encoded = encodeURIComponent(text);
  window.open(`https://wa.me/?text=${encoded}`, '_blank');
}

/**
 * Opens X/Twitter intent with pre-filled tweet.
 */
export function shareToX(text: string, url?: string) {
  const params = new URLSearchParams({ text });
  if (url) params.set('url', url);
  window.open(`https://x.com/intent/tweet?${params.toString()}`, '_blank');
}

/**
 * Returns share text for different card types.
 */
export const shareText = {
  result: (teamName: string, result: string, week: string) =>
    `🎳 ${teamName} — ${result} | KTPBA Teams Marathon 2026 ${week}\n\nFollow the action: ktpba.vercel.app`,

  countdown: (matchDate: string, nextMatch: string) =>
    `⏳ ${matchDate} until the next KTPBA match night!\n${nextMatch}\n\nktpba.vercel.app`,

  form: (teamName: string, streak: string, points: number) =>
    `🔥 ${teamName} | Form: ${streak} | ${points} Match Points\n\nKTPBA Teams Marathon 2026 — ktpba.vercel.app`,
};
