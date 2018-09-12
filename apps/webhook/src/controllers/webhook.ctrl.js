const Customer = require("./../models/customer");
const handleTeravozEvents = require("../services/handle-teravoz-events");

function resolveEvent(body) {
  return new Promise(async resolve => {
    const { type, their_number, timestamp } = body;
    let customerNumber, customerObj, isNewCustomer;
    if (
      handleTeravozEvents.isNewCall(type) &&
      their_number &&
      (customerNumber = their_number.toString().replace(/\D/g, ""))
    ) {
      customerObj = await Customer.findByNumber(customerNumber);
      if (!customerObj) {
        customerObj = new Customer({
          number: customerNumber,
          lastCall: timestamp
        });
        await customerObj.add();
        isNewCustomer = true;
      } else {
        isNewCustomer = false;
      }
    }
    handleTeravozEvents.handle({
      customer: customerObj,
      isNewCustomer,
      ...body
    });
    resolve();
  });
}

module.exports = {
  handle: (req, res, next) => {
    const { type } = req.body;
    if (!type && !handleTeravozEvents.isValidType(type)) {
      res.sendStatus(400);
      next();
    } else {
      resolveEvent(req.body);
      res.sendStatus(200);
      next();
    }
  }
};
