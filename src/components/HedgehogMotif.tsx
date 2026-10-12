import React from 'react';

export const HedgehogLogo: React.FC<{ className?: string; alt?: string }> = ({ 
  className = "w-11 h-11",
  alt = "The Hedgehog Café Logo" 
}) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-[#FAF3EA] border-2 border-[#D4A373]/50 overflow-hidden shadow-xs shrink-0 ring-1 ring-[#58402F]/10 ${className}`}>
      <img
        src="/images/hedgehog-logo.jpg"
        alt={alt}
        className="w-full h-full object-cover rounded-full"
        loading="eager"
      />
    </div>
  );
};

export const HedgehogMotif: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-[#AD7950]" }) => {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Refined editorial quill/hedgehog & open book hybrid motif */}
      <path
        d="M6 34C11 31 19 31 24 35C29 31 37 31 42 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 39C11 36 19 36 24 40C29 36 37 36 42 39"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.6"
      />
      <path
        d="M24 35V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hedgehog gentle arch spines */}
      <path
        d="M12 28C11 20 16 12 24 10C32 12 37 20 36 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 19L13 14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M21 15L19 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M27 15L29 9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M32 19L35 14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="21" cy="23" r="1.5" fill="currentColor" />
    </svg>
  );
};

export const BookDivider: React.FC<{ className?: string }> = ({ className = "my-6 text-[#58402F]/20" }) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-[1px] w-12 bg-current" />
      <span className="font-serif text-sm italic tracking-widest text-[#AD7950]">✦ ✦ ✦</span>
      <span className="h-[1px] w-12 bg-current" />
    </div>
  );
};



