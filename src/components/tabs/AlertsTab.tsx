import React, { useEffect, useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { Bell, CheckCheck, Sparkles, AlertCircle, Clock, ShieldCheck, DollarSign, Package } from 'lucide-react';
import { motion } from 'motion/react';

export const AlertsTab: React.FC = () => {
  const { notifications, markNotificationsRead, unreadCount, showToast } = useDelivery();
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    // Automatically mark all notifications as read when opening this tab
    markNotificationsRead();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, [markNotificationsRead]);

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPushStatus(res);
        if (res === 'granted') {
          showToast('🔔 Push notifications enabled! You will be alerted for orders.');
          new Notification('SachBite Delivery Partner', {
            body: 'Real-time order alerts are now active on your device.',
            icon: '/icon.svg',
          });
        } else {
          showToast('Notification permission denied.');
        }
      } catch {
        showToast('Push notifications not supported on this browser.');
      }
    }
  };

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1e1e1e]">Alerts & Notices</h2>
          <p className="text-xs text-[#6b7280]">
            Order assignments, payout credits, and hub announcements
          </p>
        </div>
        <button
          onClick={() => markNotificationsRead()}
          className="text-xs font-semibold text-[#ff7a1a] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Push Notification Banner */}
      {pushStatus !== 'granted' && (
        <div className="p-4 rounded-3xl bg-[#fff1e6] border border-[#ff7a1a]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff7a1a] text-white shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1e1e1e]">Enable Loud Order Alerts</h4>
              <p className="text-[11px] text-[#b25511] mt-0.5">
                Never miss incoming orders when the screen is locked or app is in background.
              </p>
            </div>
          </div>
          <button
            onClick={requestPushPermission}
            className="py-2 px-3 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-95 text-white text-xs font-bold shrink-0 transition shadow-sm cursor-pointer"
          >
            Enable
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => {
          const isUnread = !notif.read;

          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-3xl border transition-all ${
                isUnread
                  ? 'bg-[#fff1e6] border-[#ff7a1a]/35 shadow-xs'
                  : 'bg-white border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isUnread
                      ? 'bg-[#ff7a1a] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {notif.type === 'order' ? (
                    <Package className="w-4 h-4" />
                  ) : notif.type === 'payout' ? (
                    <DollarSign className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs font-bold truncate ${
                        isUnread ? 'text-[#b25511]' : 'text-[#1e1e1e]'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-[#6b7280] shrink-0 font-medium">
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-[#1e1e1e]/80 mt-1 leading-relaxed">
                    {notif.body}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-[#1e1e1e]">No Notifications Yet</h4>
            <p className="text-xs text-[#6b7280]">
              You are all caught up. New order assignments and alerts will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
