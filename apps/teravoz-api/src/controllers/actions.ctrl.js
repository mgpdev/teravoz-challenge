const delegate = require("./../services/delegate");

module.exports = {
  handle: (req, res, next) => {
    const { type } = req.body;
    if (!type) {
      res.sendStatus(400);
      next();
    }
    switch (type) {
      case "delegate":
        delegate(req, res, next);
        break;
      default:
        res.sendStatus(400);
        next();
    }
  }
};
