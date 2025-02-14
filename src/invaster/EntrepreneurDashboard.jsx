import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
import { fetchBussinessIdea } from "../redux/BussinessIdeaSlice";
import setupAxios from "../middleware/MiddleWare";
import { clearBussinessIdea, setBussinessIdea } from "../redux/BussinessIdeaSlice";
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
      conversation: []
    }
  ]);

  const handleNotificationsToggle = () => {
    setShowNotifications(prev => !prev);
    setShowProfile(false);
  };

  const handleProfileToggle = () => {
    setShowProfile(prev => !prev);
    setShowNotifications(false);
  };
  const handleMessagesToggle = () => {
    setShowMessages(prev => !prev);
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
    messageData={messages}
    setMessages={setMessages}
  />

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
            <form onSubmit={handleComplaintSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
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
                  .sort((a, b) => (b.user?._id === userData?._id) - (a.user?._id === userData?._id))
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

                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isOwnIdea && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => navigate(`/edit-idea/${idea._id}`)}
                              className="p-2 bg-blue-200 text-blue-700 rounded-full hover:bg-blue-300 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </motion.button>
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
                              <h3 className={`text-xl font-semibold hover:text-blue-600 transition-colors ${
                                isOwnIdea ? "text-blue-800" : "text-gray-900"
                              }`}>
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
                              <span className="font-medium">Funding Needed:</span>
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
                                <span>{idea.interestedInvestors} Interested</span>
                              </motion.button>
                            )}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/startup-detail/${idea._id}`)}
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
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Search, Heart, Bell, ChevronDown, User, BookOpen, Briefcase, TrendingUp, MessageSquare, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { PlusIcon } from '@heroicons/react/outline';
// import BlogsPage from '../All/BlogPage';
// import BlogAdminForm from '../Add/BlogAdminForm';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserData } from '../redux/UserSlice';
// import { fetchBussinessIdea } from '../redux/BussinessIdeaSlice';
// import setupAxios from '../middleware/MiddleWare';
// import { dispatch } from 'd3';
// import { clearBussinessIdea, setBussinessIdea } from '../redux/BussinessIdeaSlice';

// const mockData = {
//   currentInvestor: {
//     name: "Daniel Haile",
//     avatar: "DH",
//     notifications: [
//       { id: 1, text: "New startup idea in Agriculture sector", isNew: true },
//       { id: 2, text: "Your interested project 'Smart Irrigation' was updated", isNew: true },
//       { id: 3, text: "Weekly trending startups report", isNew: false },
//     ]
//   },
//   entrepreneurs: [
//     {
//       id: 1,
//       name: "Abebe Kebede",
//       title: "Smart Agriculture IoT Solution",
//       category: "Agriculture",
//       description: "Revolutionary IoT-based irrigation system for Ethiopian farmers",
//       fundingNeeded: "500000",
//       location: "Addis Ababa",
//       stage: "Seed",
//       interestedInvestors: 15,
//       hasShownInterest: false,
//       currentStage: "Prototype",
//     },
//     {
//       id: 2,
//       name: "Sara Mohammed",
//       title: "EthioTextiles",
//       category: "Manufacturing",
//       description: "Modern textile manufacturing using traditional Ethiopian patterns",
//       fundingNeeded: "750000",
//       location: "Dire Dawa",
//       stage: "Growth",
//       interestedInvestors: 23,
//       hasShownInterest: false,
//       currentStage: "MVP",
//     },
//   ]
// };

// const categories = [
//   "All", "Agriculture", "Manufacturing", "Technology",
//   "Healthcare", "Education", "Food Processing", "Tourism"
// ];

// function EntrepreneurDashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('ideas');
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [ideas, setIdeas] = useState([]);
//   const [isIdea, setIsIdea] = useState(true);
//   const [isBlog, setIsBlog] = useState(false);
//   const [isTrending, setIsTrending] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [showContactForm, setShowContactForm] = useState(false);
//   const [contactMessage, setContactMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState({});
//   const [role, setRole] = useState("investor");

//   const notificationRef = useRef(null);
//   const profileRef = useRef(null);

//   const dispatch = useDispatch();
//   const { userData, error, loading, status } = useSelector((state) => state.userData);
//   const { BussinessIdea = [] } = useSelector((state) => state.businessIdea);

//   useEffect(() => {
//     setupAxios();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//         setShowNotifications(false);
//       }
//       if (profileRef.current && !profileRef.current.contains(event.target)) {
//         setShowProfile(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     console.log("sending a dispatch");
//     const response = dispatch(fetchUserData());
//     console.log("User Data:", response);
//   }, [dispatch]);

//   useEffect(() => {
//     const fetchBusinessIdeas = async () => {
//       try {
//         setIsLoading(true);
//         const response = dispatch(fetchBussinessIdea());
//         const data = await response.json();
//         dispatch(setBussinessIdea(data));
//         setIsLoading(false);
//         console.log("BussinessIdea Data:", response);
//       } catch (error) {
//         console.error("Error fetching business ideas:", error);
//       }
//     };
//     fetchBusinessIdeas();
//   }, [dispatch]);

//   useEffect(() => {
//     setIsLoading(true);
//     setIdeas(BussinessIdea);
//     dispatch(setBussinessIdea(BussinessIdea));
//     setIsLoading(false);
//   }, [BussinessIdea]);

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     dispatch(clearBussinessIdea());
//   };

//   const handleContactSubmit = (e) => {
//     e.preventDefault();
//     // Here you would implement the logic to send the message to admin
//     console.log("Message sent to admin:", contactMessage);
//     setContactMessage("");
//     setShowContactForm(false);
//   };

//   const filteredIdeas = (Array.isArray(BussinessIdea) ? BussinessIdea : []).filter(idea => {
//     const matchesCategory = selectedCategory === "All" || idea.businessCategory === selectedCategory;
//     const searchLower = searchQuery.toLowerCase();
//     const matchesSearch =
//       (idea.title?.toLowerCase().includes(searchLower) || false) ||
//       (idea.overview?.toLowerCase().includes(searchLower) || false) ||
//       (idea.user?.fullName?.toLowerCase().includes(searchLower) || false);
//     return matchesCategory && matchesSearch;
//   });

//   const [showComplaintForm, setShowComplaintForm] = useState(false);
// const [complaint, setComplaint] = useState("");

// const handleComplaintSubmit = () => {
//   console.log("Complaint submitted:", complaint);
//   setComplaint("");
//   setShowComplaintForm(false);
// };

//   const handleInterest = (ideaId) => {
//     setIdeas(ideas.map(idea => {
//       if (idea._id === ideaId) {
//         return {
//           ...idea,
//           interestedInvestors: idea.hasShownInterest
//             ? idea.interestedInvestors - 1
//             : idea.interestedInvestors + 1,
//           hasShownInterest: !idea.hasShownInterest
//         };
//       }
//       return idea;
//     }));
//   };
//   // ... (keep all other existing functions)return (
//     return (
//     <div className="min-h-screen bg-gray-50">
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 py-3">
//         <div className="flex flex-col space-y-4">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-blue-600">EthioCapital</h1>

//             <div className="flex items-center gap-6">
//               {/* Notifications */}
//               <div className="relative" ref={notificationRef}>
//                 <button
//                   className="relative"
//                   onClick={() => setShowNotifications(!showNotifications)}
//                 >
//                   <Bell className="h-6 w-6 text-gray-600" />
//                   {mockData.currentInvestor.notifications.some(n => n.isNew) && (
//                     <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
//                   )}
//                 </button>

//                 {showNotifications && (
//                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10">
//                     {mockData.currentInvestor.notifications.map(notification => (
//                       <div
//                         key={notification.id}
//                         className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
//                       >
//                         <p className="text-sm text-gray-600">
//                           {notification.isNew && (
//                             <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
//                           )}
//                           {notification.text}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Profile */}
//               <div className="relative" ref={profileRef}>
//                 <button
//                   className="flex items-center gap-2"
//                   onClick={() => setShowProfile(!showProfile)}
//                 >
//                   <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-medium">
//                       {userData.educationDetails}
//                     </span>
//                   </div>
//                   <span className="text-gray-700">{userData.fullName}</span>
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </button>

//                 {showProfile && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
//                     <a href="/Investor-Profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                       Your Profile
//                     </a>
//                     <button
//                       onClick={() => setShowComplaintForm(true)}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       Contact Admin
//                     </button>
//                     <a href="#settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                       Settings
//                     </a>
//                     <a href="/login" onClick={() => logout()} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
//                       Sign out
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//             {/* Navigation Tabs */}
//             <div className="flex space-x-6 border-b">
//               <button
//                 onClick={() => {
//                   setActiveTab('ideas');
//                   setIsBlog(false);
//                   setIsIdea(true);
//                 }}
//                 className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'ideas'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//               >
//                 <Briefcase className="h-5 w-5" />
//                 Investment Ideas
//               </button>
//               <button
//                 onClick={() => {
//                   setActiveTab('blogs');
//                   setIsBlog(true);
//                   setIsIdea(false);
//                 }}

//                 className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'blogs'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//               >
//                 <BookOpen className="h-5 w-5" />
//                 Blogs
//               </button>
//               <button
//                 onClick={() => setActiveTab('trending')}
//                 className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${activeTab === 'trending'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//                   }`}
//               >
//                 <TrendingUp className="h-5 w-5" />
//                 Trending
//               </button>
//             </div>
//           </div>
//         </div>
//     </nav>

//     {/* Complaint Form Modal */}
//     {showComplaintForm && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-md">
//           <h3 className="text-lg font-semibold mb-4">Contact Admin</h3>
//           <textarea
//             className="w-full h-32 p-2 border rounded-lg mb-4 resize-none"
//             placeholder="Type your message here..."
//             value={complaint}
//             onChange={(e) => setComplaint(e.target.value)}
//           />
//           <div className="flex justify-end gap-4">
//             <button
//               onClick={() => setShowComplaintForm(false)}
//               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleComplaintSubmit}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Send Message
//             </button>
//           </div>
//         </div>
//       </div>
//     )}

// <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Search and Filter Section */}
//         {
//           !isBlog && (
//             <div className="flex flex-col md:flex-row gap-4 mb-8">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search opportunities..."
//                   className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//               <div className="flex-shrink-0">
//                 <select
//                   className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           )
//         }

//         {/* Ideas Grid */}
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
//           </div>
//         ) : (
//           <>
//             {isIdea && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {filteredIdeas.map((idea) => (
//                   <motion.div
//                     key={idea._id}
//                     whileHover={{ y: -5 }}
//                     className="bg-white rounded-xl shadow-md overflow-hidden"
//                   >
//                     <div className="p-6">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
//                           <p className="text-sm text-gray-600 mt-1">by {idea.user.fullName}</p>
//                         </div>
//                         <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                           {idea.businessCategory}
//                         </span>
//                       </div>

//                       <p className="mt-4 text-gray-600">{idea.overview}</p>

//                       <div className="mt-4 flex items-center justify-between">
//                         <div className="text-sm text-gray-600">
//                           <span className="font-medium">Funding Needed:</span> ${idea.fundingNeeded}
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           <span className="font-medium">Stage:</span> {idea.currentStage}
//                         </div>
//                       </div>

//                       <div className="mt-6 flex justify-between items-center">
//                         <span className="text-sm text-gray-600">{idea.entrepreneurLocation}</span>
//                         <button
//                           onClick={() => handleInterest(idea._id)}
//                           className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${idea.hasShownInterest ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
//                             }`}
//                         >
//                           <Heart className={`h-5 w-5 ${idea.hasShownInterest ? 'fill-current' : ''}`} />
//                           <span>{idea.interestedInvestors} Interested</span>
//                         </button>
//                       </div>

//                       <button
//                         onClick={() => navigate(`/startup-detail/${idea._id}`)}
//                         className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                       >
//                         View Details
//                       </button>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}

//             {isBlog &&
//               <BlogsPage />
//               // <BlogAdminForm />
//             }
//           </>
//         )}

//       </div>

//     {userData.role === "entrepreneur" && (
//       <>
//         <motion.button
//           onClick={() => navigate('/submit-idea')}
//           className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg transition-transform hover:scale-105"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <PlusIcon className="h-6 w-6" />
//         </motion.button>
//       </>
//     )}
//   </div>
// );
// }

// export default EntrepreneurDashboard;
