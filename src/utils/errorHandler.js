/**
 * Error Handler Utility
 */

const { MESSAGES } = require("../config/constants");

class BotError extends Error {
  constructor(message, code = "UNKNOWN_ERROR") {
    super(message);
    this.code = code;
    this.name = "BotError";
  }
}

const handleError = async (sock, sender, error) => {
  console.error(`❌ Error handling message from ${sender}:`, error);

  let message = MESSAGES.ERRORS.GENERAL;

  if (error instanceof BotError) {
    message = error.message;
  } else if (error.message?.includes("Sheet")) {
    message = `❗ Database error: ${error.message}`;
  }

  try {
    await sock.sendMessage(sender, { text: message });
  } catch (sendError) {
    console.error("Failed to send error message:", sendError);
  }
};

module.exports = {
  BotError,
  handleError,
};
