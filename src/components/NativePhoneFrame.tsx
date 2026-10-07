import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal, Maximize2 } from 'lucide-react';

interface NativePhoneFrameProps {
  children: React.ReactNode;
}

export const NativePhoneFrame: React.FC<NativePhoneFrameProps> = ({ children }) => {
  const [deviceSkin, setDeviceSkin] = useState<boolean>(true);
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8fafc] flex flex-col items-center justify-start md:justify-center p-0 md:p-4 select-none overflow-x-hidden">
      {/* Top Device Bar (Visible only on desktop screens for quick preview switching) */}
      <aside aria-label="Device Preview Controls" className="hidden md:flex items-center justify-between w-full max-w-[430px] mb-2 px-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-bold text-slate-700">
          <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse" />
          <span>SachBite Partner · Responsive View</span>
        </div>
        <button
          onClick={() => setDeviceSkin(!deviceSkin)}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition cursor-pointer text-[11px] font-semibold"
          title="Toggle phone frame skin on desktop"
        >
          {deviceSkin ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <span>Mobile Frame</span>
            </>
          )}
        </button>
      </aside>

      {/* Main Responsive App Viewport */}
      <div
        className={`w-full bg-[#fafafa] flex flex-col h-[100dvh] transition-all duration-200 ${
          deviceSkin
            ? 'md:max-w-[430px] md:h-[880px] md:max-h-[94vh] md:rounded-[40px] md:shadow-[0_20px_50px_rgba(0,0,0,0.14)] md:border-[7px] md:border-slate-900 md:overflow-hidden relative'
            : 'md:max-w-xl md:h-[94vh] md:rounded-2xl md:shadow-lg md:border md:border-slate-200 md:overflow-hidden relative'
        }`}
      >
        {/* Native Mobile Status Bar (Simulated on desktop frame) */}
        <div className="hidden md:flex items-center justify-between px-6 pt-3 pb-1 bg-white text-slate-900 text-[11px] font-semibold tracking-tight shrink-0 select-none z-40 border-b border-slate-100">
          <span>{currentTime}</span>

          {/* Dynamic Island / Speaker Pill */}
          <div className="w-20 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-800" />
          </div>

          <div className="flex items-center gap-1.5 text-slate-800">
            <Signal className="w-3 h-3 stroke-[2.5]" />
            <Wifi className="w-3 h-3 stroke-[2.5]" />
            <Battery className="w-3.5 h-3.5 stroke-[2.5] fill-slate-800" />
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
};
