import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Briefcase,
  Trophy,
  DollarSign,
  Target,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Instagram,
  X,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../redux/UserSlice";
import axios from "axios";

const mockIncomeData = [
  { year: "2019", amount: 2.5 },
  { year: "2020", amount: 3.8 },
  { year: "2021", amount: 4.2 },
  { year: "2022", amount: 5.1 },
  { year: "2023", amount: 6.4 },
  { year: "2024", amount: 7.2 },
];

const InvestorProfile = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const navigate = useNavigate();
  const { userData, error, loading, status } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [showLikedIdeas, setShowLikedIdeas] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [likedIdeas, setLikedIdeas] = useState([
    {
      id: 1,
      title: "Green Energy Solution",
      description: "Renewable energy technology for sustainable future",
      likes: 156,
      isLiked: true,
    },
    {
      id: 2,
      title: "Healthcare AI",
      description: "AI-powered diagnostic tools for healthcare",
      likes: 89,
      isLiked: true,
    },
    {
      id: 3,
      title: "Smart Agriculture",
      description: "IoT solutions for precision farming",
      likes: 234,
      isLiked: true,
    },
  ]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [requestActionLoading, setRequestActionLoading] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const token = localStorage.getItem("authToken");
  const API_URL = "https://ethio-capital-backend-123.onrender.com/api/v1";

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log("User data loaded:", userData.userData); // Debug log
    if (token) {
      console.log("Fetching access requests for user:", userData.userData?._id); // Debug log
      fetchAccessRequests();
    }
  }, [userData.userData, token]);

  const fetchAccessRequests = async () => {
    if (!userData.userData?._id || !token) {
      console.log("Missing user ID or token:", { userId: userData.userData?._id, token }); // Debug log
      return;
    }
    setIsRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/document-access/requests/${userData.userData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Access requests fetched:", response.data.requests); // Debug log
      setAccessRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching access requests:", error.response?.data || error.message);
      alert("Failed to fetch access requests. Check console for details.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAccessRequestAction = async (requestId, action) => {
    setRequestActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(
        `${API_URL}/document-access/action`,
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccessRequests((prev) => prev.filter((req) => req._id !== requestId));
      alert(`Request ${action}d successfully!`);
      await fetchAccessRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.response?.data || error.message);
      alert(`Failed to ${action} request. Please try again.`);
    } finally {
      setRequestActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const toggleLike = (ideaId) => {
    setLikedIdeas((ideas) =>
      ideas.map((idea) => (idea.id === ideaId ? { ...idea, isLiked: !idea.isLiked } : idea))
    );
  };

  const investor = {
    name: "John Maxwell",
    title: "Angel Investor & Venture Capitalist",
    capital: "$50M",
    preferredFields: ["Technology", "Healthcare", "Renewable Energy"],
    experience: "15+ years",
    successfulExits: 12,
    portfolioCompanies: 25,
    about: "Serial entrepreneur turned investor with a passion for transformative technologies and sustainable solutions.",
    socialLinks: {
      linkedin: "linkedin.com/johnmaxwell",
      twitter: "twitter.com/johnmaxwell",
      website: "johnmaxwell.com",
      instagram: "instagram.com/johnmaxwell",
      email: "john@maxwell.com",
    },
    previousInvestments: [
      {
        name: "TechCorp",
        result: "3x Return",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234A90E2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3ETechCorp%3C/text%3E%3C/svg%3E",
        description: "A leading technology company specializing in AI solutions.",
      },
      {
        name: "HealthInnovate",
        result: "5x Return",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%2350E3C2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EHealthInnovate%3C/text%3E%3C/svg%3E",
        description: "Healthcare technology platform revolutionizing patient care.",
      },
      {
        name: "GreenEnergy",
        result: "2.5x Return",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234CAF50'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EGreenEnergy%3C/text%3E%3C/svg%3E",
        description: "Renewable energy solutions provider focusing on solar and wind.",
      },
    ],
  };

  const redirectToInvestorDashboard = () => {
    navigate("/Entrepreneur-dashboard");
  };

  const redirectToInvestorProfileForm = () => {
    navigate("/Investor-profile-form");
  };

  console.log("Rendering with user role:", userData.userData?.role); // Debug log

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <button
            onClick={redirectToInvestorDashboard}
            className="hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">
            {userData.userData?.role === "entrepreneur" ? "Entrepreneur Profile" : "Investor Profile"}
          </h1>
        </div>
        <motion.button
          onClick={() => navigate("/BoardDashboard")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg z-50 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M9 21V3m0 0l3.5 3.5M9 3L5.5 6.5" />
          </svg>
          Board
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={redirectToInvestorProfileForm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-4 right-4 z-10"
        >
          Profile Form
        </motion.button>
      </div>

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
                <img
                  src={userData.photo || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="text-white text-center md:text-left">
                <h1 className="text-3xl font-bold">{userData?.user?.fullName || investor.name}</h1>
                <p className="text-blue-100">{userData.title || investor.title}</p>
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <a
                    href={userData?.socialLinks?.linkedin || investor.socialLinks.linkedin}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href={userData?.socialLinks?.twitter || investor.socialLinks.twitter}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={userData?.socialLinks?.website || investor.socialLinks.website}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                  <a
                    href={`mailto:${userData?.socialLinks?.email || investor.socialLinks.email}`}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                  <a
                    href={userData?.socialLinks?.instagram || investor.socialLinks.instagram}
                    className="text-white hover:text-blue-200 transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Toggle Button for Document Requests - Removed role check */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRequests(!showRequests)}
              className="flex items-center justify-center gap-2 py-3 px-8 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {showRequests ? "Hide Document Requests" : "View Document Requests"}
              <svg
                className={`w-5 h-5 transform transition-transform ${showRequests ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Document Access Requests Section - Removed role check */}
          <AnimatePresence>
            {showRequests && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-8 border-t border-gray-200 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Document Access Requests</h2>
                  <button
                    onClick={fetchAccessRequests}
                    disabled={isRefreshing}
                    className={`flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${
                      isRefreshing ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>
                {loading ? (
                  <div className="text-center py-4">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-gray-500 mt-2">Loading requests...</p>
                  </div>
                ) : accessRequests.length > 0 ? (
                  <div className="space-y-6">
                    {accessRequests.map((request) => (
                      <motion.div
                        key={request._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2">
                            <p className="text-gray-800 font-medium">
                              <span className="text-blue-600">
                                {request.requesterName || `Investor #${request.requesterId.slice(-6)}`}
                              </span>{" "}
                              requested access to{" "}
                              <span className="text-blue-600">{request.ideaTitle || request.ideaId}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              Requested: {new Date(request.createdAt).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              Status:{" "}
                              <span
                                className={`capitalize ${
                                  request.status === "pending"
                                    ? "text-yellow-600"
                                    : request.status === "approved"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {request.status || "Pending"}
                              </span>
                            </p>
                          </div>
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAccessRequestAction(request._id, "approve")}
                              disabled={requestActionLoading[request._id] || request.status !== "pending"}
                              className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                                requestActionLoading[request._id] || request.status !== "pending"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <CheckCircle className="w-5 h-5" />
                              {requestActionLoading[request._id] ? "Approving..." : "Approve"}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAccessRequestAction(request._id, "deny")}
                              disabled={requestActionLoading[request._id] || request.status !== "pending"}
                              className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                requestActionLoading[request._id] || request.status !== "pending"
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <XCircle className="w-5 h-5" />
                              {requestActionLoading[request._id] ? "Denying..." : "Deny"}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4 text-lg">
                    No document access requests available.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Liked Ideas Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Liked Ideas</h2>
              <button
                onClick={() => setShowLikedIdeas(!showLikedIdeas)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showLikedIdeas ? "Hide Ideas" : "Show Ideas"}
              </button>
            </div>

            <AnimatePresence>
              {showLikedIdeas && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {likedIdeas.map((idea) => (
                    <motion.div
                      key={idea.id}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
                        <p className="text-gray-600 mb-4">{idea.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{idea.likes} likes</span>
                          <button
                            onClick={() => toggleLike(idea.id)}
                            className={`p-2 rounded-full ${
                              idea.isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-500"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill={idea.isLiked ? "currentColor" : "none"}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Key Information and Performance */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="text-blue-600" />
                  Key Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-blue-600" />
                    <span className="font-medium">Available Capital:</span>
                    <span>{userData.capital || investor.capital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-blue-600" />
                    <span className="font-medium">Experience:</span>
                    <span>{userData.experience || investor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="text-blue-600" />
                    <span className="font-medium">Successful Exits:</span>
                    <span>{userData.successfulExits || investor.successfulExits}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="text-blue-600" />
                  Preferred Fields
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(userData?.preferredFields || investor.preferredFields).map((field, index) => (
                    <span key={index} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {field}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4">Investment Performance</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockIncomeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: "#2563eb" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Portfolio Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8"
          >
            <h2 className="text-xl font-semibold mb-6">Portfolio Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(userData?.previousInvestments || investor.previousInvestments).map((investment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => setSelectedPortfolio(investment)}
                >
                  <img src={investment.image} alt={investment.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold">{investment.name}</h3>
                    <p className="text-green-600">{investment.result}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Portfolio Modal */}
          <AnimatePresence>
            {selectedPortfolio && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={() => setSelectedPortfolio(null)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-xl p-6 max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{selectedPortfolio.name}</h3>
                    <button
                      onClick={() => setSelectedPortfolio(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <img
                    src={selectedPortfolio.image}
                    alt={selectedPortfolio.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600 mb-2">{selectedPortfolio.description}</p>
                  <p className="text-green-600 font-semibold">Return: {selectedPortfolio.result}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-gray-50 mt-4"
          >
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{userData.about || investor.about}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorProfile;