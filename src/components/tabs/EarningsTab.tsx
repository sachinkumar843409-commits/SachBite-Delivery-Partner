import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { CodDepositModal } from '../CodDepositModal';
import { InstantWithdrawModal } from '../InstantWithdrawModal';
import { RiderKitStoreModal } from '../RiderKitStoreModal';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Award,
  ChevronDown,
  ChevronUp,
  Fuel,
  QrCode,
  Calculator,
  Zap,
  ShoppingBag,
} from 'lucide-react';
import { motion } from 'motion/react';

export const EarningsTab: React.FC = () => {
  const {
    earnings,
    refreshEarnings,
    distanceTraveledTodayKm,
    estimatedFuelCost,
    depositCodCash,
    withdrawEarnings,
    profile,
    kitOrders,
    purchaseKitItem,
  } = useDelivery();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<'deliveries' | 'payouts' | 'cod'>('deliveries');
  const [showCodDepositModal, setShowCodDepositModal] = useState(false);
  const [showInstantWithdrawModal, setShowInstantWithdrawModal] = useState(false);
  const [showKitStoreModal, setShowKitStoreModal] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshEarnings();
    setIsRefreshing(false);
  };

  const e = earnings;
  const todayEarnings = e?.todayEarnings ?? 0;
  const todayDeliveries = e?.todayDeliveries ?? 0;
  const weekEarnings = e?.weekEarnings ?? 0;
  const weekDeliveries = e?.weekDeliveries ?? 0;
  const monthEarnings = e?.monthEarnings ?? 0;
  const monthDeliveries = e?.monthDeliveries ?? 0;
  const totalEarnings = e?.totalEarnings ?? 0;
  const totalDeliveries = e?.totalDeliveries ?? 0;

  const pendingAmount = e?.pendingAmount ?? 0;
  const totalPaidOut = e?.totalPaidOut ?? 0;

  const codCollected = e?.codCollected ?? 0;
  const codDeposited = e?.codDeposited ?? 0;
  const codBalance = e?.codBalance ?? 0;

  const dailyTarget = e?.dailyTarget ?? 10;
  const targetBonus = e?.targetBonus ?? 150;
  const targetProgress = Math.min(100, Math.round((todayDeliveries / dailyTarget) * 100));

  return (
    <div className="space-y-5 pb-8 select-none">
      {/* Title & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1e1e1e]">Earnings & Wallet</h2>
          <p className="text-xs text-[#6b7280]">Real-time payout & COD settlement overview</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-full bg-white border border-slate-200 text-[#6b7280] hover:text-[#ff7a1a] hover:bg-[#fff1e6] transition shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ff7a1a]' : ''}`} />
        </button>
      </div>

      {/* 1. Wallet Card: Pending Payout vs Total Paid */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1e1e1e] to-slate-800 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/10 text-[#ff7a1a]">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Payout Wallet
              </span>
              <h3 className="text-sm font-bold text-white">SachBite Partner Balance</h3>
            </div>
          </div>
          <button
            onClick={() => setShowInstantWithdrawModal(true)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] hover:from-[#ff700f] hover:to-[#d94e00] text-white shadow-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Withdraw</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1 border-t border-white/10">
          <div>
            <span className="text-xs text-slate-400">Available Wallet Earnings</span>
            <div className="text-2xl font-black text-[#ff7a1a] font-mono tabular-nums mt-0.5">
              ₹{totalEarnings}
            </div>
            <span className="text-[10px] text-green-400 font-semibold">1-Click Instant UPI Transfer</span>
          </div>

          <div>
            <span className="text-xs text-slate-400">Total Paid Out</span>
            <div className="text-2xl font-black text-white font-mono tabular-nums mt-0.5">
              ₹{totalPaidOut}
            </div>
            <span className="text-[10px] text-slate-400">Direct to Bank / UPI</span>
          </div>
        </div>
      </div>

      {/* Quick Access Store and Withdraw Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowInstantWithdrawModal(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>⚡ Instant 1-Click Payout</span>
        </button>

        <button
          onClick={() => setShowKitStoreModal(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛍️ Buy Uniform / Bag</span>
        </button>
      </div>

      {/* 2. Stat Grid: Today · Week · Month · Lifetime */}
      <div>
        <h3 className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2.5">
          Earnings Breakdown
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Today */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6b7280]">Today</span>
            <div className="text-xl font-black text-[#1e1e1e] font-mono tabular-nums mt-1">
              ₹{todayEarnings}
            </div>
            <div className="text-[11px] text-[#b25511] font-semibold mt-0.5">
              {todayDeliveries} deliveries
            </div>
          </div>

          {/* This Week */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6b7280]">This Week</span>
            <div className="text-xl font-black text-[#1e1e1e] font-mono tabular-nums mt-1">
              ₹{weekEarnings}
            </div>
            <div className="text-[11px] text-[#b25511] font-semibold mt-0.5">
              {weekDeliveries} deliveries
            </div>
          </div>

          {/* This Month */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6b7280]">This Month</span>
            <div className="text-xl font-black text-[#1e1e1e] font-mono tabular-nums mt-1">
              ₹{monthEarnings}
            </div>
            <div className="text-[11px] text-purple-700 font-semibold mt-0.5">
              {monthDeliveries} deliveries
            </div>
          </div>

          {/* Lifetime */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <span className="text-[11px] font-semibold text-[#6b7280]">Lifetime</span>
            <div className="text-xl font-black text-[#1e1e1e] font-mono tabular-nums mt-1">
              ₹{totalEarnings}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
              {totalDeliveries} total trips
            </div>
          </div>
        </div>
      </div>

      {/* 3. Daily Target Progress Card */}
      <div className="p-4 rounded-3xl bg-white border border-[#ff7a1a]/30 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#ff7a1a]" />
            <h4 className="text-xs font-bold text-[#1e1e1e]">Daily Milestone Target</h4>
          </div>
          <span className="text-xs font-bold text-[#ff7a1a] font-mono">
            {todayDeliveries}/{dailyTarget} Completed
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#ff7a1a] h-full rounded-full transition-all duration-300"
            style={{ width: `${targetProgress}%` }}
          />
        </div>
        <p className="text-[11px] text-[#6b7280]">
          {todayDeliveries >= dailyTarget
            ? `🎉 Target Hit! ₹${targetBonus} bonus unlocked for today.`
            : `Complete ${dailyTarget - todayDeliveries} more deliveries today for ₹${targetBonus} extra bonus.`}
        </p>
      </div>

      {/* 4. COD Cash Balance Card */}
      <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              COD Cash In Hand
            </span>
            <h4 className="text-sm font-bold text-[#1e1e1e]">Cash Owed to SachBite</h4>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-amber-900 font-mono tabular-nums">
              ₹{codBalance}
            </div>
            <span className="text-[10px] text-amber-700 font-medium">To deposit at Hub</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
          <div>
            <span className="text-[#6b7280]">Total COD Collected:</span>
            <p className="font-bold text-[#1e1e1e] font-mono">₹{codCollected}</p>
          </div>
          <div>
            <span className="text-[#6b7280]">Total COD Deposited:</span>
            <p className="font-bold text-[#ff7a1a] font-mono">₹{codDeposited}</p>
          </div>
        </div>

        {/* Deposit Cash via UPI Button */}
        <button
          type="button"
          onClick={() => setShowCodDepositModal(true)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
        >
          <QrCode className="w-4 h-4" />
          <span>Pay & Clear COD Balance (UPI / Kanti Hub)</span>
        </button>
      </div>

      {/* 5. Fuel & Daily Expense Calculator Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="w-4 h-4 text-[#ff7a1a]" />
            <h4 className="text-xs font-bold text-[#1e1e1e]">Fuel & Net In-Pocket Earnings</h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">Today's Log</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-[10px] text-slate-500">Traveled</span>
            <p className="text-sm font-black text-[#1e1e1e] font-mono mt-0.5">{distanceTraveledTodayKm} km</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-orange-50">
            <span className="text-[10px] text-[#b25511]">Fuel Cost</span>
            <p className="text-sm font-black text-[#b25511] font-mono mt-0.5">-₹{estimatedFuelCost}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-[#fff1e6]">
            <span className="text-[10px] text-[#b25511] font-bold">Net In-Hand</span>
            <p className="text-sm font-black text-[#b25511] font-mono mt-0.5">
              ₹{Math.max(0, todayEarnings - estimatedFuelCost)}
            </p>
          </div>
        </div>
      </div>

      {/* History Tabs (Deliveries / Payouts / COD Deposits) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveSection('deliveries')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeSection === 'deliveries' ? 'bg-white text-[#1e1e1e] shadow-sm' : 'text-[#6b7280]'
            }`}
          >
            Delivery History
          </button>
          <button
            onClick={() => setActiveSection('payouts')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeSection === 'payouts' ? 'bg-white text-[#1e1e1e] shadow-sm' : 'text-[#6b7280]'
            }`}
          >
            Payout History
          </button>
          <button
            onClick={() => setActiveSection('cod')}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              activeSection === 'cod' ? 'bg-white text-[#1e1e1e] shadow-sm' : 'text-[#6b7280]'
            }`}
          >
            COD Deposits
          </button>
        </div>

        {/* Section 1: Delivery History */}
        {activeSection === 'deliveries' && (
          <div className="space-y-2.5">
            {e?.history && e.history.length > 0 ? (
              e.history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1e1e1e] truncate">
                        {item.customerName}
                      </span>
                      <span className="text-[10px] text-[#6b7280] font-mono">#{item.id}</span>
                    </div>
                    <p className="text-[11px] text-[#6b7280] truncate mt-0.5">
                      {item.customerAddress}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#16a34a] font-mono">
                      +₹{item.earning}
                    </div>
                    <span className="text-[10px] text-slate-400">Order: ₹{item.grandTotal}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-center py-6 text-[#6b7280]">No past deliveries yet.</p>
            )}
          </div>
        )}

        {/* Section 2: Payout History */}
        {activeSection === 'payouts' && (
          <div className="space-y-2.5">
            {e?.payoutHistory && e.payoutHistory.length > 0 ? (
              e.payoutHistory.map((payout) => (
                <div
                  key={payout.id}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1e1e]">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>{payout.note || 'Bank Transfer Settlement'}</span>
                    </div>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">
                      {new Date(payout.paidAt).toLocaleDateString([], {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-[#1e1e1e] font-mono">
                      ₹{payout.amount}
                    </div>
                    <span className="text-[10px] font-bold text-[#16a34a]">Credited</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-center py-6 text-[#6b7280]">No payout history available.</p>
            )}
          </div>
        )}

        {/* Section 3: COD Deposit History */}
        {activeSection === 'cod' && (
          <div className="space-y-2.5">
            {e?.codDepositHistory && e.codDepositHistory.length > 0 ? (
              e.codDepositHistory.map((deposit, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1e1e1e]">
                      <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600" />
                      <span>{deposit.note || 'Cash Deposit at SachBite Office'}</span>
                    </div>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">
                      {new Date(deposit.depositedAt).toLocaleDateString([], {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-blue-600 font-mono">
                      -₹{deposit.amount}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">Deposited</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-center py-6 text-[#6b7280]">No COD deposit history recorded.</p>
            )}
          </div>
        )}
      </div>

      {/* Instant COD Settlement Modal */}
      <CodDepositModal
        isOpen={showCodDepositModal}
        onClose={() => setShowCodDepositModal(false)}
        codBalance={codBalance}
        onConfirmDeposit={depositCodCash}
      />

      {/* 1-Click Instant Payout Modal */}
      <InstantWithdrawModal
        isOpen={showInstantWithdrawModal}
        onClose={() => setShowInstantWithdrawModal(false)}
        availableBalance={totalEarnings}
        upiId={profile?.upiId || 'partner@okaxis'}
        bankAccount={`${profile?.bankAccountName || 'Sachin Kumar'} - ${profile?.bankAccountNumber || '918237482910'}`}
        onWithdraw={withdrawEarnings}
      />

      {/* Rider Kit Store Modal */}
      <RiderKitStoreModal
        isOpen={showKitStoreModal}
        onClose={() => setShowKitStoreModal(false)}
        walletBalance={totalEarnings}
        onPurchase={purchaseKitItem}
        kitOrders={kitOrders}
      />
    </div>
  );
};
