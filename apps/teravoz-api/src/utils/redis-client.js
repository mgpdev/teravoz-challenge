const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient(
  process.env.REDIS_URL || "redis://localhost:6379"
);
client.on("error", err => {
  console.log("Error on redis client", err);
});

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client),
  quitClient: () => client.quit()
};
