class Call {
  constructor({ id, number, startAt, endAt, downloadLink, state }) {
    this.id = id;
    this.number = number;
    this.startAt = startAt || new Date().toISOString();
    this.endAt = endAt;
    this.downloadLink = downloadLink;
    this.state = state;
  }
}

module.exports = Call;
