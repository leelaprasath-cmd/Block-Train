import React from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import { ActiveView } from '../../types/railway';
import {
  Map,
  CalendarCheck,
  ShieldAlert,
  Radio,
  Bot,
  Award,
} from 'lucide-react';

interface NavItem {
  id: ActiveView;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ViewNavigation: React.FC = () => {
  const { activeView, setActiveView, maintenanceBlocks, workerCrews } = useRailwaySimulation();

  const pendingBlocksCount = maintenanceBlocks.filter(b => b.status === 'PENDING').length;
  const criticalWorkersCount = workerCrews.filter(w => w.warningStatus !== 'NORMAL').length;

  const navItems: NavItem[] = [
    { id: 'MAP', label: 'Digital Twin Map', icon: Map },
    {
      id: 'PLANNER',
      label: 'AI Block Planner',
      badge: pendingBlocksCount > 0 ? `${pendingBlocksCount} Req` : undefined,
      icon: CalendarCheck,
    },
    {
      id: 'WORKERS',
      label: 'Worker Safety (Rakshak)',
      badge: criticalWorkersCount > 0 ? 'Warning' : undefined,
      icon: ShieldAlert,
    },
    { id: 'DISPATCH', label: 'Radio & SMS Dispatch', icon: Radio },
    { id: 'AI_COPILOT', label: 'RailMind Copilot', icon: Bot },
    { id: 'PITCH_DECK', label: 'SIH Pitch & Architecture', badge: 'SIH26027', icon: Award },
  ];

  return (
    <nav className="w-full bg-[#080d19] border-b border-slate-800 px-4 py-2 flex items-center justify-between overflow-x-auto no-scrollbar z-30">
      <div className="flex items-center gap-1.5 min-w-max">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                    item.badge === 'Warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      : item.badge === 'SIH26027'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Corridor Quick Tip for Hackathon Judges */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800/80">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Click any track on map to toggle maintenance block • Click trains for live telemetry HUD</span>
      </div>
    </nav>
  );
};
