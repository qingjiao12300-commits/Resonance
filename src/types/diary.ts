export type EntryType = 'text' | 'photo' | 'ai_chat' | 'friend_chat';

export interface DiaryEntry {
  id: string;
  content: string;
  type: EntryType;
  timestamp: number;
  date: string; // YYYY-MM-DD
  isPrivate?: boolean; // Private mode entries
  metadata?: {
    imageUrl?: string;
    chatHistory?: { role: 'user' | 'ai' | 'friend'; content: string }[];
    friendName?: string;
  };
}

export interface EchoMatch {
  originalEntryId: string;
  matchedEntry: DiaryEntry;
  summary: string; // Reflective summary shown on card
  reason: string;
  isComplementary?: boolean; // 新增：是否能量互补
}

export interface ResonanceMatch {
  id: string;
  originalEntryId: string;
  visualTag: string;
  processedContent: string;
  moodColor: string;
  timestamp: string;
  isReencounter?: boolean;
  isComplementary?: boolean; // 新增：是否能量互补
}
