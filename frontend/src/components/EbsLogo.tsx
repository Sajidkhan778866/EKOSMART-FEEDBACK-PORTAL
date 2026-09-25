import React from 'react';

interface EbsLogoProps {
  variant?: 'battery' | 'spare-parts' | 'header' | 'badge' | 'smart-drive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const EbsLogo: React.FC<EbsLogoProps> = ({
  variant = 'header',
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 'w-10 h-10', text: 'text-sm', sub: 'text-[10px]' },
    lg: { icon: 'w-14 h-14', text: 'text-lg', sub: 'text-xs' },
    xl: { icon: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  };

  const { icon, text, sub } = sizeMap[size];

  if (variant === 'smart-drive') {
    return (
      <div className={`flex items-center gap-3.5 ${className}`}>
        {/* Smart Drive Wheel & Green S Symbol */}
        <div className="w-14 h-14 flex items-center justify-center relative flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Outer Wheel Tire */}
            <circle cx="50" cy="50" r="38" stroke="#1e293b" strokeWidth="9" />
            <circle cx="50" cy="50" r="28" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />
            {/* Green Rim / Center */}
            <circle cx="50" cy="50" r="14" fill="#22c55e" />
            <circle cx="50" cy="50" r="6" fill="#ffffff" />
            {/* Stylized S Curve wrapping around wheel */}
            <path
              d="M 32 20 C 58 10, 85 24, 76 52 C 68 76, 26 62, 24 82 C 22 92, 38 98, 56 94"
              stroke="#22c55e"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* S top point */}
            <circle cx="32" cy="20" r="5" fill="#15803d" />
          </svg>
        </div>
        {showText && (
          <div className="flex flex-col text-left">
            <span className="font-black text-slate-900 tracking-wider text-xl leading-tight font-sans">
              SMART
            </span>
            <span className="font-black text-emerald-600 tracking-widest text-lg leading-tight font-sans">
              DRIVE
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'spare-parts') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${icon} rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0`}>
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
            {/* SVG Circular Arrows & ES Lettermark */}
            <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
              <defs>
                <linearGradient id="esGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" stroke="url(#esGreenGrad)" strokeWidth="6" strokeDasharray="180 50" />
              <path d="M 85 45 L 95 52 L 80 58 Z" fill="#4ade80" />
              <text x="50" y="62" textAnchor="middle" fill="url(#esGreenGrad)" fontWeight="900" fontSize="34" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-1">
                ES
              </text>
            </svg>
          </div>
        </div>
        {showText && (
          <div>
            <div className={`font-black tracking-wider text-slate-900 leading-none ${text} flex items-center gap-1`}>
              <span>EKOSMART</span>
              <span className="text-emerald-600">EV SPARE PARTS</span>
            </div>
            <span className={`text-slate-500 font-semibold tracking-wide block mt-0.5 ${sub}`}>
              Wholesale & Retail Genuine Parts
            </span>
          </div>
        )}
      </div>
    );
  }

  // EBS Battery Solution Logo
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${icon} rounded-xl bg-gradient-to-tr from-emerald-700 via-green-500 to-teal-300 p-0.5 shadow-md flex items-center justify-center flex-shrink-0`}>
        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* SVG Swoosh Arrow & EBS Lettermark */}
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <defs>
              <linearGradient id="ebsGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>
            {/* Top curved swoosh arrow */}
            <path d="M 18 42 C 28 16, 72 16, 82 42" stroke="url(#ebsGreenGrad)" strokeWidth="7" strokeLinecap="round" />
            <polygon points="80,30 94,40 76,46" fill="#86efac" />
            {/* Bold EBS text */}
            <text x="50" y="68" textAnchor="middle" fill="url(#ebsGreenGrad)" fontWeight="900" fontSize="30" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-0.5">
              EBS
            </text>
          </svg>
        </div>
      </div>
      {showText && (
        <div>
          <div className={`font-black tracking-wider text-slate-900 leading-tight ${text} flex items-center gap-1.5`}>
            <span className="text-emerald-700 font-black">EBS</span>
            <span className="text-slate-800">EKOSMART</span>
          </div>
          <span className={`text-emerald-700 font-bold uppercase tracking-wider block ${sub}`}>
            Battery Solution • Li-ion & LFP
          </span>
        </div>
      )}
    </div>
  );
};

export default EbsLogo;
