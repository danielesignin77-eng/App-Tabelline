
export type TabellinaId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'mixed';

export type ThemeId = 'wizard' | 'princess' | 'robot' | 'soccer';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  mentorName: string;
  mentorEmoji: string;
  bgGradient: string; // Tailwind gradient classes
  primaryColor: string; // Main UI color (headers, buttons)
  secondaryColor: string; // Accents
  accentText: string; // For highlighting text
  coinSymbol: string;
}

export interface UserProfile {
  name: string;
  themeId: ThemeId; // Selected theme
  avatar: AvatarConfig;
  xp: number;
  level: number;
  coins: number;
  unlockedItems: string[]; // IDs of unlocked cosmetics
  progress: Record<string, TabellinaProgress>; // Key is TabellinaId
}

export interface TabellinaProgress {
  stars: number; // 0-3
  highScore: number;
  isUnlocked: boolean;
}

export interface AvatarConfig {
  baseColor: string;
  accessory: string;
  expression: string;
}

export interface Question {
  factorA: number;
  factorB: number;
  correctAnswer: number;
  options: number[]; // For multiple choice if needed, or just validation
}

export interface ShopItem {
  id: string;
  type: 'color' | 'accessory' | 'expression';
  name: string;
  cost: number;
  value: string; // The actual CSS class or emoji or color code
  reqLevel: number;
}