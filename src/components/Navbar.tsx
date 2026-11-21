import React from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  Landmark, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon, 
  Sparkles, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Lock,
  Cloud,
  CheckCircle2,
  Trophy,
  Target
} from 'lucide-react';
import { AppSettings } from '../types';
import { translations } from '../utils/i18n';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  onLockApp: () => void;
  onOpenScan: () => void;
  onSyncBank: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  setSettings,
  onLockApp,
  onOpenScan,
  onSyncBank
}) => {
  const t = translations[settings.language];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'transactions', label: t.transactions, icon: Receipt },
    { id: 'budgets', label: t.budgets, icon: PieChart },
    { id: 'accounts', label: t.accounts, icon: Landmark },
    { id: 'bills', label: t.bills, icon: FileText },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'goals', label: settings.language === 'id' ? 'Target & Impian' : 'Goals & Targets', icon: Target },
    { id: 'badges', label: settings.language === 'id' ? 'Prestasi & Poin' : 'Badges & Points', icon: Trophy },
    { id: 'settings', label: t.settings, icon: SettingsIcon },
  ];

  const toggleDarkMode = () => {
    const newMode = !settings.darkMode;
    setSettings(prev => ({ ...prev, darkMode: newMode }));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    const newLang = settings.language === 'id' ? 'en' : 'id';
    setSettings(prev => ({ ...prev, language: newLang }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-pink-600 to-violet-600 dark:from-pink-400 dark:to-violet-400 bg-clip-text text-transparent">
                {t.appName}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenScan}
              className="px-3 py-1.5 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/60 text-pink-600 dark:text-pink-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-pink-200 dark:border-pink-800 transition-all shadow-sm"
            >
              <Receipt className="w-3.5 h-3.5" />
              {t.scanReceipt}
            </button>
            <button
              onClick={onSyncBank}
              className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-all shadow-sm"
            >
              <Cloud className="w-3.5 h-3.5" />
              {t.syncBank}
            </button>
          </div>

          {/* Utilities & Controls */}
          <div className="flex items-center gap-2">
            {/* Cloud Sync Status Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.onlineMode}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Ganti Bahasa / Switch Language"
            >
              {settings.language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Ganti Tema / Toggle Theme"
            >
              {settings.darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Lock App Button */}
            <button
              onClick={onLockApp}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              title="Kunci Aplikasi / Lock App"
            >
              <Lock className="w-4 h-4 text-pink-500" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-md shadow-pink-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
