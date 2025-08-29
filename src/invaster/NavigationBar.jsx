// import React, { useEffect, useRef, useState } from "react";
// import {
//   Bell,
//   ChevronDown,
//   MessageSquare,
//   Briefcase,
//   BookOpen,
//   TrendingUp,
//   Menu,
//   X,
// } from "lucide-react";
// import MessageConversationModal from "../Add/MessageConversationModal";
// import setupAxios from "../middleware/MiddleWare";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUnReadMessages } from "../redux/MessageSlice";
// import { fetchUserData } from "../redux/UserSlice";
// import { set } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import { use } from "react";

// const NavigationBar = ({
//   userData,
//   showNotifications,
//   showProfile,
//   showMessages,
//   onToggleNotifications,
//   onToggleProfile,
//   onToggleMessages,
//   onLogout,
//   activeTab,
//   setActiveTab,
//   setIsBlog,
//   setIsIdea,
//   messageData = [],
//   setMessages,
// }) => {
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const notificationToggleRef = useRef(null);
//   const notificationDropdownRef = useRef(null);
//   const profileToggleRef = useRef(null);
//   const profileDropdownRef = useRef(null);
//   const messageToggleRef = useRef(null);
//   const messageDropdownRef = useRef(null);
//   const dispatch = useDispatch();
//   const { messageDatas } = useSelector((state) => state.messageDatas);
//   const navigate = useNavigate();
//   const [role, setRole] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         showNotifications &&
//         notificationToggleRef.current &&
//         !notificationToggleRef.current.contains(event.target) &&
//         notificationDropdownRef.current &&
//         !notificationDropdownRef.current.contains(event.target)
//       ) {
//         onToggleNotifications();
//       }

//       if (
//         showProfile &&
//         profileToggleRef.current &&
//         !profileToggleRef.current.contains(event.target) &&
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(event.target)
//       ) {
//         onToggleProfile();
//       }

//       if (
//         showMessages &&
//         messageToggleRef.current &&
//         !messageToggleRef.current.contains(event.target) &&
//         messageDropdownRef.current &&
//         !messageDropdownRef.current.contains(event.target)
//       ) {
//         onToggleMessages();
//       }
//     };

//     document.addEventListener("click", handleClickOutside);
//     return () => document.removeEventListener("click", handleClickOutside);
//   }, [
//     showNotifications,
//     showProfile,
//     showMessages,
//     onToggleNotifications,
//     onToggleProfile,
//     onToggleMessages,
//   ]);

//   useEffect(() => {
//     setMessages(messageDatas);
//   }, [messageDatas, userData]);

//   useEffect(() => {
//     if (role === "admin") {
//       isAdmin(true);
//     }
//   }, [role]);

//   const fetchAdminMessages = async () => {
//     try {
//       const response = await axios.get(`/fetch-messages-for-user/${userData?._id}`);
//       setMessages(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (userData?.role === 'admin') {
//       setRole(userData?.role);
//       fetchAdminMessages();
//     } else {
//       if (userData?._id) {
//         dispatch(fetchUnReadMessages(userData?._id));
//       }
//     }
//   }, [dispatch]);

//   const unreadMessages = messageData?.filter((msg) => msg.isNew).length;

//   const handleReadMessage = async (message) => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.id === message.id ? { ...msg, isNew: false } : msg
//       )
//     );
//     try {
//       const response = await axios.post(`/update-isNew/${message}`);
//       console.log(response);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleMessageSelect = (message) => {
//     if (message.conversationId) {
//       navigate(`/Startup-Detail/${message.conversationId.idea}`);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === message.id ? { ...msg, isNew: false } : msg
//         )
//       );
//       handleReadMessage(message._id);
//     } else if (role === 'admin') {
//       setSelectedMessage(message);
//       setMessages((prev) =>
//         prev.map((msg) =>
//           msg.id === message.id ? { ...msg, isNew: false } : msg
//         )
//       );
//       onToggleMessages();
//     }
//   };

//   return (
//     <nav className="bg-white shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 py-3">
//         <div className="flex flex-col space-y-4">
//           {/* Top Navigation */}
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-blue-600">EthioCapital</h1>

//             {/* Mobile Menu Button */}
//             <button
//               className="lg:hidden p-2"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? (
//                 <X className="h-6 w-6 text-gray-600" />
//               ) : (
//                 <Menu className="h-6 w-6 text-gray-600" />
//               )}
//             </button>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center gap-6">
//               {/* Messages Dropdown */}
//               <div className="relative">
//                 <button
//                   ref={messageToggleRef}
//                   onClick={onToggleMessages}
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
//                 >
//                   <MessageSquare className="h-5 w-5" />
//                   Messages
//                   {unreadMessages > 0 && (
//                     <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
//                       {unreadMessages}
//                     </span>
//                   )}
//                 </button>

//                 {showMessages && (
//                   <div
//                     ref={messageDropdownRef}
//                     className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
//                   >
//                     <div className="px-4 py-2 border-b">
//                       <h3 className="text-sm font-semibold text-gray-700">
//                         Recent Conversations
//                       </h3>
//                     </div>
//                     <div className="max-h-96 overflow-y-auto">
//                       {messageData.map((message) => (
//                         <div
//                           key={message._id}
//                           className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
//                           onClick={() => handleMessageSelect(message)}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div
//                               className={`h-8 w-8 ${
//                                 message.isNew ? "bg-blue-100" : "bg-gray-100"
//                               } rounded-full flex items-center justify-center`}
//                             >
//                               <span
//                                 className={`text-sm font-medium ${
//                                   message.isNew ? "text-blue-600" : "text-gray-600"
//                                 }`}
//                               >
//                                 {message.sender.slice(0, 2).toUpperCase()}
//                               </span>
//                             </div>
//                             <div className="flex-1">
//                               <div className="flex justify-between items-center">
//                                 <h4 className="text-sm font-medium text-gray-900">
//                                   {message.sender}
//                                   {message.isNew && (
//                                     <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
//                                   )}
//                                 </h4>
//                                 <span className="text-xs text-gray-500">
//                                   {new Date(message.timestamp).toLocaleTimeString(
//                                     [],
//                                     {
//                                       hour: "2-digit",
//                                       minute: "2-digit",
//                                     }
//                                   )}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-gray-600 truncate">
//                                 {message.text}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="px-4 py-2 border-t">
//                       <button
//                         className="w-full text-sm text-blue-600 hover:text-blue-700"
//                         onClick={() => {
//                           setSelectedMessage({ new: true });
//                           onToggleMessages();
//                         }}
//                       >
//                         Start New Conversation
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Notifications Dropdown */}
//               <div className="relative">
//                 <button
//                   ref={notificationToggleRef}
//                   className="relative"
//                   onClick={onToggleNotifications}
//                 >
//                   <Bell className="h-6 w-6 text-gray-600" />
//                   <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
//                 </button>

//                 {showNotifications && (
//                   <div
//                     ref={notificationDropdownRef}
//                     className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
//                   >
//                     <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                       <p className="text-sm text-gray-600">
//                         <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
//                         New startup idea in Agriculture sector
//                       </p>
//                     </div>
//                     <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                       <p className="text-sm text-gray-600">
//                         <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
//                         Your interested project update
//                       </p>
//                     </div>
//                     <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
//                       <p className="text-sm text-gray-600">
//                         Weekly trending startups report
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Profile Dropdown */}
//               <div className="relative">
//                 <button
//                   ref={profileToggleRef}
//                   className="flex items-center gap-2"
//                   onClick={onToggleProfile}
//                 >
//                   <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-medium">
//                       {userData?.fullName?.slice(0, 2).toUpperCase()}
//                     </span>
//                   </div>
//                   <span className="text-gray-700">{userData?.fullName}</span>
//                   <ChevronDown className="h-4 w-4 text-gray-500" />
//                 </button>

//                 {showProfile && (
//                   <div
//                     ref={profileDropdownRef}
//                     className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
//                   >
//                     <a
//                       href="/Investor-Profile"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       Your Profile
//                     </a>
//                     <a
//                       href="#settings"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                     >
//                       Settings
//                     </a>
//                     <a
//                       href="/login"
//                       onClick={onLogout}
//                       className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
//                     >
//                       Sign out
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Mobile Menu */}
//           {isMobileMenuOpen && (
//             <div className="lg:hidden space-y-4 pt-4">
//               <div className="flex flex-col space-y-4">
//                 <button
//                   onClick={onToggleMessages}
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
//                 >
//                   <MessageSquare className="h-5 w-5" />
//                   Messages
//                   {unreadMessages > 0 && (
//                     <span className="ml-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
//                       {unreadMessages}
//                     </span>
//                   )}
//                 </button>

//                 <button
//                   onClick={onToggleNotifications}
//                   className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
//                 >
//                   <Bell className="h-5 w-5" />
//                   Notifications
//                 </button>

//                 <div className="px-4 py-2">
//                   <div className="flex items-center gap-2">
//                     <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
//                       <span className="text-blue-600 font-medium">
//                         {userData?.fullName?.slice(0, 2).toUpperCase()}
//                       </span>
//                     </div>
//                     <span className="text-gray-700">{userData?.fullName}</span>
//                   </div>
//                   <div className="mt-2 space-y-2">
//                     <a
//                       href="/Investor-Profile"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
//                     >
//                       Your Profile
//                     </a>
//                     <a
//                       href="#settings"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
//                     >
//                       Settings
//                     </a>
//                     <a
//                       href="/login"
//                       onClick={onLogout}
//                       className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
//                     >
//                       Sign out
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Navigation Tabs */}
//           <div className="flex space-x-6 border-b overflow-x-auto">
//             <button
//               onClick={() => {
//                 setActiveTab("ideas");
//               }}
//               className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
//                 activeTab === "ideas"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <Briefcase className="h-5 w-5" />
//               Investment Ideas
//             </button>

//             <button
//               onClick={() => {
//                 setActiveTab("blogs");
//               }}
//               className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
//                 activeTab === "blogs"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <BookOpen className="h-5 w-5" />
//               Blogs
//             </button>

//             <button
//               onClick={() => setActiveTab("trending")}
//               className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
//                 activeTab === "trending"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700"
//               }`}
//             >
//               <TrendingUp className="h-5 w-5" />
//               Trending
//             </button>

//           </div>
//         </div>
//       </div>

//       {/* Message Conversation Modal */}
//       <MessageConversationModal
//         selectedMessage={selectedMessage}
//         setSelectedMessage={setSelectedMessage}
//         messages={messageData}
//         setMessages={setMessages}
//       />
//     </nav>
//   );
// };

// export default NavigationBar;

import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  Briefcase,
  BookOpen,
  TrendingUp,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import MessageConversationModal from "../Add/MessageConversationModal";
import setupAxios from "../middleware/MiddleWare";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnReadMessages } from "../redux/MessageSlice";
import { fetchUserData } from "../redux/UserSlice";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const NavigationBar = ({
  userData,
  showNotifications,
  showProfile,
  onToggleNotifications,
  onToggleProfile,
  onLogout,
  activeTab,
  setActiveTab,
  setIsBlog,
  setIsIdea,
  messageData = [],
  setMessages,
}) => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notificationToggleRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const profileToggleRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const { messageDatas } = useSelector((state) => state.messageDatas);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent multiple submissions

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/notifications/${userData?._id}`);
        // console.log("Notifications fetched:", response.data);

        setNotifications(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, [userData]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNotifications &&
        notificationToggleRef.current &&
        !notificationToggleRef.current.contains(event.target) &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        onToggleNotifications();
      }

      if (
        showProfile &&
        profileToggleRef.current &&
        !profileToggleRef.current.contains(event.target) &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        onToggleProfile();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotifications, showProfile, onToggleNotifications, onToggleProfile]);

  useEffect(() => {
    setMessages(messageDatas);
  }, [messageDatas, userData]);

  useEffect(() => {
    if (role === "admin") {
      setIsAdmin(true);
    }
  }, [role]);

  const fetchAdminMessages = async () => {
    try {
      const response = await axios.get(
        `/fetch-messages-for-user/${userData?._id}`
      );
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.role === "admin") {
      setRole(userData?.role);
      fetchAdminMessages();
    } else {
      if (userData?._id) {
        dispatch(fetchUnReadMessages(userData?._id));
      }
    }
  }, [dispatch, userData]);

  // Count unread messages for notifications
  const unreadNotifications = notifications?.filter((msg) => msg.status === "unread").length;

  const handleReadMessage = async (message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === message._id ? { ...msg, isNew: false } : msg
      )
    );
    try {
      const response = await axios.post(`/update-isNew/${message._id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageSelect = (message) => {
    if (message.conversationId) {
      navigate(`/Startup-Detail/${message.conversationId.idea}`);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === message._id ? { ...msg, isNew: false } : msg
        )
      );
      handleReadMessage(message);
    } else if (role === "admin") {
      setSelectedMessage(message);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === message._id ? { ...msg, isNew: false } : msg
        )
      );
      onToggleNotifications();
    }
  };

  // Handle opening complaint form
  const handleOpenComplaintForm = () => {
    setSelectedMessage({ new: true, isComplaint: true });
  };

  // Handle complaint submission
  const handleSubmitComplaint = async (responseText) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://ethiocapital-back.onrender.com/api/v1/complaint",
        { responseText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Complaint submitted:", response.data);
      setSelectedMessage(null); // Close modal
      navigate("/admin/complaints"); // Navigate to admin page
    } catch (error) {
      console.error("Error submitting complaint:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/notifications/${notificationId}/read`);
      if (response.status === 200) {
        // Update the notifications state to reflect the new status
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, status: "read" }
              : notification
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err.message);
      setError("Failed to mark notification as read");
    }
  };

  // Initialize Socket.IO and listen for notifications
  const userId = userData?._id;
  // Replace with authenticated user ID
  const jwtToken = localStorage.getItem("authToken");
  useEffect(() => {
    const socket = io("http://localhost:3001", {
      auth: {
        token: jwtToken,
      },
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("joinNotificationRoom", userId);
    });

    socket.on("notification", (notification) => {
      console.log("Received new notification:", notification);
      setNotifications((prev) => [notification, ...prev]); // Add new notification to the top
    });

    socket.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("Disconnected from WebSocket server");
    };
  }, [userId]);

  // Handle notification click (optional, e.g., for navigation or other actions)
  const handleNotificationSelect = (notification) => {
    // Add logic here if clicking a notification should trigger an action (e.g., navigate to a page)
    console.log("Selected notification:", notification);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col space-y-4">
          {/* Top Navigation */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">EthioCapital</h1>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Complaints Button */}
              <button
                onClick={handleOpenComplaintForm}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
                Complaints
              </button>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  ref={notificationToggleRef}
                  onClick={onToggleNotifications}
                  className="relative flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    ref={notificationDropdownRef}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {showNotifications && (
                        <div
                          ref={notificationDropdownRef}
                          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
                        >
                          <div className="max-h-96 overflow-y-auto">
                            {unreadNotifications === 0 ? (
                              <div className="px-4 py-3 text-sm text-gray-600">
                                No notifications
                              </div>
                            ) : (
                              notifications
                                .filter(
                                  (notification) =>
                                    notification.status === "unread"
                                )
                                .map((notification) => (
                                  <div
                                    key={notification._id}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                    onClick={() =>
                                      handleNotificationSelect(notification)
                                    }
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-blue-600">
                                          {notification.user?.fullName
                                            ?.slice(0, 2)
                                            .toUpperCase() || "U"}
                                        </span>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                          <h4 className="text-sm font-medium text-gray-900">
                                            {notification.user?.fullName ||
                                              "User"}
                                          </h4>
                                          <span className="text-xs text-gray-500">
                                            {new Date(
                                              notification.createdAt
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate">
                                          {notification.message}
                                        </p>
                                        <button
                                          className="mt-1 text-xs text-blue-600 hover:text-blue-800"
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering handleNotificationSelect
                                            markAsRead(notification._id);
                                          }}
                                        >
                                          Mark as Read
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                            )}
                            {error && (
                              <div className="px-4 py-2 text-sm text-red-600">
                                {error}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  ref={profileToggleRef}
                  className="flex items-center gap-2"
                  onClick={onToggleProfile}
                >
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {userData?.fullName?.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700">{userData?.fullName}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {showProfile && (
                  <div
                    ref={profileDropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <a
                      href="/Investor-Profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Settings
                    </a>
                    <a
                      href="/login"
                      onClick={onLogout}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden space-y-4 pt-4">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={handleOpenComplaintForm}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <MessageSquare className="h-5 w-5" />
                  Complaints
                </button>

                <button
                  onClick={onToggleNotifications}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg relative"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="ml-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                <div className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {userData?.fullName?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700">{userData?.fullName}</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <a
                      href="/Investor-Profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Your Profile
                    </a>
                    <a
                      href="#settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                    >
                      Settings
                    </a>
                    <a
                      href="/login"
                      onClick={onLogout}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex space-x-6 border-b overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab("ideas");
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "ideas"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              Investment Ideas
            </button>

            <button
              onClick={() => {
                setActiveTab("blogs");
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "blogs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              Blogs
            </button>

            {/* <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "trending"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              Trending
            </button> */}
          </div>
        </div>
      </div>

      {/* Message Conversation Modal (Used for Complaints) */}
      <MessageConversationModal
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        messages={messageData}
        setMessages={setMessages}
        onSubmitComplaint={handleSubmitComplaint}
      />
    </nav>
  );
};

export default NavigationBar;
