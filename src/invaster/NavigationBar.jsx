import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  MessageSquare,
  Briefcase,
  BookOpen,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";
import MessageConversationModal from "../Add/MessageConversationModal";
import setupAxios from "../middleware/MiddleWare";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnReadMessages } from "../redux/MessageSlice";
import { fetchUserData } from "../redux/UserSlice";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { use } from "react";

const NavigationBar = ({
  userData,
  showNotifications,
  showProfile,
  showMessages,
  onToggleNotifications,
  onToggleProfile,
  onToggleMessages,
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
  const messageToggleRef = useRef(null);
  const messageDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { messageDatas } = useSelector((state) => state.messageDatas);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

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

      if (
        showMessages &&
        messageToggleRef.current &&
        !messageToggleRef.current.contains(event.target) &&
        messageDropdownRef.current &&
        !messageDropdownRef.current.contains(event.target)
      ) {
        onToggleMessages();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [
    showNotifications,
    showProfile,
    showMessages,
    onToggleNotifications,
    onToggleProfile,
    onToggleMessages,
  ]);

  useEffect(() => {
    setMessages(messageDatas);
  }, [messageDatas, userData]);

  useEffect(() => {
    if (role === "admin") {
      isAdmin(true);
    }
  }, [role]);

  const fetchAdminMessages = async () => {
    try {
      const response = await axios.get(`/fetch-messages-for-user/${userData?._id}`);
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.role === 'admin') {
      setRole(userData?.role);
      fetchAdminMessages();
    } else {
      if (userData?._id) {
        dispatch(fetchUnReadMessages(userData?._id));
      }
    }
  }, [dispatch]);

  const unreadMessages = messageData?.filter((msg) => msg.isNew).length;

  const handleReadMessage = async (message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id ? { ...msg, isNew: false } : msg
      )
    );
    try {
      const response = await axios.post(`/update-isNew/${message}`);
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
          msg.id === message.id ? { ...msg, isNew: false } : msg
        )
      );
      handleReadMessage(message._id);
    } else if (role === 'admin') {
      setSelectedMessage(message);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, isNew: false } : msg
        )
      );
      onToggleMessages();
    }
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
              {/* Messages Dropdown */}
              <div className="relative">
                <button
                  ref={messageToggleRef}
                  onClick={onToggleMessages}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                >
                  <MessageSquare className="h-5 w-5" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                {showMessages && (
                  <div
                    ref={messageDropdownRef}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b">
                      <h3 className="text-sm font-semibold text-gray-700">
                        Recent Conversations
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {messageData.map((message) => (
                        <div
                          key={message._id}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleMessageSelect(message)}
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
                                {message.sender.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {message.sender}
                                  {message.isNew && (
                                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                                  )}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(message.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate">
                                {message.text}
                              </p>
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
                          onToggleMessages();
                        }}
                      >
                        Start New Conversation
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  ref={notificationToggleRef}
                  className="relative"
                  onClick={onToggleNotifications}
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                </button>

                {showNotifications && (
                  <div
                    ref={notificationDropdownRef}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-600">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        New startup idea in Agriculture sector
                      </p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-600">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
                        Your interested project update
                      </p>
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-600">
                        Weekly trending startups report
                      </p>
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
                  onClick={onToggleMessages}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                >
                  <MessageSquare className="h-5 w-5" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="ml-2 h-5 w-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  onClick={onToggleNotifications}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <Bell className="h-5 w-5" />
                  Notifications
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

            <button
              onClick={() => setActiveTab("trending")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === "trending"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <TrendingUp className="h-5 w-5" />
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Message Conversation Modal */}
      <MessageConversationModal
        selectedMessage={selectedMessage}
        setSelectedMessage={setSelectedMessage}
        messages={messageData}
        setMessages={setMessages}
      />
    </nav>
  );
};

export default NavigationBar;