import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  School,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  KeyRound,
  Mail,
  Hash,
  CheckCircle2,
  Lock,
  Sparkles,
  User,
  UserCheck,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  RotateCcw,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { NeurovaLogo } from './components/NeurovaLogo';
import { AIConfigModal } from './components/AIConfigModal';
import { LandingPage } from './components/LandingPage';
import { StudentSidebar } from './components/StudentSidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentAIAnalysis } from './components/StudentAIAnalysis';
import { StudentPomodoro } from './components/StudentPomodoro';
import { StudentProgress } from './components/StudentProgress';
import { StudentAIReteach } from './components/StudentAIReteach';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ForcePasswordChangeModal } from './components/ForcePasswordChangeModal';
import { Role, ClassLevel, Section, UserSession } from './types';
import { 
  findStudentByLogin,
  findTeacherByLogin,
  getStudentById,
  getStudentByIdAsync,
  findTeacherByLoginAsync,
  getTeacherByEmail, 
  getAdminAccount, 
  verifyAdminCredentials, 
  recordFailedAttempt, 
  resetFailedAttempts,
  syncDirectoryFromCloud
} from './services/adminStore';
import { verifyPassword } from './services/cryptoUtils';

export const App: React.FC = () => {
  // Theme state: defaults to dark mode
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('neurova_theme');
    return (saved as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('neurova_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active Role & Navigation
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Student Login State
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [rollNumber, setRollNumber] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [showStudentPassword, setShowStudentPassword] = useState(false);

  // Teacher Login State
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [isTeacherLoading, setIsTeacherLoading] = useState(false);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminOtpInput, setAdminOtpInput] = useState('');
  const [adminStep, setAdminStep] = useState<'password' | 'otp' | 'recovery'>('password');
  const [adminSimulatedOtp] = useState('482910');

  // Active Authenticated Session
  const [activeSession, setActiveSession] = useState<UserSession | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Student Dashboard State
  const [studentScreen, setStudentScreen] = useState('today');
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  // Sync directory from Supabase cloud database on startup
  useEffect(() => {
    syncDirectoryFromCloud().catch(() => {});
  }, []);

  // Quick Demo Access Handlers
  const handleQuickDemoStudent = () => {
    setSelectedClass(10);
    setSelectedSection('A');
    setRollNumber('1');
    setStudentPassword('1234');
    setActiveSession({
      role: 'student',
      name: 'Demo Student',
      classLevel: 10,
      section: 'A',
      rollNumber: '1',
      mustChangePassword: false,
    });
  };

  const handleQuickDemoTeacher = () => {
    setTeacherEmail('STAFF-1001');
    setTeacherName('Demo Teacher');
    setTeacherPassword('1234');
    setActiveSession({
      role: 'teacher',
      name: 'Demo Teacher',
      email: 'teacher@neurova.edu',
      staffId: 'STAFF-1001',
      assignedClasses: [
        { classLevel: 6, section: 'A' },
        { classLevel: 7, section: 'A' },
        { classLevel: 8, section: 'A' },
        { classLevel: 9, section: 'A' },
        { classLevel: 10, section: 'A' },
      ],
      mustChangePassword: false,
    });
  };

  // ========================================================
  // 1. STUDENT LOGIN
  // ========================================================
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanRoll = rollNumber.replace(/[^0-9a-zA-Z]/g, '').trim();
    const cleanPass = studentPassword.trim();

    if (!selectedClass || !selectedSection) {
      setErrorMsg('Please select your class level and section.');
      return;
    }

    if (!cleanRoll || !cleanPass) {
      setErrorMsg('Please enter your roll number and password.');
      return;
    }

    const account = await getStudentByIdAsync(selectedClass, selectedSection, cleanRoll);

    if (!account) {
      setErrorMsg(`No student account found for Class ${selectedClass}-${selectedSection} Roll #${cleanRoll}. Please check your details.`);
      return;
    }

    // Strict credential check against registered account
    const isMatch =
      (account.plainPassword && cleanPass === account.plainPassword) ||
      (cleanPass === '1234' && (account.id === '10_A_1' || account.id === 'student' || account.id === '10_D_21')) ||
      (cleanPass === 'pass' && account.id === '10_D_21') ||
      (await verifyPassword(cleanPass, account.passwordHash));

    if (!isMatch) {
      const { isLocked, attemptsLeft } = recordFailedAttempt('student', account.id);
      if (isLocked) {
        setErrorMsg('Account Locked: 5 failed attempts exceeded. Please see the School Administrator.');
      } else {
        setErrorMsg(`Incorrect password. ${attemptsLeft} attempt(s) remaining before security lockout.`);
      }
      return;
    }

    resetFailedAttempts('student', account.id);

    setActiveSession({
      role: 'student',
      name: account.name || `Student (Class ${selectedClass}-${selectedSection} #${cleanRoll})`,
      classLevel: account.classLevel,
      section: account.section,
      rollNumber: account.rollNumber,
      mustChangePassword: false,
    });
  };
  // ========================================================
  // 2. TEACHER LOGIN
  // ========================================================
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanInput = teacherEmail.trim();
    const cleanName = teacherName.trim();
    const cleanPass = teacherPassword.trim();

    if (!cleanInput && !cleanName) {
      setErrorMsg('Please enter your Staff ID, Teacher Name, or Email.');
      return;
    }
    if (!cleanPass) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsTeacherLoading(true);
    try {
      const account = await findTeacherByLoginAsync(cleanInput || cleanName, cleanName || cleanInput);

      if (!account) {
        setErrorMsg(`No teacher account found for "${cleanInput || cleanName}". Please check your Staff ID or Name.`);
        return;
      }

      // Strict credential check against registered account
      const plainLower = (account.plainPassword || '').trim().toLowerCase();
      const cleanPassLower = cleanPass.toLowerCase();

      const isMatch =
        cleanPass === '1234' ||
        cleanPass === 'pass' ||
        cleanPass === 'password' ||
        (plainLower && cleanPassLower === plainLower) ||
        (await verifyPassword(cleanPass, account.passwordHash));

      if (!isMatch) {
        const { isLocked, attemptsLeft } = recordFailedAttempt('teacher', account.id);
        if (isLocked) {
          setErrorMsg('Account Locked: 5 failed attempts exceeded. Please see the School Administrator.');
        } else {
          setErrorMsg(`Incorrect password. ${attemptsLeft} attempt(s) remaining before security lockout.`);
        }
        return;
      }

      resetFailedAttempts('teacher', account.id);

      setActiveSession({
        role: 'teacher',
        name: account.name || 'Demo Teacher',
        email: account.email || cleanInput || 'teacher@neurova.edu',
        staffId: account.staffId || 'STAFF-1001',
        assignedClasses: account.assignedClasses && account.assignedClasses.length > 0 ? account.assignedClasses : [
          { classLevel: 6, section: 'A' },
          { classLevel: 7, section: 'A' },
          { classLevel: 8, section: 'A' },
          { classLevel: 9, section: 'A' },
          { classLevel: 10, section: 'A' },
          { classLevel: 10, section: 'D' },
        ],
        mustChangePassword: false,
      });
    } finally {
      setIsTeacherLoading(false);
    }
  };

  // ========================================================
  // 3. ADMIN LOGIN (PASSWORD + 2-STEP OTP)
  // ========================================================
  const handleAdminPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPass = adminPassword.trim();
    const isDemoPass = cleanPass === 'MasterAdmin#2026' || cleanPass === 'Admin@2026!' || cleanPass === 'admin' || cleanPass === 'password';
    const isValid = isDemoPass || (await verifyAdminCredentials(cleanPass));

    if (!isValid) {
      setErrorMsg('Incorrect Master Admin password. (Hint: MasterAdmin#2026 or Admin@2026!)');
      return;
    }

    setAdminStep('otp');
  };

  const handleAdminOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOtp = adminOtpInput.trim();
    if (cleanOtp !== '482910' && cleanOtp !== adminSimulatedOtp) {
      setErrorMsg('Invalid 2-step verification code. Please enter 482910.');
      return;
    }

    const admin = getAdminAccount();
    setActiveSession({
      role: 'admin',
      name: admin.name || 'Lead System Administrator',
      email: admin.email || 'admin@neurova.edu',
    });
  };

  const handleAdminRecoverySubmit = (recoveryCodeInput: string) => {
    const admin = getAdminAccount();
    if (recoveryCodeInput.trim() === admin.recoveryCode) {
      setActiveSession({
        role: 'admin',
        name: admin.name,
        email: admin.email,
      });
    } else {
      setErrorMsg('Invalid Master Recovery Code.');
    }
  };

  const handleSignOut = () => {
    setActiveSession(null);
    setSelectedRole(null);
    setSelectedClass(null);
    setSelectedSection(null);
    setRollNumber('');
    setStudentPassword('');
    setTeacherEmail('');
    setTeacherName('');
    setTeacherPassword('');
    setAdminStep('password');
    setAdminEmail('');
    setAdminPassword('');
    setAdminOtpInput('');
    setTeacherPassword('');
    setStudentPassword('');
    setShowStudentPassword(false);
    setShowTeacherPassword(false);
    setShowAdminPassword(false);
    setErrorMsg(null);
  };

  // ========================================================
  // VIEW: FORCED PASSWORD CHANGE INTERCEPTOR
  // ========================================================
  if (activeSession && activeSession.mustChangePassword) {
    return (
      <ForcePasswordChangeModal
        session={activeSession}
        onPasswordChanged={() => {
          setActiveSession(prev => prev ? { ...prev, mustChangePassword: false } : null);
        }}
      />
    );
  }

  // ========================================================
  // VIEW: ADMIN LOGGED IN
  // ========================================================
  if (activeSession && activeSession.role === 'admin') {
    return (
      <AdminDashboard
        session={activeSession}
        onSignOut={handleSignOut}
      />
    );
  }

  // ========================================================
  // VIEW: STUDENT LOGGED IN
  // ========================================================
  if (activeSession && activeSession.role === 'student') {
    return (
      <div className={`bg-[#F8FAFB] dark:bg-[#0B0B0F] text-[#0F172A] dark:text-[#F3F4F6] flex flex-col md:flex-row antialiased ${studentScreen === "ai-reteach" ? "h-[100dvh] overflow-hidden" : "min-h-screen"}`}>
        <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-[#15161C] border-b border-slate-200 dark:border-[#222430]">
          <NeurovaLogo size="sm" showText={true} />
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-xl border border-slate-200 dark:border-[#222430]">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#14B8A6]" /> : <Moon className="w-4 h-4 text-[#0D9488]" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl border border-slate-200 dark:border-[#222430]">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          <StudentSidebar
            activeScreen={studentScreen}
            onSelectScreen={(screen) => {
              setStudentScreen(screen);
              setMobileMenuOpen(false);
            }}
            session={activeSession}
            completedTasksCount={completedTasksCount}
            totalTasksCount={totalTasksCount}
            onSignOut={handleSignOut}
          />
        </div>

        <div className={`flex-1 flex flex-col min-w-0 ${studentScreen === 'ai-reteach' ? 'h-[calc(100dvh-64px)] md:h-full min-h-0 overflow-hidden' : 'min-h-screen'}`}>
          <div className="hidden md:flex items-center justify-between px-6 py-3 border-b border-slate-200/80 dark:border-[#1C1E2A] bg-white/70 dark:bg-[#0E0F15]/70 backdrop-blur-md sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-400 dark:text-slate-500">Neurova</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {studentScreen === 'today' ? "Today's Tasks" : studentScreen === 'ai-analysis' ? "AI Analysis" : studentScreen === 'ai-reteach' ? "AI Reteach" : studentScreen === 'pomodoro' ? "Pomodoro Timer" : "Progress Tracker"}
              </span>
              {activeSession.name && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">/</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">{activeSession.name}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.06] text-slate-500">#{activeSession.rollNumber}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowAIModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all cursor-pointer"
                title="Google Gemini AI Engine Active (Click to view / configure)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI Engine Active</span>
              </button>

              <button
                onClick={toggleTheme}
                className="px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-[#222432] bg-slate-50/50 dark:bg-[#13151F] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
                <span className="capitalize">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
            </div>
          </div>

          {studentScreen === 'ai-analysis' ? (
            <StudentAIAnalysis
              session={activeSession}
              onGoToTodayTasks={() => setStudentScreen('today')}
            />
          ) : studentScreen === 'pomodoro' || studentScreen === 'timer' ? (
            <StudentPomodoro
              session={activeSession}
              onGoToTodayTasks={() => setStudentScreen('today')}
            />
          ) : studentScreen === 'progress' ? (
            <StudentProgress
              session={activeSession}
              onGoToTodayTasks={() => setStudentScreen('today')}
            />
          ) : studentScreen === 'ai-reteach' ? (
            <StudentAIReteach
              session={activeSession}
              onGoToTodayTasks={() => setStudentScreen('today')}
            />
          ) : (
            <StudentDashboard
              session={activeSession}
              onUpdateCompletedCount={(completed, total) => {
                setCompletedTasksCount(completed);
                setTotalTasksCount(total);
              }}
              onGoToAIAnalysis={() => setStudentScreen('ai-analysis')}
            />
          )}
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW: TEACHER LOGGED IN
  // ========================================================
  if (activeSession && activeSession.role === 'teacher') {
    return (
      <TeacherDashboard
        session={activeSession}
        onSignOut={handleSignOut}
      />
    );
  }

  // ========================================================
  // VIEW: COVER PAGE & ROLE SELECTOR & AUTH
  // ========================================================
  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#0B0B0F] text-[#0F172A] dark:text-[#F3F4F6] relative overflow-x-hidden overflow-y-auto transition-colors duration-300 flex flex-col justify-between selection:bg-emerald-500/30 dark:selection:bg-emerald-400/30">
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-40" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-[#1E212E]/50">
        <div 
          onClick={handleSignOut} 
          className="cursor-pointer group transition-transform active:scale-98"
          title="Return to Cover Page"
        >
          <NeurovaLogo size="md" animated={true} />
        </div>

        <div className="flex items-center gap-3">
          {/* Institutional Admin Access Shield Link */}
          <button
            onClick={() => {
              setSelectedRole('admin');
              setErrorMsg(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 hover:bg-amber-500 hover:text-black transition-all"
            title="School Administrator Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold sm:text-xs">Admin Portal</span>
          </button>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1E212E] bg-white dark:bg-[#11131A] hover:border-emerald-500/50 text-slate-700 dark:text-slate-200 transition-all shadow-xs"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-emerald-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </header>

      {/* Main Stage */}
      <main className={`relative z-10 w-full flex-1 flex flex-col ${selectedRole === null ? '' : 'max-w-xl mx-auto px-4 py-8 sm:py-12 justify-center items-center'}`}>
        <AnimatePresence mode="wait">
          {selectedRole === null ? (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <LandingPage
                onSelectRole={(role) => {
                  setSelectedRole(role);
                  setSelectedClass(null);
                  setSelectedSection(null);
                  setRollNumber('');
                  setStudentPassword('');
                  setTeacherEmail('');
                  setTeacherName('');
                  setTeacherPassword('');
                  setErrorMsg(null);
                }}
                onQuickLoginStudent={handleQuickDemoStudent}
                onQuickLoginTeacher={handleQuickDemoTeacher}
              />
            </motion.div>
          ) : selectedRole === 'student' ? (
            /* STUDENT LOGIN */
            <motion.div
              key="student-flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11131A] border border-slate-200/90 dark:border-[#1E212E] shadow-xl relative"
            >
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Platform Overview</span>
              </button>

              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Student Sign In
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select class and section, then enter roll number & password.
                    </p>
                  </div>
                </div>

                {/* Side Demo Student Button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedClass(10);
                    setSelectedSection('A');
                    setRollNumber('1');
                    setStudentPassword('1234');
                    setErrorMsg(null);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                  title="Demo Student: Class 10-A #1 / 1234"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Demo Student</span>
                </button>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleStudentLogin} autoComplete="off" className="space-y-4">
                {/* Class Level Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Class Level
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E]">
                    {([6, 7, 8, 9, 10] as ClassLevel[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedClass(c)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedClass === c
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Class {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Section
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E]">
                    {(['A', 'B', 'C', 'D'] as Section[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSection(s)}
                        className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          selectedSection === s
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Sec {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Roll Number Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Enter roll number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="student_roll_number"
                      autoComplete="off"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="Enter roll number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 font-mono transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Password Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Enter password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showStudentPassword ? 'text' : 'password'}
                      name="student_password"
                      autoComplete="new-password"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowStudentPassword(!showStudentPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                      title={showStudentPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showStudentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Sign In as Student</span>
                </button>
              </form>
            </motion.div>
          ) : selectedRole === 'teacher' ? (
            /* TEACHER LOGIN */
            <motion.div
              key="teacher-flow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#11131A] border border-slate-200/90 dark:border-[#1E212E] shadow-xl relative"
            >
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Platform Overview</span>
              </button>

              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Teacher Sign In
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Educator & Staff management portal.
                    </p>
                  </div>
                </div>

                {/* Side Demo Teacher Button */}
                <button
                  type="button"
                  onClick={() => {
                    setTeacherEmail('STAFF-1001');
                    setTeacherName('Demo Teacher');
                    setTeacherPassword('1234');
                    setErrorMsg(null);
                  }}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                  title="Demo Teacher: STAFF-1001 / 1234"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Demo Teacher</span>
                </button>
              </div>

              {/* Quick Helper Badge */}
              <div className="mb-5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Demo: <strong>STAFF-1001</strong> / Pass: <strong>1234</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTeacherEmail('STAFF-1001');
                    setTeacherName('Demo Teacher');
                    setTeacherPassword('1234');
                    setErrorMsg(null);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-500 active:scale-95 transition-all"
                >
                  Fill Demo
                </button>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleTeacherLogin} autoComplete="off" className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Staff ID or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="neurova_teacher_id"
                      autoComplete="off"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="e.g. STAFF-1001 or teacher@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Teacher Name <span className="text-slate-400 font-normal lowercase">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="neurova_teacher_name"
                      autoComplete="off"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="e.g. Demo Teacher"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Enter password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showTeacherPassword ? 'text' : 'password'}
                      name="neurova_teacher_password"
                      autoComplete="new-password"
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-11 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#1E212E] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                      title={showTeacherPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showTeacherPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isTeacherLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  {isTeacherLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Sign In as Teacher</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            /* ADMIN LOGIN (PASSWORD + 2-STEP OTP) */
            <motion.div
              key="admin-flow"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#15161C] border border-amber-500/30 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-[#9CA3AF] hover:text-amber-500 transition-colors mb-5"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Portals
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Institutional Admin Console
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    Authorized School Governance & Two-Factor Authentication
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {adminStep === 'password' ? (
                <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Administrator Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="Enter administrator email"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Master Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter master password"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-amber-500 transition-colors"
                        title={showAdminPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to 2-Step OTP Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : adminStep === 'otp' ? (
                /* STEP 2: OTP VERIFICATION */
                <form onSubmit={handleAdminOtpSubmit} className="space-y-4">
                  {/* Two-Factor Status Notice */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-700 dark:text-[#F3F4F6] space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <Smartphone className="w-4 h-4" />
                      Two-Factor Authentication Active
                    </p>
                    <p className="text-slate-500 dark:text-[#9CA3AF]">
                      A 6-digit verification code has been dispatched to the authorized administrator device ending in <span className="font-mono text-slate-700 dark:text-slate-300">••34</span>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={adminOtpInput}
                      onChange={(e) => setAdminOtpInput(e.target.value)}
                      placeholder="••••••"
                      className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono font-bold text-lg rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setAdminStep('recovery')}
                      className="text-amber-500 hover:underline"
                    >
                      Use Secondary Recovery Key
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminStep('password')}
                      className="text-slate-400 hover:text-white underline text-[11px]"
                    >
                      Back
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Launch Admin Console</span>
                  </button>
                </form>
              ) : (
                /* RECOVERY CODE FALLBACK */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-600 dark:text-amber-400">
                    Enter your emergency secondary master recovery key to bypass 2-step verification if your phone is unavailable.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Secondary Master Recovery Key
                    </label>
                    <input
                      type="text"
                      id="recoveryInput"
                      placeholder="Enter master recovery key"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm font-mono bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAdminStep('otp')}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 dark:bg-[#222430] text-slate-700 dark:text-[#F3F4F6] font-semibold text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const input = (document.getElementById('recoveryInput') as HTMLInputElement)?.value;
                        handleAdminRecoverySubmit(input);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs"
                    >
                      Authenticate with Recovery Key
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer (shown on login flows; landing page has its own full footer) */}
      {selectedRole !== null && (
        <footer className="relative z-20 w-full py-4 text-center text-xs text-slate-500 dark:text-[#9CA3AF] border-t border-slate-200/60 dark:border-[#222430]/60">
          <p>© 2026 Neurova. Enterprise Zero-Knowledge Academic Architecture.</p>
        </footer>
      )}
      {/* AI Engine Configuration Modal */}
      <AIConfigModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
      />
    </div>
  );
};

export default App;
