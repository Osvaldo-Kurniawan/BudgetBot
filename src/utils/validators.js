/**
 * Date & Format Validators
 */

const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const { MESSAGES } = require("../config/constants");

const parseTanggal = (input, formats) => {
  for (const format of formats) {
    const parsed = dayjs(input, format, true);
    if (parsed.isValid()) {
      const now = dayjs();
      // Jika hanya DD-MM, tambahkan tahun sekarang
      if (input.match(/^(\d{1,2})[-/](\d{1,2})$/)) {
        return parsed.year(now.year());
      }
      return parsed;
    }
  }
  return null;
};

const validateTransactionFormat = (cleanLine) => {
  const match = cleanLine.match(/(.+?)\s+(\d+(?:\.\d+)?)(?:\s+(.*))?$/);
  if (!match) return null;

  return {
    kategori: match[1].trim(),
    nominal: parseFloat(match[2]),
    deskripsi: (match[3] || "-").trim(),
  };
};

const validateIncomeFormat = (text) => {
  const regex = /^set income (\d+)\s+tabungan\s+(\d+)/i;
  const match = text.match(regex);
  if (!match) return null;

  return {
    totalIncome: parseInt(match[1]),
    targetTabungan: parseInt(match[2]),
  };
};

const validateDaysRange = (days) => {
  const daysInt = parseInt(days);
  if (isNaN(daysInt) || daysInt < 0 || daysInt > 360) {
    return false;
  }
  return true;
};

module.exports = {
  parseTanggal,
  validateTransactionFormat,
  validateIncomeFormat,
  validateDaysRange,
};
