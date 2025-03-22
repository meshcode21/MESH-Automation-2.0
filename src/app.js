import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import fileRoute from "./Routes/fileRoute.js";
import { getData, setData, setIsRunning, storeResult } from "./data/dataProvider.js";
import { AutoEngine } from "./utils/AutoEngine.js";
import { userInfo } from "os";

const port = 5000;
const app = express();
const server = createServer(app);

app.use(express.json());
app.use("/api/file", fileRoute);

app.get("/", (req, res) => {
  res.send("server running...");
});

// WebSocket server that listens only on the "/events" path
const wss = new WebSocketServer({ server, path: "/autoevent" });

wss.on("connection", async (ws) => {
  console.log("Connection between Server and Client Successed...");

  let currentIndex = 0;
  ws.on("message", (receivedData) => {
    currentIndex = JSON.parse(receivedData).workingIndex;
    console.log("WorkingIndex: ", currentIndex);

    const data = getData();
    if (data) {
      setIsRunning(true);

      AutoEngine(
        currentIndex,
        data,
        (statusData) => {
          console.log(statusData);
          ws.send(JSON.stringify(statusData));

          if (statusData.status != "running") {
            const userData = data.find((item, index) => index == statusData.index);

            if (statusData.status == "selected") storeResult({ ...userData, status: statusData.status, address: statusData.address });
            else storeResult({ ...userData, status: statusData.status });
          }
        },
        () => {
          ws.send(JSON.stringify({ message: "automation terminated" }));
          console.log("automtion terminated");
        }
      );
    } else {
      ws.send(JSON.stringify({ message: "data are empty..." }));
    }
  });

  ws.on("close", () => {
    setIsRunning(false);
    console.log("Clinet disconnected... Automation Stoped.");
  });
});

server.listen(port, () => console.log(`Server running: http://localhost:${port}`));
