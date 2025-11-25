import React from 'react';
import { UserProfile, TabellinaId, TabellinaProgress, ThemeConfig } from '../types';
import { Star, Lock, ShoppingBag, Trophy, RefreshCw, Download } from 'lucide-react';
import { Avatar } from './Avatar';

interface DashboardProps {
  user: UserProfile;
  theme: ThemeConfig;
  onPlay: (id: TabellinaId) => void;
  onOpenShop: () => void;
  onChangeTheme: () => void;
  onShowInstall: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, theme, onPlay, onOpenShop, onChangeTheme, onShowInstall }) => {
  const renderLevelCard = (id: TabellinaId, label: string) => {
    const isMixed = id === 'mixed';
    const progress = user.progress[id] || { stars: 0, isUnlocked: false, highScore: 0 };
    const locked = !progress.isUnlocked;

    return (
      <button
        key={id}
        onClick={() => !locked && onPlay(id)}
        className={`relative group p-4 rounded-2xl transition-all duration-300 flex flex-col items-center justify-between h-40 border-b-4 
        ${locked 
          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
          : isMixed 
            ? `bg-gradient-to-br ${theme.bgGradient} border-white text-white shadow-lg transform hover:-translate-y-1` 
            : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:border-indigo-400 hover:shadow-md'}`}
      >
        <div className="text-lg font-bold uppercase tracking-wider mb-2">
          {isMixed ? 'Sfida Mista' : `Tabellina ${id}`}
        </div>
        
        {locked ? (
          <Lock className="w-8 h-8 opacity-50" />
        ) : (
          <>
            <div className={`text-4xl font-black ${isMixed ? 'text-white' : theme.accentText.replace('text-', 'text-opacity-80 text-')}`}>
              {isMixed ? '?' : id}
            </div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map(i => (
                <Star 
                  key={i} 
                  size={16} 
                  className={`${i <= progress.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300/50'}`} 
                />
              ))}
            </div>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white p-4 sticky top-0 z-30 shadow-sm border-b border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Avatar config={user.avatar} size="sm" className={`border-2 ${theme.primaryColor.replace('bg-', 'border-')}`} />
            <div>
              <h2 className="font-bold text-slate-800 leading-tight">{user.name}</h2>
              <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block text-white ${theme.primaryColor}`}>
                Livello {user.level}
              </div>
            </div>
         </div>
         <div className="flex items-center gap-2">
             <div className="bg-slate-100 px-3 py-1.5 rounded-full flex items-center text-yellow-500 font-bold text-sm">
               <span className="mr-1">{theme.coinSymbol}</span> {user.coins}
             </div>
             <button 
               onClick={onShowInstall}
               className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200"
               title="Installa App"
             >
               <Download size={18} />
             </button>
             <button 
               onClick={onChangeTheme}
               className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200"
               title="Cambia Eroe"
             >
               <RefreshCw size={18} />
             </button>
         </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* Banner */}
        <div className={`rounded-3xl p-6 text-white relative overflow-hidden shadow-lg bg-gradient-to-r ${theme.bgGradient}`}>
           <div className="relative z-10">
             <h1 className="text-2xl font-bold mb-1">Ciao, {user.name}!</h1>
             <p className="text-white/80 text-sm mb-4">Sei pronto a sfidare {theme.mentorName}?</p>
             <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden">
               <div className="bg-yellow-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(user.xp % 100)}%` }}></div>
             </div>
             <p className="text-xs text-white/70 mt-1 text-right">{user.xp % 100}/100 XP per il prossimo livello</p>
           </div>
           <div className="absolute right-[-20px] bottom-[-20px] opacity-20 text-9xl">{theme.mentorEmoji}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
           <button onClick={onOpenShop} className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center gap-2 text-slate-700 font-bold hover:bg-indigo-50">
              <ShoppingBag className={theme.accentText} size={20} /> Negozio
           </button>
           <button className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center gap-2 text-slate-700 font-bold hover:bg-indigo-50 opacity-50 cursor-not-allowed">
              <Trophy className="text-yellow-500" size={20} /> Classifica
           </button>
        </div>

        <h3 className="font-bold text-slate-800 text-lg">Le tue Missioni</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => renderLevelCard(n as TabellinaId, `Tabellina ${n}`))}
          <div className="col-span-2">
             {renderLevelCard('mixed', 'Sfida Mista')}
          </div>
        </div>
      </div>
    </div>
  );
};