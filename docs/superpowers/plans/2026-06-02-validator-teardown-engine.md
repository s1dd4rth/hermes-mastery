# Validator Teardown & Step-Based Engine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retire the `hermes-mastery-validator` subsystem and re-point the web app's progress/celebration on **steps completed** plus a lightweight **self-check** model, leaving a working app that no longer depends on validator JSON, the paste panel, the live API, or the git submodule.

**Architecture:** The validator is woven through `App.tsx` (hero stats, ValidationDashboard branch, completion-code plumbing), `useStepProgress` (`getModuleChecks` counts checks → progress), `Sidebar`, `CelebrationCard`, and `CompletionCodeBanner`. We replace "checks passed" with "steps completed" as the unit of progress, add an additive `Step.selfChecks` field rendered by a new `SelfCheck` block, migrate every consumer, then delete the validator files + submodule last so the build stays green at each commit.

**Tech Stack:** Vite 8 + React 19 + TypeScript 6 + Tailwind 4, bun. **No test runner exists in this project** — verification is `bun run build` passing (TypeScript is the type-test) plus the explicit manual browser checks in each task. Run the app with `bun run dev` for browser checks.

**Scope note:** This plan is the *engine teardown only*. The outcome-first content rewrite (new 10-module spine from the spec) is a **separate follow-up plan** authored against the stable model this plan produces. This plan keeps the **current** module content, mechanically converted to the new self-check shape, so the app stays shippable throughout.

---

## File Structure

**Modify:**
- `src/data/types.ts` — add `SelfCheckItem` + `Step.selfChecks`; later remove `CheckItem`, `Step.verify`, `VerifyResult`, `StepState.verifyResults`.
- `src/hooks/useStepProgress.ts` — add `getModuleProgress` (step-based); later remove `setVerifyResults`, `getModuleChecks`, `isResultStale`, `VerifyResult` import.
- `src/App.tsx` — hero stats → step-based; drop ValidationDashboard branch, completion-code plumbing, validator handlers, validator imports.
- `src/components/steps/StepEngine.tsx` — render `SelfCheck` instead of `PasteValidatorOutput` + `StepVerify`; drop validator props; keep `CompletionCelebration` hand-off.
- `src/components/celebration/CelebrationCard.tsx` — read completion from step-progress, not `completion-code` evidence.
- `src/components/layout/Sidebar.tsx` — remove the validator "Resources" link.

**Create:**
- `src/components/steps/SelfCheck.tsx` — the lightweight "tick when you've seen it happen" block.

**Delete (final task):**
- `src/components/steps/PasteValidatorOutput.tsx`
- `src/components/steps/StepVerify.tsx`
- `src/components/steps/CheckResult.tsx`
- `src/components/steps/CompletionCodeBanner.tsx`
- `src/components/validation/ValidationDashboard.tsx` (and the `validation/` dir if empty)
- `src/data/validator.ts`
- `src/data/liveApi.ts`
- `src/data/featureFlags.ts`
- `src/hooks/useLiveApiSettings.ts`
- `hermes-mastery-validator/` submodule + `.gitmodules`

---

## Task 1: Add the additive self-check type

**Files:**
- Modify: `src/data/types.ts:3-26`

- [ ] **Step 1: Add `SelfCheckItem` and `Step.selfChecks` (additive — leave `CheckItem`/`verify` in place for now)**

In `src/data/types.ts`, add the new interface above `Step` and a new optional field on `Step`:

```typescript
export interface SelfCheckItem {
  /** What the learner confirms they saw happen, e.g. "My agent texted me the brief." */
  id: string;
  label: string;
}

export interface Step {
  id: string;
  title: string;
  learn: string;
  do?: {
    prompt: string;
    requiresInput?: {
      label: string;
      placeholder: string;
      storeAs: string;
    };
  };
  /** New: outcome-first "did you see it happen?" checkpoints. */
  selfChecks?: SelfCheckItem[];
  /** @deprecated validator-era checks — removed in Task 9. */
  verify?: {
    checks: CheckItem[];
  };
}
```

- [ ] **Step 2: Verify build passes**

Run: `bun run build`
Expected: `✓ built in …` with no TypeScript errors (the field is additive; nothing references it yet).

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat(types): add additive SelfCheckItem / Step.selfChecks"
```

---

## Task 2: Build the SelfCheck component

**Files:**
- Create: `src/components/steps/SelfCheck.tsx`

- [ ] **Step 1: Write the component**

This mirrors the existing `StepVerify` interaction (tick to toggle complete) but with no validator semantics — it just reports each checkpoint's done-state up and lets the user toggle it. Create `src/components/steps/SelfCheck.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify build passes**

Run: `bun run build`
Expected: builds clean (component is defined but not yet imported).

- [ ] **Step 3: Commit**

```bash
git add src/components/steps/SelfCheck.tsx
git commit -m "feat(steps): add SelfCheck component (outcome checkpoints)"
```

---

## Task 3: Add step-based progress to the hook

**Files:**
- Modify: `src/hooks/useStepProgress.ts`

We add a `getModuleProgress(moduleId)` that counts **steps complete / total steps** and a `toggleSelfCheck` that marks a step complete when all its self-checks are ticked. We keep the old validator functions for now (removed in Task 9) so the build stays green.

- [ ] **Step 1: Add self-check state + step-based progress**

In `src/hooks/useStepProgress.ts`, add to `StepState` usage a `selfChecks` map. First extend the type in `src/data/types.ts` `StepState`:

```typescript
export interface StepState {
  completed: boolean;
  skipped: boolean;
  /** New: per-self-check done-state. */
  selfChecks?: Record<string, boolean>;
  /** @deprecated removed in Task 9 */
  verifyResults?: Record<string, VerifyResult>;
}
```

Then in `useStepProgress.ts`, add these two callbacks (place them after `markStepComplete`, before `setNav`):

```typescript
  const toggleSelfCheck = useCallback(
    (moduleId: string, phaseId: string, stepId: string, checkId: string, total: number) => {
      setProgress(prev => {
        const next = { ...prev };
        if (!next[moduleId]) next[moduleId] = {};
        if (!next[moduleId][phaseId]) next[moduleId][phaseId] = {};
        const existing = next[moduleId][phaseId][stepId] ?? { completed: false, skipped: false };
        const checks = { ...(existing.selfChecks ?? {}) };
        checks[checkId] = !checks[checkId];
        const doneCount = Object.values(checks).filter(Boolean).length;
        next[moduleId][phaseId][stepId] = {
          ...existing,
          selfChecks: checks,
          completed: total > 0 && doneCount >= total,
        };
        return next;
      });
    },
    [],
  );

  const getModuleProgress = useCallback(
    (moduleId: string) => {
      const mod = MODULES_DATA.find(m => m.id === moduleId);
      if (!mod) return { total: 0, done: 0 };
      let total = 0;
      let done = 0;
      for (const phase of mod.phases) {
        for (const step of phase.steps) {
          total += 1;
          const state = progress[moduleId]?.[phase.id]?.[step.id];
          if (state?.completed || state?.skipped) done += 1;
        }
      }
      return { total, done };
    },
    [progress],
  );
```

- [ ] **Step 2: Export the new callbacks**

In the `return { … }` at the bottom of `useStepProgress`, add `toggleSelfCheck,` and `getModuleProgress,` to the returned object (keep the existing exports for now).

- [ ] **Step 3: Verify build passes**

Run: `bun run build`
Expected: builds clean.

- [ ] **Step 4: Commit**

```bash
git add src/data/types.ts src/hooks/useStepProgress.ts
git commit -m "feat(progress): add step-based getModuleProgress + toggleSelfCheck"
```

---

## Task 4: Render SelfCheck in StepEngine

**Files:**
- Modify: `src/components/steps/StepEngine.tsx`

Render the new `SelfCheck` block for steps that have `selfChecks`, fed by new props. Leave the old `PasteValidatorOutput` + `StepVerify` rendering in place for now (steps still use `verify`); they're removed in Task 6 and Task 9. This task only ADDS the selfChecks branch.

- [ ] **Step 1: Add props + import**

At the top of `StepEngine.tsx`, add the import:

```tsx
import { SelfCheck } from './SelfCheck';
```

Add to `StepEngineProps`:

```tsx
  getSelfCheckState: (stepId: string) => Record<string, boolean>;
  onToggleSelfCheck: (stepId: string, checkId: string, total: number) => void;
```

Add `getSelfCheckState,` and `onToggleSelfCheck,` to the destructured params.

- [ ] **Step 2: Render the block**

Immediately AFTER the existing `{step.verify && ( <StepVerify … /> )}` block, add:

```tsx
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
```

- [ ] **Step 3: Update the "Mark as done" condition**

The existing manual-completion button shows for steps with no `verify`. Update its condition so it does NOT show when `selfChecks` are present (the self-checks drive completion instead). Change:

```tsx
          {!step.verify && !completedSteps[currentIndex] && (
```

to:

```tsx
          {!step.verify && !step.selfChecks && !completedSteps[currentIndex] && (
```

- [ ] **Step 4: Pass the new props from App**

In `src/App.tsx`, in the `<StepEngine … />` JSX, add:

```tsx
            getSelfCheckState={stepId =>
              getStepState(nav.moduleId, nav.phaseId, stepId)?.selfChecks ?? {}
            }
            onToggleSelfCheck={(stepId, checkId, total) =>
              toggleSelfCheck(nav.moduleId, nav.phaseId, stepId, checkId, total)
            }
```

And add `toggleSelfCheck,` and `getModuleProgress,` to the destructured `useStepProgress()` return at the top of `App.tsx`.

- [ ] **Step 5: Verify build passes**

Run: `bun run build`
Expected: builds clean.

- [ ] **Step 6: Commit**

```bash
git add src/components/steps/StepEngine.tsx src/App.tsx
git commit -m "feat(steps): render SelfCheck block in StepEngine"
```

---

## Task 5: Switch hero stats + Sidebar to step-based progress

**Files:**
- Modify: `src/App.tsx:26-33,219-228,278-282`
- Modify: `src/components/layout/Sidebar.tsx:160-171`

- [ ] **Step 1: Replace check-based module counting in App**

In `src/App.tsx`, replace the `completedModulesCount` block (currently using `getModuleChecks`):

```tsx
  const courseModules = MODULES_DATA.filter(m => !m.bonus);
  const completedModulesCount = courseModules.filter(mod => {
    const { total, done } = getModuleProgress(mod.id);
    return total > 0 && done === total;
  }).length;
  const totalCourseModules = courseModules.length;
```

Replace `const moduleChecks = getModuleChecks(nav.moduleId);` (near the bottom, before `return`) with:

```tsx
  const moduleProgress = getModuleProgress(nav.moduleId);
```

- [ ] **Step 2: Update the hero stats to steps**

In the hero stats block, replace the three stat columns that reference `moduleChecks`:

```tsx
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-black text-hermes-accent">{moduleProgress.total > 0 ? Math.round(moduleProgress.done / moduleProgress.total * 100) : 0}%</div>
                <div className="text-[0.55rem] font-bold text-hermes-dark/30 uppercase tracking-[2px] font-mono">Complete</div>
              </div>
              <div className="w-[1px] h-8 bg-hermes-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-black text-hermes-dark tabular-nums">{moduleProgress.done}/{moduleProgress.total}</div>
                <div className="text-[0.55rem] font-bold text-hermes-dark/30 uppercase tracking-[2px] font-mono">Steps</div>
              </div>
```

- [ ] **Step 3: Remove the validator Resources link from Sidebar**

In `src/components/layout/Sidebar.tsx`, delete the entire "Extra Resources" `<div className="pt-4 border-t border-hermes-border space-y-3">…</div>` block (lines ~153-172, the one containing the `hermes-mastery-validator` link). The phase `<nav>` keeps everything else.

- [ ] **Step 4: Verify build passes**

Run: `bun run build`
Expected: builds clean.

- [ ] **Step 5: Browser check**

Run `bun run dev`, open the app. Confirm: the hero shows "Steps" / "Complete %" (not "Checks"/"Mastery"), the sidebar no longer shows the "Hermes Mastery" validator link, and ticking a self-check on a converted step advances the step.

(Note: converted content lands in Task 9; until then some modules still render the old `verify` block — that's expected mid-migration.)

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/layout/Sidebar.tsx
git commit -m "feat(progress): hero stats + sidebar use step-based progress"
```

---

## Task 6: Remove the ValidationDashboard branch and paste panel

**Files:**
- Modify: `src/App.tsx` (remove `isValidationPhase` branch, validator handlers, imports)
- Modify: `src/components/steps/StepEngine.tsx` (remove `PasteValidatorOutput`)

- [ ] **Step 1: Always render StepEngine in App**

In `src/App.tsx`, replace the `{isValidationPhase ? ( <ValidationDashboard … /> ) : ( <StepEngine … /> )}` ternary with just the `<StepEngine … />` block (drop the `ValidationDashboard` arm and the surrounding `? :`). Delete the line `const isValidationPhase = currentPhase.id === 'validation';`.

- [ ] **Step 2: Remove now-dead validator handlers + imports from App**

Delete these from `src/App.tsx`:
- the import `import { ValidationDashboard } from './components/validation/ValidationDashboard';`
- the import `import { isPasteValidatorEnabled } from './data/featureFlags';`
- the import `import type { ApplyPlan } from './data/validator';`
- the functions `getModuleVerifyResults`, `handleToggleCheck`, `handleApplyValidatorPlan`, `handleToggleDashboardCheck`
- from the `useStepProgress()` destructure: `setVerifyResults`, `getModuleChecks` (and `getStepState` only if now unused — it is still used by `getSelfCheckState`, so keep it)
- the `<StepEngine>` props that reference removed handlers: `getModuleVerifyResults`, `getVerifyResults`, `onToggleCheck`, `pasteValidatorEnabled`, `onApplyValidator`. (Leave `onExecute`, `onSkip`, `onMarkComplete`, `onSaveInput`, `onNavigateStep`, `module`, `moduleNumber`, `onAdvancePhase`, `nextPhaseLabel`, and the new self-check props.)

- [ ] **Step 3: Remove PasteValidatorOutput + validator props from StepEngine**

In `src/components/steps/StepEngine.tsx`:
- delete `import { PasteValidatorOutput } from './PasteValidatorOutput';`
- delete the `{step.verify && pasteValidatorEnabled && phaseId === 'validation' && ( <PasteValidatorOutput … /> )}` block
- remove these from `StepEngineProps` and the destructure: `getVerifyResults`, `getModuleVerifyResults`, `onToggleCheck`, `pasteValidatorEnabled`, `onApplyValidator`. Keep `phaseId` only if still referenced elsewhere; if not, remove it too.
- the `CompletionCodeBanner` + `CelebrationCard` references stay for now (handled in Task 7).

- [ ] **Step 4: Verify build passes**

Run: `bun run build`
Expected: builds clean. If TS flags an unused import/var, remove it.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/components/steps/StepEngine.tsx
git commit -m "refactor: drop ValidationDashboard branch + paste-validator panel"
```

---

## Task 7: Decouple completion celebration from validator code

**Files:**
- Modify: `src/components/steps/StepEngine.tsx` (drop CompletionCodeBanner)
- Modify: `src/components/celebration/CelebrationCard.tsx` (read step-progress, not validator evidence)

Per the spec (§5), retire the `HMS-` aggregation. The CelebrationCard stays as a finish-line celebration but no longer renders a computed code — it shows "Course Complete" + a share action.

- [ ] **Step 1: Remove CompletionCodeBanner from StepEngine**

In `src/components/steps/StepEngine.tsx`, delete `import { CompletionCodeBanner } from './CompletionCodeBanner';` and both `{module.id === 'm10' && … <CompletionCodeBanner … />}` blocks. Keep the `CelebrationCard` render but change its prop (next step).

- [ ] **Step 2: Simplify CelebrationCard to a no-code finish card**

Replace the contents of `src/components/celebration/CelebrationCard.tsx` with a version that takes no validator results. Full file:

```tsx
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
```

- [ ] **Step 3: Update the CelebrationCard call site**

In `src/components/steps/StepEngine.tsx`, change `<CelebrationCard moduleResults={getModuleVerifyResults(module.id)} />` to `<CelebrationCard />`. (If `getModuleVerifyResults` was already removed in Task 6, this is just confirming the call site takes no props.)

- [ ] **Step 4: Verify build passes**

Run: `bun run build`
Expected: builds clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/steps/StepEngine.tsx src/components/celebration/CelebrationCard.tsx
git commit -m "refactor: retire HMS code; CelebrationCard is a no-code finish card"
```

---

## Task 8: Convert current module content from `verify` to `selfChecks`

**Files:**
- Modify: `src/data/modules.ts` (mechanical conversion of every `verify: { checks: [...] }`)

This keeps the **current** content working under the new model. Each `verify.checks[]` entry becomes a `selfChecks[]` entry: keep `id`, turn `label` into an outcome-phrased checkpoint, drop `verifyPrompt`/`failHint`/`fixPrompt`.

- [ ] **Step 1: Convert each verify block**

For every step in `src/data/modules.ts` that has a `verify: { checks: [ { id, label, verifyPrompt, failHint, fixPrompt }, … ] }`, replace it with:

```typescript
            selfChecks: [
              { id: '<same id>', label: '<label, rephrased as something you saw happen>' },
              // …one per former check
            ],
```

Example — M1's `hermes-installed` check becomes:

```typescript
            selfChecks: [
              { id: 'hermes-installed', label: '`hermes --version` printed a version' },
            ],
```

Work top to bottom. After each module's conversion, run `bun run build` to catch a malformed object early. Preserve every `id` exactly (progress is keyed on them).

- [ ] **Step 2: Verify no `verify:` blocks remain**

Run: `grep -n "verify: {" src/data/modules.ts`
Expected: no output.

- [ ] **Step 3: Verify build passes**

Run: `bun run build`
Expected: builds clean.

- [ ] **Step 4: Browser check**

`bun run dev` → walk M1: each former check now shows as a "See it happen" checkpoint; ticking all of them completes the step and advances progress.

- [ ] **Step 5: Commit**

```bash
git add src/data/modules.ts
git commit -m "refactor(content): convert verify checks to self-checks (current content)"
```

---

## Task 9: Remove the dead validator types and components

**Files:**
- Modify: `src/data/types.ts` (remove `CheckItem`, `Step.verify`, `VerifyResult`, `StepState.verifyResults`)
- Modify: `src/hooks/useStepProgress.ts` (remove `setVerifyResults`, `getModuleChecks`, `isResultStale`, `VerifyResult` import)
- Delete: `StepVerify.tsx`, `CheckResult.tsx`, `PasteValidatorOutput.tsx`, `CompletionCodeBanner.tsx`, `ValidationDashboard.tsx`, `validator.ts`, `liveApi.ts`, `featureFlags.ts`, `useLiveApiSettings.ts`

- [ ] **Step 1: Delete the validator-only files**

```bash
git rm src/components/steps/StepVerify.tsx \
       src/components/steps/CheckResult.tsx \
       src/components/steps/PasteValidatorOutput.tsx \
       src/components/steps/CompletionCodeBanner.tsx \
       src/components/validation/ValidationDashboard.tsx \
       src/data/validator.ts \
       src/data/liveApi.ts \
       src/data/featureFlags.ts \
       src/hooks/useLiveApiSettings.ts
```

- [ ] **Step 2: Remove StepVerify usage from StepEngine**

In `src/components/steps/StepEngine.tsx`, delete `import { StepVerify } from './StepVerify';` and the `{step.verify && ( <StepVerify … /> )}` block. The step now relies solely on `selfChecks`.

- [ ] **Step 3: Strip validator types**

In `src/data/types.ts`: remove the `CheckItem` interface, the `verify?` field from `Step`, the `VerifyResult` interface, and the `verifyResults?` field from `StepState`.

- [ ] **Step 4: Strip validator functions from the hook**

In `src/hooks/useStepProgress.ts`: remove the `VerifyResult` import, the `setVerifyResults` callback, the `getModuleChecks` callback, the `isResultStale` callback, and remove `setVerifyResults` + `getModuleChecks` from the returned object.

- [ ] **Step 5: Verify build passes**

Run: `bun run build`
Expected: builds clean. TS will flag any remaining reference to a deleted symbol — chase each down and remove it.

- [ ] **Step 6: Confirm no dangling references**

Run: `grep -rn "validator\|VerifyResult\|CheckItem\|getModuleChecks\|verifyResults\|featureFlags\|liveApi\|ValidationDashboard\|CompletionCodeBanner" src/`
Expected: no output (the `validation/` directory may be empty — remove it with `rmdir src/components/validation 2>/dev/null || true`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: delete validator types, hooks, and components"
```

---

## Task 10: Remove the validator git submodule

**Files:**
- Delete: `hermes-mastery-validator/` (submodule), `.gitmodules`

- [ ] **Step 1: Deinit and remove the submodule**

```bash
git submodule deinit -f hermes-mastery-validator
git rm -f hermes-mastery-validator
rm -rf .git/modules/hermes-mastery-validator
```

This also removes the `[submodule "hermes-mastery-validator"]` stanza from `.gitmodules`. If `.gitmodules` is now empty, remove it:

```bash
[ -s .gitmodules ] || git rm -f .gitmodules
```

- [ ] **Step 2: Verify the working tree + build**

Run: `git status` then `bun run build`
Expected: `hermes-mastery-validator` and `.gitmodules` deleted/staged; build clean.

- [ ] **Step 3: Update README references to the validator**

In `README.md`, remove the "Validator" architecture bullet and the submodule clone instructions (`git clone --recurse-submodules`), since there is no submodule anymore. Leave the course description; note that completion is now self-attested.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove hermes-mastery-validator submodule"
```

---

## Task 11: Full verification + deploy

- [ ] **Step 1: Clean build**

Run: `bun run build`
Expected: `✓ built in …`, no warnings about missing modules.

- [ ] **Step 2: Browser smoke test**

`bun run dev`. Verify across two modules:
- Hero shows "Steps" + "Complete %"; no "Checks"/"Mastery".
- Each step's "See it happen" checkpoints toggle; ticking all completes the step; the Next/phase buttons appear.
- Sidebar progress (`done/total` modules) increments when a module's steps are all complete.
- M10's final phase shows the `CelebrationCard` (no HMS code, no paste panel).
- No console errors.

- [ ] **Step 3: Push (triggers GitHub Pages deploy)**

```bash
git push origin main
```

- [ ] **Step 4: Confirm deploy**

Run: `gh run list --workflow=deploy.yml --limit 1`
Expected: latest run `completed  success`.

---

## Self-Review

**Spec coverage (§5 of the redesign spec):**
- Retire validator submodule → Task 10. ✅
- Delete PasteValidatorOutput, ValidationDashboard, validator.ts, liveApi.ts, useLiveApiSettings.ts, featureFlags.ts → Task 6 + Task 9. ✅
- Validator-specific bits of StepEngine/StepVerify/CheckResult/useStepProgress → Task 6, 7, 9. ✅
- Lightweight self-attested checkpoints replace validator JSON → Tasks 1–4, 8. ✅
- Retire HMS aggregation; CelebrationCard decoupled → Task 7. ✅
- Progress tracking stays (keyed by step id), independent of validator → Task 3, 5. ✅
- `verify.checks[]` replaced by simpler self-check concept; `useStepProgress` drops per-check state, keeps step-complete + nav + user-input persistence → Tasks 1, 3, 9. ✅

**Out of scope (correctly deferred to Plan 2):** the new outcome-first content spine. This plan keeps current content, mechanically converted (Task 8). ✅

**Type consistency:** `SelfCheckItem { id, label }` (Task 1) is consumed identically in `SelfCheck.tsx` (Task 2), `StepEngine` (Task 4), and `modules.ts` (Task 8). `getModuleProgress` returns `{ total, done }` (Task 3), used with those exact names in `App.tsx` (Task 5). `toggleSelfCheck(moduleId, phaseId, stepId, checkId, total)` signature (Task 3) matches the call in `StepEngine`/`App` (Task 4). ✅

**Placeholder scan:** every code step contains complete code; no TBD/TODO. Task 8's conversion is mechanical with a worked example rather than literal 600-line output (the content is being replaced wholesale in Plan 2, so exhaustive transcription here would be waste). ✅
