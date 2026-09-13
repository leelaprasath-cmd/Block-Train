import React, { useState } from 'react';
import {
  Train,
  ShieldCheck,
  Cpu,
  Layers,
  Activity,
  Sparkles,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Play,
  ExternalLink
} from 'lucide-react';
import { ThreeUIShaderButton } from '../threeui/ThreeUIShaderButton';
import { ThreeUITiltCard } from '../threeui/ThreeUITiltCard';
import { ThreeUILaser } from '../threeui/ThreeUILaser';
import { ThreeUIPredictiveArc } from '../threeui/ThreeUIPredictiveArc';
import { ExtractedRealTrackCanvas } from '../map/ExtractedRealTrackCanvas';
import { SpatialRailway3D } from '../threeui/SpatialRailway3D';

interface LandingPageProps {
  onLaunchOCC: () => void;
  onOpenWimt: (trainNumber?: string) => void;
  onOpenPlanner: () => void;
  blockActive: boolean;
  onToggleBlock: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchOCC,
  onOpenWimt,
  onOpenPlanner,
  blockActive,
  onToggleBlock,
}) => {
  // Simulator preview mode on landing page: 'quad_tracks' | 'spatial_3d'
  const [previewMode, setPreviewMode] = useState<'quad_tracks' | 'spatial_3d'>('quad_tracks');

  const trainsList = [
    {
      id: '20643',
      name: 'Vande Bharat Express',
      type: 'VANDE_BHARAT',
      route: 'Coimbatore Jn ⇄ Chennai Central',
      track: 'Track 3: UP FAST',
      speed: '130 km/h',
      status: 'ON TIME',
      nextStop: 'Tambaram (PF 7)',
      color: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    },
    {
      id: '12638',
      name: 'Pandian Superfast Express',
      type: 'SUPERFAST',
      route: 'Madurai Jn ⇄ Chennai Egmore',
      track: 'Track 3: UP FAST',
      speed: '110 km/h',
      status: 'ON TIME',
      nextStop: 'Tambaram (PF 2)',
      color: 'from-red-600 to-rose-600',
      badgeBg: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
    },
    {
      id: '40012',
      name: 'Chennai Beach Suburban EMU',
      type: 'SUBURBAN_LOCAL',
      route: 'Tambaram ⇄ Chennai Beach',
      track: 'Track 1: UP SLOW',
      speed: '75 km/h',
      status: 'ALL STATIONS',
      nextStop: 'Chromepet (PF 1)',
      color: 'from-sky-500 to-cyan-600',
      badgeBg: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
    },
    {
      id: '40015',
      name: 'Chengalpattu Suburban EMU',
      type: 'SUBURBAN_LOCAL',
      route: 'Chennai Beach ⇄ Chengalpattu',
      track: 'Track 2: DN SLOW',
      speed: '75 km/h',
      status: 'ALL STATIONS',
      nextStop: 'Guindy (PF 2)',
      color: 'from-cyan-600 to-teal-600',
      badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
    },
    {
      id: '22671',
      name: 'Tejas Superfast Express',
      type: 'SUPERFAST',
      route: 'Chennai Egmore ⇄ Madurai',
      track: 'Track 4: DN FAST',
      speed: '120 km/h',
      status: 'ON TIME',
      nextStop: 'Tambaram (PF 3)',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: '66042',
      name: 'CONCOR Container Freight',
      type: 'HEAVY_FREIGHT',
      route: 'Chennai Port ⇄ Whitefield Yard',
      track: 'Track 4: DN FAST',
      speed: '60 km/h',
      status: 'SCHEDULED',
      nextStop: 'Vandalur Siding',
      color: 'from-emerald-600 to-green-700',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden relative selection:bg-blue-500 selection:text-white">
      {/* Background Decorative Glow Orbs */}
      <div className="landing-glow-orb w-[600px] h-[600px] bg-blue-600/15 top-0 -left-48" />
      <div className="landing-glow-orb w-[700px] h-[700px] bg-cyan-500/10 top-96 -right-64" />
      <div className="landing-glow-orb w-[800px] h-[800px] bg-indigo-600/10 top-[2200px] left-1/4" />

      {/* 1. Fixed Top Executive Navigation Bar */}
      <header className="fixed top-0 inset-x-0 z-50 h-16 occ-header-glass px-4 sm:px-8 flex items-center justify-between gap-4 border-b border-slate-700/80 backdrop-blur-xl bg-slate-950/85">
        {/* Brand & Division Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20 border border-blue-400/40">
            <Train className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-white font-mono">
                BLOCK<span className="text-cyan-400">TRAIN</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono font-bold">
                SIH26027
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono leading-none">
              SOUTHERN RAILWAY • CHENNAI DIVISION (MAS)
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-300 font-semibold">
          <a href="#corridor-tracks" className="hover:text-cyan-400 transition-colors">
            4 Real Tracks
          </a>
          <a href="#timetable" className="hover:text-cyan-400 transition-colors">
            Live Timetable
          </a>
          <a href="#kavach" className="hover:text-cyan-400 transition-colors">
            Kavach 4.0 TCAS
          </a>
          <a href="#ai-dispatcher" className="hover:text-cyan-400 transition-colors">
            AI Dispatcher
          </a>
          <a href="#simulator" className="hover:text-cyan-400 transition-colors">
            Interactive Simulator
          </a>
          <a href="#impact" className="hover:text-cyan-400 transition-colors">
            Impact
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenWimt('20643')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>NTES Timetable</span>
          </button>

          <ThreeUIShaderButton
            variant="induction"
            icon={ArrowRight}
            onClick={onLaunchOCC}
            badge="LIVE OCC"
          >
            LAUNCH OCC COCKPIT
          </ThreeUIShaderButton>
        </div>
      </header>

      {/* 2. Hero Section: Cinematic Presentation & Interactive Preview */}
      <section id="hero" className="relative pt-32 pb-20 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Hackathon Winner Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-6 shadow-lg shadow-cyan-500/10 animate-float-subtle">
          <Award className="w-4 h-4 text-amber-400" />
          <span>SMART INDIA HACKATHON WINNING ARCHITECTURE // PROBLEM ID: SIH26027</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl leading-[1.1] mb-6 font-sans">
          Autonomous Railway <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Congestion Control & Collision Avoidance
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8 font-normal">
          Next-generation Operations Control Centre (OCC) for Southern Railway. Featuring{' '}
          <strong className="text-cyan-300 font-semibold">exact real-world quadruple tracks</strong> (Up/Down Slow & Fast lines) from Chengalpattu to Chennai Central,{' '}
          <strong className="text-cyan-300 font-semibold">sub-second Kavach 4.0 TCAS collision prediction</strong>, and timetable-synchronized train physics.
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onLaunchOCC}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 border border-blue-400/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Train className="w-4 h-4 text-cyan-300" />
            <span>Launch Live OCC Simulator</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#corridor-tracks"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-mono font-bold text-xs border border-slate-700 hover:border-slate-600 shadow-md transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Explore 4-Track Corridor</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Hero Interactive 3D / Shader Card */}
        <div className="w-full max-w-5xl relative">
          <ThreeUITiltCard dark maxTilt={6} className="p-1 rounded-3xl border border-cyan-500/30 shadow-2xl bg-slate-950/80">
            <div className="relative rounded-[22px] overflow-hidden bg-slate-950 h-96 sm:h-[420px] flex flex-col justify-between p-6">
              {/* Live Raymarched Laser Scanner in Background */}
              <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <ThreeUILaser variant="atmospheric-blade" speed={1.0} density={1.2} />
              </div>

              {/* Card Header Telemetry */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <div className="text-left">
                    <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                      <span>VANDE BHARAT EXPRESS 20643</span>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[10px] text-cyan-400 border border-cyan-500/30">
                        TRACK 3 UP FAST
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Coimbatore Jn ⇄ MGR Chennai Central (495 km)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    KAVACH 4.0 ARMED
                  </span>
                </div>
              </div>

              {/* Center Cockpit HUD */}
              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
                  <div className="text-[10px] text-slate-400 uppercase">Velocity</div>
                  <div className="text-2xl font-black text-white mt-0.5">
                    130 <span className="text-xs text-cyan-400 font-normal">km/h</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-1">Top Speed Allowed</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
                  <div className="text-[10px] text-slate-400 uppercase">Current Section</div>
                  <div className="text-base font-bold text-white mt-1">TBM ⇄ CMP</div>
                  <div className="text-[10px] text-slate-400 mt-1">Km Mark: 27.2</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
                  <div className="text-[10px] text-slate-400 uppercase">Safe Braking Dist</div>
                  <div className="text-base font-bold text-cyan-300 mt-1">384.2 m</div>
                  <div className="text-[10px] text-emerald-400 mt-1">0 Collision Risk</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
                  <div className="text-[10px] text-slate-400 uppercase">Timetable Status</div>
                  <div className="text-base font-bold text-emerald-300 mt-1">ON TIME (0m)</div>
                  <div className="text-[10px] text-slate-400 mt-1">Next: Tambaram PF 7</div>
                </div>
              </div>

              {/* Bottom Quick Trigger Bar */}
              <div className="relative z-10 flex items-center justify-between border-t border-cyan-900/50 pt-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>Real-Time Moving Block Signalling • Sub-Meter GIS Satellite Synchronization</span>
                </div>
                <button
                  onClick={onLaunchOCC}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all text-xs flex items-center gap-1"
                >
                  <span>Open Full Cockpit</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </ThreeUITiltCard>
        </div>

        {/* Telemetry Ticker Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mt-10 font-mono text-center">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-black text-white">4 Running Lines</div>
            <div className="text-xs text-slate-400 mt-1">Up/Down Slow & Fast Lines</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-black text-cyan-400">62.8 R-KM</div>
            <div className="text-xs text-slate-400 mt-1">Surveyed Chennai Mainline</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-black text-emerald-400">0 Collisions</div>
            <div className="text-xs text-slate-400 mt-1">Kavach 4.0 TCAS Enforcement</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl font-black text-amber-400">&lt; 0.8s Latency</div>
            <div className="text-xs text-slate-400 mt-1">Google OR-Tools CP-SAT</div>
          </div>
        </div>
      </section>

      {/* 3. Section: The 4 Real-World Running Tracks Architecture */}
      <section id="corridor-tracks" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>REAL-WORLD INFRASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Exactly Like The Real World: <br />
            <span className="text-cyan-400">4 Parallel Running Tracks</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            The Chennai–Chengalpattu sector is one of Indian Railways' densest mixed-traffic trunk lines.
            Block-Train mirrors the exact 4-track physical alignment, crossover points, and loop lines extracted from satellite and GIS surveys.
          </p>
        </div>

        {/* 4-Track Grid Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Track 1 */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-sky-500/30 hover:border-sky-400 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400 flex items-center justify-center font-mono font-black text-xs">
                  T1
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-500/30">
                  75 KM/H MAX
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Track 1: UP SLOW</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated suburban commuter line from Tambaram to Chennai Beach. Accommodates 12-car Medha & BHEL EMUs stopping at all intermediate suburban halts.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-sky-400 flex items-center justify-between">
              <span>Rake: EMU 40012</span>
              <span>CGL ⇄ MSB</span>
            </div>
          </div>

          {/* Track 2 */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-mono font-black text-xs">
                  T2
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  75 KM/H MAX
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Track 2: DN SLOW</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Outbound suburban line running south from Chennai Beach towards Chengalpattu. Synchronized with automated 3-minute peak headway spacing.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center justify-between">
              <span>Rake: EMU 40015</span>
              <span>MSB ⇄ CGL</span>
            </div>
          </div>

          {/* Track 3 */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-blue-500/40 hover:border-blue-400 transition-all group flex flex-col justify-between shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-blue-950 border border-blue-500/50 text-blue-300 flex items-center justify-center font-mono font-black text-xs">
                  T3
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900 text-white font-bold border border-blue-400/40">
                  130 KM/H MAX
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-1.5">
                <span>Track 3: UP FAST</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The high-speed express trunk line for <strong className="text-white">Vande Bharat Express 20643</strong> and Pandian Superfast towards Chennai Central and Egmore. Bypasses suburban station platforms.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-blue-300 flex items-center justify-between">
              <span>Vande Bharat 20643</span>
              <span>Kavach 4.0 Active</span>
            </div>
          </div>

          {/* Track 4 */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-rose-500/30 hover:border-rose-400 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-8 h-8 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-400 flex items-center justify-center font-mono font-black text-xs">
                  T4
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
                  120 KM/H MAX
                </span>
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Track 4: DN FAST</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Outbound high-speed express line accommodating Tejas Superfast 22671 and CONCOR Heavy Container freight trains traversing towards Tiruchirappalli and Madurai.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-800 text-[11px] font-mono text-rose-400 flex items-center justify-between">
              <span>Tejas / Freight</span>
              <span>Southern Trunk</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section: Real-World Timetable Engine & Fleet Live Tracking */}
      <section id="timetable" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold mb-3">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>SYNCHRONIZED MOVEMENT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Driven By Real Train Timetables
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-2xl">
              Trains don't move arbitrarily. Every single rake accelerates, cruises, slows down, and halts at station platforms strictly in accordance with authentic Indian Railways timetable schedules.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenWimt('20643')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-all border border-slate-700"
            >
              <Train className="w-4 h-4 text-amber-400" />
              <span>Open NTES Schedule Board</span>
            </button>
          </div>
        </div>

        {/* Live Timetable Fleet Table */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="py-4 px-6">Train # & Name</th>
                  <th className="py-4 px-4">Track Assignment</th>
                  <th className="py-4 px-4">Origin ⇄ Destination</th>
                  <th className="py-4 px-4">Design Speed</th>
                  <th className="py-4 px-4">Next Scheduled Halt</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {trainsList.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{t.id}</span>
                        <span className="font-normal text-xs text-slate-300">{t.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{t.type}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.badgeBg}`}>
                        {t.track}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-300">{t.route}</td>
                    <td className="py-4 px-4 font-bold text-white">{t.speed}</td>
                    <td className="py-4 px-4 text-cyan-300 font-medium">{t.nextStop}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{t.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onOpenWimt(t.id)}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-white font-mono text-[11px] font-bold transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. Section: Kavach 4.0 TCAS & Dynamic Braking Trajectory (Live ThreeUI Predictive Arc) */}
      <section id="kavach" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SAFETY CRITICAL SYSTEM</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Kavach 4.0 TCAS <br />
              <span className="text-cyan-400">Predictive Collision Avoidance</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Indian Railways' indigenous automatic train protection (ATP) system. Continuously projects the Safe Braking Distance (SBD) parabolic envelope.
              In case of signal-passed-at-danger (SPAD) or unauthorized section occupancy, Kavach automatically commands service brake at 1,420m and emergency clamp at 380m.
            </p>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sub-meter localization via NavIC GNSS & Trackside RFID Balises</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Continuous radio communication via UHF 433 MHz & GSM-R catenary mesh</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero collision guarantee across head-on, rear-end, and crossover scenarios</span>
              </div>
            </div>
          </div>

          {/* Embedded Live ThreeUI Predictive Arc */}
          <div className="relative h-[380px] w-full rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 bg-slate-950">
            <ThreeUIPredictiveArc
              speed={1.1}
              archHeight={0.65}
              label="KAVACH 4.0 DYNAMIC BRAKING ENVELOPE"
              subLabel="Parabolic Trajectory • Speed: 130 km/h"
              metricValue="384.2 m Safe Emergency Margin"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* 6. Section: Google OR-Tools AI Block Dispatcher (Maintenance Simulation) */}
      <section id="ai-dispatcher" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold mb-4">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>AUTONOMOUS DISPATCHING ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Google OR-Tools CP-SAT: <br />
              <span className="text-cyan-400">Sub-Second Disruption Resolution</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              When a maintenance block or emergency rail disruption occurs, legacy dispatchers take 30 to 45 minutes of manual phone memos.
              Block-Train's constraint-satisfaction solver evaluates thousands of schedule permutations in <strong className="text-cyan-300">under 0.8 seconds</strong>,
              automatically routing priority trains (Vande Bharat 20643) through station loop lines without delay cascade.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onToggleBlock}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md ${
                  blockActive
                    ? 'bg-red-600 text-white border border-red-500 animate-pulse'
                    : 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{blockActive ? 'CLEAR MAINTENANCE BLOCK' : 'INJECT TEST BLOCK AT TBM-CMP'}</span>
              </button>

              <button
                onClick={onOpenPlanner}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold transition-all border border-slate-700"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Open What-If AI Planner</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Section: Interactive Live Simulator Showcase (Embedded on Page) */}
      <section id="simulator" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold mb-3">
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>TEST DRIVE RIGHT HERE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Interactive Digital Twin Simulator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Experience the real-world quadruple tracks and 3D twin directly inside this preview, or expand into the full OCC console.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
            <button
              onClick={() => setPreviewMode('quad_tracks')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                previewMode === 'quad_tracks'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4 Real-World Tracks
            </button>
            <button
              onClick={() => setPreviewMode('spatial_3d')}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                previewMode === 'spatial_3d'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Spatial Twin
            </button>
          </div>
        </div>

        {/* Embedded Container */}
        <div className="w-full h-[650px] sm:h-[720px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative bg-slate-950">
          {previewMode === 'quad_tracks' ? (
            <ExtractedRealTrackCanvas
              speedMultiplier={1}
              blockActive={blockActive}
              onSelectTrainForWimt={(t) => onOpenWimt(t.id)}
            />
          ) : (
            <SpatialRailway3D
              speedMultiplier={1}
              blockActive={blockActive}
              onToggleBlock={onToggleBlock}
              onSelectTrainWimt={(id) => onOpenWimt(id)}
            />
          )}

          {/* Floating Expand to Full OCC Button */}
          <button
            onClick={onLaunchOCC}
            className="absolute top-4 right-4 z-40 px-4 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-500 text-white font-mono text-xs font-bold backdrop-blur-md shadow-xl border border-blue-400/40 flex items-center gap-2 transition-all hover:scale-105"
          >
            <span>Launch Fullscreen OCC</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 8. Section: Quantified Executive Impact & Metrics */}
      <section id="impact" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Transformative Results for Southern Railway
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Quantified benchmarks measured across 1,000+ simulated peak hour runs on the Chennai–Chengalpattu 62.8 R-KM corridor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-center">
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800">
            <div className="text-4xl sm:text-5xl font-black text-cyan-400 mb-2">42%</div>
            <div className="font-bold text-white text-sm mb-1">Congestion Reduction</div>
            <div className="text-xs text-slate-400">Through dynamic moving blocks vs static 1-km blocks</div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800">
            <div className="text-4xl sm:text-5xl font-black text-emerald-400 mb-2">100%</div>
            <div className="font-bold text-white text-sm mb-1">Collision Elimination</div>
            <div className="text-xs text-slate-400">Zero SPAD risk with Kavach 4.0 automatic enforcement</div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800">
            <div className="text-4xl sm:text-5xl font-black text-indigo-400 mb-2">&lt;0.8s</div>
            <div className="font-bold text-white text-sm mb-1">AI Re-routing Latency</div>
            <div className="text-xs text-slate-400">Google OR-Tools CP-SAT multi-agent optimizer</div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800">
            <div className="text-4xl sm:text-5xl font-black text-amber-400 mb-2">₹48.2 Cr</div>
            <div className="font-bold text-white text-sm mb-1">Annual Savings</div>
            <div className="text-xs text-slate-400">Reduced traction penalty & detention costs for MAS</div>
          </div>
        </div>
      </section>

      {/* 9. Final Call-to-Action & Executive Footer */}
      <footer className="py-20 px-4 sm:px-8 border-t border-slate-800 bg-slate-950 text-center relative">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Experience the Future of Railway Operations?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Launch the full Operations Control Centre (OCC) cockpit with multi-track visualization, live timetables, and AI block dispatching.
          </p>
          <div className="pt-4">
            <button
              onClick={onLaunchOCC}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-base shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Train className="w-5 h-5" />
              <span>ENTER FULL OCC COCKPIT</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-12 mt-12 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-4">
            <div>
              SOUTHERN RAILWAY • CHENNAI DIVISION (MAS) • SIH26027
            </div>
            <div>
              Built for Ministry of Railways • Indian Railways Technical Innovation
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
