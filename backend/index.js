import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { Server } from "socket.io";
import { createServer } from "node:http";

import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("Connected to socket.io");

  socket.on("disconnect", () => {
    console.log("Disconnected from socket.io");
  });

  socket.on("chat message", async (msg) => {
    try {
      const message = await prisma.messages.create({
        data: {
          content: msg.message,
        },
      });
      io.emit("chat message", message.content);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  });

  if (!socket.recovered) {
    try {
      const results = await prisma.messages.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      results.forEach((result) => {
        socket.emit("chat message", result.content, result.id);
      });
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
});

app.use(cors());

const PORT = process.env.PORT ?? 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
