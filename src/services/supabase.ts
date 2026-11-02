import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { StudentAccount, TeacherAccount } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const CONFIG_KEY = 'neurova_supabase_config';
export const DEFAULT_SUPABASE_URL = 'https://ligwdgnyvkqxtlkunnga.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_XuiRIAz_4ly9NkaYFXunpQ_NgyNzwAS';

export const getSupabaseConfig = (): SupabaseConfig => {
  try {
    const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
    if (envUrl && envKey) {
      return { url: envUrl.trim(), anonKey: envKey.trim() };
    }
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch {}
  return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
};

export const saveSupabaseConfig = (config: SupabaseConfig) => {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  initSupabase();
};

let clientInstance: SupabaseClient | null = null;

export const initSupabase = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      clientInstance = createClient(config.url, config.anonKey);
      return clientInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
    }
  }
  clientInstance = null;
  return null;
};

// Initial setup
initSupabase();

export const getSupabase = (): SupabaseClient | null => {
  if (!clientInstance) {
    return initSupabase();
  }
  return clientInstance;
};

export const isSupabaseConfigured = (): boolean => {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
};

// ========================================================
// REMOTE SYNC OPERATIONS
// ========================================================

export const syncStudentToCloud = async (student: StudentAccount): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('students').upsert({
      id: student.id,
      name: student.name,
      class_level: student.classLevel,
      section: student.section,
      roll_number: student.rollNumber,
      plain_password: student.plainPassword || '',
      password_hash: student.passwordHash,
      is_locked: student.isLocked || false,
      failed_attempts: student.failedAttempts || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase syncStudent error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase student sync failed:', err);
    return false;
  }
};

export const syncTeacherToCloud = async (teacher: TeacherAccount): Promise<boolean> => {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('teachers').upsert({
      id: teacher.id,
      name: teacher.name,
      staff_id: teacher.staffId || '',
      email: teacher.email,
      plain_password: teacher.plainPassword || '',
      password_hash: teacher.passwordHash,
      assigned_classes: teacher.assignedClasses || [],
      is_locked: teacher.isLocked || false,
      failed_attempts: teacher.failedAttempts || 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase syncTeacher error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase teacher sync failed:', err);
    return false;
  }
};

export const fetchCloudStudents = async (): Promise<StudentAccount[]> => {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client.from('students').select('*');
    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      classLevel: row.class_level,
      section: row.section,
      rollNumber: row.roll_number,
      plainPassword: row.plain_password,
      passwordHash: row.password_hash,
      isLocked: row.is_locked,
      failedAttempts: row.failed_attempts || 0,
      mustChangePassword: false,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
};

export const fetchCloudTeachers = async (): Promise<TeacherAccount[]> => {
  const client = getSupabase();
  if (!client) return [];

  try {
    const { data, error } = await client.from('teachers').select('*');
    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      staffId: row.staff_id,
      email: row.email,
      plainPassword: row.plain_password,
      passwordHash: row.password_hash,
      assignedClasses: row.assigned_classes || [],
      isLocked: row.is_locked,
      failedAttempts: row.failed_attempts || 0,
      mustChangePassword: false,
      createdAt: row.created_at || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
};
