/**
 * WhatsApp Bot - Main bot logic
 */

const { COMMANDS, BOT_SETTINGS, MESSAGES } = require("../config/constants");
const { handleHelp } = require("../commands/help");
const { handleRingkasan } = require("../commands/ringkasan");
const { handleAddTransaction } = require("../commands/addTransaction");
const { handleDeleteTransaction, handleConfirmDelete } = require("../commands/deleteTransaction");
const { handleSetIncome, handleProgressTabungan } = require("../commands/income");
const { handlePing } = require("../commands/ping");
const { handleError } = require("../utils/errorHandler");
const { logError, logInfo } = require("../utils/logger");

const registerMessageHandlers = (sock) => {
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    // Debug: log incoming upsert type
    logInfo("messages.upsert event", { type });

    if (type !== "notify") return;

    const msg = messages[0];
    if (!msg || !msg.message || msg.key?.fromMe) return;

    const sender = msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    // Log incoming message for debugging
    logInfo("Incoming message", { sender, text });

    try {
      // Help command
      if (COMMANDS.HELP.includes(text.toLowerCase())) {
        await handleHelp(sock, sender);
      }
      // Ringkasan command
      else if (text.toLowerCase().startsWith(COMMANDS.RINGKASAN)) {
        const args = text.trim().split(" ");
        await handleRingkasan(sock, sender, args);
      }
      // Hapus pengeluaran command
      else if (text.toLowerCase().startsWith(COMMANDS.DELETE)) {
        const parts = text.trim().split(" ");
        await handleDeleteTransaction(sock, sender, parts);
      }
      // Handle reply untuk delete confirmation
      else if (msg?.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        const quoted = msg.message.extendedTextMessage.contextInfo.quotedMessage;

        let quotedText = "";
        if (quoted.conversation) {
          quotedText = quoted.conversation;
        } else if (quoted.extendedTextMessage?.text) {
          quotedText = quoted.extendedTextMessage.text;
        }

        if (/Daftar Pengeluaran (Hari Ini|Tanggal )/i.test(quotedText)) {
          const nomor = parseInt(text.trim());
          await handleConfirmDelete(sock, sender, nomor, quotedText);
        }
      }
      // Set income command
      else if (text.toLowerCase().startsWith(COMMANDS.SET_INCOME)) {
        await handleSetIncome(sock, sender, text);
      }
      // Progress tabungan command
      else if (text.toLowerCase().startsWith(COMMANDS.PROGRESS)) {
        await handleProgressTabungan(sock, sender);
      }
      // Add transaction command
      else if (text.startsWith(COMMANDS.ADD_TRANSACTION)) {
        await handleAddTransaction(sock, sender, text);
      }
      // Ping command
      else if (text.toLowerCase() === COMMANDS.PING) {
        await handlePing(sock, sender);
      }
    } catch (error) {
      logError("Message handler error:", error.message);
      await handleError(sock, sender, error);
    }
  });
};

module.exports = { registerMessageHandlers };
