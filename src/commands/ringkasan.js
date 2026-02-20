/**
 * Ringkasan (Summary) Command
 */

const dayjs = require("dayjs");
const { MESSAGES } = require("../config/constants");
const { laporanHariIni, getIncomeData } = require("../services/spreadsheetService");
const { parseTanggal, validateDaysRange } = require("../utils/validators");

const handleRingkasan = async (sock, sender, args) => {
  const today = dayjs();
  let allData = [];
  let header = "📅 Ringkasan:";

  try {
    const incomeData = await getIncomeData(sender);
    const maxHarian = parseFloat(incomeData?.MaxHarian || incomeData?._rawData?.[4] || 0);

    // ringkasan (tanpa argumen): hanya hari ini
    if (args.length === 1) {
      const data = await laporanHariIni(sender, today.format("YYYY-MM-DD"));
      allData = data;
      header = `📅 Ringkasan: Hari ini (${today.format("DD/MM/YYYY")})`;
    } 
    // ringkasan <jumlah hari>
    else if (/^\d+$/.test(args[1])) {
      if (!validateDaysRange(args[1])) {
        await sock.sendMessage(sender, { text: MESSAGES.ERRORS.INVALID_RANGE });
        return;
      }

      const daysBack = parseInt(args[1]);
      for (let i = 0; i <= daysBack; i++) {
        const tanggal = today.subtract(i, "day").format("YYYY-MM-DD");
        const data = await laporanHariIni(sender, tanggal);
        allData.push(...data);
      }
      header = `📅 Ringkasan: ${daysBack} hari terakhir`;
    } 
    // ringkasan <tanggal spesifik>
    else {
      const tanggalRaw = args[1];
      const parsed = parseTanggal(tanggalRaw, MESSAGES.DATE_FORMATS);

      if (!parsed) {
        await sock.sendMessage(sender, { text: MESSAGES.ERRORS.INVALID_DATE });
        return;
      }

      const data = await laporanHariIni(sender, parsed.format("YYYY-MM-DD"));
      allData = data;
      header = `📅 Ringkasan: ${parsed.format("DD/MM/YYYY")}`;
    }

    // Format hasil
    const total = allData.reduce((acc, item) => acc + parseFloat(item.Nominal || item._rawData?.[4] || 0), 0);
    let summary = allData
      .map((r) => {
        const kategori = r.Kategori || r._rawData?.[3] || "-";
        const nominal = r.Nominal || r._rawData?.[4] || 0;
        const deskripsi = r.Deskripsi || r._rawData?.[5] || "-";
        return `• ${kategori} - Rp${nominal.toLocaleString()} (${deskripsi})`;
      })
      .join("\n");

    summary = summary || "Tidak ada transaksi.";
    const sisa = maxHarian - total;

    await sock.sendMessage(sender, {
      text: `${header}\n${summary}\n\n💰 *Total: Rp${total.toLocaleString()}*\n👛 *Sisa: Rp${sisa.toLocaleString()}*`,
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { handleRingkasan };
