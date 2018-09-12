const webhookController = require("../controllers/webhook.ctrl");

module.exports = router => {
  router.route("/webhook").post(webhookController.handle);
};
