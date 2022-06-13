class Queue {
  constructor(channel) {
    this.channel = channel;
  }

  publish(exchange, routingKey, data) {
    console.log("Sending delayed message");

    return this.channel.publish(exchange, routingKey, Buffer.from(data));
  }

  async consume(channel, queue, handle) {
    return channel.consume(queue, async (msg) => {
      try {
        await handle();
        console.log("[Success received]: ", msg.content.toString(), "\n");

        channel.ack(msg);
      } catch (error) {
        console.log("[Error]: boom!");
        channel.nack(msg, false, false);
      }
    });
  }

  async assertExchange(exchange, type = "direct") {
    return await this.channel.assertExchange(exchange, type);
  }

  assertQueue(nameQueue, args = {}) {
    return this.channel.assertQueue(nameQueue, args);
  }

  async bindQueue(nameQueue, exchange, routingKey = "", args = {}) {
    await this.channel.bindQueue(nameQueue, exchange, routingKey, args);
  }
}

module.exports = Queue;
