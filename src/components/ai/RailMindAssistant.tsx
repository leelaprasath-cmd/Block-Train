import React, { useState } from 'react';
import { useRailwaySimulation } from '../../context/RailwaySimulationContext';
import {
  Bot,
  Sparkles,
  Send,
  User,
  ArrowRight,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'AI' | 'USER';
  timestamp: string;
  text: string;
  actionButton?: {
    label: string;
    view: 'MAP' | 'PLANNER';
  };
}

export const RailMindAssistant: React.FC = () => {
  const { setActiveView, trains, maintenanceBlocks } = useRailwaySimulation();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-01',
      sender: 'AI',
      timestamp: '15:00:10',
      text: "Namaste Controller. I am RailMind AI, your Southern Railway operational decision-support copilot. I am continuously monitoring all 6 rakes, track circuits, and active maintenance blocks between Tambaram and Chennai Central. How can I assist your dispatch decisions?",
    },
    {
      id: 'MSG-02',
      sender: 'USER',
      timestamp: '15:01:05',
      text: 'What is the current risk profile on Down Main between Tambaram and Chromepet?',
    },
    {
      id: 'MSG-03',
      sender: 'AI',
      timestamp: '15:01:08',
      text: "Track TRK-TBM-CMP-DN is currently closed under OHE Maintenance Permit 089. Approaching Pandian Superfast (12638) was autonomously re-routed via the Fast Express Corridor, preventing a projected 14.5-minute cascading delay. Kavach anti-collision signal link is locked at 98%. Corridor safety score is 100%.",
      actionButton: {
        label: 'View Digital Twin Map',
        view: 'MAP',
      },
    },
  ]);

  const promptPills = [
    'Recommend optimal 2-hour window between TBM and CMP',
    'Assess collision risk for Vande Bharat 20643',
    'Explain cascading delay savings from today’s blocks',
    'What is the headway clearance at Guindy station?',
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `USR-${Date.now()}`,
      sender: 'USER',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      text: textToSend.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let aiResponseText = '';
      let actionBtn: ChatMessage['actionButton'] = undefined;

      const lower = textToSend.toLowerCase();
      if (lower.includes('window') || lower.includes('recommend') || lower.includes('tbm')) {
        aiResponseText = `AI Recommendation: Analysis of timetable graphs reveals a 90-minute operational lull between 15:30 and 17:00 IST on Down Main. Initiating track tamping here will impact only 2 suburban EMUs with minor loop crossovers, saving 16.8 minutes of peak-hour commuter delay.`;
        actionBtn = {
          label: 'Open AI Block Planner',
          view: 'PLANNER',
        };
      } else if (lower.includes('vande bharat') || lower.includes('20643') || lower.includes('collision')) {
        aiResponseText = `Vande Bharat 20643 is running at 124 km/h on the Fast Line with 0 minutes delay. Kavach TCAS is actively transmitting position vectors every 50ms. Next signal aspect is Double Yellow (Caution advisory). Safe braking distance is calculated at 420 meters, well within track margins.`;
        actionBtn = {
          label: 'Inspect on Digital Twin',
          view: 'MAP',
        };
      } else if (lower.includes('delay') || lower.includes('savings')) {
        aiResponseText = `Corridor Punctuality is maintained at 99.4%. Today's autonomous dynamic block replanning has eliminated 37.5 cumulative minutes of cascading delay across the Chennai division and conserved approximately 220 liters of traction diesel/energy equivalents.`;
      } else {
        aiResponseText = `Understood. Live corridor telemetry indicates all systems normal. Active blocks: ${
          maintenanceBlocks.filter(b => b.status === 'ACTIVE').length
        }, Online rakes: ${trains.length}. All automatic block signals operating under nominal aspects.`;
      }

      const aiMsg: ChatMessage = {
        id: `AI-${Date.now()}`,
        sender: 'AI',
        timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
        text: aiResponseText,
        actionButton: actionBtn,
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="w-full min-h-[calc(100vh-108px)] bg-[#060a15] text-slate-200 p-4 lg:p-8 font-mono overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Bot className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                RAILMIND AI COPILOT // DISPATCH DECISION ENGINE
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Trained on Indian Railway Operating Manual (G&SR), automated block optimization rules, and Southern Railway corridor graphs.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-purple-950/30 px-3 py-1.5 rounded-lg border border-purple-500/30 text-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>LLM Decision-Support Active</span>
          </div>
        </div>

        {/* Prompt Suggestion Pills */}
        <div>
          <span className="text-[11px] text-slate-500 uppercase tracking-wider block mb-2 font-bold">
            Recommended Operational Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {promptPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(pill)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 text-xs font-sans transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>{pill}</span>
                <ArrowRight className="w-3 h-3 text-purple-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message Thread */}
        <div className="bg-[#0b1222] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 min-h-[440px] max-h-[500px] overflow-y-auto">
          {messages.map(msg => {
            const isAI = msg.sender === 'AI';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isAI ? 'items-start' : 'items-start flex-row-reverse'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isAI
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-xl p-4 rounded-2xl ${
                    isAI
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                      : 'bg-blue-600 text-white font-sans'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400 font-mono">
                    <span className="font-bold text-purple-300">
                      {isAI ? 'RAILMIND INTELLIGENCE' : 'CONTROLLER'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="font-sans text-xs">{msg.text}</p>

                  {msg.actionButton && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800">
                      <button
                        onClick={() => setActiveView(msg.actionButton!.view)}
                        className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                      >
                        <span>{msg.actionButton.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask RailMind about corridor status, speed limits, block conflicts, or alternate routings..."
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-sans shadow-inner"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.4)]"
          >
            <Send className="w-4 h-4" />
            <span>SUBMIT</span>
          </button>
        </form>
      </div>
    </div>
  );
};
