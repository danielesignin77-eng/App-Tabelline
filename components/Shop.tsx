
import React from 'react';
import { UserProfile, ShopItem, ThemeConfig } from '../types';
import { SHOP_ITEMS } from '../utils/gameLogic';
import { Avatar } from './Avatar';
import { X, Lock, Check } from 'lucide-react';

interface ShopProps {
  user: UserProfile;
  theme: ThemeConfig;
  onClose: () => void;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export const Shop: React.FC<ShopProps> = ({ user, theme, onClose, onBuy, onEquip }) => {
  // Group items by type
  const accessories = SHOP_ITEMS.filter(i => i.type === 'accessory');
  const colors = SHOP_ITEMS.filter(i => i.type === 'color');

  const renderItem = (item: ShopItem) => {
    const isUnlocked = user.unlockedItems.includes(item.id) || item.cost === 0;
    const isLevelOk = user.level >= item.reqLevel;
    const canAfford = user.coins >= item.cost;
    
    // Check if equipped
    let isEquipped = false;
    if (item.type === 'color' && user.avatar.baseColor === item.value) isEquipped = true;
    if (item.type === 'accessory' && user.avatar.accessory === item.value) isEquipped = true;

    return (
      <button 
        key={item.id}
        onClick={() => {
          if (isUnlocked) onEquip(item);
          else if (isLevelOk && canAfford) onBuy(item);
        }}
        disabled={!isUnlocked && (!isLevelOk || !canAfford)}
        className={`flex flex-col items-center p-3 rounded-xl border-2 relative
          ${isEquipped ? `border-[${theme.primaryColor}] bg-slate-50 ring-2 ring-slate-200` : 'border-slate-200 bg-white'}
          ${!isUnlocked && !isLevelOk ? 'opacity-50 grayscale' : ''}
        `}
      >
        <div className="h-12 w-12 flex items-center justify-center text-3xl mb-2 bg-slate-50 rounded-full">
           {item.type === 'color' ? <div className={`w-8 h-8 rounded-full ${item.value}`}></div> : item.value || <span className="text-xs text-slate-400">NO</span>}
        </div>
        <div className="text-xs font-bold text-slate-700 mb-1">{item.name}</div>
        
        {isEquipped ? (
           <div className={`text-xs font-bold ${theme.accentText} flex items-center gap-1`}><Check size={12}/> Usato</div>
        ) : isUnlocked ? (
           <div className="text-xs font-bold text-green-600">Sbloccato</div>
        ) : !isLevelOk ? (
           <div className="text-xs text-slate-400 flex items-center gap-1"><Lock size={12}/> Liv {item.reqLevel}</div>
        ) : (
           <div className={`text-xs font-bold flex items-center gap-1 ${canAfford ? 'text-yellow-600' : 'text-red-400'}`}>
             {item.cost} {theme.coinSymbol}
           </div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
       <div className={`p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🛍️</span> Negozio
          </h2>
          <div className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold text-sm">
             {user.coins} {theme.coinSymbol}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X />
          </button>
       </div>

       <div className="flex-1 overflow-y-auto p-4 pb-20">
          {/* Preview */}
          <div className={`flex justify-center mb-8 py-4 rounded-3xl bg-gradient-to-br ${theme.bgGradient}`}>
             <Avatar config={user.avatar} size="xl" />
          </div>

          <h3 className="font-bold text-slate-800 mb-3 px-1">Colori</h3>
          <div className="grid grid-cols-3 gap-3 mb-8">
             {colors.map(renderItem)}
          </div>

          <h3 className="font-bold text-slate-800 mb-3 px-1">Accessori</h3>
          <div className="grid grid-cols-3 gap-3 mb-8">
             {accessories.map(renderItem)}
          </div>
       </div>
    </div>
  );
};
