export interface ConversationEntry {
  id: string;
  timestamp: string;
  speaker: 'scammer' | 'lenny';
  text: string;
}

export interface LennyAudio {
  url: string;
  label: string;
}
