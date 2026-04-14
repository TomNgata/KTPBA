
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: number;
}

export default function Logo({ className = '', variant = 'light', size = 40 }: LogoProps) {
  const color = variant === 'light' ? '#F5F2ED' : '#1A1A1A';
  const secondaryColor = '#C0251E'; // Ktpba Red

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Abstracted Bowling Ball with Finger Holes as minimalist signal */}
      <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="2" />
      <circle cx="50" cy="50" r="35" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
      
      {/* Red Accent Pin Silhouette */}
      <path 
        d="M50 20C46 20 44 24 44 28C44 32 46 34 46 38V42C44 46 40 48 40 56C40 64 44 68 50 68C56 68 60 64 60 56C60 48 56 46 54 42V38C54 34 56 32 56 28C56 24 54 20 50 20Z" 
        fill={secondaryColor} 
      />
      
      {/* Three Holes (Symbolic) */}
      <circle cx="42" cy="78" r="3" fill={color} />
      <circle cx="58" cy="78" r="3" fill={color} />
      <circle cx="50" cy="88" r="3" fill={color} />
      
      {/* Speed lines */}
      <line x1="10" y1="50" x2="25" y2="50" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="15" y1="40" x2="25" y2="40" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="15" y1="60" x2="25" y2="60" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
