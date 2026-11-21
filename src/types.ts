export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  amount: number;
  category: string;
  merchant: string;
  accountId: string;
  note: string;
  receiptUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  budget: number; // Monthly budget limit
  color: string;
  type: TransactionType;
}

export interface Account {
  id: string;
  name: string;
  type: 'bank' | 'ewallet' | 'cash' | 'credit';
  balance: number;
  accountNumber: string;
  icon: string;
  lastSynced?: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: string;
  recurring: 'monthly' | 'yearly' | 'once';
  isPaid: boolean;
  autoPay?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  pointsReward: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: string; // e.g. '😊 Puas & Bijak'
  note: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export type ChibiMood = 'happy' | 'excited' | 'worried' | 'thinking';

export interface AppSettings {
  currency: 'IDR' | 'USD' | 'EUR';
  language: 'id' | 'en';
  darkMode: boolean;
  pinCode: string | null;
  biometricEnabled: boolean;
  encryptionEnabled: boolean;
  cloudSyncEnabled: boolean;
  lastCloudSync: string | null;
  points: number;
  level: number;
}

export interface AIAdviceItem {
  title: string;
  advice: string;
  type: 'success' | 'warning' | 'info';
}
