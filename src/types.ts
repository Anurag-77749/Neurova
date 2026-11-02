export type Role = 'student' | 'teacher' | 'admin';
export type ClassLevel = 6 | 7 | 8 | 9 | 10;
export type Section = 'A' | 'B' | 'C' | 'D';

export interface AssignedClass {
  classLevel: ClassLevel;
  section: Section;
}

export interface UserSession {
  role: Role;
  name?: string;
  classLevel?: ClassLevel;
  section?: Section;
  rollNumber?: string;
  email?: string;
  staffId?: string;
  assignedClasses?: AssignedClass[];
  mustChangePassword?: boolean;
}

export interface StudentAccount {
  id: string; // `${classLevel}_${section}_${rollNumber}`
  name: string;
  classLevel: ClassLevel;
  section: Section;
  rollNumber: string;
  passwordHash: string;
  plainPassword?: string;
  mustChangePassword: boolean;
  isLocked: boolean;
  failedAttempts: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TeacherAccount {
  id: string; // email
  name: string;
  staffId: string;
  email: string;
  assignedClasses: AssignedClass[];
  passwordHash: string;
  plainPassword?: string;
  mustChangePassword: boolean;
  isLocked: boolean;
  failedAttempts: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAccount {
  email: string;
  name: string;
  passwordHash: string;
  plainPassword?: string;
  phone: string;
  recoveryCode: string;
  failedAttempts: number;
  isLocked: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: 
    | 'CREATE_STUDENT' 
    | 'CREATE_TEACHER' 
    | 'SET_TEMP_PASSWORD' 
    | 'UNLOCK_ACCOUNT' 
    | 'UPDATE_TEACHER_CLASSES' 
    | 'DELETE_ACCOUNT';
  targetRole: 'student' | 'teacher';
  targetIdentifier: string;
  details: string;
}

export interface HomeworkQuestion {
  id: string;
  number: number;
  question: string;
  marks?: number;
}

export interface Homework {
  id: string;
  title: string;
  subject: string;
  targetClass: ClassLevel | 'ALL';
  targetSection: Section | 'ALL';
  teacherEmail: string;
  dueDate: string;
  createdAt: string;
  questions: HomeworkQuestion[];
}

export interface SolutionAttachment {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // base64 or blob URL for viewing
}

export interface VoiceExplanation {
  audioUrl?: string; // audio data/blob
  durationSeconds?: number;
  transcript?: string;
  conceptTopic?: string;
}

export interface ConceptualEvaluation {
  topic: string;
  category: 'strong' | 'average' | 'weak';
  finding: string;
  improvementTip: string;
}

export interface LineByLineFeedback {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  status: 'correct' | 'partial' | 'needs_work';
  critique: string;
  correctiveGuidance: string;
  verifiedFromNotes?: string;
}

export interface SolutionNotesStep {
  questionNumber: number;
  detectedFormula?: string;
  verifiedSteps: string[];
  isStepComplete: boolean;
}

export interface SolutionNotesAnalysis {
  analyzedPagesCount: number;
  legibility: 'High' | 'Moderate' | 'Low';
  derivationRigorScore: number; // 0 - 100
  detectedSteps: SolutionNotesStep[];
  handwritingObservations: string[];
  pedagogicalRemarks: string;
}

export interface AIAnalysisReport {
  id: string;
  homeworkId: string;
  homeworkTitle: string;
  subject: string;
  studentKey: string;
  studentName?: string;
  overallScore: number; // 0 - 100
  overallSummary: string;
  evaluations: ConceptualEvaluation[];
  lineByLineAnalysis: LineByLineFeedback[];
  solutionNotesAnalysis?: SolutionNotesAnalysis;
  voiceAnalysis: {
    clarityScore: number; // 0 - 100
    comprehensionDepth: string;
    identifiedMisconceptions: string[];
    positiveHighlights: string[];
  };
  recommendations: string[];
  analyzedAt: string;
}

export interface StudentSubmission {
  id?: string;
  homeworkId: string;
  homeworkTitle?: string;
  subject?: string;
  studentKey: string; // `${class}_${section}_${roll}`
  studentName?: string;
  classLevel?: ClassLevel;
  section?: Section;
  rollNumber?: string;
  answers: Record<string, string>; // questionId -> answer
  attachments?: SolutionAttachment[];
  voiceExplanation?: VoiceExplanation;
  aiAnalysis?: AIAnalysisReport;
  status: 'pending' | 'submitted';
  submittedAt?: string;
  teacherGrade?: string;
  teacherFeedback?: string;
}

export type TeacherTab = 'publish-hw' | 'submissions' | 'students-progress' | 'my-classes';
