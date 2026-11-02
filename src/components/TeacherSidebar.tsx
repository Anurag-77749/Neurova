import React from 'react';
import { 
  Send, 
  School, 
  LogOut,
  Layers,
  ClipboardList,
  LineChart,
  Users,
  X
} from 'lucide-react';
import { NeurovaLogo } from './NeurovaLogo';
import { UserSession, TeacherTab } from '../types';

export type { TeacherTab };

interface TeacherSidebarProps {
  activeTab: TeacherTab;
  onSelectTab: (tab: TeacherTab) => void;
  session: UserSession;
  submissionsCount?: number;
  onSignOut: () => void;
  onCloseMobile?: () => void;
}

export const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  activeTab,
  onSelectTab,
  session,
  submissionsCount = 0,
  onSignOut,
  onCloseMobile,
}) => {
  const assigned = session.assignedClasses || [];

  const handleTabClick = (tab: TeacherTab) => {
    onSelectTab(tab);
    onCloseMobile?.();
  };

  return (
    <aside className="w-full md:w-72 bg-white dark:bg-[#0B0B0F] border-r border-slate-200 dark:border-[#222430] flex flex-col justify-between shrink-0 p-5 h-full md:min-h-screen overflow-y-auto relative z-20">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="pb-2 flex items-center justify-between">
          <NeurovaLogo size="md" showText={true} />
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-[#222430] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Teacher Role Badge Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0D9488]/15 dark:bg-[#14B8A6]/20 border border-[#0D9488]/30 dark:border-[#14B8A6]/30 flex items-center justify-center text-[#0D9488] dark:text-[#14B8A6]">
                <School className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] leading-tight">
                  {session.name || 'Educator Portal'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-[#9CA3AF] truncate max-w-[130px]">
                  {session.email}
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Assigned Classes Quick Count */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#222430] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#9CA3AF]">
            <span>Assigned by Admin:</span>
            <span className="font-bold text-[#0D9488] dark:text-[#14B8A6]">
              {assigned.length} Class(es)
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          {/* 1. Publish Homework */}
          <button
            onClick={() => handleTabClick('publish-hw')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'publish-hw'
                ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Send className="w-4 h-4" />
              <span>Publish Homework</span>
            </div>
            {activeTab === 'publish-hw' && (
              <span className="w-2 h-2 rounded-full bg-white dark:bg-[#0B0B0F] animate-pulse" />
            )}
          </button>

          {/* 2. Student Submissions (Live Receipt & AI Review) */}
          <button
            onClick={() => handleTabClick('submissions')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'submissions'
                ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
            }`}
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-4 h-4" />
              <span>Student Submissions</span>
            </div>
            {submissionsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0D9488]/20 dark:bg-white/20 text-white dark:text-white">
                {submissionsCount}
              </span>
            ) : activeTab === 'submissions' ? (
              <span className="w-2 h-2 rounded-full bg-white dark:bg-[#0B0B0F] animate-pulse" />
            ) : null}
          </button>

          {/* 3. Students Progress */}
          <button
            onClick={() => handleTabClick('students-progress')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'students-progress'
                ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
            }`}
          >
            <div className="flex items-center gap-3">
              <LineChart className="w-4 h-4" />
              <span>Students Progress</span>
            </div>
            {activeTab === 'students-progress' && (
              <span className="w-2 h-2 rounded-full bg-white dark:bg-[#0B0B0F] animate-pulse" />
            )}
          </button>

          {/* 4. My Assigned Classes */}
          <button
            onClick={() => handleTabClick('my-classes')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'my-classes'
                ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>My Assigned Classes</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
              {assigned.length}
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom Sign Out */}
      <div className="pt-6 border-t border-slate-200 dark:border-[#222430]">
        <button
          onClick={onSignOut}
          className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-[#222430] text-xs font-semibold text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#15161C] transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
