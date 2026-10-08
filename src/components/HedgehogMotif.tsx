import React from 'react';

export const HedgehogLogo: React.FC<{ className?: string }> = ({ className = "w-11 h-11" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-[#FAF3EA] border-2 border-[#D4A373]/40 overflow-hidden shadow-xs shrink-0 ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background warm soft circle */}
        <circle cx="50" cy="50" r="48" fill="#F7EFE3" />
        
        {/* Spines / Quills (warm rich brown) */}
        <path d="M22 68C16 54 18 36 32 25C44 15 62 16 72 26C82 36 84 54 78 68C72 60 62 58 50 58C38 58 28 60 22 68Z" fill="#58402F" />
        
        {/* Little outer spiky bristles */}
        <path d="M28 26L20 20M38 18L34 10M50 15L50 6M62 18L66 10M72 26L80 20M82 38L90 35M18 38L10 35M83 50L91 50M17 50L9 50" stroke="#58402F" strokeWidth="3" strokeLinecap="round" />
        
        {/* Face & Body */}
        <ellipse cx="50" cy="56" rx="25" ry="21" fill="#E8D7C3" />
        
        {/* Rosy Cheeks */}
        <circle cx="36" cy="59" r="4" fill="#E29D80" opacity="0.6" />
        <circle cx="64" cy="59" r="4" fill="#E29D80" opacity="0.6" />
        
        {/* Cute Eyes with catchlight */}
        <circle cx="41" cy="52" r="3.5" fill="#292722" />
        <circle cx="42.5" cy="50.5" r="1.2" fill="#FFFFFF" />
        <circle cx="59" cy="52" r="3.5" fill="#292722" />
        <circle cx="60.5" cy="50.5" r="1.2" fill="#FFFFFF" />
        
        {/* Nose / Snout */}
        <ellipse cx="50" cy="59" rx="4.5" ry="3.5" fill="#35271F" />
        
        {/* Sweet Smile */}
        <path d="M46 64C48 66 52 66 54 64" stroke="#35271F" strokeWidth="2" strokeLinecap="round" />
        
        {/* Little paws */}
        <ellipse cx="38" cy="74" rx="4" ry="2.5" fill="#D6BFAB" />
        <ellipse cx="62" cy="74" rx="4" ry="2.5" fill="#D6BFAB" />
      </svg>
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



