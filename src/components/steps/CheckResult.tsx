import { CheckCircle, XCircle, Circle } from 'lucide-react';

interface CheckResultProps {
  label: string;
  pass: boolean | null;
  detail: string;
  failHint?: string;
  fixPrompt?: string;
  onToggle?: () => void;
}

export const CheckResult = ({
  label,
  pass,
  detail,
  failHint,
  onToggle,
}: CheckResultProps) => {
  const icon =
    pass === true ? <CheckCircle size={20} className="text-emerald-500" /> :
    pass === false ? <XCircle size={20} className="text-hermes-accent" /> :
    <Circle size={20} className="text-hermes-dark/10" />;

  return (
    <div
      onClick={onToggle}
      role={onToggle ? 'button' : undefined}
      tabIndex={onToggle ? 0 : undefined}
      onKeyDown={onToggle ? (e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); } : undefined}
      className={`rounded-2xl border p-4 transition-all duration-200 ${
        pass === true
          ? 'bg-emerald-950/40 border-emerald-700/40 shadow-sm'
          : pass === false
          ? 'bg-red-950/40 border-red-700/40 shadow-sm'
          : 'bg-hermes-bg2 border-hermes-border hover:border-hermes-dark/20'
      } ${onToggle ? 'cursor-pointer select-none group' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold tracking-tight ${
            pass === true ? 'text-emerald-300' :
            pass === false ? 'text-hermes-accent' :
            'text-hermes-dark/80'
          }`}>
            {label}
          </p>
          {detail && (
            <p className="text-xs text-hermes-dark/50 mt-1 font-medium leading-relaxed">{detail}</p>
          )}

          {/* Failure hint */}
          {pass === false && failHint && (
            <div className="mt-3">
              <p className="text-[11px] text-red-300 bg-red-950/40 border border-red-700/40 rounded-lg px-3 py-2 font-medium leading-relaxed">
                <span className="font-bold mr-1">Hint:</span> {failHint}
              </p>
            </div>
          )}
        </div>
        {onToggle && (
          <div className="text-[10px] font-bold uppercase tracking-wider text-hermes-dark/20 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            toggle
          </div>
        )}
      </div>
    </div>
  );
};
