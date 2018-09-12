class Call {
  constructor({ id, code, ourNumber, theirNumber, state }) {
    this.id = id || Math.floor(Math.random() * 100000000000 + 1);
    this.code = code || Math.floor(Math.random() * 100000 + 1);
    this.ourNumber = ourNumber || "0800000000";
    this.theirNumber = theirNumber;
    this.state = state || null;
  }

  callNew() {
    this.state = "call.new";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      direction: "inbound",
      our_number: this.ourNumber,
      their_number: this.theirNumber,
      their_number_type: "landline",
      timestamp: new Date().toISOString()
    };
  }

  callStandby() {
    this.state = "call.standby";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      direction: "inbound",
      our_number: this.ourNumber,
      their_number: this.theirNumber,
      timestamp: new Date().toISOString()
    };
  }

  callWaiting() {
    this.state = "call.waiting";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      direction: "inbound",
      our_number: this.ourNumber,
      their_number: this.theirNumber,
      timestamp: new Date().toISOString()
    };
  }

  actorEntered() {
    this.state = "actor.entered";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      actor: "user.name@email.com",
      number: "200",
      timestamp: new Date().toISOString()
    };
  }

  callOngoing() {
    this.state = "call.ongoing";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      direction: "inbound",
      our_number: this.ourNumber,
      their_number: this.theirNumber,
      timestamp: new Date().toISOString()
    };
  }

  actorLeft() {
    this.state = "actor.left";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      actor: "user.name@email.com",
      number: "200",
      timestamp: new Date().toISOString()
    };
  }

  callFinished() {
    this.state = "call.finished";
    return {
      type: this.state,
      call_id: this.id,
      code: this.code,
      direction: "inbound",
      our_number: this.ourNumber,
      their_number: this.theirNumber,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = Call;
