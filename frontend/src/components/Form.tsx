import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import ThreeDotsLoading from "@/components/Loading";
import { io } from "socket.io-client";
const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000"
);

const APP_STATUS = {
  IDLE: "idle",
  ERROR: "error",
  READY_TO_SEND: "ready_to_send",
  LOADING: "loading",
  SUCCESS: "success",
} as const;

type AppStatusType = (typeof APP_STATUS)[keyof typeof APP_STATUS];

export default function Form() {
  const [status, setStatus] = useState<AppStatusType>(APP_STATUS.IDLE);
  const [inputValue, setInputValue] = useState("");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setStatus(
      event.target.value !== "" ? APP_STATUS.READY_TO_SEND : APP_STATUS.IDLE
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.trim() !== "") {
      setStatus(APP_STATUS.LOADING);
      socket.emit(
        "chat message",
        {
          message: inputValue,
        },
        () => {
          setStatus(APP_STATUS.SUCCESS);
        }
      );
    }

    setInputValue("");
  };

  useEffect(() => {
    if (status === APP_STATUS.LOADING) {
      const timer = setTimeout(() => {
        setStatus(APP_STATUS.SUCCESS);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  const loadingButton = status === APP_STATUS.LOADING;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border border-neutral-700 rounded-xl absolute bottom-0 mb-24"
    >
      <input
        onChange={handleInput}
        value={inputValue}
        autoComplete="off"
        className="rounded-xl w-[400px] outline-none px-2"
        type="text"
        name="text"
        placeholder="Type something..."
      />

      {loadingButton ? (
        <button disabled className="bg-green-800/90 rounded-r-xl p-3">
          <ThreeDotsLoading color="white" />
        </button>
      ) : (
        <button className="bg-green-600 rounded-r-xl p-3 hover:bg-green-700 duration-150">
          <IoMdSend />
        </button>
      )}
    </form>
  );
}
