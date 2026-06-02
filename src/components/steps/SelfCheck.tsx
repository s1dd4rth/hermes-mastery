import { CheckCircle2, Circle, SkipForward } from 'lucide-react';
import type { SelfCheckItem } from '../../data/types';

interface SelfCheckProps {
  checks: SelfCheckItem[];
  /** done-state per checkId */
  done: Record<string, boolean>;
  onToggle: (checkId: string) => void;
  onSkip: () => void;
}

export const SelfCheck = ({ checks, done, onToggle, onSkip }: SelfCheckProps) => {
  const allDone = checks.length > 0 && checks.every(c => done[c.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-hermes-dark uppercase tracking-widest">
          See it happen
        </span>
        {!allDone && (
          <button
            onClick={onSkip}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-hermes-dark/40 hover:text-hermes-accent transition-colors bg-hermes-bg3 rounded-full border border-hermes-border"
            title="Skip"
          >
            <SkipForward size={12} />
            Skip
          </button>
        )}
      </div>

      <div className="grid gap-2">
        {checks.map(check => {
          const isDone = done[check.id] === true;
          return (
            <button
              key={check.id}
              onClick={() => onToggle(check.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-700/40 text-emerald-300'
                  : 'bg-hermes-bg2 border-hermes-border text-hermes-dark/70 hover:border-hermes-accent/40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-hermes-dark/30 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{check.label}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-hermes-dark/40 italic font-medium px-1">
        Tick each one once you've seen your agent actually do it.
      </p>
    </div>
  );
};
