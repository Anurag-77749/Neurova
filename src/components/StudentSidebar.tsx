import React from 'react';
import { 
  SunMedium, 
  Clock, 
  BarChart3, 
  Target, 
  LogOut,
  Brain,
  GraduationCap
} from 'lucide-react';
import { NeurovaLogo } from './NeurovaLogo';
import { UserSession } from '../types';

interface StudentSidebarProps {
  activeScreen: string;
  onSelectScreen: (screen: string) => void;
  session: UserSession;
  completedTasksCount: number;
  totalTasksCount: number;
  onSignOut: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeScreen,
  onSelectScreen,
  session,
  completedTasksCount,
  totalTasksCount,
  onSignOut,
}) => {
  const progressPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  const navItems = [
    { id: 'today', label: "Today's Tasks", icon: SunMedium },
    { id: 'ai-analysis', label: "AI Analysis", icon: Brain },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Clock },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'ai-reteach', label: 'AI Reteach', icon: GraduationCap },
  ];

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-[#0E0F15] border-r border-slate-200/80 dark:border-[#1C1E2A] flex flex-col justify-between shrink-0 p-4 h-full min-h-0 overflow-y-auto select-none">
      <div className="space-y-5">
        {/* Brand Header */}
        <div className="px-2 pt-1 pb-2 flex items-center justify-between">
          <NeurovaLogo size="md" showText={true} />
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            v2.4
          </span>
        </div>

        {/* Progress Card - Linear / Raycast Style */}
        <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#13151F] border border-slate-200/80 dark:border-[#1F2232] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              Completion Rate
            </span>
            <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#0B0C11] overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{completedTasksCount} of {totalTasksCount} tasks complete</span>
            <button
              onClick={() => onSelectScreen('progress')}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium transition-colors"
            >
              Details
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Section */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-[#1C1E2A] space-y-2.5">
        <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-[#13151F] border border-slate-200/80 dark:border-[#1F2232] flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs shrink-0">
              {session.name ? session.name.charAt(0).toUpperCase() : (session.section || 'S')}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={session.name}>
                {session.name || `Student`}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Class {session.classLevel}-{session.section} • #{session.rollNumber}
              </p>
            </div>
          </div>

          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200/80 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400">
            Student
          </span>
        </div>

        <button
          onClick={onSignOut}
          className="w-full py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
