const redisClient = require("../utils/redis-client");

class Customer {
  constructor({ number, lastCall }) {
    this.number = number;
    this.lastCall = lastCall || new Date().toISOString();
  }

  static getCustomerCacheKey(number) {
    return `api-calls-customer-${number}`;
  }

  static async findByNumber(number) {
    const customer = await redisClient.getAsync(
      Customer.getCustomerCacheKey(number)
    );
    return customer ? JSON.parse(customer) : null;
  }

  async add() {
    this.number
      ? redisClient.setAsync(
          Customer.getCustomerCacheKey(this.number),
          JSON.stringify(this)
        )
      : null;
  }
}

module.exports = Customer;
