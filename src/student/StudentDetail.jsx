
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
import { motion } from "framer-motion";

const StudentDetail = () => {
  console.log("Rendering StudentDetail component");
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const token = localStorage.getItem("authToken");
  const API_URL = "http://localhost:3001/api/v1";
  const STATIC_URL = "http://localhost:3001";

  const [studentDetails, setStudentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [fundingProgress, setFundingProgress] = useState(0); // Progress percentage (0-100%)

  useEffect(() => {
    console.log("StudentDetail useEffect - ID:", id, "Token:", !!token);
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token || !id) {
        console.log("Missing token or ID - Token:", !!token, "ID:", id);
        setError("Authentication required or invalid application ID.");
        setLoading(false);
        navigate("/Entrepreneur-dashboard");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/student-applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data);
        setStudentDetails(response.data);
        setError("");

        // Safely calculate funding progress
        const raisedRaw = response.data.fundingRaised;
        const goalRaw = response.data.fundingAmount;
        console.log("Funding Data:", { fundingRaised: raisedRaw, fundingAmount: goalRaw });

        const raised = typeof raisedRaw === "string" && raisedRaw
          ? parseFloat(raisedRaw.replace(/\D/g, "") || "0")
          : typeof raisedRaw === "number" ? raisedRaw : 0;
        const goal = typeof goalRaw === "string" && goalRaw
          ? parseFloat(goalRaw.replace(/\D/g, "") || "1")
          : typeof goalRaw === "number" ? goalRaw : 1;

        console.log("Parsed Funding:", { raised, goal });
        setFundingProgress(Math.min((raised / goal) * 100, 100));
      } catch (err) {
        const status = err.response?.status;
        const errorMessage = err.response?.data?.message || err.message || "Failed to load application details.";
        console.error("API Error:", {
          status,
          data: err.response?.data,
          message: err.message,
        });
        if (status === 404) {
          setError("Application not found. It may have been removed or the ID is invalid.");
        } else {
          setError(`Error: ${errorMessage}. Please try again or contact support.`);
        }
        setStudentDetails({});
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, token, navigate]);

  // Placeholder for funding update (to be integrated later with Socket.IO or API)
  useEffect(() => {
    // Example: Subscribe to funding updates via Socket.IO
    // const socket = io("http://localhost:3001", { auth: { token } });
    // socket.on("fundingUpdate", ({ applicationId, raised, goal }) => {
    //   if (applicationId === id) {
    //     const parsedRaised = typeof raised === "string" ? parseFloat(raised.replace(/\D/g, "") || "0") : raised || 0;
    //     const parsedGoal = typeof goal === "string" ? parseFloat(goal.replace(/\D/g, "") || "1") : goal || 1;
    //     setFundingProgress(Math.min((parsedRaised / parsedGoal) * 100, 100));
    //   }
    // });
    // return () => socket.disconnect();
  }, [id, token]);

  // Placeholder for chat toggle handler
  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  // Placeholder for payment navigation
  const handleFundNow = () => {
    console.log("Navigating to payment form for application:", id);
    // navigate("/PaymentForm", { state: { applicationId: id, fundingAmount: studentDetails.fundingAmount } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-100 flex items-center justify-center"
      >
        <div className="bg-red-50 p-6 rounded-xl shadow-md max-w-md text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/Entrepreneur-dashboard")}
              className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Go back"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Chat Panel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
          <div
            className="p-4 rounded-t-2xl bg-blue-600 text-white cursor-pointer flex justify-between items-center"
            onClick={toggleChat}
            aria-expanded={showChat}
            aria-controls="chat-panel"
          >
            <div className="flex items-center gap-3">
              <img
                src={studentDetails?.profilePicture || "https://via.placeholder.com/32"}
                alt={studentDetails?.fullName || "Student"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">
                Chat with {studentDetails?.fullName || "Student"}
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${showChat ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {showChat && (
            <div id="chat-panel" className="p-4 max-h-96 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {/* Placeholder for chat messages */}
                <div className="bg-blue-100 p-3 rounded-lg max-w-[75%] ml-auto">
                  <p className="text-sm text-gray-800">Hello! I'm interested in your application.</p>
                  <p className="text-xs text-gray-500 mt-1">12:34 PM</p>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg max-w-[75%] mr-auto">
                  <p className="text-sm text-gray-800">Thank you! Let me share more details.</p>
                  <p className="text-xs text-gray-500 mt-1">12:35 PM</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                />
                <button
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                  disabled
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                Chat functionality coming soon!
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <img
              src={studentDetails?.profilePicture || "https://via.placeholder.com/128"}
              alt={studentDetails?.fullName || "Student"}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {studentDetails.fullName || "Student Application"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-2">
                {studentDetails.contactEmail || "Not specified"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                  {studentDetails.fundingPurpose || "Not specified"}
                </span>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    studentDetails.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : studentDetails.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {studentDetails.status
                    ? studentDetails.status.charAt(0).toUpperCase() + studentDetails.status.slice(1)
                    : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700">Date of Birth</h3>
                  <p className="text-gray-600 mt-1">
                    {studentDetails.dateOfBirth
                      ? new Date(studentDetails.dateOfBirth).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Contact Email</h3>
                  <p className="text-gray-600 mt-1">{studentDetails.contactEmail || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Address</h3>
                  <p className="text-gray-600 mt-1">{studentDetails.address || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Nationality</h3>
                  <p className="text-gray-600 mt-1">{studentDetails.nationality || "Not specified"}</p>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Funding Purpose</h2>
              <p className="text-gray-600 leading-relaxed">
                {studentDetails.financialNeedsDescription || "No description provided."}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Education History</h2>
              {studentDetails.educationHistory?.length > 0 ? (
                <div className="space-y-4">
                  {studentDetails.educationHistory.map((edu, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <h3 className="font-semibold text-gray-800">{edu.institution || "Not specified"}</h3>
                      <p className="text-gray-600">{edu.degree || "Not specified"}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {edu.startDate} - {edu.endDate || "Present"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No education history provided.</p>
              )}
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Documents</h2>
              {userData.userData?._id ? (
                studentDetails.documents && Object.keys(studentDetails.documents).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(studentDetails.documents).map(([docName, docValue], index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <svg
                            className="w-6 h-6 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {docName.replace(/([A-Z])/g, " $1").trim()}
                            </h3>
                            <p className="text-sm text-gray-500">Available</p>
                          </div>
                        </div>
                        <a
                          href={`${STATIC_URL}/${docValue}`}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No documents available.</p>
                )
              ) : (
                <p className="text-gray-500 text-center">Please log in to view documents.</p>
              )}
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-6 rounded-2xl shadow-md relative overflow-hidden group"
            >
              <button
                onClick={handleFundNow}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg focus:ring-4 focus:ring-blue-300"
                aria-label="Fund now"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Fund Now
                </span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Funding Progress</h2>
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${fundingProgress} 283`}
                      transform="rotate(-90 50 50)"
                      initial={{ strokeDasharray: "0 283" }}
                      animate={{ strokeDasharray: `${fundingProgress} 283` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                    <text x="50" y="50" textAnchor="middle" fontSize="12" fill="#374151" dy=".3em">
                      {Math.round(fundingProgress)}%
                    </text>
                  </svg>
                </div>
                <div className="text-center space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Raised</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {studentDetails.fundingRaised || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Goal</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {studentDetails.fundingAmount || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Application Status</h2>
              <p
                className={`text-lg font-semibold ${
                  studentDetails.status === "approved"
                    ? "text-green-600"
                    : studentDetails.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {studentDetails.status
                  ? studentDetails.status.charAt(0).toUpperCase() + studentDetails.status.slice(1)
                  : "Pending"}
              </p>
              {studentDetails.statusReason && (
                <p className="text-gray-600 mt-2">Reason: {studentDetails.statusReason}</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="bg-white p-6 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Funding Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700">Requested Amount</h3>
                  <p className="text-gray-600 mt-1">
                    {studentDetails.fundingAmount || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Purpose</h3>
                  <p className="text-gray-600 mt-1">{studentDetails.fundingPurpose || "Not specified"}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;