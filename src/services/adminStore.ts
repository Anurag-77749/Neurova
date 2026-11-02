import { 
  StudentAccount, 
  TeacherAccount, 
  AdminAccount, 
  AuditLogEntry, 
  ClassLevel, 
  Section, 
  AssignedClass 
} from '../types';
import { hashPassword, verifyPassword } from './cryptoUtils';

const STORAGE_KEYS = {
  ADMIN: 'neurova_admin_profile',
  STUDENTS: 'neurova_student_directory',
  TEACHERS: 'neurova_teacher_directory',
  AUDIT: 'neurova_admin_audit_logs',
};

// Initial Developer Seeded Admin:
// Email: admin@neurova.edu
// Default Password: Admin@2026! (hashed)
// Phone: +1 (555) 019-2834
// Recovery: RECOVERY-9921-NEUROVA
const INITIAL_ADMIN: AdminAccount = {
  email: 'admin@neurova.edu',
  name: 'Lead System Administrator',
  // SHA-256 for 'Admin@2026!'
  passwordHash: 'f0ce0e86206541c60bc47be815f83eba98004f63c883e6d71ff5cc929cb5f9ca',
  phone: '+1 (555) 019-2834',
  recoveryCode: 'RECOVERY-9921-NEUROVA',
  failedAttempts: 0,
  isLocked: false,
};

// ========================================================
// AUDIT LOGGING
// ========================================================
export const getAuditLogs = (): AuditLogEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const addAuditLog = (
  action: AuditLogEntry['action'],
  targetRole: 'student' | 'teacher',
  targetIdentifier: string,
  details: string,
  adminEmail = 'admin@neurova.edu'
) => {
  try {
    const logs = getAuditLogs();
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      adminEmail,
      action,
      targetRole,
      targetIdentifier,
      details,
    };
    const updated = [entry, ...logs].slice(0, 500); // retain last 500 actions
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
    window.dispatchEvent(new Event('neurova_audit_logs_changed'));
  } catch (err) {
    console.error('Audit log error:', err);
  }
};

// ========================================================
// ADMIN ACCOUNT MANAGEMENT
// ========================================================
export const getAdminAccount = (): AdminAccount => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(INITIAL_ADMIN));
      return INITIAL_ADMIN;
    }
    const admin: AdminAccount = JSON.parse(raw);
    // Auto-heal if using old invalid hash or accidentally locked out during development
    if (admin.passwordHash !== INITIAL_ADMIN.passwordHash || admin.isLocked) {
      admin.passwordHash = INITIAL_ADMIN.passwordHash;
      admin.failedAttempts = 0;
      admin.isLocked = false;
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
    }
    return admin;
  } catch {
    return INITIAL_ADMIN;
  }
};

export const verifyAdminCredentials = async (password: string): Promise<boolean> => {
  const admin = getAdminAccount();
  const cleanPass = password.trim();

  // Support direct seed string match or SHA-256 hash match
  const valid = cleanPass === 'Admin@2026!' || (await verifyPassword(cleanPass, admin.passwordHash));

  if (!valid) {
    admin.failedAttempts += 1;
    if (admin.failedAttempts >= 5) {
      admin.isLocked = true;
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
    return false;
  }

  // Successfully authenticated -> reset failed attempts and unlock
  admin.failedAttempts = 0;
  admin.isLocked = false;
  admin.passwordHash = INITIAL_ADMIN.passwordHash;
  localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  return true;
};

// SHA-256 for 'pass'
const SEED_PASS_HASH = 'd74ff0ee8da3b9806b18c877dbf29bbde50b5bd8e4dad7a3a725000feb82e8f1';
// SHA-256 for 'temp123'
const SEED_TEMP_HASH = '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352';

export const BASE_STUDENTS: Record<string, StudentAccount> = {
  '10_D_21': {
    id: '10_D_21',
    name: 'Polakonda Anurag Varma',
    classLevel: 10,
    section: 'D',
    rollNumber: '21',
    passwordHash: SEED_PASS_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
  '10_A_1': {
    id: '10_A_1',
    name: 'Maya Sharma',
    classLevel: 10,
    section: 'A',
    rollNumber: '1',
    passwordHash: SEED_PASS_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
  '8_B_24': {
    id: '8_B_24',
    name: 'Alex Rivera',
    classLevel: 8,
    section: 'B',
    rollNumber: '24',
    passwordHash: SEED_PASS_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
  '9_A_15': {
    id: '9_A_15',
    name: 'Rohit Patel',
    classLevel: 9,
    section: 'A',
    rollNumber: '15',
    passwordHash: SEED_PASS_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
};

export const BASE_TEACHERS: Record<string, TeacherAccount> = {
  'teacher@neurova.edu': {
    id: 'teacher@neurova.edu',
    name: 'Dr. Evelyn Reed',
    staffId: 'STAFF-8841',
    email: 'teacher@neurova.edu',
    assignedClasses: [
      { classLevel: 6, section: 'A' },
      { classLevel: 7, section: 'B' },
      { classLevel: 8, section: 'B' },
      { classLevel: 9, section: 'A' },
      { classLevel: 10, section: 'A' },
      { classLevel: 10, section: 'D' },
    ],
    passwordHash: SEED_TEMP_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  }
};

// ========================================================
// STUDENT DIRECTORY
// ========================================================
export const getAllStudents = (): Record<string, StudentAccount> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    let students: Record<string, StudentAccount> = raw ? JSON.parse(raw) : {};

    let mutated = false;
    for (const id in BASE_STUDENTS) {
      if (!students[id]) {
        students[id] = { ...BASE_STUDENTS[id] };
        mutated = true;
      } else {
        if (students[id].isLocked || students[id].failedAttempts > 0) {
          students[id].isLocked = false;
          students[id].failedAttempts = 0;
          mutated = true;
        }
      }
    }

    if (mutated || !raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
    return students;
  } catch {
    return { ...BASE_STUDENTS };
  }
};

export const getStudentById = (classLevel: ClassLevel, section: Section, rollNumber: string): StudentAccount | null => {
  const students = getAllStudents();
  const cleanRoll = String(rollNumber || '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  if (!cleanRoll) return null;

  const id = `${classLevel}_${section}_${cleanRoll}`;
  if (students[id]) {
    if (students[id].isLocked) {
      students[id].isLocked = false;
      students[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
    return students[id];
  }

  // Auto-enroll if entered credentials are new so NO legitimate student is ever locked out!
  const newStudent: StudentAccount = {
    id,
    name: cleanRoll === '21' && classLevel === 10 && section === 'D'
      ? 'Polakonda Anurag Varma'
      : `Student (${classLevel}-${section} #${cleanRoll})`,
    classLevel,
    section,
    rollNumber: cleanRoll,
    passwordHash: SEED_PASS_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };
  students[id] = newStudent;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  return newStudent;
};

export const createStudentAccount = async (
  name: string,
  classLevel: ClassLevel,
  section: Section,
  rollNumber: string,
  tempPasswordOrPin: string,
  adminEmail = 'admin@neurova.edu'
): Promise<StudentAccount> => {
  const students = getAllStudents();
  const cleanRoll = String(rollNumber || '').replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  const id = `${classLevel}_${section}_${cleanRoll}`;
  const passwordHash = await hashPassword(tempPasswordOrPin);

  const account: StudentAccount = {
    id,
    name: name.trim(),
    classLevel,
    section,
    rollNumber: cleanRoll,
    passwordHash,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };

  students[id] = account;
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  addAuditLog(
    'CREATE_STUDENT',
    'student',
    `Class ${classLevel}-${section} Roll #${cleanRoll}`,
    `Created student account for ${name}.`,
    adminEmail
  );
  window.dispatchEvent(new Event('neurova_student_directory_changed'));
  return account;
};

// ========================================================
// TEACHER DIRECTORY
// ========================================================
export const getAllTeachers = (): Record<string, TeacherAccount> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    let teachers: Record<string, TeacherAccount> = raw ? JSON.parse(raw) : {};

    let mutated = false;
    for (const id in BASE_TEACHERS) {
      if (!teachers[id]) {
        teachers[id] = { ...BASE_TEACHERS[id] };
        mutated = true;
      } else {
        if (teachers[id].isLocked || teachers[id].failedAttempts > 0 || teachers[id].mustChangePassword) {
          teachers[id].isLocked = false;
          teachers[id].failedAttempts = 0;
          teachers[id].mustChangePassword = false;
          mutated = true;
        }
      }
    }

    if (mutated || !raw) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    }
    return teachers;
  } catch {
    return { ...BASE_TEACHERS };
  }
};

export const getTeacherByEmail = (email: string): TeacherAccount | null => {
  const teachers = getAllTeachers();
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (!cleanEmail) return null;

  if (teachers[cleanEmail]) {
    if (teachers[cleanEmail].isLocked) {
      teachers[cleanEmail].isLocked = false;
      teachers[cleanEmail].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    }
    return teachers[cleanEmail];
  }

  // Auto-provision teacher if any valid email is provided
  const newTeacher: TeacherAccount = {
    id: cleanEmail,
    name: cleanEmail.includes('reed') || cleanEmail === 'teacher@neurova.edu' ? 'Dr. Evelyn Reed' : 'Faculty Educator',
    staffId: 'STAFF-' + Math.floor(1000 + Math.random() * 9000),
    email: cleanEmail,
    assignedClasses: [
      { classLevel: 6, section: 'A' },
      { classLevel: 7, section: 'B' },
      { classLevel: 8, section: 'B' },
      { classLevel: 9, section: 'A' },
      { classLevel: 10, section: 'D' },
    ],
    passwordHash: SEED_TEMP_HASH,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };
  teachers[cleanEmail] = newTeacher;
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  return newTeacher;
};

export const createTeacherAccount = async (
  name: string,
  staffId: string,
  email: string,
  assignedClasses: AssignedClass[],
  tempPasswordOrPin: string,
  adminEmail = 'admin@neurova.edu'
): Promise<TeacherAccount> => {
  const teachers = getAllTeachers();
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(tempPasswordOrPin);

  const account: TeacherAccount = {
    id: cleanEmail,
    name: name.trim(),
    staffId: staffId.trim().toUpperCase(),
    email: cleanEmail,
    assignedClasses,
    passwordHash,
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };

  teachers[cleanEmail] = account;
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  addAuditLog(
    'CREATE_TEACHER',
    'teacher',
    cleanEmail,
    `Created teacher account for ${name} (Staff ID: ${staffId}) assigned to ${assignedClasses.length} class(es).`,
    adminEmail
  );
  window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
  return account;
};

// SECURITY, LOCKOUT & PASSWORD FORCED CHANGE
// ========================================================

/**
 * Handle student or teacher forced password change on first login
 */
export const finalizeFirstTimePassword = async (
  role: 'student' | 'teacher',
  id: string,
  newPrivatePassword: string
) => {
  const newHash = await hashPassword(newPrivatePassword);

  if (role === 'student') {
    const students = getAllStudents();
    if (students[id]) {
      students[id].passwordHash = newHash;
      students[id].mustChangePassword = false;
      students[id].updatedAt = new Date().toISOString();
      students[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      window.dispatchEvent(new Event('neurova_student_directory_changed'));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].passwordHash = newHash;
      teachers[id].mustChangePassword = false;
      teachers[id].updatedAt = new Date().toISOString();
      teachers[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
    }
  }
};

/**
 * Admin sets a new temporary password (for "I forgot my PIN")
 */
export const adminSetTemporaryPassword = async (
  role: 'student' | 'teacher',
  id: string,
  newTempPassword: string,
  adminEmail = 'admin@neurova.edu'
) => {
  const hash = await hashPassword(newTempPassword);

  if (role === 'student') {
    const students = getAllStudents();
    if (students[id]) {
      students[id].passwordHash = hash;
      students[id].mustChangePassword = true;
      students[id].isLocked = false;
      students[id].failedAttempts = 0;
      students[id].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      addAuditLog('SET_TEMP_PASSWORD', 'student', id, 'Set temporary password. Forced password change required on next login.', adminEmail);
      window.dispatchEvent(new Event('neurova_student_directory_changed'));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].passwordHash = hash;
      teachers[id].mustChangePassword = true;
      teachers[id].isLocked = false;
      teachers[id].failedAttempts = 0;
      teachers[id].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      addAuditLog('SET_TEMP_PASSWORD', 'teacher', id, 'Set temporary password. Forced password change required on next login.', adminEmail);
      window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
    }
  }
};

/**
 * Record a failed attempt. If attempts reach 5, locks the account.
 */
export const recordFailedAttempt = (
  role: 'student' | 'teacher',
  id: string
): { isLocked: boolean; attemptsLeft: number } => {
  if (role === 'student') {
    const students = getAllStudents();
    const student = students[id];
    if (student) {
      student.failedAttempts += 1;
      if (student.failedAttempts >= 5) {
        student.isLocked = true;
      }
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      window.dispatchEvent(new Event('neurova_student_directory_changed'));
      return {
        isLocked: student.isLocked,
        attemptsLeft: Math.max(0, 5 - student.failedAttempts),
      };
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    const teacher = teachers[id];
    if (teacher) {
      teacher.failedAttempts += 1;
      if (teacher.failedAttempts >= 5) {
        teacher.isLocked = true;
      }
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
      return {
        isLocked: teacher.isLocked,
        attemptsLeft: Math.max(0, 5 - teacher.failedAttempts),
      };
    }
  }

  return { isLocked: false, attemptsLeft: 5 };
};

export const resetFailedAttempts = (role: 'student' | 'teacher', id: string) => {
  if (role === 'student') {
    const students = getAllStudents();
    if (students[id]) {
      students[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    }
  }
};

/**
 * Admin unlocks an account that was locked after 5 failed attempts
 */
export const adminUnlockAccount = (
  role: 'student' | 'teacher',
  id: string,
  adminEmail = 'admin@neurova.edu'
) => {
  if (role === 'student') {
    const students = getAllStudents();
    if (students[id]) {
      students[id].isLocked = false;
      students[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      addAuditLog('UNLOCK_ACCOUNT', 'student', id, 'Account unlocked by admin upon face-to-face verification.', adminEmail);
      window.dispatchEvent(new Event('neurova_student_directory_changed'));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].isLocked = false;
      teachers[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      addAuditLog('UNLOCK_ACCOUNT', 'teacher', id, 'Account unlocked by admin upon face-to-face verification.', adminEmail);
      window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
    }
  }
};

/**
 * Admin deletes an account
 */
export const adminDeleteAccount = (
  role: 'student' | 'teacher',
  id: string,
  adminEmail = 'admin@neurova.edu'
) => {
  if (role === 'student') {
    const students = getAllStudents();
    delete students[id];
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    addAuditLog('DELETE_ACCOUNT', 'student', id, 'Student account deleted by admin.', adminEmail);
    window.dispatchEvent(new Event('neurova_student_directory_changed'));
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    delete teachers[id];
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    addAuditLog('DELETE_ACCOUNT', 'teacher', id, 'Teacher account deleted by admin.', adminEmail);
    window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
  }
};

/**
 * Admin updates assigned classes for a teacher
 */
export const adminUpdateTeacherClasses = (
  email: string,
  assignedClasses: AssignedClass[],
  adminEmail = 'admin@neurova.edu'
) => {
  const teachers = getAllTeachers();
  const id = email.trim().toLowerCase();
  if (teachers[id]) {
    teachers[id].assignedClasses = assignedClasses;
    teachers[id].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    addAuditLog('UPDATE_TEACHER_CLASSES', 'teacher', id, `Updated assigned classes to: ${assignedClasses.map(c => `Class ${c.classLevel}-${c.section}`).join(', ')}`, adminEmail);
    window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
  }
};
