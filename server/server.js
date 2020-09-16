const { AttributeIds, OPCUAClient, TimestampsToReturn, MessageSecurityMode, SecurityPolicy } = require("node-opcua");
const opcua = require("node-opcua");
const express = require("express");
const chalk = require("chalk");
const socketIO = require("socket.io");
const port = 3700;

// const endpointUrl = "opc.tcp://" + hostname + ":26543/UA/SampleServer";
const endpointUrl = "opc.tcp://phaisan-FA506IV:4840";
const nodeIdToMonitor = "ns=1;i=2007848000";
const connectionStrategy = {
  maxRetry: 1,
};

// const endpointUrl = "opc.tcp://localhost:4840/";
// const nodeIdToMonitor = "ns=1;s=2918202828";
const client = OPCUAClient.create({
  applicationName: "MyClient",
  connectionStrategy: connectionStrategy,
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  endpoint_must_exist: false,
});

(async () => {
  try {
    client.on("backoff", (retry, delay) => {
      console.log("Retrying to connect to ", endpointUrl, " attempt ", retry);
    });

    // step 1 : connect to
    console.log(" connecting to ", chalk.cyan(endpointUrl));
    await client.connect(endpointUrl);
    console.log(" connected to ", chalk.cyan(endpointUrl));

    const session = await client.createSession();
    console.log(" session created");

    const subscription = await session.createSubscription2({
      requestedPublishingInterval: 2000,
      requestedMaxKeepAliveCount: 20,
      requestedLifetimeCount: 6000,
      maxNotificationsPerPublish: 1000,
      publishingEnabled: true,
      priority: 10,
    });

    subscription
      .on("started", function () {
        console.log("subscription started for 2 seconds - subscriptionId=", subscription.subscriptionId);
      })
      .on("keepalive", function () {
        console.log("keepalive");
      })
      .on("terminated", function () {
        console.log("terminated");
      });

    // --------------------------------------------------------

    const io = socketIO.listen(3700);

    let nodesToWrite;

    io.sockets.on("connection", function (socket) {
      socket.on("getData", (data) => {
        //console.log("get" + data.value);
        nodesToWrite = [
          {
            nodeId: "ns=1;i=2995697241",
            attributeId: AttributeIds.Value,
            value: /*new DataValue(*/ {
              value: {
                /* Variant */
                dataType: opcua.DataType.Boolean,
                value: data.value,
              },
            },
          },
        ];
        session.write(nodesToWrite, function (err, statusCodes) {
          //console.log(nodesToWrite);
          console.log(statusCodes);
          if (!err) {
            console.log(" write ok");
          }
        });
      });
    });

    console.log("Listening on port " + port);

    // --------------------------------------------------------

    const itemToMonitor = {
      nodeId: nodeIdToMonitor,
      attributeId: AttributeIds.Value,
    };
    const parameters = {
      samplingInterval: 100,
      discardOldest: true,
      queueSize: 100,
    };
    const monitoredItem = await subscription.monitor(itemToMonitor, parameters, TimestampsToReturn.Both);

    monitoredItem.on("changed", (dataValue) => {
      console.log(dataValue.value);
      io.sockets.emit("message", {
        value: dataValue.value.value,
        timestamp: dataValue.serverTimestamp,
        nodeId: nodeIdToMonitor,
      });
    });

    // detect CTRL+C and close
    let running = true;
    process.on("SIGINT", async () => {
      if (!running) {
        return; // avoid calling shutdown twice
      }
      console.log("shutting down client");
      running = false;

      await subscription.terminate();

      await session.close();
      await client.disconnect();
      console.log("Done");
      process.exit(0);
    });
  } catch (err) {
    console.log(chalk.bgRed.white("Error" + err.message));
    console.log(err);
    process.exit(-1);
  }
})();
