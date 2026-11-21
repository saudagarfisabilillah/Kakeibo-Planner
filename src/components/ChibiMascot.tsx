import React, { useState } from 'react';
import { Sparkles, Heart, MessageCircle, Bot } from 'lucide-react';
import { ChibiMood } from '../types';

interface ChibiMascotProps {
  mood: ChibiMood;
  speechText: string;
  onAskAi: () => void;
  lang: 'id' | 'en';
}

export const ChibiMascot: React.FC<ChibiMascotProps> = ({ mood, speechText, onAskAi, lang }) => {
  const [character, setCharacter] = useState<'boy' | 'girl'>('girl'); // Kaito or Sakura
  const [isOpen, setIsOpen] = useState(true);

  const toggleCharacter = () => {
    setCharacter(prev => (prev === 'girl' ? 'boy' : 'girl'));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 max-w-sm">
      {/* Speech Bubble */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 border-2 border-pink-300 dark:border-pink-600 rounded-3xl p-4 shadow-2xl relative animate-bounce-subtle backdrop-blur-md">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-3 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {character === 'girl' ? 'Sakura (Kiyowo)' : 'Kaito (Kiyowo)'}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-3">
            {speechText}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onAskAi}
              className="flex-1 py-1.5 px-3 bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-600 hover:to-violet-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5" /> {lang === 'id' ? 'Tips AI Pintar' : 'AI Financial Tips'}
            </button>
            <button
              onClick={toggleCharacter}
              title="Ganti Karakter / Switch Mascot"
              className="p-1.5 bg-pink-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 rounded-xl hover:bg-pink-200 transition-all text-xs"
            >
              🔄
            </button>
          </div>
        </div>
      )}

      {/* Mascot Avatar Button */}
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center shadow-xl border-2 border-white dark:border-slate-800 overflow-hidden">
          {character === 'girl' ? (
            // Sakura Chibi Girl Avatar 3D
            <img 
              src="/src/assets/images/chibi_girl_sakura_1795230290224.jpg" 
              alt="Sakura Chibi" 
              className="w-full h-full object-cover"
            />
          ) : (
            // Kaito Chibi Boy Avatar 3D
            <img 
              src="/src/assets/images/chibi_boy_kaito_1795230289991.jpg" 
              alt="Kaito Chibi" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        {/* Mood indicator badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white">
          {mood === 'happy' ? '💖' : mood === 'worried' ? '⚠️' : '💡'}
        </span>
      </div>
    </div>
  );
};
