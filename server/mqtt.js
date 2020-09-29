var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", function () {
  client.subscribe("+", function (err) {
    if (!err) {
      client.publish("output", "10");
    }
  });
});

client.on("message", (topic, message, packet) => {
  console.log(packet.topic + " : " + packet.payload.toString());
});
