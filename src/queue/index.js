class Queue {
  constructor(channel) {
    this.channel = channel;
  }

  async registerQueue(
    { exchange: { exName, type } },
    { queue: { qName, options, routingKey } }
  ) {
    try {
      await this._assertExchange(exName, type);
      this._assertQueue(qName, options);

      await this._bindQueue(qName, exName, routingKey);
    } catch (error) {
      throw error;
    }
  }

  publish(exchange, routingKey, data) {
    console.log("Sending delayed message");

    return this.channel.publish(exchange, routingKey, Buffer.from(data));
  }

  async consume(channel, queue, args = {}) {
    try {
      console.log("Waiting for consume.");

      return channel.consume(
        queue,
        function (msg) {
          console.log("Received new message.");
          console.log(msg.content.toString());

          //channel.nack(msg, false, false); // reject
          channel.ack(msg); // accept
        },
        args
      );
    } catch (err) {
      throw err;
    }
  }

  _assertQueue(nameQueue, args = {}) {
    return this.channel.assertQueue(nameQueue, args);
  }

  async _assertExchange(exchange, type = "direct") {
    return await this.channel.assertExchange(exchange, type);
  }

  async _bindQueue(nameQueue, exchange, routingKey = "") {
    await this.channel.bindQueue(nameQueue, exchange, routingKey);
  }
}

module.exports = Queue;
