export interface MotionTokenState {
  primaryHue: number;
  accentHue: number;
  borderRadius: number;
  glassOpacity: number;
  motionStiffness: number;
}

export interface StickyPipelineStage {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  keyCapability: string;
  stateLabel: string;
}

export interface ParallaxParadigmItem {
  id: string;
  title: string;
  category: string;
  headline: string;
  description: string;
  depthRatio: number; // For scroll parallax velocity
  accentGradient: string;
  features: string[];
  interactiveType: 'specular' | 'magnetic' | 'bento' | 'responsive';
}

export interface LiveProductItem {
  id: string;
  title: string;
  type: string;
  tagline: string;
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  demoType: 'fintech' | 'ai-canvas' | 'spatial-media' | 'kinetic-store';
}
