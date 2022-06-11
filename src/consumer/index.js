const Queue = require("../queue");
const AmqpConnection = require("../queue/connection");

function handler() {
  return Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
}

(async () => {
  const channel = await AmqpConnection();

  const queue = new Queue();
  await queue.consume(channel, "demo-queue", handler);
})();
