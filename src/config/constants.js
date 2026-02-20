/**
 * Bot Constants & Configuration
 */

const COMMANDS = {
  HELP: ["help", "?", "menu", "panduan"],
  RINGKASAN: "ringkasan",
  DELETE: "hapus pengeluaran",
  SET_INCOME: "set income",
  PROGRESS: "progress tabungan",
  ADD_TRANSACTION: "+",
  PING: "!ping",
};

const MESSAGES = {
  HELP: `📘 Panduan singkat

• Tambah pengeluaran: +<kategori> <jumlah> <deskripsi>
  Contoh: +ngopi 15000 kopi susu

• Ringkasan: ringkasan [jumlahHari|tanggal]
  Contoh: ringkasan 3  atau  ringkasan 05-06

• Hapus: hapus pengeluaran [tanggal]
  (balas daftar dengan nomor untuk menghapus)

• Set income: set income <jumlah> tabungan <target>
  Contoh: set income 5000000 tabungan 1500000

• Progress tabungan: progress tabungan

Ketik "help" untuk panduan lengkap.`,

  REMINDER: (date, example) => `👋 Hai! Belum ada pengeluaran tercatat untuk ${date}.
Ketik: +kategori jumlah deskripsi
Contoh: ${example}`,

  ERRORS: {
    INVALID_RANGE: "Rentang hari harus 0–360.",
    INVALID_DATE: "Format tanggal tidak dikenali.",
    INVALID_FORMAT: "Format tidak valid.",
    NO_TRANSACTIONS_TODAY: "Belum ada transaksi hari ini.",
    NO_INCOME: "Belum ada data income bulan ini. Ketik: set income <jumlah> tabungan <target>",
    NO_TRANSACTION_FOUND: (num) => `Transaksi nomor ${num} tidak ditemukan.`,
    FAILED_DELETE: "Gagal menghapus transaksi.",
    INVALID_INCOME_FORMAT: "Format salah. Contoh: set income 5000000 tabungan 1000000",
    EXCEEDS_LIMIT: (category, limit, today, amount) =>
      `Peringatan: ${category} melebihi limit harian (Limit: Rp${limit}). Hari ini: Rp${today}. Akan dicatat: Rp${amount}`,
    GENERAL: "Terjadi kesalahan, coba lagi nanti.",
  },

  SUCCESS: {
    DELETE: (category, amount, desc) => `${category} - Rp${amount} dihapus.`,
    ADD: (category, amount, desc) => `${category} - Rp${amount.toLocaleString()} dicatat.`,
    INCOME: (month, income, target, daily) => `Income ${month} disimpan. Max harian: Rp${daily}`,
  },

  SHEETS: {
    TRANSAKSI: "Transaksi",
    INCOME: "Income",
  },

  DATE_FORMATS: ["DD-MM-YYYY", "DD-MM-YY", "DD-MM", "DD/MM/YYYY", "DD/MM/YY", "DD/MM", "D/M", "D-M"],
};

const BOT_SETTINGS = {
  BROWSER: ["PengeluaranBot", "Chrome", "1.0"],
  LOGGER_LEVEL: "silent",
  LOG_ENABLED: true,
  SCHEDULE_REMINDER: "0 0 15 * * *", // Setiap 15:00 UTC
};

module.exports = {
  COMMANDS,
  MESSAGES,
  BOT_SETTINGS,
};
