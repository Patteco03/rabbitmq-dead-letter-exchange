const Queue = require("../queue");
const AmqpConnection = require("../queue/connection");

function handler() {
  return Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
}

(async () => {
  const channel = await AmqpConnection();

  const queue = new Queue();
  await queue.consume(channel, "TestApp1.Events.BookOrdered", handler);

  channel.consume("queue.failed", (msg) => {
    const headers = msg.properties.headers;

    let countValue = headers["count"] || 0;
    let newCount = countValue + 1;

    if (newCount > 3) newCount = -1;

    console.log(
      `retrying message: ${msg.fields.routingKey}, count: ${newCount}`
    );

    headers["count"] = newCount;

    channel.publish("routing.deadletter", msg.fields.routingKey, msg.content, {
      headers,
    });

    channel.ack(msg, true);
  });

  console.log("Waiting for consume.");
})();
