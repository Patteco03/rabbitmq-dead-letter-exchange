const conn = require("./queue/connection");
const Queue = require("./queue");

(async () => {
  const channel = await conn();
  const queue = new Queue(channel);

  const mainExchange = "demo-exchange";
  const mainQueue = "demo-queue";

  const deadLetterExchange = "demo-dead-letter-exchange";
  const deadLetterQueue = "demo-dead-letter-queue";

  //** main exchange  */
  await queue.assertExchange(mainExchange);
  queue.assertQueue(mainQueue, {
    autoDelete: false,
    durable: true,
    arguments: {
      "x-queue-mode": "lazy",
      "x-dead-letter-exchange": deadLetterExchange,
      "x-message-ttl": 1000,
    },
  });
  await queue.bindQueue(mainQueue, mainExchange, mainQueue);

  //** dead letter exchange */
  await queue.assertExchange(deadLetterExchange, "fanout");
  queue.assertQueue(deadLetterQueue, {
    autoDelete: false,
    durable: true,
    arguments: {
      "x-queue-mode": "lazy",
    },
  });
  await queue.bindQueue(deadLetterQueue, deadLetterExchange);

  // register dlx-exchange and dlx queue
  // await queue.registerQueue(
  //   { exchange: { exName: deadLetterExchange, type: "fanout" } },
  //   {
  //     queue: {
  //       qName: deadLetterQueue,
  //       routingKey: "",
  //       options: {
  //         autoDelete: false,
  //         durable: true,
  //         arguments: {
  //           "x-queue-mode": "lazy",
  //         },
  //       },
  //     },
  //   }
  // );

  // register demo queue
  // await queue.registerQueue(
  //   { exchange: { exName: mainExchange } },
  //   {
  //     queue: {
  //       qName: mainQueue,
  //       routingKey: mainQueue,
  //       options: {
  //         autoDelete: false,
  //         durable: true,
  //         arguments: {
  //           "x-queue-mode": "lazy",
  //           "x-dead-letter-exchange": deadLetterExchange,
  //         },
  //       },
  //     },
  //   }
  // );

  console.log("success register queues");
  process.exit();
})();
