const webhook = require('./webhook')
const queues = require('./queues')

module.exports = (router) => {
  webhook(router),
  queues(router)
}