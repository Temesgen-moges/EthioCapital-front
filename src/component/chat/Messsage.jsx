import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://ethio-capital-backend-123.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
});

const Message = ({ conversationId, userId, ideaId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesStartRef = useRef(null);
  const token = localStorage.getItem("authToken");
  const API_URL = "https://ethio-capital-backend-123.onrender.com/api/v1";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!conversationId) return; // Guard against empty conversationId

    socket.emit("joinRoom", conversationId);

    console.log("conversation id", conversationId);
    console.log("idea id", ideaId);
    console.log("user id", userId);
    console.log("token from message ", token);

    // Fetch initial messages
    axios
      .get(`${API_URL}/messages/${conversationId}/${ideaId}`, { headers })
      .then((res) => {
        console.log("Fetched Messages:", res.data);
        setMessages(res.data);
      })
      .catch((err) => {
        console.error(
          "Error fetching messages:",
          err.response?.data || err.message
        );
      });

    // Listen for new messages from the server
    socket.on("newMessage", (message) => {
      console.log("New Message Received:", message);
      setMessages((prev) => {
        if (!prev.some((msg) => msg._id === message._id)) {
          return [...prev, message];
        }
        return prev;
      });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [conversationId, ideaId, token]);

  useEffect(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return; // Guard against empty input or conversationId

    const messageData = {
      conversationId,
      text: input,
    };

    try {
      const response = await axios.post(
        `${API_URL}/send-message`,
        messageData,
        { headers }
      );
      console.log("Message sent successfully:", response.data);

      setMessages((prev) => {
        if (!prev.some((msg) => msg._id === response.data._id)) {
          return [...prev, response.data];
        }
        return prev;
      });
      setInput("");
    } catch (err) {
      console.error(
        "Error sending message:",
        err.response?.data || err.message
      );
      setInput(input); // Restore input on failure
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return aTime - bTime;
  });

  return (
    <div className="p-4">
      <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4 custom-scrollbar">
        {sortedMessages.map((message) => (
          <div
            key={message._id}
            className={`mb-2 flex ${
              message.sender === userId ? "justify-end" : "justify-start"
            }`}
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
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          disabled={!conversationId} // Disable if no conversationId
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Message;
