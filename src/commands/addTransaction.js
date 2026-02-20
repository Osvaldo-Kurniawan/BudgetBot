/**
 * Add Transaction Command
 */

const { MESSAGES } = require("../config/constants");
const { appendTransaksi, laporanHariIni, getIncomeData } = require("../services/spreadsheetService");
const { validateTransactionFormat } = require("../utils/validators");

const handleAddTransaction = async (sock, sender, text) => {
  const lines = text.trim().split("\n").filter((line) => line.startsWith("+"));
  const hasil = [];

  for (const line of lines) {
    const cleanLine = line.substring(1).trim();
    const transaction = validateTransactionFormat(cleanLine);

    if (!transaction) {
      hasil.push(`❗ Format tidak valid: ${line}`);
      continue;
    }

    const { kategori, nominal, deskripsi } = transaction;

    // Validasi income
    const incomeData = await getIncomeData(sender);
    if (!incomeData) {
      await sock.sendMessage(sender, { text: MESSAGES.ERRORS.NO_INCOME });
      return;
    }

    // Cek limit harian
    const maxHarian = parseFloat(incomeData.MaxHarian || incomeData._rawData[4] || 0);
    const transaksiHariIni = await laporanHariIni(sender);
    const totalHariIni = transaksiHariIni.reduce(
      (acc, r) => acc + parseFloat(r.Nominal || r._rawData[4] || 0),
      0
    );
    const totalSetelah = totalHariIni + nominal;

    if (totalSetelah > maxHarian) {
      hasil.push(MESSAGES.ERRORS.EXCEEDS_LIMIT(kategori, maxHarian, totalHariIni, nominal));
    }

    // Simpan transaksi
    await appendTransaksi(sender, kategori, nominal, deskripsi);
    hasil.push(MESSAGES.SUCCESS.ADD(kategori, nominal, deskripsi));
  }

  const hasilText = hasil.join("\n\n");
  await sock.sendMessage(sender, { text: hasilText });
};

module.exports = { handleAddTransaction };
