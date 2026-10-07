import React, { useState } from 'react';
import { Camera, X, CheckCircle2, Upload, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PhotoProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  customerName: string;
  customerAddress: string;
  onConfirmProof: (photoUrl: string, note?: string) => void;
}

export const PhotoProofModal: React.FC<PhotoProofModalProps> = ({
  isOpen,
  onClose,
  orderId,
  customerName,
  customerAddress,
  onConfirmProof,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [dropNote, setDropNote] = useState('Khana gate / doorstep par surakshit rakh diya gaya hai.');
  const [isCapturing, setIsCapturing] = useState(false);

  if (!isOpen) return null;

  const handleSimulateCamera = () => {
    setIsCapturing(true);
    setTimeout(() => {
      // High quality delivery parcel photo mockup
      setPhotoPreview('https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500&auto=format&fit=crop&q=80');
      setIsCapturing(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!photoPreview) {
      alert('Kripya delivery packet ki photo khinchein.');
      return;
    }
    onConfirmProof(photoPreview, dropNote);
    onClose();
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
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">Doorstep Delivery Proof</h3>
              <p className="text-[11px] text-orange-100">Contactless Delivery Photo Proof</p>
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
          {/* Order Details Header */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between font-bold">
              <span>Order #{orderId}</span>
              <span className="text-[#ff7a1a]">{customerName}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">{customerAddress}</p>
          </div>

          {/* Camera Viewport / Photo Preview */}
          {photoPreview ? (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#ff7a1a] shadow-md bg-black">
              <img
                src={photoPreview}
                alt="Delivery Proof"
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md p-2 rounded-xl text-[10px] text-white space-y-0.5 border border-white/10">
                <div className="flex items-center justify-between font-mono">
                  <span>📍 GPS Verified: Kanti Zone</span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="text-slate-300">Order #{orderId} Drop-off Proof</div>
              </div>
              <button
                onClick={() => setPhotoPreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 bg-slate-50">
              <div className="w-12 h-12 rounded-full bg-[#fff1e6] text-[#ff7a1a] flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Khana rakhne ki Photo khinchein</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Doorstep ya customer gate par rakhe packet ka clear photo lein.
                </p>
              </div>

              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={handleSimulateCamera}
                  disabled={isCapturing}
                  className="px-4 py-2 rounded-xl bg-[#ff7a1a] text-white font-bold text-xs shadow-xs hover:bg-[#e85d04] transition active:scale-95"
                >
                  {isCapturing ? 'Opening Camera...' : '📸 Open Camera'}
                </button>

                <label className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-xs hover:bg-slate-100 transition cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Gallery</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Quick Drop Note */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Delivery Note / Remarks:
            </label>
            <input
              type="text"
              value={dropNote}
              onChange={(e) => setDropNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#ff7a1a]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!photoPreview}
            className={`w-full py-3.5 rounded-full font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-2 ${
              photoPreview
                ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Complete Contactless Drop</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
