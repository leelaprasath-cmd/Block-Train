import React, { useState } from 'react';
import { Copy, Check, RotateCcw, X } from 'lucide-react';
import { useMotion } from '../../context/MotionContext';

interface TokenMorphEngineProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const TokenMorphEngine: React.FC<TokenMorphEngineProps> = ({
  isOpen = true,
  onClose,
  isModal = false,
}) => {
  const { tokens, updateToken, resetTokens, exportDesignMd } = useMotion();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleCopyDesignMd = () => {
    const md = exportDesignMd();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setToastMessage('Exported official DESIGN.md specification to clipboard.');
    setTimeout(() => {
      setCopied(false);
      setToastMessage(null);
    }, 2500);
  };

  const content = (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Stitch AI Design Token Morph Engine
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              LIVE CSS ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Adjust design tokens below to dynamically morph colors, corner radii, and glassmorphism across the entire page.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTokens}
            className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs"
            title="Reset to default tokens"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleCopyDesignMd}
            className="px-4 py-1.5 rounded-xl text-xs font-mono font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Export DESIGN.md'}</span>
          </button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sliders Grid & Live Component Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sliders (Col 6) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5 shadow-2xs">
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
            Token Controls & Kinetic Sliders
          </div>

          <div className="space-y-4">
            {/* Primary Hue */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Primary Hue Ramp</span>
                <span className="text-blue-600 font-bold">{tokens.primaryHue}°</span>
              </div>
              <input
                type="range"
                min="180"
                max="360"
                value={tokens.primaryHue}
                onChange={(e) => updateToken('primaryHue', Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Accent Hue */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Accent Indicator Hue</span>
                <span className="text-sky-600 font-bold">{tokens.accentHue}°</span>
              </div>
              <input
                type="range"
                min="160"
                max="240"
                value={tokens.accentHue}
                onChange={(e) => updateToken('accentHue', Number(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Border Radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Geometry Corner Radius</span>
                <span className="text-slate-900 font-bold">{tokens.borderRadius}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="28"
                value={tokens.borderRadius}
                onChange={(e) => updateToken('borderRadius', Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Glass Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-600">Backdrop Alpha Opacity</span>
                <span className="text-slate-900 font-bold">{tokens.glassOpacity}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.98"
                step="0.05"
                value={tokens.glassOpacity}
                onChange={(e) => updateToken('glassOpacity', Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Morphing Preview Card (Col 6) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
          <div className="text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
            Real-Time Token Render
          </div>

          <div
            className="p-6 glass-panel border border-slate-200 bg-white space-y-4 shadow-md shadow-slate-200/50"
            style={{ borderRadius: `${tokens.borderRadius}px` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-medium text-slate-700">INTERACTIVE TEST SURFACE</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                ACTIVE
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                className="px-4 py-2 font-semibold text-xs bg-primary text-white shadow-sm hover:opacity-90 transition-opacity"
                style={{ borderRadius: `${tokens.borderRadius * 0.75}px` }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 font-medium text-xs bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200"
                style={{ borderRadius: `${tokens.borderRadius * 0.75}px` }}
              >
                Ghost Action
              </button>
              <div
                className="px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2"
                style={{ borderRadius: `${tokens.borderRadius * 0.75}px` }}
              >
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Status Pill</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
              <div>--color-primary: <span className="text-blue-600 font-bold">hsl({tokens.primaryHue}, 83%, 53%)</span></div>
              <div>--border-radius: <span className="text-slate-900 font-bold">{tokens.borderRadius}px</span></div>
              <div>--glass-opacity: <span className="text-slate-900 font-bold">{tokens.glassOpacity}</span></div>
            </div>
          </div>
        </div>

      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
        <div 
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-slate-200 p-8 shadow-2xl bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="tokens" className="py-28 px-4 sm:px-8 max-w-7xl mx-auto border-b border-slate-200/80">
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-200 shadow-xl bg-white/95 shadow-slate-200/50">
        {content}
      </div>
    </section>
  );
};
