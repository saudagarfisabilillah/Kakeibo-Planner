import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Receipt, 
  Cloud, 
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  PieChart as PieIcon
} from 'lucide-react';
import { Transaction, Category, Account, Bill, AIAdviceItem, AppSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { translations } from '../utils/i18n';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  bills: Bill[];
  aiAdvice: AIAdviceItem[];
  onOpenAddModal: (type?: 'income' | 'expense') => void;
  onOpenScan: () => void;
  onSyncBank: () => void;
  settings: AppSettings;
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  categories,
  accounts,
  bills,
  aiAdvice,
  onOpenAddModal,
  onOpenScan,
  onSyncBank,
  settings,
  setActiveTab
}) => {
  const t = translations[settings.language];

  // Calculate totals
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Chart data simulation from recent transactions
  const chartData = [
    { day: '14 Nov', balance: totalBalance - 450000 },
    { day: '16 Nov', balance: totalBalance - 250000 },
    { day: '18 Nov', balance: totalBalance - 120000 },
    { day: '20 Nov', balance: totalBalance },
  ];

  const pendingBills = bills.filter(b => !b.isPaid);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-200" /> Kakeibo Kiyowo Planner
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              {settings.language === 'id' ? 'Halo, Keuanganmu Terkendali! ✨' : 'Hello, Your Finances are Safe! ✨'}
            </h2>
            <p className="text-pink-100 text-sm max-w-xl font-medium">
              {settings.language === 'id' 
                ? 'Kaito & Sakura siap membantumu mengelola anggaran, tagihan, dan tabungan harian dengan mudah.'
                : 'Kaito & Sakura are ready to help you manage budgets, bills, and savings with ease.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenAddModal('expense')}
              className="px-4 py-2.5 bg-white text-pink-600 hover:bg-pink-50 font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> {t.addTransaction}
            </button>
            <button
              onClick={onOpenScan}
              className="px-4 py-2.5 bg-pink-600/60 hover:bg-pink-600 text-white font-bold text-xs rounded-2xl backdrop-blur-md border border-white/30 transition-all flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" /> {t.scanReceipt}
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Balance */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.totalBalance}</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {formatCurrency(totalBalance, settings.currency)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 4 {settings.language === 'id' ? 'Akun Aktif & Tersinkron' : 'Active Synced Accounts'}
          </div>
        </div>

        {/* Monthly Income */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.monthlyIncome}</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {formatCurrency(totalIncome, settings.currency)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.5% {settings.language === 'id' ? 'dari bulan lalu' : 'from last month'}
          </div>
        </div>

        {/* Monthly Expense */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.monthlyExpense}</span>
            <div className="w-10 h-10 rounded-2xl bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {formatCurrency(totalExpense, settings.currency)}
          </div>
          <div className="flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" /> -4.2% {settings.language === 'id' ? 'lebih hemat' : 'more saved'}
          </div>
        </div>

        {/* Savings Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t.savingsRate}</span>
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            {savingsRate}%
          </div>
          <div className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> {settings.language === 'id' ? 'Target: 30% per bulan' : 'Goal: 30% per month'}
          </div>
        </div>
      </div>

      {/* Main Grid: Chart & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {settings.language === 'id' ? 'Tren Saldo & Arus Kas' : 'Balance & Cashflow Trend'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {settings.language === 'id' ? 'Pergerakan keuangan 7 hari terakhir' : 'Last 7 days financial movement'}
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
            >
              {settings.language === 'id' ? 'Lihat Detail →' : 'View Details →'}
            </button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `${v / 1000000}jt`} />
                <Tooltip 
                  formatter={(val: any) => [formatCurrency(Number(val) || 0, settings.currency), 'Saldo']}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Financial Advisor Box */}
        <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-200 dark:border-pink-900/50 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.aiAdvisor}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Gemini AI Kiyowo Insights</p>
              </div>
            </div>

            <div className="space-y-3">
              {aiAdvice.length > 0 ? (
                aiAdvice.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900/80 rounded-2xl p-3.5 border border-pink-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.advice}</p>
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-4 text-center">
                  <p className="text-xs text-slate-500">Kaito & Sakura siap menganalisis keuanganmu!</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('analytics')}
            className="mt-4 w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            {t.askAiTips}
          </button>
        </div>
      </div>

      {/* Recent Transactions & Bills Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.recentTransactions}</h3>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
            >
              {settings.language === 'id' ? 'Semua Transaksi →' : 'All Transactions →'}
            </button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/55 transition-all border border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-base ${
                    tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-pink-100 dark:bg-pink-950/60 text-pink-600'
                  }`}>
                    {tx.type === 'income' ? '📥' : '🛍️'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tx.merchant}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{tx.category} • {formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className={`text-xs font-extrabold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bills Reminder */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.billsDueSoon}</h3>
            <span className="text-xs bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 font-bold px-2 py-0.5 rounded-full">
              {pendingBills.length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingBills.length > 0 ? (
              pendingBills.map((bill) => (
                <div key={bill.id} className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{bill.title}</span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">{formatCurrency(bill.amount, settings.currency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                    <span>Jatuh tempo: {formatDate(bill.dueDate)}</span>
                    <button 
                      onClick={() => setActiveTab('bills')}
                      className="text-pink-600 dark:text-pink-400 font-bold hover:underline"
                    >
                      {t.markAsPaid}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-slate-500">Semua tagihan bulan ini sudah lunas! 🎉</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
