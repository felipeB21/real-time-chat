import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Server } from "socket.io";
import { createServer } from "node:http";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("disconnect", () => {
    console.log("Disconnected from socket.io");
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg.message);
  });
});

app.use(cors());

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
