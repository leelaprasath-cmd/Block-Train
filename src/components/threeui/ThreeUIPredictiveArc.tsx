import React, { useEffect, useRef, type CSSProperties } from 'react';

export type PredictiveArcMode = 'dark' | 'light';

export interface ThreeUIPredictiveArcProps {
  mode?: PredictiveArcMode;
  speed?: number;
  spacing?: number;
  dotSize?: number;
  archHeight?: number;
  thickness?: number;
  brightness?: number;
  hue?: number;
  saturation?: number;
  className?: string;
  style?: CSSProperties;
  label?: string;
  subLabel?: string;
  metricValue?: string;
}

export const PREDICTIVE_ARC_DEFAULTS = {
  mode: 'dark' as PredictiveArcMode,
  speed: 1,
  spacing: 5,
  dotSize: 5,
  archHeight: 0.65,
  thickness: 1,
  brightness: 1,
  hue: 0,
  saturation: 1,
};

export const ThreeUIPredictiveArc: React.FC<ThreeUIPredictiveArcProps> = ({
  className = '',
  style,
  label = 'KAVACH SBD PREDICTIVE TRAJECTORY',
  subLabel = 'Dynamic Deceleration Envelope Vector',
  metricValue = '384.2 m Safe Braking Distance',
  ...props
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const optionsRef = useRef({ ...PREDICTIVE_ARC_DEFAULTS, ...props });
  optionsRef.current = { ...PREDICTIVE_ARC_DEFAULTS, ...props };

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return undefined;

    let width = 1;
    let height = 1;
    let time = 0;
    let frame = 0;
    let visible = true;

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width));
      height = Math.max(1, Math.round(bounds.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const render = () => {
      const options = optionsRef.current;
      const isLight = options.mode === 'light';
      context.fillStyle = isLight ? '#f1f5f9' : '#030712';
      context.fillRect(0, 0, width, height);
      time += 0.015 * options.speed;

      const centerX = width / 2;
      const archPeakY = height * 0.38;
      const archWidth = width * 1.45;
      const archHeight = height * options.archHeight;
      context.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

      for (let x = 0; x < width; x += options.spacing) {
        const normX = (x - centerX) / (archWidth / 2);
        const curveY = archPeakY + normX * normX * archHeight;
        for (let y = 0; y < height; y += options.spacing) {
          const distanceToCurve = Math.abs(y - curveY);
          const thickness = (130 + (1 - Math.abs(normX)) * 80) * options.thickness;
          if (distanceToCurve >= thickness) continue;
          let intensity = 1 - distanceToCurve / thickness;
          const waveX = Math.sin(x * 0.015 + time);
          const waveY = Math.cos(y * 0.02 + time);
          intensity = intensity * 0.7 + waveX * waveY * 0.3 * intensity;
          intensity *= Math.max(0, 1 - Math.pow(Math.abs(normX), 2.5));
          if (intensity <= 0.02) continue;

          let r: number;
          let g: number;
          let b: number;
          if (isLight) {
            r = Math.min(255, 30 * intensity + 60 * Math.pow(intensity, 3));
            g = Math.min(255, 80 * intensity + 90 * Math.pow(intensity, 4));
            b = Math.min(255, 180 * intensity + 120 * Math.pow(intensity, 2));
            if (intensity > 0.7) {
              const coreBoost = (intensity - 0.7) * 3.3;
              r = Math.min(255, r + 70 * coreBoost);
              g = Math.min(255, g + 90 * coreBoost);
              b = Math.min(255, b + 120 * coreBoost);
            }
          } else {
            // High-intensity Cyan / Electric Blue for Kavach Telemetry
            r = Math.min(255, 10 * intensity + 40 * Math.pow(intensity, 3));
            g = Math.min(255, 140 * intensity + 115 * Math.pow(intensity, 4));
            b = Math.min(255, 230 * intensity + 140 * Math.pow(intensity, 2));
            if (intensity > 0.65) {
              const coreBoost = (intensity - 0.65) * 3.5;
              r = Math.min(255, r + 160 * coreBoost);
              g = Math.min(255, g + 210 * coreBoost);
              b = Math.min(255, b + 255 * coreBoost);
            }
          }

          context.fillStyle = `rgb(${Math.floor(r * options.brightness)}, ${Math.floor(g * options.brightness)}, ${Math.floor(b * options.brightness)})`;
          context.fillRect(x, y, options.dotSize * intensity, options.dotSize * intensity);
        }
      }
      context.globalCompositeOperation = 'source-over';
    };

    const tick = () => {
      render();
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };

    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible && !frame) frame = requestAnimationFrame(tick);
      if (!visible && frame) cancelAnimationFrame(frame), (frame = 0);
    });

    const visibility = () => {
      if (document.hidden && frame) cancelAnimationFrame(frame), (frame = 0);
      else if (!document.hidden && visible && !frame) frame = requestAnimationFrame(tick);
    };

    observer.observe(host);
    intersection.observe(host);
    document.addEventListener('visibilitychange', visibility);
    resize();
    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={`relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950/80 shadow-2xl ${className}`}
      style={{ ...style }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          filter: `hue-rotate(${optionsRef.current.hue}deg) saturate(${optionsRef.current.saturation})`,
        }}
      />
      {/* HUD Telemetry Overlay */}
      <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs font-bold tracking-wider text-cyan-300">
              {label}
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-200">
            THREEUI GLSL TRAJECTORY
          </span>
        </div>

        <div className="flex items-end justify-between bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20">
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
              {subLabel}
            </div>
            <div className="font-mono text-sm font-bold text-white tracking-wide">
              {metricValue}
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-cyan-400">
            60 FPS KAVACH RADAR
          </div>
        </div>
      </div>
    </div>
  );
};
