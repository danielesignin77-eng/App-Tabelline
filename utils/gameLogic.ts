
import { Question, ShopItem, TabellinaId, ThemeConfig, ThemeId } from '../types';

export const INITIAL_TABLES: TabellinaId[] = [1, 2, 5, 10];

export const THEMES: Record<ThemeId, ThemeConfig> = {
  wizard: {
    id: 'wizard',
    name: 'Scuola di Magia',
    mentorName: 'Prof. Albus',
    mentorEmoji: '🧙‍♂️',
    bgGradient: 'from-slate-900 to-purple-900',
    primaryColor: 'bg-purple-800',
    secondaryColor: 'bg-amber-500',
    accentText: 'text-amber-400',
    coinSymbol: '✨'
  },
  princess: {
    id: 'princess',
    name: 'Castello Incantato',
    mentorName: 'Fata Turchina',
    mentorEmoji: '👸',
    bgGradient: 'from-pink-400 to-rose-600',
    primaryColor: 'bg-pink-600',
    secondaryColor: 'bg-yellow-300',
    accentText: 'text-yellow-100',
    coinSymbol: '👑'
  },
  robot: {
    id: 'robot',
    name: 'Base Spaziale',
    mentorName: 'C1-P8',
    mentorEmoji: '🤖',
    bgGradient: 'from-slate-800 to-cyan-900',
    primaryColor: 'bg-cyan-700',
    secondaryColor: 'bg-orange-500',
    accentText: 'text-cyan-300',
    coinSymbol: '🔋'
  },
  soccer: {
    id: 'soccer',
    name: 'Stadio dei Campioni',
    mentorName: 'Il Capitano',
    mentorEmoji: '⚽',
    bgGradient: 'from-green-500 to-emerald-800',
    primaryColor: 'bg-blue-600',
    secondaryColor: 'bg-yellow-400',
    accentText: 'text-yellow-300',
    coinSymbol: '🏆'
  }
};

export const generateQuestion = (tableId: TabellinaId): Question => {
  let a, b;
  
  if (tableId === 'mixed') {
    // Mixed: factors 2 to 9 mostly, occasionally 1 and 10
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
  } else {
    // Specific table
    a = typeof tableId === 'number' ? tableId : 1;
    b = Math.floor(Math.random() * 10) + 1; // 1 to 10
    
    // Randomize order for visual variety (e.g. 7x2 vs 2x7)
    if (Math.random() > 0.5) {
      [a, b] = [b, a];
    }
  }

  const correct = a * b;
  
  // Generate distractors (wrong answers) close to real one
  const options = new Set<number>();
  options.add(correct);
  
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const sign = Math.random() > 0.5 ? 1 : -1;
    const distractor = correct + (offset * sign);
    if (distractor > 0 && distractor !== correct) {
      options.add(distractor);
    }
  }

  return {
    factorA: a,
    factorB: b,
    correctAnswer: correct,
    options: Array.from(options).sort(() => Math.random() - 0.5)
  };
};

export const calculateXP = (correctCount: number, totalTime: number) => {
  const baseXP = correctCount * 10;
  const timeBonus = Math.max(0, 100 - totalTime); // Simple logic
  return baseXP + Math.floor(timeBonus / 2);
};

export const SHOP_ITEMS: ShopItem[] = [
  // Colors
  { id: 'c_orange', type: 'color', name: 'Arancio', cost: 0, value: 'bg-orange-400', reqLevel: 0 },
  { id: 'c_blue', type: 'color', name: 'Blu', cost: 50, value: 'bg-blue-500', reqLevel: 2 },
  { id: 'c_purple', type: 'color', name: 'Viola', cost: 100, value: 'bg-purple-500', reqLevel: 3 },
  { id: 'c_green', type: 'color', name: 'Verde', cost: 150, value: 'bg-emerald-500', reqLevel: 4 },
  { id: 'c_pink', type: 'color', name: 'Rosa', cost: 200, value: 'bg-pink-400', reqLevel: 5 },
  { id: 'c_red', type: 'color', name: 'Rosso', cost: 250, value: 'bg-red-600', reqLevel: 6 },
  { id: 'c_cyan', type: 'color', name: 'Ciano', cost: 120, value: 'bg-cyan-500', reqLevel: 4 },
  
  // Accessories
  { id: 'a_none', type: 'accessory', name: 'Nessuno', cost: 0, value: '', reqLevel: 0 },
  { id: 'a_glasses', type: 'accessory', name: 'Occhiali', cost: 60, value: '👓', reqLevel: 2 },
  { id: 'a_crown', type: 'accessory', name: 'Corona', cost: 120, value: '👑', reqLevel: 5 },
  { id: 'a_hat', type: 'accessory', name: 'Cappello', cost: 80, value: '🧢', reqLevel: 3 },
  { id: 'a_astro', type: 'accessory', name: 'Casco', cost: 150, value: '🧑‍🚀', reqLevel: 6 },
  { id: 'a_mask', type: 'accessory', name: 'Maschera', cost: 100, value: '🎭', reqLevel: 4 },
  { id: 'a_wand', type: 'accessory', name: 'Bacchetta', cost: 200, value: '🪄', reqLevel: 7 },
  { id: 'a_ball', type: 'accessory', name: 'Pallone', cost: 90, value: '⚽', reqLevel: 3 },
  
  // Expressions
  { id: 'e_smile', type: 'expression', name: 'Sorriso', cost: 0, value: 'aa', reqLevel: 0 }, 
  { id: 'e_cool', type: 'expression', name: 'Figo', cost: 50, value: 'bb', reqLevel: 2 },
];