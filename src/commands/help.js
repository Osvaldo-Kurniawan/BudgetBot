/**
 * Help Command
 */

const { MESSAGES } = require("../config/constants");

const handleHelp = async (sock, sender) => {
  await sock.sendMessage(sender, { text: MESSAGES.HELP });
};

module.exports = { handleHelp };
