const conn = require("./queue/connection");
const Queue = require("./queue");

(async () => {
  const channel = await conn();
  const queue = new Queue(channel);

  const deadLetterExchange = "routing.deadletter";
  const failedExchange = "routing.failed";
  const retryExchange = "routing.retry";

  //** Config failed and retry */
  await queue.assertExchange(deadLetterExchange, "headers");
  await queue.assertExchange(failedExchange, "fanout");
  await queue.assertExchange(retryExchange, "direct");

  queue.assertQueue("queue.failed", {
    autoDelete: false,
    durable: true,
    arguments: {
      "x-queue-mode": "lazy",
    },
  });

  queue.assertQueue("queue.deadletter", {
    autoDelete: false,
    durable: true,
  });

  queue.assertQueue("queue.retry.1.1000", {
    autoDelete: true,
    durable: true,
    arguments: {
      count: 1,
      "x-dead-letter-exchange": retryExchange,
      "x-message-ttl": 1000,
    },
  });

  queue.assertQueue("queue.retry.2.5000", {
    autoDelete: true,
    durable: true,
    arguments: {
      count: 2,
      "x-dead-letter-exchange": retryExchange,
      "x-message-ttl": 5000,
    },
  });

  queue.assertQueue("queue.retry.3.10000", {
    autoDelete: true,
    durable: true,
    arguments: {
      count: 3,
      "x-dead-letter-exchange": retryExchange,
      "x-message-ttl": 10000,
    },
  });

  await queue.bindQueue("queue.failed", failedExchange);
  await queue.bindQueue("queue.deadletter", deadLetterExchange, "", {
    count: -1,
    deadLetter: true,
    "x-match": "any",
  });
  await queue.bindQueue("queue.retry.1.1000", deadLetterExchange, "", {
    count: 1,
    "x-match": "all",
  });
  await queue.bindQueue("queue.retry.2.5000", deadLetterExchange, "", {
    count: 2,
    "x-match": "all",
  });
  await queue.bindQueue("queue.retry.3.10000", deadLetterExchange, "", {
    count: 3,
    "x-match": "all",
  });

  // ** main configs */
  const mainExchange = "Events.BookOrdered";
  const mainQueue = "TestApp1.Events.BookOrdered";

  await queue.assertExchange(mainExchange, "direct");
  queue.assertQueue(mainQueue, {
    autoDelete: false,
    durable: true,
    arguments: {
      "x-dead-letter-exchange": failedExchange,
      "x-dead-letter-routing-key": mainQueue,
      "x-expires": 3600000,
    },
  });
  await queue.bindQueue(mainQueue, mainExchange, mainExchange);
  await queue.bindQueue(mainQueue, retryExchange, mainQueue);

  console.log("success register queues");
  process.exit();
})();
