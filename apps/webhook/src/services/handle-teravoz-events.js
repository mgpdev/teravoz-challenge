const logger = require("../utils/logger");
const Customer = require("./../models/customer");
const Call = require("./../models/call");
const teravozApi = require("./teravoz-api");
const handleQueues = require("./handle-queues");

const extNewCustomers = process.env.EXT_NEW_CUSTOMERS || 900;
const extReturningCustomers = process.env.EXT_RETURNING_CUSTOMERS || 901;

async function defaultEventHandle(event) {
  let customer = await Customer.findByNumber(event.their_number);
  let msg = "";
  if (customer) {
    msg = `from the customer ${customer.number}`;
  } else {
    msg = "from unregistered customer";
  }
  logger(`New event ${event.type} received ${msg}`);
  switch (event.type) {
    case "call.ongoing":
    case "call.finished":
      handleQueues.updateCallStateByEvent(event);
      break;
  }
}

function standbyEventHandle(event) {
  logger(
    `New event ${event.type} received from the customer ${
      event.customer.number
    }`
  );
  const queue = event.isNewCustomer ? extNewCustomers : extReturningCustomers;
  teravozApi.sendAction({
    type: "delegate",
    call_id: event.call_id,
    destination: queue
  });
  handleQueues.addCallToQueue(
    queue,
    new Call({
      id: event.call_id,
      number: event.their_number,
      state: event.type
    })
  );
}

const eventTypes = {
  "call.new": {
    handle: event => {
      logger("");
      logger("----------------------");
      defaultEventHandle(event);
    }
  },
  "call.standby": {
    handle: standbyEventHandle
  },
  "call.waiting": {
    handle: defaultEventHandle
  },
  "actor.entered": {
    handle: defaultEventHandle
  },
  "call.ongoing": {
    handle: defaultEventHandle
  },
  "actor.left": {
    handle: defaultEventHandle
  },
  "call.finished": {
    handle: defaultEventHandle
  }
};

module.exports = {
  isValidType: type => {
    return Object.keys(eventTypes).indexOf(type) >= 0;
  },
  isNewCall: type => {
    return type === "call.standby";
  },
  handle: event => {
    const type = event ? event.type : null;
    if (!type || !eventTypes[type]) {
      return logger("Invalid teravoz event type");
    }
    eventTypes[type].handle(event);
  }
};
