import React, { useState } from 'react';
import { MapPin, X, Navigation, Compass, Flame, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface KantiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Landmark {
  name: string;
  zone: string;
  type: string;
  tip: string;
  surge: string;
}

const KANTI_LANDMARKS: Landmark[] = [
  {
    name: 'Indirapuram Main Chowk',
    zone: 'Indirapuram, Kanti',
    type: 'High Demand Food Hub',
    tip: 'Station road se aate waqt railway dhalan ke paas short cut rasta hai.',
    surge: '🔥 +₹25 Surge',
  },
  {
    name: 'Bhir Market & Colony',
    zone: 'Bhir, Kanti',
    type: 'Residential Density',
    tip: 'Bhir chowk ke andar bike slow chalayein, sham ke samay market bheed rehti hai.',
    surge: '⚡ +₹20 Surge',
  },
  {
    name: 'Kanti Thermal Power Plant (MTPS Colony)',
    zone: 'Thermal Power Colony',
    type: 'VIP Quarter & Offices',
    tip: 'Gate No. 1 par security entry ke liye SachBite Partner ID zaroor dikhayein.',
    surge: '🔥 +₹30 Surge',
  },
  {
    name: 'Kanti Station Road & Market',
    zone: 'Station Road',
    type: 'Primary Restaurant Hub',
    tip: 'Top restaurants yahin hain: Kanti Swad, Biryani Mahal, Champaran Meat House.',
    surge: '⚡ +₹15 Surge',
  },
  {
    name: 'Kanti Nagar Parishad & High School Chowk',
    zone: 'Nagar Parishad',
    type: 'Central Junction',
    tip: 'Purani Bazaar gali se Indirapuram bypass rasta bina traffic ke milta hai.',
    surge: '🔥 +₹20 Surge',
  },
];

export const KantiGuideModal: React.FC<KantiGuideModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = KANTI_LANDMARKS.filter(
    (l) =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Kanti Shortcuts & Guide</h3>
              <p className="text-[11px] text-orange-100">Local Area Directory & Shortcuts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Kanti location (e.g. Indirapuram, Bhir)..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
          />
        </div>

        {/* Landmarks list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs">
          {filtered.map((lm, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#ff7a1a] shrink-0" />
                    <span>{lm.name}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">{lm.type}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] font-bold text-[10px] shrink-0 border border-[#ff7a1a]/30">
                  {lm.surge}
                </span>
              </div>

              <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 leading-relaxed">
                💡 <strong>Rider Tip:</strong> {lm.tip}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
