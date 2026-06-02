import type { Module, Step, VerifyResult } from '../../data/types';
import { StepLearn } from './StepLearn';
import { StepDo } from './StepDo';
import { StepVerify } from './StepVerify';
import { StepProgress } from './StepProgress';
import { CompletionCodeBanner } from './CompletionCodeBanner';
import { CelebrationCard } from '../celebration/CelebrationCard';
import { SelfCheck } from './SelfCheck';

interface StepEngineProps {
  steps: Step[];
  currentIndex: number;
  moduleId: string;
  userInputs: Record<string, string>;
  getVerifyResults: (stepId: string) => Record<string, VerifyResult> | undefined;
  getModuleVerifyResults: (moduleId: string) => Record<string, VerifyResult> | undefined;
  isStepComplete: (stepId: string) => boolean;
  onExecute: (prompt: string, stepTitle: string) => void;
  onToggleCheck: (stepId: string, checkId: string) => void;
  onSkip: (stepId: string) => void;
  onMarkComplete: (stepId: string) => void;
  onSaveInput: (key: string, value: string) => void;
  onNavigateStep: (index: number) => void;
  module: Module;
  moduleNumber: number;
  onAdvancePhase: () => void;
  nextPhaseLabel: string | null;
  getSelfCheckState: (stepId: string) => Record<string, boolean>;
  onToggleSelfCheck: (stepId: string, checkId: string, total: number) => void;
}

export const StepEngine = ({
  steps,
  currentIndex,
  userInputs,
  getVerifyResults,
  getModuleVerifyResults,
  isStepComplete,
  onExecute,
  onToggleCheck,
  onSkip,
  onMarkComplete,
  onSaveInput,
  onNavigateStep,
  module,
  moduleNumber,
  onAdvancePhase,
  nextPhaseLabel,
  getSelfCheckState,
  onToggleSelfCheck,
}: StepEngineProps) => {
  const completedSteps = steps.map(s => isStepComplete(s.id));
  const step = steps[currentIndex];

  if (!step) return null;

  const isLocked = currentIndex > 0 && !completedSteps[currentIndex - 1];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StepProgress
        totalSteps={steps.length}
        currentIndex={currentIndex}
        completedSteps={completedSteps}
        onNavigateStep={onNavigateStep}
      />

      {isLocked ? (
        <div className="bg-hermes-bg3 rounded-xl p-10 text-center border border-hermes-border">
          <p className="text-hermes-dark/40 text-sm font-medium">
            Complete the previous step to unlock this one.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Step title */}
          <div className="flex items-baseline gap-4 border-b border-hermes-border pb-4">
            <span className="text-4xl font-black text-hermes-accent opacity-20 tabular-nums leading-none">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <h3 className="text-xl font-bold text-hermes-dark tracking-tight font-sans">
              {step.title}
            </h3>
          </div>

          {/* Learn */}
          <div className="bg-hermes-bg2 rounded-2xl p-8 border border-hermes-border shadow-sm">
            <StepLearn content={step.learn} />
          </div>

          {/* Celebration card — M10 share-completion step */}
          {module.id === 'm10' && step.id === 'share-completion' && (
            <CelebrationCard moduleResults={getModuleVerifyResults(module.id)} />
          )}

          {/* Do */}
          {step.do && (
            <StepDo
              prompt={step.do.prompt}
              requiresInput={step.do.requiresInput}
              userInputs={userInputs}
              onExecute={prompt => onExecute(prompt, step.title)}
              onSaveInput={onSaveInput}
            />
          )}

          {/* M10 completion code: surfaces the validator-generated code prominently.
              Uses module-wide results so the banner appears on all M10 phases,
              not just the phase where the validator was pasted.
              Hidden on the Celebrate phase since CelebrationCard already shows the code. */}
          {module.id === 'm10' && step.id !== 'share-completion' && (
            <CompletionCodeBanner results={getModuleVerifyResults(module.id)} />
          )}

          {/* Verify */}
          {step.verify && (
            <StepVerify
              checks={step.verify.checks}
              results={getVerifyResults(step.id)}
              onToggleCheck={(checkId) => onToggleCheck(step.id, checkId)}
              onSkip={() => onSkip(step.id)}
            />
          )}

          {/* Self-check: outcome "see it happen" checkpoints */}
          {step.selfChecks && step.selfChecks.length > 0 && (
            <SelfCheck
              checks={step.selfChecks}
              done={getSelfCheckState(step.id)}
              onToggle={(checkId) =>
                onToggleSelfCheck(step.id, checkId, step.selfChecks!.length)
              }
              onSkip={() => onSkip(step.id)}
            />
          )}

          {/* Mark as done button for steps without a verify section.
              Steps with `verify` advance via passing checks (or skipping).
              Steps without `verify` need a manual completion control —
              both pure-learn steps AND learn+do steps like Tour Configuration. */}
          {!step.verify && !step.selfChecks && !completedSteps[currentIndex] && (
            <button
              onClick={() => onMarkComplete(step.id)}
              className="w-full py-4 bg-hermes-accent text-white rounded-xl font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-hermes-accent/20"
            >
              I've done this — continue
            </button>
          )}

          {/* Navigation between steps */}
          {(completedSteps[currentIndex] || isStepComplete(step.id)) && currentIndex < steps.length - 1 && (
            <button
              onClick={() => onNavigateStep(currentIndex + 1)}
              className="w-full py-4 bg-hermes-dark text-hermes-bg rounded-xl font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-hermes-dark/10"
            >
              Next Step: {steps[currentIndex + 1]?.title}
            </button>
          )}

          {/* End of phase: jump to next phase (or next module) when last step is complete */}
          {(completedSteps[currentIndex] || isStepComplete(step.id))
            && currentIndex === steps.length - 1
            && nextPhaseLabel && (
            <button
              onClick={onAdvancePhase}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-emerald-600/20"
            >
              Phase complete → Continue to {nextPhaseLabel}
            </button>
          )}

          {/* Course complete: no next phase or module */}
          {(completedSteps[currentIndex] || isStepComplete(step.id))
            && currentIndex === steps.length - 1
            && !nextPhaseLabel && (
            <div className="w-full py-4 bg-emerald-950/40 text-emerald-300 rounded-xl font-bold text-sm text-center border border-emerald-700/40">
              🎉 Course complete — you've reached the end of the curriculum.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
