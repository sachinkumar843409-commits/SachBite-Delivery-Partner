import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { Bell, Navigation, Power, PlusCircle, Radio, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onOpenNotifications: () => void;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, activeTab }) => {
  const {
    isOnline,
    toggleOnline,
    isTrackingActive,
    unreadCount,
    isDemoMode,
    simulateNewOrder,
  } = useDelivery();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] select-none">
      {/* Top Main Bar - Responsive on all devices */}
      <div className="w-full max-w-md mx-auto px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1">
        {/* Brand Wordmark Zone */}
        <div className="flex flex-col shrink-0 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-lg bg-orange-50 border border-orange-200/80 p-0.5 flex items-center justify-center shrink-0 shadow-2xs">
              <img src="/icon.svg" alt="SachBite" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center">
              <span className="text-base sm:text-lg font-black text-[#1a1c1e] tracking-tight leading-none">Sach</span>
              <span className="text-base sm:text-lg font-black text-[#ff5722] tracking-tight leading-none">Bite</span>
            </div>
          </div>
          <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#b25511] tracking-tight flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
            Food delivered with love ❤️
          </span>
        </div>

        {/* Right Action Zone: Kanti, Order, Online Toggle & Bell all in same line without any overflow */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Kanti Zone Badge */}
          <div className="h-6.5 sm:h-7 inline-flex items-center gap-0.5 px-1.5 sm:px-2 rounded-full bg-[#fff1e6] text-[#b25511] border border-[#ff7a1a]/30 text-[9px] sm:text-[10px] font-extrabold shadow-2xs leading-none shrink-0">
            <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff7a1a]" />
            <span>Kanti</span>
          </div>

          {/* Demo trigger helper */}
          {isDemoMode && (
            <button
              onClick={simulateNewOrder}
              title="Simulate incoming order"
              className="h-6.5 sm:h-7 px-1.5 sm:px-2 rounded-full bg-[#fff1e6] text-[#b25511] hover:bg-[#ffe3cf] text-[9px] sm:text-[10px] font-extrabold flex items-center gap-0.5 transition active:scale-95 cursor-pointer border border-[#ff7a1a]/30 shadow-2xs leading-none shrink-0"
            >
              <PlusCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff7a1a]" />
              <span>+Order</span>
            </button>
          )}

          {/* Online/Offline Toggle Switch */}
          <button
            onClick={() => toggleOnline()}
            className={`h-6.5 sm:h-7 flex items-center gap-1 px-2 sm:px-2.5 rounded-full text-[9.5px] sm:text-[10.5px] font-extrabold transition-all duration-200 shadow-2xs cursor-pointer leading-none shrink-0 ${
              isOnline
                ? 'bg-[#fff1e6] text-[#b25511] border border-[#ff7a1a]/40'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
            aria-label={isOnline ? 'Go Offline' : 'Go Online'}
            title={isOnline ? 'You are Online: Tap to go Offline' : 'You are Offline: Tap to go Online'}
          >
            <span className="relative flex h-1.5 w-1.5">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a1a] opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  isOnline ? 'bg-[#ff7a1a]' : 'bg-slate-400'
                }`}
              />
            </span>
            <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            <Power className="w-2.5 h-2.5 opacity-80" />
          </button>

          {/* Bell Icon with Unread Badge */}
          <button
            onClick={onOpenNotifications}
            className={`h-6.5 w-6.5 sm:h-7 sm:w-7 relative flex items-center justify-center rounded-full hover:bg-slate-100 transition cursor-pointer shrink-0 ${
              activeTab === 'alerts' ? 'bg-[#fff1e6] text-[#ff7a1a]' : 'text-slate-700'
            }`}
            aria-label="Alerts"
            title="Notifications & Alerts"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] px-0.5 bg-[#dc2626] text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-xs leading-none"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>
        </div>
      </div>

      {/* Persistent Live Location Sharing Banner */}
      <AnimatePresence>
        {isTrackingActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] text-white"
          >
            <div className="w-full max-w-md mx-auto px-4 py-1.5 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span>📍 Live location share ho raha hai...</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] opacity-90">
                <Navigation className="w-3 h-3 animate-pulse" />
                <span>GPS Active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Warning Banner */}
      {!isOnline && (
        <div className="bg-slate-800 text-slate-200 text-[11px] sm:text-xs py-1 px-4 text-center font-medium">
          Aap abhi Offline hain. Naye order lene ke liye switch ON karein.
        </div>
      )}
    </header>
  );
};
