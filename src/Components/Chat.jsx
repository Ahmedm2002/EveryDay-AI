import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Markdown from "react-markdown";
import send1 from "../assets/send1.png";

// const socket = io("http://localhost:3000/");
const socket = io("https://every-day-ai-back-end.vercel.app/");
const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("result", (msg) => {
      setChat((prevChat) => [...prevChat, { sender: "bot", text: `${msg}` }]);
    });

    return () => {
      socket.off("result");
    };
  }, []);

  const sendMessage = () => {
    setChat((prevChat) => [
      ...prevChat,
      { sender: "user", text: `${message}` },
    ]);
    socket.emit("userMsg", message);
    setMessage("");
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col">
      <div className="flex-grow overflow-y-auto mx-2 mt-3 mb-4">
        {chat.map((msg, index) => (
          <ul
            key={index}
            className={`flex mb-2 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-slate-400 text-black pr-3"
                  : "bg-green-500 text-white pl-3"
              }`}
            >
              <Markdown>{msg.text}</Markdown>
            </div>
          </ul>
        ))}
      </div>

      <div className="bottom-4 sticky w-full flex justify-center">
        <div className="relative w-[90%] flex">
          <textarea
            placeholder="Message Everyday AI"
            className="w-full rounded-lg bg-white p-3 resize-none overflow-hidden pr-12"
            value={message}
            onChange={handleInputChange}
            rows={1}
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <img src={send1} alt="Send" className="rounded-full h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
