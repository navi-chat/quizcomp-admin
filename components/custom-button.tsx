'use client'
import { cn } from '@/lib/utils';
import React from 'react';

interface CustomButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, children, className, disabled=false, type="button" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn("bg-white text-[#171841] font-bold flex items-center gap-2 text-base rounded-xl px-8 py-2 pt-3 shadow-[0_4px_0_0_#c4c6e6] active:shadow-[0_2px_0_0_#c4c6e6] active:translate-y-1 transition-all cursor-pointer", className)}
    >
      {children}
    </button>
  );
};

export default CustomButton;