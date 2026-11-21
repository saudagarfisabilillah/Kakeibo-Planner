import React, { useState, useEffect } from 'react';
import { 
  initialTransactions, 
  initialCategories, 
  initialAccounts, 
  initialBills, 
  initialSettings,
  initialBadges,
  initialJournals,
  initialGoals
} from './data/initialData';
import { Transaction, Category, Account, Bill, AppSettings, AIAdviceItem, ChibiMood, Badge, JournalEntry, FinancialGoal } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { TransactionsView } from './components/TransactionsView';
import { BudgetsView } from './components/BudgetsView';
import { AccountsView } from './components/AccountsView';
import { BillsView } from './components/BillsView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { BadgesView } from './components/BadgesView';
import { GoalsView } from './components/GoalsView';
import { ChibiMascot } from './components/ChibiMascot';
import { ThemeToggleFloating } from './components/ThemeToggleFloating';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { PinLockModal } from './components/PinLockModal';
import { translations } from './utils/i18n';
import confetti from 'canvas-confetti';

export default function App() {
  // Local storage persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('kakeibo_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('kakeibo_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem('kakeibo_accounts');
    return saved ? JSON.parse(saved) : initialAccounts;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('kakeibo_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('kakeibo_badges');
    return saved ? JSON.parse(saved) : initialBadges;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('kakeibo_journals');
    return saved ? JSON.parse(saved) : initialJournals;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('kakeibo_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('kakeibo_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [aiAdvice, setAiAdvice] = useState<AIAdviceItem[]>([
    {
      title: 'Keseimbangan Arus Kas Prima',
      advice: 'Pemasukan bulan ini melampaui pengeluaran sebesar 58%. Pertahankan kedisiplinan menabung di akun utama!',
      type: 'success'
    },
    {
      title: 'Optimalisasi Anggaran Kuliner',
      advice: 'Pengeluaran kategori Makanan & Minuman masih berada dalam batas aman 65% dari kuota bulanan.',
      type: 'info'
    }
  ]);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('kakeibo_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kakeibo_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kakeibo_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('kakeibo_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('kakeibo_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('kakeibo_journals', JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem('kakeibo_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('kakeibo_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // Fetch AI Advice from backend
  const fetchAiAdvice = async () => {
    try {
      const res = await fetch('/api/ai/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, language: settings.language }),
      });
      const data = await res.json();
      if (data.success && data.advice) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.error('Failed to fetch AI advice:', err);
    }
  };

  useEffect(() => {
    fetchAiAdvice();
  }, []);

  // Reward points and check level up
  const addPoints = (amount: number) => {
    setSettings(prev => {
      const newPoints = prev.points + amount;
      const pointsNeededForLevelUp = prev.level * 200;
      let newLevel = prev.level;
      if (newPoints >= pointsNeededForLevelUp) {
        newLevel += 1;
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      }
      return { ...prev, points: newPoints, level: newLevel };
    });
  };

  // Handlers
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: 'tx-' + Date.now(),
    };
    setTransactions(prev => [newTx, ...prev]);

    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === newTx.accountId) {
        const diff = newTx.type === 'income' ? newTx.amount : -newTx.amount;
        return { ...acc, balance: acc.balance + diff };
      }
      return acc;
    }));

    // Reward points for discipline
    addPoints(15);
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setAccounts(prev => prev.map(acc => {
        if (acc.id === tx.accountId) {
          const diff = tx.type === 'income' ? -tx.amount : tx.amount;
          return { ...acc, balance: acc.balance + diff };
        }
        return acc;
      }));
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddJournal = (newJournalData: Omit<JournalEntry, 'id'>) => {
    const newJournal: JournalEntry = {
      ...newJournalData,
      id: 'journal-' + Date.now(),
    };
    setJournals(prev => [newJournal, ...prev]);
    addPoints(20);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleAddGoal = (newGoalData: Omit<FinancialGoal, 'id'>) => {
    const newGoal: FinancialGoal = {
      ...newGoalData,
      id: 'goal-' + Date.now(),
    };
    setGoals(prev => [newGoal, ...prev]);
    addPoints(30);
  };

  const handleAddFunds = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return { ...g, currentAmount: g.currentAmount + amount };
      }
      return g;
    }));
    addPoints(25);
  };

  const handleUpdateBudget = (categoryId: string, newBudget: number) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, budget: newBudget } : c));
    addPoints(25);
  };

  const handleToggleBillPaid = (id: string) => {
    setBills(prev => prev.map(b => {
      if (b.id === id) {
        const updatedStatus = !b.isPaid;
        if (updatedStatus) {
          addPoints(40);
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        return { ...b, isPaid: updatedStatus };
      }
      return b;
    }));
  };

  const handleAddBill = (newBillData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...newBillData,
      id: 'bill-' + Date.now(),
    };
    setBills(prev => [newBill, ...prev]);
    addPoints(20);
  };

  const handleSyncAccount = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        return { ...acc, lastSynced: new Date().toISOString() };
      }
      return acc;
    }));
    addPoints(10);
  };

  const handleResetData = () => {
    if (window.confirm('Reset seluruh data ke pengaturan awal?')) {
      setTransactions(initialTransactions);
      setCategories(initialCategories);
      setAccounts(initialAccounts);
      setBills(initialBills);
      setBadges(initialBadges);
      setSettings(initialSettings);
      localStorage.clear();
    }
  };

  const t = translations[settings.language];

  // Calculate Chibi mood & speech
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 50;

  const chibiMood: ChibiMood = savingsRate > 25 ? 'happy' : savingsRate > 10 ? 'thinking' : 'worried';
  const chibiSpeech = savingsRate > 25 
    ? t.chibiGreetingHappy 
    : savingsRate > 10 
    ? t.chibiGreetingNeutral 
    : t.chibiGreetingWarning;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-pink-500 selection:text-white transition-colors">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        setSettings={setSettings}
        onLockApp={() => setIsLocked(true)}
        onOpenScan={() => setIsScanOpen(true)}
        onSyncBank={() => handleSyncAccount('acc-1')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            categories={categories}
            accounts={accounts}
            bills={bills}
            aiAdvice={aiAdvice}
            onOpenAddModal={() => setActiveTab('transactions')}
            onOpenScan={() => setIsScanOpen(true)}
            onSyncBank={() => handleSyncAccount('acc-1')}
            settings={settings}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            categories={categories}
            accounts={accounts}
            journals={journals}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onAddJournal={handleAddJournal}
            settings={settings}
            onOpenScan={() => setIsScanOpen(true)}
          />
        )}

        {activeTab === 'budgets' && (
          <BudgetsView
            categories={categories}
            transactions={transactions}
            onUpdateBudget={handleUpdateBudget}
            settings={settings}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountsView
            accounts={accounts}
            onSyncAccount={handleSyncAccount}
            settings={settings}
          />
        )}

        {activeTab === 'bills' && (
          <BillsView
            bills={bills}
            onTogglePaid={handleToggleBillPaid}
            onAddBill={handleAddBill}
            settings={settings}
          />
        )}

        {activeTab === 'goals' && (
          <GoalsView
            goals={goals}
            onAddGoal={handleAddGoal}
            onAddFunds={handleAddFunds}
            settings={settings}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            transactions={transactions}
            categories={categories}
            aiAdvice={aiAdvice}
            onRefreshAdvice={fetchAiAdvice}
            settings={settings}
          />
        )}

        {activeTab === 'badges' && (
          <BadgesView
            badges={badges}
            settings={settings}
            lang={settings.language}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Interactive Chibi Kiyowo Mascot */}
      <ChibiMascot
        mood={chibiMood}
        speechText={chibiSpeech}
        onAskAi={() => setActiveTab('analytics')}
        lang={settings.language}
      />

      {/* Floating Theme Toggle */}
      <ThemeToggleFloating
        settings={settings}
        setSettings={setSettings}
      />

      {/* Receipt Scanner Modal */}
      <ReceiptScannerModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScanComplete={handleAddTransaction}
      />

      {/* PIN Lock Modal */}
      <PinLockModal
        isOpen={isLocked || (settings.pinCode !== null && sessionStorage.getItem('kakeibo_unlocked') !== 'true')}
        onUnlock={() => {
          setIsLocked(false);
          sessionStorage.setItem('kakeibo_unlocked', 'true');
        }}
        correctPin={settings.pinCode || '1234'}
        lang={settings.language}
      />
    </div>
  );
}
