import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
Bell, MessageSquare, DollarSign, Users, FileText, TrendingUp, X,
RefreshCw, LayoutDashboard, LogOut, ChevronLeft, Settings, Moon, Sun,
BarChart, Briefcase, MapPin, GraduationCap, Crown, Gem, Award, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBussinessIdea } from '../redux/BussinessIdeaSlice';
import axios from 'axios';
import setupAxios from '../middleware/MiddleWare';
import { IdeaCard, IdeaDetailModal } from './AdminComponents';
import MessageConversationModal from './MessageConversationModal';
import InvestorVerificationHandler from './InvestorVerificationHandler';
import {
BarChart as ReBarChart,
Bar,
CartesianGrid,
XAxis,
YAxis,
Tooltip,
Legend,
ResponsiveContainer,
PieChart,
Pie,
Cell,
AreaChart,
Area
} from 'recharts';

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
subscriptions: [
{ name: "3 Months", value: 20, total: 30000 },
{ name: "6 Months", value: 15, total: 37500 },
{ name: "1 Year", value: 10, total: 50000 },
],
ideaCategories: [
{ name: "Technology", value: 35 },
{ name: "Health", value: 25 },
{ name: "Finance", value: 20 },
{ name: "Education", value: 15 },
{ name: "Others", value: 5 }
],
userActivity: [
{ date: '2023-01', users: 25, interactions: 120 },
{ date: '2023-02', users: 30, interactions: 150 },
{ date: '2023-03', users: 35, interactions: 200 },
{ date: '2023-04', users: 40, interactions: 220 },
{ date: '2023-05', users: 45, interactions: 250 },
{ date: '2023-06', users: 50, interactions: 300 },
{ date: '2023-07', users: 60, interactions: 350 },
{ date: '2023-08', users: 65, interactions: 380 },
{ date: '2023-09', users: 70, interactions: 400 },
{ date: '2023-10', users: 75, interactions: 450 },
]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
const navigate = useNavigate();
const dispatch = useDispatch();
const { BussinessIdea } = useSelector((state) => state.businessIdea);

// State management
const [ideas, setIdeas] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [selectedIdea, setSelectedIdea] = useState(null);
const [filterStatus, setFilterStatus] = useState('all');
const [showNotifications, setShowNotifications] = useState(false);
const [showMessages, setShowMessages] = useState(false);
const [notifications, setNotifications] = useState([
{ id: 1, message: "New business idea submitted", time: "10 min ago", isNew: true },
{ id: 2, message: "Investor requested connection", time: "1 hour ago", isNew: true },
{ id: 3, message: "Monthly report generated", time: "Yesterday", isNew: false },
{ id: 4, message: "New investor verification pending", time: "5 min ago", isNew: true }
]);
const [messages, setMessages] = useState([
{ id: 1, sender: "Jane Cooper", content: "Is my business idea approved?", time: "5 min ago", avatar: "https://randomuser.me/api/portraits/women/10.jpg", isNew: true },
{ id: 2, sender: "Robert Fox", content: "Need help with my profile", time: "3 hours ago", avatar: "https://randomuser.me/api/portraits/men/4.jpg", isNew: true },
{ id: 3, sender: "Wade Warren", content: "Thank you for the feedback", time: "Yesterday", avatar: "https://randomuser.me/api/portraits/men/5.jpg", isNew: false }
]);
const [selectedMessage, setSelectedMessage] = useState(null);
const [isRefreshing, setIsRefreshing] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [activeTab, setActiveTab] = useState('overview');
const [hoveredStat, setHoveredStat] = useState(null);

// Refs for click outside handling
const notificationDropdownRef = useRef(null);
const messageDropdownRef = useRef(null);
const notificationButtonRef = useRef(null);
const messageButtonRef = useRef(null);

useEffect(() => {
setupAxios();
dispatch(fetchBussinessIdea());

// Simulate loading for demo
const timer = setTimeout(() => {
setIsLoading(false);
if (!BussinessIdea || BussinessIdea.length === 0) {
setIdeas([
{
_id: '1',
title: 'Eco-Friendly Packaging Solution',
entrepreneurName: 'Sarah Johnson',
entrepreneurLocation: 'Portland, OR',
businessCategory: 'Sustainability',
fundingNeeded: '150000',
overview: 'Biodegradable packaging made from mushroom mycelium for e-commerce and food industries.',
status: 'approved',
rank: 'gold',
interestedInvestors: 12
},
{
_id: '2',
title: 'AI-Powered Healthcare Assistant',
entrepreneurName: 'Michael Chen',
entrepreneurLocation: 'Boston, MA',
businessCategory: 'Healthcare',
fundingNeeded: '300000',
overview: 'Virtual healthcare assistant using AI to provide preliminary diagnoses and connect patients with specialists.',
status: 'pending',
interestedInvestors: 8
},
{
_id: '3',
title: 'Renewable Energy Marketplace',
entrepreneurName: 'David Rodriguez',
entrepreneurLocation: 'Austin, TX',
businessCategory: 'Energy',
fundingNeeded: '250000',
overview: 'Platform connecting consumers with local renewable energy producers for direct purchase of clean energy.',
status: 'approved',
rank: 'silver',
interestedInvestors: 15
}
]);
}
}, 1500);

return () => clearTimeout(timer);
}, [dispatch, BussinessIdea]);

useEffect(() => {
if (BussinessIdea && BussinessIdea.length > 0) {
setIdeas(BussinessIdea);
}
}, [BussinessIdea]);

const refreshData = () => {
setIsRefreshing(true);
dispatch(fetchBussinessIdea());
setTimeout(() => setIsRefreshing(false), 1000);
};

const handleStatusChange = async (ideaId, status) => {
try {
await axios.patch(`/api/ideas/${ideaId}/status`, { status });
dispatch(fetchBussinessIdea());
} catch (error) {
console.error('Error updating status:', error);
}
};

const handleRankChange = async (ideaId, rank) => {
try {
await axios.patch(`/api/ideas/${ideaId}/rank`, { rank });
dispatch(fetchBussinessIdea());
} catch (error) {
console.error('Error updating rank:', error);
}
};

const filteredIdeas = ideas.filter(idea =>
filterStatus === 'all' ? true : idea.status === filterStatus
);

const handleNotificationRead = (id) => {
setNotifications(
notifications.map(notif =>
notif.id === id ? { ...notif, isNew: false } : notif
)
);
};

const handleMessageRead = (id) => {
setMessages(
messages.map(msg =>
msg.id === id ? { ...msg, isNew: false } : msg
)
);
};

const toggleDarkMode = () => {
setDarkMode(!darkMode);
// In a real implementation, you would apply dark mode classes to the body or root element
};

return (
<div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 to-blue-50'}`}>
{/* Sidebar */}
<div
className={`fixed left-0 top-0 h-full ${sidebarCollapsed ? 'w-20' : 'w-64'}
${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}
shadow-lg z-50 transition-all duration-300`}
>
<div className="flex flex-col h-full">
<div className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b p-5 flex justify-between items-center`}>
{!sidebarCollapsed && (
<div>
<h1 className={`text-xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
AdminHQ
</h1>
<p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
Business Intelligence
</p>
</div>
)}
<motion.button
whileHover={{ scale: 1.1 }}
whileTap={{ scale: 0.95 }}
onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
>
<ChevronLeft className={`transform transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
</motion.button>
</div>

<div className="flex-grow pt-5 px-3">
<ul className="space-y-2">
{[
{ name: 'Dashboard', icon: LayoutDashboard, action: () => window.scrollTo(0, 0) },
{ name: 'Blog Management', icon: FileText, action: () => navigate('/blog-admin-page') },
{ name: 'Trending Ideas', icon: TrendingUp, action: () => navigate('/trending-ideas') },
{ name: 'Investor Verification', icon: ShieldAlert, action: () => setActiveTab('verification') },
{ name: 'Settings', icon: Settings, action: () => navigate('/settings') },
{ name: 'Logout', icon: LogOut, action: () => navigate('/logout') }
].map((item, index) => (
<li key={index}>
<motion.button
whileHover={{ x: 5 }}
whileTap={{ scale: 0.95 }}
className={`w-full flex items-center p-3 rounded-lg transition-colors
${darkMode
? 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400'
: 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
onClick={item.action}
>
<item.icon size={20} className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
{!sidebarCollapsed && <span>{item.name}</span>}
</motion.button>
</li>
))}
</ul>
</div>

<div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t mt-auto`}>
<motion.button
whileHover={{ y: -2 }}
whileTap={{ scale: 0.95 }}
onClick={toggleDarkMode}
className={`w-full flex items-center p-3 rounded-lg transition-colors
${darkMode
? 'bg-gray-700 text-yellow-300'
: 'bg-gray-100 text-indigo-700'}`}
>
{darkMode ? (
<>
<Sun size={20} className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
{!sidebarCollapsed && <span>Light Mode</span>}
</>
) : (
<>
<Moon size={20} className={`${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
{!sidebarCollapsed && <span>Dark Mode</span>}
</>
)}
</motion.button>
</div>
</div>
</div>

{/* Main Content */}
<div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} p-8`}>
{/* Header Section */}
<header className="flex justify-between items-center mb-8">
<div>
<h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
Admin Dashboard
</h1>
<p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
Welcome back! Here's what's happening today.
</p>
</div>

<div className="flex gap-4">
<motion.button
whileHover={{ rotate: 180, backgroundColor: darkMode ? '#4c1d95' : '#e0e7ff' }}
whileTap={{ scale: 0.9 }}
onClick={refreshData}
className={`relative p-2 rounded-full shadow-md transition-colors
${darkMode
? 'bg-gray-700 text-indigo-400 hover:bg-gray-600'
: 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
disabled={isRefreshing}
>
<RefreshCw className={isRefreshing ? "animate-spin" : ""} />
</motion.button>

{/* Notification Button & Dropdown */}
<div className="relative">
<motion.button
ref={notificationButtonRef}
whileHover={{ y: -2 }}
whileTap={{ scale: 0.9 }}
onClick={() => {
setShowNotifications(!showNotifications);
setShowMessages(false);
}}
className={`relative p-2 rounded-full shadow-md transition-colors
${darkMode
? 'bg-gray-700 text-indigo-400 hover:bg-gray-600'
: 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
>
<Bell />
{notifications.filter(n => n.isNew).length > 0 && (
<motion.span
initial={{ scale: 0 }}
animate={{ scale: 1 }}
className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
>
{notifications.filter(n => n.isNew).length}
</motion.span>
)}
</motion.button>

<AnimatePresence>
{showNotifications && (
<motion.div
ref={notificationDropdownRef}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 10 }}
transition={{ duration: 0.2 }}
className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden z-50
${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
>
<div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex justify-between items-center`}>
<h3 className="font-medium">Notifications</h3>
<span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
{notifications.length} total
</span>
</div>
<div className="max-h-80 overflow-y-auto">
{notifications.length === 0 ? (
<div className="p-4 text-center text-gray-500">No notifications</div>
) : (
notifications.map(notification => (
<motion.div
key={notification.id}
whileHover={{ x: 5 }}
className={`p-4 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border-b last:border-0 cursor-pointer transition-colors
${notification.isNew ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
onClick={() => {
handleNotificationRead(notification.id);
// If it's the investor verification notification, switch to verification tab
if (notification.message.includes("investor verification")) {
  setActiveTab('verification');
  setShowNotifications(false);
}
}}
>
<div className="flex items-start gap-3">
<div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${notification.isNew ? 'bg-blue-500' : (darkMode ? 'bg-gray-600' : 'bg-gray-300')}`}></div>
<div className="flex-grow">
<p className={darkMode ? 'text-gray-300' : 'text-gray-800'}>
{notification.message}
</p>
<p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
{notification.time}
</p>
</div>
</div>
</motion.div>
))
)}
</div>
<div className={`p-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'} border-t text-center`}>
<button className={`text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
View all notifications
</button>
</div>
</motion.div>
)}
</AnimatePresence>
</div>

{/* Messages Button & Dropdown */}
<div className="relative">
<motion.button
ref={messageButtonRef}
whileHover={{ y: -2 }}
whileTap={{ scale: 0.9 }}
onClick={() => {
setShowMessages(!showMessages);
setShowNotifications(false);
}}
className={`relative p-2 rounded-full shadow-md transition-colors
${darkMode
? 'bg-gray-700 text-indigo-400 hover:bg-gray-600'
: 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
>
<MessageSquare />
{messages.filter(m => m.isNew).length > 0 && (
<motion.span
initial={{ scale: 0 }}
animate={{ scale: 1 }}
className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
>
{messages.filter(m => m.isNew).length}
</motion.span>
)}
</motion.button>

<AnimatePresence>
{showMessages && (
<motion.div
ref={messageDropdownRef}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 10 }}
transition={{ duration: 0.2 }}
className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden z-50
${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'}`}
>
<div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b flex justify-between items-center`}>
<h3 className="font-medium">Messages</h3>
<span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
{messages.length} total
</span>
</div>
<div className="max-h-80 overflow-y-auto">
{messages.length === 0 ? (
<div className="p-4 text-center text-gray-500">No messages</div>
) : (
messages.map(message => (
<motion.div
key={message.id}
whileHover={{ x: 5 }}
className={`p-4 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border-b last:border-0 cursor-pointer transition-colors
${message.isNew ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
onClick={() => {
setSelectedMessage(message);
handleMessageRead(message.id);
setShowMessages(false);
}}
>
<div className="flex items-start gap-3">
<img src={message.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
<div className="flex-grow">
<div className="flex justify-between items-start">
<p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
{message.sender}
</p>
<p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
{message.time}
</p>
</div>
<p className={`text-sm line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
{message.content}
</p>
</div>
</div>
</motion.div>
))
)}
</div>
<div className={`p-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'} border-t text-center`}>
<button className={`text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
View all messages
</button>
</div>
</motion.div>
)}
</AnimatePresence>
</div>
</div>
</header>

{/* Dashboard Tabs */}
<div className={`mb-8 flex gap-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b pb-2`}>
{['overview', 'business ideas', 'verification', 'analytics', 'reports'].map((tab) => (
<motion.button
key={tab}
whileHover={{ y: -2 }}
whileTap={{ scale: 0.95 }}
onClick={() => setActiveTab(tab)}
className={`px-5 py-2.5 rounded-t-lg font-medium transition-colors
${activeTab === tab
? (darkMode
? 'bg-gray-700 text-indigo-400 border-b-2 border-indigo-500'
: 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500')
: (darkMode
? 'text-gray-400 hover:text-gray-300'
: 'text-gray-600 hover:text-gray-800')
}`}
>
{tab.charAt(0).toUpperCase() + tab.slice(1)}
{tab === 'verification' && (
  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full bg-red-500 text-white">
    2
  </span>
)}
</motion.button>
))}
</div>

{/* Content based on active tab */}
{activeTab === 'verification' ? (
  <InvestorVerificationHandler darkMode={darkMode} />
) : (
  <>
    {/* Metrics Grid */}
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {[
        { label: 'Entrepreneurs', icon: Users, value: mockData.entrepreneurs, color: 'green', sub: '+12% this month' },
        { label: 'Investors', icon: Users, value: mockData.investors, color: 'blue', sub: '+5% this month' },
        { label: 'Revenue', icon: DollarSign, value: `$${mockData.totalRevenue}`, color: 'purple', sub: '+22% this quarter' },
        { label: 'Ideas', icon: Briefcase, value: ideas.length, color: 'red', sub: '+3 new today' }
      ].map(({ label, icon: Icon, value, color, sub }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          onHoverStart={() => setHoveredStat(label)}
          onHoverEnd={() => setHoveredStat(null)}
          className={`relative overflow-hidden rounded-xl shadow-lg
            ${darkMode
              ? 'bg-gray-800 border-gray-700 border'
              : 'bg-white'}`}
        >
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 -rotate-12 opacity-5">
            <Icon size={100} />
          </div>

          <div className="p-6 flex items-center gap-4 h-full z-10 relative">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center
              ${color === 'green'
                ? (darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600')
                : color === 'blue'
                  ? (darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600')
                  : color === 'purple'
                    ? (darkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600')
                    : (darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-600')
              }`}
            >
              <Icon size={28} />
            </div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
              <div className="flex items-end gap-2">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredStat === label ? 1 : 0 }}
                  className={`text-xs mb-1 ${sub.includes('+') ? 'text-green-500' : 'text-red-500'}`}
                >
                  {sub}
                </motion.span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>

    {/* Charts Section */}
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'}`}
      >
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Revenue Trends
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={mockData.monthlyRevenue}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis
              dataKey="name"
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : 'white',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? 'white' : 'black'
              }}
              formatter={(value) => [`$${value}`, 'Revenue']}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'}`}
      >
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Subscription Distribution
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={mockData.subscriptions}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {mockData.subscriptions.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [`${value} users - $${props.payload.total}`, name]}
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : 'white',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? 'white' : 'black'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className={`p-6 rounded-xl shadow-lg lg:col-span-2 ${darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'}`}
      >
        <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          User Activity
        </h2>
        <ResponsiveContainer width="100%" height={250}>
          <ReBarChart data={mockData.userActivity}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
            <XAxis dataKey="date" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
            <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : 'white',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
                color: darkMode ? 'white' : 'black'
              }}
            />
            <Legend />
            <Bar dataKey="users" name="Active Users" fill="url(#colorUsers)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="interactions" name="Interactions" fill="url(#colorInteractions)" radius={[4, 4, 0, 0]} />
          </ReBarChart>
        </ResponsiveContainer>
      </motion.div>
    </section>

    {/* Business Ideas Section */}
    <section className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Business Ideas Management
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Review and manage submitted business proposals
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md capitalize shadow-sm font-medium
                ${filterStatus === status
                  ? status === 'all'
                    ? (darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-800')
                    : status === 'pending'
                      ? (darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                      : status === 'approved'
                        ? (darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-800')
                        : (darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-800')
                  : (darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Ideas Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full border-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-t-indigo-600 animate-spin`}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      ) : filteredIdeas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 text-center rounded-lg shadow-md
            ${darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'}`}
        >
          <Briefcase className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No ideas found matching your filters
          </p>
          <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Try changing your filter criteria or check back later
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea, index) => (
            <motion.div
              key={idea._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <IdeaCard
                idea={idea}
                onViewDetails={() => setSelectedIdea(idea)}
                darkMode={darkMode}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  </>
)}

{/* Modals */}
<AnimatePresence>
{selectedIdea && (
<IdeaDetailModal
idea={selectedIdea}
onClose={() => setSelectedIdea(null)}
onStatusChange={handleStatusChange}
onRankChange={handleRankChange}
darkMode={darkMode}
/>
)}
</AnimatePresence>

{selectedMessage && (
<MessageConversationModal
selectedMessage={selectedMessage}
setSelectedMessage={setSelectedMessage}
messages={messages}
setMessages={setMessages}
darkMode={darkMode}
/>
)}
</div>
</div>
);
};

export default AdminDashboard;