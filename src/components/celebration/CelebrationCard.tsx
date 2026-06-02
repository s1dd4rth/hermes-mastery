import { useEffect, useRef, useState, useCallback } from 'react';
import { Copy, Download, Share2, Check } from 'lucide-react';

const CARD_W = 1200;
const CARD_H = 630;

function drawCard(ctx: CanvasRenderingContext2D, dateStr: string) {
  ctx.fillStyle = '#170d02';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  const r = 12;
  ctx.strokeStyle = '#ffbd38';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(CARD_W - r, 0);
  ctx.quadraticCurveTo(CARD_W, 0, CARD_W, r);
  ctx.lineTo(CARD_W, CARD_H - r);
  ctx.quadraticCurveTo(CARD_W, CARD_H, CARD_W - r, CARD_H);
  ctx.lineTo(r, CARD_H);
  ctx.quadraticCurveTo(0, CARD_H, 0, CARD_H - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.stroke();

  const grd = ctx.createRadialGradient(CARD_W - 80, 80, 20, CARD_W - 80, 80, 300);
  grd.addColorStop(0, 'rgba(255,189,56,0.10)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  ctx.textAlign = 'left';
  ctx.font = 'bold 38px "Geologica", "Outfit", sans-serif';
  ctx.fillStyle = '#ffe6cb';
  ctx.fillText('Her', 48, 72);
  const herWidth = ctx.measureText('Her').width;
  ctx.fillStyle = '#ffbd38';
  ctx.fillText('mes', 48 + herWidth, 72);
  ctx.font = '700 14px "Geologica", "Outfit", sans-serif';
  ctx.fillStyle = 'rgba(255,230,203,0.4)';
  ctx.fillText('MASTERY COURSE', 48, 96);

  ctx.font = 'bold 72px "Geologica", "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Course Complete', CARD_W / 2, 300);

  ctx.font = '600 24px "Courier Prime", "Courier New", monospace';
  ctx.fillStyle = '#ffbd38';
  ctx.fillText('My agent runs itself now.', CARD_W / 2, 360);

  ctx.font = '600 18px "Courier Prime", "Courier New", monospace';
  ctx.fillStyle = 'rgba(255,230,203,0.45)';
  ctx.fillText(dateStr, CARD_W / 2, 430);

  ctx.font = '600 14px "Courier Prime", "Courier New", monospace';
  ctx.fillStyle = 'rgba(255,230,203,0.3)';
  ctx.textAlign = 'right';
  ctx.fillText('s1dd4rth.github.io/hermes-mastery', CARD_W - 48, CARD_H - 36);
  ctx.textAlign = 'left';
}

export const CelebrationCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedFeedback, setCopiedFeedback] = useState<'image' | null>(null);
  const dateStr = new Date().toISOString().slice(0, 10);

  const drawCurrentCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCard(ctx, dateStr);
  }, [dateStr]);

  useEffect(() => {
    drawCurrentCard();
  }, [drawCurrentCard]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = 'hermes-mastery-complete.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }, []);

  const copyImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedFeedback('image');
        setTimeout(() => setCopiedFeedback(null), 3000);
      } catch {
        downloadImage();
      }
    });
  }, [downloadImage]);

  const shareOnX = useCallback(() => {
    const text = `Just finished Hermes Mastery 🎉 My agent runs itself now — morning briefs, inbox triage, research, all on autopilot. Learn Hermes Agent by Nous Research:`;
    const url = `https://s1dd4rth.github.io/hermes-mastery/`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden border border-hermes-border shadow-lg hermes-glow">
        <canvas
          ref={canvasRef}
          width={CARD_W}
          height={CARD_H}
          className="w-full h-auto block"
          style={{ maxWidth: '100%' }}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={shareOnX}
          className="flex items-center gap-2 px-6 py-3 bg-hermes-accent text-hermes-bg font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-hermes-accent/20"
        >
          <Share2 size={16} />
          Share on X
        </button>
        <button
          onClick={copyImage}
          className="flex items-center gap-2 px-5 py-3 bg-hermes-bg3 text-hermes-cream border border-hermes-border font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {copiedFeedback === 'image' ? (
            <><Check size={16} className="text-emerald-400" /> Copied!</>
          ) : (
            <><Copy size={16} /> Copy image</>
          )}
        </button>
        <button
          onClick={downloadImage}
          className="flex items-center gap-2 px-5 py-3 bg-hermes-bg3 text-hermes-cream border border-hermes-border font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download size={16} />
          Download PNG
        </button>
      </div>
    </div>
  );
};
