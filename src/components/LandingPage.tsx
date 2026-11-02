import React from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  School, 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Mic, 
  Layers, 
  Lock, 
  BookOpen, 
  Zap, 
  BarChart3, 
  Eye, 
  Atom, 
  Calculator, 
  Dna, 
  FlaskConical,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { NeurovaLogo } from './NeurovaLogo';

interface LandingPageProps {
  onSelectRole: (role: 'student' | 'teacher') => void;
  onQuickLoginStudent: () => void;
  onQuickLoginTeacher: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onQuickLoginStudent,
  onQuickLoginTeacher,
}) => {
  return (
    <div className="w-full flex flex-col space-y-24 sm:space-y-32 py-4">
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 text-center flex flex-col items-center">
        {/* Adaptive Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0D9488]/10 dark:bg-[#14B8A6]/10 border border-[#0D9488]/20 dark:border-[#14B8A6]/20 text-[#0D9488] dark:text-[#14B8A6] mb-6 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Adaptive Educational Intelligence
        </div>

        {/* Animated Infinity Neurova Logo */}
        <div className="mb-6">
          <NeurovaLogo size="xl" showText={false} animated={true} />
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-[#F3F4F6] mb-4">
          NEURO<span className="text-[#0D9488] dark:text-[#14B8A6]">VA</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-base sm:text-lg text-slate-600 dark:text-[#9CA3AF] mb-10 leading-relaxed font-normal">
          Next-generation learning platform. Select your portal to begin your personalized academic experience.
        </p>

        {/* Dual Interactive Portal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl mb-8">
          {/* Student Portal Card */}
          <div
            onClick={() => onSelectRole('student')}
            className="group relative p-6 rounded-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] hover:border-[#0D9488] dark:hover:border-[#14B8A6] shadow-md hover:shadow-xl dark:shadow-none transition-all flex flex-col items-start text-left cursor-pointer overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 border border-[#0D9488]/20 dark:border-[#14B8A6]/25 flex items-center justify-center text-[#0D9488] dark:text-[#14B8A6] mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between w-full mb-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6] group-hover:text-[#0D9488] dark:group-hover:text-[#14B8A6] transition-colors">
                Student
              </h3>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
              Access Classes 6 to 10, coursework, and today's assigned tasks.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#222430] w-full flex items-center text-[11px] font-semibold text-[#0D9488] dark:text-[#14B8A6]">
              <span>Enter Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>

          {/* Teacher Portal Card */}
          <div
            onClick={() => onSelectRole('teacher')}
            className="group relative p-6 rounded-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] hover:border-[#0D9488] dark:hover:border-[#14B8A6] shadow-md hover:shadow-xl dark:shadow-none transition-all flex flex-col items-start text-left cursor-pointer overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 border border-[#0D9488]/20 dark:border-[#14B8A6]/25 flex items-center justify-center text-[#0D9488] dark:text-[#14B8A6] mb-4 group-hover:scale-110 transition-transform">
              <School className="w-6 h-6" />
            </div>
            <div className="flex items-center justify-between w-full mb-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6] group-hover:text-[#0D9488] dark:group-hover:text-[#14B8A6] transition-colors">
                Teacher
              </h3>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0D9488] dark:group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
              Publish homework (5-10 questions) and oversee your assigned classes.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#222430] w-full flex items-center text-[11px] font-semibold text-[#0D9488] dark:text-[#14B8A6]">
              <span>Enter Teacher Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </div>
        </div>

        {/* 1-Click Quick Demo Pill Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl w-full text-xs text-slate-500 dark:text-[#9CA3AF]">
          <span className="font-medium text-[11px]">⚡ Quick Demo:</span>
          <button
            type="button"
            onClick={onQuickLoginStudent}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold transition-all flex items-center gap-1.5"
          >
            <span>Demo Student (student / 1234)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={onQuickLoginTeacher}
            className="px-3 py-1.5 rounded-lg bg-slate-200/60 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-300/60 dark:border-[#222430] text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-all flex items-center gap-1.5"
          >
            <span>Demo Teacher (teacher@neurova.edu / 1234)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Scroll Down Indicator */}
        <div className="pt-10 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Explore Platform Architecture & Highlights</span>
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-emerald-500 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. LIVE METRICS & CAPABILITIES BANNER                     */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-50/70 dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E]">
          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              100%
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Real Vision Inspection
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Zero fake analysis. Direct transcription of handwritten mathematical steps.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              4 Disciplines
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Secondary Scope
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Mathematics, Physics, Chemistry, and Biology aligned with CBSE & NCERT.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              3 Pacing Speeds
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Rhythmic Teleprompter
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Synchronized word-by-word ticker with 1x, 1.25x, and 1.5x pacing options.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              Class Isolation
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Zero-Knowledge Privacy
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Strict multi-tenant security ensuring student data remains private.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. THREE CORE PILLARS SHOWCASE                            */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Platform Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Engineered for Academic Precision
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Every feature is purpose-built to eliminate guesswork, streamline teacher oversight, and deepen student conceptual mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PILLAR 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Handwritten Vision Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Students upload photos of their notebook solutions or PDFs. Gemini AI Vision transcribes their actual equations line-by-line, verifies formula substitutions, and audits mathematical rigor.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151722] border border-slate-200/70 dark:border-[#1E2130] text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
              <div className="text-emerald-500 font-semibold">✓ Detected in Notes:</div>
              <div>• ax² + bx + c = 0</div>
              <div>• D = b² - 4ac (Discriminant)</div>
              <div>• Verified Roots & Step Rigor</div>
            </div>
          </div>

          {/* PILLAR 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                AI Voice Tutor & Teleprompter
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adaptive speech synthesis breaks down difficult scientific and mathematical topics aloud. A live rhythmic word ticker highlights concepts in real time as they are spoken.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151722] border border-slate-200/70 dark:border-[#1E2130] text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
              <div className="text-emerald-500 font-semibold">✓ Teleprompter Modes:</div>
              <div>• 1-Click Task Explanation</div>
              <div>• Detailed Subject Summary</div>
              <div>• 10 Revision Flashcards</div>
            </div>
          </div>

          {/* PILLAR 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Unified Educator Command Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Teachers publish 5 to 10 questions to specific classes with one click. Submitted student notebooks appear immediately in a high-res lightbox alongside pre-computed AI diagnostic scores.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#151722] border border-slate-200/70 dark:border-[#1E2130] text-[11px] font-mono text-slate-600 dark:text-slate-300 space-y-1">
              <div className="text-emerald-500 font-semibold">✓ Educator Features:</div>
              <div>• Lightbox Worksheet Preview</div>
              <div>• AI Line-by-Line Critique Audit</div>
              <div>• 1-Click Grade & Feedback Record</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. SECONDARY CURRICULUM COVERAGE                         */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Curriculum Alignment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Comprehensive Secondary Scope (Classes 6 – 10)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Rigorous NCERT & CBSE aligned question banks and concept models covering all core academic disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* MATHEMATICS */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mathematics</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Quadratic Equations, Polynomials, Coordinate Geometry, Trigonometry, and Surface Areas.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-100 dark:border-[#1E212E]">
              ax² + bx + c = 0
            </div>
          </div>

          {/* PHYSICS */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <Atom className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Physics</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Kinematics, Light: Reflection & Refraction, Ohm's Law, Electricity, and Magnetic Effects.
              </p>
            </div>
            <div className="text-[10px] font-mono text-sky-600 dark:text-sky-400 pt-1 border-t border-slate-100 dark:border-[#1E212E]">
              1/f = 1/v - 1/u • V = IR
            </div>
          </div>

          {/* CHEMISTRY */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Chemistry</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Chemical Reactions & Equations, Acids, Bases & Salts, Metals & Non-metals, Carbon Compounds.
              </p>
            </div>
            <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 pt-1 border-t border-slate-100 dark:border-[#1E212E]">
              2H₂ + O₂ → 2H₂O
            </div>
          </div>

          {/* BIOLOGY */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] space-y-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-500 flex items-center justify-center">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Biology</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Life Processes (Nutrition, Respiration, Circulation, Excretion), Control, Reproduction & Heredity.
              </p>
            </div>
            <div className="text-[10px] font-mono text-teal-600 dark:text-teal-400 pt-1 border-t border-slate-100 dark:border-[#1E212E]">
              6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. INSTITUTIONAL SECURITY & ZERO-LEAKAGE PRIVACY         */}
      {/* ======================================================== */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-[#12141F] text-white border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Lock className="w-3 h-3" />
                Enterprise Grade Privacy
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Built with Zero-Knowledge Academic Boundaries
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Student and educator accounts are isolated by strict class and section filters. Private LLM API credentials are fundamentally masked from students, ensuring an institutional-safe environment for schools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                type="button"
                onClick={onQuickLoginStudent}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Student Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onQuickLoginTeacher}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Launch Teacher Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. INSTITUTIONAL FOOTER                                  */}
      {/* ======================================================== */}
      <footer className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8 border-t border-slate-200/80 dark:border-[#1E212E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <NeurovaLogo size="sm" showText={true} />
          <span className="text-slate-400">•</span>
          <span>Secondary Academic Operating System</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            All Academic Nodes Operational
          </span>
          <span className="text-slate-400">•</span>
          <span>AY 2026-27</span>
        </div>
      </footer>
    </div>
  );
};
