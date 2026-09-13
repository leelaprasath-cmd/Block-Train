import React, { useState, useRef, MouseEvent } from 'react';

interface ThreeUITiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  dark?: boolean;
}

export const ThreeUITiltCard: React.FC<ThreeUITiltCardProps> = ({
  children,
  className = '',
  maxTilt = 10,
  glareOpacity = 0.22,
  dark = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);

    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1, 1, 1)`,
        transition: 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.25s ease',
      }}
      className={`relative overflow-hidden rounded-2xl ${
        dark ? 'threeui-glass-dark text-white' : 'threeui-glass text-slate-800'
      } ${className}`}
    >
      {/* ThreeUI Specular Glare Reflection */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glarePos.opacity}), transparent 70%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};
