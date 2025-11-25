import React, { useState, useEffect } from 'react';
import { UserProfile, TabellinaId, ShopItem, TabellinaProgress, ThemeId } from './types';
import { Dashboard } from './components/Dashboard';
import { GameSession } from './components/GameSession';
import { Shop } from './components/Shop';
import { InstallModal } from './components/InstallModal';
import { INITIAL_TABLES, calculateXP, THEMES } from './utils/gameLogic';

// Default initial state
const DEFAULT_USER: UserProfile = {
  name: '',
  themeId: 'wizard',
  avatar: { baseColor: 'bg-purple-500', accessory: '', expression: 'aa' },
  xp: 0,
  level: 1,
  coins: 0,
  unlockedItems: [],
  progress: INITIAL_TABLES.reduce((acc, id) => ({
    ...acc,
    [id]: { stars: 0, highScore: 0, isUnlocked: true }
  }), {} as Record<string, TabellinaProgress>)
};

// Also init locked tables
for (let i = 1; i <= 10; i++) {
  if (!DEFAULT_USER.progress[i]) {
    DEFAULT_USER.progress[i] = { stars: 0, highScore: 0, isUnlocked: false };
  }
}
DEFAULT_USER.progress['mixed'] = { stars: 0, highScore: 0, isUnlocked: false };

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<'onboarding' | 'dashboard' | 'game' | 'shop'>('onboarding');
  const [activeTableId, setActiveTableId] = useState<TabellinaId | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  
  // Onboarding state
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingTheme, setOnboardingTheme] = useState<ThemeId>('wizard');
  const [onboardingStep, setOnboardingStep] = useState<'theme' | 'name'>('theme');

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('tabelline_hero_user');
    if (saved) {
      const parsedUser = JSON.parse(saved);
      // Fallback if theme doesn't exist anymore
      if (!THEMES[parsedUser.themeId as ThemeId]) {
        parsedUser.themeId = 'wizard';
      }
      setUser(parsedUser);
      setScreen('dashboard');
    }
  }, []);

  // Save on update
  useEffect(() => {
    if (user) {
      localStorage.setItem('tabelline_hero_user', JSON.stringify(user));
    }
  }, [user]);

  const handleThemeSelection = (id: ThemeId) => {
    if (user) {
      // User exists, just switch theme and go back to dashboard
      setUser({ ...user, themeId: id });
      setScreen('dashboard');
    } else {
      // New user, proceed to name
      setOnboardingTheme(id);
      setOnboardingStep('name');
    }
  };

  const handleOnboardingComplete = () => {
    if (!onboardingName.trim()) return;
    
    // Set default avatar color based on theme
    let defaultColor = 'bg-orange-400';
    if (onboardingTheme === 'wizard') defaultColor = 'bg-purple-500';
    if (onboardingTheme === 'princess') defaultColor = 'bg-pink-400';
    if (onboardingTheme === 'robot') defaultColor = 'bg-cyan-500';
    if (onboardingTheme === 'soccer') defaultColor = 'bg-green-500';

    setUser({ 
      ...DEFAULT_USER, 
      name: onboardingName, 
      themeId: onboardingTheme,
      avatar: { ...DEFAULT_USER.avatar, baseColor: defaultColor }
    });
    setScreen('dashboard');
  };

  const handleStartGame = (id: TabellinaId) => {
    setActiveTableId(id);
    setScreen('game');
  };

  const handleGameComplete = (score: number, stars: number) => {
    if (!user || !activeTableId) return;

    // Logic for rewards
    const xpGained = calculateXP(score, 0); // ignoring time for MVP
    const coinsGained = score * 2; // 2 coins per correct answer

    const oldProgress = user.progress[activeTableId];
    const newStars = Math.max(oldProgress.stars, stars);
    const newHighScore = Math.max(oldProgress.highScore, score);

    // Level up logic (simplified: 100xp per level)
    const newTotalXp = user.xp + xpGained;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    // Unlock logic
    const updatedProgress: Record<string, TabellinaProgress> = { ...user.progress };
    updatedProgress[activeTableId] = {
       ...oldProgress,
       stars: newStars,
       highScore: newHighScore
    };

    // Unlock next table if 2 stars earned
    if (newStars >= 2 && typeof activeTableId === 'number' && activeTableId < 10) {
       const nextId = activeTableId + 1;
       if (updatedProgress[nextId]) {
         updatedProgress[nextId].isUnlocked = true;
       }
    }
    
    // Unlock mixed if enough stars total (e.g., 15)
    const totalStars = (Object.values(updatedProgress) as TabellinaProgress[]).reduce((acc, p) => acc + p.stars, 0);
    if (totalStars >= 15) {
      updatedProgress['mixed'].isUnlocked = true;
    }

    setUser({
      ...user,
      coins: user.coins + coinsGained,
      xp: newTotalXp,
      level: newLevel,
      progress: updatedProgress
    });

    setScreen('dashboard');
    setActiveTableId(null);
  };

  const handleBuyItem = (item: ShopItem) => {
    if (!user) return;
    setUser({
      ...user,
      coins: user.coins - item.cost,
      unlockedItems: [...user.unlockedItems, item.id]
    });
  };

  const handleEquipItem = (item: ShopItem) => {
    if (!user) return;
    const newAvatar = { ...user.avatar };
    if (item.type === 'color') newAvatar.baseColor = item.value;
    if (item.type === 'accessory') newAvatar.accessory = item.value;
    
    setUser({ ...user, avatar: newAvatar });
  };

  const handleChangeTheme = () => {
    setScreen('onboarding');
    setOnboardingStep('theme');
  };

  // --- RENDERING ---

  if (screen === 'onboarding') {
    // Step 1: Theme Selection (used for both new and existing users)
    if (onboardingStep === 'theme') {
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
          <h1 className="text-3xl font-black mb-2">
            {user ? 'Cambia il tuo mondo!' : 'Scegli la tua avventura!'}
          </h1>
          <p className="text-slate-300 mb-8">Dove vuoi imparare le tabelline?</p>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeSelection(t.id)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-4 transition-transform hover:scale-105 bg-gradient-to-br ${t.bgGradient} border-white/20`}
              >
                <div className="text-5xl">{t.mentorEmoji}</div>
                <div className="font-bold">{t.name}</div>
              </button>
            ))}
          </div>
          {user && (
            <button 
              onClick={() => setScreen('dashboard')} 
              className="mt-8 text-slate-400 hover:text-white underline"
            >
              Annulla
            </button>
          )}
        </div>
      );
    }

    // Step 2: Name Input (Only for new users)
    const selectedTheme = THEMES[onboardingTheme];
    return (
      <div className={`min-h-screen bg-gradient-to-b ${selectedTheme.bgGradient} flex flex-col items-center justify-center p-6 text-white text-center`}>
        <div className="text-6xl mb-6 animate-bounce">{selectedTheme.mentorEmoji}</div>
        <h1 className="text-4xl font-black mb-2">{selectedTheme.name}</h1>
        <p className="text-white/80 mb-8 text-lg">Il mentore {selectedTheme.mentorName} ti aspetta!</p>
        
        <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-sm text-slate-800">
          <label className="block font-bold mb-3 text-left pl-1">Come ti chiami, eroe?</label>
          <input 
            type="text" 
            value={onboardingName}
            onChange={(e) => setOnboardingName(e.target.value)}
            className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-xl font-bold mb-4 focus:border-indigo-500 focus:outline-none"
            placeholder="Il tuo nome..."
          />
          
          <div className="flex gap-2">
            <button 
              onClick={() => setOnboardingStep('theme')}
              className="px-4 py-4 rounded-xl font-bold text-slate-400 hover:bg-slate-100"
            >
              Indietro
            </button>
            <button 
              onClick={handleOnboardingComplete}
              className={`flex-1 ${selectedTheme.primaryColor} text-white font-bold py-4 rounded-xl text-xl shadow-lg transform transition hover:scale-105 active:scale-95`}
            >
              Inizia!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safety check, though onboarding handles !user
  if (!user) return null;

  const currentTheme = THEMES[user.themeId] || THEMES['wizard'];

  if (screen === 'game' && activeTableId) {
    return (
      <GameSession 
        tableId={activeTableId} 
        userName={user.name} 
        theme={currentTheme}
        onComplete={handleGameComplete} 
        onBack={() => setScreen('dashboard')} 
      />
    );
  }

  return (
    <>
      <Dashboard 
        user={user} 
        theme={currentTheme}
        onPlay={handleStartGame} 
        onOpenShop={() => setScreen('shop')} 
        onChangeTheme={handleChangeTheme}
        onShowInstall={() => setShowInstallModal(true)}
      />
      
      {screen === 'shop' && (
        <Shop 
          user={user} 
          theme={currentTheme}
          onClose={() => setScreen('dashboard')} 
          onBuy={handleBuyItem}
          onEquip={handleEquipItem}
        />
      )}

      {showInstallModal && (
        <InstallModal onClose={() => setShowInstallModal(false)} />
      )}
    </>
  );
};

export default App;