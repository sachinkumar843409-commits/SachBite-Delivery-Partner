import React, { useState } from 'react';
import { useDelivery } from '../context/DeliveryContext';
import { Lock, User, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SachBiteLogo } from './SachBiteLogo';

export const LoginScreen: React.FC = () => {
  const { login, isDemoMode, toggleDemoMode } = useDelivery();
  const [username, setUsername] = useState('partner1');
  const [password, setPassword] = useState('sachbite123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Kripya apna username aur password daalein.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(username.trim(), password.trim());
    } catch (err: any) {
      setError(err?.message || 'Login failed. Kripya apne credentials check karein.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    toggleDemoMode(true);
    try {
      setLoading(true);
      setError(null);
      await login('partner_demo', 'pass123');
    } catch (err: any) {
      setError(err?.message || 'Demo login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#fafafa] px-4 py-8 select-none">
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        {/* Brand Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100"
        >
          {/* Logo Header */}
          <div className="text-center mb-5">
            <SachBiteLogo size={90} showText={true} showTagline={true} />

            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-black text-[#e63900]">
              <span>📍 Kanti Zone • Partner Portal</span>
            </div>
            <p className="text-xs text-[#6b7280] mt-1.5">
              Sign in with credentials provided by SachBite Admin
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#dc2626] flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1e1e1e] mb-1.5">
                Username / Partner ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. SB_KANTI_102"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-[#fafafa] border border-slate-200 rounded-xl text-sm text-[#1e1e1e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] focus:bg-white transition"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1e1e1e] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7280]" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 bg-[#fafafa] border border-slate-200 rounded-xl text-sm text-[#1e1e1e] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a] focus:bg-white transition"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Pill-Shaped Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-[#ff7a1a]/25 flex items-center justify-center gap-2 transition disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Helper Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-[#6b7280] leading-relaxed">
              Login credentials nahi hain?{' '}
              <a
                href="tel:+919835099880"
                className="text-[#ff7a1a] font-semibold hover:underline inline-flex items-center gap-1"
              >
                SachBite admin se contact karein
              </a>
            </p>
          </div>

          {/* Quick Demo Test Access */}
          <div className="mt-4 pt-3 border-t border-dashed border-slate-200">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-3 rounded-xl bg-[#fff1e6] hover:bg-[#ffe3cf] text-[#b25511] text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <span>1-Click Test Demo Login (Full Features)</span>
            </button>
          </div>
        </motion.div>

        {/* Security badge */}
        <div className="mt-6 flex items-center gap-1.5 text-xs text-[#6b7280]">
          <ShieldCheck className="w-4 h-4 text-[#ff7a1a]" />
          <span>Encrypted SachBite Kanti Partner Connection</span>
        </div>
      </div>

      <footer className="text-center text-[11px] text-[#6b7280] py-2">
        SachBite Delivery Partner v2.4 · All rights reserved
      </footer>
    </div>
  );
};

