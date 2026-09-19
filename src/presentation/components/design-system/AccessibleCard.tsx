import React from 'react';

interface AccessibleCardProps {
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  isActionable?: boolean;
}

export function AccessibleCard({
  children,
  title,
  onClick,
  className = '',
  ariaLabel,
  isActionable = false
}: AccessibleCardProps) {
  
  const baseClasses = "bg-white rounded-2xl p-6 md:p-8 overflow-hidden";
  
  // High tactile visibility border for users with cataracts or low visual acuity
  const visualClasses = "border-2 border-[#EFE5D6] shadow-sm";
  
  const actionableClasses = isActionable 
    ? "cursor-pointer hover:border-[#1E4D3B] hover:shadow-md hover:bg-[#FAF6F0] transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#1E4D3B]"
    : "";

  if (isActionable) {
    return (
      <button
        type="button"
        className={`${baseClasses} ${visualClasses} ${actionableClasses} ${className} text-left w-full block`}
        onClick={onClick}
        aria-label={ariaLabel || title}
      >
        {title && (
          <h3 className="text-2xl font-bold text-[#2E241C] mb-4 font-serif-warm">
            {title}
          </h3>
        )}
        <div className="text-lg text-[#2E241C]">
          {children}
        </div>
      </button>
    );
  }

  return (
    <article
      className={`${baseClasses} ${visualClasses} ${className} text-left w-full block`}
      aria-label={ariaLabel || title}
    >
      {title && (
        <h3 className="text-2xl font-bold text-[#2E241C] mb-4 font-serif-warm">
          {title}
        </h3>
      )}
      <div className="text-lg text-[#2E241C]">
        {children}
      </div>
    </article>
  );
}
