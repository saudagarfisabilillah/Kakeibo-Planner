import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  FileText, 
  Trash2, 
  Edit3, 
  Receipt,
  Calendar,
  CheckCircle2,
  BookOpen,
  Smile,
  Heart
} from 'lucide-react';
import { Transaction, Category, Account, JournalEntry, AppSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { translations } from '../utils/i18n';
import { exportTransactionsToCSV, exportTransactionsToPDF } from '../utils/export';

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  journals: JournalEntry[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onAddJournal: (j: Omit<JournalEntry, 'id'>) => void;
  settings: AppSettings;
  onOpenScan: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  categories,
  accounts,
  journals,
  onAddTransaction,
  onDeleteTransaction,
  onAddJournal,
  settings,
  onOpenScan
}) => {
  const t = translations[settings.language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);

  // Form state for Transaction
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formType, setFormType] = useState<'income' | 'expense'>('expense');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.name || 'Makanan & Minuman');
  const [formMerchant, setFormMerchant] = useState('');
  const [formAccountId, setFormAccountId] = useState(accounts[0]?.id || 'acc-1');
  const [formNote, setFormNote] = useState('');

  // Form state for Journal
  const [journalDate, setJournalDate] = useState(new Date().toISOString().slice(0, 10));
  const [journalMood, setJournalMood] = useState('😊 Puas & Bijak');
  const [journalNote, setJournalNote] = useState('');

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.note.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tx.category === selectedCategory;
    const matchesType = selectedType === 'all' || tx.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMerchant || !formAmount) return;

    onAddTransaction({
      date: formDate,
      type: formType,
      amount: Number(formAmount),
      category: formCategory,
      merchant: formMerchant,
      accountId: formAccountId,
      note: formNote
    });

    setIsModalOpen(false);
    setFormMerchant('');
    setFormAmount('');
    setFormNote('');
  };

  const handleJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalNote) return;

    onAddJournal({
      date: journalDate,
      mood: journalMood,
      note: journalNote
    });

    setIsJournalModalOpen(false);
    setJournalNote('');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.transactions}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Kelola catatan pemasukan, pengeluaran, dan jurnal refleksi harian</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs rounded-2xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t.addTransaction}
          </button>
          <button
            onClick={() => setIsJournalModalOpen(true)}
            className="px-4 py-2 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 rounded-2xl text-xs font-bold flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" /> Tulis Jurnal Refleksi
          </button>
          <button
            onClick={onOpenScan}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Receipt className="w-4 h-4" /> {t.scanReceipt}
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="all">{t.allCategories}</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e: any) => setSelectedType(e.target.value)}
          className="w-full md:w-36 px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="all">{t.type}: Semua</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-3.5 px-6">Merchant & Catatan</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Akun</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-6 text-right">Jumlah</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                          tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-pink-100 dark:bg-pink-950/60 text-pink-600'
                        }`}>
                          {tx.type === 'income' ? '📥' : '🏷️'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{tx.merchant}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{tx.note || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {accounts.find(a => a.id === tx.accountId)?.name || 'Utama'}
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                      {formatDate(tx.date)}
                    </td>
                    <td className={`py-4 px-6 text-right font-black ${
                      tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                        title={t.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Tidak ada transaksi ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Journal Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-violet-600 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Jurnal Refleksi Keuangan (Mindfulness)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Catat perasaan dan kebiasaan belanja harianmu untuk menjaga kesadaran finansial</p>
            </div>
          </div>
          <button
            onClick={() => setIsJournalModalOpen(true)}
            className="px-3.5 py-2 bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border border-pink-200 dark:border-pink-800 rounded-2xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tulis Refleksi
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {journals.map(j => (
            <div key={j.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 rounded-full text-[11px] font-bold">
                    {j.mood}
                  </span>
                  <span className="text-[10px] text-slate-400">{formatDate(j.date)}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{j.note}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.addTransaction}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${formType === 'expense' ? 'bg-pink-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${formType === 'income' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.merchant}</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Kenangan, Tokopedia, Gaji"
                  value={formMerchant}
                  onChange={(e) => setFormMerchant(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.amount} (IDR)</label>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.date}</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.category}</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.account}</label>
                  <select
                    value={formAccountId}
                    onChange={(e) => setFormAccountId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {accounts.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">{t.note}</label>
                <input
                  type="text"
                  placeholder="Catatan tambahan (opsional)"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

      {/* Add Journal Modal */}
      {isJournalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Tulis Jurnal Refleksi</h3>
              <button onClick={() => setIsJournalModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleJournalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Perasaan / Mood Hari Ini</label>
                <select
                  value={journalMood}
                  onChange={(e) => setJournalMood(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="😊 Puas & Bijak">😊 Puas & Bijak</option>
                  <option value="😌 Tenang">😌 Tenang</option>
                  <option value="💸 Impulsif">💸 Impulsif</option>
                  <option value="😰 Cemas / Menyesal">😰 Cemas / Menyesal</option>
                  <option value="🔥 Semangat Menabung">🔥 Semangat Menabung</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Refleksi Keuangan</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan bagaimana kebiasaan belanja atau keputusan finansialmu hari ini..."
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsJournalModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl text-xs font-bold shadow-md"
                >
                  Simpan Jurnal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
