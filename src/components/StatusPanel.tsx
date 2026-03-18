import { RefObject } from 'react';

interface StatusPanelProps {
  isRunning: boolean;
  isPlaying: boolean;
  isSpeaking: boolean;
  statusText: string;
  volumeLevel: number;
  canvasRef: RefObject<HTMLCanvasElement>;
}

function getDotConfig(isRunning: boolean, isPlaying: boolean, isSpeaking: boolean) {
  if (!isRunning) return { color: '#6b7280', pulse: false, label: 'OFFLINE', code: '//IDLE' };
  if (isPlaying) return { color: '#f97316', pulse: true, label: 'LENNY_SPEAKING', code: '//AUDIO_OUT' };
  if (isSpeaking) return { color: '#3b82f6', pulse: true, label: 'INPUT_DETECTED', code: '//VAD_ACTIVE' };
  return { color: '#22c55e', pulse: true, label: 'LISTENING', code: '//MONITORING' };
}

export function StatusPanel({
  isRunning,
  isPlaying,
  isSpeaking,
  statusText,
  volumeLevel,
  canvasRef,
}: StatusPanelProps) {
  const dot = getDotConfig(isRunning, isPlaying, isSpeaking);
  const volColor = isPlaying ? '#f97316' : isSpeaking ? '#3b82f6' : '#22c55e';

  return (
    <div
      className="terminal-window scanlines mb-3"
    >
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#ffbd2e' }} />
        <span className="terminal-dot" style={{ background: '#28ca41' }} />
        <span className="ml-2 text-xs terminal-text" style={{ color: 'rgba(0,180,166,0.55)' }}>
          audio_monitor.sh
        </span>
        <span className="ml-auto flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            {dot.pulse && (
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75"
                style={{ background: dot.color }}
              />
            )}
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ background: dot.color }}
            />
          </span>
          <span className="text-xs terminal-text font-bold" style={{ color: dot.color }}>
            {dot.label}
          </span>
          <span className="text-xs terminal-text" style={{ color: 'rgba(255,255,255,0.2)' }}>
            {dot.code}
          </span>
        </span>
      </div>

      <div
        className="px-3 py-1.5 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(0,180,166,0.1)' }}
      >
        <span className="text-xs terminal-text" style={{ color: '#22c55e' }}>$</span>
        <span className="text-xs terminal-text truncate flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {statusText}
        </span>
      </div>

      <div className="px-3 pt-2 pb-1">
        <canvas
          ref={canvasRef}
          width={640}
          height={60}
          className="w-full rounded"
          style={{ height: '42px', background: 'rgba(0,0,0,0.3)' }}
        />
      </div>

      <div className="px-3 pb-2.5">
        <div className="flex items-center gap-3">
          <span className="text-xs terminal-text w-16 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }}>
            SIG_LVL
          </span>
          <div
            className="flex-1 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-75"
              style={{
                width: `${Math.min(100, volumeLevel)}%`,
                background: `linear-gradient(90deg, ${volColor}88, ${volColor})`,
                boxShadow: volumeLevel > 20 ? `0 0 8px ${volColor}88` : 'none',
              }}
            />
          </div>
          <span className="text-xs terminal-text w-8 text-right flex-shrink-0" style={{ color: volColor }}>
            {Math.round(volumeLevel)}%
          </span>
        </div>
      </div>
    </div>
  );
}
