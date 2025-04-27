
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
import { motion, AnimatePresence } from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub, FaLink, FaFileDownload, FaSun, FaMoon, FaCopy } from "react-icons/fa";

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const token = localStorage.getItem("authToken");
  const API_URL = "https://ethio-capital-backend-123.onrender.com/api/v1";
  const STATIC_URL = "https://ethio-capital-backend-123.onrender.com";

  const [studentDetails, setStudentDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLink, setShowLink] = useState(false);

  // Utility functions for base64 handling
  const isValidBase64 = (str) => {
    if (!str || !str.startsWith("data:")) return false;
    const mimeType = str.split(";")[0].split(":")[1];
    return [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ].includes(mimeType);
  };

  const openBase64Document = (base64String, fileName, mimeType) => {
    try {
      const base64Data = base64String.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Failed to open document:", error);
    }
  };

  const downloadBase64Document = (base64String, fileName, mimeType) => {
    try {
      const base64Data = base64String.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download document:", error);
    }
  };

  useEffect(() => {
    console.log("StudentDetail - ID:", id, "Token:", !!token);
    dispatch(fetchUserData());
  }, [dispatch]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) {
        console.log("Missing ID:", id);
        setError("Invalid application ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      if (!token) {
        console.log("No token, using static data for public view");
        setStudentDetails({
          profilePicture: "https://via.placeholder.com/128",
          fullName: "Guest User",
          portfolioDescription: "View this student’s profile!",
          dateOfBirth: null,
          contactEmail: "contact@portfolio.com",
          socialMedia: {
            linkedIn: "https://linkedin.com/in/johndoe",
            twitter: "https://twitter.com/johndoe",
            github: "https://github.com/johndoe",
            other: "https://johndoe.com",
          },
          educationHistory: [{ institution: "Not available", degree: "Not available", fieldOfStudy: "Not available" }],
          fundingPurpose: "Student funding",
          fundingAmount: "Not available",
          fundingDuration: "Not available",
          fundingRaised: "Not available",
          financialNeedsDescription: "Support this student’s goals!",
          documents: {},
        });
        setError("Public view: Log in for full details.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/student-applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("API Response:", response.data); // Log to verify fullName field
        setStudentDetails(response.data);
        setError("");
      } catch (err) {
        console.error("API Error:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        if (err.response?.status === 404) {
          setError("Application not found. It may have been removed or the ID is invalid.");
        } else {
          setError("Error loading details. Please log in or try again.");
          setStudentDetails({
            profilePicture: "https://via.placeholder.com/128",
            fullName: "Guest User",
            portfolioDescription: "View this student’s profile!",
            dateOfBirth: null,
            contactEmail: "contact@portfolio.com",
            socialMedia: {
              linkedIn: "https://linkedin.com/in/johndoe",
              twitter: "https://twitter.com/johndoe",
              github: "https://github.com/johndoe",
              other: "https://johndoe.com",
            },
            educationHistory: [{ institution: "Not available", degree: "Not available", fieldOfStudy: "Not available" }],
            fundingPurpose: "Student funding",
            fundingAmount: "Not available",
            fundingDuration: "Not available",
            fundingRaised: "Not available",
            financialNeedsDescription: "Support this student’s goals!",
            documents: {},
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id, token]);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShowLink = () => {
    setShowLink(true);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/student-applications/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }).catch((err) => {
      console.error("Failed to copy link:", err);
    });
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDarkTheme ? "bg-gradient-to-b from-gray-900 to-indigo-900" : "bg-gradient-to-b from-gray-100 to-indigo-100"
        }`}
      >
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
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

  if (error && !studentDetails.profilePicture) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`min-h-screen flex items-center justify-center ${
          isDarkTheme ? "bg-gradient-to-b from-gray-900 to-indigo-900" : "bg-gradient-to-b from-gray-100 to-indigo-100"
        }`}
      >
        <div
          className={`p-8 rounded-2xl shadow-2xl max-w-md text-center backdrop-blur-md ${
            isDarkTheme ? "bg-gray-800/50 text-white" : "bg-white/50 text-gray-900"
          }`}
        >
          <p className="text-red-500 mb-6 text-lg font-medium">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/Entrepreneur-dashboard")}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const link = `${window.location.origin}/student-applications/${id}`;

  return (
    <div
      className={`min-h-screen ${
        isDarkTheme ? "bg-gradient-to-b from-gray-900 to-indigo-900 text-white" : "bg-gradient-to-b from-gray-100 to-indigo-100 text-gray-900"
      } font-poppins`}
    >
      {/* Sticky Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 backdrop-blur-md bg-blue-600 shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection("about")}
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors duration-300"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("education")}
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors duration-300"
            >
              Education
            </button>
            <button
              onClick={() => scrollToSection("funding")}
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors duration-300"
            >
              Funding
            </button>
            <button
              onClick={() => scrollToSection("documents")}
              className="text-lg font-medium text-white hover:text-blue-200 transition-colors duration-300"
            >
              Documents
            </button>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
            aria-label={isDarkTheme ? "Switch to light theme" : "Switch to dark theme"}
          >
            {isDarkTheme ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="fixed top-20 left-6 z-50 p-3 rounded-full shadow-lg backdrop-blur-md bg-blue-800/50 text-white hover:bg-blue-700/50 transition-all duration-300"
        aria-label="Go back"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </motion.button>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-12 bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
      >
        <div
          className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8 rounded-3xl shadow-2xl backdrop-blur-md ${
            isDarkTheme ? "bg-gray-800/50" : "bg-white/50"
          } p-8`}
        >
          {/* Profile Picture */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src={studentDetails.profilePicture || "https://via.placeholder.com/128"}
              alt={studentDetails.fullName || "Student"}
              className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300"
            />
          </motion.div>
          {/* Text and Social Media */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              {studentDetails.fullName || "Not specified"}
            </h1>
            <p className="text-lg mt-2 opacity-80">{studentDetails.contactEmail || "contact@portfolio.com"}</p>
            <div className="flex justify-center md:justify-start gap-6 mt-6">
              <motion.a
                href={studentDetails.socialMedia?.linkedIn || "https://linkedin.com/in/johndoe"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-full bg-blue-500/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </motion.a>
              <motion.a
                href={studentDetails.socialMedia?.twitter || "https://twitter.com/johndoe"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-full bg-blue-500/10 transition-all duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </motion.a>
              <motion.a
                href={studentDetails.socialMedia?.github || "https://github.com/johndoe"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-full bg-blue-500/10 transition-all duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </motion.a>
              <motion.a
                href={studentDetails.socialMedia?.other || "https://johndoe.com"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                className="text-blue-400 hover:text-blue-300 p-2 rounded-full bg-blue-500/10 transition-all duration-300"
                aria-label="Personal Website"
              >
                <FaLink size={24} />
              </motion.a>
            </div>
            {/* Shareable Link */}
            <div className="mt-6 flex flex-col items-center md:items-start gap-2">
              <button
                onClick={handleShowLink}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
              >
                <FaLink size={16} />
                Open Profile Link Part
              </button>
              {showLink && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-blue-400 break-all">{link}</p>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    <FaCopy size={16} />
                  </button>
                </div>
              )}
            </div>
            <AnimatePresence>
              {copySuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 text-blue-400 text-sm text-center md:text-left"
                >
                  Link copied!
                </motion.p>
              )}
            </AnimatePresence>
            {error && (
              <p className="mt-2 text-yellow-400 text-sm text-center md:text-left">{error}</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* About Section */}
        <motion.section
          id="about"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div
            className={`p-8 rounded-3xl shadow-2xl backdrop-blur-md ${
              isDarkTheme ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              About Me
            </h2>
            <p className="text-lg leading-relaxed">
              {studentDetails.portfolioDescription || "No description provided."}
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg">Date of Birth</h3>
                <p className="text-base opacity-80">
                  {studentDetails.dateOfBirth
                    ? new Date(studentDetails.dateOfBirth).toLocaleDateString()
                    : "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Email</h3>
                <p className="text-base opacity-80">{studentDetails.contactEmail || "Not specified"}</p>
              </div>
              {studentDetails.socialMedia && Object.keys(studentDetails.socialMedia).length > 0 && (
                <div className="col-span-2">
                  <h3 className="font-medium text-lg">Social Media</h3>
                  <div className="flex gap-4 mt-2">
                    {studentDetails.socialMedia.linkedIn && (
                      <a
                        href={studentDetails.socialMedia.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        LinkedIn
                      </a>
                    )}
                    {studentDetails.socialMedia.twitter && (
                      <a
                        href={studentDetails.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        Twitter
                      </a>
                    )}
                    {studentDetails.socialMedia.github && (
                      <a
                        href={studentDetails.socialMedia.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        GitHub
                      </a>
                    )}
                    {studentDetails.socialMedia.other && (
                      <a
                        href={studentDetails.socialMedia.other}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >
                        Other
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Education Section */}
        <motion.section
          id="education"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Education
          </h2>
          <div className="space-y-6">
            {studentDetails.educationHistory?.length > 0 ? (
              studentDetails.educationHistory.map((edu, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-2xl shadow-xl backdrop-blur-md ${
                    isDarkTheme ? "bg-gray-800/50" : "bg-white/50"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-semibold">{edu.institution || "Not specified"}</h3>
                  <p className="text-base opacity-80">{edu.degree || "Not specified"}</p>
                  <p className="text-sm opacity-60 mt-2">{edu.fieldOfStudy || "Field not specified"}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-lg opacity-80">No education history provided.</p>
            )}
          </div>
        </motion.section>

        {/* Funding Request Section */}
        <motion.section
          id="funding"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div
            className={`p-8 rounded-3xl shadow-2xl backdrop-blur-md ${
              isDarkTheme ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
              Funding Request
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg">Funding Purpose</h3>
                <p className="text-base opacity-80">
                  {studentDetails.fundingPurpose
                    ? studentDetails.fundingPurpose.charAt(0).toUpperCase() + studentDetails.fundingPurpose.slice(1)
                    : "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Requested Amount</h3>
                <p className="text-base opacity-80">
                  {studentDetails.fundingAmount
                    ? `$${parseFloat(studentDetails.fundingAmount).toLocaleString()}`
                    : "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Funding Duration</h3>
                <p className="text-base opacity-80">
                  {studentDetails.fundingDuration
                    ? `${studentDetails.fundingDuration} months`
                    : "Not specified"}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Funding Raised</h3>
                <p className="text-base opacity-80">
                  {studentDetails.fundingRaised
                    ? `$${parseFloat(studentDetails.fundingRaised).toLocaleString()}`
                    : "$0"}
                </p>
              </div>
              <div className="col-span-2">
                <h3 className="font-medium text-lg">Financial Needs Description</h3>
                <p className="text-base opacity-80 mt-2">
                  {studentDetails.financialNeedsDescription || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Documents Section */}
        <motion.section
          id="documents"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Documents
          </h2>
          <div
            className={`p-8 rounded-3xl shadow-2xl backdrop-blur-md ${
              isDarkTheme ? "bg-gray-800/50" : "bg-white/50"
            }`}
          >
            {userData.userData?._id ? (
              studentDetails.documents && Object.keys(studentDetails.documents).length > 0 ? (
                <div className="space-y-4">
                  {studentDetails.documents.academicTranscripts && (
                    <motion.div
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          className="w-6 h-6 text-blue-400"
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
                          <h3 className="font-medium">Academic Transcripts</h3>
                          <p className="text-sm opacity-60">Available</p>
                        </div>
                      </div>
                      {isValidBase64(studentDetails.documents.academicTranscripts) ? (
                        <button
                          onClick={() =>
                            openBase64Document(
                              studentDetails.documents.academicTranscripts,
                              "academic_transcripts.pdf",
                              studentDetails.documents.academicTranscripts.split(";")[0].split(":")[1]
                            )
                          }
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                        >
                          View
                        </button>
                      ) : (
                        <a
                          href={
                            studentDetails.documents.academicTranscripts
                              ? `${STATIC_URL}/${studentDetails.documents.academicTranscripts}`
                              : "#"
                          }
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={
                            !studentDetails.documents.academicTranscripts
                              ? (e) => e.preventDefault()
                              : undefined
                          }
                        >
                          {studentDetails.documents.academicTranscripts ? "View" : "Not Available"}
                        </a>
                      )}
                    </motion.div>
                  )}
                  {studentDetails.documents.researchProposal && (
                    <motion.div
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-4">
                        <svg
                          className="w-6 h-6 text-blue-400"
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
                          <h3 className="font-medium">Research Proposal</h3>
                          <p className="text-sm opacity-60">Available</p>
                        </div>
                      </div>
                      {isValidBase64(studentDetails.documents.researchProposal) ? (
                        <button
                          onClick={() =>
                            openBase64Document(
                              studentDetails.documents.researchProposal,
                              "research_proposal.pdf",
                              studentDetails.documents.researchProposal.split(";")[0].split(":")[1]
                            )
                          }
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                        >
                          View
                        </button>
                      ) : (
                        <a
                          href={
                            studentDetails.documents.researchProposal
                              ? `${STATIC_URL}/${studentDetails.documents.researchProposal}`
                              : "#"
                          }
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={
                            !studentDetails.documents.researchProposal ? (e) => e.preventDefault() : undefined
                          }
                        >
                          {studentDetails.documents.researchProposal ? "View" : "Not Available"}
                        </a>
                      )}
                    </motion.div>
                  )}
                  {studentDetails.documents.additionalDocuments?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg">Additional Documents</h3>
                      {studentDetails.documents.additionalDocuments.map((doc, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-4">
                            <svg
                              className="w-6 h-6 text-blue-400"
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
                              <h3 className="font-medium">Additional Document #{index + 1}</h3>
                              <p className="text-sm opacity-60">Available</p>
                            </div>
                          </div>
                          {isValidBase64(doc) ? (
                            <button
                              onClick={() =>
                                openBase64Document(
                                  doc,
                                  `additional_document_${index + 1}.pdf`,
                                  doc.split(";")[0].split(":")[1]
                                )
                              }
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                            >
                              View
                            </button>
                          ) : (
                            <a
                              href={doc ? `${STATIC_URL}/${doc}` : "#"}
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={!doc ? (e) => e.preventDefault() : undefined}
                            >
                              {doc ? "View" : "Not Available"}
                            </a>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {studentDetails.documents.academicTranscripts && (
                    <motion.a
                      href={
                        isValidBase64(studentDetails.documents.academicTranscripts)
                          ? "#"
                          : `${STATIC_URL}/${studentDetails.documents.academicTranscripts}`
                      }
                      onClick={
                        isValidBase64(studentDetails.documents.academicTranscripts)
                          ? () =>
                              downloadBase64Document(
                                studentDetails.documents.academicTranscripts,
                                "academic_transcripts.pdf",
                                studentDetails.documents.academicTranscripts.split(";")[0].split(":")[1]
                              )
                          : undefined
                      }
                      download={!isValidBase64(studentDetails.documents.academicTranscripts)}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 animate-pulse"
                      whileHover={{ scale: 1.05 }}
                    >
                      <FaFileDownload className="mr-2" />
                      Download Academic Transcripts
                    </motion.a>
                  )}
                </div>
              ) : (
                <p className="text-lg opacity-80">No documents available.</p>
              )
            ) : (
              <p className="text-lg opacity-80 text-center">Please log in to view documents.</p>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default StudentDetail;
