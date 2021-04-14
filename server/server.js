const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const {
  AttributeIds,
  OPCUAClient,
  TimestampsToReturn,
  MessageSecurityMode,
  SecurityPolicy,
  NodeClass,
  makeBrowsePath,
} = require("node-opcua");
const opcua = require("node-opcua");
const { Console } = require("console");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = 5000;
const endpointUrl = "opc.tcp://localhost:4840";
//const endpointUrl = "opc.tcp://172.28.90.84:4840";
const nodeIdToMonitor = "ns=1;s=Flop";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const getFoldersItems = async (session, id, name) => {
  let children = [];
  const browseResult = await session.browse(id);
  if (browseResult.references.length > 0) {
    for (let reference of browseResult.references) {
      let id = reference.nodeId.toString();
      let name = reference.browseName.name;
      children.push(await getFoldersItems(session, id, name));
    }
  }
  let folder = { id, name, children };
  return folder;
};

//opc ua
const connectionStrategy = { maxRetry: 1 };
const options = {
  applicationName: "MyClient",
  connectionStrategy: connectionStrategy,
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  endpoint_must_exist: false,
};
const client = OPCUAClient.create(options);

const opcuaConnection = async () => {
  try {
    // const client = OPCUAClient.create({ endpoint_must_exist: false });

    // await client.withSessionAsync(endpointUrl, async (session) => {
    //   let browseResult = await session.browse({
    //     nodeId,
    //     nodeClassMask: NodeClass.Variable, // we only want sub node that are Variables
    //     resultMask: 63, // extract all information possible
    //   });
    //   console.log("BrowseResult = ", browseResult.toString());
    // });

    // step 1 : connect to
    await client.connect(endpointUrl);
    console.log(`${endpointUrl} connected !`);

    // step 2 : createSession
    const session = await client.createSession();
    console.log("session created !");

    // step 3 : browseObjects
    let rootFolder = await getFoldersItems(session, "RootFolder", "root");

    io.on("connect", (socket) => {
      socket.emit("roofFolder", rootFolder);
    });

    // sub
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

    io.on("connect", (socket) => {
      socket.emit("roofFolder", rootFolder);
      socket.on("getData", (data) => {
        //console.log("get" + data.value);
        nodesToWrite = [
          {
            nodeId: "ns=1;s=Flip",
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
          //console.log(statusCodes);
          if (!err) {
            console.log(" write ok");
          }
        });
      });
    });
  } catch (err) {
    console.log("An error has occured : " + err);
  }
};

let serverlisten = server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  opcuaConnection();
});
//serverlisten.close();

// const r = session.browse(["RootFolder", "ns=0;i=85"], function (err, results, diagnostics) {
//   console.log(results.toString());
// });
// step 6: finding the nodeId of a node by Browse name
// const browsePath = makeBrowsePath("RootFolder", "/Objects/1:Flip");

// const result = await session.translateBrowsePath(browsePath);
// const productNameNodeId = result.targets[0];
// console.log(" Product Name nodeId = ", productNameNodeId.toString());

// close session
// await session.close();

// // disconnecting
// await client.disconnect();
// console.log("done !");
