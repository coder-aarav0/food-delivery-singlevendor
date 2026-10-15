import React from 'react';

export interface EnategaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  variant?: 'full' | 'icon' | 'white' | 'black';
}

export function EnategaLogo({
  className = '',
  size = 'md',
  variant = 'full',
}: EnategaLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  const isNumericSize = typeof size === 'number';
  const sizeClass = isNumericSize ? '' : iconSizes[size];
  const customStyle = isNumericSize ? { width: size, height: size } : undefined;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Signature Cloche Food Dome Icon */}
      <div
        style={customStyle}
        className={`relative shrink-0 flex items-center justify-center ${sizeClass}`}
      >

        <svg
          viewBox="0 0 100 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Steam / Speed Motion Lines */}
          <line
            x1="8"
            y1="34"
            x2="28"
            y2="34"
            stroke="#fb6340"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="44"
            x2="24"
            y2="44"
            stroke="#fb6340"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <line
            x1="12"
            y1="54"
            x2="28"
            y2="54"
            stroke="#fb6340"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Cloche Dome Top Handle */}
          <circle cx="62" cy="18" r="6" fill="#fb6340" />

          {/* Main Cloche Dome */}
          <path
            d="M32 58 C32 30, 92 30, 92 58 Z"
            fill="#fb6340"
          />

          {/* Tray Platter Base Line */}
          <rect
            x="28"
            y="61"
            width="68"
            height="6"
            rx="3"
            fill="#fb6340"
          />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center">
            <span
              className={`font-black tracking-tight ${isNumericSize ? 'text-xl' : textSizes[size]} ${
                variant === 'white' ? 'text-white' : variant === 'black' ? 'text-gray-950' : 'text-[#fb6340]'
              }`}
            >
              E
            </span>
            <span
              className={`font-bold tracking-tight ${isNumericSize ? 'text-xl' : textSizes[size]} ${
                variant === 'white' ? 'text-white' : variant === 'black' ? 'text-gray-950' : 'text-[#1e293b]'
              }`}
            >
              natega
            </span>
          </div>
          <span
            className={`font-semibold tracking-wider uppercase ${isNumericSize ? 'text-[11px]' : subSizes[size]} ${
              variant === 'white' ? 'text-white/80' : variant === 'black' ? 'text-gray-800' : 'text-[#64748b]'
            }`}
          >
            Food Delivery
          </span>
        </div>
      )}

    </div>
  );
}
