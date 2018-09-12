const logger = require("../utils/logger");
const redisClient = require("../utils/redis-client");
const webSocket = require("./web-socket");

const extNewCustomers = process.env.EXT_NEW_CUSTOMERS || 900;
const extReturningCustomers = process.env.EXT_RETURNING_CUSTOMERS || 901;
const extFinisehd = process.env.EXT_FINISHED_CALLS || 999;
const extPrefix = `api-calls-queue-`;

var listOfNewCustomerCalls = {};
var listOfReturningCustomerCalls = {};
var listOfFinishedCalls = {};

function cloneCall(call) {
  return JSON.parse(JSON.stringify(call));
}

function persistCallLists() {
  logger("Persist queues of calls");
  redisClient.setAsync(
    extPrefix + extNewCustomers,
    JSON.stringify(listOfNewCustomerCalls)
  );
  redisClient.setAsync(
    extPrefix + extReturningCustomers,
    JSON.stringify(listOfReturningCustomerCalls)
  );
  redisClient.setAsync(
    extPrefix + extFinisehd,
    JSON.stringify(listOfFinishedCalls)
  );
}

function getCallsReverse(list, limit) {
  if (!list || list.length === 0) return [];
  list = Object.values(list);
  list = list.reverse();
  return JSON.stringify(limit ? list.slice(0, limit) : list);
}

function refreshQueues(persist) {
  logger("Refresh queues of calls");
  webSocket.emitEvent(extNewCustomers, getCallsReverse(listOfNewCustomerCalls));
  webSocket.emitEvent(
    extReturningCustomers,
    getCallsReverse(listOfReturningCustomerCalls)
  );
  webSocket.emitEvent(extFinisehd, getCallsReverse(listOfFinishedCalls, 10));
  persist && persistCallLists();
}

async function load() {
  logger("Loading queues of calls");

  let newCustomerCalls = await redisClient.getAsync(
    extPrefix + extNewCustomers
  );
  listOfNewCustomerCalls = newCustomerCalls ? JSON.parse(newCustomerCalls) : {};

  let returningCustomerCalls = await redisClient.getAsync(
    extPrefix + extReturningCustomers
  );
  listOfReturningCustomerCalls = returningCustomerCalls
    ? JSON.parse(returningCustomerCalls)
    : {};

  let finishedCalls = await redisClient.getAsync(extPrefix + extFinisehd);
  listOfFinishedCalls = finishedCalls ? JSON.parse(finishedCalls) : {};

  refreshQueues(false);
}

function addCallToQueue(queue, call) {
  logger(`Add call ${call.id} to queue ${queue}`);
  switch (queue) {
    case extNewCustomers:
      listOfNewCustomerCalls[call.id] = call;
      break;
    case extReturningCustomers:
      listOfReturningCustomerCalls[call.id] = call;
      break;
  }
  refreshQueues(true);
}

function updateCallStateByEvent(event) {
  callId = event.call_id;
  state = event.type;
  logger(`Update call ${callId} to the state ${state}`);
  switch (state) {
    case "call.ongoing":
      if (listOfNewCustomerCalls[callId])
        listOfNewCustomerCalls[callId].state = state;
      else if (listOfReturningCustomerCalls[callId])
        listOfReturningCustomerCalls[callId].state = state;
      break;
    case "call.finished":
      let callObj;
      if (listOfNewCustomerCalls[callId]) {
        callObj = cloneCall(listOfNewCustomerCalls[callId]);
        delete listOfNewCustomerCalls[callId];
      } else if (listOfReturningCustomerCalls[callId]) {
        callObj = cloneCall(listOfReturningCustomerCalls[callId]);
        delete listOfReturningCustomerCalls[callId];
      }
      if (callObj) {
        callObj.state = state;
        callObj.endAt = new Date().toISOString();
        // TODO Get this url in the next event
        callObj.downloadLink = "http://www.download.com";
        listOfFinishedCalls[callId] = callObj;
      }
      break;
  }
  refreshQueues(true);
}

module.exports = {
  load,
  addCallToQueue,
  updateCallStateByEvent
};
