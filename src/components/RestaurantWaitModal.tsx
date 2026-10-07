import React, { useState, useEffect } from 'react';
import { Clock, X, AlertTriangle, CheckCircle2, ShieldCheck, ChefHat } from 'lucide-react';
import { motion } from 'motion/react';

interface RestaurantWaitModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  restaurantName: string;
  onReportDelay: (minutes: number, reason: string) => void;
}

export const RestaurantWaitModal: React.FC<RestaurantWaitModalProps> = ({
  isOpen,
  onClose,
  orderId,
  restaurantName,
  onReportDelay,
}) => {
  const [waitReason, setWaitReason] = useState('Khana banne me time lag raha hai (Preparation Delay)');
  const [selectedMinutes, setSelectedMinutes] = useState(10);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportDelay(selectedMinutes, waitReason);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90dvh]"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Restaurant Wait Assistant</h3>
              <p className="text-[11px] text-amber-100">Penalty Protection & Timer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Wait Timer Activated!</h4>
              <p className="text-xs text-slate-500">
                +{selectedMinutes} minutes add kar diye gaye hain. Aapki on-time rating secure hai.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <ChefHat className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{restaurantName}</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Order #{orderId} ke liye delay report karein taaki late penalty na lage.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Kitna extra time lag raha hai?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSelectedMinutes(mins)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                        selectedMinutes === mins
                          ? 'bg-[#fff1e6] border-[#ff7a1a] text-[#b25511]'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      +{mins} Mins
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Delay Ka Reason:
                </label>
                <select
                  value={waitReason}
                  onChange={(e) => setWaitReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                >
                  <option value="Khana banne me time lag raha hai (Preparation Delay)">
                    🍳 Khana banne me time lag raha hai (Preparation Delay)
                  </option>
                  <option value="Restaurant me bheed zyada hai (Heavy Rush)">
                    👥 Restaurant me bheed zyada hai (Heavy Rush)
                  </option>
                  <option value="Item packaging ya sealing baaki hai">
                    📦 Item packaging ya sealing baaki hai
                  </option>
                  <option value="Restaurant counter response nahi de raha">
                    ⏳ Counter response me delay
                  </option>
                </select>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>Customer ko SachBite app me automatically notification bhej di jayegi.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer"
              >
                Submit Delay & Protect Rating
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
