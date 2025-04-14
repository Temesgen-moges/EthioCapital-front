import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import setupAxios from "../middleware/MiddleWare";
import { fetchUserData } from "../redux/UserSlice";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AnimatePresence } from "framer-motion";


const MessageConversationModal = ({
  selectedMessage = null,
  setSelectedMessage = () => {},
  messages = [],
  setMessages = () => {},
}) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.userData);
  const [responseText, setResponseText] = useState("");
  const [role, setRole] = useState("");

  const handleMessageResponse = async () => {
    if (!responseText.trim()) return;

    try {
      if (selectedMessage?._id) {
        // Reply to an existing complaint
        const response = await axios.post(
          `/api/v1/complaint/reply/${selectedMessage._id}`,
          { responseText }
        );
        console.log("Reply response:", response.data);

        setMessages((prev) => ({
          ...prev,
          messages: prev.messages.map((m) =>
            m._id === selectedMessage._id
              ? {
                  ...m,
                  replies: [
                    ...(m.replies || []),
                    {
                      userId: userData._id,
                      message: responseText,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : m
          ),
        }));
      } else {
        // Create a new complaint
        const response = await axios.post("/api/v1/complaint", {
          responseText,
        });
        console.log("New complaint response:", response.data);

        setMessages((prev) => ({
          ...prev,
          messages: [...(prev.messages || []), response.data],
        }));
      }

      // Show notification
      const notification = document.createElement("div");
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
      notification.textContent = `Response sent to ${
        selectedMessage?.user?.email || "user"
      }`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 3000);

      setSelectedMessage(null);
      setResponseText("");
    } catch (error) {
      console.error("Error in handleMessageResponse:", error);
    }
  };

  useEffect(() => {
    setupAxios();
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    setRole(userData?.role);
  }, [userData]);

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
                Conversation with{" "}
                {selectedMessage?.user?.email || "Unknown User"}
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
              {selectedMessage?._id && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    {selectedMessage.user?.email || "Unknown"}:
                  </p>
                  <p className="text-gray-800">{selectedMessage.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Replies */}
              {(selectedMessage?.replies || []).map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    msg.userId === userData._id
                      ? "bg-blue-100 ml-4"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-600">
                    {msg.userId === userData._id ? "You" : "User"}:
                  </p>
                  <p className="text-gray-800">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
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
