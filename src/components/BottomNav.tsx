import React from 'react';
import { Home, Package, DollarSign, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';

export type NavTab = 'home' | 'deliveries' | 'earnings' | 'alerts' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  pendingDeliveriesCount: number;
  unreadAlertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  pendingDeliveriesCount,
  unreadAlertsCount,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    {
      id: 'deliveries' as NavTab,
      label: 'Deliveries',
      icon: Package,
      badge: pendingDeliveriesCount,
      badgeColor: 'bg-[#ff7a1a]',
    },
    { id: 'earnings' as NavTab, label: 'Earnings', icon: DollarSign },
    {
      id: 'alerts' as NavTab,
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertsCount,
      badgeColor: 'bg-[#dc2626]',
    },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] select-none shrink-0"
      role="navigation"
      aria-label="Bottom Navigation"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
    >
      <div className="w-full max-w-md mx-auto grid grid-cols-5 h-15 items-center px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all duration-150 cursor-pointer touch-manipulation ${
                isActive ? 'text-[#ff7a1a]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  }`}
                />

                {/* Badge with Scale Animation */}
                {tab.badge && tab.badge > 0 ? (
                  <motion.span
                    key={`badge-${tab.id}-${tab.badge}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className={`absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 text-[9px] font-bold text-white rounded-full flex items-center justify-center shadow-xs ${tab.badgeColor}`}
                  >
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </motion.span>
                ) : null}
              </div>

              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 font-medium transition-colors truncate max-w-[64px] ${
                  isActive ? 'font-bold text-[#ff7a1a]' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0.5 w-6 h-0.5 bg-[#ff7a1a] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
