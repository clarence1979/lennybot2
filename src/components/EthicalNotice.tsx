import { AlertTriangle } from 'lucide-react';

export function EthicalNotice() {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-xl"
      style={{ background: 'rgba(230,169,23,0.1)', border: '1px solid rgba(230,169,23,0.3)' }}
    >
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#e6a817' }} />
      <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        <strong style={{ color: '#e6a817' }}>Educational Use Only.</strong> This tool is for understanding
        social engineering defences. Never use to harass or deceive real people.
      </p>
    </div>
  );
}
