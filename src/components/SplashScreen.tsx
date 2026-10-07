import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SachBiteLogo } from './SachBiteLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [stage, setStage] = useState<'enter' | 'exit'>('enter');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('exit');
      setTimeout(onFinish, 450);
    }, 2400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {stage === 'enter' && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white select-none px-4"
        >
          {/* Main Animated Official SachBite Logo */}
          <div className="flex flex-col items-center">
            <SachBiteLogo
              size={140}
              showText={true}
              showTagline={true}
              animate={true}
            />

            {/* Subtitle & Delivery Partner Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.45 }}
              className="mt-4 flex flex-col items-center gap-1.5"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#ff5722] animate-pulse" />
                <span className="text-[11px] font-black tracking-wider uppercase text-[#e63900]">
                  Delivery Partner App
                </span>
              </div>

              <p className="text-xs font-bold text-[#b25511] mt-0.5">
                Food delivered with love ❤️
              </p>
            </motion.div>
          </div>

          {/* Bottom Loading Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="absolute bottom-12 flex flex-col items-center gap-2.5"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-orange-100 border-t-[#ff5722] animate-spin" />
              <div className="w-2 h-2 rounded-full bg-[#ff5722] absolute" />
            </div>
            <p className="text-[11px] font-bold text-gray-500">
              Connecting to SachBite Delivery Network...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

