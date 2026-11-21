import React, { useState } from 'react';
import { Target, Plus, Sparkles, TrendingUp, CheckCircle2, BellRing, Award } from 'lucide-react';
import { FinancialGoal, AppSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import confetti from 'canvas-confetti';

interface GoalsViewProps {
  goals: FinancialGoal[];
  onAddGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  onAddFunds: (goalId: string, amount: number) => void;
  settings: AppSettings;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onAddGoal,
  onAddFunds,
  settings
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundModalGoal, setFundModalGoal] = useState<FinancialGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Form state for new goal
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('2027-12-31');
  const [icon, setIcon] = useState('🎯');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    onAddGoal({
      title,
      targetAmount: Number(targetAmount),
      currentAmount: 0,
      deadline,
      icon,
      color: 'bg-purple-500'
    });

    setIsModalOpen(false);
    setTitle('');
    setTargetAmount('');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundModalGoal || !depositAmount) return;

    onAddFunds(fundModalGoal.id, Number(depositAmount));
    setFundModalGoal(null);
    setDepositAmount('');
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header & Nudge Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-pink-200" /> Target & Impian Finansial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Wujudkan Masa Depanmu ✨
          </h2>
          <p className="text-pink-100 text-sm max-w-xl font-medium">
            Tetapkan target keuangan spesifik dan pantau progres tabungan secara visual dengan pengingat otomatis (nudge).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-purple-600 hover:bg-purple-50 font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Buat Target Baru
        </button>
      </div>

      {/* Automated Smart Nudge Notification Card */}
      <div className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-200 dark:border-pink-900/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-md">
          <BellRing className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">🤖 Kiyowo AI Nudge Pengingat Target</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            "Hebat! Target <strong>Dana Darurat</strong> sudah tercapai 58%. Sisihkan Rp 250.000 lagi minggu ini untuk mempercepat pencapaian target <strong>MacBook Pro</strong>!"
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          const isComplete = goal.currentAmount >= goal.targetAmount;

          return (
            <div key={goal.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-violet-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-2xl shadow-inner">
                      {goal.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{goal.title}</h3>
                      <p className="text-[10px] text-slate-500">Target: {formatDate(goal.deadline)}</p>
                    </div>
                  </div>
                  {isComplete && (
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full text-[10px] font-bold">
                      Tercapai 🎉
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Terkumpul: <strong className="text-slate-900 dark:text-white">{formatCurrency(goal.currentAmount, settings.currency)}</strong></span>
                    <span className="text-slate-500">Target: <strong className="text-slate-900 dark:text-white">{formatCurrency(goal.targetAmount, settings.currency)}</strong></span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{percentage}% Tercapai</span>
                {!isComplete && (
                  <button
                    onClick={() => setFundModalGoal(goal)}
                    className="px-3.5 py-1.5 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 text-pink-600 dark:text-pink-300 rounded-xl text-xs font-bold transition-all border border-pink-200 dark:border-pink-800"
                  >
                    + Tambah Tabungan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Buat Target Keuangan Baru</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Target / Impian</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beli Rumah Impian, Kendaraan Baru"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Dana (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="10000000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Tenggat</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emoji / Ikon</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="🎯">🎯 Target Umum</option>
                  <option value="🛡️">🛡️ Dana Darurat</option>
                  <option value="💻">💻 Gadget / Laptop</option>
                  <option value="✈️">✈️ Liburan / Travelling</option>
                  <option value="🚗">🚗 Kendaraan</option>
                  <option value="🏠">🏠 Rumah Impian</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl text-xs font-bold shadow-md"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Funds Modal */}
      {fundModalGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Tambah Tabungan Target</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Target: <strong>{fundModalGoal.title}</strong></p>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Setoran (IDR)</label>
                <input
                  type="number"
                  required
                  placeholder="250000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFundModalGoal(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl text-xs font-bold shadow-md"
                >
                  Setor Dana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
