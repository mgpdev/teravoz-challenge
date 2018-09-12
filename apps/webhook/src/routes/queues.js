const redisClient = require("./../utils/redis-client");

module.exports = router => {
  router.route("/queues").get((req, res, next) => {
    if (req && req.query && req.query.action === "clear") {
      redisClient.clearCache();
      res.sendStatus(200);
      next();
    } else {
      res.sendStatus(400);
      next();
    }
  });
};
