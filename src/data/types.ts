import type { LucideIcon } from 'lucide-react';

export interface CheckItem {
  id: string;
  label: string;
  verifyPrompt: string;
  failHint?: string;
  fixPrompt?: string;
}

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
  /** @deprecated validator-era checks — removed in a later task. */
  verify?: {
    checks: CheckItem[];
  };
}

export interface Phase {
  id: string;
  title: string;
  icon: LucideIcon;
  steps: Step[];
}

export interface Module {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  phases: Phase[];
  /**
   * True if this is a bonus module (not part of the M1–M10 course track).
   * The Sidebar groups bonuses below a "Bonus" header. Bonus modules are
   * EXCLUDED from M10's completion code orchestration in the validator.
   */
  bonus?: boolean;
}

export interface VerifyResult {
  pass: boolean;
  detail: string;
  checkedAt: string;
  /** Optional opaque evidence from the validator (e.g. M10's completion code). Not all checks set this. */
  evidence?: unknown;
}

export interface StepState {
  completed: boolean;
  skipped: boolean;
  /** New: per-self-check done-state. */
  selfChecks?: Record<string, boolean>;
  /** @deprecated removed in a later task */
  verifyResults?: Record<string, VerifyResult>;
}

export interface AppProgress {
  [moduleId: string]: {
    [phaseId: string]: {
      [stepId: string]: StepState;
    };
  };
}

export interface NavState {
  moduleId: string;
  phaseId: string;
  stepIndex: number;
}

