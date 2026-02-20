/**
 * Income & Savings Command
 */

const dayjs = require("dayjs");
const { MESSAGES } = require("../config/constants");
const { setIncome, getIncomeData, getTotalPengeluaranBulanIni } = require("../services/spreadsheetService");
const { validateIncomeFormat } = require("../utils/validators");

const handleSetIncome = async (sock, sender, text) => {
  const parsed = validateIncomeFormat(text);

  if (!parsed) {
    await sock.sendMessage(sender, { text: MESSAGES.ERRORS.INVALID_INCOME_FORMAT });
    return;
  }

  const { totalIncome, targetTabungan } = parsed;
  const result = await setIncome(sender, totalIncome, targetTabungan);

  const message = MESSAGES.SUCCESS.INCOME(
    result.timestamp,
    result.totalIncome,
    result.targetTabungan,
    result.maxHarian
  );

  await sock.sendMessage(sender, { text: message });
};

const handleProgressTabungan = async (sock, sender) => {
  const incomeData = await getIncomeData(sender);

  if (!incomeData) {
    await sock.sendMessage(sender, { text: MESSAGES.ERRORS.NO_INCOME });
    return;
  }

  const income = parseFloat(incomeData.IncomeBulan || incomeData._rawData[2] || 0);
  const target = parseFloat(incomeData.TargetTabungan || incomeData._rawData[3] || 0);

  const totalPengeluaran = await getTotalPengeluaranBulanIni(sender);
  const tabunganSaatIni = income - totalPengeluaran;
  const sisaTarget = target - tabunganSaatIni;
  const sisaBudget = tabunganSaatIni - target;
  const bulan = dayjs().format("MMMM YYYY");

  const status =
    sisaTarget <= 0
      ? "✅ Target tabungan tercapai atau melebihi!"
      : `⚠️ Target tabungan belum tercapai. Kurang Rp${sisaTarget.toLocaleString()}`;

  await sock.sendMessage(sender, {
    text: `📊 *Progress Tabungan Bulan Ini (${bulan}):*\n
    💰 Income Bulanan: *Rp${income.toLocaleString()}*
    🎯 Target Tabungan: *Rp${target.toLocaleString()}*
    💸 Total Pengeluaran: *Rp${totalPengeluaran.toLocaleString()}*
    💼 Tabungan Saat Ini: *Rp${tabunganSaatIni.toLocaleString()}*
    👛 Sisa Budget Bulan Ini : *Rp${sisaBudget.toLocaleString()}*

    ${status}`,
  });
};

module.exports = { handleSetIncome, handleProgressTabungan };
