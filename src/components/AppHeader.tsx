import { Bot } from 'lucide-react';
import digivecLogo from '../assets/digivec_logo.png';
import claSolLogo from '../assets/cla_sol.png';

export function AppHeader() {
  return (
    <header
      className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6"
      style={{
        height: '64px',
        background: '#0a1520',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #00897b, #00b4a6)' }}
        >
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-black text-white tracking-tight">LennyBot</span>
          <span
            className="hidden sm:inline text-xs font-bold uppercase tracking-widest"
            style={{ color: '#00b4a6' }}
          >
            Scam-Baiting Simulator
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <span
          className="hidden md:inline text-xs mr-1"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          Years 7–12
        </span>

        <div
          className="flex items-center px-1.5 py-1 rounded-lg flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <img
            src={claSolLogo}
            alt="Clarence's Solutions"
            className="block"
            style={{ height: '30px', width: 'auto', borderRadius: '4px' }}
          />
        </div>

        <div className="flex items-center flex-shrink-0">
          <img
            src={digivecLogo}
            alt="Digital Vector"
            className="block rounded-lg"
            style={{ height: '38px', width: 'auto' }}
          />
        </div>
      </div>
    </header>
  );
}
