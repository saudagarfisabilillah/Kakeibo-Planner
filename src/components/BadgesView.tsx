import React from 'react';
import { Award, Trophy, Sparkles, Star, CheckCircle2, Lock } from 'lucide-react';
import { Badge, AppSettings } from '../types';

interface BadgesViewProps {
  badges: Badge[];
  settings: AppSettings;
  lang: 'id' | 'en';
}

export const BadgesView: React.FC<BadgesViewProps> = ({ badges, settings, lang }) => {
  const pointsForNextLevel = settings.level * 200;
  const progressPercent = Math.min(Math.round((settings.points / pointsForNextLevel) * 100), 100);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header & Level Progress Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-300" /> {lang === 'id' ? 'Sistem Prestasi & Kedisiplinan' : 'Achievements & Discipline System'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Level {settings.level} • {settings.points} Poin Kiyowo ✨
            </h2>
            <p className="text-pink-100 text-sm max-w-xl font-medium">
              {lang === 'id'
                ? 'Kumpulkan poin dengan rajin mencatat transaksi, menjaga anggaran, dan melunasi tagihan tepat waktu!'
                : 'Collect points by recording transactions, sticking to budgets, and paying bills on time!'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span>{lang === 'id' ? 'Progres Level Berikutnya' : 'Next Level Progress'}</span>
              <span>{settings.points} / {pointsForNextLevel} Pts</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500 shadow"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-pink-500" /> {lang === 'id' ? 'Koleksi Badge Prestasi' : 'Achievement Badges'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {badges.map(badge => (
            <div
              key={badge.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                badge.unlocked
                  ? 'bg-white dark:bg-slate-900 border-pink-200 dark:border-pink-900/50 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-100 to-violet-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-3xl shadow-inner">
                    {badge.icon}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    badge.unlocked
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {badge.unlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {badge.unlocked ? (lang === 'id' ? 'Terbuka' : 'Unlocked') : (lang === 'id' ? 'Terkunci' : 'Locked')}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">{badge.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{badge.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                <span className="text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> +{badge.pointsReward} Pts
                </span>
                {badge.unlockedAt && (
                  <span className="text-[10px] text-slate-400">
                    {lang === 'id' ? 'Diraih: ' : 'Unlocked: '} {badge.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
