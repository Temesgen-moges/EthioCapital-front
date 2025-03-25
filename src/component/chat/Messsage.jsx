import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://ethio-capital-back-end-2.onrender.com");

const Message = ({ conversationId, userId, ideaId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesStartRef = useRef(null);

  useEffect(() => {
    
    socket.emit("joinRoom", conversationId);

    console.log("conversation id", conversationId);
    console.log("idea id", ideaId);
    console.log("user id", userId);
    
    axios
      .get(`/fetch-messages/${conversationId}/${ideaId}`)
      .then((res) => {
        // console.log("Fetched Messages:", res.data); // Log fetched messages
        setMessages(res.data);
      })
      .catch((err) => console.log(err));

    socket.on("message", (message) => {
      // console.log("New Message Received:", message); // Log new message
      setMessages((prev) => [...prev, message]); // Add new message at the end
    });

    return () => {
      socket.off("message");
    };
  }, [conversationId]);

  useEffect(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const messageData = {
        conversationId,
        sender: userId,
        text: input,
        timestamp: Date.now(),
      };
      // console.log("Sending Message Data:", messageData); // Log message data
      setMessages((prev) => [...prev, messageData]); // Add sent message at the end
      socket.emit("sendMessage", messageData);
      setInput("");
    }
  };

// Sort messages by timestamp in ascending order (oldest first)
const sortedMessages = [...messages].sort((a, b) => {
  const aTime = new Date(a.timestamp).getTime(); // Convert to milliseconds
  const bTime = new Date(b.timestamp).getTime(); // Convert to milliseconds
  // console.log(`Comparing: ${aTime} to ${bTime}`); // Log comparison
  return aTime - bTime; // Sort by time
});

  // console.log("Sorted Messages:", sortedMessages); // Log sorted messages

  return (
    <div className="p-4">
      <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4 custom-scrollbar">
        {sortedMessages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 flex ${message.sender === userId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === userId ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesStartRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Senddd
        </button>
      </form>
    </div>
  );
};

export default Message;