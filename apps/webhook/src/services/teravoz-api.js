const axios = require("axios");
const logger = require("../utils/logger");

const teravozActionsEndpoint = process.env.WS_TERAVOZ
  ? `${process.env.WS_TERAVOZ}/actions`
  : "http://localhost:3002/actions";

async function sendAction(action) {
  try {
    logger(
      `Sending action ${action.type} to extension ${action.destination} for`,
      teravozActionsEndpoint
    );
    return await axios.post(teravozActionsEndpoint, action, { timeout: 5000 });
  } catch (err) {
    logger("Error to send action", err.message);
  }
}

module.exports = {
  sendAction
};
