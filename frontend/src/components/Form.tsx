import React, { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { io } from "socket.io-client";
const socket = io(
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000"
);

export default function Form() {
  const [inputValue, setInputValue] = useState("");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue !== "") {
      socket.emit("chat message", {
        message: inputValue,
      });
      setInputValue("");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center border border-neutral-700 rounded-xl pl-5 absolute bottom-0 mb-24"
    >
      <input
        onChange={handleInput}
        value={inputValue}
        className="rounded-xl w-[400px] outline-none"
        type="text"
        name="text"
        placeholder="Type something..."
      />
      <button className="bg-green-600 rounded-r-xl p-3 hover:bg-green-700 duration-150">
        <IoMdSend />
      </button>
    </form>
  );
}
