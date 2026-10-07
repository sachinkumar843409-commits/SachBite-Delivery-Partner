import React, { useState } from 'react';
import { DeliveryOrder, DeliveryStage } from '../types/delivery';
import { useDelivery } from '../context/DeliveryContext';
import {
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Banknote,
  Store,
  User,
  X,
  ChevronRight,
  ShieldCheck,
  Check,
  Map,
  MessageSquare,
  ClipboardList,
  Camera,
  ChefHat,
  CloudRain,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LiveRouteMap } from './LiveRouteMap';
import { ItemChecklistModal } from './ItemChecklistModal';
import { CustomerChatModal } from './CustomerChatModal';
import { PhotoProofModal } from './PhotoProofModal';
import { RestaurantWaitModal } from './RestaurantWaitModal';

interface OrderCardProps {
  order: DeliveryOrder;
  compact?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, compact = false }) => {
  const {
    acceptOrder,
    declineOrder,
    updateStage,
    showToast,
    isRainSurgeActive,
    submitDropoffProof,
    reportRestaurantDelay,
  } = useDelivery();

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showPhotoProofModal, setShowPhotoProofModal] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);
  const [showMapRadar, setShowMapRadar] = useState(true);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [cashConfirmed, setCashConfirmed] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const isCOD = order.customer.payment?.toLowerCase().includes('cash');

  // Format phone number for WhatsApp wa.me link
  const getCleanPhone = (phone?: string) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  // Open native maps
  const openMaps = (loc?: { lat: number; lng: number }, queryFallback?: string) => {
    if (loc && loc.lat && loc.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`, '_blank');
    } else if (queryFallback) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryFallback)}`, '_blank');
    }
  };

  // Handle Accept
  const handleAccept = async () => {
    try {
      setLoadingAction('accept');
      await acceptOrder(order.id);
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Reject Submit
  const handleDeclineSubmit = async () => {
    try {
      setLoadingAction('decline');
      await declineOrder(order.id, rejectReason);
      setShowRejectModal(false);
    } finally {
      setLoadingAction(null);
    }
  };

  // Stage sequence map
  const stages: { key: DeliveryStage; title: string; nextStage?: DeliveryStage; nextBtnLabel?: string }[] = [
    {
      key: 'accepted',
      title: 'Order Confirmed',
      nextStage: 'arrived_at_restaurant',
      nextBtnLabel: 'I Have Arrived at Restaurant',
    },
    {
      key: 'arrived_at_restaurant',
      title: 'At Restaurant',
      nextStage: 'picked_up',
      nextBtnLabel: 'Pick Up Order & Confirm Food',
    },
    {
      key: 'picked_up',
      title: 'Food Picked Up',
      nextStage: 'arrived_at_customer',
      nextBtnLabel: 'I Have Reached Customer Location',
    },
    {
      key: 'arrived_at_customer',
      title: 'At Customer Doorstep',
      nextStage: 'delivered',
      nextBtnLabel: 'Deliver Order (Enter Customer OTP)',
    },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.deliveryStage);
  const currentStageObj = stages[currentStageIndex] || stages[0];

  // Advance to next stage
  const handleAdvanceStage = async () => {
    if (!currentStageObj.nextStage) return;

    if (currentStageObj.nextStage === 'delivered') {
      setShowOtpModal(true);
      return;
    }

    // When at restaurant and about to pick up, show item checklist
    if (currentStageObj.nextStage === 'picked_up') {
      setShowChecklistModal(true);
      return;
    }

    try {
      setLoadingAction('stage');
      await updateStage(order.id, currentStageObj.nextStage);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleConfirmItemChecklistPickup = async () => {
    try {
      setLoadingAction('stage');
      await updateStage(order.id, 'picked_up');
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle OTP Submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length !== 4) {
      setOtpError('Kripya pura 4-digit OTP daalein jo customer ke app par dikh raha hai.');
      return;
    }

    if (isCOD && !cashConfirmed && !order.cashCollected) {
      setOtpError('Kripya pehle cash collect karne ki pushti karein.');
      return;
    }

    try {
      setLoadingAction('otp_verify');
      setOtpError(null);
      await updateStage(order.id, 'delivered', enteredOtp, isCOD ? true : undefined);
      setShowOtpModal(false);
    } catch (err: any) {
      setOtpError(err?.message || 'Galat OTP! Kripya customer se dobara confirm karein.');
    } finally {
      setLoadingAction(null);
    }
  };

  // Helper for 4-digit input change
  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  // --------------------------------------------------------------------------
  // 1. PENDING ORDER VIEW (Visual Alert Card with Pulsing Border)
  // --------------------------------------------------------------------------
  if (order.assignmentStatus === 'pending') {
    return (
      <div className="relative rounded-3xl bg-white border-2 border-[#ff7a1a] shadow-[0_8px_24px_rgba(255,122,26,0.14)] overflow-hidden select-none">
        {/* Pulsing Alert Top Bar */}
        <div className="bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] px-4 py-2.5 text-white flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <span className="tracking-wide uppercase">New Order Assignment</span>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-mono">
            {order.id}
          </span>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Restaurant & Customer Locations */}
          <div className="space-y-3">
            {/* Pickup */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fff1e6] text-[#ff7a1a] flex items-center justify-center shrink-0 mt-0.5">
                <Store className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#1e1e1e] truncate">
                    {order.restaurantName || 'Restaurant Pickup'}
                  </h4>
                  {order.distanceKm && (
                    <span className="text-[11px] text-[#6b7280] font-medium shrink-0 ml-2">
                      ~{order.distanceKm} km
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#6b7280] line-clamp-1 mt-0.5">
                  {order.restaurantAddress || 'Kanti Bazar Hub, Kanti, Muzaffarpur'}
                </p>
              </div>
            </div>

            {/* Drop */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fff1e6] text-[#ff7a1a] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#1e1e1e] truncate">
                  {order.customer.name}
                </h4>
                <p className="text-xs text-[#6b7280] line-clamp-2 mt-0.5">
                  {order.customer.address}
                </p>
              </div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider mb-1.5">
              Order Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
            </div>
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs text-[#1e1e1e]">
                  <span className="truncate pr-2">
                    <span className="font-bold text-[#ff7a1a] mr-1.5">{item.quantity}x</span>
                    {item.name}
                  </span>
                  {item.price && (
                    <span className="text-slate-500 font-mono text-[11px]">₹{item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* COD Notice Banner */}
          {isCOD ? (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <Banknote className="w-4 h-4 text-amber-600 shrink-0" />
                <span>💵 Collect ₹{order.grandTotal} Cash</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                COD
              </span>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Paid Online · Do NOT collect cash</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Prepaid
              </span>
            </div>
          )}

          {/* Partner Estimated Earning */}
          {order.estimatedEarning && (
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-[#6b7280]">Your Earning on Delivery:</span>
              <span className="font-bold text-[#ff7a1a] font-mono text-sm">
                +₹{order.estimatedEarning}
              </span>
            </div>
          )}

          {/* Action Buttons: Accept & Reject */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={!!loadingAction}
              className="py-3 px-4 rounded-full border border-slate-300 hover:bg-slate-50 active:scale-[0.98] text-[#6b7280] font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Reject</span>
            </button>

            <button
              onClick={handleAccept}
              disabled={!!loadingAction}
              className="py-3 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-[#ff7a1a]/25 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loadingAction === 'accept' ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Accept Order</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reject Reason Modal */}
        <AnimatePresence>
          {showRejectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#1e1e1e]">Order Reject Karein?</h4>
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-[#6b7280]">
                  Yeh order admin ke assignment pool mein wapas chala jayega. Reason chunein ya likhein:
                </p>

                <div className="space-y-1.5 text-xs">
                  {['Distance too far', 'Bike puncture / Vehicle issue', 'Excess traffic / rain', 'Personal emergency'].map(
                    (reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setRejectReason(reason)}
                        className={`w-full text-left p-2 rounded-xl border transition ${
                          rejectReason === reason
                            ? 'border-[#ff7a1a] bg-[#fff1e6] text-[#b25511] font-semibold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {reason}
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeclineSubmit}
                    disabled={loadingAction === 'decline'}
                    className="flex-1 py-2.5 rounded-full bg-[#dc2626] hover:bg-red-700 text-xs font-semibold text-white shadow-sm"
                  >
                    {loadingAction === 'decline' ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. ACCEPTED / ACTIVE ORDER VIEW (4-Step Stage Tracker)
  // --------------------------------------------------------------------------
  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] overflow-hidden select-none">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a] animate-pulse" />
          <span className="text-xs font-bold text-[#1e1e1e]">Order #{order.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isCOD ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {isCOD ? `COD ₹${order.grandTotal}` : 'Prepaid'}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* 4-Stage Visual Progress Bar */}
        <div className="pt-1 pb-2">
          <div className="flex items-center justify-between relative">
            {/* Connecting Track */}
            <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
            <div
              className="absolute top-4 left-6 h-0.5 bg-[#ff7a1a] -z-0 transition-all duration-300"
              style={{
                width: `${Math.min(100, (currentStageIndex / (stages.length - 1)) * 85)}%`,
              }}
            />

            {stages.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage.key} className="flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-[#ff7a1a] text-white shadow-sm'
                        : isCurrent
                        ? 'bg-[#ff7a1a] text-white ring-4 ring-[#fff1e6] shadow-sm'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 text-center max-w-[64px] font-medium leading-tight ${
                      isCurrent
                        ? 'font-bold text-[#ff7a1a]'
                        : isCompleted
                        ? 'text-[#1e1e1e]'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live GPS Radar & Route Map */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <span>Live Radar & Route</span>
            </span>
            <button
              type="button"
              onClick={() => setShowMapRadar(!showMapRadar)}
              className="text-[11px] font-semibold text-[#ff7a1a] hover:underline cursor-pointer"
            >
              {showMapRadar ? 'Hide Radar' : 'Show Radar'}
            </button>
          </div>

          {showMapRadar && (
            <LiveRouteMap
              currentStage={order.deliveryStage}
              distanceKm={order.distanceKm || 2.8}
              restaurantName={order.restaurantName}
              restaurantAddress={order.restaurantAddress}
              customerName={order.customer.name}
              customerAddress={order.customer.address}
            />
          )}
        </div>

        {/* Current Active Step Highlight Box */}
        <div className="p-3.5 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#ff7a1a] text-white flex items-center justify-center shrink-0 shadow-xs">
            {currentStageIndex < 2 ? <Store className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#b25511]">
              Current Action: Step {currentStageIndex + 1} of 4
            </span>
            <p className="text-xs font-bold text-[#1e1e1e] truncate mt-0.5">
              {currentStageObj.nextBtnLabel}
            </p>
          </div>
        </div>

        {/* Location & Contact Info Based on Current Stage */}
        {currentStageIndex < 2 ? (
          /* Restaurant Details (Stage 1 & 2) */
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#ff7a1a] uppercase tracking-wider">
                  Pickup Restaurant
                </span>
                <h4 className="text-sm font-bold text-[#1e1e1e] mt-0.5">
                  {order.restaurantName || 'Bawarchi Biryani & Kebabs'}
                </h4>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  {order.restaurantAddress || 'Kanti Station Road / Indirapuram Hub, Kanti'}
                </p>
              </div>
            </div>

            {/* Stage 1 & 2 Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => openMaps(order.restaurantLocation, order.restaurantAddress)}
                className="py-2.5 px-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#1e1e1e] flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>Navigate</span>
              </button>

              <a
                href={`tel:${order.restaurantPhone || '+919835011223'}`}
                className="py-2.5 px-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#1e1e1e] flex items-center justify-center gap-1 transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>Call Hub</span>
              </a>

              <button
                type="button"
                onClick={() => setShowWaitModal(true)}
                className="py-2.5 px-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-[11px] font-bold text-amber-900 flex items-center justify-center gap-1 transition shadow-2xs cursor-pointer"
                title="Report restaurant preparation delay"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-700" />
                <span>Delay</span>
              </button>
            </div>
          </div>
        ) : (
          /* Customer Details (Stage 3 & 4) */
          <div className="space-y-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#ff7a1a] uppercase tracking-wider">
                  Customer Delivery Drop
                </span>
                <h4 className="text-sm font-bold text-[#1e1e1e] mt-0.5">
                  {order.customer.name}
                </h4>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  {order.customer.address}
                </p>
              </div>

              <button
                onClick={() => setShowPhotoProofModal(true)}
                className="px-2.5 py-1 rounded-full bg-[#fff1e6] border border-[#ff7a1a]/40 text-[#b25511] font-bold text-[10px] flex items-center gap-1 shadow-2xs hover:bg-[#ffe3cf] transition"
                title="Upload doorstep contactless delivery photo"
              >
                <Camera className="w-3 h-3 text-[#ff7a1a]" />
                <span>Photo Proof</span>
              </button>
            </div>

            {/* Stage 3 & 4 Quick Action Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => openMaps(order.location, order.customer.address)}
                className="py-2.5 px-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#1e1e1e] flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>Map</span>
              </button>

              <a
                href={`tel:${order.customer.phone}`}
                className="py-2.5 px-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#1e1e1e] flex items-center justify-center gap-1 transition shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>Call</span>
              </a>

              <button
                type="button"
                onClick={() => setShowChatModal(true)}
                className="py-2.5 px-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#1e1e1e] flex items-center justify-center gap-1 transition shadow-sm cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>Chat</span>
              </button>

              <a
                href={`https://wa.me/${getCleanPhone(order.customer.phone)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[11px] font-semibold text-[#ff7a1a] flex items-center justify-center gap-1 transition shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>WA</span>
              </a>
            </div>
          </div>
        )}

        {/* Order Items Summary */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-xs text-[#6b7280] mb-1.5">
            <span>Items to deliver ({order.items.length}):</span>
            <span className="font-semibold text-[#1e1e1e]">
              Total: ₹{order.grandTotal} ({order.customer.payment})
            </span>
          </div>
          <div className="text-xs text-[#1e1e1e] font-medium space-y-0.5">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{i.quantity}x {i.name}</span>
                {i.price && <span className="text-slate-500 font-mono">₹{i.price}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Primary Stage Advance CTA Button */}
        {currentStageObj.nextStage && (
          <button
            onClick={handleAdvanceStage}
            disabled={loadingAction === 'stage'}
            className="w-full py-4 px-6 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#ff7a1a]/25 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {loadingAction === 'stage' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{currentStageObj.nextBtnLabel}</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* 4-Digit OTP & COD Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1e1e1e]">Delivery OTP Verification</h4>
                    <p className="text-[11px] text-[#6b7280]">Customer se 4-digit code lein</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOtpModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {otpError && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#dc2626] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                {/* 4-Digit OTP Input Box */}
                <div>
                  <label className="block text-xs font-semibold text-center text-[#1e1e1e] mb-2">
                    Customer's 4-Digit Delivery Code
                  </label>
                  <div className="flex justify-center gap-2.5">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otpDigits[index]}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold font-mono rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#ff7a1a] focus:bg-white focus:outline-none transition shadow-sm"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-center text-[#6b7280] mt-2">
                    💡 Hint: Test with OTP <span className="font-mono font-bold text-[#ff7a1a]">1234</span>
                  </p>
                </div>

                {/* COD Cash Confirmation Prompt */}
                {isCOD && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                    <div className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span>Kya aapne cash collect kar liya?</span>
                    </div>
                    <p className="text-[11px] text-amber-800 mb-3">
                      Amount: <span className="font-bold text-sm">₹{order.grandTotal}</span>
                    </p>
                    <label className="flex items-center gap-2 text-xs font-bold text-amber-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={cashConfirmed}
                        onChange={(e) => setCashConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded text-[#ff7a1a] focus:ring-[#ff7a1a]"
                      />
                      <span>Haan, maine ₹{order.grandTotal} cash le liya hai</span>
                    </label>
                  </div>
                )}

                {/* Submit Delivery */}
                <button
                  type="submit"
                  disabled={loadingAction === 'otp_verify'}
                  className="w-full py-3.5 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-[#ff7a1a]/25 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {loadingAction === 'otp_verify' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify OTP & Mark Delivered</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Item Checklist & Verification Modal */}
      <ItemChecklistModal
        isOpen={showChecklistModal}
        orderId={order.id}
        restaurantName={order.restaurantName || 'Restaurant'}
        items={order.items}
        onClose={() => setShowChecklistModal(false)}
        onConfirmPickup={handleConfirmItemChecklistPickup}
        onReportDelay={(mins) => {
          showToast(`Delay reported: Customer notified of ${mins}m kitchen prep time.`);
        }}
      />

      {/* Canned Customer Quick Chat Modal */}
      <CustomerChatModal
        isOpen={showChatModal}
        customerName={order.customer.name}
        customerPhone={order.customer.phone}
        grandTotal={order.grandTotal}
        isCOD={isCOD}
        onClose={() => setShowChatModal(false)}
      />

      {/* Doorstep Contactless Photo Proof Modal */}
      <PhotoProofModal
        isOpen={showPhotoProofModal}
        onClose={() => setShowPhotoProofModal(false)}
        orderId={order.id}
        customerName={order.customer.name}
        customerAddress={order.customer.address}
        onConfirmProof={(photoUrl, note) => {
          submitDropoffProof(order.id, photoUrl, note);
        }}
      />

      {/* Restaurant Wait Delay Assistant Modal */}
      <RestaurantWaitModal
        isOpen={showWaitModal}
        onClose={() => setShowWaitModal(false)}
        orderId={order.id}
        restaurantName={order.restaurantName || 'Restaurant'}
        onReportDelay={(mins, reason) => {
          reportRestaurantDelay(order.id, mins, reason);
        }}
      />
    </div>
  );
};
