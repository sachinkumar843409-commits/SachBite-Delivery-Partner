import React, { useState } from 'react';
import {
  X,
  Zap,
  ArrowDownCircle,
  CheckCircle2,
  Building,
  Smartphone,
  ShieldCheck,
  Download,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'motion/react';

interface InstantWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  upiId: string;
  bankAccount: string;
  onWithdraw: (amount: number, destination: string) => Promise<void>;
}

export const InstantWithdrawModal: React.FC<InstantWithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  upiId = 'partner@okaxis',
  bankAccount = 'HDFC Bank - 918237482910',
  onWithdraw,
}) => {
  const [withdrawAmount, setWithdrawAmount] = useState<number>(availableBalance > 0 ? availableBalance : 500);
  const [payoutDestination, setPayoutDestination] = useState<'upi' | 'bank'>('upi');
  const [customUpi, setCustomUpi] = useState(upiId);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState<{
    txnId: string;
    amount: number;
    time: string;
    dest: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) {
      alert('Kripya valid amount daalein.');
      return;
    }
    if (withdrawAmount > availableBalance) {
      alert(`Aapke paas sirf ₹${availableBalance} available balance hai.`);
      return;
    }

    try {
      setIsProcessing(true);
      const destination = payoutDestination === 'upi' ? customUpi : bankAccount;
      await onWithdraw(withdrawAmount, destination);
      setPayoutSuccess({
        txnId: `SB-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: withdrawAmount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dest: destination,
      });
    } catch {
      alert('Withdrawal request failed. Kripya thodi der baad try karein.');
    } finally {
      setIsProcessing(false);
    }
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
        <div className="p-4 bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">1-Click Instant Payout</h3>
              <p className="text-[11px] text-orange-100">Direct transfer to UPI / Bank Account</p>
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
          {payoutSuccess ? (
            /* SUCCESS RECEIPT */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-2 space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">₹{payoutSuccess.amount} Transferred!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Instant IMPS/UPI Payout Successful
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-bold text-slate-800">{payoutSuccess.txnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sent to:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[170px]">{payoutSuccess.dest}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Processing Fee:</span>
                  <span className="font-bold text-green-600">₹0 (FREE)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="font-bold text-slate-800">{payoutSuccess.time}</span>
                </div>
              </div>

              <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700 text-[11px] flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Bank server ne credit confirm kar diya hai.</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-md transition"
              >
                Done
              </button>
            </motion.div>
          ) : (
            /* WITHDRAWAL FORM */
            <form onSubmit={handleWithdraw} className="space-y-4">
              {/* Available Balance Pill */}
              <div className="p-3.5 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#b25511] font-semibold block">Available Wallet Balance:</span>
                  <span className="text-xl font-black text-[#ff7a1a]">₹{availableBalance}</span>
                </div>
                <span className="px-2 py-1 bg-white text-[#b25511] font-bold text-[10px] rounded-lg border border-[#ff7a1a]/20 shadow-2xs">
                  Instant 24x7
                </span>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Withdrawal Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-base">₹</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    max={availableBalance}
                    min={10}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
                  />
                </div>
                <div className="flex gap-2 mt-1.5">
                  {[200, 500, 1000, availableBalance].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWithdrawAmount(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-[10px] text-slate-700 transition"
                    >
                      {preset === availableBalance ? 'All' : `₹${preset}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Radio Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Transfer To:
                </label>
                <div className="space-y-2">
                  <div
                    onClick={() => setPayoutDestination('upi')}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      payoutDestination === 'upi' ? 'bg-[#fff1e6] border-[#ff7a1a]' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#ff7a1a]" />
                      <div>
                        <span className="font-bold text-slate-800 block">UPI ID (GPay / PhonePe / Paytm)</span>
                        <input
                          type="text"
                          value={customUpi}
                          onChange={(e) => setCustomUpi(e.target.value)}
                          className="text-[11px] text-slate-600 bg-transparent border-b border-dashed border-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {payoutDestination === 'upi' && <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a]" />}
                    </span>
                  </div>

                  <div
                    onClick={() => setPayoutDestination('bank')}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      payoutDestination === 'bank' ? 'bg-[#fff1e6] border-[#ff7a1a]' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#ff7a1a]" />
                      <div>
                        <span className="font-bold text-slate-800 block">Bank Account (IMPS)</span>
                        <span className="text-[11px] text-slate-500">{bankAccount}</span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {payoutDestination === 'bank' && <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a]" />}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant IMPS badge */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                <span>Zero deduction fee. Amount credits to bank within 60 seconds.</span>
              </div>

              <button
                type="submit"
                disabled={isProcessing || withdrawAmount <= 0}
                className="w-full py-3.5 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Transfer...' : `Transfer ₹${withdrawAmount} Now`}</span>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
