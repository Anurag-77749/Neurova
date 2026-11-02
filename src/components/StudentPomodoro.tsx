import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Flame, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Clock, 
  Coffee, 
  Armchair, 
  ArrowRight,
  BookOpen,
  Target
} from 'lucide-react';
import { UserSession, Homework } from '../types';
import { getHomeworksForStudent } from '../services/homeworkStore';

interface StudentPomodoroProps {
  session: UserSession;
  onGoToTodayTasks: () => void;
}

type PomodoroMode = 'focus' | 'short_break' | 'long_break';

const DEFAULT_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,       // 25 minutes
  short_break: 5 * 60,  // 5 minutes
  long_break: 15 * 60,  // 15 minutes
};

const POMODORO_STORAGE_KEY = 'neurova_pomodoro_stats';

interface PomodoroStats {
  date: string;
  completedPomodoros: number;
  totalFocusSeconds: number;
}

function getStoredStats(): PomodoroStats {
  const todayStr = new Date().toISOString().slice(0, 10);
  try {
    const raw = localStorage.getItem(POMODORO_STORAGE_KEY);
    if (raw) {
      const parsed: PomodoroStats = JSON.parse(raw);
      if (parsed.date === todayStr) return parsed;
    }
  } catch {}
  return { date: todayStr, completedPomodoros: 0, totalFocusSeconds: 0 };
}

function saveStats(stats: PomodoroStats) {
  try {
    localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

/**
 * Web Audio API synthesized gentle melodic chime
 */
function playChime(isBreakStart: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = isBreakStart 
      ? [523.25, 659.25, 783.99, 1046.50] // Ascending cheerful chime (C5, E5, G5, C6)
      : [880.00, 659.25, 523.25];         // Gentle alert for work resume

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.16);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.16 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.16);
      osc.stop(ctx.currentTime + idx * 0.16 + 0.5);
    });
  } catch (err) {
    console.warn('Audio chime playback failed:', err);
  }
}

export const StudentPomodoro: React.FC<StudentPomodoroProps> = ({
  session,
  onGoToTodayTasks,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(DEFAULT_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [focusTask, setFocusTask] = useState<string>('');
  const [stats, setStats] = useState<PomodoroStats>(getStoredStats());
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);

  const intervalRef = useRef<any>(null);
  const targetEndTimestampRef = useRef<number | null>(null);

  // Load homeworks for quick-task focus chips
  useEffect(() => {
    const list = getHomeworksForStudent(session.classLevel, session.section);
    setHomeworkList(list);
    if (list.length > 0 && !focusTask) {
      setFocusTask(`${list[0].subject}: ${list[0].title}`);
    }
  }, [session]);

  // Update browser document tab title with countdown
  useEffect(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const modeLabel = mode === 'focus' ? '🎯 Focus' : mode === 'short_break' ? '☕ Short Break' : '🌿 Long Break';

    if (isRunning) {
      document.title = `(${timeFormatted}) ${modeLabel} • Neurova`;
    } else {
      document.title = `Pomodoro Timer • Neurova`;
    }

    return () => {
      document.title = 'Neurova - Academic Platform';
    };
  }, [secondsRemaining, isRunning, mode]);

  // Precision countdown timer engine
  useEffect(() => {
    if (isRunning) {
      targetEndTimestampRef.current = Date.now() + secondsRemaining * 1000;

      intervalRef.current = setInterval(() => {
        if (!targetEndTimestampRef.current) return;
        const remainingMs = targetEndTimestampRef.current - Date.now();
        const nextSeconds = Math.max(Math.round(remainingMs / 1000), 0);

        setSecondsRemaining(nextSeconds);

        if (nextSeconds <= 0) {
          clearInterval(intervalRef.current);
          handleTimerCompletion();
        }
      }, 250);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      targetEndTimestampRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  // Handle session completion
  const handleTimerCompletion = () => {
    setIsRunning(false);

    if (soundEnabled) {
      playChime(mode === 'focus');
    }

    if (mode === 'focus') {
      // Record completed Pomodoro
      const newPomodoros = stats.completedPomodoros + 1;
      const newFocusSeconds = stats.totalFocusSeconds + DEFAULT_DURATIONS.focus;
      const updatedStats = {
        ...stats,
        completedPomodoros: newPomodoros,
        totalFocusSeconds: newFocusSeconds,
      };
      setStats(updatedStats);
      saveStats(updatedStats);

      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);

      // Every 4 Pomodoros, offer a Long Break, else Short Break
      if (nextCycle % 4 === 0) {
        setMode('long_break');
        setSecondsRemaining(DEFAULT_DURATIONS.long_break);
      } else {
        setMode('short_break');
        setSecondsRemaining(DEFAULT_DURATIONS.short_break);
      }
    } else {
      // Break finished, return to Focus
      setMode('focus');
      setSecondsRemaining(DEFAULT_DURATIONS.focus);
    }
  };

  // Switch modes
  const handleSwitchMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsRemaining(DEFAULT_DURATIONS[newMode]);
  };

  // Preset duration buttons
  const handleSetCustomMinutes = (minutes: number) => {
    setIsRunning(false);
    setSecondsRemaining(minutes * 60);
  };

  const handleTogglePlayPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(DEFAULT_DURATIONS[mode]);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);
      if (nextCycle % 4 === 0) {
        setMode('long_break');
        setSecondsRemaining(DEFAULT_DURATIONS.long_break);
      } else {
        setMode('short_break');
        setSecondsRemaining(DEFAULT_DURATIONS.short_break);
      }
    } else {
      setMode('focus');
      setSecondsRemaining(DEFAULT_DURATIONS.focus);
    }
  };

  // Progress percentage calculation
  const totalDuration = DEFAULT_DURATIONS[mode];
  const progressPercent = Math.min(
    Math.max(100 - (secondsRemaining / totalDuration) * 100, 0),
    100
  );

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // SVG Circular Ring math
  const radius = 135;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1E212E]">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1.5 mb-1">
            <Clock className="w-4 h-4" />
            Study Technique & Productivity Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
            Pomodoro Focus Timer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#9CA3AF] mt-0.5">
            Break your homework and study into 25-minute deep focus sprints separated by revitalizing short breaks.
          </p>
        </div>

        {/* Sound toggle and streak badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              soundEnabled
                ? 'bg-emerald-600/10 text-[#0D9488] dark:text-[#14B8A6] border-[#0D9488]/20'
                : 'bg-slate-100 text-slate-400 border-slate-200 dark:bg-[#11131A] dark:border-[#1E212E]'
            }`}
            title={soundEnabled ? 'Chime sound is active' : 'Chime is muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sound On' : 'Muted'}</span>
          </button>

          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>{stats.completedPomodoros} Focus Sprints Today</span>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex justify-center">
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] flex items-center gap-1">
          <button
            onClick={() => handleSwitchMode('focus')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              mode === 'focus'
                ? 'bg-white dark:bg-[#0B0B0F] text-[#0D9488] dark:text-[#14B8A6] shadow-sm'
                : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Deep Focus (25m)</span>
          </button>

          <button
            onClick={() => handleSwitchMode('short_break')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              mode === 'short_break'
                ? 'bg-white dark:bg-[#0B0B0F] text-amber-500 shadow-sm'
                : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Short Break (5m)</span>
          </button>

          <button
            onClick={() => handleSwitchMode('long_break')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              mode === 'long_break'
                ? 'bg-white dark:bg-[#0B0B0F] text-blue-500 shadow-sm'
                : 'text-slate-600 dark:text-[#9CA3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Armchair className="w-4 h-4" />
            <span>Long Break (15m)</span>
          </button>
        </div>
      </div>

      {/* MAIN TIMER DISPLAY CARD */}
      <div className="p-8 sm:p-12 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] shadow-sm flex flex-col items-center justify-center relative overflow-hidden space-y-6">
        
        {/* Subtle background ambient pulse when running */}
        {isRunning && (
          <div
            className={`absolute inset-0 opacity-5 pointer-events-none transition-all duration-1000 ${
              mode === 'focus'
                ? 'bg-emerald-600'
                : mode === 'short_break'
                ? 'bg-amber-500'
                : 'bg-blue-500'
            }`}
          />
        )}

        {/* Circular SVG Ring Countdown */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-100 dark:text-[#222430]"
            />
            {/* Progress Stroke */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className={`transition-all duration-500 ${
                mode === 'focus'
                  ? 'text-[#0D9488] dark:text-[#14B8A6]'
                  : mode === 'short_break'
                  ? 'text-amber-500'
                  : 'text-blue-500'
              }`}
            />
          </svg>

          {/* Central Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
                mode === 'focus'
                  ? 'bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6]'
                  : mode === 'short_break'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-blue-500/10 text-blue-500'
              }`}
            >
              {mode === 'focus' ? 'Deep Study Session' : mode === 'short_break' ? 'Recharge Break' : 'Restful Long Break'}
            </span>

            <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-[#F3F4F6]">
              {formattedTime}
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
              {isRunning ? 'Sprint Active • Stay Focused' : 'Timer Paused'}
            </span>
          </div>
        </div>

        {/* 4-Step Cycle Dots */}
        <div className="flex items-center gap-2 pt-2">
          {[0, 1, 2, 3].map((dotIndex) => {
            const isCompleted = (cycleCount % 4) > dotIndex;
            const isCurrent = (cycleCount % 4) === dotIndex && mode === 'focus';
            return (
              <div
                key={dotIndex}
                className={`w-3 h-3 rounded-full transition-all ${
                  isCompleted
                    ? 'bg-emerald-600 dark:bg-emerald-600 scale-110'
                    : isCurrent
                    ? 'bg-emerald-600/40 dark:bg-emerald-600/40 ring-2 ring-[#0D9488] animate-pulse'
                    : 'bg-slate-200 dark:bg-[#222430]'
                }`}
                title={`Pomodoro ${dotIndex + 1} of 4 before Long Break`}
              />
            );
          })}
          <span className="text-[11px] text-slate-400 font-medium ml-1">
            Session {(cycleCount % 4) + 1} of 4
          </span>
        </div>

        {/* Play / Pause / Reset / Skip Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#222430] dark:hover:bg-[#2A2B38] text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlayPause}
            className={`px-8 h-14 rounded-2xl text-white font-extrabold text-base flex items-center gap-3 shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95 ${
              mode === 'focus'
                ? 'bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-[#0B0B0F]'
                : mode === 'short_break'
                ? 'bg-amber-500 hover:bg-amber-600 text-black'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#222430] dark:hover:bg-[#2A2B38] text-slate-700 dark:text-slate-300 flex items-center justify-center transition-all shadow-sm"
            title="Skip to Next Phase"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Duration Customizer Presets */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Presets:</span>
          {mode === 'focus' ? (
            <>
              {[25, 40, 50].map((m) => (
                <button
                  key={m}
                  onClick={() => handleSetCustomMinutes(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    secondsRemaining === m * 60
                      ? 'bg-teal-500/15 text-[#0D9488] dark:text-[#14B8A6] border-[#0D9488]/30 font-bold'
                      : 'border-slate-200 dark:border-[#1E212E] text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </>
          ) : mode === 'short_break' ? (
            <>
              {[5, 10].map((m) => (
                <button
                  key={m}
                  onClick={() => handleSetCustomMinutes(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    secondsRemaining === m * 60
                      ? 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold'
                      : 'border-slate-200 dark:border-[#1E212E] text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </>
          ) : (
            <>
              {[15, 20, 30].map((m) => (
                <button
                  key={m}
                  onClick={() => handleSetCustomMinutes(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    secondsRemaining === m * 60
                      ? 'bg-blue-500/15 text-blue-500 border-blue-500/30 font-bold'
                      : 'border-slate-200 dark:border-[#1E212E] text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* FOCUS INTENTION & HOMEWORK TASK ASSOCIATION */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 dark:bg-emerald-600/15 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6]">
                Current Focus Intention
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-[#9CA3AF]">
                What specific subject or homework problem are you mastering during this sprint?
              </p>
            </div>
          </div>

          <button
            onClick={onGoToTodayTasks}
            className="text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6] hover:underline flex items-center gap-1"
          >
            <span>View All Today's Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            value={focusTask}
            onChange={(e) => setFocusTask(e.target.value)}
            placeholder="e.g. Mathematics: Algebraic Identities Homework Questions 1 to 4"
            className="w-full px-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#1E212E] text-slate-900 dark:text-[#F3F4F6] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
        </div>

        {/* Quick Preset Chips from Assigned Homework */}
        {homeworkList.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0D9488]" />
              Quick Fill from Tasks:
            </span>
            {homeworkList.map((hw) => (
              <button
                key={hw.id}
                type="button"
                onClick={() => setFocusTask(`${hw.subject}: ${hw.title}`)}
                className="px-3 py-1 rounded-xl text-xs bg-slate-100 hover:bg-slate-200 dark:bg-[#0B0B0F] dark:hover:bg-[#222430] border border-slate-200 dark:border-[#1E212E] text-slate-700 dark:text-slate-300 font-medium transition-all truncate max-w-xs"
              >
                {hw.subject} • {hw.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* PRODUCTIVITY STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Sprints Today
          </span>
          <p className="text-2xl font-black text-[#0D9488] dark:text-[#14B8A6]">
            {stats.completedPomodoros}
          </p>
          <p className="text-[11px] text-slate-500">Target: 4-6 sessions per day</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Focus Time
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-[#F3F4F6]">
            {Math.round(stats.totalFocusSeconds / 60)} mins
          </p>
          <p className="text-[11px] text-slate-500">Deep uninterrupted concentration</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-[#1E212E] space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Next Long Break In
          </span>
          <p className="text-2xl font-black text-amber-500">
            {4 - (cycleCount % 4)} sprint{4 - (cycleCount % 4) === 1 ? '' : 's'}
          </p>
          <p className="text-[11px] text-slate-500">Full 15-minute mental recovery</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPomodoro;
