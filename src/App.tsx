import { useRef, useState, useEffect } from 'react';
import { useLennyBot } from './hooks/useLennyBot';
import { useAILenny } from './hooks/useAILenny';
import { AppHeader } from './components/AppHeader';
import { TabBar, type TabId } from './components/TabBar';
import { Controls } from './components/Controls';
import { StatusPanel } from './components/StatusPanel';
import { Stats } from './components/Stats';
import { EthicalNotice } from './components/EthicalNotice';
import { HowItWorks } from './components/HowItWorks';
import { ScamTactics } from './components/ScamTactics';
import { AboutTab } from './components/AboutTab';
import { MatrixRain } from './components/MatrixRain';
import { AlertCircle } from 'lucide-react';
import type { ConversationEntry } from './types';

function LogEntry({ entry }: { entry: ConversationEntry }) {
  return (
    <div
      className="flex items-start gap-3 px-4 py-2.5"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <span
        className="text-xs font-mono mt-0.5 flex-shrink-0 w-16 terminal-text"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        {entry.timestamp}
      </span>
      <span
        className="text-xs font-black uppercase tracking-wide mt-0.5 flex-shrink-0 w-16 terminal-text"
        style={{
          color: entry.speaker === 'scammer' ? '#e63946' : '#00b4a6',
          textShadow: entry.speaker === 'scammer'
            ? '0 0 8px rgba(230,57,70,0.6)'
            : '0 0 8px rgba(0,180,166,0.6)',
        }}
      >
        {entry.speaker === 'scammer' ? 'SCAMMER' : 'LENNY'}
      </span>
      <span className="leading-relaxed terminal-text text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
        {entry.text}
      </span>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('simulator');
  const [aiMode, setAiMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logBottomRef = useRef<HTMLDivElement>(null);

  const mp3Bot = useLennyBot(canvasRef);
  const aiBot = useAILenny(canvasRef);

  const bot = aiMode ? aiBot : mp3Bot;

  const {
    isRunning,
    isPlaying,
    isSpeaking,
    responseCount,
    turnCount,
    elapsedTime,
    conversationLog,
    statusText,
    volumeLevel,
    errorMessage,
    start,
    stop,
    reset,
  } = bot;

  const handleToggleAI = () => {
    if (!isRunning) {
      setAiMode(prev => !prev);
    }
  };

  useEffect(() => {
    logBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationLog]);

  return (
    <div
      className="flex flex-col"
      style={{ height: '100dvh', background: '#0d1b2a', overflow: 'hidden', position: 'relative' }}
    >
      <MatrixRain />

      <div className="relative flex flex-col" style={{ height: '100dvh', zIndex: 1 }}>
        <AppHeader />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 overflow-hidden relative">

          <div
            className="absolute inset-0 flex flex-col"
            style={{ display: activeTab === 'simulator' ? 'flex' : 'none' }}
          >
            <div
              className="relative w-full flex-shrink-0 overflow-hidden"
              style={{ height: '68px' }}
            >
              <img
                src="/hero_banner.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ opacity: 0.3 }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, rgba(10,21,32,0.97) 0%, rgba(0,180,166,0.07) 50%, rgba(10,21,32,0.97) 100%)',
                }}
              />
              <div className="scanlines absolute inset-0" />
              <div className="relative flex items-center justify-between h-full px-4 sm:px-8 max-w-2xl mx-auto w-full">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{
                        background: isRunning ? '#22c55e' : '#6b7280',
                        boxShadow: isRunning ? '0 0 6px #22c55e' : 'none',
                        animation: isRunning ? 'ping 1s cubic-bezier(0,0,0.2,1) infinite' : 'none',
                      }}
                    />
                    <span
                      className="text-xs terminal-text font-bold uppercase tracking-widest"
                      style={{ color: isRunning ? '#22c55e' : '#6b7280' }}
                    >
                      {isRunning ? 'SYSTEM ONLINE' : 'SYSTEM STANDBY'}
                    </span>
                  </div>
                  <p className="text-xs terminal-text" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {aiMode
                      ? '// AI_MODE=ENABLED — GPT-4o ACTIVE'
                      : '// MODE=MP3_PLAYBACK — 14 RESPONSES LOADED'}
                  </p>
                </div>
                <div className="text-xs terminal-text text-right" style={{ color: 'rgba(0,180,166,0.45)' }}>
                  <div>v2.1.0</div>
                  <div style={{ color: 'rgba(255,255,255,0.18)' }}>lennybot.exe</div>
                </div>
              </div>
            </div>

            <div
              className="flex-1 overflow-hidden flex flex-col px-4 sm:px-8 py-3"
              style={{ backdropFilter: 'blur(1px)' }}
            >
              <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 overflow-hidden">
                {errorMessage && (
                  <div
                    className="flex-shrink-0 flex items-start gap-3 p-3 rounded-xl mb-3"
                    style={{ background: 'rgba(230,57,70,0.12)', border: '1px solid rgba(230,57,70,0.3)' }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#e63946' }} />
                    <p className="text-xs terminal-text" style={{ color: '#e63946' }}>{errorMessage}</p>
                  </div>
                )}

                {aiMode && !isRunning && (
                  <div
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl mb-3 text-xs terminal-text"
                    style={{
                      background: 'rgba(14,165,233,0.08)',
                      border: '1px solid rgba(14,165,233,0.25)',
                      color: '#38bdf8',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse inline-block flex-shrink-0" />
                    AI_MODE=ON — GPT-4o generates contextual Lenny responses in real-time
                  </div>
                )}

                <div className="flex-shrink-0">
                  <Controls
                    isRunning={isRunning}
                    aiMode={aiMode}
                    onStart={start}
                    onStop={stop}
                    onReset={reset}
                    onToggleAI={handleToggleAI}
                  />
                </div>

                <div className="flex-shrink-0">
                  <StatusPanel
                    isRunning={isRunning}
                    isPlaying={isPlaying}
                    isSpeaking={isSpeaking}
                    statusText={statusText}
                    volumeLevel={volumeLevel}
                    canvasRef={canvasRef}
                  />
                </div>

                <div className="flex-shrink-0">
                  <Stats responseCount={responseCount} elapsedTime={elapsedTime} turnCount={turnCount} />
                </div>

                <div className="flex-1 min-h-0 flex flex-col">
                  <h3
                    className="flex-shrink-0 text-xs font-bold uppercase tracking-widest mb-2 terminal-text"
                    style={{ color: 'rgba(0,180,166,0.45)' }}
                  >
                    &gt; conversation_log.txt
                  </h3>
                  <div className="terminal-window flex-1 overflow-y-auto">
                    {conversationLog.length === 0 ? (
                      <div
                        className="flex items-center justify-center h-full min-h-[80px] text-xs terminal-text"
                        style={{ color: 'rgba(255,255,255,0.18)' }}
                      >
                        // awaiting input... <span className="cursor-blink" />
                      </div>
                    ) : (
                      <div>
                        {conversationLog.map(entry => (
                          <LogEntry key={entry.id} entry={entry} />
                        ))}
                        <div ref={logBottomRef} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 mt-3">
                  <EthicalNotice />
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute inset-0"
            style={{ display: activeTab === 'how-it-works' ? 'block' : 'none' }}
          >
            <HowItWorks />
          </div>

          <div
            className="absolute inset-0"
            style={{ display: activeTab === 'scam-tactics' ? 'block' : 'none' }}
          >
            <ScamTactics />
          </div>

          <div
            className="absolute inset-0"
            style={{ display: activeTab === 'about' ? 'block' : 'none' }}
          >
            <AboutTab />
          </div>
        </div>
      </div>
    </div>
  );
}
