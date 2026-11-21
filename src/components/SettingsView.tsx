import React, { useState } from 'react';
import { Settings as SettingsIcon, ShieldCheck, Lock, Cloud, Moon, Sun, Download, Upload, Key } from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/i18n';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, setSettings, onResetData }) => {
  const t = translations[settings.language];
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleCurrencyChange = (c: 'IDR' | 'USD' | 'EUR') => {
    setSettings(prev => ({ ...prev, currency: c }));
  };

  const handlePinSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      setSettings(prev => ({ ...prev, pinCode: newPin }));
      setPinSuccess(true);
      setTimeout(() => setPinSuccess(false), 3000);
      setNewPin('');
    }
  };

  const handleRemovePin = () => {
    setSettings(prev => ({ ...prev, pinCode: null }));
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.settings}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Kelola preferensi aplikasi, keamanan enkripsi E2E, dan PIN keamanan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Preferences */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-4 h-4 text-pink-500" /> Preferensi Umum
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Mata Uang (Currency)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['IDR', 'USD', 'EUR'] as const).map(curr => (
                <button
                  key={curr}
                  onClick={() => handleCurrencyChange(curr)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    settings.currency === curr
                      ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {curr === 'IDR' ? '🇮🇩 IDR (Rp)' : curr === 'USD' ? '🇺🇸 USD ($)' : '🇪🇺 EUR (€)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Bahasa Aplikasi</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSettings(prev => ({ ...prev, language: 'id' }))}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${settings.language === 'id' ? 'bg-pink-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                🇮🇩 Bahasa Indonesia
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, language: 'en' }))}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${settings.language === 'en' ? 'bg-pink-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Sinkronisasi Cloud Otomatis</p>
              <p className="text-[10px] text-slate-500">Cadangan data harian terenkripsi di cloud</p>
            </div>
            <input
              type="checkbox"
              checked={settings.cloudSyncEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, cloudSyncEnabled: e.target.checked }))}
              className="w-5 h-5 accent-pink-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Security & Encryption */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Keamanan & Enkripsi E2E
          </h3>

          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs mb-1">
              <ShieldCheck className="w-4 h-4" /> Enkripsi End-to-End Aktif
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Seluruh data transaksi dan catatan keuangan Anda diamankan dengan protokol enkripsi AES-256 lokal dan server.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">PIN Keamanan (4-Digit)</label>
            {settings.pinCode ? (
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">PIN Aktif (****)</span>
                <button
                  onClick={handleRemovePin}
                  className="px-3 py-1.5 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-xl text-xs font-bold"
                >
                  Hapus PIN
                </button>
              </div>
            ) : (
              <form onSubmit={handlePinSave} className="flex gap-2">
                <input
                  type="password"
                  maxLength={4}
                  placeholder="Masukkan 4 digit PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-bold"
                >
                  Simpan
                </button>
              </form>
            )}
            {pinSuccess && <p className="text-[10px] text-emerald-500 mt-1 font-semibold">PIN berhasil disimpan!</p>}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onResetData}
              className="w-full py-2.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 rounded-2xl text-xs font-bold transition-all border border-red-200 dark:border-red-900"
            >
              Reset Data Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
