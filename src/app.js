import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

import fileRoute from "./Routes/fileRoute.js";
import { getData, setIsRunning } from "./dataStore.js";
import { AutoEngine } from "./utils/AutoEngine.js";

const port = 5000;
const app = express();
const server = createServer(app);

// WebSocket server that listens only on the "/events" path
const wss = new WebSocketServer({ server, path: "/autoevent" });

app.use(express.json());
app.use("/api/file", fileRoute);

app.get("/", (req, res) => {
  res.send("server running...");
});

wss.on("connection", (ws) => {
  console.log("Connection between Server and Client Successed...");

  const data = getData();
  if (data) {
    setIsRunning(true);

    AutoEngine(
      data,
      (statusData) => {
        console.log(statusData);
        ws.send(JSON.stringify(statusData));
      }
    );
  } else {
    ws.send(JSON.stringify({ message: "data are empty..." }));
  }

  ws.on("close", () => {
    setIsRunning(false);
    console.log("Clinet disconnected... Automation Stoped.");
  });
});

server.listen(port, () => console.log(`Server running: http://localhost:${port}`));
