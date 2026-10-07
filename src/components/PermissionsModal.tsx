import React from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { MapPin, Bell, Camera, PhoneCall, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PermissionsModal: React.FC = () => {
  const { hasRequestedPermissions, requestDevicePermissions, dismissPermissions } = useDelivery();

  if (hasRequestedPermissions) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#fff1e6] text-[#ff7a1a] mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1e1e1e]">Delivery Partner Access</h3>
            <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
              To deliver orders smoothly and receive payouts, please enable device permissions:
            </p>
          </div>

          {/* List of Permissions with rationale */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-xl bg-orange-100 text-[#ff7a1a] shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1e1e1e]">GPS Location (Foreground & Background)</h4>
                <p className="text-[11px] text-[#6b7280] leading-snug mt-0.5">
                  Shares your live delivery route with customers and calculates trip distances while on active deliveries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-xl bg-orange-100 text-[#ff7a1a] shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1e1e1e]">Order Alerts & Sound Notifications</h4>
                <p className="text-[11px] text-[#6b7280] leading-snug mt-0.5">
                  Sends loud ring alerts for incoming order assignments, so you never miss an order while riding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1e1e1e]">Camera & Photos</h4>
                <p className="text-[11px] text-[#6b7280] leading-snug mt-0.5">
                  Allows uploading your partner profile picture and KYC verification documents.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-600 shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1e1e1e]">Phone Dialer</h4>
                <p className="text-[11px] text-[#6b7280] leading-snug mt-0.5">
                  1-tap calling to customer, restaurant, or emergency contact.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={requestDevicePermissions}
              className="w-full py-3.5 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-[0.98] text-white font-semibold text-xs shadow-md shadow-[#ff7a1a]/25 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Allow All Permissions</span>
            </button>

            <button
              onClick={dismissPermissions}
              className="w-full py-2.5 px-4 text-xs font-medium text-[#6b7280] hover:text-[#1e1e1e] transition cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
