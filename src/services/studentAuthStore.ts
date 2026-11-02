import { ClassLevel, Section } from '../types';

const STUDENT_ACCOUNTS_KEY = 'neurova_student_accounts';

export interface StudentAccount {
  classLevel: ClassLevel;
  section: Section;
  rollNumber: string;
  studentName?: string;
  password: string;
  createdAt: string;
  updatedAt?: string;
}

export const getAllStudentAccounts = (): Record<string, StudentAccount> => {
  try {
    const raw = localStorage.getItem(STUDENT_ACCOUNTS_KEY);
    if (!raw) {
      // Seed initial demo accounts so testing is smooth out-of-the-box
      const seeded: Record<string, StudentAccount> = {
        '8_B_24': {
          classLevel: 8,
          section: 'B',
          rollNumber: '24',
          studentName: 'Alex Rivera',
          password: 'pass',
          createdAt: new Date().toISOString(),
        },
        '10_A_1': {
          classLevel: 10,
          section: 'A',
          rollNumber: '1',
          studentName: 'Maya Sharma',
          password: 'pass',
          createdAt: new Date().toISOString(),
        },
      };
      localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const getStudentAccount = (
  classLevel: ClassLevel,
  section: Section,
  rollNumber: string
): StudentAccount | null => {
  const accounts = getAllStudentAccounts();
  const key = `${classLevel}_${section}_${rollNumber.trim().toUpperCase()}`;
  return accounts[key] || null;
};

export const saveStudentAccount = (
  classLevel: ClassLevel,
  section: Section,
  rollNumber: string,
  password: string,
  studentName?: string
): StudentAccount => {
  const accounts = getAllStudentAccounts();
  const cleanRoll = rollNumber.trim().toUpperCase();
  const key = `${classLevel}_${section}_${cleanRoll}`;

  const existing = accounts[key];

  const account: StudentAccount = {
    classLevel,
    section,
    rollNumber: cleanRoll,
    studentName: studentName?.trim() || existing?.studentName || '',
    password: password.trim(),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  accounts[key] = account;
  localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new Event('neurova_student_accounts_changed'));
  return account;
};

export const deleteStudentAccount = (
  classLevel: ClassLevel,
  section: Section,
  rollNumber: string
) => {
  const accounts = getAllStudentAccounts();
  const cleanRoll = rollNumber.trim().toUpperCase();
  const key = `${classLevel}_${section}_${cleanRoll}`;
  delete accounts[key];
  localStorage.setItem(STUDENT_ACCOUNTS_KEY, JSON.stringify(accounts));
  window.dispatchEvent(new Event('neurova_student_accounts_changed'));
};

export const getRosterForClassSection = (
  classLevel: ClassLevel,
  section: Section
): StudentAccount[] => {
  const accounts = getAllStudentAccounts();
  return Object.values(accounts)
    .filter(a => a.classLevel === classLevel && a.section === section)
    .sort((a, b) => {
      const numA = parseInt(a.rollNumber, 10);
      const numB = parseInt(b.rollNumber, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.rollNumber.localeCompare(b.rollNumber);
    });
};
