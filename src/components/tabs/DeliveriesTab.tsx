import React, { useState } from 'react';
import { useDelivery } from '../../context/DeliveryContext';
import { OrderCard } from '../OrderCard';
import { Package, RefreshCw, Filter, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const DeliveriesTab: React.FC = () => {
  const {
    pendingOrders,
    activeOrders,
    isLoadingOrders,
    refreshOrders,
    isOnline,
    simulateNewOrder,
    isDemoMode,
  } = useDelivery();

  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');

  const allActiveOrders = [...pendingOrders, ...activeOrders];

  const filteredOrders =
    filter === 'pending'
      ? pendingOrders
      : filter === 'active'
      ? activeOrders
      : allActiveOrders;

  return (
    <div className="space-y-4 pb-8 select-none">
      {/* Tab Header & Quick Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1e1e1e]">Active Deliveries</h2>
          <p className="text-xs text-[#6b7280]">
            {allActiveOrders.length} order{allActiveOrders.length === 1 ? '' : 's'} to fulfill
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && (
            <button
              onClick={simulateNewOrder}
              className="py-1.5 px-3 rounded-full bg-[#fff1e6] hover:bg-[#ffe3cf] text-[#b25511] text-xs font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-sm"
              title="Add a test delivery order"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff7a1a]" />
              <span>+ Test Order</span>
            </button>
          )}

          <button
            onClick={() => refreshOrders()}
            disabled={isLoadingOrders}
            className="p-2.5 rounded-full bg-white border border-slate-200 text-[#6b7280] hover:text-[#ff7a1a] hover:bg-[#fff1e6] transition shadow-sm active:scale-95 cursor-pointer"
            title="Refresh orders list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingOrders ? 'animate-spin text-[#ff7a1a]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs (Segmented control) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            filter === 'all'
              ? 'bg-white text-[#1e1e1e] shadow-sm'
              : 'text-[#6b7280] hover:text-[#1e1e1e]'
          }`}
        >
          <span>All</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-[#6b7280]">
            {allActiveOrders.length}
          </span>
        </button>

        <button
          onClick={() => setFilter('pending')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            filter === 'pending'
              ? 'bg-white text-[#ff7a1a] shadow-sm'
              : 'text-[#6b7280] hover:text-[#1e1e1e]'
          }`}
        >
          <span>Pending</span>
          {pendingOrders.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ff7a1a] text-white">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setFilter('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            filter === 'active'
              ? 'bg-white text-[#ff7a1a] shadow-sm'
              : 'text-[#6b7280] hover:text-[#1e1e1e]'
          }`}
        >
          <span>Accepted</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-[#6b7280]">
            {activeOrders.length}
          </span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-slate-100 text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#fff1e6] text-[#ff7a1a] mx-auto flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1e1e1e]">No Orders In This List</h4>
              <p className="text-xs text-[#6b7280] max-w-xs mx-auto mt-1">
                {isOnline
                  ? 'Naye order aate hi auto-update ho jayega. Live polling active hai (~12s interval).'
                  : 'Aap abhi OFFLINE hain. Delivery assignments pane ke liye switch ON karein.'}
              </p>
            </div>
            {isDemoMode && (
              <button
                onClick={simulateNewOrder}
                className="mt-2 py-2 px-4 rounded-full bg-[#ff7a1a] text-white text-xs font-bold shadow-sm hover:bg-[#e85d04] transition active:scale-95 cursor-pointer"
              >
                + Trigger Demo Order Alert
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
