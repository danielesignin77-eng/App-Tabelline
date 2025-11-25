import React from 'react';
import { X, Download, Share, PlusSquare, MoreVertical } from 'lucide-react';

interface InstallModalProps {
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ onClose }) => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Download size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Installa l'App</h2>
          <p className="text-slate-500 mt-2 text-sm">
            Per avere l'esperienza completa a tutto schermo, aggiungi Tabelline Hero al tuo telefono.
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          {isIOS ? (
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <span className="font-bold bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span>Tocca il tasto <span className="font-bold">Condividi</span> <Share className="inline w-4 h-4 text-blue-500"/></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span>Scorri e scegli <span className="font-bold">Aggiungi alla Home</span> <PlusSquare className="inline w-4 h-4"/></span>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <span className="font-bold bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span>Tocca il menu <MoreVertical className="inline w-4 h-4 text-slate-500"/> in alto a destra</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span>Seleziona <span className="font-bold">Installa App</span> o <span className="font-bold">Aggiungi a schermata Home</span></span>
              </div>
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition"
        >
          Ho capito!
        </button>
      </div>
    </div>
  );
};