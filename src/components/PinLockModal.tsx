import React, { useState } from 'react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { translations } from '../utils/i18n';

interface PinLockModalProps {
  isOpen: boolean;
  onUnlock: () => void;
  correctPin: string;
  lang: 'id' | 'en';
}

export const PinLockModal: React.FC<PinLockModalProps> = ({
  isOpen,
  onUnlock,
  correctPin,
  lang
}) => {
  const t = translations[lang];
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        if (nextPin === correctPin) {
          onUnlock();
          setPin('');
          setError(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-8 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-violet-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">{t.lockedTitle}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{t.lockedSubtitle}</p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                i < pin.length
                  ? 'bg-pink-600 border-pink-600'
                  : 'bg-transparent border-slate-300 dark:border-slate-700'
              } ${error ? 'bg-red-500 border-red-500 animate-shake' : ''}`}
            ></div>
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((digit, idx) => {
            if (digit === '') return <div key={idx}></div>;
            return (
              <button
                key={idx}
                onClick={() => {
                  if (digit === '⌫') {
                    setPin(prev => prev.slice(0, -1));
                  } else {
                    handleDigit(digit);
                  }
                }}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-pink-100 dark:hover:bg-pink-950/60 text-slate-900 dark:text-white text-base font-bold transition-all"
              >
                {digit}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
