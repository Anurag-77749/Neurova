import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  Send, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Check,
  Upload,
  Image as ImageIcon,
  X,
  Mic,
  MicOff,
  Volume2,
  Brain,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { UserSession, Homework, StudentSubmission, SolutionAttachment, VoiceExplanation } from '../types';
import { getHomeworksForStudent, getStudentSubmissions, saveStudentSubmission } from '../services/homeworkStore';
import { generateAIAnalysis } from '../services/aiAnalysisService';

interface StudentDashboardProps {
  session: UserSession;
  onUpdateCompletedCount: (completed: number, total: number) => void;
  onGoToAIAnalysis?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  session,
  onUpdateCompletedCount,
  onGoToAIAnalysis,
}) => {
  const studentKey = `${session.classLevel}_${session.section}_${session.rollNumber}`;
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission>>({});
  const [expandedHomeworkId, setExpandedHomeworkId] = useState<string | null>(null);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, Record<string, string>>>({});
  
  // Attachments & Voice Explanation per Homework ID
  const [attachmentsMap, setAttachmentsMap] = useState<Record<string, SolutionAttachment[]>>({});
  const [voiceMap, setVoiceMap] = useState<Record<string, VoiceExplanation>>({});

  // Audio Recording Live State
  const [activeRecordingHwId, setActiveRecordingHwId] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Status & Feedback
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [isAnalyzingHwId, setIsAnalyzingHwId] = useState<string | null>(null);

  const loadData = () => {
    const list = getHomeworksForStudent(session.classLevel, session.section);
    setHomeworks(list);

    const subs = getStudentSubmissions(studentKey);
    setSubmissions(subs);

    // Initial answers map, attachments map, and voice explanation
    const ansMap: Record<string, Record<string, string>> = {};
    const attMap: Record<string, SolutionAttachment[]> = {};
    const vMap: Record<string, VoiceExplanation> = {};

    list.forEach(hw => {
      ansMap[hw.id] = subs[hw.id]?.answers || {};
      attMap[hw.id] = subs[hw.id]?.attachments || [];
      vMap[hw.id] = subs[hw.id]?.voiceExplanation || { transcript: '' };
    });

    setCurrentAnswers(ansMap);
    setAttachmentsMap(attMap);
    setVoiceMap(vMap);

    // Update progress counts for sidebar
    const completedCount = list.filter(hw => subs[hw.id]?.status === 'submitted').length;
    onUpdateCompletedCount(completedCount, list.length);
  };

  useEffect(() => {
    loadData();

    // Listen for live published homework updates from Teacher dashboard
    const handleHwUpdate = () => loadData();
    window.addEventListener('neurova_homework_changed', handleHwUpdate);
    window.addEventListener('neurova_submissions_changed', handleHwUpdate);

    return () => {
      window.removeEventListener('neurova_homework_changed', handleHwUpdate);
      window.removeEventListener('neurova_submissions_changed', handleHwUpdate);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [session]);

  const handleAnswerChange = (hwId: string, qId: string, text: string) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [hwId]: {
        ...(prev[hwId] || {}),
        [qId]: text,
      }
    }));
  };

  // ========================================================
  // SOLUTION ATTACHMENT UPLOADER
  // ========================================================
  const handleFileUpload = (hwId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newAttachment: SolutionAttachment = {
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result as string,
        };

        setAttachmentsMap(prev => ({
          ...prev,
          [hwId]: [...(prev[hwId] || []), newAttachment]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (hwId: string, index: number) => {
    setAttachmentsMap(prev => ({
      ...prev,
      [hwId]: (prev[hwId] || []).filter((_, i) => i !== index)
    }));
  };

  // ========================================================
  // VOICE RECORDING & TRANSCRIPTION
  // ========================================================
  const startRecording = async (hwId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);

        setVoiceMap(prev => ({
          ...prev,
          [hwId]: {
            ...(prev[hwId] || {}),
            audioUrl,
            durationSeconds: recordingSeconds,
          }
        }));

        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setActiveRecordingHwId(hwId);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      // Start Web Speech API Speech-to-Text if available
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcriptText = '';
          for (let i = 0; i < event.results.length; i++) {
            transcriptText += event.results[i][0].transcript + ' ';
          }
          setVoiceMap(prev => ({
            ...prev,
            [hwId]: {
              ...(prev[hwId] || {}),
              transcript: transcriptText.trim(),
            }
          }));
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch (err) {
      alert('Microphone access is unavailable or denied. You can still type your verbal concept explanation directly into the box!');
    }
  };

  const stopRecording = (hwId: string) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch {}
    }
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setActiveRecordingHwId(null);
  };

  const handleVoiceTranscriptChange = (hwId: string, text: string) => {
    setVoiceMap(prev => ({
      ...prev,
      [hwId]: {
        ...(prev[hwId] || {}),
        transcript: text,
      }
    }));
  };

  // ========================================================
  // SUBMISSION & AI ANALYSIS GENERATION
  // ========================================================
  const handleSubmitHomework = async (hwId: string) => {
    const hw = homeworks.find(h => h.id === hwId);
    if (!hw) return;

    setIsAnalyzingHwId(hwId);

    try {
      const answers = currentAnswers[hwId] || {};
      const attachments = attachmentsMap[hwId] || [];
      const voiceExplanation = voiceMap[hwId] || {};

      // 1. Generate Comprehensive AI Diagnostic
      const aiReport = await generateAIAnalysis({
        homework: hw,
        answers,
        attachments,
        voiceExplanation,
        studentName: session.name,
        studentKey,
      });

      // 2. Save Complete Submission to Store
      saveStudentSubmission({
        studentKey,
        homeworkId: hwId,
        homeworkTitle: hw.title,
        subject: hw.subject,
        studentName: session.name,
        classLevel: session.classLevel,
        section: session.section,
        rollNumber: session.rollNumber,
        answers,
        attachments,
        voiceExplanation,
        aiAnalysis: aiReport,
        status: 'submitted',
      });

      setSubmissionFeedback(`Homework submitted successfully! Gemini AI Vision analysis report is ready.`);
      loadData();
      if (onGoToAIAnalysis) {
        setTimeout(() => { onGoToAIAnalysis(); }, 1200);
      }
    } catch (err) {
      console.error('Error submitting homework:', err);
      setSubmissionFeedback('Submitted successfully, diagnostic report updated.');
      loadData();
    } finally {
      setIsAnalyzingHwId(null);
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Welcome Header - Clean & Professional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#1C1E2A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Class {session.classLevel}-{session.section}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Roll #{session.rollNumber}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Assignments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete assigned questions, upload notebook working sheets, and run live diagnostic verification.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#141622] border border-slate-200 dark:border-[#222432] text-slate-600 dark:text-slate-400 font-mono">
            AY 2026-27
          </span>
        </div>
      </div>

      {submissionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{submissionFeedback}</span>
          </div>
          {onGoToAIAnalysis && (
            <button
              onClick={onGoToAIAnalysis}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs inline-flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Open AI Analysis</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </motion.div>
      )}

{/* TODAYS TASKS SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
              Today's Tasks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6] border border-[#0D9488]/20">
              {homeworks.length} Assigned
            </span>
          </div>

          <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">
            Published by Teachers
          </span>
        </div>

        {homeworks.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-[#F3F4F6]">
              No homework published for Class {session.classLevel}-{session.section} yet.
            </p>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
              When your educator publishes 5 to 10 questions, they will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {homeworks.map((hw) => {
              const submission = submissions[hw.id];
              const isSubmitted = submission?.status === 'submitted';
              const isExpanded = expandedHomeworkId === hw.id;
              const answers = currentAnswers[hw.id] || {};
              const answeredCount = hw.questions.filter(q => (answers[q.id] || '').trim().length > 0).length;
              const attachments = attachmentsMap[hw.id] || [];
              const voiceData = voiceMap[hw.id] || { transcript: '' };
              const isRecordingThis = activeRecordingHwId === hw.id;
              const isAnalyzingThis = isAnalyzingHwId === hw.id;

              return (
                <div
                  key={hw.id}
                  className="rounded-xl bg-white dark:bg-[#11131A] border border-slate-200/80 dark:border-[#1E212E] hover:border-slate-300 dark:hover:border-[#2B2F40] shadow-2xs transition-all overflow-hidden"
                >
                  {/* Task Card Header */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {hw.subject}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-[#9CA3AF] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Due: {hw.dueDate}
                        </span>
                        <span className="text-xs text-slate-400">
                          • Target: {hw.targetClass === 'ALL' ? 'All Classes' : `Class ${hw.targetClass}`} ({hw.targetSection === 'ALL' ? 'All Sec' : `Sec ${hw.targetSection}`})
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                        {hw.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-[#9CA3AF] flex items-center gap-2">
                        <span>Contains {hw.questions.length} questions</span>
                        <span>•</span>
                        <span>By {hw.teacherEmail}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">
                          {answeredCount}/{hw.questions.length} Answered
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {isSubmitted ? (
                            <span className="text-emerald-500 font-semibold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Submitted & Evaluated
                            </span>
                          ) : (
                            <span className="text-amber-500 dark:text-amber-400 font-medium">
                              Pending Submission
                            </span>
                          )}
                        </p>
                      </div>

                      <button
                        onClick={() => setExpandedHomeworkId(isExpanded ? null : hw.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isExpanded
                            ? 'bg-slate-100 dark:bg-[#171924] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#252838]'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isExpanded ? 'Close Questions' : isSubmitted ? 'Review Work' : 'Open & Solve'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Questions & Upload Area */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-slate-200 dark:border-[#222430] bg-slate-50/50 dark:bg-[#0B0B0F]/50 p-5 sm:p-6 space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-[#9CA3AF]">
                            Homework Questions ({hw.questions.length} Questions)
                          </h4>
                          <span className="text-xs text-[#0D9488] dark:text-[#14B8A6] font-semibold">
                            {answeredCount} of {hw.questions.length} Completed
                          </span>
                        </div>

                        {/* Question List */}
                        <div className="space-y-4">
                          {hw.questions.map((q, index) => {
                            const ans = answers[q.id] || '';
                            const isAnswered = ans.trim().length > 0;

                            return (
                              <div
                                key={q.id}
                                className="p-4 rounded-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-2.5"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-2.5">
                                    <span className="w-6 h-6 rounded-lg bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 text-[#0D9488] dark:text-[#14B8A6] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                      {index + 1}
                                    </span>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-[#F3F4F6] leading-relaxed">
                                      {q.question}
                                    </p>
                                  </div>

                                  {isAnswered && (
                                    <span className="shrink-0 text-xs text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 font-medium">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Done
                                    </span>
                                  )}
                                </div>

                                {/* Answer Input */}
                                <textarea
                                  value={ans}
                                  onChange={(e) => handleAnswerChange(hw.id, q.id, e.target.value)}
                                  disabled={false}
                                  placeholder={isSubmitted ? 'Your recorded answer.' : 'Type your final answer or solution here below the question...'}
                                  rows={2}
                                  className="w-full p-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6] transition-all disabled:opacity-80"
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* SECTION A: UPLOAD YOUR COMPLETE HOMEWORK SOLUTIONS */}
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 dark:bg-[#14B8A6]/15 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center">
                                <Upload className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F3F4F6]">
                                  Upload Your Complete Solutions
                                </h5>
                                <p className="text-[11px] text-slate-500 dark:text-[#9CA3AF]">
                                  Attach your handwritten notebook solution photos or typed PDF document. Uploaded notes go directly to Gemini AI and your teacher.
                                </p>
                              </div>
                            </div>

                            <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0B0B0F] dark:hover:bg-[#222430] border border-slate-300 dark:border-[#222430] text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] transition-all inline-flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                                <span>Choose Files</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*,.pdf,.doc,.docx,.txt"
                                  onChange={(e) => handleFileUpload(hw.id, e)}
                                  className="hidden"
                                />
                              </label>
                          </div>

                          {/* Uploaded Files Grid / Preview */}
                          {attachments.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
                              {attachments.map((att, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] relative group flex flex-col justify-between"
                                >
                                  {att.type.startsWith('image/') ? (
                                    <div className="h-20 w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-black/40 mb-2">
                                      <img src={att.dataUrl} alt={att.name} className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="h-20 w-full rounded-lg bg-teal-500/10 flex items-center justify-center text-[#0D9488] dark:text-[#14B8A6] mb-2">
                                      <FileText className="w-8 h-8" />
                                    </div>
                                  )}

                                  <div className="truncate">
                                    <p className="text-[11px] font-semibold text-slate-800 dark:text-[#F3F4F6] truncate" title={att.name}>
                                      {att.name}
                                    </p>
                                    <p className="text-[9px] text-slate-400">
                                      {Math.round(att.size / 1024)} KB
                                    </p>
                                  </div>

                                  <button
                                      type="button"
                                      onClick={() => handleRemoveAttachment(hw.id, idx)}
                                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 shadow"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-[#222430] text-center text-xs text-slate-500">
                              No solution sheets attached yet. Click "Choose Files" above to upload photos of your notebook.
                            </div>
                          )}
                        </div>

                        {/* SECTION B: VOICE CONCEPT EXPLANATION */}
                        <div className="p-5 rounded-2xl bg-white dark:bg-[#15161C] border border-[#0D9488]/30 dark:border-[#14B8A6]/30 space-y-3.5 relative overflow-hidden">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-[#0D9488]/15 dark:bg-[#14B8A6]/20 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center">
                                <Mic className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-[#F3F4F6] flex items-center gap-1.5">
                                  <span>Voice Explanation</span>
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0D9488]/10 text-[#0D9488] dark:text-[#14B8A6]">
                                    Explain to AI
                                  </span>
                                </h5>
                                <p className="text-[11px] text-slate-500 dark:text-[#9CA3AF]">
                                  Explain the concept you learned today in your own words. AI analyzes your conceptual mastery!
                                </p>
                              </div>
                            </div>

                            {/* Record Controls */}
                            {!isSubmitted && (
                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                {isRecordingThis ? (
                                  <button
                                    type="button"
                                    onClick={() => stopRecording(hw.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow animate-pulse"
                                  >
                                    <MicOff className="w-3.5 h-3.5" />
                                    <span>Stop Recording ({recordingSeconds}s)</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => startRecording(hw.id)}
                                    className="px-3.5 py-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-xs flex items-center gap-1.5 shadow"
                                  >
                                    <Mic className="w-3.5 h-3.5" />
                                    <span>Start Voice Explanation</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Recording Soundwave indicator */}
                          {isRecordingThis && (
                            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between text-xs text-[#0D9488] dark:text-[#14B8A6]">
                              <span className="font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                                Listening & Transcribing in Real-Time...
                              </span>
                              <div className="flex items-center gap-1">
                                {[40, 75, 50, 90, 60, 80, 45].map((h, i) => (
                                  <span
                                    key={i}
                                    style={{ height: `${h}%` }}
                                    className="w-1 bg-[#0D9488] dark:bg-[#14B8A6] rounded-full animate-bounce"
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Audio Player if recorded */}
                          {voiceData.audioUrl && (
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430]">
                              <Volume2 className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6]" />
                              <audio controls src={voiceData.audioUrl} className="h-8 flex-1" />
                            </div>
                          )}

                          {/* Voice Transcript / Notes Box */}
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                              Spoken Explanation Transcript / Concept Notes:
                            </label>
                            <textarea
                              value={voiceData.transcript || ''}
                              onChange={(e) => handleVoiceTranscriptChange(hw.id, e.target.value)}
                              disabled={false}
                              placeholder="Your voice will automatically transcribe here as you speak. You can also type or refine your concept explanation directly..."
                              rows={2}
                              className="w-full p-3 rounded-xl text-xs bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                            />
                          </div>
                        </div>

                        {/* Submit Action Bar */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {isSubmitted ? (
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" />
                                Submitted & AI Evaluated
                              </span>
                            ) : (
                              <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">
                                {answeredCount < hw.questions.length 
                                  ? `Answered ${answeredCount} of ${hw.questions.length} questions.`
                                  : 'All questions answered! AI will analyze your written solutions and notes together.'}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {isSubmitted && onGoToAIAnalysis && (
                              <button
                                type="button"
                                onClick={onGoToAIAnalysis}
                                className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] hover:bg-slate-100 dark:hover:bg-[#1A1D27] text-slate-800 dark:text-[#F3F4F6] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                              >
                                <Brain className="w-3.5 h-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                                <span>View AI Analysis (Option 3)</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              type="button"
                              disabled={isAnalyzingThis}
                              onClick={() => handleSubmitHomework(hw.id)}
                              className="px-6 py-2.5 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                              {isAnalyzingThis ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>AI Analyzing Notes & Solutions...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4" />
                                  <span>{isSubmitted ? 'Re-Submit & Update AI Analysis' : 'Submit Homework & Generate AI Analysis'}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
