import { useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';
import { MODULES_DATA } from '../../data/modules';
import type { Module } from '../../data/types';

interface SidebarProps {
  moduleDropdownOpen: boolean;
  setModuleDropdownOpen: (open: boolean) => void;
  activeModuleId: string;
  activePhaseId: string;
  onModuleChange: (moduleId: string) => void;
  onPhaseChange: (phaseId: string) => void;
  currentModule: Module;
  completedModulesCount: number;
  totalCourseModules: number;
}

export const Sidebar = ({
  moduleDropdownOpen,
  setModuleDropdownOpen,
  activeModuleId,
  activePhaseId,
  onModuleChange,
  onPhaseChange,
  currentModule,
  completedModulesCount,
  totalCourseModules,
}: SidebarProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moduleDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModuleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moduleDropdownOpen, setModuleDropdownOpen]);

  return (
    <div className="w-72 flex flex-col bg-hermes-bg2 border-r border-hermes-border h-full relative z-40">
      {/* Logo Section */}
      <div className="p-8 pb-6">
        <div className="flex flex-col gap-1">
          <div className="font-sans font-extrabold text-2xl tracking-tighter text-hermes-dark select-none">
            Her<span className="text-hermes-accent">mes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-hermes-accent/30" />
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-hermes-dark/30">Mastery Course</p>
          </div>
        </div>
      </div>

      {/* Module Selector */}
      <div className="px-4 pb-6 border-b border-hermes-border relative" ref={dropdownRef}>
        <div className="text-[11px] font-bold text-hermes-dark/40 uppercase tracking-[0.15em] mb-2 px-2">
          Course Module
        </div>
        <button
          onClick={() => setModuleDropdownOpen(!moduleDropdownOpen)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-hermes-bg3 border border-hermes-border rounded-xl text-left shadow-sm hover:border-hermes-accent transition-all duration-200"
        >
          <div className="flex items-center gap-2 truncate">
            <currentModule.icon size={16} className="text-hermes-accent flex-shrink-0" />
            <span className="font-semibold text-sm truncate text-hermes-dark">
              {currentModule.shortTitle}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-hermes-dark/40 transition-transform duration-200 ${moduleDropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {moduleDropdownOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-hermes-bg2 border border-hermes-border rounded-xl shadow-xl z-50 max-h-[60vh] overflow-y-auto py-1.5 animate-in fade-in slide-in-from-top-1">
            {(() => {
              const course = MODULES_DATA.filter(m => !m.bonus);
              const bonus = MODULES_DATA.filter(m => m.bonus);
              const renderItem = (mod: Module) => (
                <button
                  key={mod.id}
                  onClick={() => {
                    onModuleChange(mod.id);
                    setModuleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-3 hover:bg-hermes-bg3 transition-colors
                    ${activeModuleId === mod.id ? 'bg-hermes-bg3/50 text-hermes-accent font-semibold' : 'text-hermes-dark/70'}
                  `}
                >
                  <mod.icon
                    size={16}
                    className={activeModuleId === mod.id ? 'text-hermes-accent' : 'text-hermes-dark/30'}
                  />
                  <span className="truncate">{mod.shortTitle}</span>
                </button>
              );
              return (
                <>
                  {course.map(renderItem)}
                  {bonus.length > 0 && (
                    <>
                      <div className="mt-1 mb-1 mx-3 border-t border-hermes-border" />
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-hermes-dark/30">
                        Bonus
                      </div>
                      {bonus.map(renderItem)}
                    </>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Phase list */}
      <nav className="flex-1 p-4 space-y-8 overflow-y-auto mt-4">
        <div className="space-y-3">
          <div className="px-2 flex items-center gap-2">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-hermes-dark/40">
              Phases
            </h2>
          </div>
          <div className="space-y-1">
            {currentModule.phases.map(phase => {
              const Icon = phase.icon;
              const isActive = activePhaseId === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => onPhaseChange(phase.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left text-sm font-medium group relative
                    ${isActive
                      ? 'bg-hermes-bg3 text-hermes-dark shadow-sm'
                      : 'text-hermes-dark/60 hover:bg-hermes-bg3/50 hover:text-hermes-dark'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-hermes-accent' : 'text-hermes-dark/30 group-hover:text-hermes-dark/50'} />
                  <span className="truncate">{phase.title}</span>
                  {isActive && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-hermes-accent rounded-r-full" />}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-40" />}
                </button>
              );
            })}
          </div>
        </div>

      </nav>

      {/* Course progress */}
      <div className="p-4 border-t border-hermes-border">
        <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-400 flex-shrink-0" />
              <div className="text-sm font-semibold text-emerald-300">Progress</div>
            </div>
            <div className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/40">
              {completedModulesCount}/{totalCourseModules}
            </div>
          </div>
          <div className="w-full h-2.5 bg-emerald-950/60 rounded-full overflow-hidden border border-emerald-800/40">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.round((completedModulesCount / totalCourseModules) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
