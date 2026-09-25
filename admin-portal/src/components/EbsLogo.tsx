import React from 'react';

interface EbsLogoProps {
  variant?: 'battery' | 'spare-parts' | 'header' | 'badge';
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

  if (variant === 'spare-parts') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`${icon} rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center flex-shrink-0`}>
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
              <defs>
                <linearGradient id="adminEsGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" stroke="url(#adminEsGreenGrad)" strokeWidth="6" strokeDasharray="180 50" />
              <path d="M 85 45 L 95 52 L 80 58 Z" fill="#4ade80" />
              <text x="50" y="62" textAnchor="middle" fill="url(#adminEsGreenGrad)" fontWeight="900" fontSize="34" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-1">
                ES
              </text>
            </svg>
          </div>
        </div>
        {showText && (
          <div>
            <div className={`font-black tracking-wider text-white leading-none ${text} flex items-center gap-1`}>
              <span>EKOSMART</span>
              <span className="text-emerald-400">EV SPARE PARTS</span>
            </div>
            <span className={`text-slate-400 font-semibold tracking-wide block mt-0.5 ${sub}`}>
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
          <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
            <defs>
              <linearGradient id="adminEbsGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#166534" />
              </linearGradient>
            </defs>
            <path d="M 18 42 C 28 16, 72 16, 82 42" stroke="url(#adminEbsGreenGrad)" strokeWidth="7" strokeLinecap="round" />
            <polygon points="80,30 94,40 76,46" fill="#86efac" />
            <text x="50" y="68" textAnchor="middle" fill="url(#adminEbsGreenGrad)" fontWeight="900" fontSize="30" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-0.5">
              EBS
            </text>
          </svg>
        </div>
      </div>
      {showText && (
        <div>
          <div className={`font-black tracking-wider text-white leading-tight ${text} flex items-center gap-1.5`}>
            <span className="text-emerald-400 font-black">EBS</span>
            <span className="text-slate-100">EKOSMART</span>
          </div>
          <span className={`text-emerald-400 font-bold uppercase tracking-wider block ${sub}`}>
            Battery Solution • Li-ion & LFP
          </span>
        </div>
      )}
    </div>
  );
};

export default EbsLogo;
