import { Mic, BookOpen, Shield, Info } from 'lucide-react';

export type TabId = 'simulator' | 'how-it-works' | 'scam-tactics' | 'about';

interface Tab {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  accentColor: string;
}

const TABS: Tab[] = [
  {
    id: 'simulator',
    label: 'Simulator',
    shortLabel: 'Play',
    icon: <Mic className="w-4 h-4" />,
    accentColor: '#00b4a6',
  },
  {
    id: 'how-it-works',
    label: 'How It Works',
    shortLabel: 'How',
    icon: <Info className="w-4 h-4" />,
    accentColor: '#e6a817',
  },
  {
    id: 'scam-tactics',
    label: 'Scam Tactics',
    shortLabel: 'Tactics',
    icon: <Shield className="w-4 h-4" />,
    accentColor: '#e63946',
  },
  {
    id: 'about',
    label: 'About',
    shortLabel: 'About',
    icon: <BookOpen className="w-4 h-4" />,
    accentColor: '#a78bfa',
  },
];

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="flex-shrink-0 flex"
      style={{
        height: '48px',
        background: '#0d1b2a',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wide transition-all duration-150 relative"
            style={{
              color: isActive ? tab.accentColor : 'rgba(255,255,255,0.35)',
              background: isActive ? 'rgba(255,255,255,0.04)' : 'transparent',
            }}
          >
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: tab.accentColor }}
              />
            )}
            <span className="flex-shrink-0">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
