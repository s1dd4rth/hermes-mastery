import { useState, useEffect, useCallback } from 'react';
import type { AppProgress, NavState, StepState } from '../data/types';
import { MODULES_DATA } from '../data/modules';

const PROGRESS_KEY = 'hermesProgress';
const NAV_KEY = 'hermesNav';
const INPUTS_KEY = 'hermesUserInputs';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded
  }
}

const defaultNav: NavState = {
  moduleId: MODULES_DATA[0]?.id ?? 'm1',
  phaseId: MODULES_DATA[0]?.phases[0]?.id ?? 'deploy',
  stepIndex: 0,
};

export function useStepProgress() {
  const [progress, setProgress] = useState<AppProgress>({});
  const [nav, setNavRaw] = useState<NavState>(defaultNav);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Rehydrate
  useEffect(() => {
    setProgress(load(PROGRESS_KEY, {}));
    setUserInputs(load(INPUTS_KEY, {}));

    const savedNav = load<NavState | null>(NAV_KEY, null);
    if (savedNav) {
      // Validate against current module data
      const mod = MODULES_DATA.find(m => m.id === savedNav.moduleId);
      if (mod) {
        const phase = mod.phases.find(p => p.id === savedNav.phaseId);
        if (phase) {
          setNavRaw(savedNav);
        } else {
          setNavRaw({ ...savedNav, phaseId: mod.phases[0]?.id ?? '', stepIndex: 0 });
        }
      }
      // If module doesn't exist, keep defaults
    }

    setIsLoaded(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (isLoaded) save(PROGRESS_KEY, progress);
  }, [progress, isLoaded]);

  useEffect(() => {
    if (isLoaded) save(NAV_KEY, nav);
  }, [nav, isLoaded]);

  useEffect(() => {
    if (isLoaded) save(INPUTS_KEY, userInputs);
  }, [userInputs, isLoaded]);

  const getStepState = useCallback(
    (moduleId: string, phaseId: string, stepId: string): StepState | undefined => {
      return progress[moduleId]?.[phaseId]?.[stepId];
    },
    [progress],
  );

  const isStepComplete = useCallback(
    (moduleId: string, phaseId: string, stepId: string): boolean => {
      const state = getStepState(moduleId, phaseId, stepId);
      return state?.completed === true || state?.skipped === true;
    },
    [getStepState],
  );

  const skipStep = useCallback(
    (moduleId: string, phaseId: string, stepId: string) => {
      setProgress(prev => {
        const next = { ...prev };
        if (!next[moduleId]) next[moduleId] = {};
        if (!next[moduleId][phaseId]) next[moduleId][phaseId] = {};
        next[moduleId][phaseId][stepId] = {
          ...(next[moduleId][phaseId][stepId] ?? { completed: false, skipped: false }),
          skipped: true,
        };
        return next;
      });
    },
    [],
  );

  const markStepComplete = useCallback(
    (moduleId: string, phaseId: string, stepId: string) => {
      setProgress(prev => {
        const next = { ...prev };
        if (!next[moduleId]) next[moduleId] = {};
        if (!next[moduleId][phaseId]) next[moduleId][phaseId] = {};
        next[moduleId][phaseId][stepId] = {
          ...(next[moduleId][phaseId][stepId] ?? { completed: false, skipped: false }),
          completed: true,
        };
        return next;
      });
    },
    [],
  );

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

  const setNav = useCallback((update: Partial<NavState>) => {
    setNavRaw(prev => ({ ...prev, ...update }));
  }, []);

  const saveUserInput = useCallback((key: string, value: string) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
  }, []);

  return {
    progress,
    nav,
    userInputs,
    isLoaded,
    getStepState,
    isStepComplete,
    skipStep,
    markStepComplete,
    toggleSelfCheck,
    getModuleProgress,
    setNav,
    saveUserInput,
  };
}
