import React from 'react';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'emergency' | 'outline' | 'ghost';
  size?: 'default' | 'large' | 'massive';
  children: React.ReactNode;
  ariaLabel: string; // Force developers to provide an accessible label for screen readers
}

export function AccessibleButton({
  variant = 'primary',
  size = 'default',
  type = 'button',
  children,
  ariaLabel,
  className = '',
  ...props
}: AccessibleButtonProps) {
  
  // Base classes enforce minimum touch target (min-h-12 / 48px), high contrast focus ring, and tactile tactile response
  const baseClasses = "relative inline-flex items-center justify-center font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 rounded-xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";
  
  const sizeClasses = {
    default: "min-h-[48px] px-6 py-3 text-lg",
    large: "min-h-[64px] px-8 py-4 text-xl",
    massive: "min-h-[80px] w-full px-8 py-6 text-2xl"
  };

  const variantClasses = {
    primary: "bg-[#1E4D3B] text-white hover:bg-[#15382A] border-2 border-transparent focus-visible:ring-[#1E4D3B]",
    secondary: "bg-[#EFE5D6] text-[#2E241C] hover:bg-[#DED2BF] border-2 border-[#DED2BF] focus-visible:ring-[#1E4D3B]",
    emergency: "bg-[#D32F2F] text-white hover:bg-[#B71C1C] border-2 border-transparent focus-visible:ring-[#D32F2F]",
    outline: "border-2 border-[#1E4D3B] text-[#1E4D3B] bg-transparent hover:bg-[#F4F9F6] focus-visible:ring-[#1E4D3B]",
    ghost: "bg-transparent text-[#1E4D3B] hover:bg-[#EFE5D6] border-2 border-transparent focus-visible:ring-[#1E4D3B]"
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
