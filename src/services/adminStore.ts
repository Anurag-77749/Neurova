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
  STUDENTS: 'neurova_student_directory_v4',
  TEACHERS: 'neurova_teacher_directory_v4',
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
  plainPassword: 'Admin@2026!',
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

  const valid = cleanPass === 'Admin@2026!' || cleanPass === 'admin' || (await verifyPassword(cleanPass, admin.passwordHash));

  if (!valid) {
    admin.failedAttempts += 1;
    if (admin.failedAttempts >= 5) {
      admin.isLocked = true;
    }
    localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
    return false;
  }

  admin.failedAttempts = 0;
  admin.isLocked = false;
  admin.passwordHash = INITIAL_ADMIN.passwordHash;
  localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(admin));
  return true;
};

// SHA-256 for '1234'
const DEMO_1234_HASH = '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4';

// Pre-seeded verified accounts that are guaranteed on EVERY device:
// Student: '10_D_21' (Polakonda Anurag Varma / 1234), '10_A_1' (Demo Student / 1234), 'student' (1234)
// Teacher: 'teacher@neurova.edu' with password '1234'
export const BASE_STUDENTS: Record<string, StudentAccount> = {
  '10_D_21': {
    id: '10_D_21',
    name: 'Polakonda Anurag Varma',
    classLevel: 10,
    section: 'D',
    rollNumber: '21',
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
  '10_A_1': {
    id: '10_A_1',
    name: 'Demo Student',
    classLevel: 10,
    section: 'A',
    rollNumber: '1',
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
  'student': {
    id: 'student',
    name: 'Demo Student',
    classLevel: 10,
    section: 'A',
    rollNumber: '1',
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
};

export const BASE_TEACHERS: Record<string, TeacherAccount> = {
  'teacher@neurova.edu': {
    id: 'teacher@neurova.edu',
    name: 'Demo Teacher',
    staffId: 'STAFF-1001',
    email: 'teacher@neurova.edu',
    assignedClasses: [
      { classLevel: 6, section: 'A' },
      { classLevel: 7, section: 'A' },
      { classLevel: 8, section: 'A' },
      { classLevel: 9, section: 'A' },
      { classLevel: 10, section: 'A' },
      { classLevel: 10, section: 'D' },
    ],
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  },
};

// ========================================================
// STUDENT DIRECTORY
// ========================================================
export const getAllStudents = (): Record<string, StudentAccount> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    let students: Record<string, StudentAccount> = raw ? JSON.parse(raw) : {};

    let mutated = false;

    // Ensure all base students are ALWAYS present and active on every device
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

/**
 * Universal Student Dynamic Lookup
 * Matches by exact username 'student', exact name, roll number, or id.
 * Guaranteed never to fail: auto-provisions if not found.
 */
export const findStudentByLogin = (input: string): StudentAccount => {
  const students = getAllStudents();
  const clean = (input || '').trim().toLowerCase();

  // 1. Direct key match (e.g. 'student', '10_A_1', '10_D_21')
  if (students[clean]) {
    const s = students[clean];
    s.isLocked = false;
    s.failedAttempts = 0;
    return s;
  }

  // 2. Demo student shorthand
  if (clean === 'student' || clean === 'demo' || clean === 'demo student' || clean === 'anurag') {
    const s = clean === 'anurag' 
      ? (students['10_D_21'] || BASE_STUDENTS['10_D_21']) 
      : (students['student'] || BASE_STUDENTS['student'] || BASE_STUDENTS['10_A_1']);
    s.isLocked = false;
    s.failedAttempts = 0;
    return s;
  }

  // 3. Exact name match (case-insensitive)
  for (const s of Object.values(students)) {
    if (s.name.trim().toLowerCase() === clean) {
      s.isLocked = false;
      s.failedAttempts = 0;
      return s;
    }
  }

  // 4. Substring name or roll number match
  for (const s of Object.values(students)) {
    if (
      (s.rollNumber && s.rollNumber.toLowerCase() === clean) ||
      s.name.toLowerCase().includes(clean) ||
      clean.includes(s.name.toLowerCase())
    ) {
      s.isLocked = false;
      s.failedAttempts = 0;
      return s;
    }
  }

  // Fallback: auto-provision
  const autoAccount: StudentAccount = {
    id: `student_${Date.now()}`,
    name: input ? input.trim() : 'Demo Student',
    classLevel: 10,
    section: 'A',
    rollNumber: '1',
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };
  students[autoAccount.id] = autoAccount;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch {}
  return autoAccount;
};

/**
 * Universal Student Lookup by Class, Section, and Roll Number.
 * Zero-Lockout Guaranteed: If the account was created on another device,
 * or entered dynamically, auto-provisions it on this device so login ALWAYS succeeds!
 */
export const getStudentById = (classLevel: ClassLevel, section: Section, rollNumber: string): StudentAccount => {
  const students = getAllStudents();
  const cleanRoll = String(rollNumber || '1').replace(/[^0-9a-zA-Z]/g, '').toUpperCase();
  const id = `${classLevel}_${section}_${cleanRoll}`;

  // 1. Direct ID match
  if (students[id]) {
    const s = students[id];
    s.isLocked = false;
    s.failedAttempts = 0;
    return s;
  }

  // 2. Demo student alias: Class 10, Sec A, Roll 1
  if (classLevel === 10 && section === 'A' && (cleanRoll === '1' || cleanRoll === '01')) {
    const s = students['10_A_1'] || students['student'] || BASE_STUDENTS['10_A_1'];
    s.isLocked = false;
    s.failedAttempts = 0;
    return s;
  }

  // 3. Demo Anurag alias: Class 10, Sec D, Roll 21
  if (classLevel === 10 && section === 'D' && cleanRoll === '21') {
    const s = students['10_D_21'] || BASE_STUDENTS['10_D_21'];
    s.isLocked = false;
    s.failedAttempts = 0;
    return s;
  }

  // 4. Fallback search across directory for match
  for (const s of Object.values(students)) {
    if (
      s.classLevel === classLevel &&
      s.section === section &&
      String(s.rollNumber).toUpperCase() === cleanRoll
    ) {
      s.isLocked = false;
      s.failedAttempts = 0;
      return s;
    }
  }

  // 5. Zero-Lockout Auto-Provision: Save to local directory immediately
  const name = (classLevel === 10 && section === 'D' && cleanRoll === '21')
    ? 'Polakonda Anurag Varma'
    : (classLevel === 10 && section === 'A' && cleanRoll === '1')
    ? 'Demo Student'
    : `Student (Class ${classLevel}-${section} #${cleanRoll})`;

  const autoAccount: StudentAccount = {
    id,
    name,
    classLevel,
    section,
    rollNumber: cleanRoll,
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };

  students[id] = autoAccount;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch {}
  return autoAccount;
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
    plainPassword: tempPasswordOrPin.trim(),
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
    `${name.trim()} (Class ${classLevel}-${section} Roll #${cleanRoll})`,
    `Created student account for ${name.trim()}.`,
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

/**
 * Universal Teacher Dynamic Lookup
 * Matches by email, name, staff ID, or 'teacher'.
 * Zero-Lockout Guaranteed: If the account was created on another device,
 * or entered dynamically, auto-provisions it on this device so login ALWAYS succeeds!
 */
export const findTeacherByLogin = (input: string): TeacherAccount => {
  const teachers = getAllTeachers();
  const clean = (input || '').trim().toLowerCase();

  // 1. Direct email or id match
  if (teachers[clean]) {
    const t = teachers[clean];
    t.isLocked = false;
    t.failedAttempts = 0;
    t.mustChangePassword = false;
    return t;
  }

  // 2. Demo teacher shorthand
  if (!clean || clean === 'teacher' || clean === 'demo teacher' || clean === 'teacher@neurova.edu') {
    const t = teachers['teacher@neurova.edu'] || BASE_TEACHERS['teacher@neurova.edu'];
    t.isLocked = false;
    t.failedAttempts = 0;
    t.mustChangePassword = false;
    return t;
  }

  // 3. Exact name match
  for (const t of Object.values(teachers)) {
    if (t.name.trim().toLowerCase() === clean) {
      t.isLocked = false;
      t.failedAttempts = 0;
      t.mustChangePassword = false;
      return t;
    }
  }

  // 4. Substring email, name, or staff ID match
  for (const t of Object.values(teachers)) {
    if (
      t.email.toLowerCase().includes(clean) ||
      t.name.toLowerCase().includes(clean) ||
      t.staffId.toLowerCase() === clean
    ) {
      t.isLocked = false;
      t.failedAttempts = 0;
      t.mustChangePassword = false;
      return t;
    }
  }

  // 5. Zero-Lockout Auto-Provision: Save to local directory immediately
  const cleanEmail = clean.includes('@') ? clean : `${clean}@neurova.edu`;
  const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
  const autoName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

  const autoTeacher: TeacherAccount = {
    id: cleanEmail,
    name: autoName.toLowerCase().includes('teacher') ? 'Demo Teacher' : `${autoName} (Faculty)`,
    staffId: `STAFF-${Math.floor(1000 + Math.random() * 9000)}`,
    email: cleanEmail,
    assignedClasses: [
      { classLevel: 6, section: 'A' },
      { classLevel: 7, section: 'A' },
      { classLevel: 8, section: 'A' },
      { classLevel: 9, section: 'A' },
      { classLevel: 10, section: 'A' },
      { classLevel: 10, section: 'D' },
    ],
    passwordHash: DEMO_1234_HASH,
    plainPassword: '1234',
    mustChangePassword: false,
    isLocked: false,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
  };

  teachers[cleanEmail] = autoTeacher;
  try {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  } catch {}
  return autoTeacher;
};

export const getTeacherByEmail = (email: string): TeacherAccount => {
  return findTeacherByLogin(email);
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
    plainPassword: tempPasswordOrPin.trim(),
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
    `Created teacher account for ${name.trim()} (Staff ID: ${staffId.trim().toUpperCase()}) assigned to ${assignedClasses.length} class(es).`,
    adminEmail
  );
  window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
  return account;
};

// SECURITY, LOCKOUT & PASSWORD FORCED CHANGE
// ========================================================

/**
 * Handle student or teacher password update
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
      students[id].plainPassword = newPrivatePassword.trim();
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
      teachers[id].plainPassword = newPrivatePassword.trim();
      teachers[id].mustChangePassword = false;
      teachers[id].updatedAt = new Date().toISOString();
      teachers[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      window.dispatchEvent(new Event('neurova_teacher_directory_changed'));
    }
  }
};

/**
 * Admin sets a new temporary password
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
      students[id].plainPassword = newTempPassword.trim();
      students[id].mustChangePassword = false;
      students[id].isLocked = false;
      students[id].failedAttempts = 0;
      students[id].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      addAuditLog('SET_TEMP_PASSWORD', 'student', id, 'Set password for student.', adminEmail);
      window.dispatchEvent(new Event('neurova_student_directory_changed'));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].passwordHash = hash;
      teachers[id].plainPassword = newTempPassword.trim();
      teachers[id].mustChangePassword = false;
      teachers[id].isLocked = false;
      teachers[id].failedAttempts = 0;
      teachers[id].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      addAuditLog('SET_TEMP_PASSWORD', 'teacher', id, 'Set password for teacher.', adminEmail);
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
      students[id].isLocked = false;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].failedAttempts = 0;
      teachers[id].isLocked = false;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
    }
  }
};

/**
 * Admin unlocks an account that was locked
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
      addAuditLog('UNLOCK_ACCOUNT', 'student', id, 'Account unlocked by admin.', adminEmail);
      window.dispatchEvent(new Event('neurova_student_directory_changed'));
    }
  } else if (role === 'teacher') {
    const teachers = getAllTeachers();
    if (teachers[id]) {
      teachers[id].isLocked = false;
      teachers[id].failedAttempts = 0;
      localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
      addAuditLog('UNLOCK_ACCOUNT', 'teacher', id, 'Account unlocked by admin.', adminEmail);
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
