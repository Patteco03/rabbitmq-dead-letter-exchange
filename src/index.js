const conn = require("./queue/connection");
const Queue = require("./queue");

(async () => {
  const channel = await conn();
  const queue = new Queue(channel);

  // register dlx-exchange and dlx queue
  await queue.registerQueue(
    { exchange: { exName: "dlx-exchange", type: "fanout" } },
    {
      queue: {
        qName: "demo-dlx-queue",
        routingKey: "",
        options: {
          autoDelete: false,
          durable: true,
          arguments: {
            "x-queue-mode": "lazy",
          },
        },
      },
    }
  );

  // register demo queue
  await queue.registerQueue(
    { exchange: { exName: "demo-exchange" } },
    {
      queue: {
        qName: "demo-queue",
        routingKey: "demo-queue",
        options: {
          autoDelete: false,
          durable: true,
          arguments: {
            "x-queue-mode": "lazy",
            "x-dead-letter-exchange": "dlx-exchange",
            "x-message-ttl": 15000,
          },
        },
      },
    }
  );

  console.log("success register queues");
  process.exit();
})();
