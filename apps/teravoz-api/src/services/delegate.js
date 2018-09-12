const logger = require("../utils/logger");
const webhook = require("./webhook");
const CallSimulator = require("./call-simulator");

module.exports = async (req, res, next) => {
  const { call_id } = req.body;
  if (call_id) {
    new CallSimulator({ webhookService: webhook }).simulateAfterDelegate(
      call_id
    );
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
  next();
};
