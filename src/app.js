import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import fs from "fs";

import fileRoute from "./Routes/fileRoute.js";
import { getData, setIsRunning, storeResult } from "./data/dataProvider.js";
import { AutoEngine } from "./utils/AutoEngine.js";

import { fileURLToPath } from 'url';
import path, { join } from 'path';

const port = 5000;
const app = express();
const server = createServer(app);

// Logging function
function logExit(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync('server-log.log', logMessage);
}

// Exit and error handlers
process.on('SIGINT', () => {
  logExit("Server terminated manually (SIGINT).");
  process.exit(0);
});

process.on('SIGTERM', () => {
  logExit("Server terminated (SIGTERM).");
  process.exit(0);
});

process.on('exit', (code) => {
  logExit(`Server exited with code ${code}.`);
});

process.on("uncaughtException", (err) => {
  logExit("Uncaught Exception: " + err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logExit("Unhandled Rejection: " + reason);
  process.exit(1);
});

app.use(express.json());
app.use("/api/file", fileRoute);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the React build directory
app.use(express.static(join(__dirname, '../dist')));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "../dist", "index.html"));
});

// WebSocket server that listens only on the "/autoevent" path
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

            if (statusData.status == "selected") {
              storeResult({ ...userData, status: statusData.status, address: statusData.address });
            } else {
              storeResult({ ...userData, status: statusData.status });
            }
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

  ws.on("error", (err) => {
    logExit("WebSocket error: " + err.message);
  });
});

server.listen(port, () => console.log(`Server running: http://localhost:${port}`));

server.on("error", (err) => {
  logExit("Server failed to start: " + err.message);
});
