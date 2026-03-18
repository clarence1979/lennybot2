import { Play, Square, RotateCcw, Sparkles } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  aiMode: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onToggleAI: () => void;
}

export function Controls({ isRunning, aiMode, onStart, onStop, onReset, onToggleAI }: ControlsProps) {
  return (
    <div className="flex flex-col gap-3 mb-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onStart}
          disabled={isRunning}
          className="flex-1 flex items-center justify-center gap-2 px-5 rounded-xl font-bold text-sm transition-all duration-200 min-h-[52px]"
          style={
            isRunning
              ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed' }
              : { background: '#00897b', color: '#ffffff', boxShadow: '0 4px 15px rgba(0,180,166,0.35)' }
          }
        >
          <Play className="w-4 h-4" />
          Start Conversation
        </button>

        <button
          onClick={onStop}
          disabled={!isRunning}
          className="flex-1 flex items-center justify-center gap-2 px-5 rounded-xl font-bold text-sm transition-all duration-200 min-h-[52px]"
          style={
            !isRunning
              ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.25)', cursor: 'not-allowed' }
              : { background: '#c0392b', color: '#ffffff', boxShadow: '0 4px 15px rgba(192,57,43,0.35)' }
          }
        >
          <Square className="w-4 h-4" />
          Stop
        </button>

        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-5 rounded-xl font-bold text-sm transition-all duration-200 min-h-[52px]"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      <button
        onClick={onToggleAI}
        disabled={isRunning}
        className="w-full flex items-center justify-center gap-2 px-5 rounded-xl font-bold text-sm transition-all duration-200 min-h-[44px]"
        style={
          isRunning
            ? { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.08)' }
            : aiMode
            ? {
                background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                color: '#ffffff',
                boxShadow: '0 4px 18px rgba(14,165,233,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
              }
            : {
                background: 'rgba(14,165,233,0.1)',
                color: '#38bdf8',
                border: '1px solid rgba(14,165,233,0.3)',
              }
        }
      >
        <Sparkles className="w-4 h-4" />
        {aiMode ? 'AI Mode: ON — Disable' : 'Enable AI Mode'}
        {aiMode && (
          <span
            className="ml-1 text-xs font-normal opacity-80"
          >
            (Live AI responses)
          </span>
        )}
      </button>
    </div>
  );
}
