import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MotionTokenState } from '../types';

interface MotionContextType {
  scrollProgress: number; // 0 to 1
  scrollVelocity: number;
  scrollY: number;
  tokens: MotionTokenState;
  updateToken: <K extends keyof MotionTokenState>(key: K, value: MotionTokenState[K]) => void;
  resetTokens: () => void;
  exportDesignMd: () => string;
}

const defaultTokens: MotionTokenState = {
  primaryHue: 221,
  accentHue: 199,
  borderRadius: 16,
  glassOpacity: 0.88,
  motionStiffness: 1,
};

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [tokens, setTokens] = useState<MotionTokenState>(defaultTokens);

  const lastScrollYRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const rafIdRef = useRef<number | null>(null);

  // Synchronize CSS variables with tokens
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', `${tokens.primaryHue} 83% 53%`);
    root.style.setProperty('--color-primary-500', `${tokens.primaryHue} 83% 53%`);
    root.style.setProperty('--color-primary-600', `${tokens.primaryHue} 76% 48%`);
    root.style.setProperty('--color-accent', `${tokens.accentHue} 89% 48%`);
    root.style.setProperty('--border-radius', `${tokens.borderRadius}px`);
    root.style.setProperty('--glass-opacity', `${tokens.glassOpacity}`);
    root.style.setProperty('--motion-stiffness', `${tokens.motionStiffness}`);
  }, [tokens]);

  // Smooth scroll and velocity listener
  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) return;

      rafIdRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(Math.max(currentScrollY / totalHeight, 0), 1) : 0;

        const now = Date.now();
        const timeDiff = Math.max(now - lastTimeRef.current, 1);
        const distance = Math.abs(currentScrollY - lastScrollYRef.current);
        const velocity = Math.min((distance / timeDiff) * 100, 100);

        setScrollProgress(progress);
        setScrollVelocity(velocity);
        setScrollY(currentScrollY);

        lastScrollYRef.current = currentScrollY;
        lastTimeRef.current = now;
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  const updateToken = <K extends keyof MotionTokenState>(key: K, value: MotionTokenState[K]) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  };

  const resetTokens = () => {
    setTokens(defaultTokens);
  };

  const exportDesignMd = () => {
    return `# Stitch AI Spatial Design System (DESIGN.md)

## Bright Executive Color Palette
- **Primary Spatial Tone:** hsl(${tokens.primaryHue}, 83%, 53%)
- **Accent Indicator:** hsl(${tokens.accentHue}, 89%, 48%)
- **Base Canvas:** #f8fafc (Pure Alabaster)
- **Glassmorphism Backdrop:** rgba(255, 255, 255, ${tokens.glassOpacity})

## Geometry & Spatial Physics
- **Border Radius:** ${tokens.borderRadius}px
- **Spring Stiffness Multiplier:** ${tokens.motionStiffness}x
- **Backdrop Blur:** 20px
- **Target Frame Rate:** 60.0 FPS
`;
  };

  return (
    <MotionContext.Provider
      value={{
        scrollProgress,
        scrollVelocity,
        scrollY,
        tokens,
        updateToken,
        resetTokens,
        exportDesignMd,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => {
  const context = useContext(MotionContext);
  if (!context) throw new Error('useMotion must be used within MotionProvider');
  return context;
};
