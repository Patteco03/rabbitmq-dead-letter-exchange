const Queue = require("../queue");
const AmqpConnection = require("../queue/connection");

(async () => {
  const channel = await AmqpConnection();

  const queue = new Queue();
  await queue.consume(channel, "demo-queue");
})();
