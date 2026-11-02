import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  School, 
  FileText, 
  Lock, 
  Unlock, 
  RotateCcw, 
  Trash2, 
  Plus, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  ShieldAlert, 
  Search,
  Eye,
  EyeOff,
  UserCheck,
  Check,
  Smartphone,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { 
  getAllStudents, 
  getAllTeachers, 
  getAuditLogs, 
  createStudentAccount, 
  createTeacherAccount, 
  adminSetTemporaryPassword, 
  adminUnlockAccount, 
  adminDeleteAccount,
  adminUpdateTeacherClasses,
  getAdminAccount,
  syncDirectoryFromCloud
} from '../services/adminStore';
import { 
  getSupabaseConfig, 
  saveSupabaseConfig, 
  isSupabaseConfigured 
} from '../services/supabase';
import { StudentAccount, TeacherAccount, AuditLogEntry, ClassLevel, Section, AssignedClass, UserSession } from '../types';
import { NeurovaLogo } from './NeurovaLogo';

interface AdminDashboardProps {
  session: UserSession;
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  session,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'audit' | 'security'>('students');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Live Data
  const [students, setStudents] = useState<Record<string, StudentAccount>>({});
  const [teachers, setTeachers] = useState<Record<string, TeacherAccount>>({});
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Filter & Search
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(8);
  const [selectedSection, setSelectedSection] = useState<Section>('B');
  const [searchStudent, setSearchStudent] = useState('');
  const [searchTeacher, setSearchTeacher] = useState('');

  // Modals
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [isNewTeacherModalOpen, setIsNewTeacherModalOpen] = useState(false);
  const [resetModalData, setResetModalData] = useState<{ role: 'student' | 'teacher'; id: string; name: string } | null>(null);
  const [tempPasswordInput, setTempPasswordInput] = useState('');

  // New Student Form
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState<ClassLevel>(8);
  const [newStudentSection, setNewStudentSection] = useState<Section>('B');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentTempPass, setNewStudentTempPass] = useState('');

  // New Teacher Form
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherStaffId, setNewTeacherStaffId] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherTempPass, setNewTeacherTempPass] = useState('');
  const [selectedAssignedClasses, setSelectedAssignedClasses] = useState<AssignedClass[]>([
    { classLevel: 8, section: 'B' },
  ]);

  // Supabase Cloud Sync State
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(() => getSupabaseConfig().url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(() => getSupabaseConfig().anonKey);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: supabaseUrlInput.trim(),
      anonKey: supabaseKeyInput.trim(),
    });
    setIsSyncingCloud(true);
    await syncDirectoryFromCloud();
    setIsSyncingCloud(false);
    loadAllData();
    setNotification('Supabase configuration saved & cloud directory synchronized!');
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = () => {
    setStudents(getAllStudents());
    setTeachers(getAllTeachers());
    setAuditLogs(getAuditLogs());
  };

  useEffect(() => {
    loadAllData();

    const handleUpdate = () => loadAllData();
    window.addEventListener('neurova_student_directory_changed', handleUpdate);
    window.addEventListener('neurova_teacher_directory_changed', handleUpdate);
    window.addEventListener('neurova_audit_logs_changed', handleUpdate);

    return () => {
      window.removeEventListener('neurova_student_directory_changed', handleUpdate);
      window.removeEventListener('neurova_teacher_directory_changed', handleUpdate);
      window.removeEventListener('neurova_audit_logs_changed', handleUpdate);
    };
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentRoll.trim() || !newStudentTempPass.trim()) {
      alert('Please fill in all student details.');
      return;
    }

    await createStudentAccount(
      newStudentName,
      newStudentClass,
      newStudentSection,
      newStudentRoll,
      newStudentTempPass,
      session.email
    );

    setNotification(`Created verified account for ${newStudentName} (Class ${newStudentClass}-${newStudentSection} Roll #${newStudentRoll}).`);
    setSelectedClass(newStudentClass);
    setSelectedSection(newStudentSection);
    setIsNewStudentModalOpen(false);
    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentTempPass('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherStaffId.trim() || !newTeacherEmail.trim() || !newTeacherTempPass.trim()) {
      alert('Please fill in all teacher details.');
      return;
    }
    if (selectedAssignedClasses.length === 0) {
      alert('Please assign at least one class and section to this teacher.');
      return;
    }

    await createTeacherAccount(
      newTeacherName,
      newTeacherStaffId,
      newTeacherEmail,
      selectedAssignedClasses,
      newTeacherTempPass,
      session.email
    );

    setNotification(`Created verified teacher account for ${newTeacherName} (${newTeacherEmail}). Assigned ${selectedAssignedClasses.length} class(es).`);
    setIsNewTeacherModalOpen(false);
    setNewTeacherName('');
    setNewTeacherStaffId('');
    setNewTeacherEmail('');
    setNewTeacherTempPass('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleResetTempPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalData || !tempPasswordInput.trim()) return;

    await adminSetTemporaryPassword(
      resetModalData.role,
      resetModalData.id,
      tempPasswordInput.trim(),
      session.email
    );

    setNotification(`Reset temporary credentials for ${resetModalData.name}. They will be forced to choose a new private password on next login.`);
    setResetModalData(null);
    setTempPasswordInput('');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUnlock = (role: 'student' | 'teacher', id: string, name: string) => {
    adminUnlockAccount(role, id, session.email);
    setNotification(`Unlocked account for ${name} upon face-to-face verification.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDelete = (role: 'student' | 'teacher', id: string, name: string) => {
    if (confirm(`Permanently delete account for ${name}?`)) {
      adminDeleteAccount(role, id, session.email);
      setNotification(`Deleted account for ${name}.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const toggleClassAssignment = (classLevel: ClassLevel, section: Section) => {
    const exists = selectedAssignedClasses.some(c => c.classLevel === classLevel && c.section === section);
    if (exists) {
      setSelectedAssignedClasses(prev => prev.filter(c => !(c.classLevel === classLevel && c.section === section)));
    } else {
      setSelectedAssignedClasses(prev => [...prev, { classLevel, section }]);
    }
  };

  // Filtered Student List
  const filteredStudents = Object.values(students)
    .filter(s => { if (searchStudent.trim()) { const q = searchStudent.toLowerCase(); return s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.id.toLowerCase().includes(q); } return s.classLevel === selectedClass && s.section === selectedSection; })
    .sort((a, b) => parseInt(a.rollNumber) - parseInt(b.rollNumber));

  // Filtered Teacher List
  const filteredTeachers = Object.values(teachers).filter(t => {
    if (!searchTeacher.trim()) return true;
    const q = searchTeacher.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || t.staffId.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#0B0B0F] text-[#0F172A] dark:text-[#F3F4F6] flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0B0B0F] border-b border-slate-200 dark:border-[#222430] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <NeurovaLogo size="sm" showText={true} />
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#222430] bg-slate-50 dark:bg-[#15161C] text-slate-700 dark:text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar (Slide drawer on mobile, static on desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-[#0B0B0F] border-r border-slate-200 dark:border-[#222430] flex flex-col justify-between shrink-0 p-5 h-full md:min-h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:z-20 md:w-72
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-6">
          <div className="pb-2 flex items-center justify-between">
            <NeurovaLogo size="md" showText={true} />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-xl border border-slate-200 dark:border-[#222430] text-slate-500 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Identity Card */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-[#F3F4F6] leading-tight">
                  System Admin
                </p>
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-mono truncate max-w-[130px]">
                  {session.email || 'admin@neurova.edu'}
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'students'
                  ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                  : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Student Accounts</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {Object.keys(students).length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('teachers'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'teachers'
                  ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                  : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <School className="w-4 h-4" />
                <span>Teacher Accounts</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {Object.keys(teachers).length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('audit'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'audit'
                  ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                  : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Audit Log</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                {auditLogs.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#0D9488] dark:bg-gradient-to-r dark:from-[#14B8A6] dark:to-[#0D9488] text-white dark:text-[#0B0B0F] shadow-lg dark:shadow-[0_0_25px_rgba(20,184,166,0.35)]'
                  : 'text-slate-700 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#15161C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4" />
                <span>Admin Safeguards</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sign Out */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#222430]">
          <button
            onClick={onSignOut}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-[#222430] text-xs font-semibold text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-100 dark:hover:bg-[#15161C] transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Stage */}
      <div className="flex-1 min-w-0 min-h-screen flex flex-col">
        <header className="hidden md:flex px-6 sm:px-8 py-4 border-b border-slate-200 dark:border-[#222430] bg-white/60 dark:bg-[#0B0B0F]/60 backdrop-blur-sm sticky top-0 z-10 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9CA3AF]">
            <span>Admin Console</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-[#F3F4F6] capitalize">
              {activeTab === 'students' ? 'Student Profiles & Access' : activeTab === 'teachers' ? 'Teacher Staff Profiles & Classes' : activeTab === 'audit' ? 'System Audit Trail' : 'Admin Security'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Zero-Knowledge Passwords Active
            </span>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-[#0D9488] dark:text-[#14B8A6] text-sm font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{notification}</span>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 1: STUDENT MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
                    <UserCheck className="w-4 h-4" /> Face-to-Face Student Onboarding
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                    Student Directory & Access
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                    Verify school ID or class teacher confirmation in person, create their account, and set a temporary PIN.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewStudentModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Student</span>
                </button>
              </div>

              {/* Class & Section Filter */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-slate-600 dark:text-[#9CA3AF]">
                      View Class & Section:
                    </span>
                    <div className="flex items-center gap-1">
                      {([6, 7, 8, 9, 10] as ClassLevel[]).map(c => (
                        <button
                          key={c}
                          onClick={() => setSelectedClass(c)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedClass === c
                              ? 'bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F]'
                              : 'bg-slate-100 dark:bg-[#0B0B0F] text-slate-600 dark:text-[#9CA3AF]'
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      {(['A', 'B', 'C', 'D'] as Section[]).map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSection(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            selectedSection === s
                              ? 'bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F]'
                              : 'bg-slate-100 dark:bg-[#0B0B0F] text-slate-600 dark:text-[#9CA3AF]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    placeholder="Search student name or roll..."
                    className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                  />
                </div>
              </div>

              {/* Student Accounts Table */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Class {selectedClass}-{selectedSection} Enrolled Students ({filteredStudents.length})
                  </h3>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-slate-200 dark:border-[#222430] rounded-2xl space-y-2">
                    <Users className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-[#9CA3AF]">
                      No student accounts registered in Class {selectedClass}-{selectedSection}.
                    </p>
                    <button
                      onClick={() => {
                        setNewStudentClass(selectedClass);
                        setNewStudentSection(selectedSection);
                        setIsNewStudentModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F]"
                    >
                      Onboard Student for Class {selectedClass}-{selectedSection}
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-[#222430] text-slate-400 text-[11px] uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Roll</th>
                          <th className="pb-3 font-semibold">Full Name</th>
                          <th className="pb-3 font-semibold">Password Status</th>
                          <th className="pb-3 font-semibold">Security State</th>
                          <th className="pb-3 font-semibold text-right">Admin Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#222430]">
                        {filteredStudents.map(student => (
                          <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-[#0B0B0F]/40 transition-colors">
                            <td className="py-3.5 font-bold font-mono text-[#0D9488] dark:text-[#14B8A6]">
                              #{student.rollNumber}
                            </td>
                            <td className="py-3.5 font-semibold text-slate-900 dark:text-[#F3F4F6]">
                              {student.name}
                            </td>
                            <td className="py-3.5">
                              {student.mustChangePassword ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  <Clock className="w-3 h-3" /> Temporary PIN (Forced Change)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] border border-teal-500/20">
                                  <Lock className="w-3 h-3" /> Private Hash (Admin Cannot View)
                                </span>
                              )}
                            </td>
                            <td className="py-3.5">
                              {student.isLocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                                  <AlertTriangle className="w-3 h-3" /> LOCKED (5 Failed Attempts)
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Active ({student.failedAttempts}/5 attempts)
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 text-right space-x-2">
                              {student.isLocked && (
                                <button
                                  onClick={() => handleUnlock('student', student.id, student.name)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all"
                                  title="Unlock Student Account in Person"
                                >
                                  Unlock
                                </button>
                              )}

                              <button
                                onClick={() => setResetModalData({ role: 'student', id: student.id, name: `${student.name} (Roll #${student.rollNumber})` })}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] hover:border-[#0D9488] dark:hover:border-[#14B8A6] text-slate-700 dark:text-[#9CA3AF] transition-all"
                                title="Reset Temporary PIN in Person"
                              >
                                Reset PIN
                              </button>

                              <button
                                onClick={() => handleDelete('student', student.id, student.name)}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                                title="Delete Account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: TEACHER MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'teachers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
                    <School className="w-4 h-4" /> Face-to-Face Staff Onboarding
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                    Teacher Faculty Directory
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                    Verify teacher staff ID in person, assign designated classes/sections, and set their temporary onboarding password.
                  </p>
                </div>

                <button
                  onClick={() => setIsNewTeacherModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Teacher</span>
                </button>
              </div>

              {/* Teachers Table */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Authorized Faculty ({filteredTeachers.length})
                  </h3>
                  <input
                    type="text"
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    placeholder="Search teacher by name or email..."
                    className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#222430] text-slate-400 text-[11px] uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Staff ID</th>
                        <th className="pb-3 font-semibold">Teacher Name</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Assigned Classes</th>
                        <th className="pb-3 font-semibold">Security State</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#222430]">
                      {filteredTeachers.map(teacher => (
                        <tr key={teacher.id} className="hover:bg-slate-50/60 dark:hover:bg-[#0B0B0F]/40 transition-colors">
                          <td className="py-3.5 font-bold font-mono text-[#0D9488] dark:text-[#14B8A6]">
                            {teacher.staffId}
                          </td>
                          <td className="py-3.5 font-semibold text-slate-900 dark:text-[#F3F4F6]">
                            {teacher.name}
                          </td>
                          <td className="py-3.5 text-slate-600 dark:text-[#9CA3AF] font-mono text-xs">
                            {teacher.email}
                          </td>
                          <td className="py-3.5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {teacher.assignedClasses.map((ac, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/20 dark:border-[#14B8A6]/20"
                                >
                                  Class {ac.classLevel}-{ac.section}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5">
                            {teacher.isLocked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/25">
                                LOCKED
                              </span>
                            ) : teacher.mustChangePassword ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600">
                                Temporary Password
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            {teacher.isLocked && (
                              <button
                                onClick={() => handleUnlock('teacher', teacher.id, teacher.name)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white"
                              >
                                Unlock
                              </button>
                            )}

                            <button
                              onClick={() => setResetModalData({ role: 'teacher', id: teacher.id, name: `${teacher.name} (${teacher.email})` })}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] hover:border-[#0D9488] dark:hover:border-[#14B8A6] text-slate-700 dark:text-[#9CA3AF]"
                            >
                              Reset Temp Password
                            </button>

                            <button
                              onClick={() => handleDelete('teacher', teacher.id, teacher.name)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: AUDIT LOGS */}
          {/* ======================================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
                  <FileText className="w-4 h-4" /> Full Accountability Audit Trail
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                  Administrative Action Log
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                  Every account created, temporary password set, or account unlocked is recorded in an immutable chronological log to ensure misuse is 100% traceable.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-[#222430] text-slate-400 text-[11px] uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Timestamp</th>
                        <th className="pb-3 font-semibold">Action</th>
                        <th className="pb-3 font-semibold">Target Account</th>
                        <th className="pb-3 font-semibold">Details</th>
                        <th className="pb-3 font-semibold text-right">Admin Signer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#222430]">
                      {auditLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-400">
                            No administrative events logged yet.
                          </td>
                        </tr>
                      ) : (
                        auditLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-[#0B0B0F]/40 transition-colors">
                            <td className="py-3 font-mono text-slate-400 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/20">
                                {log.action}
                              </span>
                            </td>
                            <td className="py-3 font-bold font-mono text-slate-900 dark:text-[#F3F4F6]">
                              {log.targetIdentifier}
                            </td>
                            <td className="py-3 text-slate-600 dark:text-[#9CA3AF] max-w-sm">
                              {log.details}
                            </td>
                            <td className="py-3 text-right font-mono text-[11px] text-slate-400">
                              {log.adminEmail}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: ADMIN SAFEGUARDS & RECOVERY */}
          {/* ======================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-4 h-4" /> Multi-Layer School Governance
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                  Admin Safeguards & Recovery
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                  Institutional rules enforce that the administrator controls identity, while teachers and students control private content.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                    2-Step Phone Verification Active
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
                    Admin login requires password + OTP code on verified school administrator phone: <strong className="font-mono text-slate-800 dark:text-white">+1 (555) 019-2834</strong>.
                  </p>
                  <div className="pt-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5 w-fit">
                      <Check className="w-3.5 h-3.5" /> 2-Step OTP Enforced
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Secondary Admin Recovery Key
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF] leading-relaxed">
                    In the event of a lost phone or hardware failure, secondary governance can be restored using the secure institutional master recovery key:
                  </p>
                  <p className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#0B0B0F] font-mono text-xs font-bold text-amber-600 dark:text-amber-400 select-all border border-amber-500/20">
                    RECOVERY-9921-NEUROVA
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-[#F3F4F6] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                  Zero-Access Academic Privacy Guarantee
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                  The Admin console intentionally provides <strong>ZERO access</strong> to student homework answers, teacher grade evaluations, voice recordings, or private classroom communications. The administrator manages identities and access rights, while academic coursework remains strictly private between students and their assigned teachers.
                </p>
              </div>

              {/* Cloud Database (Supabase) Panel */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#222430]">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
                      <Layers className="w-5 h-5 text-emerald-500" />
                      Supabase Cloud Database Synchronization
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">
                      Sync student and teacher accounts across all devices, mobile phones, and evaluator laptops.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isSupabaseConfigured() 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured() ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      {isSupabaseConfigured() ? 'Cloud Sync Connected' : 'Local Directory Mode'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSaveSupabase} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Supabase Project URL
                      </label>
                      <input
                        type="text"
                        value={supabaseUrlInput}
                        onChange={(e) => setSupabaseUrlInput(e.target.value)}
                        placeholder="https://xyzcompany.supabase.co"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Supabase Anon / Public Key
                      </label>
                      <input
                        type="password"
                        value={supabaseKeyInput}
                        onChange={(e) => setSupabaseKeyInput(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono bg-slate-50 dark:bg-[#0B0C11] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      💡 Get your free project credentials at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-500 underline font-medium">supabase.com</a> &rarr; Project Settings &rarr; API.
                    </p>
                    <button
                      type="submit"
                      disabled={isSyncingCloud}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isSyncingCloud ? 'Syncing...' : 'Save & Sync Cloud Database'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ONBOARD NEW STUDENT */}
      <AnimatePresence>
        {isNewStudentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222430]">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Onboard Verified Student
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    Face-to-face registration (Check school ID or class teacher confirmation).
                  </p>
                </div>
                <button onClick={() => setIsNewStudentModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Liam Patel"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Class (6 to 10) *
                    </label>
                    <select
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(Number(e.target.value) as ClassLevel)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                    >
                      {[6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Section *
                    </label>
                    <select
                      value={newStudentSection}
                      onChange={(e) => setNewStudentSection(e.target.value as Section)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                    >
                      {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>Section {s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Student Roll Number *
                  </label>
                  <input
                    type="text"
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    placeholder="e.g. 15 or 32"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Temporary Password or PIN *
                  </label>
                  <input
                    type="text"
                    value={newStudentTempPass}
                    onChange={(e) => setNewStudentTempPass(e.target.value)}
                    placeholder="e.g. PIN 9281 or temp2026"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                    required
                  />
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    * The student will be forced to change this to their private password upon first login.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-[#222430] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewStudentModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F] font-bold text-xs sm:text-sm shadow-md"
                  >
                    Register Verified Student
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ONBOARD NEW TEACHER */}
      <AnimatePresence>
        {isNewTeacherModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222430]">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Onboard Verified Teacher
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    Face-to-face registration (Verify staff ID card & assign classes).
                  </p>
                </div>
                <button onClick={() => setIsNewTeacherModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Teacher Full Name *
                  </label>
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="e.g. Dr. Emily Clarke"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Staff ID Card Number *
                    </label>
                    <input
                      type="text"
                      value={newTeacherStaffId}
                      onChange={(e) => setNewTeacherStaffId(e.target.value)}
                      placeholder="e.g. STAFF-9041"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      value={newTeacherEmail}
                      onChange={(e) => setNewTeacherEmail(e.target.value)}
                      placeholder="teacher@neurova.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Assigned Classes Multi-Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Assign Classes (Teachers can only see their assigned classes) *
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">Click to assign or unassign:</p>
                  <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430]">
                    {([6, 7, 8, 9, 10] as ClassLevel[]).flatMap(c => 
                      (['A', 'B', 'C', 'D'] as Section[]).map(s => {
                        const isSelected = selectedAssignedClasses.some(ac => ac.classLevel === c && ac.section === s);
                        return (
                          <button
                            key={`${c}-${s}`}
                            type="button"
                            onClick={() => toggleClassAssignment(c, s)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border ${
                              isSelected
                                ? 'bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F] border-[#0D9488] dark:border-[#14B8A6]'
                                : 'bg-white dark:bg-[#15161C] text-slate-600 dark:text-[#9CA3AF] border-slate-200 dark:border-[#222430]'
                            }`}
                          >
                            {c}-{s}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Temporary Password *
                  </label>
                  <input
                    type="text"
                    value={newTeacherTempPass}
                    onChange={(e) => setNewTeacherTempPass(e.target.value)}
                    placeholder="e.g. Welcome2026"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                    * The teacher must change this to their private password on first login.
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-[#222430] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewTeacherModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F] font-bold text-xs sm:text-sm shadow-md"
                  >
                    Register Verified Teacher
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: IN-PERSON TEMPORARY PIN RESET (FOR FORGOT PASSWORD) */}
      <AnimatePresence>
        {resetModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222430]">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                    In-Person Credentials Reset
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    For: <strong className="text-slate-800 dark:text-white">{resetModalData.name}</strong>
                  </p>
                </div>
                <button onClick={() => setResetModalData(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Confirm this person is standing in front of you. Set a temporary PIN. When they log in, they will be forced to choose a new private password that you will not know.
              </div>

              <form onSubmit={handleResetTempPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    New Temporary PIN or Password *
                  </label>
                  <input
                    type="text"
                    value={tempPasswordInput}
                    onChange={(e) => setTempPasswordInput(e.target.value)}
                    placeholder="e.g. 841920"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-[#222430] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setResetModalData(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs sm:text-sm shadow-md"
                  >
                    Issue Temporary PIN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
