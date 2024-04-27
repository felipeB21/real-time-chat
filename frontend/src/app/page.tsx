"use client";
import Chat from "@/components/Chat";
import Form from "@/components/Form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="flex flex-col items-center">
        <h1 className="text-xl font-medium">Real time chat</h1>
        <span className="text-neutral-500">Start chatting</span>
      </div>
      <Chat />
      <Form />
    </main>
  );
}
