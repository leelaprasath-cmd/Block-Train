export const SpeedController = ({ speed, setSpeed }: { speed: number, setSpeed: (s: number) => void }) => {
  const speeds = [1, 2, 5, 10];
  
  return (
    <div className="absolute top-6 right-6 z-50 flex items-center gap-1.5 bg-white/95 p-1.5 rounded-xl border border-slate-200/90 backdrop-blur-md shadow-lg pointer-events-auto select-none font-mono">
      <div className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center px-2.5 border-r border-slate-200">
        SIM SPEED
      </div>
      <div className="flex items-center gap-1">
        {speeds.map(s => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              speed === s 
                ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
};
