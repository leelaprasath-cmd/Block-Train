export const DashboardHUD = ({ time }: { time: string }) => {
  return (
    <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-2 z-50 select-none">
      <h1 className="text-3xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
        BLOCK<span className="text-blue-600">TRAIN</span> <span className="text-slate-500 text-lg font-bold tracking-normal">DIGITAL TWIN</span>
      </h1>
      <div className="flex flex-wrap gap-3">
        <div className="text-slate-800 font-mono text-sm font-bold uppercase tracking-widest bg-white/95 px-4 py-2 rounded-xl border border-slate-200/90 w-fit backdrop-blur-md shadow-lg flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE • {time || '15:00:00'}</span>
        </div>
        <div className="text-slate-600 font-mono text-xs font-bold uppercase tracking-widest bg-white/95 px-4 py-2 rounded-xl border border-slate-200/90 w-fit backdrop-blur-md shadow-lg flex flex-col justify-center">
          SOUTHERN RAILWAY ZONE
        </div>
      </div>
    </div>
  );
};
