const amqp = require("amqplib");
const url = "amqp://localhost";

const AmqpConnection = async () => {
  const conn = await amqp.connect(url);
  const channel = await conn.createChannel();

  return channel;
};

module.exports = AmqpConnection;
