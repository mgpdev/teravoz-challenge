const axios = require("axios");
const logger = require("../utils/logger");

const webhookEndpoint =
  process.env.WS_WEBHOOK_ENDPOINT || "http://localhost:3001/webhook";

module.exports = async event => {
  try {
    logger(`Sending new event ${event.type} for`, webhookEndpoint);
    await axios.post(webhookEndpoint, event, { timeout: 5000 });
    logger("Event sent");
  } catch (err) {
    logger("Error to send event", err.message);
  }
};
