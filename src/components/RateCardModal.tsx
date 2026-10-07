import React from 'react';
import { Award, Zap, TrendingUp, ShieldCheck, X, Flame, CloudRain, Moon, Gift } from 'lucide-react';
import { motion } from 'motion/react';

interface RateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerRating: number;
}

export const RateCardModal: React.FC<RateCardModalProps> = ({ isOpen, onClose, partnerRating }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[88vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">SachBite Official Rate Card</h3>
              <p className="text-[11px] text-[#6b7280]">Earnings & Milestone Incentive Policy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner Tier Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">
              Current Partner Tier
            </span>
            <h4 className="text-base font-black">Gold Level Delivery Partner</h4>
            <p className="text-[11px] opacity-90 mt-0.5">Rating: {partnerRating.toFixed(1)} ⭐ · Priority Allocation</p>
          </div>
          <Award className="w-8 h-8 text-amber-200" />
        </div>

        {/* Payout Components Breakdown */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
            Fare Structure
          </h4>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#1e1e1e]">Base Delivery Fare</span>
              <p className="text-[10px] text-[#6b7280]">For the first 3.0 kilometers</p>
            </div>
            <span className="text-sm font-black text-[#ff7a1a] font-mono">₹40.00</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#1e1e1e]">Distance Pay (Beyond 3km)</span>
              <p className="text-[10px] text-[#6b7280]">Per kilometer extra distance</p>
            </div>
            <span className="text-sm font-black text-[#ff7a1a] font-mono">₹10.00 / km</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#1e1e1e]">Customer Waiting Compensation</span>
              <p className="text-[10px] text-[#6b7280]">After 5 minutes doorstep wait</p>
            </div>
            <span className="text-sm font-black text-[#ff7a1a] font-mono">₹2.00 / min</span>
          </div>
        </div>

        {/* Surge Boosters */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
            Active Surge Boosters
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-1.5 text-orange-900 font-bold">
                <Flame className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>Peak Lunch/Dinner</span>
              </div>
              <p className="text-[10px] text-orange-800 mt-1 font-semibold">+₹15 / order</p>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                <span>Rain Surge</span>
              </div>
              <p className="text-[10px] text-blue-800 mt-1 font-semibold">+₹30 / order</p>
            </div>
          </div>
        </div>

        {/* Daily Incentive Targets */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">
            Daily Milestone Bonuses
          </h4>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>Complete 5 Deliveries:</span>
              <span className="font-bold text-[#ff7a1a] font-mono">+₹50 Bonus</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-[#fff1e6] font-bold text-[#b25511] border border-[#ff7a1a]/30">
              <span>Complete 10 Deliveries:</span>
              <span className="font-mono">+₹150 Bonus</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>Complete 15 Deliveries:</span>
              <span className="font-bold text-[#ff7a1a] font-mono">+₹300 Bonus</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl bg-slate-50">
              <span>Complete 20 Deliveries:</span>
              <span className="font-bold text-[#ff7a1a] font-mono">+₹500 Bonus</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer"
        >
          Got It, Back to Dashboard
        </button>
      </motion.div>
    </div>
  );
};
