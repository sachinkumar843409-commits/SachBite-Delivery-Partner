import React, { useState } from 'react';
import { MessageSquare, Send, X, Phone, CheckCheck, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomerChatModalProps {
  customerName: string;
  customerPhone: string;
  grandTotal: number;
  isCOD: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerChatModal: React.FC<CustomerChatModalProps> = ({
  customerName,
  customerPhone,
  grandTotal,
  isCOD,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'partner' | 'customer'; time: string }>>([
    {
      text: `Namaste ${customerName}, main aapka SachBite Delivery Partner hu. Aapka fresh khana deliver karne aa raha hu!`,
      sender: 'partner',
      time: 'Just now',
    },
  ]);
  const [customText, setCustomText] = useState('');

  if (!isOpen) return null;

  const cannedQuickMessages = [
    'Gate / building ke bahar aa gaya hu bhaiya.',
    isCOD ? `Cash ₹${grandTotal} ready rakhein kripya.` : 'Online payment ho chuka hai, contactless drop.',
    'Kripya 4-digit Delivery OTP share karein.',
    'Khana restaurant se pick kar liya hai, 5-8 min me pahuch raha hu.',
    'Location samajh nahi aa rahi, kripya thoda guide karein.',
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        text: textToSend,
        sender: 'partner',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setCustomText('');

    // Simulate customer auto-reply after 1.8 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: 'Theek hai bhaiya, main bahar aa raha hu / OTP ready hai.',
          sender: 'customer',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1800);
  };

  const cleanPhone = customerPhone.replace(/\D/g, '');
  const defaultWhatsAppText = encodeURIComponent(
    `Namaste ${customerName}, main aapka SachBite delivery partner hu. Main aapka order (Total ₹${grandTotal}) deliver karne aaya hu.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[90dvh] h-[520px] overflow-hidden"
      >
        {/* Chat Header */}
        <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#ff7a1a] to-[#e85d04] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
              {customerName.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">{customerName}</h3>
              <span className="text-[10px] sm:text-[11px] text-orange-100 font-mono block truncate">{customerPhone}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct WhatsApp button */}
            <a
              href={`https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=${defaultWhatsAppText}`}
              target="_blank"
              rel="noreferrer"
              title="Open WhatsApp chat"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {/* Direct Call button */}
            <a
              href={`tel:${customerPhone}`}
              title="Call customer"
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#fafafa]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'partner' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'partner'
                    ? 'bg-[#ff7a1a] text-white rounded-br-xs shadow-sm'
                    : 'bg-white text-[#1e1e1e] border border-slate-200 rounded-bl-xs shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9.5px] text-[#6b7280] mt-0.5 px-1 flex items-center gap-1">
                <span>{msg.time}</span>
                {msg.sender === 'partner' && <CheckCheck className="w-3 h-3 text-[#ff7a1a]" />}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Canned Buttons */}
        <div className="p-2 bg-slate-50 border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
          {cannedQuickMessages.map((msg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(msg)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[#1e1e1e] text-[10.5px] font-medium whitespace-nowrap hover:bg-[#fff1e6] hover:border-[#ff7a1a]/40 transition active:scale-95 cursor-pointer shadow-2xs"
            >
              {msg.length > 28 ? `${msg.substring(0, 28)}...` : msg}
            </button>
          ))}
        </div>

        {/* Text Input & WhatsApp Redirect */}
        <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(customText)}
            placeholder="Type message to customer..."
            className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#1e1e1e] focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
          />
          <button
            type="button"
            onClick={() => handleSendMessage(customText)}
            className="p-2 rounded-xl bg-[#ff7a1a] text-white hover:bg-[#e85d04] active:scale-95 transition cursor-pointer shadow-2xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
