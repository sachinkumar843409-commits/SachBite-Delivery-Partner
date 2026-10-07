import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { apiService } from '../../services/api';
import { soundEffects } from '../../services/audio';
import { voiceAssistant } from '../../services/voice';
import { RiderKitStoreModal } from '../RiderKitStoreModal';
import { LeaderboardModal } from '../LeaderboardModal';
import { RiderGuidelinesModal } from '../RiderGuidelinesModal';
import {
  User,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  PhoneCall,
  Lock,
  LogOut,
  Camera,
  Star,
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  FileText,
  AlertOctagon,
  ChevronRight,
  ShieldAlert,
  Volume2,
  VolumeX,
  BellRing,
  Sparkles,
  ShoppingBag,
  Trophy,
  Moon,
  Sun,
  BatteryCharging,
  Mic,
  MicOff,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileTab: React.FC = () => {
  const {
    profile,
    updateProfile,
    uploadPhoto,
    logout,
    settings,
    showToast,
    isDemoMode,
    toggleDemoMode,
    isBatterySaver,
    toggleBatterySaver,
    isDarkMode,
    toggleDarkMode,
    isHandsFreeVoice,
    toggleHandsFreeVoice,
    kitOrders,
    purchaseKitItem,
    earnings,
    partnerName,
  } = useDelivery();

  const [showKitStoreModal, setShowKitStoreModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);

  // Basic Profile form state
  const [name, setName] = useState(profile?.name || 'Sachin Kumar');
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [vehicleType, setVehicleType] = useState(profile?.vehicleType || 'Scooter');
  const [isSavingBasic, setIsSavingBasic] = useState(false);

  // KYC form state
  const [aadharNumber, setAadharNumber] = useState(profile?.aadharNumber || 'XXXX-XXXX-8921');
  const [drivingLicense, setDrivingLicense] = useState(profile?.drivingLicense || 'DL-0420220019283');
  const [vehicleNumber, setVehicleNumber] = useState(profile?.vehicleNumber || 'BR 01 AB 1234');
  const [isSavingKyc, setIsSavingKyc] = useState(false);

  // Bank & UPI form state
  const [upiId, setUpiId] = useState(profile?.upiId || 'sachin@okaxis');
  const [bankAccountName, setBankAccountName] = useState(profile?.bankAccountName || 'Sachin Kumar');
  const [bankAccountNumber, setBankAccountNumber] = useState(profile?.bankAccountNumber || '918237482910');
  const [bankIfsc, setBankIfsc] = useState(profile?.bankIfsc || 'HDFC0001234');
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Emergency contact state
  const [emergencyName, setEmergencyName] = useState(profile?.emergencyContactName || 'Rahul Kumar (Brother)');
  const [emergencyPhone, setEmergencyPhone] = useState(profile?.emergencyContactPhone || '+91 98765 01234');
  const [isSavingEmergency, setIsSavingEmergency] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);

  // Sound & Vibration Booster State
  const [isLoudAlarm, setIsLoudAlarm] = useState(() => soundEffects.getLoudMode());
  const [isTestingSound, setIsTestingSound] = useState(false);

  const handleToggleLoudMode = () => {
    const next = !isLoudAlarm;
    setIsLoudAlarm(next);
    soundEffects.setLoudMode(next);
    showToast(next ? '🔊 High Volume & Strong Vibration Enabled' : '🔈 Standard Alert Volume Set');
  };

  const handleTestOrderAlert = () => {
    setIsTestingSound(true);
    soundEffects.playNewOrderAlert();
    voiceAssistant.announceNewOrder('SB-9988', 280, true);
    showToast('🔔 Loud Ringtone & Vibration Triggered!');
    setTimeout(() => setIsTestingSound(false), 2000);
  };

  // Photo upload handling
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadPhoto(e.target.files[0]);
    }
  };

  // Save basic info
  const handleSaveBasic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingBasic(true);
      await updateProfile({ name, phone, vehicleType: vehicleType as any });
    } finally {
      setIsSavingBasic(false);
    }
  };

  // Save KYC
  const handleSaveKyc = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingKyc(true);
      await updateProfile({ aadharNumber, drivingLicense, vehicleNumber });
      showToast('KYC details updated. Status set to Verification in Progress.');
    } finally {
      setIsSavingKyc(false);
    }
  };

  // Save Bank / UPI
  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingBank(true);
      await updateProfile({ upiId, bankAccountName, bankAccountNumber, bankIfsc });
    } finally {
      setIsSavingBank(false);
    }
  };

  // Save Emergency Contact
  const handleSaveEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingEmergency(true);
      await updateProfile({ emergencyContactName: emergencyName, emergencyContactPhone: emergencyPhone });
    } finally {
      setIsSavingEmergency(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPassError('Please fill in current and new password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match');
      return;
    }
    try {
      setIsChangingPass(true);
      setPassError(null);
      await apiService.changePassword(currentPassword, newPassword);
      showToast('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPassError(err?.message || 'Password update failed');
    } finally {
      setIsChangingPass(false);
    }
  };

  const adminPhone = settings?.contactPhone || '+91 98350 99880';
  const cleanAdminPhone = adminPhone.replace(/\D/g, '');

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* 1. Partner Header & Avatar */}
      <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-100 border-3 border-[#ff7a1a] shadow-md flex items-center justify-center">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-[#ff7a1a] text-white shadow-md cursor-pointer hover:bg-[#e85d04] transition active:scale-95">
            <Camera className="w-3.5 h-3.5" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        <h2 className="text-lg font-black text-[#1e1e1e]">{profile?.name || name}</h2>
        <p className="text-xs text-[#6b7280] font-mono mt-0.5">{profile?.phone || phone}</p>

        {/* Rating and Verification */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{(profile?.avgRating || 4.9).toFixed(1)}</span>
            <span className="text-[10px] text-amber-700">({profile?.ratingCount || 342})</span>
          </div>

          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${
              profile?.kycVerified
                ? 'bg-[#fff1e6] text-[#b25511] border-[#ff7a1a]/30'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {profile?.kycVerified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff7a1a]" />
                <span>KYC Verified</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>KYC Pending</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Basic Profile Edit Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-[#ff7a1a]" />
          <h3 className="text-sm font-bold text-[#1e1e1e]">Basic Partner Info</h3>
        </div>

        <form onSubmit={handleSaveBasic} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              >
                <option value="Scooter">Scooter</option>
                <option value="Bike">Motorcycle / Bike</option>
                <option value="Electric Vehicle">Electric Vehicle (EV)</option>
                <option value="Bicycle">Bicycle</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingBasic}
            className="w-full py-2.5 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white text-xs font-bold transition shadow-sm active:scale-98 cursor-pointer"
          >
            {isSavingBasic ? 'Saving...' : 'Update Basic Info'}
          </button>
        </form>
      </div>

      {/* 3. KYC / Documents Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#ff7a1a]" />
            <h3 className="text-sm font-bold text-[#1e1e1e]">KYC & Vehicle Documents</h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              profile?.kycVerified
                ? 'bg-[#fff1e6] text-[#b25511]'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {profile?.kycVerified ? '✅ KYC Verified' : '⏳ KYC Pending'}
          </span>
        </div>

        <p className="text-[11px] text-[#6b7280]">
          Note: Changing any document number will reset verification status to pending until re-verified by SachBite admin.
        </p>

        <form onSubmit={handleSaveKyc} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Aadhar Card Number
            </label>
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Driving License Number
            </label>
            <input
              type="text"
              value={drivingLicense}
              onChange={(e) => setDrivingLicense(e.target.value)}
              placeholder="DL-XXXXXXXXXXXX"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Vehicle Registration Number
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="BR 06 AB 1234"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <button
            type="submit"
            disabled={isSavingKyc}
            className="w-full py-2.5 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white text-xs font-bold transition shadow-sm active:scale-98 cursor-pointer"
          >
            {isSavingKyc ? 'Updating KYC...' : 'Save KYC Details'}
          </button>
        </form>
      </div>

      {/* 4. Bank / UPI Payout Details Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-bold text-[#1e1e1e]">Bank & UPI Payout Details</h3>
        </div>

        <form onSubmit={handleSaveBank} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              UPI ID (For Fast Weekly Payouts)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@okhdfcbank"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Bank Account Holder Name
            </label>
            <input
              type="text"
              value={bankAccountName}
              onChange={(e) => setBankAccountName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Account Number
              </label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Bank IFSC Code
              </label>
              <input
                type="text"
                value={bankIfsc}
                onChange={(e) => setBankIfsc(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono uppercase text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingBank}
            className="w-full py-2.5 px-4 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white text-xs font-bold transition shadow-sm active:scale-98 cursor-pointer"
          >
            {isSavingBank ? 'Saving...' : 'Save Payout Details'}
          </button>
        </form>
      </div>

      {/* 5. Sound, Loud Alert & High-Power Vibration Settings Card */}
      <div className="p-5 rounded-3xl bg-white border border-orange-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">Order Ringtone & Vibration</h3>
              <p className="text-[11px] text-[#6b7280]">Loud alarm for riding in Kanti traffic</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fff1e6] text-[#b25511] border border-[#ff7a1a]/30">
            High Priority
          </span>
        </div>

        {/* Loud Sound & Heavy Vibration Mode Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fafafa] border border-slate-200/80">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-[#1e1e1e] flex items-center gap-1.5">
              <span>🔊 Traffic Loud Alarm & Heavy Vibration</span>
            </div>
            <p className="text-[11px] text-[#6b7280]">
              Multi-tone piercing chime + continuous 7-pulse bike vibration
            </p>
          </div>
          <button
            onClick={handleToggleLoudMode}
            className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
              isLoudAlarm ? 'bg-[#ff7a1a]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-5 h-5 bg-white rounded-full absolute top-0.75 transition-transform shadow-xs ${
                isLoudAlarm ? 'right-0.75' : 'left-0.75'
              }`}
            />
          </button>
        </div>

        {/* Test Order Sound & Vibration Button */}
        <button
          onClick={handleTestOrderAlert}
          disabled={isTestingSound}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] hover:from-[#ff700f] hover:to-[#d94e00] text-white text-xs font-bold transition shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <BellRing className={`w-4 h-4 ${isTestingSound ? 'animate-bounce' : ''}`} />
          <span>{isTestingSound ? 'Playing Loud Sound & Vibration...' : '🔔 Test Loud Sound & Vibration Now'}</span>
        </button>
      </div>

      {/* 6. Rider App Guidelines & Training Manual Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-white/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold">App Usage Guidelines</h3>
              <p className="text-[11px] text-orange-100">Step-by-Step Rider Training & Rules</p>
            </div>
          </div>
          <button
            onClick={() => setShowGuidelinesModal(true)}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white text-[#b25511] hover:bg-orange-50 transition shadow-xs cursor-pointer"
          >
            Read Rules
          </button>
        </div>
        <p className="text-[11px] text-orange-100 leading-relaxed">
          Order acceptance, OTP verification, COD cash deposit, safety guidelines aur penalty se bachne ke tips padhein.
        </p>
      </div>

      {/* 7. Rider Uniform Kit Store Card */}
      <div className="p-5 rounded-3xl bg-white border border-orange-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">Rider Uniform & Kit Store</h3>
              <p className="text-[11px] text-[#6b7280]">Official T-Shirt, Insulated Bag & Raincoat</p>
            </div>
          </div>
          <button
            onClick={() => setShowKitStoreModal(true)}
            className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#ff7a1a] text-white hover:bg-[#e85d04] transition shadow-xs cursor-pointer"
          >
            Open Store
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div
            onClick={() => setShowKitStoreModal(true)}
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#ff7a1a] transition cursor-pointer"
          >
            <span className="text-2xl">👕</span>
            <span className="block font-bold text-slate-800 text-[11px] mt-1">T-Shirt</span>
            <span className="text-[10px] text-[#ff7a1a] font-black">₹299</span>
          </div>

          <div
            onClick={() => setShowKitStoreModal(true)}
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#ff7a1a] transition cursor-pointer"
          >
            <span className="text-2xl">🎒</span>
            <span className="block font-bold text-slate-800 text-[11px] mt-1">Thermal Bag</span>
            <span className="text-[10px] text-[#ff7a1a] font-black">₹699</span>
          </div>

          <div
            onClick={() => setShowKitStoreModal(true)}
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#ff7a1a] transition cursor-pointer"
          >
            <span className="text-2xl">🌧️</span>
            <span className="block font-bold text-slate-800 text-[11px] mt-1">Raincoat</span>
            <span className="text-[10px] text-[#ff7a1a] font-black">₹399</span>
          </div>
        </div>
      </div>

      {/* 7. Kanti Leaderboard Card */}
      <div className="p-5 rounded-3xl bg-white border border-amber-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">Kanti Rider Ranking</h3>
              <p className="text-[11px] text-[#6b7280]">Your Rank: #2 in Kanti Zone (₹350 Bonus)</p>
            </div>
          </div>
          <button
            onClick={() => setShowLeaderboardModal(true)}
            className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white transition shadow-xs cursor-pointer"
          >
            View Board
          </button>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🥈</span>
            <div>
              <span className="font-bold text-slate-900 block">Sachin Kumar (You)</span>
              <span className="text-[10px] text-slate-500">128 Orders · 98.4% On-time</span>
            </div>
          </div>
          <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            +₹350 Bonus
          </span>
        </div>
      </div>

      {/* 8. Battery Saver & Voice Assistant Controls */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#1e1e1e] border-b border-slate-100 pb-2">
          Riding Preferences & Power
        </h3>

        {/* Battery Saver Mode */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
          <div className="flex items-center gap-2">
            <BatteryCharging className="w-4 h-4 text-[#ff7a1a]" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Ultra Battery Saver</span>
              <span className="text-[10px] text-slate-500">Reduces background power usage while riding</span>
            </div>
          </div>
          <button
            onClick={toggleBatterySaver}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              isBatterySaver ? 'bg-[#ff7a1a]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.75 transition-transform shadow-xs ${
                isBatterySaver ? 'right-0.75' : 'left-0.75'
              }`}
            />
          </button>
        </div>

        {/* Hands-free Voice Commands */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#ff7a1a]" />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Hands-Free Voice Orders</span>
              <span className="text-[10px] text-slate-500">Voice prompt order acceptance</span>
            </div>
          </div>
          <button
            onClick={toggleHandsFreeVoice}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              isHandsFreeVoice ? 'bg-[#ff7a1a]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`w-4.5 h-4.5 bg-white rounded-full absolute top-0.75 transition-transform shadow-xs ${
                isHandsFreeVoice ? 'right-0.75' : 'left-0.75'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 9. Safety Center Card */}
      <div className="p-5 rounded-3xl bg-white border border-red-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldAlert className="w-5 h-5 text-[#dc2626]" />
          <div>
            <h3 className="text-sm font-bold text-[#1e1e1e]">Safety Center & SOS</h3>
            <p className="text-[11px] text-[#6b7280]">Emergency help always ready while you ride</p>
          </div>
        </div>

        {/* SOS One-Tap Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:112"
            className="py-3 px-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center gap-2 text-xs font-bold shadow-md shadow-red-600/25 transition cursor-pointer"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>🚨 Police (112)</span>
          </a>

          <a
            href={`tel:${emergencyPhone}`}
            className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-black active:scale-95 text-white flex items-center justify-center gap-2 text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-green-400" />
            <span>📞 SOS Contact</span>
          </a>
        </div>

        {/* Edit Emergency Contact */}
        <form onSubmit={handleSaveEmergency} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Emergency Person Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="Family / Friend Name"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1e1e1e]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Emergency Phone Number
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#1e1e1e]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSavingEmergency}
            className="w-full py-2 px-3 rounded-full border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#1e1e1e] cursor-pointer"
          >
            {isSavingEmergency ? 'Saving...' : 'Update Emergency Contact'}
          </button>
        </form>

        {/* Static Safety Tips */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px] text-[#6b7280]">
          <div className="font-bold text-[#1e1e1e]">🛡️ Rider Safety Tips:</div>
          <p>• Helmet pehenna anivarya hai aur traffic signals ka palan karein.</p>
          <p>• Koi asuvidha ya mushkil sthiti ho to turant admin ko inform karein.</p>
          <p>• Raat ke samay sunsaan raste avoid karein aur phone charged rakhein.</p>
        </div>
      </div>

      {/* 6. Partner Insurance & Medical Benefits Card */}
      <div className="p-5 rounded-3xl bg-white border border-orange-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#fff1e6] text-[#ff7a1a]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1e1e1e]">Partner Care & Insurance</h3>
              <p className="text-[11px] text-[#6b7280]">Sponsored by SachBite Partner Protection</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff7a1a] text-white">
            Active
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-[10px] text-[#6b7280]">Accidental Coverage</span>
            <p className="font-bold text-[#1e1e1e] font-mono mt-0.5">₹5,00,000</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50">
            <span className="text-[10px] text-[#6b7280]">OPD / Medical Aid</span>
            <p className="font-bold text-[#1e1e1e] font-mono mt-0.5">₹50,000 / yr</p>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
          <span>Policy: <strong className="font-mono text-slate-800">SB-CARE-99214</strong></span>
          <span className="text-[#ff7a1a] font-semibold">ICICI Lombard</span>
        </div>
      </div>

      {/* 7. Help & Support Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Phone className="w-4 h-4 text-[#ff7a1a]" />
          <h3 className="text-sm font-bold text-[#1e1e1e]">Help & Admin Support</h3>
        </div>

        <p className="text-xs text-[#6b7280]">
          Any question about Kanti orders, payout delay, or account issues? Contact SachBite admin:
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <a
            href={`tel:${adminPhone}`}
            className="py-3 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#1e1e1e] flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Phone className="w-4 h-4 text-[#ff7a1a]" />
            <span>Call Admin</span>
          </a>

          <a
            href={`https://wa.me/${cleanAdminPhone}`}
            target="_blank"
            rel="noreferrer"
            className="py-3 px-3 rounded-2xl bg-[#fff1e6] hover:bg-[#ffe3cf] text-xs font-bold text-[#b25511] flex items-center justify-center gap-1.5 transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-[#ff7a1a]" />
            <span>WhatsApp Admin</span>
          </a>
        </div>
      </div>

      {/* 7. Change Password Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Lock className="w-4 h-4 text-[#1e1e1e]" />
          <h3 className="text-sm font-bold text-[#1e1e1e]">Change Password</h3>
        </div>

        {passError && (
          <div className="p-2.5 rounded-xl bg-red-50 text-xs text-red-600 border border-red-200">
            {passError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6b7280] mb-1">
                Confirm New
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPass}
            className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm active:scale-98 cursor-pointer"
          >
            {isChangingPass ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Demo / Live Backend Mode Switch */}
      <div className="p-4 rounded-3xl bg-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#1e1e1e]">Demo Simulator Mode</span>
          <p className="text-[11px] text-[#6b7280]">
            Toggle simulation to test full order lifecycle & OTP
          </p>
        </div>
        <button
          onClick={() => toggleDemoMode(!isDemoMode)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
            isDemoMode ? 'bg-[#ff7a1a] text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-300'
          }`}
        >
          {isDemoMode ? 'Demo Active' : 'Live Mode'}
        </button>
      </div>

      {/* 8. Logout Button */}
      <button
        onClick={logout}
        className="w-full py-3.5 px-4 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-[#dc2626] font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of SachBite Partner</span>
      </button>

      {/* Kit Store Modal */}
      <RiderKitStoreModal
        isOpen={showKitStoreModal}
        onClose={() => setShowKitStoreModal(false)}
        walletBalance={earnings?.totalEarnings ?? 0}
        onPurchase={purchaseKitItem}
        kitOrders={kitOrders}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => setShowLeaderboardModal(false)}
        currentPartnerName={partnerName}
      />

      {/* Rider Guidelines Modal */}
      <RiderGuidelinesModal
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
      />
    </div>
  );
};
