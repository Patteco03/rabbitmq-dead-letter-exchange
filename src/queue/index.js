class Queue {
  constructor(channel) {
    this.channel = channel;
  }

  publish(exchange, routingKey, data) {
    console.log("Sending delayed message");

    return this.channel.publish(exchange, routingKey, Buffer.from(data));
  }

  async consume(channel, queue, handle) {
    console.log("Waiting for consume.");

    return channel.consume(queue, async (msg) => {
      try {
        console.log("Received new message.");
        console.log(msg.content.toString());

        await handle();

        channel.ack(msg);
      } catch (error) {
        console.error("ocorreu um erro");
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

  async bindQueue(nameQueue, exchange, routingKey = "") {
    await this.channel.bindQueue(nameQueue, exchange, routingKey);
  }
}

module.exports = Queue;
