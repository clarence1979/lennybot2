interface StatItemProps {
  value: string;
  label: string;
  sublabel: string;
  valueColor?: string;
}

function StatItem({ value, label, sublabel, valueColor = '#ffffff' }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-3">
      <span className="text-2xl sm:text-3xl font-black leading-none" style={{ color: valueColor }}>
        {value}
      </span>
      <span className="text-xs font-bold uppercase tracking-widest mt-1 text-white">{label}</span>
      <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>{sublabel}</span>
    </div>
  );
}

export function AboutTab() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 px-4 sm:px-8 py-4 overflow-hidden">

        <div className="flex items-end gap-4 flex-shrink-0">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(0,180,166,0.25) 0%, transparent 70%)',
                transform: 'scale(1.4)',
              }}
            />
            <img
              src="/lenny_character.webp"
              alt="Lenny the scam-baiting old man"
              className="relative"
              style={{ width: '140px', height: 'auto', filter: 'drop-shadow(0 0 16px rgba(0,180,166,0.4))' }}
            />
          </div>

          <div className="relative mb-4">
            <div
              className="w-52 sm:w-60 rounded-2xl p-3 shadow-2xl"
              style={{
                background: 'rgba(10, 21, 32, 0.95)',
                border: '1px solid rgba(0,180,166,0.35)',
                boxShadow: '0 0 20px rgba(0,180,166,0.15)',
              }}
            >
              <div
                className="absolute -left-3 top-6 w-0 h-0"
                style={{
                  borderTop: '7px solid transparent',
                  borderBottom: '7px solid transparent',
                  borderRight: '13px solid rgba(0,180,166,0.35)',
                }}
              />
              <p className="text-sm font-bold terminal-text leading-snug" style={{ color: '#00b4a6' }}>
                &gt; Lenny here! How can I help you today?
              </p>
              <p className="text-xs mt-1 terminal-text" style={{ color: 'rgba(255,255,255,0.4)' }}>
                // Wasting scammers' time since 2011 <span className="cursor-blink" />
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-center">
            <div
              className="relative"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0,180,166,0.5))',
              }}
            >
              <img
                src="/shield_icon.webp"
                alt="Security shield"
                style={{ width: '96px', height: 'auto' }}
              />
            </div>
            <p className="text-xs font-black tracking-widest mt-1.5 uppercase terminal-text glow-text-teal" style={{ color: '#e6a817' }}>
              Scam-Proof
            </p>
          </div>

          <div className="flex flex-col items-center mb-4">
            <span className="text-3xl font-black mb-1 glow-text-red" style={{ color: '#e63946' }}>✕</span>
            <img
              src="/scammer_graphic.webp"
              alt="Scammer"
              style={{ width: '56px', height: 'auto', opacity: 0.8 }}
            />
          </div>
        </div>

        <div
          className="terminal-window flex-1 max-w-xs p-4 sm:p-5"
        >
          <div className="terminal-titlebar -mx-4 -mt-4 mb-4 sm:-mx-5 sm:-mt-5 sm:mb-4">
            <span className="terminal-dot" style={{ background: '#ff5f57' }} />
            <span className="terminal-dot" style={{ background: '#ffbd2e' }} />
            <span className="terminal-dot" style={{ background: '#28ca41' }} />
            <span className="ml-2 text-xs terminal-text" style={{ color: 'rgba(0,180,166,0.5)' }}>
              about_lennybot.md
            </span>
          </div>

          <h3 className="text-sm font-black uppercase tracking-widest mb-3 terminal-text glow-text-teal" style={{ color: '#00b4a6' }}>
            $ cat README.md
          </h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
            LennyBot is a scam-baiting simulator based on the real &ldquo;Lenny&rdquo; recordings — a
            set of automated audio responses designed to waste phone scammers&apos; time.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            You play the role of the scammer. Lenny responds when you stop talking — confusing you
            with friendly, rambling conversation. This tool helps students recognise and defend
            against social engineering tactics.
          </p>
        </div>
      </div>

      <div
        className="flex-shrink-0"
        style={{ background: 'rgba(0,137,123,0.85)', borderTop: '1px solid rgba(0,180,166,0.3)', backdropFilter: 'blur(10px)' }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row divide-y sm:divide-y-0 divide-white/20">
          <StatItem value="100%" label="Free to Use" sublabel="No signup needed" />
          <div className="hidden sm:block w-px self-stretch" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <StatItem value="7–12" label="Year Levels" sublabel="Secondary school ready" valueColor="#e6a817" />
          <div className="hidden sm:block w-px self-stretch" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <StatItem value="Real" label="Scam Scenarios" sublabel="Based on actual tactics" />
          <div className="hidden sm:block w-px self-stretch" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <StatItem value="Vic" label="Curriculum Aligned" sublabel="Digital Technologies strand" valueColor="#e6a817" />
        </div>
        <p className="text-center text-xs pb-2 terminal-text" style={{ color: 'rgba(255,255,255,0.4)' }}>
          // Plenty Valley Christian College &middot; teachingtools.dev/lennybot
        </p>
      </div>
    </div>
  );
}
