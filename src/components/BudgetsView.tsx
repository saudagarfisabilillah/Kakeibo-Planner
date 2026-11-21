import React, { useState } from 'react';
import { PieChart, Plus, AlertTriangle, CheckCircle2, Sparkles, Edit2 } from 'lucide-react';
import { Category, Transaction, AppSettings } from '../types';
import { formatCurrency } from '../utils/formatters';
import { translations } from '../utils/i18n';

interface BudgetsViewProps {
  categories: Category[];
  transactions: Transaction[];
  onUpdateBudget: (categoryId: string, newBudget: number) => void;
  settings: AppSettings;
}

export const BudgetsView: React.FC<BudgetsViewProps> = ({
  categories,
  transactions,
  onUpdateBudget,
  settings
}) => {
  const t = translations[settings.language];
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [tempBudget, setTempBudget] = useState('');

  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Calculate spent per category for current month
  const getSpentForCategory = (categoryName: string) => {
    return transactions
      .filter(tx => tx.type === 'expense' && tx.category === categoryName)
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !tempBudget) return;
    onUpdateBudget(editingCategory.id, Number(tempBudget));
    setEditingCategory(null);
    setTempBudget('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.budgets}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Atur batas anggaran bulanan untuk setiap kategori pengeluaran</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenseCategories.map(cat => {
          const spent = getSpentForCategory(cat.name);
          const percentage = cat.budget > 0 ? Math.min(Math.round((spent / cat.budget) * 100), 100) : 0;
          const isOver = spent > cat.budget;

          return (
            <div key={cat.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${cat.color} text-white flex items-center justify-center font-bold text-base shadow-md`}>
                      🏷️
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.name}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {isOver ? <span className="text-red-500 font-bold">⚠️ Melebihi Anggaran!</span> : <span className="text-emerald-500 font-semibold">✨ Anggaran Aman</span>}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setTempBudget(String(cat.budget));
                    }}
                    className="p-2 text-slate-400 hover:text-pink-600 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Terpakai: <strong className="text-slate-900 dark:text-white">{formatCurrency(spent, settings.currency)}</strong></span>
                    <span className="text-slate-500 dark:text-slate-400">Batas: <strong className="text-slate-900 dark:text-white">{formatCurrency(cat.budget, settings.currency)}</strong></span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOver ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-gradient-to-r from-pink-500 to-violet-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>{percentage}% dari kuota</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">Sisa: {formatCurrency(Math.max(0, cat.budget - spent), settings.currency)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Ubah Batas Anggaran</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Kategori: <strong>{editingCategory.name}</strong></p>
            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Batas Bulanan Baru (IDR)</label>
                <input
                  type="number"
                  required
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl text-xs font-bold shadow-md"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
