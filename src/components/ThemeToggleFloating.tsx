import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AppSettings } from '../types';

interface ThemeToggleFloatingProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

export const ThemeToggleFloating: React.FC<ThemeToggleFloatingProps> = ({ settings, setSettings }) => {
  const toggleDarkMode = () => {
    const newMode = !settings.darkMode;
    setSettings(prev => ({ ...prev, darkMode: newMode }));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={toggleDarkMode}
        className="group relative flex items-center gap-2 px-3.5 py-3 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-full shadow-2xl backdrop-blur-md border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:scale-105"
        title={settings.darkMode ? 'Ubah ke Mode Terang / Light Mode' : 'Ubah ke Mode Gelap / Dark Mode'}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white shadow-md">
          {settings.darkMode ? <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" /> : <Moon className="w-4 h-4 text-white" />}
        </div>
        <span className="text-xs font-bold pr-1 hidden sm:inline">
          {settings.darkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};
