import { useEffect, useRef, useState, useCallback } from 'react';
import { Copy, Download, Share2, Check } from 'lucide-react';
import type { VerifyResult } from '../../data/types';

interface CelebrationCardProps {
  moduleResults: Record<string, VerifyResult> | undefined;
}

function extractCode(results: Record<string, VerifyResult> | undefined): string | null {
  const entry = results?.['completion-code'];
  if (!entry || !entry.pass) return null;
  const evidence = entry.evidence;
  if (evidence && typeof evidence === 'object' && 'code' in evidence) {
    const code = (evidence as { code: unknown }).code;
    if (typeof code === 'string' && code.length > 0) return code;
  }
  const match = entry.detail.match(/completion code[:\s]+(\S+)/i);
  return match?.[1] ?? null;
}

function extractModuleTally(
  results: Record<string, VerifyResult> | undefined,
): Record<string, { pass: number; fail: number; manual: number }> | null {
  const entry = results?.['completion-report'];
  if (!entry) return null;
  const evidence = entry.evidence;
  if (evidence && typeof evidence === 'object' && 'modules' in evidence) {
    return (evidence as { modules: Record<string, { pass: number; fail: number; manual: number }> }).modules ?? null;
  }
  return null;
}

const CARD_W = 1200;
const CARD_H = 630;

function drawCard(
  ctx: CanvasRenderingContext2D,
  code: string | null,
  tally: Record<string, { pass: number; fail: number; manual: number }> | null,
  dateStr: string,
) {
  // Background
  ctx.fillStyle = '#170d02';
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Border with rounded corners via clip path
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

  // Subtle amber glow top-right
  const grd = ctx.createRadialGradient(CARD_W - 80, 80, 20, CARD_W - 80, 80, 300);
  grd.addColorStop(0, 'rgba(255,189,56,0.10)');
  grd.addColorStop(1, 'transparent');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, CARD_W, CARD_H);

  // Top-left wordmark: "Her" in cream, "mes" in amber
  ctx.font = 'bold 38px "Geologica", "Outfit", sans-serif';
  ctx.fillStyle = '#ffe6cb';
  ctx.fillText('Her', 48, 72);
  const herWidth = ctx.measureText('Her').width;
  ctx.fillStyle = '#ffbd38';
  ctx.fillText('mes', 48 + herWidth, 72);
  // "Mastery" below
  ctx.font = '700 14px "Geologica", "Outfit", sans-serif';
  ctx.fillStyle = 'rgba(255,230,203,0.4)';
  ctx.fillText('MASTERY COURSE', 48, 96);

  // Top-right version label
  ctx.font = '600 13px "Courier Prime", "Courier New", monospace';
  ctx.fillStyle = 'rgba(255,230,203,0.35)';
  const versionStr = 'v0.1.0-alpha';
  const versionW = ctx.measureText(versionStr).width;
  ctx.fillText(versionStr, CARD_W - 48 - versionW, 66);

  // Hero text: "Course Complete"
  ctx.font = 'bold 64px "Geologica", "Outfit", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('Course Complete', CARD_W / 2, 230);

  // HMS code (or placeholder)
  if (code) {
    ctx.font = 'bold 58px "Courier Prime", "Courier New", monospace';
    ctx.fillStyle = '#ffbd38';
    ctx.fillText(code, CARD_W / 2, 320);
  } else {
    ctx.font = '600 22px "Courier Prime", "Courier New", monospace';
    ctx.fillStyle = 'rgba(255,230,203,0.35)';
    ctx.fillText('—— Complete the M10 self-audit to generate ——', CARD_W / 2, 320);
  }

  // Stats grid (3 columns)
  const statsY = 390;
  const statsData = [
    { label: 'MASTERY', value: tally ? computeMastery(tally) + '%' : '—' },
    { label: 'MODULES', value: '10' },
    { label: 'VERIFIED', value: dateStr },
  ];
  const colW = CARD_W / 3;
  statsData.forEach((s, i) => {
    const cx = colW * i + colW / 2;
    ctx.font = 'bold 32px "Geologica", "Outfit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(s.value, cx, statsY);
    ctx.font = '700 11px "Courier Prime", "Courier New", monospace';
    ctx.fillStyle = 'rgba(255,230,203,0.45)';
    ctx.fillText(s.label, cx, statsY + 22);
  });

  // Separator line
  ctx.strokeStyle = '#3a2410';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(48, statsY + 44);
  ctx.lineTo(CARD_W - 48, statsY + 44);
  ctx.stroke();

  // Per-module tally row (M1–M10)
  const moduleRowY = statsY + 76;
  const moduleCount = 10;
  const modW = (CARD_W - 96) / moduleCount;
  for (let i = 1; i <= moduleCount; i++) {
    const key = `m${i}`;
    const modData = tally?.[key];
    const attempted = modData && (modData.pass > 0 || modData.fail > 0 || modData.manual > 0);
    const allPass = modData && modData.fail === 0 && modData.manual === 0 && modData.pass > 0;
    const cx = 48 + modW * (i - 1) + modW / 2;

    // Dot
    ctx.font = '18px serif';
    ctx.fillStyle = allPass ? '#4ade80' : attempted ? '#ffbd38' : 'rgba(255,230,203,0.2)';
    ctx.fillText(attempted ? '◉' : '○', cx - 7, moduleRowY);

    // Label
    ctx.font = '700 10px "Courier Prime", "Courier New", monospace';
    ctx.fillStyle = 'rgba(255,230,203,0.4)';
    ctx.fillText(`M${i}`, cx, moduleRowY + 18);
  }

  // Footer
  ctx.font = '600 14px "Courier Prime", "Courier New", monospace';
  ctx.fillStyle = 'rgba(255,230,203,0.3)';
  ctx.textAlign = 'right';
  ctx.fillText('s1dd4rth.github.io/hermes-mastery', CARD_W - 48, CARD_H - 36);
  ctx.textAlign = 'left';
}

function computeMastery(tally: Record<string, { pass: number; fail: number; manual: number }>): number {
  let totalPass = 0, totalAll = 0;
  for (const mod of Object.values(tally)) {
    totalPass += mod.pass;
    totalAll += mod.pass + mod.fail + mod.manual;
  }
  if (totalAll === 0) return 0;
  return Math.round((totalPass / totalAll) * 100);
}

// CSS-only confetti sparkle particles
function ConfettiParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    duration: `${0.8 + Math.random() * 1.2}s`,
    size: `${4 + Math.random() * 6}px`,
    color: ['#ffbd38', '#ffe6cb', '#4ade80', '#ffffff', '#ffac02'][Math.floor(Math.random() * 5)],
    rotate: `${Math.random() * 360}deg`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      <style>{`
        @keyframes sparkle-out {
          0%   { opacity: 1; transform: translate(0, 0) rotate(var(--r)) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(calc(var(--r) + 360deg)) scale(0.2); }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '2px',
            animationName: 'sparkle-out',
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationFillMode: 'both',
            animationTimingFunction: 'ease-out',
            '--r': p.rotate,
            '--dx': `${(Math.random() - 0.5) * 120}px`,
            '--dy': `${(Math.random() - 0.5) * 120}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export const CelebrationCard = ({ moduleResults }: CelebrationCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copiedFeedback, setCopiedFeedback] = useState<'image' | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);

  const code = extractCode(moduleResults);
  const tally = extractModuleTally(moduleResults);
  const dateStr = new Date().toISOString().slice(0, 10);

  const drawCurrentCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCard(ctx, code, tally, dateStr);
  }, [code, tally, dateStr]);

  useEffect(() => {
    drawCurrentCard();
  }, [drawCurrentCard]);

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, []);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `hermes-mastery-${code ?? 'incomplete'}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }, [code]);

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
    const text = code
      ? `Just completed Hermes Mastery 🎉\n\nMy completion code: ${code}\n\nLearn Hermes Agent by Nous Research:`
      : `I'm building a Hermes Agent setup with Hermes Mastery 🚀`;
    const url = `https://s1dd4rth.github.io/hermes-mastery/`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  }, [code]);

  return (
    <div className="space-y-6">
      {/* Canvas card wrapper */}
      <div className="relative rounded-2xl overflow-hidden border border-hermes-border shadow-lg hermes-glow">
        {showConfetti && <ConfettiParticles />}
        <canvas
          ref={canvasRef}
          width={CARD_W}
          height={CARD_H}
          className="w-full h-auto block"
          style={{ maxWidth: '100%' }}
        />
      </div>

      {/* No-code notice */}
      {!code && (
        <div className="bg-hermes-bg3 border border-hermes-accent/20 rounded-xl px-5 py-4 text-sm text-hermes-cream/70">
          Your HMS- code hasn't been generated yet. Head back to <strong className="text-hermes-accent">Phase 3 → Run the M10 Validator</strong> and paste the JSON output to generate it.
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Share on X — primary */}
        <button
          onClick={shareOnX}
          className="flex items-center gap-2 px-6 py-3 bg-hermes-accent text-hermes-bg font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-hermes-accent/20"
        >
          <Share2 size={16} />
          Share on X
        </button>

        {/* Copy image */}
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

        {/* Download PNG */}
        <button
          onClick={downloadImage}
          className="flex items-center gap-2 px-5 py-3 bg-hermes-bg3 text-hermes-cream border border-hermes-border font-bold text-sm rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download size={16} />
          Download PNG
        </button>
      </div>

      {code && (
        <p className="text-xs text-hermes-cream/40 font-medium">
          Your code <span className="font-mono text-hermes-accent">{code}</span> is a deterministic hash of your M1–M9 check tally. Same setup state → same code on every run.
        </p>
      )}
    </div>
  );
};
