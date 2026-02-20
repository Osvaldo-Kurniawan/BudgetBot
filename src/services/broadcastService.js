/**
 * Broadcast Service - Reminder penngeluaran harian
 */

const dayjs = require("dayjs");
const { MESSAGES } = require("../config/constants");
const { laporanHariIni, getAllUsersWithIncome } = require("./spreadsheetService");

const broadcastReminderPengeluaran = async (sock) => {
  try {
    const users = await getAllUsersWithIncome();
    const todayStr = dayjs().format("YYYY-MM-DD");
    const userSudahDiingatkan = new Set();

    for (const row of users) {
      const user = row.User || row._rawData[0];

      if (userSudahDiingatkan.has(user)) continue;

      // Cek apakah user sudah input pengeluaran hari ini
      const transaksiHariIni = await laporanHariIni(user, todayStr);
      const totalTransaksi = transaksiHariIni.length;

      if (totalTransaksi === 0) {
        const reminderMessage = MESSAGES.REMINDER(
          dayjs().format("DD-MM-YYYY"),
          "+ngopi 15000 kopi susu"
        );

        await sock.sendMessage(user, { text: reminderMessage });
        userSudahDiingatkan.add(user);
      }
    }

    console.log("✅ Broadcast reminder selesai");
  } catch (error) {
    console.error("❌ Error broadcast reminder:", error);
  }
};

module.exports = { broadcastReminderPengeluaran };
