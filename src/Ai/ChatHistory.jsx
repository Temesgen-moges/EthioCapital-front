import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const ChatHistory = ({ chatHistory }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  return (
    <div className="space-y-4">
      {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            message.type === "user" ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-2xl ${
              message.type === "user" 
                ? "bg-gray-100 text-gray-800 rounded-tr-none" 
                : "bg-teal-50 text-teal-800 rounded-tl-none border-l-4 border-teal-600"
            }`}
          >
            <div className={`font-medium mb-1 ${
              message.type === "user" ? "text-gray-700" : "text-teal-800"
            }`}>
              {message.type === "user" ? "You" : "Ethio Capital"}
            </div>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{message.message}</ReactMarkdown>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatHistory;