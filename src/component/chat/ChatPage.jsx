import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { X } from "lucide-react";
import Message from "./Messsage";

// Socket.IO connection
const socket = io("https://ethiocapital-back.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
});

const ChatPage = ({ userId, token, role, ideas = [] }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [error, setError] = useState(null);

  // API configuration
  const API_URL = "https://ethiocapital-back.onrender.com/api/v1";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetch user’s conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const endpoint = `${API_URL}/user-messages/${userId}`;
        const response = await axios.get(endpoint, { headers });
        const convs = response.data.reduce((acc, msg) => {
          const convId = msg.conversationId._id;
          if (!acc.some((c) => c._id === convId)) {
            const idea = ideas.find((i) => i._id === msg.conversationId.idea);
            acc.push({
              _id: convId,
              ideaId: msg.conversationId.idea,
              ideaTitle:
                idea?.title || `Idea #${msg.conversationId.idea.slice(-6)}`,
              participants: msg.conversationId.participants,
              lastMessage: msg,
            });
          }
          return acc;
        }, []);
        setConversations(convs);
        setError(null);
      } catch (err) {
        setError("Failed to load conversations.");
        console.error("Fetch conversations error:", err.response?.data || err);
      }
    };

    fetchConversations();
  }, [userId, role, ideas]);

  // Start a new conversation (for investors)
  const startConversation = async (ideaId, entrepreneurId) => {
    try {
      const response = await axios.post(
        `${API_URL}/conversation`,
        { participants: [userId, entrepreneurId], ideaId },
        { headers }
      );
      const idea = ideas.find((i) => i._id === ideaId);
      const newConv = {
        _id: response.data._id,
        ideaId: response.data.idea,
        ideaTitle: idea?.title || `Idea #${response.data.idea.slice(-6)}`,
        participants: response.data.participants,
        lastMessage: null,
      };
      setConversations((prev) => [...prev, newConv]);
      setSelectedConversation(newConv);
    } catch (err) {
      setError("Failed to start conversation.");
      console.error("Start conversation error:", err.response?.data || err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar: Conversation List */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {role === "entrepreneur" ? "Your Idea Chats" : "Investor Chats"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {conversations.length} active
          </p>
        </div>
        {error && (
          <p className="p-4 text-red-500 text-sm text-center">{error}</p>
        )}
        {conversations.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">
            {role === "entrepreneur"
              ? "No chats yet. Wait for investors!"
              : "Start a chat with an entrepreneur!"}
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => setSelectedConversation(conv)}
              className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${
                selectedConversation?._id === conv._id
                  ? "bg-blue-100 border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <p className="font-semibold text-gray-800 truncate">
                {conv.ideaTitle}
              </p>
              <p className="text-sm text-gray-600 truncate">
                {conv.lastMessage?.text || "No messages yet"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {conv.lastMessage
                  ? new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </p>
            </div>
          ))
        )}
        {role === "investor" && (
          <button
            onClick={() =>
              startConversation("exampleIdeaId", "exampleEntrepreneurId")
            } // Replace with real logic
            className="m-4 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-[calc(100%-2rem)]"
          >
            Start New Chat
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedConversation.ideaTitle}
              </h3>
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {/* Message Component */}
            <Message
              conversationId={selectedConversation._id}
              userId={userId}
              ideaId={selectedConversation.ideaId}
              token={token}
              ideaTitle={selectedConversation.ideaTitle}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-lg font-medium">
                Select a conversation to start chatting
              </p>
              <p className="text-sm mt-2">
                {role === "entrepreneur"
                  ? "View chats from investors interested in your ideas."
                  : "Start a conversation with an entrepreneur!"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;