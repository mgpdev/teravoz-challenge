import openSocket from "socket.io-client";

const socket = openSocket(process.env.WS_WEBHOOK || "http://localhost:3001");

function subscribeToQueue(queue, callbackFn) {
  socket.on(queue, data => callbackFn(data));
}

export { subscribeToQueue };
