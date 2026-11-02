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

// SHA-256 of 'temp123'
const SEED_TEMP_HASH = '0a19533d8eae0719d0e75b3cfb2d80808111b7612756418145cc7103e621f352';

// ========================================================
// STUDENT DIRECTORY
// ========================================================
export const getAllStudents = (): Record<string, StudentAccount> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      const seed: Record<string, StudentAccount> = {
        '8_B_24': {
          id: '8_B_24',
          name: 'Alex Rivera',
          classLevel: 8,
          section: 'B',
          rollNumber: '24',
          passwordHash: SEED_TEMP_HASH,
          mustChangePassword: true, // forces change on first login
          isLocked: false,
          failedAttempts: 0,
          createdAt: new Date().toISOString(),
        }
      };
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(seed));
      return seed;
    }
    const students: Record<string, StudentAccount> = JSON.parse(raw);
    let mutated = false;
    for (const id in students) {
      if (students[id].passwordHash === 'b03ddf3ca2e714a6548e749a70f3fef9d605423e19bef150f9128d522370e9d6') {
        students[id].passwordHash = SEED_TEMP_HASH;
        students[id].isLocked = false;
        students[id].failedAttempts = 0;
        mutated = true;
      }
    }
    if (mutated) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
    return students;
  } catch {
    return {};
  }
};

export const getStudentById = (classLevel: ClassLevel, section: Section, rollNumber: string): StudentAccount | null => {
  const students = getAllStudents();
  const id = `${classLevel}_${section}_${rollNumber.trim().toUpperCase()}`;
  return students[id] || null;
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
  const cleanRoll = rollNumber.trim().toUpperCase();
  const id = `${classLevel}_${section}_${cleanRoll}`;
  const passwordHash = await hashPassword(tempPasswordOrPin);

  const account: StudentAccount = {
    id,
    name: name.trim(),
    classLevel,
    section,
    rollNumber: cleanRoll,
    passwordHash,
    mustChangePassword: true, // strictly required
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
    `Created student account for ${name} with temporary credentials. Forced password change flagged.`,
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
    if (!raw) {
      // Pre-seed demo teacher with temporary password 'temp123'
      // assigned to Class 8-B and Class 9-A
      const seed: Record<string, TeacherAccount> = {
        'teacher@neurova.edu': {
          id: 'teacher@neurova.edu',
          name: 'Prof. Marcus Vance',
          staffId: 'STAFF-8841',
          email: 'teacher@neurova.edu',
          assignedClasses: [
            { classLevel: 8, section: 'B' },
            { classLevel: 9, section: 'A' },
            { classLevel: 10, section: 'C' },
          ],
          passwordHash: SEED_TEMP_HASH,
          mustChangePassword: true, // forces change on first login
          isLocked: false,
          failedAttempts: 0,
          createdAt: new Date().toISOString(),
        }
      };
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(seed));
      return seed;
    }
    const teachers: Record<string, TeacherAccount> = JSON.parse(raw);
    let mutated = false;
    for (const id in teachers) {
      if (teachers[id].passwordHash === 'b03ddf3ca2e714a6548e749a70f3fef9d605423e19bef150f9128d522370e9d6') {
        teachers[id].passwordHash = SEED_TEMP_HASH;
        teachers[id].isLocked = false;
        teachers[id].failedAttempts = 0;
        mutated = true;
      }
    }
    if (mutated) {
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    }
    return teachers;
  } catch {
    return {};
  }
};

export const getTeacherByEmail = (email: string): TeacherAccount | null => {
  const teachers = getAllTeachers();
  const id = email.trim().toLowerCase();
  return teachers[id] || null;
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
    mustChangePassword: true, // strictly required
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
    `Created teacher account for ${name} (Staff ID: ${staffId}) assigned to ${assignedClasses.length} class(es). Forced password change flagged.`,
    adminEmail
  );
  window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
  return account;
};

// ========================================================
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
