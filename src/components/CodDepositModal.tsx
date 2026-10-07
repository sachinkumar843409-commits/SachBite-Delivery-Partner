import React, { useState } from 'react';
import { Banknote, QrCode, CheckCircle2, Copy, ArrowRight, X, Building } from 'lucide-react';
import { motion } from 'motion/react';

interface CodDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  codBalance: number;
  onConfirmDeposit: (amount: number, note: string) => Promise<void>;
}

export const CodDepositModal: React.FC<CodDepositModalProps> = ({
  isOpen,
  onClose,
  codBalance,
  onConfirmDeposit,
}) => {
  const [depositAmount, setDepositAmount] = useState(codBalance > 0 ? codBalance.toString() : '480');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'hub'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const upiId = 'sachbite.admin@okaxis';

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;

    try {
      setIsSubmitting(true);
      await onConfirmDeposit(amt, paymentMethod === 'upi' ? 'Online UPI Settlement to SachBite' : 'Cash Deposited at Patna Hub');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">COD Cash Settlement</h3>
              <p className="text-[11px] text-[#6b7280]">Clear your collected cash balance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-800">Current Cash In Hand</span>
            <div className="text-2xl font-black text-amber-950 font-mono mt-0.5">₹{codBalance}</div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-200/80 font-bold text-amber-900">
            Owed to Admin
          </span>
        </div>

        {/* Method Picker */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              paymentMethod === 'upi'
                ? 'bg-[#ff7a1a] text-white border-[#ff7a1a] shadow-sm'
                : 'bg-slate-50 border-slate-200 text-[#1e1e1e]'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Instant UPI</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('hub')}
            className={`flex-1 py-2.5 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              paymentMethod === 'hub'
                ? 'bg-[#ff7a1a] text-white border-[#ff7a1a] shadow-sm'
                : 'bg-slate-50 border-slate-200 text-[#1e1e1e]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Hub Cash Drop</span>
          </button>
        </div>

        {paymentMethod === 'upi' ? (
          <div className="space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            {/* Simulated UPI QR Code */}
            <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
              <span className="text-[9px] font-bold text-slate-500 font-mono mt-0.5">SCAN & PAY</span>
            </div>

            <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs">
              <span className="font-mono font-bold text-slate-800">{upiId}</span>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="text-xs font-bold text-[#ff7a1a] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-[#6b7280]">
              Pay via PhonePe / GPay / Paytm and enter amount below to clear balance.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-[#1e1e1e]">
            <p className="font-bold">📍 SachBite Kanti Partner Hub:</p>
            <p className="text-[#6b7280]">Near Kanti Railway Station, Indirapuram Road, Kanti (Muzaffarpur, BR 06)</p>
            <p className="text-[11px] text-[#b25511] font-semibold">Timing: 9:00 AM – 10:00 PM Daily</p>
          </div>
        )}

        <form onSubmit={handleDepositSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#1e1e1e] mb-1">
              Deposit Settlement Amount (₹)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-mono text-base font-bold text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              placeholder="Enter amount"
              max={codBalance}
              min={1}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-md shadow-[#ff7a1a]/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isSubmitting ? (
              <span>Recording Settlement...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm ₹{depositAmount} Deposit</span>
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
