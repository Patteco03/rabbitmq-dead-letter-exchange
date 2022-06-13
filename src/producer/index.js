const Queue = require("../queue");
const AmqpConnection = require("../queue/connection");

(async () => {
  const channel = await AmqpConnection();

  const queue = new Queue(channel);

  const sendQueue = () =>
    queue.publish(
      "Events.BookOrdered",
      "Events.BookOrdered",
      "Over the Hills and Far Away!"
    );

  setInterval(() => sendQueue(), 500);
})();
