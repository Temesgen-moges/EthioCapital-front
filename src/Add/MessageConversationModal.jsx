import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
// import { use } from "react";
// import { set } from "react-hook-form";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";

const MessageConversationModal = ({ 
  selectedMessage = null, 
  setSelectedMessage = () => {},
  messages = [],
  setMessages = () => {}
}) => {

  // useEffect(()=>{

  //   console.log("selected message",selectedMessage)
  //   console.log("messages",messages)

  // },[])
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userData);
  const [responseText, setResponseText] = useState("");
  const [role,setRole]=useState("");

  const handleMessageResponse =async () => {
    if (!selectedMessage || !responseText.trim()) return;

    if (selectedMessage) {
      const response= await axios.post(`/compliant/reply/${selectedMessage._id}`, { responseText });

      console.log("response.data", response.data);
    }else{
      try {
        const response = await axios.post(`/compliant`, { responseText });
        console.log("response.data", response.data);
      } catch (error) {
        console.log("error", error);
      }

      setMessages((prev) =>
      (prev || []).map((m) =>
        m._id === selectedMessage._id
          ? {
              ...m,
              responded: true,
              conversation: [
                ...(m.conversation || []),
                {
                  text: responseText,
                  sender: "admin",
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : m
      )
    );
    }
    // Show notification
    const notification = document.createElement("div");
    notification.className = "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
    notification.textContent = `Response sent to ${selectedMessage?.sender || 'user'}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);

    // try {
    //   const response = await axios.post(`/compliant`, {responseText});
    //   console.log("response.data", response.data);
    // } catch (error) {
    //   console.log("error", error);
      
    // }
    setSelectedMessage(null);
    setResponseText("");
  };
  useEffect(() => {
    setupAxios();
  }, []);

  useEffect(() => {
    console.log("user data", userData);
    setRole(userData?.role);
  }, [userData]);
  
  useEffect(()=>{
    dispatch(fetchUserData());
  },[dispatch])


  return (
    <AnimatePresence>
      {selectedMessage && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0.9 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Conversation with {selectedMessage?.user?.email || 'Unknown User'}
              </h3>
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {/* Original Message */}
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">
                  {selectedMessage?.sender || 'Unknown'}:
                </p>
                <p className="text-gray-800">{selectedMessage?.text || ''}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedMessage?.timestamp ? 
                    new Date(selectedMessage.timestamp).toLocaleString() : 
                    'No timestamp available'}
                </p>
              </div>

              {/* Conversation History */}
              {(selectedMessage?.conversation || []).map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${msg?.sender === "admin" ? "bg-blue-100 ml-4" : "bg-gray-100"}`}
                >
                  <p className="text-sm font-medium text-gray-600">
                    {msg?.sender || 'Unknown'}:
                  </p>
                  <p className="text-gray-800">{msg?.text || ''}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg?.timestamp ? 
                      new Date(msg.timestamp).toLocaleString() : 
                      'No timestamp available'}
                  </p>
                </div>
              ))}
            </div>

            {/* Response Area */}
            <div className="border-t pt-4">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-md mb-4"
                placeholder="Type your response..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMessageResponse}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Send Response
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageConversationModal;