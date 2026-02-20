/**
 * Ping Command
 */

const os = require("os");
const axios = require("axios");

const handlePing = async (sock, sender) => {
  const start = Date.now();

  // IP Lokal
  const interfaces = os.networkInterfaces();
  let ipLocal = "Tidak diketahui";

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        ipLocal = iface.address;
        break;
      }
    }
    if (ipLocal !== "Tidak diketahui") break;
  }

  // IP Publik
  let ipPublic = "Gagal mendapatkan IP publik";
  try {
    const res = await axios.get("https://api.ipify.org?format=json");
    ipPublic = res.data.ip;
  } catch (err) {
    console.error("Gagal ambil IP publik:", err.message);
  }

  const waktu = new Date().toLocaleString("id-ID");
  const latency = Date.now() - start;

  await sock.sendMessage(sender, {
    text: `🏓 *Pong!*\nBot aktif dan responsif.

    🕒 Waktu Server: ${waktu}
    🌐 IP Lokal: ${ipLocal}
    🌍 IP Publik: ${ipPublic}
    📶 Ping: ${latency} ms`,
  });
};

module.exports = { handlePing };
