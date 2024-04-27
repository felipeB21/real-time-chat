"use client";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
  LOADED: "loaded",
} as const;

interface SocketAuth {
  serverOffset: number;
}

const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  {
    auth: {
      serverOffset: 0,
    } as SocketAuth,
  }
);

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

export default function Chat() {
  const [status, setStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    setStatus(APP_STATUS.LOADING);
    const handleChatMessage = (msg: string) => {
      setMessages((prevMessages) => {
        setStatus(APP_STATUS.LOADED);
        const newMessages = [...prevMessages, msg];
        return newMessages;
      });
    };

    socket.on("chat message", handleChatMessage);

    return () => {
      socket.off("chat message", handleChatMessage);
    };
  }, []);

  return (
    <div className="min-w-[440px] border border-neutral-700 rounded-xl h-[60vh] p-5 mt-10 overflow-y-auto overflow-x-hidden ">
      {status === APP_STATUS.LOADING && (
        <div className="flex items-center justify-center h-[50vh]">
          <p>Loading...</p>
        </div>
      )}
      <ul className="flex flex-col gap-1">
        {messages.map((msg, index) => (
          <li key={index}>
            <span className="text-neutral-500 flex gap-1 text-sm">
              {new Date(Date.now()).toLocaleTimeString()}:
              <p className="text-white max-w-[380px] break-words text-base">
                {msg}
              </p>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
