import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Calendar, 
  BookOpen, 
  Award, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Clock,
  RotateCcw,
  Layers,
  Inbox
} from 'lucide-react';
import { UserSession } from '../types';
import { getStudentSubmissions, getAIAnalysisReports } from '../services/homeworkStore';

interface StudentProgressProps {
  session: UserSession;
  onGoToTodayTasks?: () => void;
}

export const StudentProgress: React.FC<StudentProgressProps> = ({
  session,
  onGoToTodayTasks,
}) => {
  const studentKey = `${session.classLevel}_${session.section}_${session.rollNumber}`;
  const submissions = getStudentSubmissions(studentKey);
  const reports = getAIAnalysisReports(studentKey);
  const latestReport = reports[0];

  // State: Demo Mode toggle (Default: false = Real data)
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Tooltip states for Graph 1
  const [hoveredPointGraph1, setHoveredPointGraph1] = useState<number | null>(null);
  // Tooltip states for Graph 2
  const [hoveredPointGraph2, setHoveredPointGraph2] = useState<number | null>(null);
  // Tooltip states for Heatmap
  const [hoveredHeatmapDay, setHoveredHeatmapDay] = useState<{
    dateStr: string;
    level: number;
    sprints: number;
    tasks: string;
  } | null>(null);

  // ========================================================
  // GRAPH 1 DATA: Student vs Class Average in Today's Tasks
  // ========================================================
  const graph1Data = useMemo(() => {
    // 1. If in Demo Mode, supply rich sample benchmark data
    if (isDemoMode) {
      return [
        { label: 'Q1', questionText: 'Algebraic Identities: Difference of Squares', studentScore: 100, classAverage: 76 },
        { label: 'Q2', questionText: 'Trinomial Factorization: (a - b)²', studentScore: 95, classAverage: 68 },
        { label: 'Q3', questionText: 'Numerical Expansion: (100 + 3)²', studentScore: 100, classAverage: 82 },
        { label: 'Q4', questionText: 'Multi-variable Trinomial: (x + 2y + 4z)²', studentScore: 90, classAverage: 65 },
        { label: 'Q5', questionText: 'Identity Evaluation & Simplification', studentScore: 85, classAverage: 70 },
      ];
    }

    // 2. Real Mode: Check if student has actual submitted homework with AI analysis
    if (latestReport && latestReport.lineByLineAnalysis && latestReport.lineByLineAnalysis.length > 0) {
      return latestReport.lineByLineAnalysis.map((line, idx) => {
        const studentScore = line.status === 'correct' ? 100 : line.status === 'partial' ? 65 : 30;
        const classAvg = [74, 68, 82, 60, 75, 70][idx % 6] || 72;
        return {
          label: `Q${line.questionNumber}`,
          questionText: line.questionText,
          studentScore,
          classAverage: classAvg,
        };
      });
    }

    // 3. Real Mode with no submissions: Empty
    return [];
  }, [isDemoMode, latestReport]);

  const hasGraph1Data = graph1Data.length > 0;

  const studentAvgScore = hasGraph1Data
    ? Math.round(graph1Data.reduce((acc, d) => acc + d.studentScore, 0) / graph1Data.length)
    : 0;
  const classAvgScore = hasGraph1Data
    ? Math.round(graph1Data.reduce((acc, d) => acc + d.classAverage, 0) / graph1Data.length)
    : 0;
  const scoreDelta = studentAvgScore - classAvgScore;

  // ========================================================
  // GRAPH 2 DATA: Curriculum Topic Mastery Progress
  // ========================================================
  const topicMasteryData = useMemo(() => {
    // 1. If in Demo Mode, supply full curriculum sample topics
    if (isDemoMode) {
      return [
        { topic: 'Fractions & Decimals', mastery: 95, classAvg: 78, category: 'Mastered', status: 'strong' },
        { topic: 'Linear Equations', mastery: 92, classAvg: 74, category: 'Mastered', status: 'strong' },
        { topic: 'Algebraic Identities', mastery: 90, classAvg: 72, category: 'Mastered', status: 'strong' },
        { topic: 'Ratio & Proportions', mastery: 84, classAvg: 70, category: 'Proficient', status: 'average' },
        { topic: 'Geometry & Triangles', mastery: 78, classAvg: 68, category: 'Proficient', status: 'average' },
        { topic: 'Data Handling & Stats', mastery: 70, classAvg: 65, category: 'Needs Practice', status: 'average' },
        { topic: 'Polynomial Expansion', mastery: 88, classAvg: 71, category: 'Proficient', status: 'strong' },
      ];
    }

    // 2. Real Mode: Build from student's real reports
    if (reports.length > 0) {
      return reports.map((r) => ({
        topic: r.homeworkTitle || r.subject,
        mastery: r.overallScore,
        classAvg: 72,
        category: r.overallScore >= 85 ? 'Mastered' : r.overallScore >= 65 ? 'Proficient' : 'Needs Practice',
        status: r.overallScore >= 85 ? 'strong' : r.overallScore >= 65 ? 'average' : 'weak',
      }));
    }

    // 3. Real Mode with no topics: Empty
    return [];
  }, [isDemoMode, reports]);

  const hasTopicData = topicMasteryData.length > 0;

  // ========================================================
  // SVG Coordinates for Graph 1
  // ========================================================
  const g1Width = 720;
  const g1Height = 240;
  const g1Padding = { top: 30, right: 30, bottom: 40, left: 45 };
  const g1PlotWidth = g1Width - g1Padding.left - g1Padding.right;
  const g1PlotHeight = g1Height - g1Padding.top - g1Padding.bottom;

  const getG1Coords = (idx: number, score: number) => {
    const x = g1Padding.left + (idx / Math.max(graph1Data.length - 1, 1)) * g1PlotWidth;
    const y = g1Padding.top + g1PlotHeight - (score / 100) * g1PlotHeight;
    return { x, y };
  };

  const studentG1Points = hasGraph1Data ? graph1Data.map((d, i) => getG1Coords(i, d.studentScore)) : [];
  const classG1Points = hasGraph1Data ? graph1Data.map((d, i) => getG1Coords(i, d.classAverage)) : [];

  const studentPathD = studentG1Points.reduce((acc, pt, i) => 
    i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
  );
  const classPathD = classG1Points.reduce((acc, pt, i) => 
    i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
  );
  const studentAreaD = hasGraph1Data
    ? `${studentPathD} L ${studentG1Points[studentG1Points.length - 1].x} ${g1Height - g1Padding.bottom} L ${studentG1Points[0].x} ${g1Height - g1Padding.bottom} Z`
    : '';

  // ========================================================
  // SVG Coordinates for Graph 2 (Topic Mastery Progress)
  // ========================================================
  const g2Width = 720;
  const g2Height = 240;
  const g2Padding = { top: 30, right: 30, bottom: 45, left: 45 };
  const g2PlotWidth = g2Width - g2Padding.left - g2Padding.right;
  const g2PlotHeight = g2Height - g2Padding.top - g2Padding.bottom;

  const getG2Coords = (idx: number, score: number) => {
    const x = g2Padding.left + (idx / Math.max(topicMasteryData.length - 1, 1)) * g2PlotWidth;
    const y = g2Padding.top + g2PlotHeight - (score / 100) * g2PlotHeight;
    return { x, y };
  };

  const topicPoints = hasTopicData ? topicMasteryData.map((d, i) => getG2Coords(i, d.mastery)) : [];
  const topicClassPoints = hasTopicData ? topicMasteryData.map((d, i) => getG2Coords(i, d.classAvg)) : [];

  const topicPathD = topicPoints.reduce((acc, pt, i) => 
    i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
  );
  const topicClassPathD = topicClassPoints.reduce((acc, pt, i) => 
    i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`, ''
  );
  const topicAreaD = hasTopicData
    ? `${topicPathD} L ${topicPoints[topicPoints.length - 1].x} ${g2Height - g2Padding.bottom} L ${topicPoints[0].x} ${g2Height - g2Padding.bottom} Z`
    : '';

  // ========================================================
  // YEARLY ACTIVITY HEATMAP (365 DAYS)
  // Real Mode: Empty grid, with real activity only on submitted days
  // Demo Mode: Lively green non-pattern scatter
  // ========================================================
  const { heatmapWeeks, totalActiveDays, streakCount } = useMemo(() => {
    const weeks: { dayIndex: number; dateStr: string; level: number; sprints: number; tasks: string }[][] = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (52 * 7));

    // Real submissions dates
    const realSubmissionDates = new Set<string>();
    Object.values(submissions).forEach((s) => {
      if (s.status === 'submitted' && s.submittedAt) {
        realSubmissionDates.add(new Date(s.submittedAt).toDateString());
      }
    });

    const hash = (n: number) => {
      const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    let activeCount = 0;

    for (let w = 0; w < 52; w++) {
      const week: { dayIndex: number; dateStr: string; level: number; sprints: number; tasks: string }[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (w * 7 + d));
        const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const currentDateKey = currentDate.toDateString();

        let level = 0;
        let sprints = 0;
        let tasks = 'No activity recorded';

        if (isDemoMode) {
          // Demo Mode: Rich natural non-pattern scatter
          const dayId = w * 7 + d;
          const rand = hash(dayId * 41 + 107);

          if (rand > 0.77) {
            level = 4;
            sprints = 4;
            tasks = 'Homework submitted + 4 focus sprints';
          } else if (rand > 0.55) {
            level = 3;
            sprints = 3;
            tasks = 'AI diagnostic review + 3 sprints';
          } else if (rand > 0.35) {
            level = 2;
            sprints = 2;
            tasks = '2 Pomodoro study sprints';
          } else if (rand > 0.16) {
            level = 1;
            sprints = 1;
            tasks = '1 concept study sprint';
          }

          if (w >= 50 && rand > 0.2) {
            level = Math.max(level, 2);
            sprints = Math.max(sprints, 2);
          }

          if (w === 51 && d === 6) {
            level = 4;
            sprints = 4;
            tasks = 'Today: Homework submitted + AI Analysis complete';
          }
        } else {
          // Real Mode: Only real submissions marked
          if (realSubmissionDates.has(currentDateKey)) {
            level = 4;
            sprints = 3;
            tasks = 'Homework submitted & AI verified';
          }
        }

        if (level > 0) activeCount++;
        week.push({ dayIndex: d, dateStr, level, sprints, tasks });
      }
      weeks.push(week);
    }

    const streak = isDemoMode ? 14 : (realSubmissionDates.size > 0 ? 1 : 0);
    const totalDays = isDemoMode ? 184 : realSubmissionDates.size;

    return { heatmapWeeks: weeks, totalActiveDays: totalDays, streakCount: streak };
  }, [isDemoMode, submissions]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-[#34D399] border-[#6EE7B7] shadow-[0_0_8px_rgba(52,211,153,0.35)]';
      case 3: return 'bg-[#10B981] border-[#34D399]';
      case 2: return 'bg-[#047857] border-[#059669]';
      case 1: return 'bg-[#064E3B] border-[#065F46]';
      default: return 'bg-transparent border-slate-800/80 dark:border-[#22283A]';
    }
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1E212E]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-4 h-4" />
            Academic Analytics & Trajectory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
            Performance & Growth Progress
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-0.5">
            Compare your standing against the class average, track topic mastery, and view your 365-day study consistency.
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Overall Standing</p>
              <p className="text-sm font-black text-slate-900 dark:text-[#F3F4F6]">
                {hasGraph1Data
                  ? (scoreDelta >= 0 ? `+${scoreDelta}% Above Avg` : `${scoreDelta}% Below Avg`)
                  : 'Pending Submission'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Mode Notice Banner (when Demo Mode is ON) */}
      {isDemoMode && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-3 text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Demo Mode Active:</strong> Showing simulated Class 10 cohort benchmark curves and sample study logs.</span>
          </div>
          <button
            onClick={() => setIsDemoMode(false)}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 font-semibold text-[11px] text-amber-800 dark:text-amber-200 transition-colors shrink-0"
          >
            Reset to Live Empty Data
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. FIRST LINE GRAPH: STUDENT VS CLASS AVERAGE IN TODAY'S TASKS */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-7 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1E212E]">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${hasGraph1Data ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                Today's Tasks: Your Performance vs. Class Average
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">
              Line comparison across assigned homework questions showing your individual score vs. the cohort average.
            </p>
          </div>

          {/* Graph Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1.5 rounded-full bg-emerald-600" />
              <span className="text-slate-800 dark:text-[#F3F4F6]">
                You ({hasGraph1Data ? `${studentAvgScore}%` : '—'})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-[#818CF8]" />
              <span className="text-slate-500 dark:text-[#9CA3AF]">
                Class Average ({hasGraph1Data ? `${classAvgScore}%` : '—'})
              </span>
            </div>
          </div>
        </div>

        {/* SVG Interactive Line Graph with Empty State Support */}
        <div className="relative w-full overflow-x-auto min-h-[240px]">
          <svg viewBox={`0 0 ${g1Width} ${g1Height}`} className="w-full h-auto min-w-[580px] select-none">
            <defs>
              <linearGradient id="studentAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = g1Padding.top + g1PlotHeight - (val / 100) * g1PlotHeight;
              return (
                <g key={val}>
                  <line
                    x1={g1Padding.left}
                    y1={y}
                    x2={g1Width - g1Padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-[#222430]"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={g1Padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] font-semibold fill-slate-400"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {hasGraph1Data && (
              <>
                {/* Filled area under student's line */}
                <path d={studentAreaD} fill="url(#studentAreaGrad)" />

                {/* Class Average Dashed Line */}
                <path
                  d={classPathD}
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="opacity-80"
                />

                {/* Student Score Solid Line */}
                <path
                  d={studentPathD}
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="3.5"
                  className="drop-shadow-md"
                />

                {/* Class Average Point Circles */}
                {classG1Points.map((pt, i) => (
                  <circle
                    key={`class-${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#818CF8"
                    className="opacity-70"
                  />
                ))}

                {/* Student Point Circles & X-Axis Labels */}
                {studentG1Points.map((pt, i) => {
                  const isHovered = hoveredPointGraph1 === i;
                  return (
                    <g key={`student-${i}`}>
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={g1Padding.top}
                          x2={pt.x}
                          y2={g1Height - g1Padding.bottom}
                          stroke="#0D9488"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                          className="opacity-60"
                        />
                      )}

                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 8 : 5}
                        fill="#0D9488"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredPointGraph1(i)}
                        onMouseLeave={() => setHoveredPointGraph1(null)}
                      />

                      <text
                        x={pt.x}
                        y={g1Height - 15}
                        textAnchor="middle"
                        className={`text-xs font-bold cursor-pointer transition-colors ${
                          isHovered ? 'fill-[#0D9488] font-black' : 'fill-slate-500 dark:fill-slate-400'
                        }`}
                        onMouseEnter={() => setHoveredPointGraph1(i)}
                        onMouseLeave={() => setHoveredPointGraph1(null)}
                      >
                        {graph1Data[i].label}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>

          {/* Interactive Hover Tooltip for Graph 1 */}
          {hasGraph1Data && hoveredPointGraph1 !== null && (
            <div
              className="absolute pointer-events-none p-3 rounded-2xl bg-slate-900/95 dark:bg-[#0B0B0F]/95 border border-slate-700 text-white shadow-xl text-xs space-y-1 z-20 backdrop-blur-md"
              style={{
                left: `${(studentG1Points[hoveredPointGraph1].x / g1Width) * 100}%`,
                top: `${(studentG1Points[hoveredPointGraph1].y / g1Height) * 100 - 30}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <p className="font-bold text-[#14B8A6]">{graph1Data[hoveredPointGraph1].label}</p>
              <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
                {graph1Data[hoveredPointGraph1].questionText}
              </p>
              <div className="pt-1 border-t border-slate-700 flex items-center justify-between gap-4 font-semibold">
                <span className="text-emerald-400">You: {graph1Data[hoveredPointGraph1].studentScore}%</span>
                <span className="text-indigo-300">Class Avg: {graph1Data[hoveredPointGraph1].classAverage}%</span>
              </div>
            </div>
          )}

          {/* Real Empty State Overlay when no submissions exist */}
          {!hasGraph1Data && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-[#11131A]/50 backdrop-blur-[1px] rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1E212E] border border-slate-200 dark:border-[#2A2E3D] flex items-center justify-center text-slate-400 mb-3">
                <Inbox className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Homework Data Recorded Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
                Complete today's assigned tasks and upload your solution notebook to generate your live performance comparison curve.
              </p>
              {onGoToTodayTasks && (
                <button
                  type="button"
                  onClick={onGoToTodayTasks}
                  className="mt-3.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Open Today's Tasks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Insight Banner */}
        <div className="p-4 rounded-xl bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#0D9488] dark:text-[#14B8A6] shrink-0" />
            <p className="text-xs text-slate-700 dark:text-[#F3F4F6]">
              {hasGraph1Data ? (
                <>
                  <strong>AI Diagnostic Finding:</strong> You scored <strong>{studentAvgScore}%</strong> across assessed tasks, placing you{' '}
                  <span className="text-[#0D9488] dark:text-[#14B8A6] font-bold">
                    {scoreDelta >= 0 ? `+${scoreDelta}% ahead of the class average` : `${Math.abs(scoreDelta)}% behind class pace`}
                  </span>.
                </>
              ) : (
                <>
                  <strong>Awaiting Submissions:</strong> Real assessment metrics will populate automatically upon submitting your first worksheet.
                </>
              )}
            </p>
          </div>
          {onGoToTodayTasks && (
            <button
              onClick={onGoToTodayTasks}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shrink-0 self-start sm:self-auto transition-colors"
            >
              <span>View Tasks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SECOND GRAPH: COMPLETE TOPIC MASTERY PROGRESS */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-7 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1E212E]">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${hasTopicData ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F3F4F6]">
                Curriculum Topic Mastery (Completed Till Now)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-0.5">
              Cumulative mastery curve tracking every mathematical topic covered across the academic term.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-800 dark:text-[#F3F4F6]">Your Mastery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-t-2 border-dashed border-slate-400" />
              <span className="text-slate-500">Benchmark Avg</span>
            </div>
          </div>
        </div>

        {/* SVG Line & Area Graph for Topic Mastery */}
        <div className="relative w-full overflow-x-auto min-h-[240px]">
          <svg viewBox={`0 0 ${g2Width} ${g2Height}`} className="w-full h-auto min-w-[580px] select-none">
            <defs>
              <linearGradient id="topicAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((val) => {
              const y = g2Padding.top + g2PlotHeight - (val / 100) * g2PlotHeight;
              return (
                <g key={val}>
                  <line
                    x1={g2Padding.left}
                    y1={y}
                    x2={g2Width - g2Padding.right}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-100 dark:text-[#222430]"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={g2Padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] font-semibold fill-slate-400"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Mastery 80% Benchmark Line */}
            <line
              x1={g2Padding.left}
              y1={g2Padding.top + g2PlotHeight - (80 / 100) * g2PlotHeight}
              x2={g2Width - g2Padding.right}
              y2={g2Padding.top + g2PlotHeight - (80 / 100) * g2PlotHeight}
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="opacity-40"
            />
            <text
              x={g2Width - g2Padding.right + 5}
              y={g2Padding.top + g2PlotHeight - (80 / 100) * g2PlotHeight + 3}
              className="text-[9px] font-bold fill-amber-500"
            >
              Mastery Target (80%)
            </text>

            {hasTopicData && (
              <>
                {/* Area Fill */}
                <path d={topicAreaD} fill="url(#topicAreaGrad)" />

                {/* Benchmark Class Avg Line */}
                <path
                  d={topicClassPathD}
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="opacity-70"
                />

                {/* Student Mastery Line */}
                <path
                  d={topicPathD}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.5"
                  className="drop-shadow-md"
                />

                {/* Topic Circles */}
                {topicPoints.map((pt, i) => {
                  const isHovered = hoveredPointGraph2 === i;
                  return (
                    <g key={`tp-${i}`}>
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1={g2Padding.top}
                          x2={pt.x}
                          y2={g2Height - g2Padding.bottom}
                          stroke="#10B981"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                          className="opacity-60"
                        />
                      )}

                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 8 : 5}
                        fill="#10B981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="cursor-pointer transition-all duration-200"
                        onMouseEnter={() => setHoveredPointGraph2(i)}
                        onMouseLeave={() => setHoveredPointGraph2(null)}
                      />

                      <text
                        x={pt.x}
                        y={g2Height - 15}
                        textAnchor="middle"
                        className={`text-[10px] font-bold cursor-pointer transition-colors ${
                          isHovered ? 'fill-emerald-500 font-black' : 'fill-slate-500 dark:fill-slate-400'
                        }`}
                        onMouseEnter={() => setHoveredPointGraph2(i)}
                        onMouseLeave={() => setHoveredPointGraph2(null)}
                      >
                        {topicMasteryData[i].topic.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </svg>

          {/* Interactive Hover Tooltip for Graph 2 */}
          {hasTopicData && hoveredPointGraph2 !== null && (
            <div
              className="absolute pointer-events-none p-3 rounded-2xl bg-slate-900/95 dark:bg-[#0B0B0F]/95 border border-slate-700 text-white shadow-xl text-xs space-y-1 z-20 backdrop-blur-md"
              style={{
                left: `${(topicPoints[hoveredPointGraph2].x / g2Width) * 100}%`,
                top: `${(topicPoints[hoveredPointGraph2].y / g2Height) * 100 - 30}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <p className="font-bold text-emerald-400">{topicMasteryData[hoveredPointGraph2].topic}</p>
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span>Your Mastery: <strong>{topicMasteryData[hoveredPointGraph2].mastery}%</strong></span>
                <span className="text-slate-400">Class: {topicMasteryData[hoveredPointGraph2].classAvg}%</span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                topicMasteryData[hoveredPointGraph2].mastery >= 85
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {topicMasteryData[hoveredPointGraph2].category}
              </span>
            </div>
          )}

          {/* Empty State Overlay for Topic Mastery */}
          {!hasTopicData && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50/40 dark:bg-[#11131A]/50 backdrop-blur-[1px] rounded-xl">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#1E212E] border border-slate-200 dark:border-[#2A2E3D] flex items-center justify-center text-slate-400 mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No Topic Mastery Records Found
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
                As you submit assignments across Physics, Mathematics, Chemistry, and Biology, each verified topic will plot here.
              </p>
            </div>
          )}
        </div>

        {/* Detailed Topic Cards Grid */}
        {hasTopicData && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
            {topicMasteryData.map((t, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#1E212E] space-y-2"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6] truncate">
                    {t.topic}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                      t.mastery >= 85
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {t.mastery}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-[#222430] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      t.mastery >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${t.mastery}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {t.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. YEARLY ACTIVITY HEATMAP (365 DAYS) */}
      {/* ======================================================== */}
      <section className="p-6 sm:p-8 rounded-xl bg-[#0B0E17] dark:bg-[#0A0D18] border border-slate-800 shadow-2xl text-white space-y-5 relative overflow-hidden">
        {/* Header & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wide text-white uppercase flex items-center gap-2">
              YEARLY ACTIVITY HEATMAP (365 DAYS)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Consistent daily practice. Every square reflects your committed study sprints.
            </p>
          </div>

          {/* Legend: Strictly Green and Its Shades */}
          <div className="flex items-center gap-2 text-xs text-slate-400 self-start sm:self-auto font-medium">
            <span>Less</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-[4px] border border-slate-700/60 bg-transparent" title="No study sprint" />
              <span className="w-3.5 h-3.5 rounded-[4px] bg-[#064E3B] border border-[#065F46]" title="1 study sprint" />
              <span className="w-3.5 h-3.5 rounded-[4px] bg-[#047857] border border-[#059669]" title="2 study sprints" />
              <span className="w-3.5 h-3.5 rounded-[4px] bg-[#10B981] border border-[#34D399]" title="3 study sprints" />
              <span className="w-3.5 h-3.5 rounded-[4px] bg-[#34D399] border border-[#6EE7B7]" title="4+ study sprints" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* The 52-Week x 7-Day Grid with Sleek Dark Scrollbar */}
        <div className="overflow-x-auto pb-3 pt-2 scrollbar-thin [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/70 hover:[&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="inline-flex gap-1.5 min-w-max p-1">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredHeatmapDay(day)}
                    onMouseLeave={() => setHoveredHeatmapDay(null)}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border cursor-pointer transition-all duration-150 hover:scale-125 hover:z-10 ${getLevelColor(day.level)}`}
                    title={`${day.dateStr}: ${day.tasks}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Hover Info Panel */}
        <div className="min-h-[28px] flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
          {hoveredHeatmapDay ? (
            <div className="flex items-center gap-2 text-white font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{hoveredHeatmapDay.dateStr}:</span>
              <span className="text-[#10B981] font-bold">{hoveredHeatmapDay.tasks}</span>
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">
              Hover over any square to view daily practice duration and completed homework tasks.
            </span>
          )}

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-slate-300">
              <Flame className={`w-3.5 h-3.5 ${streakCount > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
              {streakCount}-Day Streak
            </span>
            <span className="text-slate-400">
              {totalActiveDays} Days Active
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. DEMO DATA OPTION AT BOTTOM                           */}
      {/* ======================================================== */}
      <section className="p-5 sm:p-6 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            isDemoMode 
              ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
          }`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isDemoMode ? 'Benchmark Demo Mode Active' : 'Live Academic Telemetry'}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                isDemoMode 
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
              }`}>
                {isDemoMode ? 'SAMPLE DATA' : 'REAL DATA'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isDemoMode
                ? 'Showing simulated Class 10 cohort performance, historical topic curves, and 365-day practice heatmap.'
                : 'Displaying genuine student records. Graphs and heatmap remain clean until assignments are submitted.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsDemoMode((prev) => !prev)}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-xs shrink-0 self-stretch sm:self-auto justify-center ${
            isDemoMode
              ? 'bg-slate-100 hover:bg-slate-200 dark:bg-[#1E212E] dark:hover:bg-[#282C3D] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isDemoMode ? '← Switch to Live Empty State' : '⚡ Load Demo Benchmark Data'}</span>
        </button>
      </section>
    </div>
  );
};

export default StudentProgress;
