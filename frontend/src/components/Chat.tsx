"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000"
);

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [messages]);
  return (
    <div className="w-[24vw] border border-neutral-700 rounded-xl h-[60vh] p-5 mt-10 overflow-y-auto overflow-x-hidden ">
      <ul className="flex flex-col gap-1">
        {messages.map((msg, i) => (
          <li key={i}>
            <span className="text-neutral-500 flex gap-1 ">
              User:{" "}
              <p className="text-white max-w-[380px] break-words">{msg}</p>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
