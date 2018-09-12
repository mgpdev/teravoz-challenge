const CallSimulator = require("./../src/services/call-simulator");

describe("CallSimulator", () => {
  const webhookSequence = [];
  const webhook = event => {
    webhookSequence.push(event.type);
  };
  const startId = 1000;
  let simulator = new CallSimulator({
    webhookService: webhook,
    startId,
    delayBetweenEvents: 100,
    delayCallOngoing: 100,
    cacheKey: "unit-test-calls",
    clearCache: true
  });

  test("Webhook should receive the events sequence call.new -> call.standby", done => {
    simulator.start(10000);
    setTimeout(() => {
      const sequence = ["call.new", "call.standby"];
      expect(webhookSequence).toEqual(sequence);
      done();
    }, 1000);
  });

  test("Webhook should receive the events sequence call.waiting -> actor.entered -> call.ongoing -> actor.left -> call.finished", done => {
    simulator.simulateAfterDelegate(startId + 1);
    setTimeout(() => {
      const sequence = [
        "call.new",
        "call.standby",
        "call.waiting",
        "actor.entered",
        "call.ongoing",
        "actor.left",
        "call.finished"
      ];
      expect(webhookSequence).toEqual(sequence);
      simulator.stop();
      done();
    }, 2000);
  });
});
