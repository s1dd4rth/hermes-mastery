import type { LucideIcon } from 'lucide-react';


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
   * The Sidebar groups bonuses below a "Bonus" header.
   */
  bonus?: boolean;
}

export interface StepState {
  completed: boolean;
  skipped: boolean;
  /** New: per-self-check done-state. */
  selfChecks?: Record<string, boolean>;
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

