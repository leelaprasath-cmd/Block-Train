import React, { useState, useRef } from 'react';
import { useMotion } from '../../context/MotionContext';

interface TiltCardProps {
  title: string;
  subtitle: string;
  metric: string;
  badge: string;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  title,
  subtitle,
  metric,
  badge,
  className = '',
}) => {
  const { tokens } = useMotion();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate limits (+-12deg)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.35,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="perspective-800 w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          borderRadius: `${tokens.borderRadius}px`,
          transition: rotate.x === 0 ? 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
        className={`relative p-7 glass-panel border border-slate-200 bg-white/95 overflow-hidden shadow-xl shadow-slate-200/60 preserve-3d will-change-transform cursor-pointer ${className}`}
      >
        {/* Dynamic Specular Light Glare in Bright Mode */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity * 1.5}), transparent 60%)`,
          }}
        />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-blue-600 font-bold uppercase">{badge}</span>
            <span className="text-[10px] font-mono text-slate-400">3D GYRO TILT</span>
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500 pt-0.5">{subtitle}</p>
          </div>

          <div className="text-3xl font-extrabold font-mono text-slate-900 pt-2">
            {metric}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-100">
            <span>Hover to test 3D tilt glare</span>
            <span className="text-blue-600 font-bold">60 FPS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
