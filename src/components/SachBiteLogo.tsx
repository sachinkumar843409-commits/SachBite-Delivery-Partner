import React from 'react';
import { motion } from 'motion/react';

interface SachBiteLogoProps {
  size?: number; // size in px
  showText?: boolean;
  showTagline?: boolean;
  tagline?: string;
  animate?: boolean;
  className?: string;
}

export const SachBiteLogo: React.FC<SachBiteLogoProps> = ({
  size = 120,
  showText = true,
  showTagline = true,
  tagline = 'Food delivered with love ❤️',
  animate = false,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* SVG Icon Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Main S Gradient */}
          <linearGradient id="sachbiteGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFA000" />
            <stop offset="35%" stopColor="#FF6B00" />
            <stop offset="70%" stopColor="#FF3D00" />
            <stop offset="100%" stopColor="#D50000" />
          </linearGradient>

          {/* Speed Trails Gradient */}
          <linearGradient id="speedGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FF3D00" />
          </linearGradient>

          {/* Chef Hat Gradient */}
          <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#E63900" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#ff3d00" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Speed Lines on Left */}
        <g id="speed-lines">
          {/* Top Speed Line */}
          <motion.rect
            x="130"
            y="170"
            width="55"
            height="16"
            rx="8"
            fill="url(#speedGrad)"
            initial={animate ? { opacity: 0, x: -50, scaleX: 0.2 } : false}
            animate={animate ? { opacity: 1, x: 0, scaleX: 1 } : false}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          />
          {/* Middle Long Speed Line */}
          <motion.rect
            x="90"
            y="196"
            width="95"
            height="16"
            rx="8"
            fill="url(#speedGrad)"
            initial={animate ? { opacity: 0, x: -70, scaleX: 0.2 } : false}
            animate={animate ? { opacity: 1, x: 0, scaleX: 1 } : false}
            transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
          />
          {/* Bottom Speed Line */}
          <motion.rect
            x="130"
            y="222"
            width="50"
            height="16"
            rx="8"
            fill="url(#speedGrad)"
            initial={animate ? { opacity: 0, x: -40, scaleX: 0.2 } : false}
            animate={animate ? { opacity: 1, x: 0, scaleX: 1 } : false}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          />
        </g>

        {/* The Chef Hat on Top of S */}
        <motion.g
          id="chef-hat"
          transform="translate(270, 60) rotate(15)"
          initial={animate ? { opacity: 0, y: -30, scale: 0.5 } : false}
          animate={animate ? { opacity: 1, y: 0, scale: 1 } : false}
          transition={{ duration: 0.6, delay: 0.35, type: 'spring', bounce: 0.5 }}
        >
          {/* Hat Base Band */}
          <rect x="-36" y="32" width="72" height="18" rx="7" fill="url(#hatGrad)" />
          {/* Hat Puffs */}
          <path
            d="M -30 32 C -50 25 -48 -8 -26 -12 C -26 -38 26 -38 26 -12 C 48 -8 50 25 30 32 Z"
            fill="url(#hatGrad)"
          />
        </motion.g>

        {/* Main Stylized 'S' Emblem */}
        <motion.g
          id="s-emblem"
          filter="url(#logoGlow)"
          initial={animate ? { opacity: 0, scale: 0.85 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : false}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          {/* Solid S Body */}
          <path
            d="M 270 110 
               C 335 110 375 145 375 185 
               C 375 220 340 248 290 262 
               C 365 280 390 330 390 370 
               C 390 440 315 480 235 480 
               C 165 480 135 440 135 395 
               C 135 365 155 340 190 340 
               C 220 340 242 360 242 388 
               C 242 405 235 418 220 425 
               C 230 430 245 432 260 432 
               C 305 432 342 408 342 370 
               C 342 328 300 305 240 292 
               C 175 278 140 235 140 185 
               C 140 135 195 110 270 110 Z"
            fill="url(#sachbiteGrad)"
          />

          {/* Integrated White Fork (Upper S Loop) */}
          <g id="white-fork">
            {/* Curved Fork Handle */}
            <path
              d="M 185 245 
                 C 162 215 165 170 195 145 
                 C 225 120 275 125 320 148 
                 C 328 152 325 165 315 160 
                 C 275 140 235 140 210 160 
                 C 190 178 190 205 208 228 
                 L 270 252 
                 L 260 278 
                 Z"
              fill="#ffffff"
            />
            {/* 4 Fork Tines */}
            <g transform="translate(305, 142) rotate(22)">
              {/* Tine 1 */}
              <rect x="0" y="0" width="38" height="6.5" rx="3.25" fill="#ffffff" />
              {/* Tine 2 */}
              <rect x="0" y="11" width="44" height="6.5" rx="3.25" fill="#ffffff" />
              {/* Tine 3 */}
              <rect x="0" y="22" width="44" height="6.5" rx="3.25" fill="#ffffff" />
              {/* Tine 4 */}
              <rect x="0" y="33" width="38" height="6.5" rx="3.25" fill="#ffffff" />
            </g>
          </g>

          {/* Integrated White Spoon (Lower S Loop) */}
          <g id="white-spoon">
            {/* Spoon Curved Bowl */}
            <ellipse
              cx="315"
              cy="365"
              rx="42"
              ry="32"
              transform="rotate(-28 315 365)"
              fill="#ffffff"
            />
            {/* Spoon Inner Shadow Accent */}
            <ellipse
              cx="318"
              cy="366"
              rx="35"
              ry="25"
              transform="rotate(-28 318 366)"
              fill="#fefefe"
            />
          </g>
        </motion.g>
      </svg>

      {/* Typography: SachBite Wordmark */}
      {showText && (
        <motion.div
          className="mt-2 text-center"
          initial={animate ? { opacity: 0, y: 15 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-center text-4xl sm:text-5xl font-black tracking-tight">
            <span className="text-[#1a1c1e]">Sach</span>
            <span className="text-[#ff5722]">Bite</span>
          </div>

          {/* Tagline */}
          {showTagline && (
            <motion.div
              className="mt-1 flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-[#b25511] tracking-wide"
              initial={animate ? { opacity: 0 } : false}
              animate={animate ? { opacity: 1 } : false}
              transition={{ duration: 0.5, delay: 0.55 }}
            >
              <span>{tagline}</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};
