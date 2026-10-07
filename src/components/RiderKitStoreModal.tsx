import React, { useState } from 'react';
import { KitItem, KitOrder } from '../types/delivery';
import {
  ShoppingBag,
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Wallet,
  Clock,
  MapPin,
  Tag,
  ChevronRight,
  Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RiderKitStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onPurchase: (item: KitItem, paymentMethod: 'wallet' | 'upi', size?: string) => Promise<void>;
  kitOrders: KitOrder[];
}

export const KIT_ITEMS: KitItem[] = [
  {
    id: 'sb_tshirt_01',
    name: 'SachBite Official Partner T-Shirt',
    category: 'tshirt',
    price: 299,
    originalPrice: 499,
    imageEmoji: '👕',
    description: 'Dry-fit breathable fabric, sweat-resistant with SachBite reflective front & back logo.',
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    inStock: true,
    tag: 'Must Have',
  },
  {
    id: 'sb_bag_01',
    name: '40L Insulated Thermal Delivery Bag',
    category: 'bag',
    price: 699,
    originalPrice: 999,
    imageEmoji: '🎒',
    description: 'Triple-layer insulated lining (Hot & Cold), waterproof outer shell with bike rack straps.',
    inStock: true,
    tag: 'Bestseller',
  },
  {
    id: 'sb_raincoat_01',
    name: 'Heavy-Duty Monsoon Raincoat Set',
    category: 'raincoat',
    price: 399,
    originalPrice: 650,
    imageEmoji: '🌧️',
    description: 'Complete Jacket + Pants waterproof suit with hood & luminous night safety stripes.',
    sizes: ['L (Standard)', 'XL (Comfort)', 'XXL (Large)'],
    inStock: true,
    tag: 'Monsoon Ready',
  },
  {
    id: 'sb_vest_01',
    name: 'Night High-Visibility Safety Vest',
    category: 'safety',
    price: 199,
    originalPrice: 350,
    imageEmoji: '🦺',
    description: '360° Neon reflector vest for safe night riding in Kanti highways & dark streets.',
    sizes: ['Free Size'],
    inStock: true,
  },
  {
    id: 'sb_combo_01',
    name: '🔥 Full Partner Super Starter Combo',
    category: 'combo',
    price: 1199,
    originalPrice: 2100,
    imageEmoji: '📦',
    description: 'Complete Kit: T-Shirt + Insulated Bag + Raincoat Set + Safety Vest + ID Lanyard.',
    sizes: ['M Combo', 'L Combo', 'XL Combo', 'XXL Combo'],
    inStock: true,
    tag: 'Save 45%',
  },
];

export const RiderKitStoreModal: React.FC<RiderKitStoreModalProps> = ({
  isOpen,
  onClose,
  walletBalance,
  onPurchase,
  kitOrders,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'orders'>('store');
  const [selectedItem, setSelectedItem] = useState<KitItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState<KitOrder | null>(null);

  if (!isOpen) return null;

  const handleOpenItem = (item: KitItem) => {
    setSelectedItem(item);
    setSelectedSize(item.sizes ? item.sizes[0] : '');
    setSuccessOrder(null);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedItem) return;

    if (paymentMethod === 'wallet' && walletBalance < selectedItem.price) {
      alert(`Aapke wallet me ₹${walletBalance} hain. ₹${selectedItem.price} ke liye UPI payment select karein.`);
      return;
    }

    try {
      setIsProcessing(true);
      await onPurchase(selectedItem, paymentMethod, selectedSize);
      const fakeOrder: KitOrder = {
        orderId: `KIT-${Math.floor(10000 + Math.random() * 90000)}`,
        itemId: selectedItem.id,
        itemName: selectedItem.name,
        price: selectedItem.price,
        selectedSize: selectedSize || undefined,
        paymentMethod,
        status: 'confirmed',
        orderedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        pickupHub: 'SachBite Kanti Hub (Near Thermal Power Gate / Station Road)',
      };
      setSuccessOrder(fakeOrder);
    } catch {
      alert('Order failed. Kripya dobara try karein.');
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
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90dvh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">SachBite Partner Store</h3>
              <p className="text-[11px] text-orange-100">Official T-Shirts, Delivery Bags & Raincoats</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => {
              setActiveTab('store');
              setSelectedItem(null);
            }}
            className={`py-2 rounded-xl transition ${
              activeTab === 'store' ? 'bg-white text-[#ff7a1a] shadow-xs' : 'text-[#6b7280]'
            }`}
          >
            🛍️ Kit Store
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              setSelectedItem(null);
            }}
            className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-white text-[#ff7a1a] shadow-xs' : 'text-[#6b7280]'
            }`}
          >
            <span>📦 My Kit Orders</span>
            {kitOrders.length > 0 && (
              <span className="px-1.5 py-0.2 bg-[#ff7a1a] text-white text-[10px] rounded-full">
                {kitOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* SUCCESS ORDER CONFIRMATION SCREEN */}
          {successOrder ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-[#1e1e1e]">Order Confirmed!</h4>
                <p className="text-xs text-[#6b7280] mt-1">
                  Aapka kit order successfully place ho gaya hai.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#fafafa] border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-800">{successOrder.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Item:</span>
                  <span className="font-bold text-slate-800">{successOrder.itemName}</span>
                </div>
                {successOrder.selectedSize && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Size:</span>
                    <span className="font-bold text-slate-800">{successOrder.selectedSize}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-[#ff7a1a]">₹{successOrder.price}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-start gap-1.5 text-[11px] text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-[#ff7a1a] shrink-0 mt-0.5" />
                  <span><strong>Pickup Hub:</strong> {successOrder.pickupHub}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccessOrder(null);
                  setSelectedItem(null);
                  setActiveTab('orders');
                }}
                className="w-full py-3 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-md transition"
              >
                View in My Orders
              </button>
            </motion.div>
          ) : selectedItem ? (
            /* ITEM DETAIL & CHECKOUT VIEW */
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="text-xs font-bold text-[#ff7a1a] flex items-center gap-1 hover:underline"
              >
                ← Back to Store
              </button>

              <div className="p-4 rounded-2xl bg-[#fff1e6] border border-[#ff7a1a]/30 flex items-center gap-3">
                <span className="text-4xl">{selectedItem.imageEmoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1e1e1e] truncate">{selectedItem.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-black text-[#ff7a1a]">₹{selectedItem.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{selectedItem.originalPrice}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 bg-green-100 text-green-700 rounded-full">
                      Save ₹{selectedItem.originalPrice - selectedItem.price}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {selectedItem.description}
              </p>

              {/* Size Selector */}
              {selectedItem.sizes && (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Select Size:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                          selectedSize === size
                            ? 'bg-[#fff1e6] border-[#ff7a1a] text-[#b25511]'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Payment Method:
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                      paymentMethod === 'wallet'
                        ? 'bg-[#fff1e6] border-[#ff7a1a]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-[#ff7a1a]" />
                      <div className="text-left">
                        <span className="font-bold text-slate-800 block">Deduct from Wallet Balance</span>
                        <span className="text-[11px] text-slate-500">Available: ₹{walletBalance}</span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {paymentMethod === 'wallet' && <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a]" />}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`w-full p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                      paymentMethod === 'upi'
                        ? 'bg-[#fff1e6] border-[#ff7a1a]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#ff7a1a]" />
                      <div className="text-left">
                        <span className="font-bold text-slate-800 block">Pay via Instant UPI (GPay / PhonePe / QR)</span>
                        <span className="text-[11px] text-slate-500">Direct Online Checkout</span>
                      </div>
                    </div>
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center">
                      {paymentMethod === 'upi' && <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a1a]" />}
                    </span>
                  </button>
                </div>
              </div>

              {/* Pickup Hub Notice */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
                <Truck className="w-4 h-4 text-[#ff7a1a] shrink-0" />
                <span>Pickup available same-day from <strong>SachBite Kanti Hub</strong> (Station Road).</span>
              </div>

              <button
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-full bg-[#ff7a1a] hover:bg-[#e85d04] text-white font-bold text-xs shadow-md transition active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isProcessing ? 'Processing Order...' : `Pay ₹${selectedItem.price} & Place Order`}</span>
              </button>
            </motion.div>
          ) : activeTab === 'store' ? (
            /* STORE PRODUCT CATALOG */
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl text-xs space-y-1">
                <span className="font-black flex items-center gap-1">
                  <span>🛡️ Official SachBite Partner Gear</span>
                </span>
                <p className="text-[11px] opacity-90">
                  Zomato/Swiggy ki tarah SachBite official kit pehen kar deliver karein aur customers ka vishwas jeetein.
                </p>
              </div>

              {KIT_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenItem(item)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#ff7a1a] hover:shadow-sm transition cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-3xl p-2 bg-[#fff1e6] rounded-xl shrink-0">
                      {item.imageEmoji}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-[#1e1e1e] truncate">{item.name}</h4>
                        {item.tag && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#fff1e6] text-[#b25511] rounded-full border border-[#ff7a1a]/30">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#6b7280] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-[#ff7a1a]">₹{item.price}</span>
                        <span className="text-[10px] text-slate-400 line-through">₹{item.originalPrice}</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-full bg-[#fff1e6] group-hover:bg-[#ff7a1a] text-[#b25511] group-hover:text-white text-xs font-bold transition shrink-0">
                    Buy
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* MY KIT ORDERS HISTORY */
            <div className="space-y-3">
              {kitOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <span className="text-4xl">📦</span>
                  <h4 className="text-sm font-bold text-slate-800">Abhi tak koi Kit Order nahi hai</h4>
                  <p className="text-xs text-slate-500">
                    Store tab se T-shirt ya delivery bag order karein.
                  </p>
                  <button
                    onClick={() => setActiveTab('store')}
                    className="mt-2 px-4 py-2 rounded-full bg-[#ff7a1a] text-white text-xs font-bold shadow-xs"
                  >
                    Open Kit Store
                  </button>
                </div>
              ) : (
                kitOrders.map((ord) => (
                  <div
                    key={ord.orderId}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-mono font-bold text-slate-800">{ord.orderId}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold text-[10px]">
                        ● Ready for Pickup at Hub
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{ord.itemName}</span>
                      <span className="font-mono font-bold text-[#ff7a1a]">₹{ord.price}</span>
                    </div>
                    {ord.selectedSize && (
                      <div className="text-[11px] text-slate-500">
                        Size: <strong>{ord.selectedSize}</strong>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Ordered: {ord.orderedAt}</span>
                      <span>Paid via: {ord.paymentMethod.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
