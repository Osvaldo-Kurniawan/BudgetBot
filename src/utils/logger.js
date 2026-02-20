/**
 * Logger Utility
 */

const { BOT_SETTINGS } = require("../config/constants");

const log = (level, message, data = null) => {
  if (!BOT_SETTINGS.LOG_ENABLED) return;

  const timestamp = new Date().toISOString();
  const prefix = {
    info: "ℹ️",
    success: "✅",
    warn: "⚠️",
    error: "❌",
  }[level] || "📌";

  console.log(`${prefix} [${timestamp}] ${message}`, data ? data : "");
};

module.exports = {
  log,
  logInfo: (msg, data) => log("info", msg, data),
  logSuccess: (msg, data) => log("success", msg, data),
  logWarn: (msg, data) => log("warn", msg, data),
  logError: (msg, data) => log("error", msg, data),
};
