import { Homework, StudentSubmission, ClassLevel, Section, AIAnalysisReport } from '../types';

const HOMEWORK_STORAGE_KEY = 'neurova_published_homework';
const SUBMISSIONS_STORAGE_KEY = 'neurova_student_submissions';

export const getStoredHomeworks = (): Homework[] => {
  try {
    const raw = localStorage.getItem(HOMEWORK_STORAGE_KEY);
    const defaultSeeds: Homework[] = [
      {
        id: 'hw_seed_bio_1',
        title: 'Life Processes: Photosynthesis, Respiration & Circulation',
        subject: 'Biology',
        targetClass: 'ALL',
        targetSection: 'ALL',
        teacherEmail: 'teacher@neurova.edu',
        dueDate: 'Today, 8:30 PM',
        createdAt: new Date().toISOString(),
        questions: [
          { id: 'q1', number: 1, question: 'Write the complete balanced chemical equation for photosynthesis and name the site of light-dependent reactions in chloroplasts.' },
          { id: 'q2', number: 2, question: 'Differentiate between aerobic and anaerobic respiration in terms of end products and ATP yield per glucose molecule.' },
          { id: 'q3', number: 3, question: 'Trace the complete pathway of blood through the human heart, explaining why double circulation is necessary for mammals.' },
          { id: 'q4', number: 4, question: 'Explain the mechanism of urine formation in a nephron, detailing ultrafiltration and selective reabsorption.' },
          { id: 'q5', number: 5, question: 'In a monohybrid cross between homozygous tall (TT) and dwarf (tt) pea plants, determine the phenotypic and genotypic ratios of the F2 generation using a Punnett square.' },
        ]
      },
      {
        id: 'hw_seed_physics_1',
        title: "Newton's Laws of Motion & Kinematics",
        subject: 'Physics',
        targetClass: 'ALL',
        targetSection: 'ALL',
        teacherEmail: 'teacher@neurova.edu',
        dueDate: 'Today, 9:00 PM',
        createdAt: new Date().toISOString(),
        questions: [
          { id: 'q1', number: 1, question: 'A car of mass 1200 kg accelerates uniformly from rest to 20 m/s in 10 s. Calculate the net accelerating force acting on the car.' },
          { id: 'q2', number: 2, question: 'State Newton\'s Second Law of Motion and derive the relationship F = ma from momentum change.' },
          { id: 'q3', number: 3, question: 'A ball is projected vertically upward with an initial velocity of 29.4 m/s. Find the maximum height reached (take g = 9.8 m/s²).' },
          { id: 'q4', number: 4, question: 'A constant force of 50 N acts on an object of mass 10 kg initially at rest. Calculate the displacement covered in 6 seconds.' },
          { id: 'q5', number: 5, question: 'Explain why an athlete runs a distance before taking a long jump, referring to inertia of motion.' },
        ]
      },
      {
        id: 'hw_seed_1',
        title: 'Algebraic Expressions & Identities',
        subject: 'Mathematics',
        targetClass: 'ALL',
        targetSection: 'ALL',
        teacherEmail: 'teacher@neurova.edu',
        dueDate: 'Today, 8:00 PM',
        createdAt: new Date().toISOString(),
        questions: [
          { id: 'q1', number: 1, question: 'Simplify the expression: (2x + 3)(2x - 3) using standard algebraic identities.' },
          { id: 'q2', number: 2, question: 'Factorize completely: 4a² - 12ab + 9b².' },
          { id: 'q3', number: 3, question: 'Find the value of (103)² without direct multiplication.' },
          { id: 'q4', number: 4, question: 'Expand: (x + 2y + 4z)².' },
          { id: 'q5', number: 5, question: 'Verify whether x = 2 is a root of polynomial P(x) = 2x³ - 5x + 1.' },
        ]
      }
    ];

    if (!raw) {
      localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(defaultSeeds));
      return defaultSeeds;
    }

    const parsed: Homework[] = JSON.parse(raw);
    let updated = false;

    // Ensure physics seed exists so multi-subject AI Reteach works out-of-the-box
    if (!parsed.some(h => h.subject.toLowerCase() === 'physics')) {
      parsed.unshift(defaultSeeds[0]);
      updated = true;
    }
        // Ensure biology seed exists
    if (!parsed.some(h => h.subject.toLowerCase() === 'biology')) {
      parsed.push(defaultSeeds[0]);
      updated = true;
    }
    // Ensure math seed exists
    if (!parsed.some(h => h.subject.toLowerCase() === 'mathematics')) {
      parsed.push(defaultSeeds[1]);
      updated = true;
    }

    if (updated) {
      localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch {
    return [];
  }
};

export const publishHomework = (hw: Omit<Homework, 'id' | 'createdAt'>): Homework => {
  const current = getStoredHomeworks();
  const newHomework: Homework = {
    ...hw,
    id: `hw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newHomework, ...current];
  localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('neurova_homework_changed'));
  return newHomework;
};

export const updateHomework = (id: string, updatedFields: Partial<Omit<Homework, 'id' | 'createdAt'>>): Homework | null => {
  const current = getStoredHomeworks();
  const index = current.findIndex(h => h.id === id);
  if (index === -1) return null;

  const updated: Homework = {
    ...current[index],
    ...updatedFields,
  };

  current[index] = updated;
  localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event('neurova_homework_changed'));
  return updated;
};

export const deleteHomework = (id: string) => {
  const current = getStoredHomeworks();
  const updated = current.filter(h => h.id !== id);
  localStorage.setItem(HOMEWORK_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('neurova_homework_changed'));
};

export const getHomeworksForStudent = (classLevel?: ClassLevel, section?: Section): Homework[] => {
  const all = getStoredHomeworks();
  if (!classLevel) return all;

  return all.filter(hw => {
    const classMatch = hw.targetClass === 'ALL' || hw.targetClass === classLevel;
    const sectionMatch = hw.targetSection === 'ALL' || hw.targetSection === section;
    return classMatch && sectionMatch;
  });
};

export const getStudentSubmissions = (studentKey: string): Record<string, StudentSubmission> => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!raw) return {};
    const all = JSON.parse(raw);
    return all[studentKey] || {};
  } catch {
    return {};
  }
};

export const getAllSubmissions = (): StudentSubmission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (!raw) return [];
    const all: Record<string, Record<string, StudentSubmission>> = JSON.parse(raw);
    const list: StudentSubmission[] = [];
    Object.values(all).forEach(studentMap => {
      Object.values(studentMap).forEach(sub => {
        if (sub.status === 'submitted') {
          list.push(sub);
        }
      });
    });
    return list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  } catch {
    return [];
  }
};

export const getAllSubmissionsForTeacher = (assignedClasses: { classLevel: ClassLevel; section: Section }[]): StudentSubmission[] => {
  const all = getAllSubmissions();
  if (!assignedClasses || assignedClasses.length === 0) return all;

  return all.filter(sub => {
    const subClassNum = parseInt(String(sub.classLevel || '').replace(/[^0-9]/g, '')) || 10;
    const subSec = String(sub.section || '').replace(/[^A-Za-z]/g, '').toUpperCase();

    return assignedClasses.some(ac => {
      const acClassNum = parseInt(String(ac.classLevel || '').replace(/[^0-9]/g, '')) || 10;
      const acSec = String(ac.section || '').replace(/[^A-Za-z]/g, '').toUpperCase();
      const classMatch = subClassNum === acClassNum;
      const secMatch = !acSec || !subSec || acSec === subSec || acSec === 'ALL';
      return classMatch && secMatch;
    });
  });
};

export const saveStudentSubmission = (
  submissionData: {
    studentKey: string;
    homeworkId: string;
    homeworkTitle?: string;
    subject?: string;
    studentName?: string;
    classLevel?: ClassLevel;
    section?: Section;
    rollNumber?: string;
    answers: Record<string, string>;
    attachments?: any[];
    voiceExplanation?: any;
    aiAnalysis?: any;
    status: 'pending' | 'submitted';
  }
) => {
  try {
    const { studentKey, homeworkId, status } = submissionData;
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[studentKey]) all[studentKey] = {};

    const existing = all[studentKey][homeworkId] || {};

    const updated: StudentSubmission = {
      ...existing,
      ...submissionData,
      id: existing.id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      submittedAt: status === 'submitted' ? (existing.submittedAt || new Date().toISOString()) : undefined,
    };

    all[studentKey][homeworkId] = updated;

    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('neurova_submissions_changed'));
    return updated;
  } catch (err) {
    console.error('Failed to save submission:', err);
    return null;
  }
};

export const updateTeacherReview = (
  studentKey: string,
  homeworkId: string,
  grade: string,
  feedback: string
) => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[studentKey] || !all[studentKey][homeworkId]) return;

    all[studentKey][homeworkId].teacherGrade = grade;
    all[studentKey][homeworkId].teacherFeedback = feedback;

    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('neurova_submissions_changed'));
  } catch (err) {
    console.error('Failed to update teacher review:', err);
  }
};

export const getAIAnalysisReports = (studentKey: string): AIAnalysisReport[] => {
  const subs = getStudentSubmissions(studentKey);
  const reports: AIAnalysisReport[] = [];
  Object.values(subs).forEach(sub => {
    if (sub.aiAnalysis) {
      reports.push(sub.aiAnalysis);
    }
  });
  return reports.sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());
};
