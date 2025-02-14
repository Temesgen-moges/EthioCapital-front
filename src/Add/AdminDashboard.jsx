// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import {
//   Bell,
//   MessageSquare,
//   DollarSign,
//   Users,
//   FileText,
//   TrendingUp,
//   X,
//   RefreshCw,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate

// // Mock Data
// const mockData = {
//   entrepreneurs: 50,
//   investors: 30,
//   totalRevenue: 15000,
//   monthlyRevenue: [
//     { name: "Jan", revenue: 1200 },
//     { name: "Feb", revenue: 2000 },
//     { name: "Mar", revenue: 2500 },
//     { name: "Apr", revenue: 3000 },
//     { name: "May", revenue: 3500 },
//     { name: "Jun", revenue: 4000 },
//     { name: "Jul", revenue: 4500 },
//     { name: "Aug", revenue: 5000 },
//     { name: "Sep", revenue: 6000 },
//     { name: "Oct", revenue: 7000 },
//     { name: "Nov", revenue: 8000 },
//     { name: "Dec", revenue: 9000 },
//   ],
//   notifications: [
//     { id: 1, text: "New investor registered", isNew: true },
//     { id: 2, text: "System update available", isNew: false },
//   ],
//   messages: [
//     {
//       id: 1,
//       sender: "John Doe",
//       text: "Can you provide more details about the investment?",
//       isNew: true,
//       responded: false,
//     },
//     {
//       id: 2,
//       sender: "Jane Smith",
//       text: "I have a question about the platform fees.",
//       isNew: true,
//       responded: false,
//     },
//   ],
//   subscriptions: {
//     "3 Months": { count: 20, Total: 30000 },
//     "6 Months": { count: 15, Total: 37500 },
//     "1 Year": { count: 10, Total: 50000 },
//   },
// };

// function AdminDashboard() {
//   const navigate = useNavigate(); // Use the useNavigate hook for redirection
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showMessages, setShowMessages] = useState(false);
//   const [notifications, setNotifications] = useState(mockData.notifications);
//   const [messages, setMessages] = useState(mockData.messages);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [responseText, setResponseText] = useState("");
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Simulate data refresh
//   const refreshData = () => {
//     setIsRefreshing(true);
//     setTimeout(() => {
//       setNotifications((prev) =>
//         prev.map((n) => ({
//           ...n,
//           text: `${n.text} (refreshed)`,
//         }))
//       );
//       setIsRefreshing(false);
//     }, 1000);
//   };

//   useEffect(() => {
//     const interval = setInterval(refreshData, 30000); // Refresh data every 30 seconds
//     return () => clearInterval(interval); // Clean up interval on unmount
//   }, []);

//   const markNotificationAsRead = (id) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, isNew: false } : n))
//     );
//   };

//   const markMessageAsRead = (id) => {
//     setMessages((prev) =>
//       prev.map((m) => (m.id === id ? { ...m, isNew: false } : m))
//     );
//   };

//   const handleMessageResponse = () => {
//     if (!selectedMessage || !responseText.trim()) return;

//     setMessages((prev) =>
//       prev.map((m) =>
//         m.id === selectedMessage.id
//           ? { ...m, responded: true, adminResponse: responseText }
//           : m
//       )
//     );

//     // Show an animated notification
//     const notification = document.createElement("div");
//     notification.className =
//       "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50";
//     notification.textContent = `Response sent to ${selectedMessage.sender}`;
//     document.body.appendChild(notification);
//     setTimeout(() => {
//       notification.remove();
//     }, 3000);

//     setSelectedMessage(null);
//     setResponseText("");
//   };

//   const handleAddBlog = () => {
//     navigate("/blog-admin-page"); // Redirect to /blog-admin-page
//   };

//   const handleViewTrending = () => {
//     navigate("/trending-ideas"); // Redirect to /trending-ideas
//   };

//   return (
//     <motion.div
//       className="p-4 bg-gray-100 min-h-screen relative"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       {/* Header */}
//       <header className="flex justify-between items-center mb-6">
//         <motion.h1
//           className="text-2xl font-bold text-indigo-600"
//           initial={{ x: -50 }}
//           animate={{ x: 0 }}
//           transition={{ type: "spring", stiffness: 100 }}
//         >
//           Ethio Capital Admin Dashboard
//         </motion.h1>
//         <div className="flex gap-4">
//           {/* Refresh Button */}
//           <motion.button
//             whileHover={{ rotate: 360 }}
//             transition={{ duration: 0.5 }}
//             onClick={refreshData}
//             className="relative p-2 rounded-full bg-white bg-opacity-10 shadow-md hover:bg-opacity-20"
//             disabled={isRefreshing}
//           >
//             <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
//           </motion.button>

//           {/* Notification Button */}
//           <motion.button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="relative p-2 rounded-full bg-white bg-opacity-10 shadow-md hover:bg-opacity-20"
//           >
//             <Bell size={20} />
//             {notifications.filter((n) => n.isNew).length > 0 && (
//               <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
//                 {notifications.filter((n) => n.isNew).length}
//               </span>
//             )}
//           </motion.button>

//           {/* Message Button */}
//           <motion.button
//             onClick={() => setShowMessages(!showMessages)}
//             className="relative p-2 rounded-full bg-white bg-opacity-10 shadow-md hover:bg-opacity-20"
//           >
//             <MessageSquare size={20} />
//             {messages.filter((m) => m.isNew).length > 0 && (
//               <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
//                 {messages.filter((m) => m.isNew).length}
//               </span>
//             )}
//           </motion.button>
//         </div>
//       </header>

//       {/* Metrics Section */}
//       <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         {Object.entries({
//           Entrepreneurs: { icon: Users, value: mockData.entrepreneurs, color: "green" },
//           Investors: { icon: Users, value: mockData.investors, color: "blue" },
//           Revenue: {
//             icon: DollarSign,
//             value: `${mockData.totalRevenue} Birr`,
//             color: "yellow",
//           },
//           Messages: {
//             icon: MessageSquare,
//             value: messages.filter((m) => m.isNew).length,
//             color: "red",
//           },
//         }).map(([label, { icon: Icon, value, color }]) => (
//           <motion.div
//             key={label}
//             className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between ring-1 ring-${color}-500`}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             transition={{ type: "spring", stiffness: 300 }}
//           >
//             <Icon size={24} className={`text-${color}-500`} />
//             <div>
//               <p className="text-sm text-gray-500">{label}</p>
//               <p className="text-xl font-bold">{value}</p>
//             </div>
//           </motion.div>
//         ))}
//       </section>

//       {/* Chart Section */}
//       <section className="mb-6">
//         <h2 className="text-xl font-bold text-indigo-600 mb-4">Subscription Trends</h2>
//         <BarChart
//           width={700}
//           height={300}
//           data={mockData.monthlyRevenue}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" stroke="#6b7280" />
//           <YAxis stroke="#6b7280" />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="revenue" fill="#3b82f6" />
//         </BarChart>
//       </section>

//       {/* Subscription Overview Section */}
//       <section className="mb-6">
//         <h2 className="text-xl font-bold text-indigo-600 mb-4">Subscription Overview In One Year</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {Object.entries(mockData.subscriptions).map(
//             ([plan, { count, price }], index) => (
//               <motion.div
//                 key={plan}
//                 className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <p className="text-lg font-bold">{plan}</p>
//                 <p className="text-2xl font-bold">{count} Subscribers</p>
//                 <p className="text-gray-600">: {price} Birr</p>
//               </motion.div>
//             )
//           )}
//         </div>
//       </section>

//       {/* Notifications Dropdown */}
//       {showNotifications && (
//         <motion.div
//           variants={{
//             hidden: { opacity: 0, y: -20 },
//             visible: { opacity: 1, y: 0 },
//           }}
//           initial="hidden"
//           animate="visible"
//           exit="hidden"
//           transition={{ duration: 0.3 }}
//           className="absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10"
//         >
//           <h3 className="text-sm font-semibold mb-2">Notifications</h3>
//           {notifications.map((notification) => (
//             <div
//               key={notification.id}
//               className={`flex items-center justify-between p-2 border-b last:border-b-0 ${
//                 notification.isNew ? "font-bold" : "text-gray-500"
//               }`}
//             >
//               <span>{notification.text}</span>
//               {notification.isNew && (
//                 <button
//                   onClick={() => markNotificationAsRead(notification.id)}
//                   className="text-blue-500 hover:text-blue-700"
//                 >
//                   Mark as Read
//                 </button>
//               )}
//             </div>
//           ))}
//         </motion.div>
//       )}

//       {/* Messages Dropdown */}
//       {showMessages && (
//         <motion.div
//           variants={{
//             hidden: { opacity: 0, y: -20 },
//             visible: { opacity: 1, y: 0 },
//           }}
//           initial="hidden"
//           animate="visible"
//           exit="hidden"
//           transition={{ duration: 0.3 }}
//           className="absolute top-16 right-24 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10"
//         >
//           <h3 className="text-sm font-semibold mb-2">Messages</h3>
//           {messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex flex-col p-2 border-b last:border-b-0 cursor-pointer ${
//                 message.isNew ? "font-bold" : "text-gray-500"
//               }`}
//               onClick={() => setSelectedMessage(message)}
//             >
//               <div className="flex justify-between">
//                 <span className="text-sm font-medium">{message.sender}</span>
//                 {message.isNew && (
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       markMessageAsRead(message.id);
//                     }}
//                     className="text-blue-500 hover:text-blue-700"
//                   >
//                     Mark as Read
//                   </button>
//                 )}
//               </div>
//               <p className="text-sm mt-1">{message.text}</p>
//               {message.responded && (
//                 <p className="text-green-500 text-sm mt-1">Responded</p>
//               )}
//             </div>
//           ))}
//         </motion.div>
//       )}

//       {/* Message Response Modal */}
//       {selectedMessage && (
//         <motion.div
//           variants={{
//             hidden: { opacity: 0, scale: 0.8 },
//             visible: { opacity: 1, scale: 1 },
//           }}
//           initial="hidden"
//           animate="visible"
//           exit="hidden"
//           transition={{ duration: 0.3 }}
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//         >
//           <motion.div
//             variants={{
//               hidden: { opacity: 0, scale: 0.8 },
//               visible: { opacity: 1, scale: 1 },
//             }}
//             initial="hidden"
//             animate="visible"
//             exit="hidden"
//             transition={{ duration: 0.3 }}
//             className="bg-white p-6 rounded-lg shadow-lg w-96"
//           >
//             <button
//               onClick={() => setSelectedMessage(null)}
//               className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
//             >
//               <X size={16} />
//             </button>
//             <h3 className="text-lg font-bold mb-4">
//               Respond to {selectedMessage.sender}
//             </h3>
//             <p className="text-sm mb-4">Original Message: {selectedMessage.text}</p>
//             <textarea
//               value={responseText}
//               onChange={(e) => setResponseText(e.target.value)}
//               rows={4}
//               className="w-full p-2 border border-gray-300 rounded-md mb-4"
//               placeholder="Type your response here..."
//             />
//             <div className="flex justify-end">
//               <button
//                 onClick={handleMessageResponse}
//                 className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//               >
//                 Send Response
//               </button>
//             </div>
//           </motion.div>
//         </motion.div>
//       )}

//       {/* Bottom Action Buttons */}
//       <section className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
//         {/* Add Blog Button */}
//         <motion.button
//           onClick={handleAddBlog} // Redirects to /blog-admin-page
//           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
//         >
//           <FileText size={20} />
//           Add Blog
//         </motion.button>

//         {/* View Trending Ideas Button */}
//         <motion.button
//           onClick={handleViewTrending} // Redirects to /trending-ideas
//           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
//         >
//           <TrendingUp size={20} />
//           View Trending Ideas
//         </motion.button>
//       </section>
//     </motion.div>
//   );
// }

// export default AdminDashboard;

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Bell,
  MessageSquare,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  X,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MessageConversationModal from "./MessageConversationModal";
import setupAxios from "../middleware/MiddleWare";
import axios from "axios";

const mockData = {
  entrepreneurs: 50,
  investors: 30,
  totalRevenue: 15000,
  monthlyRevenue: [
    { name: "Jan", revenue: 1200 },
    { name: "Feb", revenue: 2000 },
    { name: "Mar", revenue: 2500 },
    { name: "Apr", revenue: 3000 },
    { name: "May", revenue: 3500 },
    { name: "Jun", revenue: 4000 },
    { name: "Jul", revenue: 4500 },
    { name: "Aug", revenue: 5000 },
    { name: "Sep", revenue: 6000 },
    { name: "Oct", revenue: 7000 },
    { name: "Nov", revenue: 8000 },
    { name: "Dec", revenue: 9000 },
  ],
  notifications: [
    { id: 1, text: "New investor registered", isNew: true },
    { id: 2, text: "System update available", isNew: false },
  ],
  messages: [
    {
      id: 1,
      sender: "John Doe",
      text: "Can you provide more details about the investment?",
      isNew: true,
      responded: false,
      conversation: [],
      timestamp: "2023-10-01T09:00:00Z",
    },
  ],
  subscriptions: {
    "3 Months": { count: 20, Total: 30000 },
    "6 Months": { count: 15, Total: 37500 },
    "1 Year": { count: 10, Total: 50000 },
  },
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState(
    mockData?.notifications || []
  );
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refs for click outside detection
  const notificationDropdownRef = useRef(null);
  const messageDropdownRef = useRef(null);
  const notificationButtonRef = useRef(null);
  const messageButtonRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For notifications dropdown
      if (
        showNotifications &&
        notificationDropdownRef.current &&
        notificationButtonRef.current &&
        !notificationDropdownRef.current.contains(event.target) &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      // For messages dropdown
      if (
        showMessages &&
        messageDropdownRef.current &&
        messageButtonRef.current &&
        !messageDropdownRef.current.contains(event.target) &&
        !messageButtonRef.current.contains(event.target)
      ) {
        setShowMessages(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showMessages]);

  useEffect(() => {
    setupAxios();
  }, []);

  useEffect(() => {
    const getCompliantData = async () => {
      try {
        const response = await axios.get("/compliant");
        console.log("complaint response", response.data[0]._id);

        // Group messages by userId
        const groupedData = response.data.reduce((acc, message) => {
          const userKey = message.userId._id;
          if (!acc[userKey]) {
            acc[userKey] = {
              user: {
                id: message.userId._id,
                username: message.userId.username, // Extract username
                email: message.userId.email, // Extract email
              },
              messages: [],
            };
          }
          const { userId, ...messageWithoutUser } = message;
          acc[userKey].messages.push(messageWithoutUser);
          return acc;
        }, {});

        // Extract grouped messages
        const groupedMessages = Object.values(groupedData)[0];

        setMessages(groupedMessages);
        console.log("Transformed Data:", groupedMessages);
      } catch (error) {
        console.error("Error fetching complaint data:", error);
      }
    };
    getCompliantData();
  }, []);

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, text: `${n.text} (refreshed)` }))
      );
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isNew: false } : n))
    );
  };

  const markMessageAsRead = async (id) => {
    try {
      const response = await axios.patch(`/compliant-isNew/${id}`);
      console.log("response.data", response.data);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isNew: false } : m))
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddBlog = () => navigate("/blog-admin-page");
  const handleViewTrending = () => navigate("/trending-ideas");

  const newMessageCount = messages?.messages?.filter((m) => m.isNew).length;
  const newNotificationCount = notifications.filter((n) => n.isNew).length;

  return (
    <motion.div
      className="p-4 bg-gray-100 min-h-screen relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <motion.h1
          className="text-2xl font-bold text-indigo-600"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Ethio Capital Admin Dashboard
        </motion.h1>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            onClick={refreshData}
            className="relative p-2 rounded-full bg-white bg-opacity-10 shadow-md hover:bg-opacity-20"
            disabled={isRefreshing}
          >
            <RefreshCw
              size={20}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </motion.button>

          {/* Notification Button */}
          <motion.button
            ref={notificationButtonRef}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full bg-white bg-opacity-10 shadow-md hover:bg-opacity-20"
          >
            <Bell size={20} />
            {newNotificationCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                {newNotificationCount}
              </span>
            )}
          </motion.button>

          {/* Message Button */}
          <motion.button
            ref={messageButtonRef}
            onClick={() => setShowMessages(!showMessages)}
            className="relative p-2 rounded-full bg-white bg-opacity-10 shadow-md hover:bg-opacity-20"
          >
            <MessageSquare size={20} />
            {newMessageCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                {newMessageCount}
              </span>
            )}
          </motion.button>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries({
          Entrepreneurs: {
            icon: Users,
            value: mockData.entrepreneurs,
            color: "green",
          },
          Investors: { icon: Users, value: mockData.investors, color: "blue" },
          Revenue: {
            icon: DollarSign,
            value: `${mockData.totalRevenue} Birr`,
            color: "yellow",
          },
          Messages: {
            icon: MessageSquare,
            value: newMessageCount,
            color: "red",
          },
        }).map(([label, { icon: Icon, value, color }]) => (
          <motion.div
            key={label}
            className={`bg-white p-4 rounded-lg shadow-md flex items-center justify-between ring-1 ring-${color}-500`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon size={24} className={`text-${color}-500`} />
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-xl font-bold">{value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Chart Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">
          Subscription Trends
        </h2>
        <BarChart
          width={700}
          height={300}
          data={mockData.monthlyRevenue}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#3b82f6" />
        </BarChart>
      </section>

      {/* Subscription Overview Section */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">
          Subscription Overview In One Year
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(mockData.subscriptions).map(
            ([plan, { count, Total }]) => (
              <motion.div
                key={plan}
                className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <p className="text-lg font-bold">{plan}</p>
                <p className="text-2xl font-bold">{count} Subscribers</p>
                <p className="text-gray-600">{Total} Birr</p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            ref={notificationDropdownRef}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-4 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-2 z-10"
          >
            <h3 className="text-sm font-semibold mb-2">Notifications</h3>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-center justify-between p-2 border-b last:border-b-0 ${
                  notification.isNew ? "font-bold" : "text-gray-500"
                }`}
              >
                <span>{notification.text}</span>
                {notification.isNew && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Mark as Read
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages Dropdown */}

      <AnimatePresence>
        {showMessages && (
          <motion.div
            ref={messageDropdownRef}
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="absolute top-16 right-24 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
          >
            <div className="px-4 py-2 border-b">
              <h3 className="text-sm font-semibold text-gray-700">
                Recent Conversations
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {messages?.messages?.map((message) => (
                <div
                  key={message.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedMessage(message);
                    markMessageAsRead(message._id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 ${
                        message.isNew ? "bg-blue-100" : "bg-gray-100"
                      } rounded-full flex items-center justify-center`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          message.isNew ? "text-blue-600" : "text-gray-600"
                        }`}
                      >
                        {messages?.user?.email?.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-900">
                          {messages.user.email} 
                          {message.isNew && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                          )}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {message.description}
                      </p>
                      {message.responded && (
                        <p className="text-green-500 text-xs mt-1">Responded</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-2 border-t">
              <button
                className="w-full text-sm text-blue-600 hover:text-blue-700"
                onClick={() => {
                  setSelectedMessage({ new: true });
                  setShowMessages(false);
                }}
              >
                Start New Conversation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Conversation Modal */}
      {
        selectedMessage && <MessageConversationModal
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        messages={messages}
        setMessages={setMessages}
      />
      }

      {/* Bottom Action Buttons */}
      <section className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <motion.button
          onClick={handleAddBlog}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <FileText size={20} />
          Add Blog
        </motion.button>
        <motion.button
          onClick={handleViewTrending}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <TrendingUp size={20} />
          View Trending Ideas
        </motion.button>
      </section>
    </motion.div>
  );
}

export default AdminDashboard;
