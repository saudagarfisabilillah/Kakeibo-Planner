import React, { useState } from 'react';
import { FileText, Plus, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { Bill, AppSettings } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { translations } from '../utils/i18n';
import confetti from 'canvas-confetti';

interface BillsViewProps {
  bills: Bill[];
  onTogglePaid: (id: string) => void;
  onAddBill: (bill: Omit<Bill, 'id'>) => void;
  settings: AppSettings;
}

export const BillsView: React.FC<BillsViewProps> = ({
  bills,
  onTogglePaid,
  onAddBill,
  settings
}) => {
  const t = translations[settings.language];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState('Tagihan & Utilitas');
  const [recurring, setRecurring] = useState<'monthly' | 'yearly' | 'once'>('monthly');

  const handleToggle = (id: string, currentStatus: boolean) => {
    onTogglePaid(id);
    if (!currentStatus) {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddBill({
      title,
      amount: Number(amount),
      dueDate,
      category,
      recurring,
      isPaid: false
    });

    setIsModalOpen(false);
    setTitle('');
    setAmount('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.bills}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Pengingat pembayaran tagihan bulanan tepat waktu agar arus kas tetap terkendali</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold text-xs rounded-2xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Tagihan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bills.map(bill => (
          <div key={bill.id} className={`p-5 rounded-3xl border transition-all ${
            bill.isPaid 
              ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-75' 
              : 'bg-white dark:bg-slate-900 border-pink-200 dark:border-pink-900/50 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                  bill.isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-pink-100 text-pink-600'
                }`}>
                  {bill.isPaid ? '✅' : '🔔'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{bill.title}</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{bill.category} • {bill.recurring}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-slate-900 dark:text-white">
                  {formatCurrency(bill.amount, settings.currency)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Jatuh tempo: {formatDate(bill.dueDate)}
              </span>
              <button
                onClick={() => handleToggle(bill.id, bill.isPaid)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                  bill.isPaid
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {bill.isPaid ? 'Sudah Lunas' : t.markAsPaid}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Tambah Tagihan Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Tagihan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cicilan Laptop, Asuransi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah (IDR)</label>
                <input
                  type="number"
                  required
                  placeholder="250000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Jatuh Tempo</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
    </div>
  );
};
