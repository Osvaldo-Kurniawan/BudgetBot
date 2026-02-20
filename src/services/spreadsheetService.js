/**
 * Spreadsheet Service - Wrapper untuk Google Sheets
 */

const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");
const dayjs = require("dayjs");
const serviceAccount = require("../../service_account.json");
const { MESSAGES } = require("../config/constants");
const { logError } = require("../utils/logger");

const serviceAccountAuth = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const initDoc = async () => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
  await doc.loadInfo();
  return doc;
};

const getSheet = async (sheetName) => {
  const doc = await initDoc();
  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" tidak ditemukan`);
  }
  return sheet;
};

const generateCustomID = (date = new Date()) => {
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${month}${year}${MM}${dd}${HH}${mm}${ss}`;
};

// Transaction Operations
const appendTransaksi = async (user, kategori, nominal, deskripsi) => {
  const sheet = await getSheet(MESSAGES.SHEETS.TRANSAKSI);
  const now = new Date();
  const newRow = {
    ID: generateCustomID(now),
    Timestamp: now.toISOString(),
    User: user,
    Kategori: kategori,
    Nominal: nominal,
    Deskripsi: deskripsi,
  };
  await sheet.addRow(newRow);
};

const laporanHariIni = async (user, tanggalInput = null) => {
  const sheet = await getSheet(MESSAGES.SHEETS.TRANSAKSI);
  const rows = await sheet.getRows();

  let targetDate = dayjs();
  if (tanggalInput) {
    targetDate = dayjs(tanggalInput);
  }

  const targetStr = targetDate.format("YYYY-MM-DD");

  return rows.filter((r) => {
    const rowUser = r.User || r._rawData[2];
    const timestamp = r.Timestamp || r._rawData[1];
    const rowDate = timestamp?.split("T")[0];
    return rowUser === user && rowDate === targetStr;
  });
};

const hapusTransaksiRow = async (transaksi) => {
  const sheet = await getSheet(MESSAGES.SHEETS.TRANSAKSI);
  const rows = await sheet.getRows();

  const idTarget = transaksi.ID || transaksi._rawData?.[0];
  const row = rows.find((r) => (r.ID || r._rawData[0]) === idTarget);

  if (row) {
    await row.delete();
    return true;
  }
  return false;
};

// Income Operations
const setIncome = async (user, totalIncome, targetTabungan) => {
  const sheet = await getSheet(MESSAGES.SHEETS.INCOME);
  const rows = await sheet.getRows();

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const maxHarian = Math.floor((totalIncome - targetTabungan) / daysInMonth);

  const existing = rows.find(
    (r) => (r.User || r._rawData[0]) === user && (r.BulanAwal || r._rawData[1]) === timestamp
  );

  if (existing) {
    const rowUp = existing._rowNumber - 2;
    rows[rowUp].assign({
      IncomeBulan: totalIncome,
      TargetTabungan: targetTabungan,
      MaxHarian: maxHarian,
    });
    await rows[rowUp].save();
  } else {
    await sheet.addRow({
      User: user,
      BulanAwal: timestamp,
      IncomeBulan: totalIncome,
      TargetTabungan: targetTabungan,
      MaxHarian: maxHarian,
    });
  }

  return { timestamp, totalIncome, targetTabungan, maxHarian };
};

const getTotalPengeluaranBulanIni = async (user) => {
  const sheet = await getSheet(MESSAGES.SHEETS.TRANSAKSI);
  const rows = await sheet.getRows();

  const now = dayjs();

  const filtered = rows.filter((r) => {
    const rowUser = r.User || r._rawData[2];
    const timestamp = r.Timestamp || r._rawData[1];

    if (rowUser !== user || !timestamp) return false;

    const tgl = dayjs(timestamp);
    return tgl.isValid() && tgl.month() === now.month() && tgl.year() === now.year();
  });

  const total = filtered.reduce((acc, r) => acc + parseFloat(r.Nominal || r._rawData[4] || 0), 0);
  return total;
};

const getIncomeData = async (user) => {
  const sheet = await getSheet(MESSAGES.SHEETS.INCOME);
  const rows = await sheet.getRows();

  const bulanAwal = dayjs().startOf("month").format("YYYY-MM");

  const foundRow = rows.find((r) => {
    const rowUser = r.User || r._rawData[0];
    const rowBulan = r.BulanAwal || r._rawData[1];
    return rowUser === user && rowBulan === bulanAwal;
  });

  return foundRow || null;
};

// Broadcast reminder
const getAllUsersWithIncome = async () => {
  const sheet = await getSheet(MESSAGES.SHEETS.INCOME);
  const rows = await sheet.getRows();
  return rows.filter((r) => {
    const bulan = r.BulanAwal || r._rawData[1];
    return bulan === dayjs().format("YYYY-MM");
  });
};

module.exports = {
  appendTransaksi,
  laporanHariIni,
  hapusTransaksiRow,
  setIncome,
  getTotalPengeluaranBulanIni,
  getIncomeData,
  getAllUsersWithIncome,
};
