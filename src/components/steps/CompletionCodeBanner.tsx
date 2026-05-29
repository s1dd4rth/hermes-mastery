import { useState } from 'react';
import { Award, Copy, Check } from 'lucide-react';
import type { VerifyResult } from '../../data/types';

interface CompletionCodeBannerProps {
  /** All verify results for the M10 step. The banner picks out the `completion-code` entry. */
  results: Record<string, VerifyResult> | undefined;
}

function extractCode(results: Record<string, VerifyResult> | undefined): string | null {
  const entry = results?.['completion-code'];
  if (!entry || !entry.pass) return null;

  // Preferred: validator put the code in evidence.code
  const evidence = entry.evidence;
  if (evidence && typeof evidence === 'object' && 'code' in evidence) {
    const code = (evidence as { code: unknown }).code;
    if (typeof code === 'string' && code.length > 0) return code;
  }

  // Fallback: parse "Completion code: XYZ" out of detail
  const match = entry.detail.match(/completion code[:\s]+(\S+)/i);
  return match?.[1] ?? null;
}

export const CompletionCodeBanner = ({ results }: CompletionCodeBannerProps) => {
  const code = extractCode(results);
  const [copied, setCopied] = useState(false);

  if (!code) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // clipboard blocked; the code is still selectable in the page
    }
  };

  return (
    <div className="rounded-2xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/40 to-hermes-bg3 shadow-sm overflow-hidden mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="px-6 py-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center flex-shrink-0">
          <Award size={24} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-1">
            Completion code
          </div>
          <div className="font-mono text-xl text-hermes-accent font-bold tracking-tight select-all break-all mb-2">
            {code}
          </div>
          <div className="text-xs text-hermes-cream/70 font-medium leading-relaxed">
            Your deterministic HMS- code — generated from your M1–M9 pass/fail tally. Head to the Celebrate phase to share it.
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 active:scale-[0.98] transition-all shadow-sm flex-shrink-0"
        >
          {copied ? (
            <>
              <Check size={14} strokeWidth={3} /> Copied
            </>
          ) : (
            <>
              <Copy size={14} strokeWidth={2.5} /> Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
};
