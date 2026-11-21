import { Account, Category, Bill, Transaction, AppSettings, Badge } from '../types';

export const initialAccounts: Account[] = [
  { id: 'acc-1', name: 'Bank BCA Utama', type: 'bank', balance: 14550000, accountNumber: '***4589', icon: 'Landmark', lastSynced: '2026-11-20T10:30:00Z' },
  { id: 'acc-2', name: 'GoPay / E-Wallet', type: 'ewallet', balance: 850000, accountNumber: '0812***8899', icon: 'Wallet', lastSynced: '2026-11-20T11:15:00Z' },
  { id: 'acc-3', name: 'Mandiri Payroll', type: 'bank', balance: 6200000, accountNumber: '***9921', icon: 'Building2', lastSynced: '2026-11-19T09:00:00Z' },
  { id: 'acc-4', name: 'Dompet Tunai (Cash)', type: 'cash', balance: 450000, accountNumber: 'Cash', icon: 'Banknote', lastSynced: '2026-11-20T08:00:00Z' },
];

export const initialCategories: Category[] = [
  { id: 'cat-1', name: 'Makanan & Minuman', icon: 'Utensils', budget: 3000000, color: 'bg-amber-500', type: 'expense' },
  { id: 'cat-2', name: 'Transportasi', icon: 'Car', budget: 1500000, color: 'bg-blue-500', type: 'expense' },
  { id: 'cat-3', name: 'Belanja & Supermarket', icon: 'ShoppingBag', budget: 2000000, color: 'bg-pink-500', type: 'expense' },
  { id: 'cat-4', name: 'Tagihan & Utilitas', icon: 'FileText', budget: 1800000, color: 'bg-purple-500', type: 'expense' },
  { id: 'cat-5', name: 'Hiburan & Langganan', icon: 'Film', budget: 750000, color: 'bg-indigo-500', type: 'expense' },
  { id: 'cat-6', name: 'Kesehatan & Olahraga', icon: 'HeartPulse', budget: 600000, color: 'bg-emerald-500', type: 'expense' },
  { id: 'cat-7', name: 'Gaji & Pendapatan', icon: 'Briefcase', budget: 0, color: 'bg-green-600', type: 'income' },
  { id: 'cat-8', name: 'Freelance & Sampingan', icon: 'Laptop', budget: 0, color: 'bg-teal-500', type: 'income' },
];

export const initialBills: Bill[] = [
  { id: 'bill-1', title: 'Listrik PLN & Air', amount: 450000, dueDate: '2026-11-25', category: 'Tagihan & Utilitas', recurring: 'monthly', isPaid: false, autoPay: true },
  { id: 'bill-2', title: 'Internet Fiber WiFi', amount: 375000, dueDate: '2026-11-28', category: 'Tagihan & Utilitas', recurring: 'monthly', isPaid: false, autoPay: false },
  { id: 'bill-3', title: 'Sewa Apartemen', amount: 3500000, dueDate: '2026-12-01', category: 'Tagihan & Utilitas', recurring: 'monthly', isPaid: false, autoPay: false },
  { id: 'bill-4', title: 'Netflix & Spotify Family', amount: 189000, dueDate: '2026-11-22', category: 'Hiburan & Langganan', recurring: 'monthly', isPaid: true, autoPay: true },
];

export const initialTransactions: Transaction[] = [
  { id: 'tx-1', date: '2026-11-20', type: 'expense', amount: 65000, category: 'Makanan & Minuman', merchant: 'Kopi Kenangan Senopati', accountId: 'acc-2', note: 'Es Kopi Susu & Roti' },
  { id: 'tx-2', date: '2026-11-19', type: 'expense', amount: 125000, category: 'Transportasi', merchant: 'GrabCar Commute', accountId: 'acc-2', note: 'Pulang kantor macet' },
  { id: 'tx-3', date: '2026-11-18', type: 'expense', amount: 485000, category: 'Belanja & Supermarket', merchant: 'Supermarket Ranch Market', accountId: 'acc-1', note: 'Belanja mingguan sayur & buah' },
  { id: 'tx-4', date: '2026-11-15', type: 'income', amount: 12500000, category: 'Gaji & Pendapatan', merchant: 'PT Inovasi Digital Nusantara', accountId: 'acc-3', note: 'Gaji Bulan November' },
  { id: 'tx-5', date: '2026-11-12', type: 'expense', amount: 350000, category: 'Makanan & Minuman', merchant: 'Sushi Tei Grand Indonesia', accountId: 'acc-1', note: 'Makan malam bersama rekan tim' },
  { id: 'tx-6', date: '2026-11-10', type: 'income', amount: 3200000, category: 'Freelance & Sampingan', merchant: 'Klien UI/UX Proyek', accountId: 'acc-1', note: 'Bonus desain aplikasi mobile' },
];

export const initialBadges: Badge[] = [
  {
    id: 'badge-1',
    title: 'Pencatat Pertama ✨',
    description: 'Catat transaksi pertama Anda di Kakeibo Kiyowo',
    icon: '📝',
    unlocked: true,
    unlockedAt: '2026-11-10',
    pointsReward: 50
  },
  {
    id: 'badge-2',
    title: 'Master Anggaran 🎯',
    description: 'Menjaga pengeluaran di bawah anggaran dalam kategori utama',
    icon: '🛡️',
    unlocked: true,
    unlockedAt: '2026-11-15',
    pointsReward: 100
  },
  {
    id: 'badge-3',
    title: 'Raja Menabung 👑',
    description: 'Mencapai rasio tabungan di atas 30% bulan ini',
    icon: '💰',
    unlocked: true,
    unlockedAt: '2026-11-18',
    pointsReward: 150
  },
  {
    id: 'badge-4',
    title: 'Pembayar Tepat Waktu ⚡',
    description: 'Melunasi semua tagihan bulanan tepat waktu',
    icon: '⚡',
    unlocked: false,
    pointsReward: 100
  },
  {
    id: 'badge-5',
    title: 'Kiyowo Financial Guru 🌸',
    description: 'Mencapai Level 5 dan mengumpulkan 500 Poin kedisiplinan',
    icon: '🌟',
    unlocked: false,
    pointsReward: 250
  },
];

export const initialJournals = [
  {
    id: 'j-1',
    date: '2026-11-20',
    mood: '😊 Puas & Bijak',
    note: 'Hari ini berhasil menahan diri untuk tidak beli jajan berlebihan. Senang rasanya melihat sisa anggaran aman!'
  },
  {
    id: 'j-2',
    date: '2026-11-18',
    mood: '😌 Tenang',
    note: 'Membayar semua kebutuhan pokok mingguan di awal. Perencanaan keuangan terasa lebih teratur.'
  }
];

export const initialGoals = [
  {
    id: 'goal-1',
    title: 'Dana Darurat 6 Bulan',
    targetAmount: 25000000,
    currentAmount: 14550000,
    deadline: '2026-12-31',
    icon: '🛡️',
    color: 'bg-emerald-500'
  },
  {
    id: 'goal-2',
    title: 'MacBook Pro M3',
    targetAmount: 22000000,
    currentAmount: 8500000,
    deadline: '2027-03-30',
    icon: '💻',
    color: 'bg-blue-500'
  },
  {
    id: 'goal-3',
    title: 'Liburan ke Jepang 🌸',
    targetAmount: 15000000,
    currentAmount: 4200000,
    deadline: '2027-06-15',
    icon: '✈️',
    color: 'bg-pink-500'
  }
];

export const initialSettings: AppSettings = {
  currency: 'IDR',
  language: 'id',
  darkMode: true,
  pinCode: null,
  biometricEnabled: false,
  encryptionEnabled: true,
  cloudSyncEnabled: true,
  lastCloudSync: '2026-11-20T12:00:00Z',
  points: 300,
  level: 3,
};
