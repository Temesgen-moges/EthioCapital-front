import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart } from "lucide-react";
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [ideaToDelete, setIdeaToDelete] = useState(null);

  const { userData } = useSelector((state) => state.userData);
  const { BussinessIdea } = useSelector((state) => state.businessIdea);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Admin Support",
      text: "Welcome to EthioCapital!",
      isNew: true,
      timestamp: new Date().toISOString(),
      conversation: [],
    },
  ]);

  // Handlers for notifications and profile
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
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    setIdeas(BussinessIdea);
    dispatch(setBussinessIdea(BussinessIdea));
    setIsLoading(false);
  }, [BussinessIdea, dispatch]);

  const logout = () => {
    localStorage.removeItem("authToken");
    dispatch(clearBussinessIdea());
    navigate("/login");
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/compliant", { complaint });
      setComplaint("");
      setShowComplaintForm(false);
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  // Delete handler
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

  // Filtering logic
  const filteredIdeas = ideas.filter((idea) => {
    const matchesCategory =
      selectedCategory === "All" || idea.businessCategory === selectedCategory;
    const matchesSearch =
      idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.overview?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Interest handler
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
        messageData={messages}
        setMessages={setMessages}
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

        {showComplaintForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <form
              onSubmit={handleComplaintSubmit}
              className="bg-white p-8 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-xl font-bold mb-4">Contact Admin</h2>
              <textarea
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg mb-4 resize-none"
                placeholder="Describe your issue or concern..."
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
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
                          <div className="absolute top-2 left-2">
                            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                              My Idea
                            </span>
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
                                } // This is correct
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
          </>
        )}
      </div>

      {userData?.role === "entrepreneur" && (
        <motion.button
          onClick={() => navigate("/submit-idea")}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg transition-transform hover:scale-105"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
}

export default EntrepreneurDashboard;
