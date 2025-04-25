import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MessageCircle, BriefcaseIcon, GraduationCap, Plus, Trash2, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import { FaThumbsUp, FaRegThumbsUp  } from "react-icons/fa";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
import { fetchBussinessIdea, clearBussinessIdea } from "../redux/BussinessIdeaSlice";
import setupAxios from "../middleware/MiddleWare";
import BlogsPage from "../All/BlogPage";
import NavigationBar from "./NavigationBar";
import ChatPage from "../component/chat/ChatPage";
import io from "socket.io-client";

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const categories = [
  "All",
  "Student Support",
  "Agriculture",
  "Manufacturing",
  "Technology",
  "Healthcare",
  "Education",
  "Food Processing",
  "Tourism",
];

function EntrepreneurDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("ideas");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("businessIdeas");
  const [ideas, setIdeas] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);
  const [ideaConversations, setIdeaConversations] = useState({});
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
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
  const [showMessages, setShowMessages] = useState(false);
  const [likedIdeaId, setLikedIdeaId] = useState(null); // Track which idea was just liked for animation

  const { userData } = useSelector((state) => state.userData);
  const { BussinessIdea } = useSelector((state) => state.businessIdea);
  const messages = useSelector(
    (state) => state.messageDatas.messageDatas || []
  );

  // Validate ObjectId format
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

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

  useEffect(() => {
    setupAxios();
    dispatch(fetchUserData());
    dispatch(fetchBussinessIdea());

    const socketInstance = io("http://localhost:3001", {
      auth: {
        token: `Bearer ${localStorage.getItem("authToken")}`,
      },
      query: {
        userId: userData?._id,
      },
    });
    setSocket(socketInstance);

    if (userData?._id) {
      socketInstance.emit("joinUserRoom", userData._id);
    }

    const fetchApplications = async () => {
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please log in to view applications.");
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:3001/api/v1/student-applications", {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: "approved" },
        });
        console.log("Fetched Applications:", response.data);
        const validApplications = response.data.filter(
          (app) => isValidObjectId(app._id) && app.status === "approved"
        );
        console.log("Valid Applications:", validApplications);
        setApplications(validApplications);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else if (err.response?.status === 403) {
          setError("Access denied. Contact support.");
        } else {
          setError(err.response?.data?.message || "Failed to fetch applications");
        }
        setApplications([]);
      }
    };

    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`/api/v1/complaints`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userComplaints = response.data.filter(
          (c) => c.userId._id === userData._id
        );
        setComplaints(userComplaints);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        if (error.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      }
    };

    setApplications([]);
    fetchApplications();
    if (userData?._id) fetchComplaints();

    socketInstance.on("newApplication", (newApp) => {
      console.log("New Application Received:", newApp);
      if (
        newApp.status === "approved" &&
        newApp.id &&
        isValidObjectId(newApp.id)
      ) {
        axios
          .get(`http://localhost:3001/api/v1/student-applications/${newApp.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
          })
          .then((response) => {
            if (response.data.status === "approved") {
              setApplications((prev) => [
                { ...response.data, _id: newApp.id },
                ...prev.filter((app) => app._id !== newApp.id),
              ]);
              console.log("Added New Application:", newApp.id);
            }
          })
          .catch((err) => {
            console.warn("Failed to verify new application:", newApp.id, err.response?.data);
          });
      } else {
        console.warn("Invalid New Application:", newApp);
      }
    });

    socketInstance.on("applicationStatus", ({ id, status }) => {
      console.log("Application Status Update:", { id, status });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status } : app
        ).filter((app) => app.status === "approved")
      );
    });

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

    socketInstance.on("ideaLiked", ({ ideaId, likes }) => {
      setIdeas((prev) =>
        prev.map((idea) =>
          idea._id === ideaId
            ? {
                ...idea,
                likes,
                hasLiked: likes.includes(userData?._id),
              }
            : idea
        )
      );
    });

    return () => socketInstance.disconnect();
  }, [dispatch, userData?._id, navigate]);

  useEffect(() => {
    setIsLoading(true);

    const businessIdeasArray = Array.isArray(BussinessIdea) ? BussinessIdea : [];

    const updatedIdeas = businessIdeasArray.map((idea) => ({
      ...idea,
      hasLiked: idea.likes?.includes(userData?._id) || false,
    }));

    const fetchAllConversations = async () => {
      try {
        const convPromises = businessIdeasArray
          .filter((idea) => idea.user?._id === userData._id)
          .map((idea) =>
            axios.get(`${axios.defaults.baseURL}/conversations/idea/${idea._id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
            })
          );
        const responses = await Promise.all(convPromises);
        const convMap = {};
        responses.forEach((res, index) => {
          const ideaId = businessIdeasArray.filter(
            (idea) => idea.user?._id === userData._id
          )[index]?._id;
          if (ideaId) {
            convMap[ideaId] = res.data;
          }
        });
        setIdeaConversations(convMap);

        const ideasWithUnread = updatedIdeas.map((idea) => {
          const convs = convMap[idea._id] || [];
          const unread = convs.reduce((count, conv) => {
            return (
              count +
              messages.filter(
                (msg) =>
                  msg.conversationId === conv._id &&
                  !msg.read &&
                  msg.recipient === userData._id
              ).length
            );
          }, 0);
          return { ...idea, unreadCount: unread };
        });

        setIdeas(ideasWithUnread);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setError("Failed to fetch idea conversations.");
      }
    };

    if (userData?.role === "entrepreneur" && businessIdeasArray.length > 0) {
      fetchAllConversations();
    } else {
      setIdeas(updatedIdeas);
    }
    setIsLoading(false);
  }, [BussinessIdea, userData, messages]);

  const logout = () => {
    localStorage.removeItem("authToken");
    dispatch(clearBussinessIdea());
    navigate("/login");
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "/api/v1/complaint",
        { responseText: complaint },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComplaints((prev) => [...prev, response.data]);
      setComplaint("");
      setShowComplaintForm(false);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError("Failed to submit complaint.");
      }
    }
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`/api/v1/complaint/${complaintId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error deleting complaint:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    }
  };

  const handleLikeToggle = debounce(async (ideaId) => {
    if (!userData?._id || userData.role !== "investor") {
      setError("Please log in as an investor to like ideas.");
      return;
    }

    // Optimistic update
    setIdeas((prev) =>
      prev.map((i) =>
        i._id === ideaId
          ? {
              ...i,
              hasLiked: !i.hasLiked,
              likes: i.hasLiked
                ? (i.likes || []).filter((id) => id !== userData._id)
                : [...(i.likes || []), userData._id],
            }
          : i
      )
    );
    setLikedIdeaId(ideaId); // Trigger pop-up animation
    setTimeout(() => setLikedIdeaId(null), 1000); // Clear animation after 1s

    try {
      const response = await axios.post(
        `/like-idea/${ideaId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      socket.emit("likeIdea", {
        ideaId,
        likes: response.data.idea.likes,
      });

      // Sync with server response
      setIdeas((prev) =>
        prev.map((i) =>
          i._id === ideaId
            ? {
                ...i,
                likes: response.data.idea.likes,
                hasLiked: response.data.idea.likes.includes(userData?._id),
              }
            : i
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      setError("Failed to update like. Please try again.");
      // Revert optimistic update on error
      setIdeas((prev) =>
        prev.map((i) =>
          i._id === ideaId
            ? {
                ...i,
                hasLiked: i.hasLiked, // Revert to original
                likes: i.likes, // Revert to original
              }
            : i
        )
      );
    }
  }, 500);

  const handleDelete = async () => {
    if (!ideaToDelete) return;
    try {
      await axios.delete(`/delete-idea/${ideaToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      dispatch(fetchBussinessIdea());
      setIdeaToDelete(null);
    } catch (error) {
      console.error("Error deleting idea:", error);
      setError("Failed to delete idea.");
      setIdeaToDelete(null);
    }
  };

  const filteredIdeas = ideas
    .filter((idea) => {
      const matchesCategory =
        selectedCategory === "All" || idea.businessCategory === selectedCategory;
      const matchesSearch =
        idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.overview?.toLowerCase().includes(searchQuery.toLowerCase());
      const isApproved = idea.approvalStatus === "approved";
      return matchesCategory && matchesSearch && isApproved;
    })
    .sort((a, b) => {
      const aIsOwn = a.user?._id === userData?._id ? 1 : 0;
      const bIsOwn = b.user?._id === userData?._id ? 1 : 0;
      if (aIsOwn !== bIsOwn) return bIsOwn - aIsOwn;

      const rankOrder = { Gold: 3, Silver: 2, Bronze: 1, "": 0 };
      const rankA = rankOrder[a.ranking || ""];
      const rankB = rankOrder[b.ranking || ""];
      if (rankA !== rankB) return rankB - rankA;

      const likesA = a.likes?.length || 0;
      const likesB = b.likes?.length || 0;
      return likesB - likesA;
    });

  const filteredApplications = applications.filter((app) => {
    console.log("Application:", app);
    if (!app._id || !isValidObjectId(app._id)) {
      console.warn("Invalid Application (missing or invalid _id):", app);
      return false;
    }
    if (app.status !== "approved") {
      console.warn("Invalid Application (not approved):", app);
      return false;
    }
    const matchesSearch =
      app.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.fundingPurpose?.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === "All") {
      return matchesSearch;
    }
    if (selectedCategory === "Student Support") {
      const matchesCategory = app.fundingPurpose === "Student Support";
      return (
        (matchesCategory || applications.every((app) => app.fundingPurpose !== "Student Support")) &&
        matchesSearch
      );
    }
    const matchesCategory = app.fundingPurpose === selectedCategory;
    return matchesCategory && matchesSearch;
  });
  console.log("Filtered Applications for Render:", filteredApplications);

  return (
    <div className="min-h-screen bg-gray-100">
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>

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

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "ideas" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    viewMode === "businessIdeas"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("businessIdeas")}
                >
                  Business Ideas
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    viewMode === "studentApplications"
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={() => setViewMode("studentApplications")}
                >
                  Student Applications
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${viewMode === "businessIdeas" ? "opportunities" : "applications"}...`}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-shrink-0">
                <select
                  className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  value={selectedCategory}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setSelectedCategory(newCategory);
                    setViewMode(newCategory === "Student Support" ? "studentApplications" : "businessIdeas");
                  }}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-6 rounded-lg text-center bg-red-100 text-red-800"
          >
            {error}
          </motion.div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === "ideas" && (
              <>
                {viewMode === "businessIdeas" ? (
                  filteredIdeas.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-8 text-center rounded-lg shadow-md bg-white"
                    >
                      <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-600">
                        No approved business ideas found
                      </p>
                      <p className="mt-2 text-gray-500">
                        Try changing your filter criteria or check back later
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredIdeas.map((idea) => {
                        const isOwnIdea = idea.user?._id === userData?._id;
                        const unreadCount = idea.unreadCount || 0;
                        const ranking = idea.ranking;

                        return (
                          <motion.div
                            key={idea._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            whileHover={{
                              scale: 1.03,
                              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                            }}
                            className={`relative rounded-2xl overflow-hidden shadow-lg border transition-all duration-300 ${
                              isOwnIdea
                                ? "bg-gradient-to-br from-teal-400 to-purple-500 text-white border-teal-300"
                                : "bg-white border-gray-100"
                            }`}
                          >
                            {ranking && idea.approvalStatus === "approved" && (
                              <motion.div
                                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-md ${
                                  ranking === "Gold"
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-white"
                                    : ranking === "Silver"
                                    ? "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                                    : "bg-gradient-to-r from-amber-700 to-amber-900 text-white"
                                }`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 .587l3.668 7.431 8.332 1.21-6.001 5.856 1.416 8.265L12 18.896l-7.415 4.453 1.416-8.265-6.001-5.856 8.332-1.21L12 .587z" />
                                </svg>
                                {ranking}
                              </motion.div>
                            )}

                            {isOwnIdea && (
                              <div
                                className={`absolute top-4 ${
                                  ranking ? "left-24" : "left-4"
                                } flex items-center gap-2`}
                              >
                                <span className="px-3 py-1 bg-white text-teal-600 text-xs font-semibold rounded-full shadow">
                                  My Idea
                                </span>
                                {unreadCount > 0 && (
                                  <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              {isOwnIdea && (
                                <>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => navigate(`/edit-idea/${idea._id}`)}
                                    className="p-2 bg-white text-teal-600 rounded-full hover:bg-teal-100 transition-colors"
                                    title="Edit idea"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setIdeaToDelete(idea._id)}
                                    className="p-2 bg-white text-red-600 rounded-full hover:bg-red-100 transition-colors"
                                    title="Delete idea"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </motion.button>
                                </>
                              )}
                            </div>

                            <div className={`p-6 ${isOwnIdea || ranking ? "pt-14" : ""}`}>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex justify-between items-start gap-4"
                              >
                                <div className="flex-1">
                                  <h3
                                    className={`text-lg font-semibold hover:text-teal-200 transition-colors cursor-pointer ${
                                      isOwnIdea ? "text-white" : "text-gray-900"
                                    }`}
                                    onClick={() => navigate(`/startup-detail/${idea._id}`)}
                                  >
                                    {idea.title}
                                  </h3>
                                  <p
                                    className={`text-sm mt-1 ${
                                      isOwnIdea ? "text-gray-200" : "text-gray-500"
                                    }`}
                                  >
                                    by {idea.user?.fullName || "Unknown"}
                                  </p>
                                </div>
                                <motion.span
                                  whileHover={{ scale: 1.05 }}
                                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                                    isOwnIdea
                                      ? "bg-teal-100 text-teal-800"
                                      : "bg-blue-50 text-blue-700"
                                  }`}
                                >
                                  {idea.businessCategory || "Not specified"}
                                </motion.span>
                              </motion.div>

                              <motion.p
                                className={`mt-4 text-sm line-clamp-3 ${
                                  isOwnIdea ? "text-gray-200" : "text-gray-600"
                                }`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                              >
                                {idea.overview || "No overview provided"}
                              </motion.p>

                              <motion.div
                                className="mt-4 grid grid-cols-2 gap-4 text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <div className={isOwnIdea ? "text-gray-200" : "text-gray-600"}>
                                  <span className="font-medium">Funding Needed:</span>
                                  <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className={`ml-1 ${
                                      isOwnIdea ? "text-teal-100" : "text-blue-600"
                                    }`}
                                  >
                                    {idea.fundingNeeded || "Not specified"}
                                  </motion.span>
                                </div>
                                <div className={isOwnIdea ? "text-gray-200" : "text-gray-600"}>
                                  <span className="font-medium">Stage:</span>
                                  <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className={`ml-1 ${
                                      isOwnIdea ? "text-teal-100" : "text-blue-600"
                                    }`}
                                  >
                                    {idea.currentStage || "Not specified"}
                                  </motion.span>
                                </div>
                              </motion.div>

                              <div className="mt-6 flex justify-between items-center relative">
                                <span className={`text-sm ${isOwnIdea ? "text-gray-200" : "text-gray-500"}`}>
                                  {idea.entrepreneurLocation || "Not specified"}
                                </span>
                                <div className="relative">
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleLikeToggle(idea._id)}
                                    disabled={!userData?._id || userData.role !== "investor"}
                                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors shadow-sm ${
                                      idea.hasLiked
                                        ? isOwnIdea
                                          ? "bg-red-100 text-red-600"
                                          : "bg-red-50 text-red-600"
                                        : isOwnIdea
                                        ? "bg-white text-gray-600"
                                        : "bg-gray-50 text-gray-600"
                                    } ${
                                      !userData?._id || userData.role !== "investor"
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                                    aria-label={idea.hasLiked ? "Unlike idea" : "Like idea"}
                                  >
                                    {idea.hasLiked ? (
                                      <FaThumbsUp className="h-5 w-5" />
                                    ) : (
                                      <FaRegThumbsUp className="h-5 w-5" />
                                    )}
                                    <span>{(idea.likes?.length || 0)}</span>
                                  </motion.button>
                                  {likedIdeaId === idea._id && (
                                    <motion.div
                                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                                      initial={{ scale: 0, opacity: 1, y: 0 }}
                                      animate={{ scale: 2, opacity: 0, y: -20 }}
                                      transition={{ duration: 0.6 }}
                                    >
                                      <FaThumbsUp className="h-6 w-6 text-red-600" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>

                              <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(`/startup-detail/${idea._id}`)}
                                className={`mt-6 w-full py-2.5 rounded-lg font-medium transition-colors shadow-md ${
                                  isOwnIdea
                                    ? "bg-white text-teal-600 hover:bg-teal-100"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                }`}
                              >
                                View Details
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )
                ) : filteredApplications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 text-center rounded-lg shadow-md bg-white"
                  >
                    <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600">
                      No approved applications found
                    </p>
                    <p className="mt-2 text-gray-500">
                      Try changing your filter criteria or check back later
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app) => (
                      <motion.div
                        key={app._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
                        }}
                        className="relative rounded-2xl overflow-hidden shadow-lg border bg-white border-gray-100"
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h3
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                onClick={() => navigate(`/student-applications/${app._id}`)}
                              >
                                {app.fullName}
                              </h3>
                              <p className="text-sm mt-1 text-gray-500">
                                {app.contactEmail}
                              </p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate(`/student-applications/${app._id}`)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                            >
                              <GraduationCap className="h-4 w-4" />
                            </motion.button>
                          </div>
                          <motion.p
                            className="mt-4 text-sm line-clamp-3 text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <strong>Purpose:</strong> {app.fundingPurpose}
                          </motion.p>
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Amount:</span>
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="ml-1 text-blue-600"
                              >
                                ${app.fundingAmount}
                              </motion.span>
                            </div>
                            <div>
                              <span className="font-medium">Status:</span>
                              <motion.span
                                whileHover={{ scale: 1.05 }}
                                className="ml-1 text-green-600"
                              >
                                Approved
                              </motion.span>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate(`/student-applications/${app._id}`)}
                            className="mt-6 w-full py-2.5 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "blogs" && <BlogsPage />}
            {activeTab === "chat" && <ChatPage />}
          </>
        )}

        <motion.button
          onClick={() => navigate("/Chatbot")}
          className="fixed bottom-6 left-6 p-4 bg-green-600 text-white rounded-full shadow-lg z-50"
          animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
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

        {userData?.role === "entrepreneur" && (
          <motion.button
            onClick={() => navigate("/FundingTypeSelector")}
            className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg z-50"
            whileHover={{ scale: 1.1, rotate: 10, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.9, rotate: -10 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default EntrepreneurDashboard;