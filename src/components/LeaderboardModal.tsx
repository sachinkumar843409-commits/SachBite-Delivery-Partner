import React from 'react';
import { LeaderboardRider } from '../types/delivery';
import { Trophy, Medal, Star, X, Award, Flame, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPartnerName: string;
}

export const KANTI_LEADERBOARD: LeaderboardRider[] = [
  {
    rank: 1,
    name: 'Rakesh Sharma',
    zone: 'Kanti Indirapuram',
    deliveries: 142,
    onTimePercent: 99.2,
    rating: 4.95,
    bonusAmount: 500,
    badge: '👑 Star King',
  },
  {
    rank: 2,
    name: 'Sachin Kumar',
    zone: 'Kanti Bhir Zone',
    deliveries: 128,
    onTimePercent: 98.4,
    rating: 4.92,
    bonusAmount: 350,
    badge: '⚡ Lightning Fast',
    isCurrentUser: true,
  },
  {
    rank: 3,
    name: 'Amit Kumar Rai',
    zone: 'Kanti Station Road',
    deliveries: 115,
    onTimePercent: 97.8,
    rating: 4.88,
    bonusAmount: 200,
    badge: '🔥 Top Performer',
  },
  {
    rank: 4,
    name: 'Vikash Paswan',
    zone: 'Thermal Power Colony',
    deliveries: 98,
    onTimePercent: 96.5,
    rating: 4.82,
    bonusAmount: 100,
    badge: '🚀 Speed Master',
  },
  {
    rank: 5,
    name: 'Md. Imran',
    zone: 'Kanti Nagar Parishad',
    deliveries: 84,
    onTimePercent: 95.0,
    rating: 4.78,
    bonusAmount: 50,
    badge: '🌟 Rising Star',
  },
];

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentPartnerName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90dvh]"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20">
              <Trophy className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Kanti Rider Leaderboard</h3>
              <p className="text-[11px] text-orange-100">Weekly Top Performers & Cash Bonus</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Podium Top 3 */}
        <div className="p-4 bg-gradient-to-b from-[#fff1e6] to-white border-b border-orange-100 text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#b25511] px-2 py-0.5 rounded-full bg-white border border-[#ff7a1a]/30 shadow-2xs">
            🏆 Weekly Reward Pool: ₹1,500
          </span>

          <div className="flex items-end justify-center gap-2 mt-4 pt-2">
            {/* Rank 2 */}
            <div className="flex flex-col items-center">
              <span className="text-xl">🥈</span>
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center font-bold text-xs mt-1">
                2
              </div>
              <span className="text-[10px] font-bold text-slate-800 mt-1 truncate max-w-[70px]">You (#2)</span>
              <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1 rounded-sm">+₹350</span>
              <div className="w-16 h-12 bg-slate-300 rounded-t-xl mt-1 flex items-center justify-center text-xs font-bold text-slate-700">
                128
              </div>
            </div>

            {/* Rank 1 */}
            <div className="flex flex-col items-center">
              <span className="text-2xl animate-bounce">👑</span>
              <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center font-black text-sm text-amber-900 mt-1 shadow-md">
                1
              </div>
              <span className="text-[10.5px] font-black text-slate-900 mt-1 truncate max-w-[80px]">Rakesh S.</span>
              <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 rounded-sm">+₹500</span>
              <div className="w-20 h-18 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-xl mt-1 flex items-center justify-center text-sm font-black text-amber-950 shadow-sm">
                142
              </div>
            </div>

            {/* Rank 3 */}
            <div className="flex flex-col items-center">
              <span className="text-xl">🥉</span>
              <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-orange-400 flex items-center justify-center font-bold text-xs text-orange-900 mt-1">
                3
              </div>
              <span className="text-[10px] font-bold text-slate-800 mt-1 truncate max-w-[70px]">Amit Rai</span>
              <span className="text-[9px] font-bold text-green-700 bg-green-100 px-1 rounded-sm">+₹200</span>
              <div className="w-16 h-8 bg-orange-200 rounded-t-xl mt-1 flex items-center justify-center text-xs font-bold text-orange-900">
                115
              </div>
            </div>
          </div>
        </div>

        {/* Full List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs">
          {KANTI_LEADERBOARD.map((rider) => (
            <div
              key={rider.rank}
              className={`p-3 rounded-2xl border transition flex items-center justify-between ${
                rider.isCurrentUser
                  ? 'bg-[#fff1e6] border-[#ff7a1a] shadow-xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                    rider.rank === 1
                      ? 'bg-amber-400 text-amber-950'
                      : rider.rank === 2
                      ? 'bg-slate-300 text-slate-800'
                      : rider.rank === 3
                      ? 'bg-orange-300 text-orange-900'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {rider.rank}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-bold text-slate-900 truncate">
                      {rider.name} {rider.isCurrentUser && '(Aap)'}
                    </h4>
                    <span className="text-[9px] font-semibold text-slate-500">{rider.badge}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span>📍 {rider.zone}</span>
                    <span>★ {rider.rating}</span>
                    <span>⏱ {rider.onTimePercent}% On-time</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-slate-900 text-xs block">{rider.deliveries} orders</span>
                <span className="text-[10px] font-bold text-green-600">+₹{rider.bonusAmount} Bonus</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
