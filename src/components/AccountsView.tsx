import React from 'react';
import { Landmark, Wallet, Building2, Banknote, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Account, AppSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { translations } from '../utils/i18n';
import confetti from 'canvas-confetti';

interface AccountsViewProps {
  accounts: Account[];
  onSyncAccount: (id: string) => void;
  settings: AppSettings;
}

export const AccountsView: React.FC<AccountsViewProps> = ({ accounts, onSyncAccount, settings }) => {
  const t = translations[settings.language];

  const handleSyncClick = (id: string) => {
    onSyncAccount(id);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark': return Landmark;
      case 'Wallet': return Wallet;
      case 'Building2': return Building2;
      default: return Banknote;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.accounts}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Kelola rekening bank, e-wallet, dan saldo tunai dengan sinkronisasi otomatis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map(acc => {
          const Icon = getAccountIcon(acc.icon);
          return (
            <div key={acc.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 text-white flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{acc.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{acc.accountNumber}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi Aman
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-xs text-slate-400 font-semibold">Saldo Tersedia</span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {formatCurrency(acc.balance, settings.currency)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  Sinkronisasi terakhir: {acc.lastSynced ? formatDate(acc.lastSynced) : 'Baru saja'}
                </span>
                <button
                  onClick={() => handleSyncClick(acc.id)}
                  className="px-3 py-1.5 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-600 dark:text-pink-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-pink-200 dark:border-pink-800"
                >
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" /> {t.syncBank}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
