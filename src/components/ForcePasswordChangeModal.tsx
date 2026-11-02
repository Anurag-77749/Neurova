import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { finalizeFirstTimePassword } from '../services/adminStore';
import { UserSession } from '../types';

interface ForcePasswordChangeModalProps {
  session: UserSession;
  onPasswordChanged: () => void;
}

export const ForcePasswordChangeModal: React.FC<ForcePasswordChangeModalProps> = ({
  session,
  onPasswordChanged,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);
    try {
      const identifier = session.role === 'student'
        ? `${session.classLevel}_${session.section}_${session.rollNumber}`
        : (session.email || '');

      await finalizeFirstTimePassword(session.role as 'student' | 'teacher', identifier, newPassword);
      onPasswordChanged();
    } catch (err) {
      setErrorMsg('Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-[#15161C] border border-slate-200 dark:border-[#222430] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/15 dark:bg-[#14B8A6]/20 border border-[#0D9488]/30 dark:border-[#14B8A6]/30 flex items-center justify-center text-[#0D9488] dark:text-[#14B8A6] shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6] flex items-center gap-1 mb-1">
              <KeyRound className="w-3.5 h-3.5" />
              First Login Security Check
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6]">
              Set Your Private Password
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#9CA3AF] mt-1 leading-relaxed">
              Please choose your private password to complete your account setup and continue to your portal.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider">
                New Private Password
              </label>
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-[11px] text-[#0D9488] dark:text-[#14B8A6] font-medium flex items-center gap-1"
              >
                {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Choose a strong, private password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#F3F4F6] uppercase tracking-wider mb-1.5">
              Confirm Private Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-[#0B0B0F] border border-slate-200 dark:border-[#222430] text-slate-900 dark:text-[#F3F4F6] focus:outline-none focus:ring-2 focus:ring-[#0D9488] dark:focus:ring-[#14B8A6]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] dark:bg-[#14B8A6] dark:hover:bg-[#2DD4BF] text-white dark:text-[#0B0B0F] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Encrypting & Saving...' : 'Lock In Private Password & Enter'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
