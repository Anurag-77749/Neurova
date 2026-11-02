import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  School, 
  Plus, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  BookOpen, 
  Clock, 
  Layers, 
  FileText, 
  AlertCircle,
  Users,
  Edit3,
  ClipboardList,
  Upload,
  Mic,
  Brain,
  Volume2,
  Award,
  Eye,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { UserSession, ClassLevel, Section, HomeworkQuestion, Homework, AssignedClass, StudentSubmission } from '../types';
import { 
  getStoredHomeworks, 
  publishHomework, 
  updateHomework, 
  deleteHomework, 
  getAllSubmissionsForTeacher,
  updateTeacherReview 
} from '../services/homeworkStore';
import { TeacherStudentsProgress } from './TeacherStudentsProgress';
import { getAllStudents } from '../services/adminStore';
import { TeacherSidebar, TeacherTab } from './TeacherSidebar';

interface TeacherDashboardProps {
  session: UserSession;
  onSignOut: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  session,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('publish-hw');
  const [notification, setNotification] = useState<string | null>(null);

  // Assigned classes by Admin
  const assignedClasses: AssignedClass[] = session.assignedClasses && session.assignedClasses.length > 0
    ? session.assignedClasses
    : [
        { classLevel: 8, section: 'B' },
        { classLevel: 9, section: 'A' },
      ];

  // Homework publishing & editing state
  const [publishedList, setPublishedList] = useState<Homework[]>([]);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [editingHomeworkId, setEditingHomeworkId] = useState<string | null>(null);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  
  // Scoped to assigned classes
  const [selectedTargetClassKey, setSelectedTargetClassKey] = useState<string>('ALL_ASSIGNED');
  const [hwDueDate, setHwDueDate] = useState('Today, 8:00 PM');
  const [questions, setQuestions] = useState<string[]>([
    'Define the fundamental theorem and give one real-world application.',
    'Solve for the unknowns in the given expression step-by-step.',
    'Explain the core mechanism involved in this chapter concept.',
    'Calculate the final value assuming standard environmental conditions.',
    'Summarize your observations and conclusions in 2-3 sentences.',
  ]);

  // Student Submissions State
  const [submissionsList, setSubmissionsList] = useState<StudentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const refreshHomeworkList = () => {
    const all = getStoredHomeworks();
    setPublishedList(all);
  };

  const refreshSubmissionsList = () => {
    const list = getAllSubmissionsForTeacher(assignedClasses);
    setSubmissionsList(list);
  };

  useEffect(() => {
    refreshHomeworkList();
    refreshSubmissionsList();

    const handleHwUpdate = () => refreshHomeworkList();
    const handleSubUpdate = () => refreshSubmissionsList();

    window.addEventListener('neurova_homework_changed', handleHwUpdate);
    window.addEventListener('neurova_submissions_changed', handleSubUpdate);

    return () => {
      window.removeEventListener('neurova_homework_changed', handleHwUpdate);
      window.removeEventListener('neurova_submissions_changed', handleSubUpdate);
    };
  }, []);

  const handleOpenPublishModal = () => {
    setEditingHomeworkId(null);
    setHwTitle('');
    setHwSubject('Mathematics');
    setHwDueDate('Today, 8:00 PM');
    setSelectedTargetClassKey('ALL_ASSIGNED');
    setQuestions([
      'Define the fundamental theorem and give one real-world application.',
      'Solve for the unknowns in the given expression step-by-step.',
      'Explain the core mechanism involved in this chapter concept.',
      'Calculate the final value assuming standard environmental conditions.',
      'Summarize your observations and conclusions in 2-3 sentences.',
    ]);
    setIsPublishModalOpen(true);
  };

  const handleOpenModifyModal = (hw: Homework) => {
    setEditingHomeworkId(hw.id);
    setHwTitle(hw.title);
    setHwSubject(hw.subject);
    setHwDueDate(hw.dueDate);
    if (hw.targetClass === 'ALL' || hw.targetSection === 'ALL') {
      setSelectedTargetClassKey('ALL_ASSIGNED');
    } else {
      setSelectedTargetClassKey(`${hw.targetClass}-${hw.targetSection}`);
    }
    setQuestions(hw.questions.map(q => q.question));
    setIsPublishModalOpen(true);
  };

  const handleAddQuestion = () => {
    if (questions.length >= 10) return;
    setQuestions(prev => [...prev, `Question ${prev.length + 1} text here...`]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 5) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions(prev => {
      const next = [...prev];
      next[index] = text;
      return next;
    });
  };

  const handleQuickFill = (presetSubject: string) => {
    setHwSubject(presetSubject);
    if (presetSubject === 'Mathematics') {
      setHwTitle('Quadratic Equations & Roots Practice');
      setQuestions([
        'Find the roots of the quadratic equation 2x² - 5x + 3 = 0 using the quadratic formula.',
        'State the condition for a quadratic equation to have real and equal roots.',
        'If the sum of roots is 5 and product of roots is 6, form the quadratic equation.',
        'A ball is thrown vertically upwards and its height is h(t) = -5t² + 20t. Find time to reach max height.',
        'Factorize: 6x² + 11x - 10.',
        'Prove that √2 is an irrational number by contradiction method.',
      ]);
    } else if (presetSubject === 'Science') {
      setHwTitle('Cell Structure and Cell Division Assignment');
      setQuestions([
        'Differentiate between plant cells and animal cells with at least 3 major points.',
        'What is the function of mitochondria, and why is it called the powerhouse of the cell?',
        'Describe the four distinct phases of Mitosis in sequence.',
        'Explain the role of ribosomes in cellular protein synthesis.',
        'What is osmosis? Explain what happens when a plant cell is placed in hypertonic solution.',
      ]);
    } else {
      setHwTitle('Physics: Force & Newton\'s Laws of Motion');
      setQuestions([
        'State Newton\'s First, Second, and Third Laws of Motion with mathematical expressions.',
        'A car of mass 1200 kg accelerates from rest to 20 m/s in 10 seconds. Calculate the net force applied.',
        'Explain why passengers lurch forward when a moving bus suddenly brakes.',
        'Define momentum and state the law of conservation of linear momentum.',
        'A 5 kg object is pushed with 30 N force against 10 N friction. What is its acceleration?',
      ]);
    }
  };

  const handlePublishHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) {
      alert('Please enter a homework title.');
      return;
    }

    let targetClass: ClassLevel | 'ALL' = 'ALL';
    let targetSection: Section | 'ALL' = 'ALL';

    if (selectedTargetClassKey !== 'ALL_ASSIGNED') {
      const [c, s] = selectedTargetClassKey.split('-');
      targetClass = Number(c) as ClassLevel;
      targetSection = s as Section;
    }

    const formattedQuestions: HomeworkQuestion[] = questions.map((q, idx) => ({
      id: `q_${Date.now()}_${idx}`,
      number: idx + 1,
      question: q.trim() || `Question ${idx + 1}`,
    }));

    if (editingHomeworkId) {
      updateHomework(editingHomeworkId, {
        title: hwTitle.trim(),
        subject: hwSubject,
        targetClass,
        targetSection,
        dueDate: hwDueDate,
        questions: formattedQuestions,
      });
      setNotification(`Successfully modified "${hwTitle}" (${formattedQuestions.length} questions)!`);
    } else {
      publishHomework({
        title: hwTitle.trim(),
        subject: hwSubject,
        targetClass,
        targetSection,
        teacherEmail: session.email || 'teacher@neurova.edu',
        dueDate: hwDueDate,
        questions: formattedQuestions,
      });
      setNotification(`Successfully published "${hwTitle}" (${formattedQuestions.length} questions) to students!`);
    }

    setIsPublishModalOpen(false);
    setEditingHomeworkId(null);
    refreshHomeworkList();
    setTimeout(() => setNotification(null), 4000);
    setHwTitle('');
  };

  const handleDeleteHomework = (id: string, name: string) => {
    if (confirm(`Delete assignment "${name}"?`)) {
      deleteHomework(id);
      refreshHomeworkList();
    }
  };

  const handleOpenReviewModal = (sub: StudentSubmission) => {
    setSelectedSubmission(sub);
    setGradeInput(sub.teacherGrade || '');
    setFeedbackInput(sub.teacherFeedback || '');
  };

  const handleSaveTeacherEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    updateTeacherReview(
      selectedSubmission.studentKey,
      selectedSubmission.homeworkId,
      gradeInput.trim(),
      feedbackInput.trim()
    );

    setNotification(`Successfully recorded grade & evaluation for ${selectedSubmission.studentName || 'Student'}!`);
    setSelectedSubmission(null);
    refreshSubmissionsList();
    setTimeout(() => setNotification(null), 4000);
  };

  // Student directory for counting students in assigned classes
  const allStudents = getAllStudents();

  // Filter submissions by class
  const filteredSubmissions = submissionsList.filter(sub => {
    if (selectedClassFilter === 'ALL') return true;
    const [c, s] = selectedClassFilter.split('-');
    return sub.classLevel === Number(c) && sub.section === s;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFB] dark:bg-[#0B0B0F] text-[#0F172A] dark:text-[#F3F4F6] flex flex-col md:flex-row antialiased">
      {/* Teacher Sidebar */}
      <TeacherSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        session={session}
        submissionsCount={submissionsList.length}
        onSignOut={onSignOut}
      />

      <div className="flex-1 min-w-0 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-6 sm:px-8 py-4 border-b border-slate-200 dark:border-[#222430] bg-white/60 dark:bg-[#0B0B0F]/60 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9CA3AF]">
            <span>Teacher Console</span>
            <span>/</span>
            <span className="font-semibold text-slate-900 dark:text-[#F3F4F6] capitalize">
              {activeTab === 'publish-hw'
                ? 'Publish Homework'
                : activeTab === 'submissions'
                ? 'Student Submissions'
                : 'Assigned Class Roster'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/20">
              {assignedClasses.length} Authorized Classes
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
          {/* TAB 1: PUBLISH HOMEWORK */}
          {/* ======================================================== */}
          {activeTab === 'publish-hw' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
                    <Send className="w-4 h-4" /> Academic Curriculum Publishing
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                    Publish Homework to Students
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                    Create 5 to 10 questions. Assignments appear immediately in students' "Today's Tasks" dashboard.
                  </p>
                </div>

                <button
                  onClick={handleOpenPublishModal}
                  className="px-5 py-3 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Homework</span>
                </button>
              </div>

              {/* Published Homework Table / Cards */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                    Published Assignments ({publishedList.length})
                  </h2>
                </div>

                {publishedList.length === 0 ? (
                  <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-[#F3F4F6]">No homework published yet.</p>
                    <button
                      onClick={handleOpenPublishModal}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F]"
                    >
                      Publish Your First Homework
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {publishedList.map((hw) => (
                      <div
                        key={hw.id}
                        className="p-5 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 text-[#0D9488] dark:text-[#14B8A6]">
                              {hw.subject}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                              {hw.targetClass === 'ALL' ? 'All Assigned Classes' : `Class ${hw.targetClass}`} ({hw.targetSection === 'ALL' ? 'All Sec' : `Sec ${hw.targetSection}`})
                            </span>
                          </div>

                          <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                            {hw.title}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#9CA3AF]">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {hw.questions.length} Questions
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Due: {hw.dueDate}
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-[#222430] flex items-center justify-between">
                          <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Live in Student "Today's Tasks"
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModifyModal(hw)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0D9488]/10 hover:bg-[#0D9488]/20 dark:bg-[#14B8A6]/15 dark:hover:bg-[#14B8A6]/25 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/20 transition-all shadow-sm"
                              title="Modify homework questions and settings"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Modify</span>
                            </button>

                            <button
                              onClick={() => handleDeleteHomework(hw.id, hw.title)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                              title="Remove Homework"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: STUDENT HOMEWORK SUBMISSIONS (RECEIVED LIVE) */}
          {/* ======================================================== */}
          {activeTab === 'submissions' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
                    <ClipboardList className="w-4 h-4" /> Live Submissions Feed
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                    Student Homework Submissions
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                    Review student written solutions, uploaded worksheet photos, voice concept recordings, and AI line-by-line analyses.
                  </p>
                </div>

                {/* Scoped Class Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Filter Class:</span>
                  <select
                    value={selectedClassFilter}
                    onChange={(e) => setSelectedClassFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-800 dark:text-[#F3F4F6] focus:outline-none"
                  >
                    <option value="ALL">All Authorized Classes</option>
                    {assignedClasses.map((ac, idx) => (
                      <option key={idx} value={`${ac.classLevel}-${ac.section}`}>
                        Class {ac.classLevel}-{ac.section}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
                  <ClipboardList className="w-12 h-12 mx-auto text-slate-400" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-[#F3F4F6]">
                    No Submissions Received Yet
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF] max-w-md mx-auto">
                    When students in your assigned classes submit their solutions, attachments, and voice explanations, they will appear here instantly.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSubmissions.map((sub, idx) => {
                    const attachmentsCount = sub.attachments?.length || 0;
                    const hasVoice = Boolean(sub.voiceExplanation?.audioUrl || sub.voiceExplanation?.transcript);
                    const aiScore = sub.aiAnalysis?.overallScore;

                    return (
                      <div
                        key={sub.id || idx}
                        className="p-5 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]">
                              Class {sub.classLevel}-{sub.section} • Roll #{sub.rollNumber}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : 'Today'}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                              {sub.studentName || 'Student'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                              Assignment: <strong className="text-slate-700 dark:text-slate-300">{sub.homeworkTitle || 'Homework Task'}</strong>
                            </p>
                          </div>

                          {/* Submission Highlights & Badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                            {attachmentsCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] font-semibold text-[11px]">
                                <Upload className="w-3 h-3" />
                                {attachmentsCount} Worksheet(s)
                              </span>
                            )}
                            {hasVoice && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] font-semibold text-[11px]">
                                <Mic className="w-3 h-3" />
                                Voice Explanation
                              </span>
                            )}
                            {aiScore !== undefined && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                <Brain className="w-3 h-3" />
                                AI: {aiScore}% Mastery
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-[#222430] flex items-center justify-between">
                          <div>
                            {sub.teacherGrade ? (
                              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                Grade: {sub.teacherGrade}
                              </span>
                            ) : (
                              <span className="text-[11px] text-amber-500 font-semibold">
                                Pending Teacher Review
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenReviewModal(sub)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-xs shadow transition-all flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review & Grade Work</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: STUDENTS PROGRESS (CLASS MATRIX & INTERVENTION) */}
          {/* ======================================================== */}
          {activeTab === 'students-progress' && (
            <TeacherStudentsProgress
              session={session}
              onAssignHomeworkTab={() => {
                setActiveTab('publish-hw');
                handleOpenPublishModal();
              }}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 4: MY ASSIGNED CLASSES */}
          {/* ======================================================== */}
          {activeTab === 'my-classes' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
                  <Layers className="w-4 h-4" /> Institutional Scope
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
                  My Assigned Classes ({assignedClasses.length})
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-1">
                  As configured by the School Administrator, you are authorized to publish homework and teach in these specific classes:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {assignedClasses.map((ac, idx) => {
                  const enrolledCount = Object.values(allStudents).filter(
                    s => s.classLevel === ac.classLevel && s.section === ac.section
                  ).length;

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-10 h-10 rounded-2xl bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6] font-bold text-sm flex items-center justify-center">
                          {ac.classLevel}{ac.section}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          Authorized
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                          Class {ac.classLevel} — Section {ac.section}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-[#9CA3AF] flex items-center gap-1 mt-1">
                          <Users className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                          <span>{enrolledCount} enrolled students registered</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* REVIEW & GRADING MODAL FOR TEACHER */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222430]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6]">
                    Submission Review & Grading
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">
                    {selectedSubmission.studentName} (Class {selectedSubmission.classLevel}-{selectedSubmission.section} • Roll #{selectedSubmission.rollNumber})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    Assignment: {selectedSubmission.homeworkTitle}
                  </p>
                </div>
                <button onClick={() => setSelectedSubmission(null)} className="p-1.5 text-slate-400 hover:text-white">✕</button>
              </div>

              {/* SECTION 1: QUESTION ANSWERS */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F3F4F6] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                  Student Written Solutions
                </h4>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {Object.keys(selectedSubmission.answers).length === 0 ? (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-xs text-slate-500 italic">
                      Student submitted handwritten solution notes & worksheet image directly for AI Vision verification. See attached worksheet photo and AI report below.
                    </div>
                  ) : (
                    Object.entries(selectedSubmission.answers).map(([qId, ans], idx) => (
                      <div key={qId} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] space-y-1 text-xs">
                        <span className="font-bold text-[#0D9488] dark:text-[#14B8A6]">Question #{idx + 1}:</span>
                        <p className="font-mono text-slate-800 dark:text-[#F3F4F6]">{ans || '(No written answer)'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 2: UPLOADED WORKSHEETS / PHOTOS */}
              {selectedSubmission.attachments && selectedSubmission.attachments.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#222430]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F3F4F6] flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                    Uploaded Worksheet Photos / Files ({selectedSubmission.attachments.length})
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {selectedSubmission.attachments.map((att, i) => (
                      <div
                        key={i}
                        onClick={() => att.type.startsWith('image/') ? setPreviewImage(att.dataUrl) : window.open(att.dataUrl, '_blank')}
                        className="cursor-pointer p-2 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] hover:border-[#0D9488] transition-all"
                      >
                        {att.type.startsWith('image/') ? (
                          <div className="h-20 w-full rounded-lg overflow-hidden bg-black/20 mb-1">
                            <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-20 w-full rounded-lg bg-teal-500/10 flex items-center justify-center text-[#0D9488] mb-1">
                            <FileText className="w-8 h-8" />
                          </div>
                        )}
                        <p className="text-[10px] font-semibold truncate text-slate-700 dark:text-slate-300">{att.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 3: VOICE EXPLANATION */}
              {selectedSubmission.voiceExplanation && (selectedSubmission.voiceExplanation.audioUrl || selectedSubmission.voiceExplanation.transcript) && (
                <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#222430]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F3F4F6] flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                    Voice Concept Explanation
                  </h4>
                  {selectedSubmission.voiceExplanation.audioUrl && (
                    <audio controls src={selectedSubmission.voiceExplanation.audioUrl} className="w-full h-9" />
                  )}
                  {selectedSubmission.voiceExplanation.transcript && (
                    <p className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-xs text-slate-700 dark:text-[#F3F4F6] italic">
                      "{selectedSubmission.voiceExplanation.transcript}"
                    </p>
                  )}
                </div>
              )}

              {/* SECTION 4: AI DIAGNOSTIC REPORT OVERVIEW */}
              {selectedSubmission.aiAnalysis && (
                <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F3F4F6]">
                        AI Diagnostic Summary & Vision Inspection
                      </h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0D9488]/15 text-[#0D9488] dark:text-[#14B8A6]">
                      {selectedSubmission.aiAnalysis.overallScore}% Mastery
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-[#9CA3AF]">
                    {selectedSubmission.aiAnalysis.overallSummary}
                  </p>

                  {/* Solution Notes Vision Findings */}
                  {selectedSubmission.aiAnalysis.solutionNotesAnalysis && (
                    <div className="p-3 rounded-xl bg-white/60 dark:bg-[#0B0B0F]/60 border border-teal-500/15 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Worksheet Vision Analysis: {selectedSubmission.aiAnalysis.solutionNotesAnalysis.analyzedPagesCount} Page(s) Verified
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Rigor: {selectedSubmission.aiAnalysis.solutionNotesAnalysis.derivationRigorScore}% • Legibility: {selectedSubmission.aiAnalysis.solutionNotesAnalysis.legibility}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-[#9CA3AF]">
                        {selectedSubmission.aiAnalysis.solutionNotesAnalysis.pedagogicalRemarks}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedSubmission.aiAnalysis.evaluations.map((ev, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          ev.category === 'strong'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : ev.category === 'average'
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                            : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {ev.topic}: {ev.category.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: TEACHER GRADING & FEEDBACK */}
              <form onSubmit={handleSaveTeacherEvaluation} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                  Teacher Evaluation & Marks
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Grade / Marks (e.g. A+, 95/100)
                    </label>
                    <input
                      type="text"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      placeholder="e.g. A+"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#15161C] border border-slate-300 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] font-bold"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Teacher Feedback Remarks
                    </label>
                    <input
                      type="text"
                      value={feedbackInput}
                      onChange={(e) => setFeedbackInput(e.target.value)}
                      placeholder="e.g. Excellent conceptual explanation and clean handwriting!"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#15161C] border border-slate-300 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F] font-bold text-xs shadow"
                  >
                    Save Teacher Evaluation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* IMAGE PREVIEW LIGHTBOX */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 text-white font-bold text-sm bg-black/50 p-2 rounded-full"
              >
                ✕ Close
              </button>
              <img src={previewImage} alt="Worksheet" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* PUBLISH HOMEWORK MODAL */}
      <AnimatePresence>
        {isPublishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#222430]">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">
                    {editingHomeworkId ? 'Modify Published Homework' : 'Publish Homework (5 to 10 Questions)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                    {editingHomeworkId
                      ? 'Edit assignment questions, title, or due date. Changes sync live to students.'
                      : 'Scoped strictly to your assigned classes.'}
                  </p>
                </div>
                <button onClick={() => setIsPublishModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">✕</button>
              </div>

              {/* Quick Template Fill Buttons */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-[#9CA3AF] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                  Presets:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickFill('Mathematics')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#15161C] border border-slate-300 dark:border-[#222430] text-slate-800 dark:text-white"
                >
                  Math (6 Questions)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('Science')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#15161C] border border-slate-300 dark:border-[#222430] text-slate-800 dark:text-white"
                >
                  Science (5 Questions)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('Physics')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-[#15161C] border border-slate-300 dark:border-[#222430] text-slate-800 dark:text-white"
                >
                  Physics (5 Questions)
                </button>
              </div>

              <form onSubmit={handlePublishHomework} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={hwSubject}
                      onChange={(e) => setHwSubject(e.target.value)}
                      placeholder="e.g. Mathematics"
                      className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                      Due Date & Time
                    </label>
                    <input
                      type="text"
                      value={hwDueDate}
                      onChange={(e) => setHwDueDate(e.target.value)}
                      placeholder="e.g. Today, 8:00 PM"
                      className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Homework Title / Topic
                  </label>
                  <input
                    type="text"
                    value={hwTitle}
                    onChange={(e) => setHwTitle(e.target.value)}
                    placeholder="e.g. Practice Set: Quadratic Equations"
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                    required
                  />
                </div>

                {/* Scoped Target Class Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1">
                    Target Class (Authorized by Admin)
                  </label>
                  <select
                    value={selectedTargetClassKey}
                    onChange={(e) => setSelectedTargetClassKey(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none"
                  >
                    <option value="ALL_ASSIGNED">All My Assigned Classes ({assignedClasses.map(c => `${c.classLevel}${c.section}`).join(', ')})</option>
                    {assignedClasses.map((ac, idx) => (
                      <option key={idx} value={`${ac.classLevel}-${ac.section}`}>
                        Class {ac.classLevel} - Section {ac.section}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider">
                      Questions ({questions.length} of 10 max, 5 min)
                    </label>
                    {questions.length < 10 && (
                      <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="text-xs font-bold text-[#0D9488] dark:text-[#14B8A6] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Question
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {questions.map((q, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-[#0B0B0F] text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={q}
                          onChange={(e) => handleQuestionTextChange(idx, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6]"
                          required
                        />
                        {questions.length > 5 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#222430] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublishModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-[#222430] text-xs font-semibold text-slate-600 dark:text-[#9CA3AF]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0D9488] dark:bg-[#14B8A6] text-white dark:text-[#0B0B0F] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
                  >
                    {editingHomeworkId ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Publish Homework</span>
                      </>
                    )}
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

export default TeacherDashboard;
