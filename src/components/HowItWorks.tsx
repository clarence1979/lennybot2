import { Mic, Bot, BookOpen } from 'lucide-react';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
  command: string;
}

function Step({ number, icon, title, description, accentColor, command }: StepProps) {
  return (
    <div className="terminal-window flex-1 flex flex-col">
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#ffbd2e' }} />
        <span className="terminal-dot" style={{ background: '#28ca41' }} />
        <span className="ml-2 text-xs terminal-text" style={{ color: 'rgba(0,180,166,0.6)' }}>
          step_{number}.sh
        </span>
        <span className="ml-auto text-xs terminal-text" style={{ color: 'rgba(255,255,255,0.2)' }}>
          PID {100 + number}
        </span>
      </div>

      <div className="flex flex-col items-center text-center p-5 flex-1 relative">
        <div
          className="absolute top-3 right-3 text-xs terminal-text font-bold"
          style={{ color: accentColor, opacity: 0.4 }}
        >
          [{String(number).padStart(2, '0')}]
        </div>

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
          style={{
            background: `${accentColor}15`,
            border: `2px solid ${accentColor}50`,
            boxShadow: `0 0 18px ${accentColor}30`,
          }}
        >
          {icon}
        </div>

        <div
          className="text-xs terminal-text mb-3 px-3 py-1 rounded"
          style={{ background: 'rgba(0,0,0,0.5)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
        >
          $ {command}
        </div>

        <h3 className="text-sm font-black uppercase tracking-widest mb-2" style={{ color: '#ffffff' }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: '#8da4bf' }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div
      className="h-full flex flex-col items-center justify-center px-4 sm:px-8 py-4 overflow-auto"
      style={{ background: '#0f2035' }}
    >
      <div className="w-full max-w-4xl flex flex-col gap-4">

        <div className="rounded-xl overflow-hidden relative" style={{ height: '110px' }}>
          <img
            src="/terminal_banner.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.5 }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(10,21,32,0.9) 0%, rgba(0,180,166,0.12) 100%)' }}
          />
          <div className="scanlines absolute inset-0" />
          <div className="relative flex flex-col items-center justify-center h-full gap-1.5">
            <h2
              className="text-xl sm:text-2xl font-black uppercase tracking-wider terminal-text glow-text-teal"
              style={{ color: '#00b4a6' }}
            >
              &gt; HOW_IT_WORKS.exe
            </h2>
            <p className="text-xs terminal-text" style={{ color: 'rgba(255,255,255,0.4)' }}>
              INITIALISING SCAM-BAIT PROTOCOL... <span className="cursor-blink" />
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <Step
            number={1}
            icon={<Mic className="w-7 h-7" style={{ color: '#00b4a6' }} />}
            title="You Speak"
            description="Press Start, allow mic access, then speak — pretend you're a scammer with a convincing script."
            accentColor="#00b4a6"
            command="./start_microphone.sh"
          />
          <div className="hidden sm:flex items-center justify-center flex-shrink-0">
            <svg width="28" height="16" viewBox="0 0 36 20">
              <path d="M 0 10 L 28 10 L 20 2 M 28 10 L 20 18" stroke="#e6a817" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Step
            number={2}
            icon={<Bot className="w-7 h-7" style={{ color: '#e6a817' }} />}
            title="Lenny Responds"
            description="When you stop talking, LennyBot responds — confusing you with friendly, rambling conversation."
            accentColor="#e6a817"
            command="./lenny_respond.sh"
          />
          <div className="hidden sm:flex items-center justify-center flex-shrink-0">
            <svg width="28" height="16" viewBox="0 0 36 20">
              <path d="M 0 10 L 28 10 L 20 2 M 28 10 L 20 18" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <Step
            number={3}
            icon={<BookOpen className="w-7 h-7" style={{ color: '#22c55e' }} />}
            title="Spot Tactics"
            description="Learn real psychological tricks scammers use — false urgency, impersonation, phishing and more."
            accentColor="#22c55e"
            command="./identify_tactics.sh"
          />
        </div>

        <p className="text-center text-xs tracking-widest uppercase terminal-text" style={{ color: '#3d5a78' }}>
          // Cybersecurity Education &middot; teachingtools.dev/lennybot
        </p>
      </div>
    </div>
  );
}
