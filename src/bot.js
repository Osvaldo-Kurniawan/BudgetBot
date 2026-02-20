/**
 * Bot Initialization & Main Logic
 */

require("dotenv").config();

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("baileys");
const pino = require("pino");
const schedule = require("node-schedule");
const qrcode = require("qrcode-terminal");

const { BOT_SETTINGS } = require("./config/constants");
const { registerMessageHandlers } = require("./services/whatsappService");
const { broadcastReminderPengeluaran } = require("./services/broadcastService");

const startBot = async () => {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("auth");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: BOT_SETTINGS.LOGGER_LEVEL }),
      markOnlineOnConnect: true,
      browser: BOT_SETTINGS.BROWSER,
    });

    // Save credentials on update
    sock.ev.on("creds.update", saveCreds);

    // Connection event handler
    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log("📱 Scan QR berikut untuk login:\n");
        qrcode.generate(qr, { small: true });
        console.log(qr);
      }

      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log("❗ Connection closed. Reconnecting:", shouldReconnect);

        if (shouldReconnect) {
          setTimeout(() => startBot(), 5000);
        } else {
          console.log("⚠️ Logged out. Please run: rm -rf auth/ && npm start");
        }
      } else if (connection === "open") {
        console.log("✅ Connected to WhatsApp");
      }
    });

    // Register message handlers
    registerMessageHandlers(sock);

    // Schedule Daily Reminder Broadcast
    schedule.scheduleJob(BOT_SETTINGS.SCHEDULE_REMINDER, async () => {
      console.log("🔔 Menjalankan broadcast reminder pengeluaran...");
      await broadcastReminderPengeluaran(sock);
    });

    console.log("🤖 Bot initialized successfully");
  } catch (error) {
    console.error("❌ Error starting bot:", error);
    process.exit(1);
  }
};

module.exports = { startBot };
