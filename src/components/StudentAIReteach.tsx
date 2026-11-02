import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Pause, 
  Play, 
  Square, 
  RotateCcw, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Radio, 
  HelpCircle, 
  Lightbulb, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Zap, 
  BookOpen,
  GraduationCap,
  Calculator,
  Compass,
  Atom,
  Dna,
  FlaskConical,
  Flame,
  ArrowRight,
  FileText
} from 'lucide-react';
import { UserSession, Homework } from '../types';
import { 
  sendChatMessageToAI, 
  generateFlashcardsFromContent,
  InteractiveFlashcard,
  ChatMessage, 
  getActiveAIConfig, 
  cleanFluff,
  cleanForSpeech
} from '../services/realAIService';
import { MarkdownRenderer } from './MarkdownRenderer';
import { getHomeworksForStudent } from '../services/homeworkStore';

interface StudentAIReteachProps {
  session: UserSession;
  onGoToTodayTasks?: () => void;
}

interface SubjectPreset {
  id: string;
  subject: string;
  title: string;
  prompt: string;
  formula?: string;
  iconType: 'math' | 'physics' | 'biology' | 'chemistry';
}

const ACADEMIC_PRESETS: SubjectPreset[] = [
  // Mathematics
  {
    id: 'math-1',
    subject: 'Mathematics',
    title: 'Quadratic Formula & Nature of Roots',
    prompt: 'Explain the Quadratic Formula and how the Discriminant (b² - 4ac) determines whether roots are real, distinct, equal, or imaginary with Class 10 examples.',
    formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    iconType: 'math'
  },
  {
    id: 'math-2',
    subject: 'Mathematics',
    title: "Heron's Formula & Triangle Areas",
    prompt: "Explain Heron's formula for calculating the area of any triangle given its three sides, including semi-perimeter calculation and a step-by-step example.",
    formula: 'A = \\sqrt{s(s-a)(s-b)(s-c)}',
    iconType: 'math'
  },
  {
    id: 'math-3',
    subject: 'Mathematics',
    title: 'Trigonometric Identities (sin²θ + cos²θ = 1)',
    prompt: 'Derive and explain the three fundamental Pythagorean trigonometric identities with values for standard angles 0°, 30°, 45°, 60°, and 90°.',
    formula: '\\sin^2 \\theta + \\cos^2 \\theta = 1',
    iconType: 'math'
  },
  {
    id: 'math-4',
    subject: 'Mathematics',
    title: 'Arithmetic Progression (AP) Formulas',
    prompt: 'Explain Arithmetic Progression in Class 10: formulas for the n-th term and the sum of first n terms with step-by-step application.',
    formula: 'a_n = a + (n-1)d, \\quad S_n = \\frac{n}{2}[2a + (n-1)d]',
    iconType: 'math'
  },
  // Physics
  {
    id: 'phys-1',
    subject: 'Physics',
    title: "Ohm's Law & Series vs Parallel Circuits",
    prompt: "Explain Ohm's Law and derive the total resistance formulas for resistors connected in series and parallel. Include sample numerical calculations.",
    formula: 'V = I \\cdot R, \\quad \\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}',
    iconType: 'physics'
  },
  {
    id: 'phys-2',
    subject: 'Physics',
    title: 'Three Equations of Motion',
    prompt: 'State and derive the three equations of motion under uniform acceleration. Provide an example problem for each equation.',
    formula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 - u^2 = 2as',
    iconType: 'physics'
  },
  {
    id: 'phys-3',
    subject: 'Physics',
    title: "Newton's Three Laws of Motion",
    prompt: "Explain Newton's Three Laws of Motion with real-world Class 10 examples and derive F = ma from the change of momentum.",
    formula: 'F = m \\cdot a = \\frac{\\Delta p}{\\Delta t}',
    iconType: 'physics'
  },
  {
    id: 'phys-4',
    subject: 'Physics',
    title: "Joule's Law of Heating & Electric Power",
    prompt: "Explain Joule's Law of Heating and all formulas for Electric Power (P = VI = I²R = V²/R) with practical appliance examples.",
    formula: 'H = I^2 \\cdot R \\cdot t, \\quad P = V \\cdot I',
    iconType: 'physics'
  },
  // Biology
  {
    id: 'bio-1',
    subject: 'Biology',
    title: 'Photosynthesis: Light vs Dark Reactions',
    prompt: 'Explain the complete process of photosynthesis in plants: balanced chemical equation, events in thylakoid (light) and stroma (dark) reactions, and role of stomata.',
    formula: '6CO_2 + 6H_2O \\xrightarrow{\\text{Light, Chlorophyll}} C_6H_{12}O_6 + 6O_2',
    iconType: 'biology'
  },
  {
    id: 'bio-2',
    subject: 'Biology',
    title: 'Double Circulation in the Human Heart',
    prompt: 'Explain double circulation in human beings: pulmonary circulation vs systemic circulation, heart chambers, valves, and why separation of oxygenated and deoxygenated blood is vital.',
    formula: '\\text{Pulmonary} + \\text{Systemic Circulation}',
    iconType: 'biology'
  },
  {
    id: 'bio-3',
    subject: 'Biology',
    title: 'Nephron Structure & Urine Formation',
    prompt: 'Explain the structure of a nephron and the 3 stages of urine formation: Glomerular filtration, tubular reabsorption, and tubular secretion.',
    formula: '\\text{Ultrafiltration} \\rightarrow \\text{Reabsorption} \\rightarrow \\text{Secretion}',
    iconType: 'biology'
  },
  // Chemistry
  {
    id: 'chem-1',
    subject: 'Chemistry',
    title: 'Balancing Chemical Equations',
    prompt: 'Explain the step-by-step method to balance chemical equations using the Law of Conservation of Mass with 3 Class 10 examples.',
    formula: '\\text{Total Mass of Reactants} = \\text{Total Mass of Products}',
    iconType: 'chemistry'
  },
  {
    id: 'chem-2',
    subject: 'Chemistry',
    title: 'Acids, Bases, Salts & pH Scale',
    prompt: 'Explain the concept of pH scale (0 to 14), properties of acids and bases, indicators (litmus, phenolphthalein), and neutralization reactions.',
    formula: '\\text{pH} = -\\log[H^+], \\quad \\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}',
    iconType: 'chemistry'
  },
  {
    id: 'chem-3',
    subject: 'Chemistry',
    title: 'Reactivity Series & Displacement Reactions',
    prompt: 'Explain the reactivity series of metals (K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Hg, Ag, Au) and single/double displacement reactions with chemical equations.',
    formula: 'Fe + CuSO_4 \\rightarrow FeSO_4 + Cu',
    iconType: 'chemistry'
  }
];

export const StudentAIReteach: React.FC<StudentAIReteachProps> = ({ session, onGoToTodayTasks }) => {
  // Extract student's pre-selected grade from session.classLevel (e.g. 'Class 10-D' -> 10)
  // Mobile Tab State ('chat' | 'hub') for responsive mobile layout
  const [mobileTab, setMobileTab] = useState<'chat' | 'hub'>('chat');

  const studentGrade = parseInt(String(session.classLevel || '10').replace(/[^0-9]/g, '')) || 10;
  
  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('neurova_chat_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `### Welcome to Neurova AI Tutor (Class ${studentGrade})

I am ready to answer any question or explain any topic across **Physics, Chemistry, Biology, and Mathematics**.

- Ask any question below in natural language or with formulas.
- Tap **"Listen to Voice"** on any response to hear it explained aloud with live teleprompter.
- Click **"10 Flashcards"** on any topic to test your recall.
- Use the **Today's Tasks** and **Subject Presets** on the right for instant 1-click reteach!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputQuery, setInputQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Homework Tasks for Today
  const [todayTasks, setTodayTasks] = useState<Homework[]>([]);

  useEffect(() => {
    const tasks = getHomeworksForStudent(session.classLevel, session.section);
    setTodayTasks(tasks);

    const handleHwChange = () => {
      setTodayTasks(getHomeworksForStudent(session.classLevel, session.section));
    };
    window.addEventListener('neurova_homework_changed', handleHwChange);
    return () => window.removeEventListener('neurova_homework_changed', handleHwChange);
  }, [session.classLevel, session.section]);

  // Subject Preset Filter Tab
  const [presetSubjectTab, setPresetSubjectTab] = useState<string>('All');

  // Flashcards Modal State
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [currentFlashcards, setCurrentFlashcards] = useState<InteractiveFlashcard[]>([]);
  const [flashcardTopic, setFlashcardTopic] = useState('');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isLoadingFlashcards, setIsLoadingFlashcards] = useState(false);

  // Speech Synthesis & Live Teleprompter State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [activeSpeechTitle, setActiveSpeechTitle] = useState('');
  const [spokenWordsList, setSpokenWordsList] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // References for reliable Speech Tracking & SpeechSynthesis Garbage Collection Prevention
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechIntervalRef = useRef<any>(null);
  const keepAliveTimerRef = useRef<any>(null);
  const chunkQueueRef = useRef<{ chunks: string[]; currentIndex: number }>({ chunks: [], currentIndex: 0 });

  // Speech Recognition (Voice Input / Transcription)
  const [isListeningMic, setIsListeningMic] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Chat container reference for auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const teleprompterScrollRef = useRef<HTMLDivElement>(null);

  // Save messages to LocalStorage
  useEffect(() => {
    localStorage.setItem('neurova_chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Keep karaoke teleprompter centered smoothly on active word
  useEffect(() => {
    if (activeWordRef.current && teleprompterScrollRef.current) {
      const container = teleprompterScrollRef.current;
      const word = activeWordRef.current;
      const offset = word.offsetTop - container.offsetTop - (container.clientHeight / 2) + (word.clientHeight / 2);
      container.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    }
  }, [currentWordIndex]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
    };
  }, []);

  // ========================================================
  // ROBUST MULTI-CHUNK SPEECH SYNTHESIS ENGINE
  // ========================================================
  const speakMessage = (text: string, title: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    // Cancel any active speech & clear timers
    window.speechSynthesis.cancel();
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);

    // Clean text into natural spoken English
    const spokenText = cleanForSpeech(text);
    const words = spokenText.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return;

    setSpokenWordsList(words);
    setCurrentWordIndex(0);
    setActiveSpeechTitle(title);
    setIsSpeaking(true);
    setIsPaused(false);

    // Split text into natural sentence chunks (~160-220 characters) so Chromium NEVER stops
    const sentenceChunks: string[] = [];
    const rawSentences = spokenText.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [spokenText];
    let currentChunk = '';
    for (const sent of rawSentences) {
      if ((currentChunk + ' ' + sent).length > 200) {
        if (currentChunk.trim()) sentenceChunks.push(currentChunk.trim());
        currentChunk = sent;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sent.trim();
      }
    }
    if (currentChunk.trim()) sentenceChunks.push(currentChunk.trim());

    chunkQueueRef.current = {
      chunks: sentenceChunks,
      currentIndex: 0
    };

    // Pick a natural sounding voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('Guy')));

    const playNextChunk = () => {
      const q = chunkQueueRef.current;
      if (q.currentIndex >= q.chunks.length) {
        setIsSpeaking(false);
        setIsPaused(false);
        setCurrentWordIndex(0);
        if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
        if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
        return;
      }

      const chunkText = q.chunks[q.currentIndex];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      utterance.rate = speechRate;
      utterance.pitch = 1.0;
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => {
        q.currentIndex++;
        playNextChunk();
      };

      utterance.onerror = (err) => {
        console.warn('Speech chunk warning:', err);
        q.currentIndex++;
        playNextChunk();
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    // Resilient Word Ticker: Advances currentWordIndex steadily in sync with spoken duration
    const msPerWord = Math.max(160, Math.round(320 / speechRate));
    speechIntervalRef.current = setInterval(() => {
      setCurrentWordIndex(prev => {
        if (prev >= words.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, msPerWord);

    // Chrome 15s keep-alive watchdog
    keepAliveTimerRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    // Start playback after a brief 50ms delay so cancel() fully completes
    setTimeout(() => {
      playNextChunk();
    }, 50);
  };

  const handleTogglePause = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      const msPerWord = Math.max(160, Math.round(320 / speechRate));
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= spokenWordsList.length - 1) {
            return prev;
          }
          return prev + 1;
        });
      }, msPerWord);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    }
  };

  const handleStopSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    if (keepAliveTimerRef.current) clearInterval(keepAliveTimerRef.current);
    chunkQueueRef.current = { chunks: [], currentIndex: 0 };
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWordIndex(0);
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    if (isSpeaking && !isPaused && spokenWordsList.length > 0) {
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      const msPerWord = Math.max(160, Math.round(320 / newRate));
      speechIntervalRef.current = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= spokenWordsList.length - 1) {
            return prev;
          }
          return prev + 1;
        });
      }, msPerWord);
    }
  };

  // ========================================================
  // SPEECH RECOGNITION (VOICE INPUT / TRANSCRIPTION)
  // ========================================================
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListeningMic) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (fullTranscript.trim()) {
          setInputQuery(fullTranscript);
        }
      };

      recognition.onerror = (err: any) => {
        console.warn('Speech recognition warning:', err);
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListeningMic(true);
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListeningMic(false);
    }
  };

  // ========================================================
  // CORE CHAT SUBMISSION
  // ========================================================
  const handleSendMessage = async (textToSend?: string, autoSpeak: boolean = false, customSpeechTitle?: string) => {
    setMobileTab('chat');
    const query = (textToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    setInputQuery('');

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsGenerating(true);

    try {
      const aiResponse = await sendChatMessageToAI(newHistory, {
        grade: studentGrade,
        subject: selectedSubject
      });

      const cleanReply = cleanFluff(aiResponse.reply);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: cleanReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages([...newHistory, aiMsg]);

      if (autoSpeak) {
        const speechTitle = customSpeechTitle || (query.length > 30 ? query.substring(0, 30) + '...' : query);
        speakMessage(aiResponse.audioScript || cleanReply, speechTitle);
      }
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `### Solution
An error occurred while generating the response: ${err?.message || 'Please verify your network connection.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear all conversation history?')) {
      localStorage.removeItem('neurova_chat_messages');
      setMessages([
        {
          id: 'msg_welcome_reset',
          role: 'assistant',
          content: `### Neurova AI Tutor (Class ${studentGrade})
Chat history cleared. What topic or problem would you like to explore?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      handleStopSpeech();
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open 10 Flashcards modal
  const handleOpenFlashcards = async (content: string, title: string) => {
    setIsLoadingFlashcards(true);
    setShowFlashcardsModal(true);
    setFlashcardIndex(0);
    setIsCardFlipped(false);
    setFlashcardTopic(title);

    try {
      const res = await generateFlashcardsFromContent(content, {
        grade: studentGrade,
        subject: selectedSubject
      });
      setCurrentFlashcards(res.cards);
      setFlashcardTopic(res.topic || title);
    } catch {
      // Fallback handles it automatically
    } finally {
      setIsLoadingFlashcards(false);
    }
  };

  // Build full task context prompt including topic and all assigned questions
  const buildTaskPrompt = (hw: Homework, mode: 'explain' | 'summary' | 'voice') => {
    const questionsBlock = (hw.questions && hw.questions.length > 0)
      ? hw.questions.map((q, idx) => `Question ${idx + 1}: ${q.question}`).join('\n')
      : 'Review all core chapter exercises and fundamentals.';

    if (mode === 'voice') {
      return `Class ${studentGrade} ${hw.subject} — Detailed Spoken Audio Lecture & Summary: "${hw.title}"

Assigned Questions for Context:
${questionsBlock}

Please deliver a comprehensive, spoken-style detailed audio lecture and revision summary of this topic.
Structure your detailed spoken lesson:
1. Core Conceptual Foundation & Big-Picture Scientific Meaning
2. Complete Step-by-Step Explanation of Key Principles
3. All Governing Formulas & Laws explained clearly in spoken words (e.g. "Force equals mass times acceleration")
4. Practical Problem-Solving Strategy & Direct Walkthrough of the assigned questions
5. Crucial Exam Pitfalls & High-Yield Takeaways

Ensure the explanation is rich, detailed, thoroughly educational, and easy to follow when spoken aloud.`;
    }

    if (mode === 'summary') {
      return `Class ${studentGrade} ${hw.subject} — Quick Revision Summary: "${hw.title}"

Assigned Questions Context:
${questionsBlock}

Please provide a concise, high-yield revision summary for this topic. Include core scientific/mathematical principles, key formulas, and quick conceptual pointers for exam preparation.`;
    }

    return `Class ${studentGrade} ${hw.subject} — Today's Task: "${hw.title}"

Assigned Questions:
${questionsBlock}

Please provide a comprehensive conceptual breakdown of this topic along with complete, step-by-step academic solutions and explanations for all the assigned questions above.`;
  };

  // Subject Preset Filtering
  const filteredPresets = ACADEMIC_PRESETS.filter(p => {
    if (presetSubjectTab === 'All') return true;
    if (presetSubjectTab === 'Maths') return p.subject === 'Mathematics';
    return p.subject.toLowerCase() === presetSubjectTab.toLowerCase();
  });

  return (
    <div className="flex-1 flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 h-full min-h-0 overflow-hidden bg-[#F8FAFB] dark:bg-[#0B0B0F]">
      {/* Mobile Tab Switcher (< lg) */}
      <div className="lg:hidden flex items-center p-1 bg-slate-200/80 dark:bg-[#15161E] rounded-xl shrink-0 gap-1 border border-slate-300/40 dark:border-[#202330]">
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'chat'
              ? 'bg-white dark:bg-[#202330] text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-emerald-500" />
          <span>AI Chat Tutor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('hub')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'hub'
              ? 'bg-white dark:bg-[#202330] text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Study Hub & Presets</span>
          {todayTasks.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
              {todayTasks.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 min-h-0 overflow-hidden">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: WIDE AI CHATBOT (EXPANDED BREADTH)          */}
      {/* ======================================================== */}
      <div className={`flex-1 min-w-0 flex flex-col h-full bg-white dark:bg-[#11131A] rounded-xl border border-slate-200/80 dark:border-[#1E212E] shadow-2xs overflow-hidden ${mobileTab === "chat" ? "flex" : "hidden lg:flex"}`}>
        
        {/* Header Bar */}
        <div className="p-3 sm:p-3.5 border-b border-slate-200 dark:border-[#1E212E] flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                  Neurova AI Tutor
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>AI Active</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Interactive AI Tutor answering any question with live voice teleprompter
              </p>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Class Pre-selected Badge (Locked to enrolled student class) */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />
              <span>Class {studentGrade}</span>
            </div>

            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#1E212E] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {['All Subjects', 'Physics', 'Biology', 'Chemistry', 'Mathematics'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] text-slate-500 hover:text-rose-500 transition-all border border-slate-200 dark:border-[#1E212E]"
              title="Clear Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Voice Teleprompter Banner (When Speaking) */}
        <AnimatePresence>
          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden shrink-0 border-b border-emerald-500/30"
            >
              <div className="p-3 bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex h-2.5 w-2.5 relative shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                    <span className="font-extrabold text-emerald-400 truncate">
                      Oral Audio Lecture: {activeSpeechTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {[1.0, 1.25, 1.5].map(rate => (
                      <button
                        key={rate}
                        onClick={() => handleRateChange(rate)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          speechRate === rate ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}

                    <button
                      onClick={handleTogglePause}
                      className="p-1 rounded-md bg-white/10 hover:bg-white/20 text-white"
                      title={isPaused ? "Resume" : "Pause"}
                    >
                      {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={handleStopSpeech}
                      className="p-1 rounded-md bg-rose-500 hover:bg-rose-600 text-white"
                      title="Stop Audio"
                    >
                      <Square className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle / Teleprompter word stream with high contrast */}
                <div
                  ref={teleprompterScrollRef}
                  className="p-3 rounded-2xl bg-[#07070A] border border-emerald-500/30 max-h-32 overflow-y-auto leading-relaxed text-xs sm:text-sm font-medium select-none"
                >
                  <p className="flex flex-wrap gap-x-1.5 gap-y-1">
                    {spokenWordsList.map((word, idx) => {
                      const isCurrent = idx === currentWordIndex;
                      const isPast = idx < currentWordIndex;
                      return (
                        <span
                          key={idx}
                          ref={isCurrent ? activeWordRef : null}
                          className={`transition-all duration-150 rounded px-1 py-0.2 ${
                            isCurrent
                              ? 'bg-emerald-500 text-white font-black shadow-md ring-2 ring-emerald-300/60 scale-105 z-10'
                              : isPast
                              ? 'text-slate-400 dark:text-slate-500'
                              : 'text-slate-200 dark:text-slate-100'
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages Stream (Generous Width) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className="w-full max-w-[96%] sm:max-w-[92%] space-y-2">
                  <div
                    className={`p-4 sm:p-5 rounded-3xl ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-slate-100 dark:bg-[#1A1D27] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-[#2A2E3D] rounded-tl-sm shadow-xs'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>

                  {/* Actions under AI messages */}
                  {!isUser && (
                    <div className="flex items-center gap-2 px-1 flex-wrap">
                      <button
                        onClick={() => speakMessage(msg.content, 'Audio Summary')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen to Voice</span>
                      </button>

                      <button
                        onClick={() => handleOpenFlashcards(msg.content, 'Revision Flashcards')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200/60 dark:bg-[#222430] hover:bg-slate-300 dark:hover:bg-[#2A2E3D] text-slate-700 dark:text-slate-300 border border-slate-300/40 dark:border-[#333748] flex items-center gap-1.5 transition-all"
                      >
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span>10 Flashcards</span>
                      </button>

                      <button
                        onClick={() => handleCopyText(msg.content, msg.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      <span className="text-[10px] text-slate-400 ml-auto font-mono">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {/* AI Thinking Indicator */}
          {isGenerating && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-3xl bg-slate-100 dark:bg-[#1A1D27] border border-slate-200 dark:border-[#2A2E3D] rounded-tl-sm flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                </span>
                <span>Neurova AI is formulating step-by-step answer...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Floating Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-[#1E212E] bg-white dark:bg-[#11131A] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-50 dark:bg-[#0B0C12] border border-slate-200 dark:border-[#1E212E] rounded-xl px-3 py-2 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all"
          >
            {/* Mic Voice Input Toggle */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl transition-all ${
                isListeningMic
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-emerald-500'
              }`}
              title={isListeningMic ? "Stop Listening" : "Voice Input"}
            >
              {isListeningMic ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Query Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask any question in Class ${studentGrade} ${selectedSubject}... (e.g. Explain Ohm's law with calculation)`}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
              disabled={isGenerating}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || isGenerating}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: QUICK STUDY HUB (COMPACT WIDTH W-80)       */}
      {/* ======================================================== */}
      <div className={`w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col h-full bg-white dark:bg-[#11131A] rounded-xl border border-slate-200/80 dark:border-[#1E212E] shadow-2xs overflow-hidden p-3.5 space-y-3 ${mobileTab === "hub" ? "flex" : "hidden lg:flex"}`}>
        
        {/* Hub Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E212E] shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Quick Study Hub
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                1-Click Reteach & Subject Presets
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase">
            Class {studentGrade}
          </span>
        </div>

        {/* Scrollable Container for Tasks & Presets */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">

          {/* ======================================================== */}
          {/* SECTION 1: TODAY'S TASKS RETEACH                         */}
          {/* ======================================================== */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>Today's Tasks ({todayTasks.length})</span>
              </span>
              {onGoToTodayTasks && (
                <button
                  onClick={onGoToTodayTasks}
                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View Tasks
                </button>
              )}
            </div>

            {todayTasks.length === 0 ? (
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#1E212E] text-center text-xs text-slate-400">
                No tasks assigned for today.
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((hw) => {
                  const subjectColor = 
                    hw.subject.toLowerCase() === 'mathematics' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                    hw.subject.toLowerCase() === 'physics' ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' :
                    hw.subject.toLowerCase() === 'biology' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' :
                    'text-purple-500 bg-purple-500/10 border-purple-500/20';

                  return (
                    <div
                      key={hw.id}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] border border-slate-200 dark:border-[#1E212E] transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${subjectColor}`}>
                          {hw.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {hw.dueDate || 'Today'}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {hw.title}
                      </h4>

                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {hw.questions?.length || 0} practice questions assigned
                      </p>

                      {/* 3 Action Buttons: Explain Task | Summary | Voice */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        <button
                          onClick={() => {
                            const prompt = buildTaskPrompt(hw, 'explain');
                            handleSendMessage(prompt, false);
                          }}
                          className="py-1.5 px-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                          title="Explain topic and solve all assigned questions"
                        >
                          <Zap className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>Explain</span>
                        </button>

                        <button
                          onClick={() => {
                            const prompt = buildTaskPrompt(hw, 'summary');
                            handleSendMessage(prompt, false);
                          }}
                          className="py-1.5 px-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                          title="Quick revision summary & formula cheat sheet"
                        >
                          <FileText className="w-3 h-3 text-cyan-500 shrink-0" />
                          <span>Summary</span>
                        </button>

                        <button
                          onClick={() => {
                            const prompt = buildTaskPrompt(hw, 'voice');
                            handleSendMessage(prompt, true, hw.title);
                          }}
                          className="py-1.5 px-1.5 rounded-xl bg-slate-200 dark:bg-[#222430] hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                          title="Voice Reteach with live teleprompter"
                        >
                          <Volume2 className="w-3 h-3 shrink-0" />
                          <span>Voice</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* SECTION 2: ALL SUBJECTS PRESETS                          */}
          {/* ======================================================== */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Subject Presets</span>
              </span>
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Maths', 'Physics', 'Biology', 'Chemistry'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPresetSubjectTab(tab)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                    presetSubjectTab === tab
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-[#0B0B0F] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Preset Cards List */}
            <div className="space-y-2">
              {filteredPresets.map((preset) => {
                const getIcon = () => {
                  switch (preset.iconType) {
                    case 'math': return <Calculator className="w-3.5 h-3.5 text-blue-500" />;
                    case 'physics': return <Atom className="w-3.5 h-3.5 text-amber-500" />;
                    case 'biology': return <Dna className="w-3.5 h-3.5 text-emerald-500" />;
                    case 'chemistry': return <FlaskConical className="w-3.5 h-3.5 text-purple-500" />;
                  }
                };

                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSendMessage(preset.prompt, false)}
                    className="w-full text-left p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0B0B0F] dark:hover:bg-[#1A1D27] border border-slate-200 dark:border-[#1E212E] hover:border-emerald-500/40 transition-all group space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {getIcon()}
                        <span className="text-[10px] font-black uppercase text-slate-400">
                          {preset.subject}
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-all group-hover:translate-x-0.5" />
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {preset.title}
                    </div>

                    {preset.formula && (
                      <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">
                        {preset.formula}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      </div>

      {/* ======================================================== */}
      {/* 10 FLASHCARDS MODAL                                      */}
      {/* ======================================================== */}
      <AnimatePresence>
        {showFlashcardsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-white dark:bg-[#11131A] border border-slate-200 dark:border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E212E]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      10 Revision Flashcards
                    </h3>
                    <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                      {flashcardTopic}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowFlashcardsModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#222430] text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Flashcard Body */}
              {isLoadingFlashcards ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-400">
                    Extracting high-yield exam flashcards...
                  </p>
                </div>
              ) : currentFlashcards.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No flashcards available.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Card Flip Component */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="min-h-[220px] p-6 rounded-3xl bg-slate-50 dark:bg-[#0B0B0F] border-2 border-emerald-500/30 hover:border-emerald-500 cursor-pointer flex flex-col justify-between transition-all select-none shadow-inner"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-emerald-500 uppercase tracking-wider">
                        {isCardFlipped ? 'ANSWER' : 'QUESTION'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> Click to Flip
                      </span>
                    </div>

                    <div className="my-auto py-2">
                      {isCardFlipped ? (
                        <div className="text-slate-800 dark:text-slate-100 text-sm font-semibold leading-relaxed">
                          <MarkdownRenderer content={currentFlashcards[flashcardIndex]?.answer || ''} />
                        </div>
                      ) : (
                        <div className="text-slate-900 dark:text-white text-base font-bold leading-relaxed">
                          <MarkdownRenderer content={currentFlashcards[flashcardIndex]?.question || ''} />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-[#1E212E]">
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        {currentFlashcards[flashcardIndex]?.hint || `Class ${studentGrade} Revision`}
                      </span>
                      <span className="font-mono font-bold">
                        Card {flashcardIndex + 1} of {currentFlashcards.length}
                      </span>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setIsCardFlipped(false);
                        setFlashcardIndex(prev => Math.max(0, prev - 1));
                      }}
                      disabled={flashcardIndex === 0}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1A1D27] disabled:opacity-40 text-slate-800 dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsCardFlipped(false);
                        setFlashcardIndex(prev => Math.min(currentFlashcards.length - 1, prev + 1));
                      }}
                      disabled={flashcardIndex === currentFlashcards.length - 1}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
