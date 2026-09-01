import React, { useState } from 'react';
import { MotionProvider } from './context/MotionContext';
import { MinimalNav } from './components/layout/MinimalNav';
import { SpatialFooter } from './components/layout/SpatialFooter';
import { SpatialHero } from './components/hero/SpatialHero';
import { StickyScrollPipeline } from './components/storytelling/StickyScrollPipeline';
import { ParallaxDeck } from './components/parallax/ParallaxDeck';
import { TactileLab } from './components/tactile/TactileLab';
import { LiveProductsGallery } from './components/showcase/LiveProductsGallery';
import { TokenMorphEngine } from './components/tokens/TokenMorphEngine';
import { StudioContact } from './components/contact/StudioContact';

export const AppContent: React.FC = () => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 relative selection:bg-blue-500/20 selection:text-blue-950">
      
      {/* Precision Floating Navigation with Scroll Progress Indicator */}
      <MinimalNav
        onOpenTokenDrawer={() => setIsTokenModalOpen(true)}
      />

      {/* Main Experience Flow */}
      <main className="space-y-0">
        
        {/* 1. 3D Perspective Scroll-Driven Hero */}
        <SpatialHero
          onOpenTokenDrawer={() => setIsTokenModalOpen(true)}
        />

        {/* 2. Apple-Style 4-Stage Sticky Scroll Storytelling Section */}
        <StickyScrollPipeline />

        {/* 3. Spatial Parallax Multi-Plane Deck */}
        <ParallaxDeck />

        {/* 4. Tactile Micro-Interaction Studio (Magnetic, Tilt, Springs) */}
        <TactileLab />

        {/* 5. Real-World Interactive Product Interfaces & Viewport Morphing */}
        <LiveProductsGallery />

        {/* 6. Live Stitch AI Design Token Morph Engine */}
        <TokenMorphEngine />

        {/* 7. Studio Collaboration & Inquiries */}
        <StudioContact />

      </main>

      {/* Spatial Lab Footer */}
      <SpatialFooter />

      {/* Standalone Token Morph Modal */}
      <TokenMorphEngine
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        isModal={true}
      />

    </div>
  );
};

export function App() {
  return (
    <MotionProvider>
      <AppContent />
    </MotionProvider>
  );
}

export default App;
