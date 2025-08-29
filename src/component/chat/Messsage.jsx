import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://ethiocapital-back.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
});

const Message = ({ conversationId, userId, ideaId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [emoji, setEmoji] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  const token = localStorage.getItem("authToken");
  const API_URL = "https://ethiocapital-back.onrender.com/api/v1";
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "👏", "🙏", "🤔", "😎", "😢", "😍", "⭐", "🚀"];

  useEffect(() => {
    if (!conversationId) return;

    setIsLoading(true);
    socket.emit("joinRoom", conversationId);

    // Fetch initial messages
    axios
      .get(`${API_URL}/messages/${conversationId}/${ideaId}`, { headers })
      .then((res) => {
        setMessages(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err.response?.data || err.message);
        setError("Failed to load messages. Please try again.");
        setIsLoading(false);
      });

    // Listen for new messages
    socket.on("newMessage", (message) => {
      setMessages((prev) => {
        if (!prev.some((msg) => msg._id === message._id)) {
          return [...prev, message];
        }
        return prev;
      });
    });

    // Listen for typing indicators
    socket.on("typing", (data) => {
      if (data.userId !== userId && data.conversationId === conversationId) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("typing");
    };
  }, [conversationId, ideaId, token, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Send typing indicator
    socket.emit("typing", { conversationId, userId });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !conversationId) return;

    setSendingMessage(true);
    setError(null);

    const messageData = {
      conversationId,
      text: input,
    };

    try {
      const response = await axios.post(`${API_URL}/send-message`, messageData, { headers });
      setMessages((prev) => [...prev, response.data]);
      setInput("");
      inputRef.current.focus();
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Error sending message:", err.response?.data || err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleVideoCall = () => {
    window.open("/VideoCall", "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const addEmoji = (emojiChar) => {
    setInput(prev => prev + emojiChar);
    setEmoji(false);
    inputRef.current.focus();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const sorted = [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const grouped = {};
    
    sorted.forEach(message => {
      const date = formatDate(message.timestamp);
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(message);
    });
    
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div className="p-4 flex-1 flex flex-col h-full bg-gray-50 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {conversationId ? "Chat" : "Select a conversation"}
        </h2>
        <button
          onClick={handleVideoCall}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
          </svg>
          Video Call
        </button>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pr-2 mb-4 custom-scrollbar"
        style={{ 
          maxHeight: "calc(100vh - 240px)",
          minHeight: "300px",
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {date}
                </span>
              </div>
              
              {dateMessages.map((message, index) => {
                const isMine = message.sender === userId;
                const showAvatar = index === 0 || dateMessages[index - 1].sender !== message.sender;
                
                return (
                  <div
                    key={message._id}
                    className={`mb-2 flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    {!isMine && showAvatar && (
                      <div className="h-8 w-8 rounded-full bg-indigo-300 flex items-center justify-center mr-2 flex-shrink-0">
                        {message.senderName?.charAt(0) || "U"}
                      </div>
                    )}
                    
                    <div
                      className={`relative max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl message-bubble 
                        ${isMine ? 
                          "bg-indigo-600 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg" : 
                          "bg-white border border-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg shadow-sm"
                        }`}
                    >
                      <p className={`px-4 py-2 ${isMine ? "text-white" : "text-gray-700"}`}>
                        {message.text}
                      </p>
                      <span className={`text-xs px-4 pb-1 block ${isMine ? "text-indigo-200" : "text-gray-500"}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    {isMine && showAvatar && (
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2 flex-shrink-0">
                        {message.senderName?.charAt(0) || "M"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 mt-2">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="text-sm">Someone is typing...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg my-2">
            {error}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="relative">
        <div className="flex items-end gap-2">
          <div className="relative flex-1 bg-white rounded-lg shadow-sm border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <button 
              type="button"
              onClick={() => setEmoji(prev => !prev)}
              className="absolute left-2 bottom-2 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-3 bg-transparent outline-none resize-none"
              placeholder="Type a message..."
              rows="1"
              style={{ minHeight: "48px", maxHeight: "120px" }}
              disabled={!conversationId || isLoading}
            />
            
            <button 
              type="button"
              onClick={() => {
                if (chatContainerRef.current) {
                  chatContainerRef.current.scrollTop = 0;
                }
              }}
              className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700"
              title="Scroll to top"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!conversationId || !input.trim() || sendingMessage}
            className={`px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${
              !conversationId || !input.trim() || sendingMessage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            }`}
          >
            {sendingMessage ? (
              <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h1v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            )}
          </button>
        </div>
        
        {emoji && (
          <div className="absolute bottom-full mb-2 right-0 bg-white p-2 rounded-lg shadow-lg border border-gray-200 grid grid-cols-7 gap-2 w-64">
            {emojis.map((emojiChar) => (
              <button
                key={emojiChar}
                type="button"
                onClick={() => addEmoji(emojiChar)}
                className="text-xl hover:bg-gray-100 p-1 rounded"
              >
                {emojiChar}
              </button>
            ))}
          </div>
        )}
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
        .typing-indicator {
          display: inline-flex;
          align-items: center;
        }
        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #888;
          border-radius: 50%;
          display: inline-block;
          margin: 0 1px;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes typing {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .message-bubble {
          position: relative;
          margin: 2px 0;
          padding: 0;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default Message;