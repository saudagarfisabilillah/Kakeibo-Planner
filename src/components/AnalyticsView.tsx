import React, { useState } from 'react';
import { BarChart3, Sparkles, PieChart as PieIcon, TrendingUp, RefreshCw } from 'lucide-react';
import { Transaction, Category, AIAdviceItem, AppSettings } from '../types';
import { formatCurrency } from '../utils/formatters';
import { translations } from '../utils/i18n';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: Category[];
  aiAdvice: AIAdviceItem[];
  onRefreshAdvice: () => void;
  settings: AppSettings;
}

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#14b8a6', '#f43f5e'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  categories,
  aiAdvice,
  onRefreshAdvice,
  settings
}) => {
  const t = translations[settings.language];
  const [loading, setLoading] = useState(false);

  // Prepare spending data by category
  const expenseTransactions = transactions.filter(tx => tx.type === 'expense');
  const categorySpending: { [key: string]: number } = {};
  expenseTransactions.forEach(tx => {
    categorySpending[tx.category] = (categorySpending[tx.category] || 0) + tx.amount;
  });

  const pieData = Object.keys(categorySpending).map(catName => ({
    name: catName,
    value: categorySpending[catName]
  }));

  // Monthly comparison bar data
  const barData = [
    { month: 'Sep', pemasukan: 11000000, pengeluaran: 7800000 },
    { month: 'Okt', pemasukan: 12000000, pengeluaran: 8200000 },
    { month: 'Nov', pemasukan: 15700000, pengeluaran: transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) },
  ];

  const handleRefresh = async () => {
    setLoading(true);
    await onRefreshAdvice();
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.analytics}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Analisis pengeluaran mendalam & wawasan penasihat keuangan AI Chibi</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs rounded-2xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> {t.askAiTips}
        </button>
      </div>

      {/* AI Advice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiAdvice.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 border border-pink-100 dark:border-pink-900/50 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.advice}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-pink-500 font-bold">
              ✨ Gemini AI Kiyowo Insight
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Breakdown Pie Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Distribusi Pengeluaran Kategori</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Persentase pengeluaran berdasarkan kategori bulan ini</p>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => formatCurrency(Number(v) || 0, settings.currency)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Income vs Expense Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Perbandingan Pemasukan & Pengeluaran</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Tren arus kas perbandingan 3 bulan terakhir</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
                <Tooltip formatter={(v: any) => formatCurrency(Number(v) || 0, settings.currency)} />
                <Legend />
                <Bar dataKey="pemasukan" fill="#10b981" radius={[8, 8, 0, 0]} name="Pemasukan" />
                <Bar dataKey="pengeluaran" fill="#ec4899" radius={[8, 8, 0, 0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
