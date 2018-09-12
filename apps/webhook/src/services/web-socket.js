const logger = require("./../utils/logger");

var io;

module.exports = {
  setServer: server => {
    logger("Setting web socket server..");
    io = require("socket.io")(server);
    io.on("connection", function(socket) {
      console.log("Dashboard connected");
      socket.on("disconnect", function() {
        console.log("Dashboard disconnected");
      });
    });
  },
  emitEvent: (queue, data) => {
    logger(`Emitting event for queue ${queue}`);
    io.sockets.emit(queue, data);
  }
};
