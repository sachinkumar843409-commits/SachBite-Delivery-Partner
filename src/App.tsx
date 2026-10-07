/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DeliveryProvider, useDelivery } from './context/DeliveryContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { PermissionsModal } from './components/PermissionsModal';
import { NativePhoneFrame } from './components/NativePhoneFrame';
import { HomeTab } from './components/tabs/HomeTab';
import { DeliveriesTab } from './components/tabs/DeliveriesTab';
import { EarningsTab } from './components/tabs/EarningsTab';
import { AlertsTab } from './components/tabs/AlertsTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const DeliveryAppContent: React.FC = () => {
  const {
    isAuthenticated,
    isInitializing,
    pendingOrders,
    unreadCount,
    toastMessage,
  } = useDelivery();

  const [hasShownSplash, setHasShownSplash] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Show splash on launch
  if (!hasShownSplash || isInitializing) {
    return <SplashScreen onFinish={() => setHasShownSplash(true)} />;
  }

  // Not logged in -> Show Login Screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <NativePhoneFrame>
      {/* Top App Header with online toggle and live tracking banner */}
      <Header
        activeTab={activeTab}
        onOpenNotifications={() => setActiveTab('alerts')}
      />

      {/* Main Tab Content Viewport */}
      <main className="flex-1 px-3 sm:px-4 pt-3 pb-4 overflow-y-auto overscroll-y-contain">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <HomeTab onNavigateTab={(tab) => setActiveTab(tab)} />
            </motion.div>
          )}

          {activeTab === 'deliveries' && (
            <motion.div
              key="deliveries"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <DeliveriesTab />
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div
              key="earnings"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <EarningsTab />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <AlertsTab />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <ProfileTab />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Fixed 5-Tab Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        pendingDeliveriesCount={pendingOrders.length}
        unreadAlertsCount={unreadCount}
      />

      {/* Permissions Rationale Modal */}
      <PermissionsModal />

      {/* Floating System Notification Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-20 left-4 right-4 z-50 max-w-sm mx-auto"
          >
            <div className="p-3.5 rounded-2xl bg-[#1e1e1e] text-white text-xs font-semibold shadow-2xl flex items-center gap-2.5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-pulse shrink-0" />
              <span className="flex-1 leading-snug">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </NativePhoneFrame>
  );
};

export default function App() {
  return (
    <DeliveryProvider>
      <DeliveryAppContent />
    </DeliveryProvider>
  );
}
