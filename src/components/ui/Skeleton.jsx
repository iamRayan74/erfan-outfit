import React from 'react';

export default function Skeleton({
  className = '',
  variant = 'rectangular', // 'rectangular' | 'circular'
  ...props
}) {
  const variantClasses = variant === 'circular' ? 'rounded-full' : 'rounded-2xl';

  return (
    <div
      className={`relative overflow-hidden bg-slate-200 ${variantClasses} ${className}`}
      {...props}
    >
      {/* لایه موج نوری متحرک (Shimmer Effect) */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}