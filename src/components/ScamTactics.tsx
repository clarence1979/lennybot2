import { Clock, UserCheck, Fish, CreditCard } from 'lucide-react';

interface TacticCardProps {
  icon: React.ReactNode;
  title: string;
  quote: string;
  badge: string;
  titleColor: string;
  badgeColor: string;
  threatLevel: string;
}

function TacticCard({ icon, title, quote, badge, titleColor, badgeColor, threatLevel }: TacticCardProps) {
  return (
    <div
      className="threat-card flex-1 rounded-xl overflow-hidden flex flex-col"
      style={{ background: '#0d1a2d', border: `1px solid ${badgeColor}33` }}
    >
      <div
        className="h-0.5 w-full"
        style={{ background: `linear-gradient(90deg, transparent, ${badgeColor}, transparent)` }}
      />
      <div className="flex flex-col items-center text-center p-5 gap-3 flex-1 relative">
        <div
          className="absolute top-2 right-2 text-xs terminal-text font-bold px-1.5 py-0.5 rounded"
          style={{ color: badgeColor, background: `${badgeColor}18`, border: `1px solid ${badgeColor}44`, fontSize: '9px' }}
        >
          THREAT LVL {threatLevel}
        </div>

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg mt-1"
          style={{
            background: `${badgeColor}15`,
            border: `2px solid ${badgeColor}50`,
            boxShadow: `0 0 20px ${badgeColor}25`,
          }}
        >
          {icon}
        </div>
        <h3
          className="text-sm font-black uppercase tracking-widest"
          style={{ color: titleColor, textShadow: `0 0 10px ${titleColor}66` }}
        >
          {title}
        </h3>
        <p
          className="text-xs italic leading-relaxed flex-1 terminal-text"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          &ldquo;{quote}&rdquo;
        </p>
        <div
          className="w-full py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1.5"
          style={{ background: `${badgeColor}18`, border: `1px solid ${badgeColor}55`, color: badgeColor }}
        >
          <span>&#9651;</span> {badge}
        </div>
      </div>
    </div>
  );
}

export function ScamTactics() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-4 sm:px-8 py-4 overflow-auto" style={{ background: '#0d1b2a' }}>
      <div className="w-full max-w-4xl flex flex-col gap-4">

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1">
            <div
              className="text-xs terminal-text mb-1"
              style={{ color: '#e63946', opacity: 0.7 }}
            >
              &#9888; THREAT INTELLIGENCE DATABASE — ACTIVE
            </div>
            <h2
              className="text-xl sm:text-2xl font-black uppercase tracking-wider glow-text-red"
              style={{ color: '#e63946' }}
            >
              Scam Tactics Detected
            </h2>
            <div
              className="text-xs terminal-text mt-1"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              $ scan --target=phone_scammers --output=tactics.log <span className="cursor-blink" style={{ background: '#e63946' }} />
            </div>
          </div>
          <div className="flex-shrink-0 relative">
            <img
              src="/scammer_graphic.webp"
              alt="Scammer illustration"
              style={{ height: '90px', width: 'auto', opacity: 0.9 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <TacticCard
            icon={<Clock className="w-6 h-6" style={{ color: '#e63946' }} />}
            title="False Urgency"
            quote="Act NOW or lose your account forever!"
            badge="Pressure Tactic"
            titleColor="#e63946"
            badgeColor="#e63946"
            threatLevel="HIGH"
          />
          <TacticCard
            icon={<UserCheck className="w-6 h-6" style={{ color: '#e6a817' }} />}
            title="Impersonation"
            quote="This is the ATO. You owe $4,200."
            badge="Fake Authority"
            titleColor="#e6a817"
            badgeColor="#e6a817"
            threatLevel="HIGH"
          />
          <TacticCard
            icon={<Fish className="w-6 h-6" style={{ color: '#38bdf8' }} />}
            title="Phishing"
            quote="Verify your details at this link..."
            badge="Data Theft"
            titleColor="#38bdf8"
            badgeColor="#38bdf8"
            threatLevel="CRIT"
          />
          <TacticCard
            icon={<CreditCard className="w-6 h-6" style={{ color: '#22c55e' }} />}
            title="Gift Card Scam"
            quote="Pay your fine with iTunes gift cards."
            badge="Payment Scam"
            titleColor="#22c55e"
            badgeColor="#22c55e"
            threatLevel="MED"
          />
        </div>

        <p className="text-center text-xs tracking-widest uppercase terminal-text" style={{ color: '#3d5a78' }}>
          // Play LennyBot to practise spotting all of these &mdash; teachingtools.dev/lennybot
        </p>
      </div>
    </div>
  );
}
