import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Mic, 
  FileText, 
  ArrowRight, 
  TrendingUp, 
  Clock,
  Layers,
  ChevronRight,
  Upload,
  Eye,
  Check,
  FileCheck,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { UserSession, AIAnalysisReport, StudentSubmission, SolutionAttachment } from '../types';
import { getAIAnalysisReports, getStudentSubmissions, saveStudentSubmission } from '../services/homeworkStore';
import { generateAIAnalysis } from '../services/aiAnalysisService';
import { getActiveAIConfig } from '../services/realAIService';

interface StudentAIAnalysisProps {
  session: UserSession;
  onGoToTodayTasks: () => void;
}

export const StudentAIAnalysis: React.FC<StudentAIAnalysisProps> = ({
  session,
  onGoToTodayTasks,
}) => {
  const studentKey = `${session.classLevel}_${session.section}_${session.rollNumber}`;
  const [reports, setReports] = useState<AIAnalysisReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'strong' | 'average' | 'weak'>('all');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, StudentSubmission>>({});
  const [isAIConfigOpen, setIsAIConfigOpen] = useState<boolean>(false);
  const [aiConfig, setAiConfig] = useState(() => getActiveAIConfig());
  const [isReevaluating, setIsReevaluating] = useState<boolean>(false);
  const [isUploadingNotes, setIsUploadingNotes] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadReportsAndHeal = async () => {
    const subs = getStudentSubmissions(studentKey);
    setSubmissionsMap(subs);
    const list = getAIAnalysisReports(studentKey);
    setReports(list);
    if (list.length > 0 && (!selectedReportId || !list.some(r => r.id === selectedReportId))) {
      setSelectedReportId(list[0].id);
    }
  };

  useEffect(() => {
    loadReportsAndHeal();
    const handleUpdate = () => loadReportsAndHeal();
    window.addEventListener('neurova_submissions_changed', handleUpdate);
    return () => window.removeEventListener('neurova_submissions_changed', handleUpdate);
  }, [studentKey]);

  const handleReevaluateActiveReport = async () => {
    if (!activeReport || !activeSubmission) return;
    setIsReevaluating(true);
    try {
      const homeworkObj = {
        id: activeSubmission.homeworkId,
        title: activeSubmission.homeworkTitle || 'Homework Assignment',
        subject: activeSubmission.subject || 'Science',
        targetClass: activeSubmission.classLevel || 'ALL',
        targetSection: activeSubmission.section || 'ALL',
        teacherEmail: 'teacher@neurova.edu',
        dueDate: 'Today',
        createdAt: new Date().toISOString(),
        questions: activeReport.lineByLineAnalysis.map((l) => ({
          id: `q${l.questionNumber}`,
          number: l.questionNumber,
          question: l.questionText
        }))
      };

      const updated = await generateAIAnalysis({
        homework: homeworkObj as any,
        answers: activeSubmission.answers,
        attachments: activeSubmission.attachments,
        voiceExplanation: activeSubmission.voiceExplanation,
        studentName: session.name,
        studentKey,
      });

      saveStudentSubmission({
        ...activeSubmission,
        aiAnalysis: updated,
      });
      await loadReportsAndHeal();
    } catch (err) {
      console.error('Re-evaluation error:', err);
    } finally {
      setIsReevaluating(false);
    }
  };

  
  const handleClearOldDemoReports = () => {
    if (confirm('Clear previous demo submissions to start fresh?')) {
      const raw = localStorage.getItem('neurova_student_submissions');
      if (raw) {
        try {
          const all = JSON.parse(raw);
          delete all[studentKey];
          localStorage.setItem('neurova_student_submissions', JSON.stringify(all));
          window.dispatchEvent(new Event('neurova_submissions_changed'));
          setReports([]);
          setSelectedReportId(null);
        } catch (e) {}
      }
    }
  };

  const handleUploadAndAnalyzeNotes = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingNotes(true);
    try {
      const attachments: SolutionAttachment[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        attachments.push({
          name: file.name,
          type: file.type || 'image/jpeg',
          size: file.size,
          dataUrl
        });
      }

      // Generate analysis directly with Gemini Vision on the uploaded notes
      const homeworkObj = {
        id: `custom_notes_${Date.now()}`,
        title: 'Handwritten Notes & Worksheet Verification',
        subject: 'Mathematics',
        targetClass: session.classLevel || 'ALL',
        targetSection: session.section || 'ALL',
        teacherEmail: 'teacher@neurova.edu',
        dueDate: 'Today',
        createdAt: new Date().toISOString(),
        questions: [
          { id: 'q1', number: 1, question: 'Detailed Mathematical & Scientific Working Transcribed from Uploaded Notes' },
          { id: 'q2', number: 2, question: 'Governing Formulas, Steps & Intermediate Equations' },
          { id: 'q3', number: 3, question: 'Final Evaluation, Calculation Accuracy & Conceptual Rigor' }
        ]
      };

      const aiReport = await generateAIAnalysis({
        homework: homeworkObj as any,
        answers: {
          q1: 'Handwritten steps and working in attached solution notes image.',
          q2: 'Formulas applied in uploaded worksheet.',
          q3: 'Result and calculations shown in notes.'
        },
        attachments,
        studentName: session.name,
        studentKey,
      });

      // Save submission
      saveStudentSubmission({
        studentKey,
        homeworkId: homeworkObj.id,
        homeworkTitle: aiReport.evaluations[0]?.topic || 'Handwritten Notes Analysis',
        subject: aiReport.evaluations[0]?.topic?.toLowerCase().includes('physic') ? 'Physics' : 'Mathematics',
        studentName: session.name,
        classLevel: session.classLevel,
        section: session.section,
        rollNumber: session.rollNumber,
        answers: {},
        attachments,
        aiAnalysis: aiReport,
        status: 'submitted'
      });

      setSelectedReportId(aiReport.id);
      await loadReportsAndHeal();
    } catch (err) {
      console.error('Notes vision analysis error:', err);
      alert('Error analyzing notes. Please verify your connection.');
    } finally {
      setIsUploadingNotes(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const activeSubmission = activeReport ? submissionsMap[activeReport.homeworkId] : undefined;

  if (reports.length === 0) {
    return (
      <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="p-8 sm:p-12 text-center rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-xl bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 border border-[#0D9488]/20 dark:border-[#14B8A6]/25 flex items-center justify-center text-[#0D9488] dark:text-[#14B8A6] mx-auto">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
              No AI Diagnostic Reports Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] max-w-md mx-auto mt-1">
              Submit your homework solutions and record your voice concept explanation in <strong>Today's Tasks</strong>. The AI will evaluate your answers line-by-line, analyze your uploaded solution notes, and generate your comprehensive topic report here.
            </p>
          </div>
          <button
            onClick={onGoToTodayTasks}
            className="px-6 py-3 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Go to Today's Tasks & Submit Work</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const strongCount = activeReport.evaluations.filter(e => e.category === 'strong').length;
  const averageCount = activeReport.evaluations.filter(e => e.category === 'average').length;
  const weakCount = activeReport.evaluations.filter(e => e.category === 'weak').length;

  const filteredEvaluations = activeCategoryFilter === 'all'
    ? activeReport.evaluations
    : activeReport.evaluations.filter(e => e.category === activeCategoryFilter);

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1E212E]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1.5 mb-1">
            <Brain className="w-4 h-4" />
            AI Line-by-Line Academic Diagnostic & Vision Analysis
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
            Topic Analysis & Mastery Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-0.5">
            Holistic AI evaluation of your written answers, uploaded handwritten solution notes, and verbal concept explanation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadAndAnalyzeNotes}
            className="hidden"
          />

          <button
            onClick={onGoToTodayTasks}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1E212E] transition-all flex items-center gap-1.5"
            title="Back to Today's Tasks"
          >
            <span>← Today's Tasks</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingNotes}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            title="Upload handwritten notebook photo to analyze with Gemini Vision"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingNotes ? 'AI Vision Analyzing...' : 'Upload Notes for AI Vision'}</span>
          </button>

          {activeReport && activeSubmission && (
            <button
              onClick={handleReevaluateActiveReport}
              disabled={isReevaluating}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0D9488]/10 hover:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/25 transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Re-run AI evaluation on this submission"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReevaluating ? 'animate-spin' : ''}`} />
              <span>{isReevaluating ? 'Re-Evaluating...' : 'Re-Analyze'}</span>
            </button>
          )}

          {reports.length > 0 && (
            <select
              value={selectedReportId || ''}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] text-slate-800 dark:text-[#F3F4F6] focus:outline-none"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.homeworkTitle} ({r.subject})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handleClearOldDemoReports}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] text-slate-400 hover:text-rose-500 transition-all border border-slate-200 dark:border-[#1E212E]"
            title="Clear old demo submissions"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* OVERALL PERFORMANCE CARD - Clean Linear/Raycast Style */}
      <div className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {activeReport.subject}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {new Date(activeReport.analyzedAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeReport.homeworkTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {activeReport.overallSummary}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 bg-slate-50/70 dark:bg-[#161824] p-3.5 rounded-xl border border-slate-200/80 dark:border-[#222536] shrink-0">
            <div className="text-center px-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mastery</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                {activeReport.overallScore}%
              </p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-[#252838]" />
            <div className="flex flex-col gap-1 text-[11px] font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {strongCount} Strong
              </span>
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {averageCount} Average
              </span>
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {weakCount} Needs Work
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: TOPIC MASTERY DISTRIBUTION (STRONG / AVERAGE / WEAK) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0D9488] dark:text-[#14B8A6]" />
              Topic Breakdown by Mastery Level
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
              Categorized into Strong, Average, and Weak with personalized instructions on what to improve.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] rounded-xl text-xs font-semibold">
            {(['all', 'strong', 'average', 'weak'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  activeCategoryFilter === cat
                    ? 'bg-white dark:bg-[#0B0B0F] text-[#0D9488] dark:text-[#14B8A6] shadow-sm font-bold'
                    : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredEvaluations.map((ev, idx) => {
            const isStrong = ev.category === 'strong';
            const isAvg = ev.category === 'average';

            return (
              <div
                key={idx}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                  isStrong
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20'
                    : isAvg
                    ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20'
                    : 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isStrong
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : isAvg
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isStrong ? <CheckCircle2 className="w-4 h-4" /> : isAvg ? <AlertTriangle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isStrong
                          ? 'bg-emerald-500 text-white'
                          : isAvg
                          ? 'bg-amber-500 text-black'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {ev.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                    {ev.topic}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                    {ev.finding}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-[#F3F4F6] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                    What to Improve:
                  </p>
                  <p className="text-xs text-slate-600 dark:text-[#9CA3AF] font-medium">
                    {ev.improvementTip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: UPLOADED SOLUTION NOTES & WORKSHEET ANALYSIS */}
      <section className="p-6 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-[#1E212E] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D9488]/15 dark:bg-[#14B8A6]/20 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
                <span>Uploaded Solution Notes & Handwritten Worksheet Analysis</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/20">
                  AI Vision Verified
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                AI verification of handwritten working steps, intermediate algebra derivations, and notebook layout.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Synced to Teacher Dashboard
            </span>
            {activeReport.solutionNotesAnalysis && (
              <>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Rigor: {activeReport.solutionNotesAnalysis.derivationRigorScore}%
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] border border-teal-500/20">
                  Legibility: {activeReport.solutionNotesAnalysis.legibility}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Files Gallery */}
        {activeSubmission?.attachments && activeSubmission.attachments.length > 0 ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F3F4F6] mb-2 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-[#0D9488]" />
                Analyzed Handwritten Solution Sheets ({activeSubmission.attachments.length}):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {activeSubmission.attachments.map((att, i) => (
                  <div
                    key={i}
                    onClick={() => att.type.startsWith('image/') ? setPreviewImage(att.dataUrl) : window.open(att.dataUrl, '_blank')}
                    className="group cursor-pointer p-2 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#1E212E] hover:border-[#0D9488] dark:hover:border-[#14B8A6] transition-all relative"
                  >
                    {att.type.startsWith('image/') ? (
                      <div className="h-24 w-full rounded-xl overflow-hidden bg-black/10 relative">
                        <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white font-bold text-xs gap-1">
                          <Eye className="w-3.5 h-3.5" /> View
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 w-full rounded-xl bg-teal-500/10 flex flex-col items-center justify-center text-[#0D9488] p-2 text-center">
                        <FileText className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-bold">Document</span>
                      </div>
                    )}
                    <p className="text-[10px] font-semibold truncate text-slate-700 dark:text-slate-300 mt-1.5">
                      {att.name}
                    </p>
                    <span className="text-[9px] text-slate-400">
                      {Math.round(att.size / 1024)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Pedagogical Remarks on Notes */}
            {activeReport.solutionNotesAnalysis && (
              <div className="p-4 rounded-2xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 space-y-3">
                <p className="text-xs text-slate-700 dark:text-[#F3F4F6] leading-relaxed">
                  <strong className="text-[#0D9488] dark:text-[#14B8A6]">AI Vision Findings:</strong> {activeReport.solutionNotesAnalysis.pedagogicalRemarks}
                </p>

                {activeReport.solutionNotesAnalysis.handwritingObservations.length > 0 && (
                  <div className="pt-2 border-t border-teal-500/15">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#9CA3AF] mb-1.5">
                      Notebook Layout & Derivation Observations:
                    </p>
                    <ul className="text-xs text-slate-600 dark:text-[#9CA3AF] space-y-1 list-disc pl-4">
                      {activeReport.solutionNotesAnalysis.handwritingObservations.map((obs, idx) => (
                        <li key={idx}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 cursor-pointer text-center space-y-2.5 transition-all group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {isUploadingNotes ? 'Gemini AI Vision is transcribing & verifying your handwritten notes...' : 'Upload Handwritten Solution Notes or Notebook Photo'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Gemini Vision will transcribe your actual handwritten steps, detect formulas (e.g. Quadratic Equations, Discriminant, Factoring), verify calculations line-by-line, and provide personalized teacher guidance.
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm inline-flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Select Notes Image</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 3: VERBAL CONCEPT EXPLANATION DIAGNOSTICS */}
      <section className="p-6 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1E212E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0D9488]/15 dark:bg-[#14B8A6]/20 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                Voice Concept Explanation Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                AI assessment of your spoken articulation and mental conceptual model.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-[#0D9488] dark:text-[#14B8A6]">
              Clarity: {activeReport.voiceAnalysis.clarityScore}/100
            </span>
            <p className="text-[10px] text-slate-400">
              {activeReport.voiceAnalysis.comprehensionDepth}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Strong Verbal Articulations
            </h5>
            <ul className="text-xs text-slate-600 dark:text-[#9CA3AF] space-y-1 list-disc pl-4">
              {activeReport.voiceAnalysis.positiveHighlights.map((ph, idx) => (
                <li key={idx}>{ph}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
            <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Identified Misconceptions / Ambiguities
            </h5>
            <ul className="text-xs text-slate-600 dark:text-[#9CA3AF] space-y-1 list-disc pl-4">
              {activeReport.voiceAnalysis.identifiedMisconceptions.map((im, idx) => (
                <li key={idx}>{im}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: LINE-BY-LINE SOLUTION BREAKDOWN */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0D9488] dark:text-[#14B8A6]" />
            Line-by-Line Solution Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
            Detailed AI mathematical review of each problem, corroborating answers with your uploaded solution notes.
          </p>
        </div>

        <div className="space-y-3.5">
          {activeReport.lineByLineAnalysis.map((line) => {
            const isCorrect = line.status === 'correct';
            const isPartial = line.status === 'partial';

            return (
              <div
                key={line.questionNumber}
                className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#0B0B0F] text-xs font-bold flex items-center justify-center shrink-0 text-slate-700 dark:text-[#F3F4F6] mt-0.5">
                      Q{line.questionNumber}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6]">
                        {line.questionText}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shrink-0 flex items-center gap-1.5 ${
                      isCorrect
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : isPartial
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : isPartial ? <AlertTriangle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span className="capitalize">{isCorrect ? 'Correct' : line.status.replace('_', ' ')}</span>
                  </span>
                </div>

                {/* Submitted Box Answer */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-100 dark:border-[#1E212E] space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Your Submitted Solution:
                  </p>
                  <p className="text-xs text-slate-900 dark:text-[#F3F4F6] font-mono font-bold leading-relaxed">
                    {line.studentAnswer}
                  </p>
                </div>

                {/* Verified From Solution Notes Callout */}
                {line.verifiedFromNotes && (
                  <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                    <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5" /> Verified in Uploaded Solution Notes:
                    </p>
                    <p className="text-xs text-slate-700 dark:text-[#D1D5DB] leading-relaxed">
                      {line.verifiedFromNotes}
                    </p>
                  </div>
                )}

                {/* AI Critique & Guidance */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs text-slate-600 dark:text-[#9CA3AF] leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">AI Critique:</strong> {line.critique}
                  </p>
                  <p className="text-xs text-[#0D9488] dark:text-[#14B8A6] font-medium leading-relaxed bg-[#0D9488]/5 dark:bg-[#14B8A6]/10 p-2.5 rounded-xl border border-[#0D9488]/15">
                    <strong>Guidance:</strong> {line.correctiveGuidance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: ACTIONABLE RECOMMENDATIONS */}
      <section className="p-6 rounded-xl bg-slate-50 dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
          Key Actionable Recommendations for You
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-[#9CA3AF]">
          {activeReport.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#0D9488]/15 dark:bg-[#14B8A6]/20 text-[#0D9488] dark:text-[#14B8A6] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* IMAGE LIGHTBOX MODAL */}
      <AnimatePresence>
        {previewImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="relative max-w-4xl max-h-[90vh]">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-10 right-0 text-white font-bold text-xs bg-black/60 px-3 py-1.5 rounded-full hover:bg-black/90"
              >
                ✕ Close
              </button>
              <img src={previewImage} alt="Worksheet full view" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" />
            </div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
};

export default StudentAIAnalysis;
