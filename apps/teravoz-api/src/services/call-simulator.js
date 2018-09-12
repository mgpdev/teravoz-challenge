const Call = require("../utils/call");
const sleep = require("../utils/sleep");
const redisClient = require("../utils/redis-client");
const logger = require("../utils/logger");

class CallSimulator {
  constructor({
    webhookService,
    startId,
    delayBetweenEvents,
    delayCallOngoing,
    cacheKey,
    clearCache
  }) {
    this.webhookService = webhookService;
    this.calls = {};
    this.lastCallId = startId || 10000;
    this.delayBetweenEvents = delayBetweenEvents || 3000; // Events each 3 seg
    this.delayCallOngoing = delayCallOngoing || 10000; // Bla bla bla during 10 seg
    this.cacheKey = cacheKey || "teravoz-api-calls";
    this.interval;
    if (clearCache) {
      redisClient.setAsync(this.cacheKey, JSON.stringify({}));
    }
  }

  persistCalls() {
    logger("Persist calls..");
    redisClient.setAsync(this.cacheKey, JSON.stringify(this.calls));
  }

  async loadCalls() {
    logger("Loading calls..");
    let callList = await redisClient.getAsync(this.cacheKey);
    if (callList) {
      this.calls = JSON.parse(callList);
      let callIds;
      if ((callIds = Object.keys(this.calls)).length > 0) {
        this.lastCallId = callIds.reduce(
          (a, b) => (this.calls[a] > this.calls[b] ? a : b)
        );
      }
    }
  }

  async start(delay) {
    logger("Starting call simulator..");
    await this.loadCalls();
    this.simulateNewCall();
    this.interval = setInterval(() => {
      this.simulateNewCall();
    }, delay || 10000);
  }

  stop() {
    clearInterval(this.interval);
    redisClient.quitClient();
  }

  async sendEvent(event) {
    if (this.webhookService) {
      await this.webhookService(event);
    }
  }

  async simulateNewCall() {
    logger("");
    logger("----------------------");
    logger("Simulating new call..");
    this.lastCallId++;
    const id = this.lastCallId;
    const callObj = new Call({
      id,
      theirNumber: `1199864000${Math.floor(Math.random() * 6) + 1}`
    });

    await this.sendEvent(callObj.callNew());
    await sleep(this.delayBetweenEvents);
    await this.sendEvent(callObj.callStandby());

    this.calls[id] = callObj;
    this.persistCalls();
  }

  async simulateAfterDelegate(callId) {
    logger("Simulating after delegate..");

    await this.loadCalls();

    if (!callId || !this.calls[callId.toString()]) {
      logger("Call not found");
      return false;
    }

    const callObj = new Call(this.calls[callId]);

    logger("Delegate for", callObj);

    await this.sendEvent(callObj.callWaiting());
    await sleep(this.delayBetweenEvents);
    await this.sendEvent(callObj.actorEntered());
    await sleep(this.delayBetweenEvents);
    await this.sendEvent(callObj.callOngoing());
    await sleep(this.delayCallOngoing);
    await this.sendEvent(callObj.actorLeft());
    await sleep(this.delayBetweenEvents);
    await this.sendEvent(callObj.callFinished());

    delete this.calls[callId];
    this.persistCalls();
  }
}

module.exports = CallSimulator;
