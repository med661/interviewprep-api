import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
}

export default function Loader({ size = 'md', variant = 'spinner', className = '' }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
        <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
        <div className={`${dotSizeClasses[size]} bg-blue-600 rounded-full animate-bounce`}></div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <div className="absolute w-full h-full bg-blue-400 rounded-full opacity-75 animate-ping"></div>
        <div className="relative w-3/4 h-3/4 bg-blue-500 rounded-full"></div>
      </div>
    );
  }

  // Default: Spinner
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin`}></div>
    </div>
  );
}
