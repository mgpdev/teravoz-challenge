const actionsController = require("../controllers/actions.ctrl");

module.exports = router => {
  router.route("/actions").post(actionsController.handle);
};
