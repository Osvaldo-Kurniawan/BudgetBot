/**
 * Delete Transaction Command
 */

const dayjs = require("dayjs");
const { MESSAGES } = require("../config/constants");
const { laporanHariIni, hapusTransaksiRow } = require("../services/spreadsheetService");
const { parseTanggal } = require("../utils/validators");

const handleDeleteTransaction = async (sock, sender, parts) => {
  let tanggal = null;
  if (parts.length >= 3) {
    tanggal = parts.slice(2).join(" ");
  }

  let data;
  let displayDate;

  if (tanggal) {
    const parsed = parseTanggal(tanggal, MESSAGES.DATE_FORMATS);

    if (!parsed) {
      await sock.sendMessage(sender, { text: MESSAGES.ERRORS.INVALID_DATE });
      return;
    }

    data = await laporanHariIni(sender, parsed.format("YYYY-MM-DD"));
    displayDate = parsed.format("DD-MM-YYYY");
  } else {
    data = await laporanHariIni(sender);
    displayDate = null;
  }

  if (data.length === 0) {
    if (displayDate) {
      await sock.sendMessage(sender, { text: `⚠️ Tidak ada pengeluaran di tanggal ${displayDate}.` });
    } else {
      await sock.sendMessage(sender, { text: MESSAGES.ERRORS.NO_TRANSACTIONS_TODAY });
    }
    return;
  }

  const list = data
    .map((r, i) => {
      const kategori = r.Kategori || r._rawData[3] || "-";
      const nominal = r.Nominal || r._rawData[4] || "0";
      const deskripsi = r.Deskripsi || r._rawData[5] || "-";
      return `${i + 1}. ${kategori} - Rp${nominal} (${deskripsi})`;
    })
    .join("\n");

  const title = displayDate ? `Daftar Pengeluaran Tanggal ${displayDate}` : `Daftar Pengeluaran Hari Ini`;

  await sock.sendMessage(sender, {
    text: `🗑️ *${title}:*\n\n${list}\n\n➡️ *Balas pesan ini* dengan nomor transaksi untuk menghapus.`,
  });
};

const handleConfirmDelete = async (sock, sender, nomor, quotedText) => {
  if (isNaN(nomor)) {
    await sock.sendMessage(sender, { text: MESSAGES.ERRORS.INVALID_FORMAT });
    return;
  }

  // Extract tanggal dari quoted message
  const matchTanggal = quotedText.match(/Tanggal (\d{2}[-/]\d{2}(?:[-/]\d{2,4})?)/);
  let tanggalInput = null;

  if (matchTanggal) {
    const parsed = parseTanggal(matchTanggal[1], MESSAGES.DATE_FORMATS);
    if (parsed) {
      tanggalInput = parsed.format("YYYY-MM-DD");
    }
  }

  const data = await laporanHariIni(sender, tanggalInput);
  const transaksi = data[nomor - 1];

  if (!transaksi) {
    await sock.sendMessage(sender, { text: MESSAGES.ERRORS.NO_TRANSACTION_FOUND(nomor) });
    return;
  }

  const success = await hapusTransaksiRow(transaksi);
  if (success) {
    const kategori = transaksi.Kategori || transaksi._rawData?.[3] || "-";
    const nominal = transaksi.Nominal || transaksi._rawData?.[4] || 0;
    const deskripsi = transaksi.Deskripsi || transaksi._rawData?.[5] || "-";

    await sock.sendMessage(sender, {
      text: MESSAGES.SUCCESS.DELETE(kategori, nominal, deskripsi),
    });
  } else {
    await sock.sendMessage(sender, { text: MESSAGES.ERRORS.FAILED_DELETE });
  }
};

module.exports = { handleDeleteTransaction, handleConfirmDelete };
