import React, { useState } from 'react';
import { OrderItem } from '../types/delivery';
import { CheckSquare, Square, Camera, Clock, AlertCircle, Check, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItemChecklistModalProps {
  orderId: string;
  restaurantName: string;
  items: OrderItem[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmPickup: () => void;
  onReportDelay: (minutes: number) => void;
}

export const ItemChecklistModal: React.FC<ItemChecklistModalProps> = ({
  orderId,
  restaurantName,
  items,
  isOpen,
  onClose,
  onConfirmPickup,
  onReportDelay,
}) => {
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [hasReceiptPhoto, setHasReceiptPhoto] = useState(false);
  const [showDelayPicker, setShowDelayPicker] = useState(false);

  if (!isOpen) return null;

  const toggleItem = (idx: number) => {
    setCheckedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const allItemsChecked = items.every((_, idx) => !!checkedMap[idx]);

  const handleSimulatePhoto = () => {
    setHasReceiptPhoto(true);
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
            <div className="p-2 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">Item Pick-up Checklist</h3>
              <p className="text-[11px] text-[#6b7280]">Order #{orderId} · {restaurantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-[#6b7280] leading-snug">
          Please verify all items with restaurant staff before sliding to pick up to ensure zero missing dishes:
        </p>

        {/* Items Checkbox List */}
        <div className="space-y-2">
          {items.map((item, idx) => {
            const isChecked = !!checkedMap[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleItem(idx)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                  isChecked
                    ? 'bg-[#fff1e6] border-[#ff7a1a]/40 text-[#b25511]'
                    : 'bg-slate-50 border-slate-200 text-[#1e1e1e] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[#ff7a1a] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-bold">
                      {item.quantity}x {item.name}
                    </span>
                    {item.notes && (
                      <p className="text-[10px] text-[#6b7280]">{item.notes}</p>
                    )}
                  </div>
                </div>
                {item.price && (
                  <span className="text-[11px] font-mono font-medium text-slate-500">
                    ₹{item.price}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bill / Receipt Photo Verification (Optional) */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#ff7a1a]" />
            <span className="text-xs font-semibold text-[#1e1e1e]">
              Package Bill Photo:
            </span>
          </div>
          <button
            type="button"
            onClick={handleSimulatePhoto}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              hasReceiptPhoto
                ? 'bg-[#ff7a1a] text-white'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {hasReceiptPhoto ? '✓ Captured' : 'Attach Photo'}
          </button>
        </div>

        {/* Report Kitchen Delay */}
        <div>
          <button
            type="button"
            onClick={() => setShowDelayPicker(!showDelayPicker)}
            className="text-xs font-bold text-[#ff7a1a] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Food not ready yet? Report Kitchen Delay</span>
          </button>

          {showDelayPicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-2"
            >
              <p className="text-[11px] text-amber-900 font-medium">
                Notify customer & admin that the restaurant is still preparing:
              </p>
              <div className="flex gap-2">
                {[5, 10, 15].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      onReportDelay(mins);
                      setShowDelayPicker(false);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100"
                  >
                    +{mins} mins
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Action Button: Confirm Pick-up */}
        <button
          type="button"
          onClick={() => {
            onConfirmPickup();
            onClose();
          }}
          disabled={!allItemsChecked}
          className="w-full py-3.5 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-[#ff7a1a]/25 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>
            {allItemsChecked
              ? 'Items Verified · Confirm Food Pick-Up'
              : `Check all items (${Object.values(checkedMap).filter(Boolean).length}/${items.length})`}
          </span>
        </button>
      </motion.div>
    </div>
  );
};
