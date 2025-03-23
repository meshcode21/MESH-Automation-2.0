import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import fileRoute from "./Routes/fileRoute.js";
import { getData, setIsRunning, storeResult } from "./data/dataProvider.js";
import { AutoEngine } from "./utils/AutoEngine.js";

import { fileURLToPath } from 'url';
import path,{join} from 'path';


const port = 5000;
const app = express();
const server = createServer(app);

app.use(express.json());
app.use("/api/file", fileRoute);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the React build directory
app.use(express.static(join(__dirname, '../dist'))); // Adjust 'client/dist' to your actual build folder

app.get("/", (req, res) => {
 res.sendFile(join(__dirname,"../dist","index.html"));
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
