import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = createServer(app);

// WebSocket server that listens only on the "/events" path
const wss = new WebSocketServer({ server, path: "/events" });

wss.on('connection', (ws) => {
  console.log('Client connected to /events');

  ws.send(JSON.stringify({ message: 'Connected to /events WebSocket' }));

  ws.on('message', (data) => {
    console.log("Received: %s", data); // Log the received data
  });

  let count=0;
  const interval = setInterval(() => {
    ws.send(JSON.stringify({counter: `${count}`}));
    count++;
  }, 500);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected from /events');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
