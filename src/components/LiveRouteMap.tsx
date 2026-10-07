import React, { useState, useEffect } from 'react';
import { Navigation, Compass, MapPin, Store, Maximize2, Minimize2, ExternalLink, Route, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LiveRouteMapProps {
  partnerCoords?: { lat: number; lng: number } | null;
  restaurantName?: string;
  restaurantAddress?: string;
  restaurantCoords?: { lat: number; lng: number };
  customerName?: string;
  customerAddress?: string;
  customerCoords?: { lat: number; lng: number };
  currentStage: 'accepted' | 'arrived_at_restaurant' | 'picked_up' | 'arrived_at_customer' | 'delivered';
  distanceKm?: number;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  restaurantName = 'Kanti Swad Family Restaurant',
  restaurantAddress = 'Kanti Station Road, Near Railway Crossing, Kanti',
  customerName = 'Amit Verma',
  customerAddress = 'Ward 4, Near Kanti High School, Kanti, Muzaffarpur',
  currentStage,
  distanceKm = 2.3,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0.25);
  const [simulatedSpeed, setSimulatedSpeed] = useState(26);

  const isGoingToCustomer = currentStage === 'picked_up' || currentStage === 'arrived_at_customer';
  const targetLabel = isGoingToCustomer ? `Customer: ${customerName}` : `Restaurant: ${restaurantName}`;
  const targetAddress = isGoingToCustomer ? customerAddress : restaurantAddress;
  const etaMinutes = Math.max(2, Math.round(distanceKm * 3.5));

  // Jitter simulated speed for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedSpeed(Math.floor(22 + Math.random() * 12));
      setSimulatedProgress((prev) => {
        if (prev >= 0.85) return 0.25;
        return prev + 0.05;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openGoogleMaps = () => {
    const dest = encodeURIComponent(targetAddress);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank');
  };

  // SVG route path coordinates
  // Start: (40, 160) -> Mid curve -> End: (280, 50)
  const riderX = 40 + (280 - 40) * simulatedProgress;
  const riderY = 160 - (160 - 50) * Math.sin(simulatedProgress * Math.PI * 0.85);

  const content = (
    <div className="relative w-full rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden shadow-lg select-none">
      {/* Top Map HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#ff7a1a] animate-ping" />
          <span className="text-[11px] font-bold text-white tracking-wide">
            LIVE GPS RADAR
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {simulatedSpeed} km/h
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/10 text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-md"
            title="Expand Map"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Canvas/SVG Visualizer */}
      <div className={`relative w-full ${isFullscreen ? 'h-[70vh]' : 'h-48 sm:h-56'} bg-[#121820] overflow-hidden`}>
        {/* Subtle Map Grid lines */}
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Road and Route Geometry */}
        <svg
          viewBox="0 0 320 200"
          className="absolute inset-0 w-full h-full object-cover"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Main Road Line */}
          <path
            d="M 30 180 Q 90 170 140 130 T 220 80 T 290 40"
            fill="none"
            stroke="#334155"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 30 180 Q 90 170 140 130 T 220 80 T 290 40"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Navigation Glow Trail */}
          <path
            d="M 30 180 Q 90 170 140 130 T 220 80 T 290 40"
            fill="none"
            stroke="#ff7a1a"
            strokeWidth="5"
            strokeDasharray="8 4"
            className="animate-pulse"
          />

          {/* Pickup Point (Restaurant) */}
          <g transform="translate(30, 180)">
            <circle cx="0" cy="0" r="14" fill="#ff7a1a" opacity="0.3" />
            <circle cx="0" cy="0" r="9" fill="#ff7a1a" />
            <text x="0" y="3" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">
              🏪
            </text>
          </g>

          {/* Drop Point (Customer) */}
          <g transform="translate(290, 40)">
            <circle cx="0" cy="0" r="14" fill="#ff7a1a" opacity="0.3" />
            <circle cx="0" cy="0" r="9" fill="#ff7a1a" />
            <text x="0" y="3" textAnchor="middle" fontSize="8" fill="#ffffff" fontWeight="bold">
              📍
            </text>
          </g>

          {/* Live Partner Rider Scooter with Radar Beam */}
          <g transform={`translate(${riderX}, ${riderY})`}>
            {/* Radar Pulse */}
            <circle cx="0" cy="0" r="18" fill="none" stroke="#ff7a1a" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" from="8" to="24" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="11" fill="#ff7a1a" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#ffffff">
              🛵
            </text>
          </g>
        </svg>

        {/* ETA & Distance Floating Bar */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-2xl border border-white/10 shadow-lg flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white">
              <Clock className="w-3 h-3 text-[#ff7a1a]" />
              <span>{etaMinutes}m</span>
            </div>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-white font-mono">
              <Route className="w-3 h-3 text-[#ff7a1a]" />
              <span>{distanceKm}km</span>
            </div>
          </div>

          {/* External Google Maps Button */}
          <button
            onClick={openGoogleMaps}
            className="bg-[#ff7a1a] hover:bg-[#e85d04] active:scale-95 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-1 transition cursor-pointer pointer-events-auto"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Maps</span>
          </button>
        </div>
      </div>

      {/* Target Destination Drawer */}
      <div className="px-4 py-2.5 bg-slate-950 flex items-center justify-between text-xs">
        <div className="min-w-0 flex-1 pr-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Target Destination:
          </span>
          <p className="font-bold text-white truncate">{targetLabel}</p>
          <p className="text-[11px] text-slate-400 truncate">{targetAddress}</p>
        </div>
        <div className="p-2 rounded-xl bg-slate-800 text-[#ff7a1a] shrink-0">
          <Compass className="w-4 h-4 animate-spin-slow" />
        </div>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col p-4 justify-center items-center">
        <div className="w-full max-w-lg">{content}</div>
      </div>
    );
  }

  return content;
};
