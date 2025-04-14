import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"; // Add socket.io-client
import {
  clearBussinessIdea,
  setBussinessIdea,
  setSelectedBusinessIdea,
  fetchBusinessIdeaById,
} from "../redux/BussinessIdeaSlice";
import Message from "../component/chat/Messsage";
import setupAxios from "../middleware/MiddleWare";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../redux/UserSlice";
import { fetchUnReadMessages } from "../redux/MessageSlice";

const StartupDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedBusinessIdea = useSelector((state) => state.businessIdea.selectedBusinessIdea);
  const bussinessIdea = useSelector((state) => state.businessIdea.BussinessIdea);
  const bussinessIdeaArray = Array.isArray(bussinessIdea) ? bussinessIdea : Object.values(bussinessIdea || {});
  const userData = useSelector((state) => state.userData);
  const messages = useSelector((state) => state.messageDatas.messageDatas || []);
  const token = localStorage.getItem("authToken");
  const API_URL = "http://localhost:3001/api/v1";
  const STATIC_URL = "http://localhost:3001";

  // Socket.io state
  const [socket, setSocket] = useState(null);

  // Existing state declarations
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [interestCount, setInterestCount] = useState(847);
  const [ideaDetails, setIdeaDetails] = useState({});
  const [unreadCount, setUnreadCount] = useState(0);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("pending");
  const [verificationId, setVerificationId] = useState(null);
  const [formData, setFormData] = useState({
    idPicture: null,
    profilePicture: null,
    fullName: "",
    phone: "",
    investmentCapacity: "",
    experience: "",
  });
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [hasDocumentAccess, setHasDocumentAccess] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState("");
  const [cameraFacingMode, setCameraFacingMode] = useState("user");
  const [streamActive, setStreamActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [documentAccessRequests, setDocumentAccessRequests] = useState([]);
  const [showAccessRequests, setShowAccessRequests] = useState(false);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [requestActionLoading, setRequestActionLoading] = useState({});

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize socket.io connection
  useEffect(() => {
    if (token && userData.userData?._id) {
      const newSocket = io("http://localhost:3001", {
        auth: { token },
        query: { userId: userData.userData._id },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket.io server");
      });
      newSocket.on("connect_error", (err) => {
        console.error("Socket.io connection error:", err.message);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, userData.userData?._id]);

  // Listen for documentAccessApproved event
  useEffect(() => {
    if (socket) {
      socket.on("documentAccessApproved", ({ ideaId, ideaTitle }) => {
        console.log(`Received documentAccessApproved for ideaId: ${ideaId}`);
        if (ideaId === id) {
          fetchDocumentAccessStatus();
          alert(`Access approved for "${ideaTitle}"`);
        }
      });
    }
    return () => {
      if (socket) socket.off("documentAccessApproved");
    };
  }, [socket, id]);

  // Existing useEffect hooks
  useEffect(() => {
    setupAxios();
    dispatch(fetchUserData());
    if (userData.userData?._id) {
      dispatch(fetchUnReadMessages(userData.userData._id));
    }
  }, [dispatch, userData.userData?._id]);

  useEffect(() => {
    if (showCamera && !streamActive) {
      startCamera();
    }
    return () => stopCamera();
  }, [showCamera, cameraFacingMode]);

  useEffect(() => {
    const selectedIdea = bussinessIdeaArray.find((idea) => idea._id === id);
    if (selectedIdea) {
      dispatch(setSelectedBusinessIdea(selectedIdea));
      setIdeaDetails(selectedIdea);
    } else {
      dispatch(fetchBusinessIdeaById(id));
    }

    if (userData.userData?.role === "investor" && userData.userData?._id && id) {
      const checkVerificationStatus = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/verification/status/${userData.userData._id}/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const verification = response.data.verification;
          if (verification) {
            setVerificationStatus(verification.status);
            setVerificationId(verification._id);
            if (verification.status === "draft" || verification.status === "rejected") {
              setFormData((prev) => ({
                ...prev,
                fullName: verification.fullName || "",
                phone: verification.phone || "",
                investmentCapacity: verification.investmentCapacity || "",
                experience: verification.experience || "",
              }));
              if (verification.status === "rejected" && verification.rejectionReason) {
                setSubmissionError(`Previous verification rejected: ${verification.rejectionReason}`);
              }
            }
          } else {
            setVerificationStatus("pending");
          }
        } catch (err) {
          console.error("Error checking verification status:", err.response?.data || err.message);
          setVerificationStatus("pending");
        }
      };

      checkVerificationStatus();

      const interval = setInterval(() => {
        if (verificationStatus !== "approved") {
          checkVerificationStatus();
        }
      }, 10000);

      return () => clearInterval(interval);
    }

    if (userData.userData?._id) {
      fetchDocumentAccessStatus();

      if (userData.userData?.role === "entrepreneur" && selectedIdea?.user?._id === userData.userData?._id) {
        fetchDocumentAccessRequests();
      }
    }

    if (userData.userData?.role === "entrepreneur" && selectedIdea?.user?._id === userData.userData?._id) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(`${API_URL}/conversations/idea/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setConversations(response.data);
          const unread = response.data.reduce((count, conv) => {
            return (
              count +
              messages.filter(
                (msg) => msg.conversationId === conv._id && !msg.read && msg.recipient === userData.userData._id
              ).length
            );
          }, 0);
          setUnreadCount(unread);
        } catch (err) {
          console.error("Error fetching conversations:", err.response?.data || err.message);
        }
      };
      fetchConversations();
    } else if (userData.userData?.role === "investor" && verificationStatus === "approved") {
      const fetchInvestorConversation = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/conversations/idea/${id}/investor/${userData.userData._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const conv = response.data[0];
          if (conv) {
            setConversations([conv]);
            setSelectedConversationId(conv._id);
            setShowChat(true);
          }
        } catch (err) {
          console.error("Error fetching investor conversation:", err.response?.data || err.message);
        }
      };
      fetchInvestorConversation();
    }
  }, [dispatch, id, bussinessIdea, userData, messages, verificationStatus, token, socket]);

  // Fetch document access requests
  const fetchDocumentAccessRequests = async () => {
    if (!userData.userData?._id || !token || !id) {
      console.log("Missing data for fetching requests:", {
        userId: userData.userData?._id,
        token: !!token,
        ideaId: id,
      });
      return;
    }

    setIsRequestsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/document-access/requests/idea/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requests = response.data.requests || response.data || [];
      setDocumentAccessRequests(Array.isArray(requests) ? requests : []);
    } catch (error) {
      console.error("Error fetching document access requests:", error.response?.data || error.message);
      setDocumentAccessRequests([]);
    } finally {
      setIsRequestsLoading(false);
    }
  };

  // Handle approval/denial of document access requests
  const handleAccessRequestAction = async (requestId, action) => {
    if (!token) {
      alert("Authentication required. Please log in.");
      return;
    }

    setRequestActionLoading((prev) => ({ ...prev, [requestId]: true }));
    try {
      await axios.post(
        `${API_URL}/document-access/action`,
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDocumentAccessRequests((prev) => prev.filter((req) => req._id !== requestId));
      alert(`Request ${action === "approve" ? "approved" : "denied"} successfully!`);
      await fetchDocumentAccessRequests(); // Refresh after action
    } catch (error) {
      console.error(`Error ${action}ing request:`, error.response?.data || error.message);
      alert(`Failed to ${action} request: ${error.response?.data?.message || "Please try again."}`);
    } finally {
      setRequestActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const fetchDocumentAccessStatus = async () => {
    if (!userData.userData?._id || !token || !id) return;
    try {
      const response = await axios.get(`${API_URL}/document-access/status/${id}/${userData.userData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Document access status:", response.data);
      setHasDocumentAccess(response.data.hasAccess || userData.userData._id === ideaDetails.user?._id);
    } catch (error) {
      console.error("Error fetching document access status:", error.response?.data || error.message);
      setHasDocumentAccess(userData.userData._id === ideaDetails.user?._id);
    }
  };

  const requestDocumentAccess = async () => {
    setRequestLoading(true);
    try {
      await axios.post(
        `${API_URL}/document-access/request`,
        { ideaId: id, requesterId: userData.userData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Access request sent to the entrepreneur!");
    } catch (error) {
      console.error("Error requesting document access:", error);
      alert("Failed to send request. Please try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      if (stream) stopCamera();
      const constraints = { video: { facingMode: cameraFacingMode } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Error accessing camera. Please ensure camera permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setStreamActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(imageDataUrl);
      setShowPreview(true);

      canvas.toBlob((blob) => {
        const imageFile = new File([blob], "profile-picture.png", { type: "image/png" });
        setFormData((prev) => ({ ...prev, profilePicture: imageFile }));
      }, "image/png");
    }
  };

  const approveImage = () => {
    setShowPreview(false);
    setShowCamera(false);
    stopCamera();
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setShowPreview(false);
  };

  const toggleCameraFacing = () => {
    setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleInvestNow = () => navigate("/PaymentForm");

  const handleInterestSubmit = () => {
    setIsInterested(true);
    setInterestCount((prev) => prev + 1);
  };

  const handleSaveIdea = () => setIsSaved((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleOpenCamera = () => {
    setCameraMode("profile");
    setShowCamera(true);
    setShowPreview(false);
    setCapturedImage(null);
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setSubmissionLoading(true);
    setSubmissionError("");

    if (!formData.idPicture || !formData.profilePicture) {
      setSubmissionError("Please provide both ID and profile pictures");
      setSubmissionLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("ideaId", id);
    submitData.append("fullName", formData.fullName);
    submitData.append("phone", formData.phone);
    submitData.append("investmentCapacity", formData.investmentCapacity);
    submitData.append("experience", formData.experience);
    submitData.append("idPicture", formData.idPicture);
    submitData.append("profilePicture", formData.profilePicture);

    try {
      const token = localStorage.getItem("authToken");
      let response;
      if (verificationId && verificationStatus === "draft") {
        response = await axios.put(
          `${API_URL}/verification/${verificationId}/submit`,
          submitData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(`${API_URL}/verification`, submitData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
        if (response.data._id) {
          await axios.put(`${API_URL}/verification/${response.data._id}/submit`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      setVerificationStatus("submitted");
      setVerificationId(response.data._id);
      setShowVerificationForm(false);
      alert("Verification submitted successfully. Awaiting admin approval.");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setSubmissionError(`Error submitting form: ${errorMessage}`);
    } finally {
      setSubmissionLoading(false);
    }
  };

  const startConversation = async (e, otherUserId, currentUserId, ideaId) => {
    e.preventDefault();
    if (userData.userData?.role === "investor" && verificationStatus !== "approved") {
      setShowVerificationForm(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/conversation`,
        { participants: [currentUserId, otherUserId], ideaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newConv = response.data;
      setConversations((prev) => [...prev, newConv]);
      setSelectedConversationId(newConv._id);
      setShowChat(true);
    } catch (error) {
      console.error("Error starting conversation:", error.response?.data || error.message);
    }
  };

  const calculateProgress = (raised, target) => (raised / target) * 100;

  const isEntrepreneur = userData.userData?.role === "entrepreneur" && ideaDetails?.user?._id === userData.userData?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-lg z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-4 w-full max-w-md relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Take Profile Picture</h2>
              <button
                onClick={() => {
                  setShowCamera(false);
                  setShowPreview(false);
                  stopCamera();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!showPreview ? (
              <div className="relative mb-4 bg-black">
                <video ref={videoRef} className="w-full h-auto rounded-lg" autoPlay playsInline />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={toggleCameraFacing}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="relative mb-4">
                <img src={capturedImage} alt="Captured" className="w-full h-auto rounded-lg" />
              </div>
            )}

            <div className="flex justify-center gap-4">
              {!showPreview ? (
                <button
                  onClick={captureImage}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              ) : (
                <>
                  <button
                    onClick={retakeImage}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700"
                  >
                    Retake
                  </button>
                  <button
                    onClick={approveImage}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700"
                  >
                    Use this photo
                  </button>
                </>
              )}
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">Take a clear photo of your face</p>
          </div>
        </div>
      )}

      {showVerificationForm && !showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Investor Verification</h2>
              <button
                onClick={() => setShowVerificationForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="mb-4 text-gray-600">Complete this form to verify your investor status:</p>
            {submissionError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                {submissionError}
              </div>
            )}

            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Capacity</label>
                <select
                  name="investmentCapacity"
                  value={formData.investmentCapacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select capacity</option>
                  <option value="$10k-$50k">$10,000 - $50,000</option>
                  <option value="$50k-$100k">$50,000 - $100,000</option>
                  <option value="$100k-$500k">$100,000 - $500,000</option>
                  <option value="$500k+">$500,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Investment Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID/Passport Photo</label>
                <input
                  type="file"
                  name="idPicture"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*"
                  required
                />
                {formData.idPicture && (
                  <div className="text-green-600 text-sm flex items-center gap-1 mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ID Photo uploaded
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Take Picture
                </button>
                {formData.profilePicture && (
                  <div className="text-green-600 text-sm flex items-center gap-1 mt-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Profile Picture captured
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={submissionLoading}
                className={`w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  submissionLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submissionLoading ? "Submitting..." : "Submit for Verification"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isEntrepreneur && (
        <div className="fixed top-4 right-4 z-30">
          <button
            onClick={() => {
              setShowAccessRequests(!showAccessRequests);
              if (!showAccessRequests) {
                fetchDocumentAccessRequests();
              }
            }}
            className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Access Requests
            {documentAccessRequests.filter((req) => req.status === "pending").length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {documentAccessRequests.filter((req) => req.status === "pending").length}
              </span>
            )}
          </button>
        </div>
      )}

      {showAccessRequests && isEntrepreneur && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Document Access Requests</h2>
                <button
                  onClick={() => setShowAccessRequests(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={fetchDocumentAccessRequests}
                  disabled={isRequestsLoading}
                  className={`flex items-center gap-1 text-blue-600 hover:text-blue-800 ${
                    isRequestsLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isRequestsLoading ? "animate-spin" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            <div className="p-6">
              {isRequestsLoading ? (
                <div className="flex justify-center items-center py-8">
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
              ) : documentAccessRequests.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500">No document access requests available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documentAccessRequests.map((request) => (
                    <div
                      key={request._id}
                      className={`p-4 rounded-lg border ${
                        request.status === "pending"
                          ? "border-yellow-200 bg-yellow-50"
                          : request.status === "approved"
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                              {request.requesterName || `Investor #${request.requesterId.slice(-6)}`}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                request.status === "pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : request.status === "approved"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Requested on: {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccessRequestAction(request._id, "approve")}
                              disabled={requestActionLoading[request._id]}
                              className={`flex items-center gap-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
                                requestActionLoading[request._id] ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {requestActionLoading[request._id] ? (
                                <svg
                                  className="animate-spin h-4 w-4 text-white"
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
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => handleAccessRequestAction(request._id, "deny")}
                              disabled={requestActionLoading[request._id]}
                              className={`flex items-center gap-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
                                requestActionLoading[request._id] ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {requestActionLoading[request._id] ? (
                                <svg
                                  className="animate-spin h-4 w-4 text-white"
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
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                              Deny
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-lg shadow-lg w-80">
          <div
            className={`p-4 rounded-t-lg cursor-pointer flex justify-between items-center ${
              userData.userData?.role === "investor" && verificationStatus !== "approved"
                ? "bg-gray-500 text-white"
                : "bg-blue-600 text-white"
            }`}
            onClick={() => {
              if (userData.userData?.role === "entrepreneur" || verificationStatus === "approved") {
                setShowChat(!showChat);
              } else if (userData.userData?.role === "investor") {
                if (verificationStatus === "pending" || verificationStatus === "rejected") {
                  setShowVerificationForm(true);
                } else if (verificationStatus === "submitted") {
                  alert("Verification pending. Please wait for approval.");
                }
              }
            }}
          >
            <div className="flex items-center gap-2">
              <img
                src={ideaDetails?.entrepreneurImage || "https://via.placeholder.com/32"}
                alt={ideaDetails?.entrepreneurName || "Entrepreneur"}
                className="w-8 h-8 rounded-full"
              />
              <span>
                {userData.userData?.role === "entrepreneur" && ideaDetails?.user?._id === userData.userData?._id
                  ? "Your Idea Chats"
                  : `Chat with ${ideaDetails?.user?.fullName || "Entrepreneur"}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {userData.userData?.role === "investor" &&
                verificationStatus === "approved" &&
                !showChat &&
                unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              <span>{showChat ? "−" : "+"}</span>
            </div>
          </div>

          {userData.userData?.role === "investor" && verificationStatus !== "approved" && !showChat && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {verificationStatus === "pending" && (
                <>
                  <p className="font-medium text-gray-700">Verification Required</p>
                  <button
                    onClick={() => setShowVerificationForm(true)}
                    className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Verify Now
                  </button>
                </>
              )}
              {verificationStatus === "submitted" && (
                <p className="font-medium text-gray-700">Verification In Progress</p>
              )}
              {verificationStatus === "rejected" && (
                <>
                  <p className="font-medium text-red-700">Verification Rejected</p>
                  <button
                    onClick={() => setShowVerificationForm(true)}
                    className="mt-2 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Update Information
                  </button>
                </>
              )}
            </div>
          )}

          {showChat && (
            <div className="p-2 max-h-96 overflow-y-auto">
              {userData.userData?.role === "entrepreneur" && ideaDetails?.user?._id === userData.userData?._id ? (
                conversations.length === 0 ? (
                  <p className="text-gray-500 text-center p-2">No chats yet</p>
                ) : (
                  conversations.map((conv) => {
                    const investor = conv.participants.find((p) => p !== userData.userData._id);
                    const unreadForConv = messages.filter(
                      (msg) =>
                        msg.conversationId === conv._id && !msg.read && msg.recipient === userData.userData._id
                    ).length;
                    return (
                      <div
                        key={conv._id}
                        onClick={() => setSelectedConversationId(conv._id)}
                        className={`p-2 cursor-pointer hover:bg-gray-100 ${
                          selectedConversationId === conv._id ? "bg-blue-100" : ""
                        }`}
                      >
                        <p className="font-semibold flex items-center gap-2">
                          Investor #{typeof investor === "string" ? investor.slice(-6) : investor?._id.slice(-6)}
                          {unreadForConv > 0 && (
                            <span className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                              {unreadForConv}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.text || "No messages yet"}</p>
                      </div>
                    );
                  })
                )
              ) : !selectedConversationId ? (
                <button
                  onClick={(e) => startConversation(e, ideaDetails?.user?._id, userData.userData._id, ideaDetails._id)}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg"
                >
                  Start Chat
                </button>
              ) : (
                <Message
                  conversationId={selectedConversationId}
                  userId={userData.userData._id}
                  ideaId={ideaDetails._id}
                />
              )}
              {selectedConversationId && userData.userData?.role === "entrepreneur" && (
                <Message
                  conversationId={selectedConversationId}
                  userId={userData.userData._id}
                  ideaId={ideaDetails._id}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={ideaDetails?.entrepreneurImage || "https://via.placeholder.com/128"}
              alt={ideaDetails?.entrepreneurName || "Entrepreneur"}
              className="w-32 h-32 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{ideaDetails.title || "Startup Idea"}</h1>
              <p className="text-xl text-gray-600 mt-2">by {ideaDetails?.user?.fullName || "Entrepreneur"}</p>
              <p className="text-gray-500 mt-1">{ideaDetails.entrepreneurLocation || "Location"}</p>
              <div className="flex gap-4 mt-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {ideaDetails.currentStage || "Early Stage"}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Seeking {ideaDetails.fundingNeeded || "$0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-600">{ideaDetails.overview || "No overview available"}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Entrepreneur Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700">Education</h3>
                  <p className="text-gray-600">{ideaDetails.entrepreneurEducation || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Experience</h3>
                  <p className="text-gray-600">{ideaDetails.entrepreneurBackground || "Not specified"}</p>
                </div>
              </div>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Problem Statement</h2>
              <p className="text-gray-600 mb-6">{ideaDetails.problemStatement || "No problem statement available"}</p>
              <h2 className="text-2xl font-bold mb-4">Solution</h2>
              <p className="text-gray-600">{ideaDetails.solution || "No solution available"}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Funding Progress</h2>
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${calculateProgress(
                        ideaDetails?.fundingRaised?.replace(/\D/g, "") || "0",
                        ideaDetails?.fundingNeeded?.replace(/\D/g, "") || "1"
                      )} 283`}
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="45" textAnchor="middle" fontSize="10" fill="#374151">
                      {ideaDetails.fundingRaised || "$0"}
                    </text>
                    <text x="50" y="65" textAnchor="middle" fontSize="8" fill="#6b7280">
                      of {ideaDetails.fundingNeeded || "$0"}
                    </text>
                  </svg>
                </div>
                <div className="ml-8">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Valuation</p>
                    <p className="text-lg font-bold">{ideaDetails?.financials?.valuation || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Break Even</p>
                    <p className="text-lg font-bold">{ideaDetails?.financials?.breakEvenPoint || "N/A"}</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Traction</h2>
              <ul className="list-disc list-inside space-y-2">
                {ideaDetails?.traction?.length > 0 ? (
                  ideaDetails.traction.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No traction data available</li>
                )}
              </ul>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Financial Projections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700">Revenue 2023</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {ideaDetails?.financials?.revenue2023 || "$0"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Projected Revenue 2024</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {ideaDetails?.financials?.projectedRevenue2024 || "$0"}
                  </p>
                </div>
              </div>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ideaDetails?.team?.length > 0 ? (
                  ideaDetails.team.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-gray-600">{member.role}</p>
                      <p className="text-sm text-gray-500">{member.expertise}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No Team Member available</p>
                )}
              </div>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Documents</h2>
              {userData.userData?._id ? (
                hasDocumentAccess ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ideaDetails?.documents && Object.keys(ideaDetails.documents).length > 0 ? (
                      Object.entries(ideaDetails.documents).map(([docName, docValue], index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            <div>
                              <h3 className="font-semibold">{docName.replace(/([A-Z])/g, " $1").trim()}</h3>
                              <p className="text-sm text-gray-500">Available</p>
                            </div>
                          </div>
                          <a
                            href={`${STATIC_URL}/${docValue}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No documents available</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-600">Documents are locked. Request access from the entrepreneur.</p>
                    <button
                      onClick={requestDocumentAccess}
                      disabled={requestLoading}
                      className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                        requestLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {requestLoading ? "Requesting..." : "Request Access"}
                    </button>
                  </div>
                )
              ) : (
                <p className="text-gray-400">Please log in to view or request documents.</p>
              )}
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow relative overflow-hidden group">
              <button
                onClick={handleInvestNow}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg transform transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  INVEST NOW
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <button
                onClick={handleSaveIdea}
                className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg font-semibold transition-colors ${
                  isSaved ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${isSaved ? "text-white" : "text-gray-500"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {isSaved ? "Saved" : "Save Idea"}
              </button>
            </div>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Market Size</h2>
              <p className="text-gray-600">{ideaDetails.marketSize || "No market size data available"}</p>
            </section>
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Use of Funds</h2>
              <ul className="list-disc list-inside space-y-2">
                {ideaDetails?.useOfFunds?.length > 0 ? (
                  ideaDetails.useOfFunds.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No use of funds available</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;