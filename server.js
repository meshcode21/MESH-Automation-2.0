import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: { origin: "http://localhost:5173" },
}); // No need for CORS

// const updateNamespace = io.of("/update");

io.of("/update").on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.emit("message", "Connected to /update");

  // Simulate a long process
  const processData = async () => {
    for (let i = 0; i <= 100; i++) { // Fixed loop
      await new Promise((resolve) => setTimeout(resolve, 50)); // Simulated delay
      socket.emit("progress", i); // Send progress update
    }
    socket.emit("completed", "Processing completed!");
  };

  processData();

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
