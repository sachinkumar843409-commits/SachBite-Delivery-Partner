import React, { useState } from 'react';
import {
  BookOpen,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Phone,
  Banknote,
  Camera,
  ChefHat,
  ShoppingBag,
  Award,
  Clock,
  MapPin,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RiderGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuidelineStep {
  step: string;
  title: string;
  icon: string;
  description: string;
  dos: string[];
  donts: string[];
}

const GUIDELINE_STEPS: GuidelineStep[] = [
  {
    step: '1',
    title: 'Duty Start & Order Accept Karna',
    icon: '🛵',
    description: 'Duty start karne ke liye app ke top bar me switch ko ONLINE karein.',
    dos: [
      'Loud order chime & vibration aate hi 30 seconds ke andar "Accept" dabayein.',
      'Phone volume hamesha full rakhein aur GPS location on rakhein.',
      'Agar chai ya lunch break lena ho to "Break Mode" active karein taaki penalty na lage.',
    ],
    donts: [
      'Bina vajah baar-baar orders decline na karein, isse payout incentive kam ho sakta hai.',
      'Offline rehne par orders assign nahi honge.',
    ],
  },
  {
    step: '2',
    title: 'Restaurant Pickup & Item Checklist',
    icon: '🏪',
    description: 'Order accept karne ke baad restaurant pahuch kar "Reached Restaurant" dabayein.',
    dos: [
      'Restaurant counter par SachBite Order ID (jaise #SB-101) batayein.',
      'Food packet lene ke baad "Item Checklist" me sabhi items (sabji, roti, biryani) count karein.',
      'Khana hamesha SachBite Insulated Thermal Bag me rakhein taaki garam rahe.',
      'Agar restaurant der kare to "Delay Assistant (+5 / +10 mins)" daba kar time badhayein.',
    ],
    donts: [
      'Bina items check kiye packet pick na karein.',
      'Khana bag ke bahar ya open handle par na latkayein.',
    ],
  },
  {
    step: '3',
    title: 'Customer Delivery & 4-Digit OTP Handover',
    icon: '📍',
    description: 'Customer location par pahuch kar "Arrived at Customer" dabayein.',
    dos: [
      'Customer ko politely namaste kahein aur packet handover karein.',
      'Customer se 4-Digit Delivery OTP pooch kar app me daalein (Bina OTP delivery mark nahi hogi).',
      'Contactless delivery hone par "Photo Proof" button se doorstep photo khinchein.',
      'Location samajh na aane par direct Call ya WhatsApp chat ka use karein.',
    ],
    donts: [
      'Customer se jhagda ya behes na karein; koi issue ho to Admin ko call karein.',
      'Galat OTP enter na karein.',
    ],
  },
  {
    step: '4',
    title: 'COD Cash Collection & Instant Payout',
    icon: '💰',
    description: 'Cash on Delivery (COD) order me exact payment collect karein.',
    dos: [
      'COD order me likha hua amount (jaise ₹350) customer se collect karein aur checkbox par tick karein.',
      'Customer ko change (khulla paisa) ready rakhne ko pehle se WhatsApp ya call par bata dein.',
      'Din ke ant me COD cash SachBite office ya UPI se settle karein.',
      'Apni kamayi (Earnings) ko kisi bhi waqt "1-Click Instant Payout" se UPI/Bank me withdraw karein.',
    ],
    donts: [
      'Customer se MRP / Bill amount se ₹1 bhi zyada na maangein.',
      'COD cash collect kiye bina delivery complete na karein.',
    ],
  },
  {
    step: '5',
    title: 'Uniform, Bag & Safety Rules',
    icon: '🛡️',
    description: 'Suraksha aur professional pehchan sabse zaroori hai.',
    dos: [
      'Ride karte waqt hamesha ISI certified Helmet pehnein.',
      'SachBite official T-Shirt aur Reflective Safety Vest pehen kar deliver karein.',
      'Emergency me app me diye gaye "Police 112" ya "SOS Contact" button ka use karein.',
      'SachBite ke ₹5,00,000 accidental insurance coverage ka labh uthayein.',
    ],
    donts: [
      'Over-speeding ya rash driving bilkul na karein.',
      'Chalti bike par phone screen na dekhein.',
    ],
  },
];

export const RiderGuidelinesModal: React.FC<RiderGuidelinesModalProps> = ({ isOpen, onClose }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = GUIDELINE_STEPS[activeStepIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden max-h-[90dvh]"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Rider App Guidelines & Rules</h3>
              <p className="text-[11px] text-orange-100">Step-by-Step Training Manual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Step Horizontal Tab Bar */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {GUIDELINE_STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeStepIndex === idx
                  ? 'bg-[#ff7a1a] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{step.icon}</span>
              <span>Step {step.step}</span>
            </button>
          ))}
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Step Header */}
          <div className="p-3.5 bg-[#fff1e6] border border-[#ff7a1a]/30 rounded-2xl flex items-center gap-3">
            <span className="text-3xl">{currentStep.icon}</span>
            <div>
              <span className="text-[10px] font-bold text-[#b25511] uppercase tracking-wider">
                Module {currentStep.step} of 5
              </span>
              <h4 className="text-sm font-bold text-slate-900">{currentStep.title}</h4>
              <p className="text-[11px] text-slate-600 mt-0.5">{currentStep.description}</p>
            </div>
          </div>

          {/* DO's (Sahi Tarika) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-green-800">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Sahi Tarika (DO's):</span>
            </div>
            <div className="space-y-1.5">
              {currentStep.dos.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-green-50/80 border border-green-200/80 text-green-950 text-[11px] flex items-start gap-2"
                >
                  <span className="font-bold text-green-600 shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DON'Ts (Galtiyan Jinse Bachein) */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>In Galtiyon Se Bachein (DON'Ts):</span>
            </div>
            <div className="space-y-1.5">
              {currentStep.donts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-red-50/80 border border-red-200/80 text-red-950 text-[11px] flex items-start gap-2"
                >
                  <span className="font-bold text-red-600 shrink-0">✕</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Next/Prev buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeStepIndex === 0}
              className={`px-4 py-2 rounded-full font-bold text-xs transition ${
                activeStepIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer'
              }`}
            >
              ← Previous
            </button>

            {activeStepIndex < GUIDELINE_STEPS.length - 1 ? (
              <button
                onClick={() => setActiveStepIndex((prev) => prev + 1)}
                className="px-5 py-2 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
              >
                <span>Next Module</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Samajh Gaya (Done)</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
