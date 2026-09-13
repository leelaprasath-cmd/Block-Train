import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ThreeUIShaderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'induction' | 'plasma' | 'lumen' | 'tactile';
  icon?: LucideIcon;
  badge?: string;
  glowColor?: 'blue' | 'emerald' | 'amber' | 'crimson' | 'purple';
  size?: 'sm' | 'md' | 'lg';
}

export const ThreeUIShaderButton: React.FC<ThreeUIShaderButtonProps> = ({
  children,
  variant = 'induction',
  icon: Icon,
  badge,
  glowColor = 'blue',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2 text-xs rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-sm rounded-2xl gap-2.5',
  }[size];

  if (variant === 'induction') {
    return (
      <button
        {...props}
        className={`threeui-induction inline-flex items-center justify-center font-mono font-bold transition-all transform active:scale-95 text-white ${sizeClasses} ${className}`}
      >
        <span className="relative z-10 flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 px-3.5 py-1.5 rounded-lg w-full h-full shadow-inner">
          {Icon && <Icon className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
          <span>{children}</span>
          {badge && (
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
              {badge}
            </span>
          )}
        </span>
      </button>
    );
  }

  if (variant === 'plasma') {
    const glows = {
      blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/40 text-white',
      emerald: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/40 text-white',
      amber: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/40 text-white',
      crimson: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/40 text-white',
      purple: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/40 text-white',
    }[glowColor];

    return (
      <button
        {...props}
        className={`inline-flex items-center justify-center font-mono font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg ${glows} ${sizeClasses} ${className}`}
      >
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span>{children}</span>
        {badge && (
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-white/20 text-white font-mono font-bold">
            {badge}
          </span>
        )}
      </button>
    );
  }

  if (variant === 'lumen') {
    return (
      <button
        {...props}
        className={`threeui-sheen inline-flex items-center justify-center font-mono font-bold transition-all threeui-glass hover:bg-white/95 text-slate-800 border border-slate-200 shadow-xs hover:shadow-md ${sizeClasses} ${className}`}
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-blue-600" />}
        <span>{children}</span>
        {badge && (
          <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-50 text-blue-700 border border-blue-200">
            {badge}
          </span>
        )}
      </button>
    );
  }

  // Tactile Keycap
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-[0_3px_0_0_#94a3b8] active:shadow-none active:translate-y-0.5 transition-all ${sizeClasses} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-600" />}
      <span>{children}</span>
      {badge && (
        <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-200 text-slate-700 font-mono">
          {badge}
        </span>
      )}
    </button>
  );
};
