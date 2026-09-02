import React, { useState } from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import { RadioMessage } from '../../types/railway';
import {
  Radio,
  Mic,
  Send,
  Volume2,
  Play,
  Signal,
  Clock,
} from 'lucide-react';

export const VoiceDispatchConsole: React.FC = () => {
  const { radioMessages, broadcastRadioMessage } = useRailwaySimulation();

  const [activeChannel, setActiveChannel] = useState<RadioMessage['channel']>('CHANNEL_1_URGENT');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // Quick dispatch presets
  const quickDispatches = [
    { label: '⚠️ Issue 30 km/h Caution Order', text: 'All trains between Tambaram and Chromepet: Observe 30 km/h speed limit due to ongoing track packing.' },
    { label: '⚡ OHE Power Block Isolated', text: 'Electrical control to Gang 14: Down main catenary power block isolated and earthed. Maintenance authorized.' },
    { label: '🟢 Track Fit Certificate Received', text: 'P-Way SSE to Station Master: Track 3 tamping complete. Track declared fit for 110 km/h operation.' },
    { label: '🚨 Immediate Clear Corridor Order', text: 'Emergency Dispatch: Non-scheduled rake approaching. All maintenance teams clear track safe distance immediately!' },
  ];

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    broadcastRadioMessage(customMessage.trim(), activeChannel, 'Controller Desk 4');
    setCustomMessage('');
  };

  const handleSimulateAudioPlay = (msgId: string) => {
    setIsPlayingAudioId(msgId);
    setTimeout(() => {
      setIsPlayingAudioId(null);
    }, 3000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-[#060a15] text-slate-200 p-4 lg:p-8 font-mono overflow-y-auto">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
                <Radio className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                RADIO VOICE DISPATCH & EMERGENCY BROADCAST CONSOLE
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Instantaneous multi-channel digitized VHF/UHF railway radio communication, automated synthetic speech broadcast, and dispatch telemetry logs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-bold">SOUTHERN RAILWAY RADIO NETWORK ONLINE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Radio Transmitter & Waveform Console */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" />
                VHF Channel Selection
              </h3>
              <span className="text-xs text-cyan-300 font-bold flex items-center gap-1">
                <Signal className="w-3.5 h-3.5" /> 161.150 MHz
              </span>
            </div>

            {/* Channel Tabs */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: 'CHANNEL_1_URGENT', label: 'CH 1: Urgent Emergency' },
                { id: 'CHANNEL_2_LOCO', label: 'CH 2: Loco Pilot Cab' },
                { id: 'CHANNEL_3_GANG', label: 'CH 3: P-Way / OHE Gangs' },
                { id: 'CHANNEL_4_STATION', label: 'CH 4: Station Intercom' },
              ].map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id as RadioMessage['channel'])}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    activeChannel === ch.id
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)] font-bold'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>

            {/* Audio Waveform Oscilloscope Simulator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">
                RF CARRIER FREQUENCY OSCILLOSCOPE
              </span>
              <div className="flex items-center gap-1.5 h-16 w-full justify-center">
                {[20, 45, 75, 30, 90, 60, 40, 85, 100, 70, 50, 95, 35, 65, 80, 50, 30, 60, 90, 40].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-blue-600 to-cyan-300 rounded-full transition-all duration-150 animate-pulse"
                      style={{
                        height: isPlayingAudioId ? `${Math.min(100, height + Math.random() * 20)}%` : `${Math.max(15, height * 0.35)}%`,
                        animationDelay: `${i * 40}ms`,
                      }}
                    />
                  )
                )}
              </div>
              <span className="text-[10px] text-cyan-400 font-mono mt-2">
                {isPlayingAudioId ? 'TRANSMITTING VOCODER SYNTHESIS...' : 'CARRIER STANDBY • SQUELCH ACTIVE'}
              </span>
            </div>

            {/* Quick Dispatch Presets */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-wider">
                Instant One-Click Dispatches:
              </label>
              <div className="space-y-2">
                {quickDispatches.map((qd, idx) => (
                  <button
                    key={idx}
                    onClick={() => broadcastRadioMessage(qd.text, activeChannel, 'Chief Controller')}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-all font-sans flex items-center justify-between"
                  >
                    <span>{qd.label}</span>
                    <Send className="w-3 h-3 text-blue-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Dispatch Form */}
            <form onSubmit={handleSendCustomMessage} className="pt-2 border-t border-slate-800">
              <label className="block text-slate-400 text-[11px] mb-1.5 font-bold uppercase tracking-wider">
                Custom Broadcast Dispatch:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type message to broadcast to train cab / track gang..."
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>TRANSMIT</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Transmission Log */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Live Radio Transmission Log ({radioMessages.length})
              </h3>
              <span className="text-[11px] text-slate-500">Auto-Archived with Timestamp</span>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {radioMessages.map(msg => {
                const isPlaying = isPlayingAudioId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl border transition-all ${
                      msg.isUrgent
                        ? 'bg-red-950/20 border-red-500/40'
                        : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300 font-mono">
                          {msg.sender}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {msg.channel.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {msg.timestamp} IST
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-sans leading-relaxed mb-3">
                      "{msg.transcription}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                      <button
                        onClick={() => handleSimulateAudioPlay(msg.id)}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono text-[11px]"
                      >
                        {isPlaying ? (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                            <span className="text-cyan-300 font-bold">PLAYING AUDIO...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Play Synthetic Radio Audio ({msg.audioDurationSec}s)</span>
                          </>
                        )}
                      </button>

                      <span className="text-slate-500 text-[10px]">
                        SMS Broadcast Sent ✓
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
