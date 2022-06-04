const Queue = require("../queue");
const AmqpConnection = require("../queue/connection");

(async () => {
  const channel = await AmqpConnection();

  const queue = new Queue(channel);

  const sendQueue = () =>
    queue.publish(
      "demo-exchange",
      "demo-queue",
      "Over the Hills and Far Away!"
    );

  setInterval(() => sendQueue(), 3000);
})();
