import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
import { fetchBussinessIdea } from "../redux/BussinessIdeaSlice";
import setupAxios from "../middleware/MiddleWare";
import {
  clearBussinessIdea,
  setBussinessIdea,
} from "../redux/BussinessIdeaSlice";
import BlogsPage from "../All/BlogPage";
import NavigationBar from "./NavigationBar";
import ChatPage from "../component/chat/ChatPage";
import io from "socket.io-client";

// Categories for filtering ideas
const categories = [
  "All",
  "Agriculture",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Education",
  "Food Processing",
  "Tourism",
];

// Dashboard for entrepreneurs and investors to browse ideas and manage complaints
function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("ideas");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [complaints, setComplaints] = useState([]); // Store user's complaints
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const [ideaConversations, setIdeaConversations] = useState({});
  const [socket, setSocket] = useState(null);

  const { userData } = useSelector((state) => state.userData);
  const { BussinessIdea } = useSelector((state) => state.businessIdea);
  const messages = useSelector(
    (state) => state.messageDatas.messageDatas || []
  );
  const [showMessages, setShowMessages] = useState(false);
  const [dashboardMessages, setDashboardMessages] = useState([
    {
      id: 1,
      sender: "Admin Support",
      text: "Welcome to EthioCapital!",
      isNew: true,
      timestamp: new Date().toISOString(),
      conversation: [],
    },
  ]);

  // Toggle handlers for UI elements
  const handleNotificationsToggle = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  const handleProfileToggle = () => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  };

  const handleMessagesToggle = () => {
    setShowMessages((prev) => !prev);
    setShowNotifications(false);
    setShowProfile(false);
  };

  // Initialize Socket.IO and fetch initial data
  useEffect(() => {
    setupAxios();
    dispatch(fetchUserData());
    dispatch(fetchBussinessIdea());

    // Connect to Socket.IO
    const socketInstance = io("http://localhost:3001");
    setSocket(socketInstance);

    // Join user room for real-time updates
    if (userData?._id) {
      socketInstance.emit("joinUserRoom", userData._id);
    }

    // Fetch user's complaints
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`/api/v1/complaints`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        // Filter complaints for the current user (non-admin)
        const userComplaints = response.data.filter(
          (c) => c.userId._id === userData._id
        );
        setComplaints(userComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    if (userData?._id) fetchComplaints();

    // Socket.IO listeners
    socketInstance.on("newReply", (updatedComplaint) => {
      if (updatedComplaint.userId === userData._id) {
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === updatedComplaint._id ? updatedComplaint : c
          )
        );
      }
    });

    socketInstance.on("complaintUpdated", (updatedComplaint) => {
      if (updatedComplaint.userId === userData._id) {
        setComplaints((prev) =>
          prev.map((c) =>
            c._id === updatedComplaint._id ? updatedComplaint : c
          )
        );
      }
    });

    socketInstance.on("complaintDeleted", (deletedId) => {
      setComplaints((prev) => prev.filter((c) => c._id !== deletedId));
    });

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, [dispatch, userData?._id]);

  // Sync ideas and fetch conversations
  useEffect(() => {
    setIsLoading(true);
    setIdeas(BussinessIdea);
    dispatch(setBussinessIdea(BussinessIdea));
  
    const fetchAllConversations = async () => {
      try {
        const convPromises = BussinessIdea.filter(
          (idea) => idea.user?._id === userData?._id
        ).map((idea) =>
          axios.get(`${axios.defaults.baseURL}/conversations/idea/${idea._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          })
        );
        const responses = await Promise.all(convPromises);
        const convMap = {};
        responses.forEach((res, index) => {
          const ideaId = BussinessIdea.filter(
            (idea) => idea.user?._id === userData?._id
          )[index]._id;
          convMap[ideaId] = res.data;
        });
        setIdeaConversations(convMap);
  
        // Create a new array with unread counts instead of mutating the original
        const updatedIdeas = BussinessIdea.map((idea) => {
          const convs = convMap[idea._id] || [];
          const unread = convs.reduce((count, conv) => {
            return (
              count +
              messages.filter(
                (msg) =>
                  msg.conversationId === conv._id &&
                  !msg.read &&
                  msg.recipient === userData?._id
              ).length
            );
          }, 0);
          return { ...idea, unreadCount: unread }; // Spread operator creates a new object
        });
  
        setIdeas(updatedIdeas); // Update state with the new array
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
  
    if (userData?.role === "entrepreneur" && BussinessIdea.length > 0) {
      fetchAllConversations();
    }
    setIsLoading(false);
  }, [BussinessIdea, dispatch, userData, messages]);

  const logout = () => {
    localStorage.removeItem("authToken");
    dispatch(clearBussinessIdea());
    navigate("/login");
  };

  // Handle complaint submission
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/v1/complaint",
        { responseText: complaint },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setComplaints((prev) => [...prev, response.data]);
      setComplaint("");
      setShowComplaintForm(false);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  // Delete a complaint
  const handleDeleteComplaint = async (complaintId) => {
    try {
      await axios.delete(`/api/v1/complaint/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // Socket event will handle removal
    } catch (error) {
      console.error("Error deleting complaint:", error);
    }
  };

  const handleDelete = async () => {
    if (!ideaToDelete) return;
    try {
      await axios.delete(`/delete-idea/${ideaToDelete}`);
      dispatch(fetchBussinessIdea());
      setIdeaToDelete(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      setIdeaToDelete(null);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesCategory =
      selectedCategory === "All" || idea.businessCategory === selectedCategory;
    const matchesSearch =
      idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.overview?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInterest = (ideaId) => {
    setIdeas(
      ideas.map((idea) => {
        if (idea._id === ideaId) {
          return {
            ...idea,
            interestedInvestors: idea.hasShownInterest
              ? idea.interestedInvestors - 1
              : idea.interestedInvestors + 1,
            hasShownInterest: !idea.hasShownInterest,
          };
        }
        return idea;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar
        userData={userData}
        showNotifications={showNotifications}
        showProfile={showProfile}
        showMessages={showMessages}
        onToggleNotifications={handleNotificationsToggle}
        onToggleProfile={handleProfileToggle}
        onToggleMessages={handleMessagesToggle}
        onContactAdmin={() => setShowComplaintForm(true)}
        onLogout={logout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        messageData={dashboardMessages}
        setMessages={setDashboardMessages}
      />

      {/* Delete Confirmation Modal */}
      {ideaToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this business idea? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIdeaToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Idea
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "ideas" && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select
                className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Enhanced Complaint Form with Real-time Updates */}
        {showComplaintForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Contact Admin
              </h2>
              <form onSubmit={handleComplaintSubmit}>
                <textarea
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your issue or concern..."
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowComplaintForm(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </form>

              {/* Display User's Complaints */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Your Complaints</h3>
                {complaints.length === 0 ? (
                  <p className="text-gray-500">No complaints submitted yet.</p>
                ) : (
                  <ul className="space-y-4 max-h-40 overflow-y-auto">
                    {complaints.map((c) => (
                      <li key={c._id} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{c.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {c.isNew ? "Pending" : "Read"} •{" "}
                          {new Date(c.createdAt).toLocaleDateString()}
                        </p>
                        {c.replies.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-semibold text-gray-600">
                              Admin Reply:
                            </p>
                            <p className="text-sm text-gray-600">
                              {c.replies[0].message}
                            </p>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteComplaint(c._id)}
                          className="mt-2 text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === "ideas" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas
                  .sort(
                    (a, b) =>
                      (b.user?._id === userData?._id) -
                      (a.user?._id === userData?._id)
                  )
                  .map((idea) => {
                    const isOwnIdea = idea.user?._id === userData?._id;
                    const unreadCount = idea.unreadCount || 0;

                    return (
                      <motion.div
                        key={idea._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                        }}
                        className={`rounded-xl shadow-md overflow-hidden relative group ${
                          isOwnIdea
                            ? "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200"
                            : "bg-white"
                        }`}
                      >
                        {isOwnIdea && (
                          <div className="absolute top-2 left-2 flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                              My Idea
                            </span>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          {isOwnIdea && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  navigate(`/edit-idea/${idea._id}`)
                                }
                                className="p-2 bg-blue-200 text-blue-700 rounded-full hover:bg-blue-300 transition-colors"
                                title="Edit idea"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIdeaToDelete(idea._id)}
                                className="p-2 bg-red-200 text-red-700 rounded-full hover:bg-red-300 transition-colors"
                                title="Delete idea"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </motion.button>
                            </>
                          )}
                        </div>

                        <div className={`p-6 ${isOwnIdea ? "pt-12" : ""}`}>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-between items-start"
                          >
                            <div>
                              <h3
                                className={`text-xl font-semibold hover:text-blue-600 transition-colors ${
                                  isOwnIdea ? "text-blue-800" : "text-gray-900"
                                }`}
                              >
                                {idea.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                by {idea.user?.fullName}
                              </p>
                            </div>
                            <motion.span
                              whileHover={{ scale: 1.05 }}
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                isOwnIdea
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {idea.businessCategory}
                            </motion.span>
                          </motion.div>

                          <motion.p
                            className={`mt-4 line-clamp-3 ${
                              isOwnIdea ? "text-gray-700" : "text-gray-600"
                            }`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {idea.overview}
                          </motion.p>

                          <motion.div
                            className="mt-4 flex items-center justify-between"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                Funding Needed:
                              </span>
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`ml-1 ${
                                  isOwnIdea ? "text-blue-700" : "text-blue-600"
                                }`}
                              >
                                ${idea.fundingNeeded}
                              </motion.span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Stage:</span>
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className={`ml-1 ${
                                  isOwnIdea ? "text-blue-700" : "text-blue-600"
                                }`}
                              >
                                {idea.currentStage}
                              </motion.span>
                            </div>
                          </motion.div>

                          <div className="mt-6 flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {idea.entrepreneurLocation}
                            </span>
                            {!isOwnIdea && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleInterest(idea._id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                  idea.hasShownInterest
                                    ? "bg-red-50 text-red-600"
                                    : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                <Heart
                                  className={`h-5 w-5 ${
                                    idea.hasShownInterest ? "fill-current" : ""
                                  }`}
                                />
                                <span>
                                  {idea.interestedInvestors} Interested
                                </span>
                              </motion.button>
                            )}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              navigate(`/startup-detail/${idea._id}`)
                            }
                            className={`mt-4 w-full py-2 rounded-lg text-white transition-colors ${
                              isOwnIdea
                                ? "bg-blue-700 hover:bg-blue-800"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            View Details
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            )}

            {activeTab === "blogs" && <BlogsPage />}
            {activeTab === "chat" && <ChatPage />}
          </>
        )}
      </div>

      {/* Chatbot Button */}
      <motion.button
        onClick={() => navigate("/Chatbot")}
        className="fixed bottom-6 left-6 p-4 bg-green-600 text-white rounded-full shadow-lg z-50"
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{
          scale: 1.2,
          rotate: [0, 10, -10, 0],
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.9, rotate: -5 }}
      >
        <MessageCircle className="h-6 w-6" />
        <motion.span
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          !
        </motion.span>
      </motion.button>

      {/* Submit Idea Button */}
      {userData?.role === "entrepreneur" && (
        <motion.button
          onClick={() => navigate("/FundingTypeSelector")}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg z-50"
          whileHover={{ scale: 1.1, rotate: 10, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9, rotate: -10 }}
        >
          <PlusIcon className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
}

export default EntrepreneurDashboard;
