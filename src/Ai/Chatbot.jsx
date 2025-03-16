import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArrowLeft } from "lucide-react";
import ChatHistory from "./ChatHistory";
import Loading from "./Loading";

const ChatBot = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { 
      type: "bot", 
      message: "Hello! Welcome to Ethio Capital. How can I assist you today?" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Gemini API
  const genAI = new GoogleGenerativeAI("AIzaSyCWxqTdQwa5XJCA0vuQqUfLVEL8LizdST4");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Navigation handler
  const handleBack = () => {
    navigate("/Entrepreneur-dashboard");
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user message immediately
    setChatHistory(prev => [...prev, { type: "user", message: userInput }]);
    const currentMessage = userInput;
    setUserInput("");
    setIsLoading(true);
    
    try {
      const prompt = `As an AI assistant for Ethio Capital, respond to: ${currentMessage}
      
      You are the AI assistant for EthioCapital Connect, a web-based platform developed in 2025 in Ethiopia by Temesgen Moges. 
        EthioCapital helps Ethiopian entrepreneurs connect with investors through business idea showcasing, investor matching, and networking tools.
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      setChatHistory(prev => [...prev, { 
        type: "bot", 
        message: response.text() 
      }]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory(prev => [...prev, { 
        type: "bot", 
        message: "Sorry, I'm having trouble responding. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([
      { 
        type: "bot", 
        message: "Hello! Welcome to Ethio Capital. How can I assist you today?" 
      }
    ]);
  };

  return (
    <div className="container mx-auto max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header with Back Button */}
      <div className="p-4 bg-gradient-to-r from-teal-700 to-teal-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title="Return to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold">Ethio Capital Assistant</h1>
          </div>
          <button 
            className="px-3 py-1.5 text-sm bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            onClick={clearChat}
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div className="chat-container h-96 overflow-y-auto p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300
                     focus:outline-none focus:ring-2 focus:ring-teal-500
                     disabled:opacity-50"
            placeholder="Type your message..."
            value={userInput}
            onChange={handleUserInput}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="px-4 py-2 rounded-lg bg-teal-700 text-white 
                     hover:bg-teal-800 focus:outline-none transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={sendMessage}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;