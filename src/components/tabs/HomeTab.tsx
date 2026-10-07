import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { soundEffects } from '../../services/audio';
import { voiceAssistant } from '../../services/voice';
import { OrderCard } from '../OrderCard';
import { RateCardModal } from '../RateCardModal';
import { RiderKitStoreModal } from '../RiderKitStoreModal';
import { InstantWithdrawModal } from '../InstantWithdrawModal';
import { LeaderboardModal } from '../LeaderboardModal';
import { KantiGuideModal } from '../KantiGuideModal';
import { RiderGuidelinesModal } from '../RiderGuidelinesModal';
import {
  TrendingUp,
  Package,
  Wallet,
  Star,
  RefreshCw,
  Award,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Coffee,
  Volume2,
  VolumeX,
  Flame,
  Fuel,
  Clock,
  Play,
  Pause,
  BellRing,
  ShoppingBag,
  Zap,
  Trophy,
  Compass,
  CloudRain,
  Sun,
  BatteryCharging,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab } from '../BottomNav';

interface HomeTabProps {
  onNavigateTab: (tab: NavTab) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateTab }) => {
  const {
    earnings,
    pendingOrders,
    activeOrders,
    isLoadingOrders,
    refreshOrders,
    refreshEarnings,
    partnerName,
    isOnline,
    profile,
    isOnBreak,
    breakRemainingSeconds,
    startBreak,
    endBreak,
    dutyMinutes,
    distanceTraveledTodayKm,
    estimatedFuelCost,
    isVoiceActive,
    toggleVoice,
    showToast,
    isRainSurgeActive,
    toggleRainSurge,
    kitOrders,
    purchaseKitItem,
    withdrawEarnings,
  } = useDelivery();

  const [showRateCardModal, setShowRateCardModal] = useState(false);
  const [showBreakPicker, setShowBreakPicker] = useState(false);
  const [showKitStoreModal, setShowKitStoreModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  const handleRefresh = async () => {
    await Promise.all([refreshOrders(), refreshEarnings()]);
  };

  const todayEarnings = earnings?.todayEarnings ?? 0;
  const totalEarnings = earnings?.totalEarnings ?? 0;
  const todayDeliveries = earnings?.todayDeliveries ?? 0;
  const pendingAmount = earnings?.pendingAmount ?? 0;
  const avgRating = profile?.avgRating ?? (earnings?.ratePerDelivery ? 4.9 : 4.8);
  const dailyTarget = earnings?.dailyTarget ?? 10;
  const targetBonus = earnings?.targetBonus ?? 150;
  const targetProgressPercent = Math.min(100, Math.round((todayDeliveries / dailyTarget) * 100));

  const dutyHoursText = `${Math.floor(dutyMinutes / 60)}h ${dutyMinutes % 60}m`;
  const breakMinutesRemaining = Math.ceil(breakRemainingSeconds / 60);

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Partner Greeting & Quick Controls */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#6b7280]">Namaste 🙏</span>
          <h2 className="text-lg font-black text-[#1e1e1e] truncate">
            {partnerName || 'Delivery Partner'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick Sound & Vibration Test Button */}
          <button
            onClick={() => {
              soundEffects.playNewOrderAlert();
              voiceAssistant.announceNewOrder('SB-KANTI-01', 350, true);
              showToast('🔔 Loud Ringtone & Vibration Triggered!');
            }}
            className="p-2 rounded-full bg-[#fff1e6] border border-[#ff7a1a]/40 text-[#ff7a1a] hover:bg-[#ffe3cf] transition shadow-xs cursor-pointer active:scale-90"
            title="Test Loud Order Ringtone & Vibration"
          >
            <BellRing className="w-4 h-4 animate-pulse" />
          </button>

          {/* Voice Prompt Toggle Button */}
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full border transition cursor-pointer ${
              isVoiceActive
                ? 'bg-[#fff1e6] border-[#ff7a1a]/40 text-[#ff7a1a]'
                : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}
            title={isVoiceActive ? 'Voice Announcements On' : 'Voice Announcements Muted'}
          >
            {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoadingOrders}
            className="p-2 rounded-full bg-white border border-slate-200 text-[#6b7280] hover:text-[#ff7a1a] hover:bg-[#fff1e6] transition shadow-sm active:scale-95 cursor-pointer"
            title="Refresh dashboard"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-[#ff7a1a]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Monsoon Rain / Weather Surge Banner */}
      <div className="p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/20">
            <CloudRain className="w-5 h-5 text-blue-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold">Kanti Monsoon Rain Surge</h4>
              <span className="text-[9px] font-black px-1.5 py-0.2 bg-amber-400 text-amber-950 rounded-full">
                +₹25 EXTRA / TRIP
              </span>
            </div>
            <p className="text-[10.5px] text-blue-100 mt-0.5">
              Bad weather extra allowance active for all Kanti deliveries.
            </p>
          </div>
        </div>

        <button
          onClick={toggleRainSurge}
          className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-blue-900 hover:bg-blue-50 transition cursor-pointer shadow-2xs shrink-0"
        >
          {isRainSurgeActive ? 'Active' : 'Turn On'}
        </button>
      </div>

      {/* Quick Access Action Hub Strip */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* Kit Store */}
        <button
          onClick={() => setShowKitStoreModal(true)}
          className="p-2.5 bg-white rounded-2xl border border-slate-200/90 hover:border-[#ff7a1a] shadow-2xs flex flex-col items-center justify-center transition active:scale-95 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-[#fff1e6] text-[#ff7a1a] group-hover:bg-[#ff7a1a] group-hover:text-white transition">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1">Kit Store</span>
        </button>

        {/* Instant Payout */}
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="p-2.5 bg-white rounded-2xl border border-slate-200/90 hover:border-green-500 shadow-2xs flex flex-col items-center justify-center transition active:scale-95 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1">Instant Payout</span>
        </button>

        {/* Leaderboard */}
        <button
          onClick={() => setShowLeaderboardModal(true)}
          className="p-2.5 bg-white rounded-2xl border border-slate-200/90 hover:border-amber-500 shadow-2xs flex flex-col items-center justify-center transition active:scale-95 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1">Leaderboard</span>
        </button>

        {/* Kanti Guide */}
        <button
          onClick={() => setShowGuideModal(true)}
          className="p-2.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-500 shadow-2xs flex flex-col items-center justify-center transition active:scale-95 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            <Compass className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1">Kanti Guide</span>
        </button>
      </div>

      {/* Break Mode Active Banner */}
      <AnimatePresence>
        {isOnBreak && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white/20">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold">Break Mode Active</h4>
                <p className="text-[11px] opacity-90">
                  {breakMinutesRemaining} min{breakMinutesRemaining === 1 ? '' : 's'} remaining · Orders paused
                </p>
              </div>
            </div>
            <button
              onClick={endBreak}
              className="py-1 px-3 rounded-full bg-white text-amber-900 text-xs font-bold shadow-xs hover:bg-amber-50 transition cursor-pointer"
            >
              Resume Duty
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duty Shift & Quick Tools Strip */}
      <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#1e1e1e]">
          <Clock className="w-4 h-4 text-[#ff7a1a]" />
          <span className="font-bold">Shift: {dutyHoursText}</span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-1.5 text-[#6b7280]">
          <Fuel className="w-4 h-4 text-[#ff7a1a]" />
          <span>{distanceTraveledTodayKm} km (~₹{estimatedFuelCost})</span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Break Trigger */}
        <div className="relative">
          <button
            onClick={() => setShowBreakPicker(!showBreakPicker)}
            className="text-xs font-bold text-[#b25511] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Break</span>
          </button>

          {showBreakPicker && (
            <div className="absolute right-0 top-8 z-30 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 px-2 py-1">Pause Orders:</span>
              <button
                onClick={() => {
                  startBreak(15);
                  setShowBreakPicker(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-700"
              >
                ☕ 15 mins Tea
              </button>
              <button
                onClick={() => {
                  startBreak(30);
                  setShowBreakPicker(false);
                }}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-xs font-semibold text-slate-700"
              >
                🍱 30 mins Lunch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Earning */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6b7280]">Today's Earnings</span>
            <div className="p-1.5 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e1e1e] font-mono tabular-nums">
            ₹{todayEarnings}
          </div>
          <span className="text-[11px] text-[#b25511] font-semibold mt-0.5 inline-block">
            {todayDeliveries} trips completed
          </span>
        </motion.div>

        {/* Today's Deliveries */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6b7280]">Today's Orders</span>
            <div className="p-1.5 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e1e1e] font-mono tabular-nums">
            {todayDeliveries}
          </div>
          <span className="text-[11px] text-[#b25511] font-semibold mt-0.5 inline-block">
            Target: {dailyTarget} orders
          </span>
        </motion.div>

        {/* Pending Payout */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6b7280]">Pending Payout</span>
            <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e1e1e] font-mono tabular-nums">
            ₹{pendingAmount}
          </div>
          <span className="text-[11px] text-purple-700 font-semibold mt-0.5 inline-block">
            Weekly bank transfer
          </span>
        </motion.div>

        {/* Partner Rating */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-3xl bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#6b7280]">Partner Rating</span>
            <div className="p-1.5 rounded-xl bg-amber-50 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#1e1e1e] font-mono tabular-nums flex items-center gap-1">
            <span>{avgRating.toFixed(1)}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 inline-block">
            Top Rated Partner
          </span>
        </motion.div>
      </div>

      {/* Daily Incentive Target Card with Rate Card Sheet Trigger */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#ff7a1a] to-[#e85d04] text-white shadow-md shadow-[#ff7a1a]/25">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Daily Milestone Target</h3>
              <p className="text-[11px] text-orange-100">
                {todayDeliveries}/{dailyTarget} deliveries — hit target for ₹{targetBonus} bonus
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRateCardModal(true)}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-[#b25511] hover:bg-orange-50 transition cursor-pointer shadow-xs"
          >
            Rate Card
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${targetProgressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Delivery Zone Lock Card - EXCLUSIVELY KANTI (INDIRAPURAM / BHIR) */}
      <div className="p-3.5 bg-[#fff1e6] border border-[#ff7a1a]/30 rounded-3xl flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#ff7a1a] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            📍
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-[#b25511]">Zone: Kanti (Indirapuram & Bhir Area Only)</h4>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#ff7a1a] text-white">EXCLUSIVE</span>
            </div>
            <p className="text-[11px] text-[#1e1e1e]/85 mt-0.5">
              Aapki duty strictly <strong>Kanti (Indirapuram, Bhir, Kanti Station & Bazar)</strong> radius me locked hai.
            </p>
          </div>
        </div>
      </div>

      {/* High Demand Hotspot Zones Card */}
      <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#ff7a1a]" />
            <h3 className="text-xs font-bold text-[#1e1e1e]">Kanti Surge Hotspots</h3>
          </div>
          <span className="text-[10px] font-bold text-[#b25511] bg-[#fff1e6] border border-[#ff7a1a]/30 px-2 py-0.5 rounded-full">
            🔥 Live Kanti Surge
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/60">
            <div className="font-bold text-orange-950 truncate">Indirapuram & Bhir Chowk</div>
            <p className="text-[10px] text-orange-800 font-semibold mt-0.5">🔥 +₹15 surge per delivery</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-orange-50/80 border border-orange-200/60">
            <div className="font-bold text-orange-950 truncate">Kanti Bazar & Thermal Gate</div>
            <p className="text-[10px] text-orange-800 font-semibold mt-0.5">⚡ High order frequency</p>
          </div>
        </div>
      </div>

      {/* Active Work / In-Progress Deliveries Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1e1e1e]">Current Deliveries</h3>
            {(pendingOrders.length > 0 || activeOrders.length > 0) && (
              <span className="px-2 py-0.5 rounded-full bg-[#ff7a1a] text-white text-[10px] font-bold shadow-2xs">
                {pendingOrders.length + activeOrders.length} active
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigateTab('deliveries')}
            className="text-xs font-semibold text-[#ff7a1a] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Pending Assignment Cards First */}
        {pendingOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {/* 2. Accepted In-Progress Order Cards */}
        {activeOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {/* Empty State */}
        {pendingOrders.length === 0 && activeOrders.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#fff1e6] text-[#ff7a1a] mx-auto flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1e1e1e]">No Active Orders Right Now</h4>
              <p className="text-xs text-[#6b7280] max-w-xs mx-auto mt-1">
                {isOnline
                  ? 'Aap ONLINE hain. Kanti (Indirapuram / Bhir) se naya order aate hi screen par alert aayega.'
                  : 'Aap abhi OFFLINE hain. Kanti me delivery lene ke liye upar wala switch ON karein.'}
              </p>
            </div>
            {isOnline && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[11px] font-semibold text-[#b25511] border border-orange-200/60">
                <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-ping" />
                <span>Searching orders in Kanti (Indirapuram/Bhir)...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Safety & Guidelines Notice Card */}
      <div className="p-3.5 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/20 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-[#ff7a1a] text-white shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-[#1e1e1e]">Rider Training & Guidelines</h4>
            <p className="text-[10.5px] text-[#b25511] mt-0.5 truncate">
              Order pickup, OTP rules, COD deposit aur safety tips
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowGuidelinesModal(true)}
          className="px-3 py-1.5 rounded-full bg-[#ff7a1a] text-white text-[10.5px] font-bold shadow-2xs hover:bg-[#e85d04] transition shrink-0 cursor-pointer"
        >
          Read Rules
        </button>
      </div>

      {/* Modals */}
      <RateCardModal
        isOpen={showRateCardModal}
        onClose={() => setShowRateCardModal(false)}
        partnerRating={avgRating}
      />

      <RiderKitStoreModal
        isOpen={showKitStoreModal}
        onClose={() => setShowKitStoreModal(false)}
        walletBalance={totalEarnings}
        onPurchase={purchaseKitItem}
        kitOrders={kitOrders}
      />

      <InstantWithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        availableBalance={totalEarnings}
        upiId={profile?.upiId || 'partner@okaxis'}
        bankAccount={`${profile?.bankAccountName || 'Sachin Kumar'} - ${profile?.bankAccountNumber || '918237482910'}`}
        onWithdraw={withdrawEarnings}
      />

      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        currentPartnerName={partnerName}
      />

      <KantiGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />

      <RiderGuidelinesModal
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
      />
    </div>
  );
};
