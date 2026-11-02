import React, { useId } from 'react';
import { motion } from 'framer-motion';

interface NeurovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const NeurovaLogo: React.FC<NeurovaLogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = '',
}) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const baseGradId = `infBaseGrad_${uid}`;
  const flowGradId = `infFlowGrad_${uid}`;

  const sizeMap = {
    sm: { box: 34, icon: 22, text: 'text-base', sub: 'text-[9px]' },
    md: { box: 46, icon: 30, text: 'text-xl', sub: 'text-[10px]' },
    lg: { box: 72, icon: 46, text: 'text-3xl', sub: 'text-xs' },
    xl: { box: 104, icon: 68, text: 'text-5xl', sub: 'text-sm' },
  };

  const dim = sizeMap[size];

  // Precise Infinity Ribbon SVG Path
  const INFINITY_PATH = "M 14 16 C 8.5 16 5 20.5 5 24 C 5 27.5 8.5 32 14 32 C 21 32 27 16 34 16 C 39.5 16 43 20.5 43 24 C 43 27.5 39.5 32 34 32 C 27 32 21 16 14 16 Z";

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Finalized Minimalist Infinity Emblem */}
      <div
        className="relative flex items-center justify-center rounded-2xl group transition-all duration-300"
        style={{ width: dim.box, height: dim.box }}
      >
        {/* Soft Ambient Aura */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#0D9488]/20 via-[#14B8A6]/25 to-teal-300/15 dark:from-[#14B8A6]/25 dark:via-[#2DD4BF]/20 dark:to-emerald-400/15 blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

        {/* Minimalist Glass Container */}
        <div className="absolute inset-0 rounded-2xl bg-white/90 dark:bg-[#15161C] border border-slate-200/90 dark:border-[#222430] shadow-sm dark:shadow-[0_0_20px_rgba(20,184,166,0.12)] backdrop-blur-md transition-colors" />

        {/* Infinity Vector */}
        <svg
          viewBox="0 0 48 48"
          className="relative z-10"
          style={{ width: dim.icon, height: dim.icon }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={baseGradId} x1="4" y1="24" x2="44" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="50%" stopColor="#14B8A6" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>

            <linearGradient id={flowGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#5EEAD4" stopOpacity="1" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {animated ? (
            /* ANIMATED LOGO: COVER PAGE ONLY (UNIDIRECTIONAL FLOWING RIBBON) */
            <g>
              {/* Underlying Soft Track */}
              <path
                d={INFINITY_PATH}
                stroke={`url(#${baseGradId})`}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.35"
                fill="none"
              />

              {/* Smooth Forward-Flowing Ribbon Stream (No ball) */}
              <motion.path
                d={INFINITY_PATH}
                stroke={`url(#${flowGradId})`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="32 56"
                animate={{
                  strokeDashoffset: [0, -88],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                fill="none"
              />
            </g>
          ) : (
            /* STATIC LOGO: DASHBOARD, SIDEBAR & PORTAL PAGES (CLEAN SOLID TEAL RIBBON) */
            <path
              d={INFINITY_PATH}
              stroke={`url(#${baseGradId})`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </svg>
      </div>

      {/* Modern High-End Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black tracking-tight font-sans ${dim.text} text-slate-900 dark:text-[#F3F4F6]`}
            >
              NEURO<span className="text-[#0D9488] dark:text-[#14B8A6]">VA</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] dark:bg-[#14B8A6]" />
          </div>
          <span className={`tracking-[0.22em] uppercase font-bold text-slate-500 dark:text-[#9CA3AF] mt-1 ${dim.sub}`}>
            Academic Intelligence
          </span>
        </div>
      )}
    </div>
  );
};

export default NeurovaLogo;
