import { Transaction } from '../types';
import jsPDF from 'jspdf';

export function exportTransactionsToCSV(transactions: Transaction[]) {
  const headers = ['ID', 'Tanggal', 'Jenis', 'Jumlah (IDR)', 'Kategori', 'Merchant', 'Akun ID', 'Catatan'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type,
    t.amount,
    `"${t.category}"`,
    `"${t.merchant}"`,
    t.accountId,
    `"${t.note || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + 
    [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `kakeibo_kiyowo_laporan_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportTransactionsToPDF(transactions: Transaction[], totalIncome: number, totalExpense: number) {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text('Kakeibo Kiyowo - Laporan Keuangan Audit', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);
  doc.text(`Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}`, 14, 35);
  doc.text(`Total Pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}`, 14, 42);

  doc.setFontSize(14);
  doc.setTextColor(30, 30, 30);
  doc.text('Daftar Transaksi Terakhir:', 14, 54);

  let y = 62;
  doc.setFontSize(10);

  transactions.slice(0, 25).forEach((t, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    const sign = t.type === 'income' ? '+' : '-';
    const text = `${t.date} | ${t.merchant} (${t.category}) | ${sign}Rp ${t.amount.toLocaleString('id-ID')}`;
    doc.text(text, 14, y);
    y += 8;
  });

  doc.save(`kakeibo_audit_report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
