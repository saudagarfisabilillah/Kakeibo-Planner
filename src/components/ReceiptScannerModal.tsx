import React, { useState } from 'react';
import { Receipt, Upload, Sparkles, Camera, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (tx: Omit<Transaction, 'id'>) => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  isOpen,
  onClose,
  onScanComplete
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await fetch('/api/ai/scan-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType: file.type || 'image/jpeg' }),
        });

        const data = await res.json();
        if (data.success && data.data) {
          setScannedData(data.data);
        } else {
          setError(data.error || 'Gagal memindai struk.');
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan jaringan.');
      } finally {
        setScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!scannedData) return;
    onScanComplete({
      date: scannedData.date || new Date().toISOString().slice(0, 10),
      type: 'expense',
      amount: Number(scannedData.amount) || 50000,
      category: scannedData.category || 'Belanja & Supermarket',
      merchant: scannedData.merchant || 'Merchant Struk',
      accountId: 'acc-1',
      note: scannedData.note || 'Hasil Scan Struk AI'
    });
    onClose();
    setScannedData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-pink-500 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Pemindai Struk AI Gemini</h3>
              <p className="text-[10px] text-slate-500">Ekstrak otomatis struk belanja dengan AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        {!scannedData ? (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-pink-300 dark:border-pink-800 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50/50 dark:hover:bg-slate-800 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white mb-1">Upload Foto Struk / Nota</span>
              <span className="text-[10px] text-slate-500 text-center">PNG, JPG, atau WEBP hingga 10MB</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {scanning && (
              <div className="text-center py-4">
                <div className="inline-block w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-xs font-bold text-pink-600">Gemini sedang membaca struk belanjamu...</p>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-xs text-center font-medium">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-3">
                <CheckCircle2 className="w-4 h-4" /> Struk Berhasil Dianalisis AI!
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant:</span>
                  <strong className="text-slate-900 dark:text-white">{scannedData.merchant}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total:</span>
                  <strong className="text-slate-900 dark:text-white">Rp {Number(scannedData.amount)?.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori:</span>
                  <strong className="text-slate-900 dark:text-white">{scannedData.category}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <strong className="text-slate-900 dark:text-white">{scannedData.date}</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setScannedData(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-bold"
              >
                Scan Ulang
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-violet-600 text-white rounded-2xl text-xs font-bold shadow-md"
              >
                Simpan Transaksi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
