import { MessageSquare, Clock, RefreshCw } from 'lucide-react';

interface StatsProps {
  responseCount: number;
  elapsedTime: string;
  turnCount: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
}

function StatCard({ icon, label, value, accentColor }: StatCardProps) {
  return (
    <div
      className="flex-1 rounded-xl p-4 text-center"
      style={{ background: '#1a2744', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2"
        style={{ background: `${accentColor}22`, border: `1px solid ${accentColor}44` }}
      >
        {icon}
      </div>
      <div
        className="text-2xl font-black tabular-nums leading-tight"
        style={{ color: '#ffffff' }}
      >
        {value}
      </div>
      <div className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {label}
      </div>
    </div>
  );
}

export function Stats({ responseCount, elapsedTime, turnCount }: StatsProps) {
  return (
    <div className="flex gap-3 mb-3">
      <StatCard
        icon={<MessageSquare className="w-4 h-4" style={{ color: '#00b4a6' }} />}
        label="Lenny Responses"
        value={responseCount}
        accentColor="#00b4a6"
      />
      <StatCard
        icon={<Clock className="w-4 h-4" style={{ color: '#e6a817' }} />}
        label="Time Wasted"
        value={elapsedTime}
        accentColor="#e6a817"
      />
      <StatCard
        icon={<RefreshCw className="w-4 h-4" style={{ color: '#e63946' }} />}
        label="Turns"
        value={turnCount}
        accentColor="#e63946"
      />
    </div>
  );
}
