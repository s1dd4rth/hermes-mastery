import { useState } from 'react';
import { MODULES_DATA } from './data/modules';
import { useStepProgress } from './hooks/useStepProgress';
import { Sidebar } from './components/layout/Sidebar';
import { MobileGate } from './components/layout/MobileGate';
import { StepEngine } from './components/steps/StepEngine';

export default function App() {
  // ── Progress & Nav ──────────────────────────────────────────────────
  const {
    nav, userInputs, isLoaded: progressLoaded,
    getStepState, isStepComplete, skipStep,
    markStepComplete, setNav, saveUserInput,
    toggleSelfCheck, getModuleProgress,
  } = useStepProgress();

  // ── UI state ────────────────────────────────────────────────────────
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);
  const [mobileOverride, setMobileOverride] = useState(false);

  // ── Derived ─────────────────────────────────────────────────────────
  const currentModule = MODULES_DATA.find(m => m.id === nav.moduleId) ?? MODULES_DATA[0]!;
  const currentPhase = currentModule.phases.find(p => p.id === nav.phaseId) ?? currentModule.phases[0]!;

  const courseModules = MODULES_DATA.filter(m => !m.bonus);
  const completedModulesCount = courseModules.filter(mod => {
    const { total, done } = getModuleProgress(mod.id);
    return total > 0 && done === total;
  }).length;
  const totalCourseModules = courseModules.length;

  // ── Handlers ────────────────────────────────────────────────────────
  const handleModuleChange = (moduleId: string) => {
    const mod = MODULES_DATA.find(m => m.id === moduleId);
    if (mod) {
      setNav({ moduleId, phaseId: mod.phases[0]?.id ?? '', stepIndex: 0 });
    }
  };

  const handlePhaseChange = (phaseId: string) => {
    setNav({ phaseId, stepIndex: 0 });
  };

  const handleAdvancePhase = () => {
    const phaseIdx = currentModule.phases.findIndex(p => p.id === nav.phaseId);
    if (phaseIdx >= 0 && phaseIdx < currentModule.phases.length - 1) {
      const nextPhase = currentModule.phases[phaseIdx + 1]!;
      setNav({ phaseId: nextPhase.id, stepIndex: 0 });
      return;
    }
    const moduleIdx = MODULES_DATA.findIndex(m => m.id === nav.moduleId);
    if (moduleIdx >= 0 && moduleIdx < MODULES_DATA.length - 1) {
      const nextModule = MODULES_DATA[moduleIdx + 1]!;
      setNav({
        moduleId: nextModule.id,
        phaseId: nextModule.phases[0]?.id ?? '',
        stepIndex: 0,
      });
    }
  };

  const nextPhaseLabel = (() => {
    const phaseIdx = currentModule.phases.findIndex(p => p.id === nav.phaseId);
    if (phaseIdx >= 0 && phaseIdx < currentModule.phases.length - 1) {
      return currentModule.phases[phaseIdx + 1]!.title;
    }
    const moduleIdx = MODULES_DATA.findIndex(m => m.id === nav.moduleId);
    if (moduleIdx >= 0 && moduleIdx < MODULES_DATA.length - 1) {
      const nextModule = MODULES_DATA[moduleIdx + 1]!;
      return `${nextModule.shortTitle} — ${nextModule.phases[0]?.title ?? ''}`;
    }
    return null;
  })();

  const handleExecute = (_prompt: string, _stepTitle: string) => {
    // No-op: user copies the prompt and pastes it in Hermes manually
  };

  // ── Loading gate ────────────────────────────────────────────────────
  if (!progressLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-hermes-cream/60 bg-hermes-bg">
        Loading mastery curriculum...
      </div>
    );
  }

  // ── Mobile gate ─────────────────────────────────────────────────────
  if (typeof window !== 'undefined' && window.innerWidth < 768 && !mobileOverride) {
    return <MobileGate onContinueAnyway={() => setMobileOverride(true)} />;
  }

  const moduleProgress = getModuleProgress(nav.moduleId);

  return (
    <div className="flex h-screen bg-hermes-bg font-body overflow-hidden">
      <Sidebar
        moduleDropdownOpen={moduleDropdownOpen}
        setModuleDropdownOpen={setModuleDropdownOpen}
        activeModuleId={nav.moduleId}
        activePhaseId={nav.phaseId}
        onModuleChange={handleModuleChange}
        onPhaseChange={handlePhaseChange}
        currentModule={currentModule}
        completedModulesCount={completedModulesCount}
        totalCourseModules={totalCourseModules}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-screen-xl mx-auto py-24">
          {/* Module Hero (Mirroring Unpacked) */}
          <header className="mb-24 flex flex-col items-center text-center relative">
            {/* Dynamic Background Glow */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,189,56,0.06)_0%,transparent_70%)] pointer-events-none -z-10" />

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[1.5px] text-hermes-accent bg-hermes-accent/5 px-3 py-1.5 rounded-full border border-hermes-accent/15">
                Module {MODULES_DATA.findIndex(m => m.id === nav.moduleId) + 1} · Internalized
              </span>
              <span className="font-mono text-[0.58rem] font-bold uppercase tracking-[1.5px] text-[#2d8f52] bg-[#2d8f52]/5 px-3 py-1.5 rounded-full border border-[#2d8f52]/15">
                {currentPhase.title} · Step {nav.stepIndex + 1}
              </span>
            </div>

            <div className="max-w-4xl space-y-8 mb-16">
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-6xl md:text-[5rem] font-extrabold text-hermes-dark font-sans tracking-[-0.5px] leading-[1.05] mb-8">
                  {currentModule.title.split(' ').slice(0, -1).join(' ')} <br/>
                  <span className="text-hermes-accent">{currentModule.title.split(' ').slice(-1)}</span>
                </h1>
                <p className="text-xl font-medium text-hermes-dark/50 max-w-[580px] mx-auto leading-[1.8]">
                  {currentModule.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-black text-hermes-accent">{moduleProgress.total > 0 ? Math.round(moduleProgress.done / moduleProgress.total * 100) : 0}%</div>
                <div className="text-[0.55rem] font-bold text-hermes-dark/30 uppercase tracking-[2px] font-mono">Complete</div>
              </div>
              <div className="w-[1px] h-8 bg-hermes-border" />
              <div className="flex flex-col items-center gap-2">
                <div className="text-2xl font-black text-hermes-dark tabular-nums">{moduleProgress.done}/{moduleProgress.total}</div>
                <div className="text-[0.55rem] font-bold text-hermes-dark/30 uppercase tracking-[2px] font-mono">Steps</div>
              </div>
              <div className="w-[1px] h-8 bg-hermes-border" />
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-hermes-bg3 flex items-center justify-center border border-hermes-border">
                  <div className="w-3 h-3 rounded-full bg-hermes-accent animate-pulse shadow-[0_0_12px_rgba(255,189,56,0.35)]" />
                </div>
                <div>
                  <div className="text-[0.55rem] font-bold text-hermes-dark/30 uppercase tracking-[2px] font-mono leading-none mb-1">Platform</div>
                  <div className="text-sm font-black text-hermes-dark leading-none">Curriculum Live</div>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[1px] bg-hermes-border mt-20" />
          </header>

        {/* Content */}
        <StepEngine
            steps={currentPhase.steps}
            currentIndex={nav.stepIndex}
            userInputs={userInputs}
            isStepComplete={stepId =>
              isStepComplete(nav.moduleId, nav.phaseId, stepId)
            }
            onExecute={handleExecute}
            onSkip={stepId => skipStep(nav.moduleId, nav.phaseId, stepId)}
            onMarkComplete={stepId => markStepComplete(nav.moduleId, nav.phaseId, stepId)}
            onSaveInput={saveUserInput}
            onNavigateStep={index => setNav({ stepIndex: index })}
            module={currentModule}
            onAdvancePhase={handleAdvancePhase}
            nextPhaseLabel={nextPhaseLabel}
            getSelfCheckState={stepId =>
              getStepState(nav.moduleId, nav.phaseId, stepId)?.selfChecks ?? {}
            }
            onToggleSelfCheck={(stepId, checkId, total) =>
              toggleSelfCheck(nav.moduleId, nav.phaseId, stepId, checkId, total)
            }
          />
        </div>
      </main>
    </div>
  );
}
