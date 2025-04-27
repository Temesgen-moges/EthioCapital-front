// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import io from "socket.io-client";
// import {
//   clearBussinessIdea,
//   setBussinessIdea,
//   setSelectedBusinessIdea,
//   fetchBusinessIdeaById,
// } from "../redux/BussinessIdeaSlice";
// import Message from "../component/chat/Messsage";
// import setupAxios from "../middleware/MiddleWare";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserData } from "../redux/UserSlice";
// import { fetchUnReadMessages } from "../redux/MessageSlice";

// const StartupDetail = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const selectedBusinessIdea = useSelector(
//     (state) => state.businessIdea.selectedBusinessIdea
//   );

//   console.log(
//     "selectedBusinessIdea and eeeeeeeeeeeeesssssssss",
//     selectedBusinessIdea
//   );

//   const bussinessIdea = useSelector(
//     (state) => state.businessIdea.BussinessIdea
//   );
//   const bussinessIdeaArray = Array.isArray(bussinessIdea)
//     ? bussinessIdea
//     : Object.values(bussinessIdea || {});
//   const userData = useSelector((state) => state.userData);
//   const messages = useSelector(
//     (state) => state.messageDatas.messageDatas || []
//   );
//   const token = localStorage.getItem("authToken");
//   const API_URL = "https://ethio-capital-backend-123.onrender.com/api/v1";
//   const STATIC_URL = "https://ethio-capital-backend-123.onrender.com";

//   const [socket, setSocket] = useState(null);
//   const [isInterested, setIsInterested] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [showChat, setShowChat] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversationId, setSelectedConversationId] = useState("");
//   const [interestCount, setInterestCount] = useState(847);
//   const [ideaDetails, setIdeaDetails] = useState({});
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showVerificationForm, setShowVerificationForm] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState("pending");
//   const [verificationId, setVerificationId] = useState(null);
//   const [formData, setFormData] = useState({
//     idPicture: null,
//     profilePicture: null,
//     fullName: "",
//     phone: "",
//     investmentCapacity: "",
//     experience: "",
//   });
//   const [submissionLoading, setSubmissionLoading] = useState(false);
//   const [submissionError, setSubmissionError] = useState("");
//   const [hasDocumentAccess, setHasDocumentAccess] = useState(false);
//   const [requestLoading, setRequestLoading] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [cameraMode, setCameraMode] = useState("");
//   const [cameraFacingMode, setCameraFacingMode] = useState("user");
//   const [streamActive, setStreamActive] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [showPreview, setShowPreview] = useState(false);
//   const [documentAccessRequests, setDocumentAccessRequests] = useState([]);
//   const [showAccessRequests, setShowAccessRequests] = useState(false);
//   const [isRequestsLoading, setIsRequestsLoading] = useState(false);
//   const [requestActionLoading, setRequestActionLoading] = useState({});
//   const [priorEquity, setPriorEquity] = useState(0);
//   const [remainingFunding, setRemainingFunding] = useState(0);
//   const [data, setData] = useState(null);
//   const [documentError, setDocumentError] = useState('');
//   // const [userRole, setUserRole] = useState(null);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const userRole = userData.userData?.role;
  
//   useEffect(() => {
//     if (token && userData.userData?._id) {
//       const newSocket = io("https://ethio-capital-backend-123.onrender.com", {
//         auth: { token },
//         query: { userId: userData.userData._id },
//       });
//       setSocket(newSocket);

//       newSocket.on("connect", () => {
//         console.log("Connected to socket.io server");
//       });
//       newSocket.on("connect_error", (err) => {
//         console.error("Socket.io connection error:", err.message);
//       });

//       return () => {
//         newSocket.disconnect();
//       };
//     }
//   }, [token, userData.userData?._id]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("documentAccessApproved", ({ ideaId, ideaTitle }) => {
//         console.log(`Received documentAccessApproved for ideaId: ${ideaId}`);
//         if (ideaId === id) {
//           fetchDocumentAccessStatus();
//           alert(`Access approved for "${ideaTitle}"`);
//         }
//       });
//       socket.on(
//         "fundingUpdated",
//         ({ ideaId, fundingRaised, fundingNeeded }) => {
//           if (ideaId === id) {
//             console.log(`Funding updated for idea ${ideaId}: ${fundingRaised}`);
//             setIdeaDetails((prev) => ({
//               ...prev,
//               fundingRaised,
//               fundingNeeded,
//             }));
//             calculateRemainingFunding(fundingRaised, fundingNeeded);
//           }
//         }
//       );
//     }
//     return () => {
//       if (socket) {
//         socket.off("documentAccessApproved");
//         socket.off("fundingUpdated");
//       }
//     };
//   }, [socket, id]);

//   useEffect(() => {
//     setupAxios();
//     dispatch(fetchUserData());
//     if (userData.userData?._id) {
//       dispatch(fetchUnReadMessages(userData.userData._id));
//     }
//   }, [dispatch, userData.userData?._id]);

//   useEffect(() => {
//     if (showCamera && !streamActive) {
//       startCamera();
//     }
//     return () => stopCamera();
//   }, [showCamera, cameraFacingMode]);

//   const userDataFromRedux = useSelector((state) => state.userData.userData);
//   const [userInfo, setUserInfo] = useState({ fullName: "", email: "" });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         if (userDataFromRedux) {
//           setUserInfo({
//             fullName:
//               userDataFromRedux.fullName ||
//               `${userDataFromRedux.firstName || ""} ${
//                 userDataFromRedux.lastName || ""
//               }`.trim() ||
//               "Unknown User",
//             email: userDataFromRedux.email || "",
//           });
//         } else if (token) {
//           try {
//             const response = await axios.get(`${API_URL}/user`, {
//               headers: { Authorization: `Bearer ${token}` },
//             });
//             setUserInfo({
//               fullName:
//                 response.data.fullName ||
//                 `${response.data.firstName || ""} ${
//                   response.data.lastName || ""
//                 }`.trim() ||
//                 "Unknown User",
//               email: response.data.email || "",
//             });
//           } catch (error) {
//             if (error.response?.status === 401) {
//               console.error("Token expired:", error.response?.data);
//               localStorage.removeItem("authToken");
//               setTimeout(() => navigate("/login"), 3000);
//               return;
//             }
//             throw error;
//           }
//         } else {
//           console.error("No token or userId");
//           setTimeout(() => navigate("/login"), 3000);
//           return;
//         }
//       } catch (error) {
//         console.error(
//           "Error fetching data:",
//           error.response?.data || error.message
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [userDataFromRedux, token]);

//   useEffect(() => {
//     const fetchIdeaData = async () => {
//       try {
//         console.log("Fetching idea for ID:", id);
//         const selectedIdea = bussinessIdeaArray.find((idea) => idea._id === id);
//         if (selectedIdea) {
//           console.log("Found idea in Redux:", selectedIdea);
//           dispatch(setSelectedBusinessIdea(selectedIdea));
//           setIdeaDetails(selectedIdea);
//           calculateRemainingFunding(
//             selectedIdea.fundingRaised,
//             selectedIdea.fundingNeeded
//           );
//         } else {
//           console.log("Idea not in Redux, fetching from API...");
//           await dispatch(fetchBusinessIdeaById(id)).unwrap();
//           const fetchedIdea =
//             bussinessIdeaArray.find((idea) => idea._id === id) ||
//             selectedBusinessIdea;
//           if (fetchedIdea) {
//             console.log("Fetched idea:", fetchedIdea);
//             setIdeaDetails(fetchedIdea);
//             calculateRemainingFunding(
//               fetchedIdea.fundingRaised,
//               fetchedIdea.fundingNeeded
//             );
//           } else {
//             console.error("No idea found for ID:", id);
//             setIdeaDetails({});
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching idea:", error);
//         setIdeaDetails({});
//       }
//     };

//     const fetchPriorEquity = async () => {
//       console.log("roles", userData.userData?.role);
//       console.log("id for user data", userData.userData?._id);
//       console.log("token", token);
//       console.log("id", id);

//       if (
//         userData.userData?.role === "investor" &&
//         userData.userData?._id &&
//         token &&
//         id
//       ) {
//         console.log("Fetching equity for investor");
//         console.log("equity details", data);

//         let totalEquity = 0;

//         for (const inv of data?.investments || []) {
//           console.log("is equal", inv.email === userInfo.email);

//           if (inv.email === userInfo.email) {
//             console.log("equity percentage", inv.equityPercentage);
//             totalEquity += inv.equityPercentage || 0;
//           }
//         }

//         console.log("totalEquity", totalEquity);

//         setPriorEquity(totalEquity);
//       }
//     };

//     fetchIdeaData();
//     fetchPriorEquity();

//     if (
//       userData.userData?.role === "investor" &&
//       userData.userData?._id &&
//       id
//     ) {
//       const checkVerificationStatus = async () => {
//         try {
//           const response = await axios.get(
//             `${API_URL}/verification/status/${userData.userData._id}/${id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           const verification = response.data.verification;
//           if (verification) {
//             setVerificationStatus(verification.status);
//             setVerificationId(verification._id);
//             if (
//               verification.status === "draft" ||
//               verification.status === "rejected"
//             ) {
//               setFormData((prev) => ({
//                 ...prev,
//                 fullName: verification.fullName || "",
//                 phone: verification.phone || "",
//                 investmentCapacity: verification.investmentCapacity || "",
//                 experience: verification.experience || "",
//               }));
//               if (
//                 verification.status === "rejected" &&
//                 verification.rejectionReason
//               ) {
//                 setSubmissionError(
//                   `Previous verification rejected: ${verification.rejectionReason}`
//                 );
//               }
//             }
//           } else {
//             setVerificationStatus("pending");
//           }
//         } catch (err) {
//           console.error(
//             "Error checking verification status:",
//             err.response?.data || err.message
//           );
//           setVerificationStatus("pending");
//         }
//       };

//       checkVerificationStatus();

//       const interval = setInterval(() => {
//         if (verificationStatus !== "approved") {
//           checkVerificationStatus();
//         }
//       }, 10000);

//       return () => clearInterval(interval);
//     }

//     if (userData.userData?._id) {
//       fetchDocumentAccessStatus();

//       if (
//         userData.userData?.role === "entrepreneur" &&
//         selectedBusinessIdea?.user?._id === userData.userData._id
//       ) {
//         fetchDocumentAccessRequests();
//       }
//     }

//     if (
//       userData.userData?.role === "entrepreneur" &&
//       selectedBusinessIdea?.user?._id === userData.userData._id
//     ) {
//       const fetchConversations = async () => {
//         try {
//           const response = await axios.get(
//             `${API_URL}/conversations/idea/${id}`,
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//           setConversations(response.data);
//           const unread = response.data.reduce((count, conv) => {
//             return (
//               count +
//               messages.filter(
//                 (msg) =>
//                   msg.conversationId === conv._id &&
//                   !msg.read &&
//                   msg.recipient === userData.userData._id
//               ).length
//             );
//           }, 0);
//           setUnreadCount(unread);
//         } catch (err) {
//           console.error(
//             "Error fetching conversations:",
//             err.response?.data || err.message
//           );
//         }
//       };
//       fetchConversations();
//     } else if (
//       userData.userData?.role === "investor" &&
//       verificationStatus === "approved"
//     ) {
//       const fetchInvestorConversation = async () => {
//         try {
//           const response = await axios.get(
//             `${API_URL}/conversations/idea/${id}/investor/${userData.userData._id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           const conv = response.data[0];
//           if (conv) {
//             setConversations([conv]);
//             setSelectedConversationId(conv._id);
//             setShowChat(true);
//           }
//         } catch (err) {
//           console.error(
//             "Error fetching investor conversation:",
//             err.response?.data || err.message
//           );
//         }
//       };
//       fetchInvestorConversation();
//     }
//   }, [
//     dispatch,
//     id,
//     bussinessIdea,
//     selectedBusinessIdea,
//     userData,
//     messages,
//     verificationStatus,
//     token,
//     socket,
//   ]);

//   const projectId = ideaDetails?._id;

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   console.log("ideaDetails idea id", projectId);

//   console.log("userInfo", userInfo);

//   useEffect(() => {
//     console.log("useEffect called");

//     const fetchInvestmentDetails = async () => {
//       console.log("fetchInvestmentDetails called");
//       try {
//         const response = await axios.get(
//           `https://ethio-capital-backend-123.onrender.com/api/v1/investments-details/${projectId}`
//         );
//         console.log("investment details", response.data);
//         setData(response.data);
//       } catch (err) {
//         setError("Failed to fetch investment details.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (projectId) {
//       fetchInvestmentDetails();
//       console.log("fetchInvestmentDetails for if loop called");
//     }
//   }, [projectId]);
//   const calculateRemainingFunding = (fundingRaised, fundingNeeded) => {
//     const raisedNum = Number(fundingRaised) || 0;
//     const neededNum = Number(fundingNeeded) || 1;
//     setRemainingFunding(neededNum - raisedNum);
//   };

//   const calculateValuation = () => {
//     if (!ideaDetails.investorEquity || !ideaDetails.fundingNeeded)
//       return "Not specified";
//     const fundingNeededNum = Number(ideaDetails.fundingNeeded) || 0;
//     const equityOfferedNum = Number(ideaDetails.investorEquity) / 100;
//     return equityOfferedNum > 0
//       ? (fundingNeededNum / equityOfferedNum).toLocaleString("en-US", {
//           style: "currency",
//           currency: "ETB",
//           minimumFractionDigits: 0,
//         })
//       : "Not specified";
//   };

//   const fetchDocumentAccessRequests = async () => {
//     if (!userData.userData?._id || !token || !id) {
//       console.log("Missing data for fetching requests:", {
//         userId: userData.userData._id,
//         token: !!token,
//         ideaId: id,
//       });
//       return;
//     }

//     setIsRequestsLoading(true);
//     try {
//       const response = await axios.get(
//         `${API_URL}/document-access/requests/idea/${id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const requests = response.data.requests || response.data || [];
//       setDocumentAccessRequests(Array.isArray(requests) ? requests : []);
//     } catch (error) {
//       console.error(
//         "Error fetching document access requests:",
//         error.response?.data || error.message
//       );
//       setDocumentAccessRequests([]);
//     } finally {
//       setIsRequestsLoading(false);
//     }
//   };

//   const handleAccessRequestAction = async (requestId, action) => {
//     if (!token) {
//       alert("Authentication required. Please log in.");
//       return;
//     }

//     setRequestActionLoading((prev) => ({ ...prev, [requestId]: true }));
//     try {
//       await axios.post(
//         `${API_URL}/document-access/action`,
//         { requestId, action },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setDocumentAccessRequests((prev) =>
//         prev.filter((req) => req._id !== requestId)
//       );
//       alert(
//         `Request ${action === "approve" ? "approved" : "denied"} successfully!`
//       );
//       await fetchDocumentAccessRequests();
//     } catch (error) {
//       console.error(
//         `Error ${action}ing request:`,
//         error.response?.data || error.message
//       );
//       alert(
//         `Failed to ${action} request: ${
//           error.response?.data?.message || "Please try again."
//         }`
//       );
//     } finally {
//       setRequestActionLoading((prev) => ({ ...prev, [requestId]: false }));
//     }
//   };
//   const fetchDocumentAccessStatus = async () => {
//     if (!userData.userData?._id || !token || !id) {
//       console.warn("Missing data for fetchDocumentAccessStatus:", {
//         userId: userData.userData?._id,
//         token: !!token,
//         ideaId: id,
//       });
//       setHasDocumentAccess(userData.userData._id === ideaDetails.user?._id);
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `${API_URL}/document-access/status/${id}/${userData.userData._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("Document access status response:", {
//         responseData: response.data,
//         userId: userData.userData._id,
//         ideaUserId: ideaDetails.user?._id,
//         isEntrepreneur: userData.userData._id === ideaDetails.user?._id,
//         hasAccess: response.data.hasAccess,
//         finalHasDocumentAccess:
//           response.data.hasAccess ||
//           userData.userData._id === ideaDetails.user?._id,
//       });
//       setHasDocumentAccess(
//         response.data.hasAccess ||
//           userData.userData._id === ideaDetails.user?._id
//       );
//     } catch (error) {
//       console.error("Error fetching document access status:", {
//         error: error.response?.data || error.message,
//         userId: userData.userData._id,
//         ideaUserId: ideaDetails.user?._id,
//         isEntrepreneur: userData.userData._id === ideaDetails.user?._id,
//       });
//       setHasDocumentAccess(userData.userData._id === ideaDetails.user?._id);
//     }
//   };
  
//   const requestDocumentAccess = async () => {
//     setRequestLoading(true);
//     try {
//       await axios.post(
//         `${API_URL}/document-access/request`,
//         { ideaId: id, requesterId: userData.userData._id },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert("Access request sent to the entrepreneur!");
//     } catch (error) {
//       console.error("Error requesting document access:", error);
//       alert("Failed to send request. Please try again.");
//     } finally {
//       setRequestLoading(false);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       if (stream) stopCamera();
//       const constraints = { video: { facingMode: cameraFacingMode } };
//       const mediaStream = await navigator.mediaDevices.getUserMedia(
//         constraints
//       );
//       setStream(mediaStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//         videoRef.current.play();
//         setStreamActive(true);
//       }
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       alert(
//         "Error accessing camera. Please ensure camera permissions are granted."
//       );
//     }
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//       setStream(null);
//     }
//     setStreamActive(false);
//   };

//   const captureImage = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const context = canvas.getContext("2d");
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const imageDataUrl = canvas.toDataURL("image/png");
//       setCapturedImage(imageDataUrl);
//       setShowPreview(true);

//       canvas.toBlob((blob) => {
//         const imageFile = new File([blob], "profile-picture.png", {
//           type: "image/png",
//         });
//         setFormData((prev) => ({ ...prev, profilePicture: imageFile }));
//       }, "image/png");
//     }
//   };

//   const approveImage = () => {
//     setShowPreview(false);
//     setShowCamera(false);
//     stopCamera();
//   };

//   const retakeImage = () => {
//     setCapturedImage(null);
//     setShowPreview(false);
//   };

//   const toggleCameraFacing = () => {
//     setCameraFacingMode((prev) => (prev === "user" ? "environment" : "user"));
//   };

//   const handleInvestNow = async () => {
//     console.log('[StartupDetail] handleInvestNow called', {
//       userId: userData.userData?._id,
//       ideaId: ideaDetails?._id || selectedBusinessIdea?._id,
//       userRole,
//     });
  
//     if (!userData.userData?._id) {
//       console.error('[StartupDetail] No user ID');
//       alert('Please log in to proceed.');
//       navigate('/login');
//       return;
//     }
  
//     if (!ideaDetails?._id && !selectedBusinessIdea?._id) {
//       console.error('[StartupDetail] No idea ID');
//       alert('No startup selected.');
//       return;
//     }
  
//     const ideaToPass = ideaDetails._id ? ideaDetails : selectedBusinessIdea;
//     if (!ideaToPass?._id) {
//       console.error('[StartupDetail] Invalid idea data');
//       alert('Startup data not available.');
//       return;
//     }
  
//     if (!token) {
//       console.error('[StartupDetail] No auth token');
//       alert('Authentication token missing. Please log in.');
//       navigate('/login');
//       return;
//     }
  
//     const fundingRaised = Number(data?.fundingRaised || 0);
//     const fundingNeeded = Number(data?.fundingNeeded || 0);
//     const isFundingComplete = fundingRaised >= fundingNeeded;
  
//     if (isFundingComplete) {
//       // For fully funded ideas, check equity for investors before navigating to BoardDashboard
//       if (userRole === 'investor') {
//         console.log('[StartupDetail] Checking investor equity', { priorEquity });
//         if (priorEquity <= 0) {
//           console.log('[StartupDetail] Investor has no equity');
//           alert('You cannot access the board because you have not purchased any shares.');
//           return;
//         }
//       }
  
//       // Proceed to BoardDashboard for investors with equity or entrepreneurs
//       try {
//         console.log('[StartupDetail] Attempting to join board', {
//           businessIdeaId: ideaToPass._id,
//           userId: userData.userData._id,
//           userRole,
//         });
  
//         // Call /board/join to ensure user is added to the board
//         let boardId = null;
//         try {
//           const response = await axios.post(
//             `${API_URL}/board/join`,
//             {
//               businessIdeaId: ideaToPass._id,
//               userId: userData.userData._id,
//               role: userRole, // Pass user role to backend
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
//           console.log('[StartupDetail] Join board success', response.data);
//           boardId = response.data.boardId;
//         } catch (joinError) {
//           console.warn('[StartupDetail] Join board failed, proceeding anyway', {
//             status: joinError.response?.status,
//             message: joinError.response?.data?.message,
//           });
//           // Continue to dashboard even if join fails, as board may already exist
//         }
  
//         // Navigate to BoardDashboard with role-specific data
//         navigate('/boardDashboard', {
//           state: {
//             startupId: ideaToPass._id,
//             userId: userData.userData._id,
//             boardId,
//             startupData: {
//               title: ideaToPass.title,
//               fundingRaised: ideaToPass.fundingRaised,
//               fundingNeeded: ideaToPass.fundingNeeded,
//             },
//             isFullyFunded: true,
//             isEntrepreneur: userRole === 'entrepreneur', // Pass entrepreneur flag
//             userRole, // Pass user role for further customization
//           },
//         });
//       } catch (error) {
//         console.error('[StartupDetail] Error navigating to board', {
//           status: error.response?.status,
//           message: error.response?.data?.message,
//           error: error.message,
//         });
//         alert(
//           error.response?.data?.message ||
//             'Failed to access the board. Please try again or contact support.'
//         );
//       }
//     } else {
//       // For non-fully funded ideas, navigate to PaymentForm (investors only)
//       if (userRole === 'investor') {
//         if (verificationStatus !== 'approved') {
//           console.log('[StartupDetail] Investor not verified', { verificationStatus });
//           setShowVerificationForm(true);
//           return;
//         }
//         console.log('[StartupDetail] Redirecting to PaymentForm');
//         navigate('/PaymentForm', {
//           state: {
//             selectedIdea: ideaToPass,
//             userId: userData.userData._id,
//             userEmail: userInfo.email,
//             userRole,
//           },
//         });
//       } else if (userRole === 'entrepreneur') {
//         console.log('[StartupDetail] Entrepreneur cannot invest in own idea');
//         alert('As the entrepreneur, you cannot invest in your own idea.');
//       } else {
//         console.error('[StartupDetail] Unknown user role');
//         alert('Unable to proceed. Please log in as an investor or entrepreneur.');
//       }
//     }
//   };
  
//   const handleInterestSubmit = () => {
//     setIsInterested(true);
//     setInterestCount((prev) => prev + 1);
//   };

//   const handleSaveIdea = () => setIsSaved((prev) => !prev);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files } = e.target;
//     if (files.length > 0) {
//       setFormData((prev) => ({ ...prev, [name]: files[0] }));
//     }
//   };

//   const handleOpenCamera = () => {
//     setCameraMode("profile");
//     setShowCamera(true);
//     setShowPreview(false);
//     setCapturedImage(null);
//   };

//   const handleVerificationSubmit = async (e) => {
//     e.preventDefault();
//     setSubmissionLoading(true);
//     setSubmissionError("");

//     if (!formData.idPicture || !formData.profilePicture) {
//       setSubmissionError("Please upload both ID and profile pictures.");
//       setSubmissionLoading(false);
//       return;
//     }

//     const submitData = new FormData();
//     submitData.append("ideaId", id);
//     submitData.append("fullName", formData.fullName);
//     submitData.append("phone", formData.phone);
//     submitData.append("investmentCapacity", formData.investmentCapacity);
//     submitData.append("experience", formData.experience);
//     submitData.append("idPicture", formData.idPicture);
//     submitData.append("profilePicture", formData.profilePicture);

//     try {
//       const token = localStorage.getItem("authToken");
//       let response;
//       if (verificationId && verificationStatus === "draft") {
//         response = await axios.put(
//           `${API_URL}/verification/${verificationId}/submit`,
//           submitData,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//       } else {
//         response = await axios.post(`${API_URL}/verification`, submitData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         });
//         if (response.data._id) {
//           await axios.put(
//             `${API_URL}/verification/${response.data._id}/submit`,
//             {},
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
//         }
//       }

//       setVerificationStatus("submitted");
//       setVerificationId(response.data._id);
//       setShowVerificationForm(false);
//       alert("Verification submitted successfully. Awaiting admin approval.");
//     } catch (error) {
//       console.error("Submission error:", error);
//       const errorMessage =
//         error.response?.data?.message || "An error occurred. Please try again.";
//       setSubmissionError(errorMessage);
//     } finally {
//       setSubmissionLoading(false);
//     }
//   };

//   const startConversation = async (e, otherUserId, currentUserId, ideaId) => {
//     e.preventDefault();
//     if (
//       userData.userData?.role === "investor" &&
//       verificationStatus !== "approved"
//     ) {
//       setShowVerificationForm(true);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/conversation`,
//         { participants: [currentUserId, otherUserId], ideaId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const newConv = response.data;
//       setConversations((prev) => [...prev, newConv]);
//       setSelectedConversationId(newConv._id);
//       setShowChat(true);
//     } catch (error) {
//       console.error(
//         "Error starting conversation:",
//         error.response?.data || error.message
//       );
//       alert("Failed to start conversation. Please try again.");
//     }
//   };
//   const calculateProgress = (raised, target) => {
//     const raisedNum = Number(raised) || 0;
//     const targetNum = Number(target) || 1;
//     const percentage = targetNum > 0 ? (raisedNum / targetNum) * 100 : 0;
//     console.log('[calculateProgress]', {
//       raisedNum,
//       targetNum,
//       percentage,
//       capped: Math.min(percentage, 100),
//     });
//     return Math.min(percentage, 100);
//   };

//   const isEntrepreneur =
//     userData.userData?.role === "entrepreneur" &&
//     ideaDetails?.user?._id === userData.userData._id;

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
//         aria-label="Go back"
//       >
//         <svg
//           className="w-5 h-5 text-gray-700"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M15 19l-7-7 7-7"
//           />
//         </svg>
//       </button>

//       {/* Camera Modal */}
//       {showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
//           <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900">
//                 Capture Profile Picture
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowCamera(false);
//                   setShowPreview(false);
//                   stopCamera();
//                 }}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//                 aria-label="Close camera"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             {!showPreview ? (
//               <div className="relative mb-6 rounded-xl overflow-hidden">
//                 <video
//                   ref={videoRef}
//                   className="w-full h-auto"
//                   autoPlay
//                   playsInline
//                 />
//                 <canvas ref={canvasRef} className="hidden" />
//                 <button
//                   onClick={toggleCameraFacing}
//                   className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
//                   aria-label="Switch camera"
//                 >
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ) : (
//               <div className="mb-6">
//                 <img
//                   src={capturedImage}
//                   alt="Captured preview"
//                   className="w-full h-auto rounded-xl"
//                 />
//               </div>
//             )}

//             <div className="flex justify-center gap-4">
//               {!showPreview ? (
//                 <button
//                   onClick={captureImage}
//                   className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
//                   aria-label="Capture image"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
//                     />
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
//                     />
//                   </svg>
//                 </button>
//               ) : (
//                 <>
//                   <button
//                     onClick={retakeImage}
//                     className="px-6 py-3 bg-gray-600 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all"
//                   >
//                     Retake
//                   </button>
//                   <button
//                     onClick={approveImage}
//                     className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all"
//                   >
//                     Use Photo
//                   </button>
//                 </>
//               )}
//             </div>
//             <p className="text-center mt-4 text-sm text-gray-600">
//               Ensure your face is clearly visible in good lighting.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Verification Form Modal */}
//       {showVerificationForm && !showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[90] p-4">
//           <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-semibold text-gray-900">
//                 Investor Verification
//               </h2>
//               <button
//                 onClick={() => setShowVerificationForm(false)}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//                 aria-label="Close verification form"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <p className="mb-6 text-gray-600">
//               Please complete the form to verify your investor status.
//             </p>
//             {submissionError && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
//                 {submissionError}
//               </div>
//             )}

//             <div className="space-y-6">
//               <div>
//                 <label
//                   htmlFor="fullName"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   id="fullName"
//                   type="text"
//                   name="fullName"
//                   value={formData.fullName}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="phone"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="investmentCapacity"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Investment Capacity
//                 </label>
//                 <select
//                   id="investmentCapacity"
//                   name="investmentCapacity"
//                   value={formData.investmentCapacity}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                   aria-required="true"
//                 >
//                   <option value="">Select capacity</option>
//                   <option value="$10k-$50k">$10,000 - $50,000</option>
//                   <option value="$50k-$100k">$50,000 - $100,000</option>
//                   <option value="$100k-$500k">$100,000 - $500,000</option>
//                   <option value="$500k+">$500,000+</option>
//                 </select>
//               </div>
//               <div>
//                 <label
//                   htmlFor="experience"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Investment Experience
//                 </label>
//                 <textarea
//                   id="experience"
//                   name="experience"
//                   value={formData.experience}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows="4"
//                   required
//                   aria-required="true"
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="idPicture"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   ID/Passport Photo
//                 </label>
//                 <input
//                   id="idPicture"
//                   type="file"
//                   name="idPicture"
//                   onChange={handleFileChange}
//                   className="w-full p-3 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                   accept="image/*"
//                   required
//                   aria-required="true"
//                 />
//                 {formData.idPicture && (
//                   <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     ID photo uploaded successfully
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Profile Picture
//                 </label>
//                 <button
//                   type="button"
//                   onClick={handleOpenCamera}
//                   className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
//                 >
//                   Take Picture
//                 </button>
//                 {formData.profilePicture && (
//                   <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     Profile picture captured
//                   </div>
//                 )}
//               </div>
//               <button
//                 type="submit"
//                 disabled={submissionLoading}
//                 className={`w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
//                   submissionLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//                 onClick={handleVerificationSubmit}
//               >
//                 {submissionLoading ? (
//                   <svg
//                     className="animate-spin h-5 w-5 mx-auto text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                 ) : (
//                   "Submit for Verification"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Document Access Requests Button (Entrepreneur Only) */}
//       {isEntrepreneur && (
//         <div className="fixed top-4 right-4 z-50">
//           <button
//             onClick={() => {
//               setShowAccessRequests(!showAccessRequests);
//               if (!showAccessRequests) {
//                 fetchDocumentAccessRequests();
//               }
//             }}
//             className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//             Access Requests
//             {documentAccessRequests.filter((req) => req.status === "pending")
//               .length > 0 && (
//               <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                 {
//                   documentAccessRequests.filter(
//                     (req) => req.status === "pending"
//                   ).length
//                 }
//               </span>
//             )}
//           </button>
//         </div>
//       )}

//       {/* Document Access Requests Modal */}
//       {showAccessRequests && isEntrepreneur && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[80] p-4">
//           <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
//             <div className="p-6 border-b border-gray-200">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-semibold text-gray-900">
//                   Document Access Requests
//                 </h2>
//                 <button
//                   onClick={() => setShowAccessRequests(false)}
//                   className="text-gray-500 hover:text-gray-700 transition-colors"
//                   aria-label="Close access requests"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <div className="flex items-center gap-3 mt-4">
//                 <button
//                   onClick={fetchDocumentAccessRequests}
//                   disabled={isRequestsLoading}
//                   className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
//                     isRequestsLoading ? "opacity-50 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   <svg
//                     className={`w-5 h-5 ${
//                       isRequestsLoading ? "animate-spin" : ""
//                     }`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                     />
//                   </svg>
//                   Refresh
//                 </button>
//               </div>
//             </div>

//             <div className="p-6">
//               {isRequestsLoading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <svg
//                     className="animate-spin h-8 w-8 text-blue-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                 </div>
//               ) : documentAccessRequests.length === 0 ? (
//                 <div className="text-center py-12">
//                   <svg
//                     className="w-16 h-16 text-gray-300 mx-auto mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                   <p className="text-gray-500 text-lg">
//                     No document access requests available
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {documentAccessRequests.map((request) => (
//                     <div
//                       key={request._id}
//                       className={`p-4 rounded-xl border ${
//                         request.status === "pending"
//                           ? "border-yellow-200 bg-yellow-50"
//                           : request.status === "approved"
//                           ? "border-green-200 bg-green-50"
//                           : "border-red-200 bg-red-50"
//                       }`}
//                     >
//                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                         <div className="flex-1">
//                           <div className="flex items-center gap-3">
//                             <span className="font-medium text-gray-800">
//                               {request.requesterName ||
//                                 `Investor #${request.requesterId.slice(-6)}`}
//                             </span>
//                             <span
//                               className={`text-xs px-3 py-1 rounded-full font-medium ${
//                                 request.status === "pending"
//                                   ? "bg-yellow-200 text-yellow-800"
//                                   : request.status === "approved"
//                                   ? "bg-green-200 text-green-800"
//                                   : "bg-red-200 text-red-800"
//                               }`}
//                             >
//                               {request.status.charAt(0).toUpperCase() +
//                                 request.status.slice(1)}
//                             </span>
//                           </div>
//                           <p className="text-sm text-gray-600 mt-1">
//                             Requested on:{" "}
//                             {new Date(request.createdAt).toLocaleString()}
//                           </p>
//                         </div>

//                         {request.status === "pending" && (
//                           <div className="flex gap-3">
//                             <button
//                               onClick={() =>
//                                 handleAccessRequestAction(
//                                   request._id,
//                                   "approve"
//                                 )
//                               }
//                               disabled={requestActionLoading[request._id]}
//                               className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all ${
//                                 requestActionLoading[request._id]
//                                   ? "opacity-50 cursor-not-allowed"
//                                   : ""
//                               }`}
//                             >
//                               {requestActionLoading[request._id] ? (
//                                 <svg
//                                   className="animate-spin h-4 w-4 text-white"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                   ></circle>
//                                   <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                   ></path>
//                                 </svg>
//                               ) : (
//                                 <svg
//                                   className="w-4 h-4"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M5 13l4 4L19 7"
//                                   />
//                                 </svg>
//                               )}
//                               Approve
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleAccessRequestAction(request._id, "deny")
//                               }
//                               disabled={requestActionLoading[request._id]}
//                               className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all ${
//                                 requestActionLoading[request._id]
//                                   ? "opacity-50 cursor-not-allowed"
//                                   : ""
//                               }`}
//                             >
//                               {requestActionLoading[request._id] ? (
//                                 <svg
//                                   className="animate-spin h-4 w-4 text-white"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   fill="none"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <circle
//                                     className="opacity-25"
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                     stroke="currentColor"
//                                     strokeWidth="4"
//                                   ></circle>
//                                   <path
//                                     className="opacity-75"
//                                     fill="currentColor"
//                                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                   ></path>
//                                 </svg>
//                               ) : (
//                                 <svg
//                                   className="w-4 h-4"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M6 18L18 6M6 6l12 12"
//                                   />
//                                 </svg>
//                               )}
//                               Deny
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Chat Panel */}
//       <div className="fixed bottom-6 right-6 z-[70]">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
//           <div
//             className={`p-4 rounded-t-2xl cursor-pointer flex justify-between items-center ${
//               userData.userData?.role === "investor" &&
//               verificationStatus !== "approved"
//                 ? "bg-gray-600 text-white"
//                 : "bg-blue-600 text-white"
//             }`}
//             onClick={() => {
//               if (
//                 userData.userData?.role === "entrepreneur" ||
//                 verificationStatus === "approved"
//               ) {
//                 setShowChat(!showChat);
//               } else if (userData.userData?.role === "investor") {
//                 if (
//                   verificationStatus === "pending" ||
//                   verificationStatus === "rejected"
//                 ) {
//                   setShowVerificationForm(true);
//                 } else if (verificationStatus === "submitted") {
//                   alert("Verification pending. Please wait for approval.");
//                 }
//               }
//             }}
//             aria-expanded={showChat}
//             aria-controls="chat-panel"
//           >
//             <div className="flex items-center gap-3">
//               <img
//                 src={
//                   ideaDetails?.entrepreneurImage ||
//                   "https://via.placeholder.com/32"
//                 }
//                 alt={ideaDetails?.entrepreneurName || "Entrepreneur"}
//                 className="w-10 h-10 rounded-full object-cover"
//               />
//               <span className="font-medium">
//                 {userData.userData?.role === "entrepreneur" &&
//                 ideaDetails?.user?._id === userData.userData._id
//                   ? "Your Idea Chats"
//                   : `Chat with ${
//                       ideaDetails?.user?.fullName || "Entrepreneur"
//                     }`}
//               </span>
//             </div>
//             <div className="flex items-center gap-3">
//               {userData.userData?.role === "investor" &&
//                 verificationStatus === "approved" &&
//                 !showChat &&
//                 unreadCount > 0 && (
//                   <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
//                     {unreadCount}
//                   </span>
//                 )}
//               <svg
//                 className={`w-5 h-5 transition-transform ${
//                   showChat ? "rotate-180" : ""
//                 }`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>

//           {userData.userData?.role === "investor" &&
//             verificationStatus !== "approved" &&
//             !showChat && (
//               <div className="p-4 border-t border-gray-200 bg-gray-50">
//                 {verificationStatus === "pending" && (
//                   <>
//                     <p className="font-medium text-gray-700 mb-3">
//                       Verification Required
//                     </p>
//                     <button
//                       onClick={() => setShowVerificationForm(true)}
//                       className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
//                     >
//                       Verify Now
//                     </button>
//                   </>
//                 )}
//                 {verificationStatus === "submitted" && (
//                   <p className="font-medium text-gray-700">
//                     Verification In Progress
//                   </p>
//                 )}
//                 {verificationStatus === "rejected" && (
//                   <>
//                     <p className="font-medium text-red-700 mb-3">
//                       Verification Rejected
//                     </p>
//                     <button
//                       onClick={() => setShowVerificationForm(true)}
//                       className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
//                     >
//                       Update Information
//                     </button>
//                   </>
//                 )}
//               </div>
//             )}

//           {showChat && (
//             <div
//               id="chat-panel"
//               className="p-4 max-h-96 overflow-y-auto bg-gray-50"
//             >
//               {userData.userData?.role === "entrepreneur" &&
//               ideaDetails?.user?._id === userData.userData._id ? (
//                 conversations.length === 0 ? (
//                   <p className="text-gray-500 text-center py-6">No chats yet</p>
//                 ) : (
//                   conversations.map((conv) => {
//                     const investor = conv.participants.find(
//                       (p) => p !== userData.userData._id
//                     );
//                     const unreadForConv = messages.filter(
//                       (msg) =>
//                         msg.conversationId === conv._id &&
//                         !msg.read &&
//                         msg.recipient === userData.userData._id
//                     ).length;
//                     return (
//                       <div
//                         key={conv._id}
//                         onClick={() => setSelectedConversationId(conv._id)}
//                         className={`p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all ${
//                           selectedConversationId === conv._id
//                             ? "bg-blue-100"
//                             : ""
//                         }`}
//                       >
//                         <div className="flex items-center justify-between">
//                           <p className="font-semibold text-gray-800">
//                             Investor #
//                             {typeof investor === "string"
//                               ? investor.slice(-6)
//                               : investor?._id.slice(-6)}
//                           </p>
//                           {unreadForConv > 0 && (
//                             <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
//                               {unreadForConv}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 truncate mt-1">
//                           {conv.lastMessage?.text || "No messages yet"}
//                         </p>
//                       </div>
//                     );
//                   })
//                 )
//               ) : !selectedConversationId ? (
//                 <button
//                   onClick={(e) =>
//                     startConversation(
//                       e,
//                       ideaDetails?.user?._id,
//                       userData.userData._id,
//                       ideaDetails._id
//                     )
//                   }
//                   className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
//                 >
//                   Start Chat
//                 </button>
//               ) : (
//                 <Message
//                   conversationId={selectedConversationId}
//                   userId={userData.userData._id}
//                   ideaId={ideaDetails._id}
//                 />
//               )}
//               {selectedConversationId &&
//                 userData.userData?.role === "entrepreneur" && (
//                   <Message
//                     conversationId={selectedConversationId}
//                     userId={userData.userData._id}
//                     ideaId={ideaDetails._id}
//                   />
//                 )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Header Section */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
//             <img
//               src={
//                 ideaDetails?.entrepreneurImage ||
//                 "https://via.placeholder.com/128"
//               }
//               alt={ideaDetails?.entrepreneurName || "Entrepreneur"}
//               className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100"
//             />
//             <div className="text-center md:text-left">
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
//                 {ideaDetails.title || "Startup Idea"}
//               </h1>
//               <p className="text-lg md:text-xl text-gray-600 mt-2">
//                 by {ideaDetails?.user?.fullName || "Entrepreneur"}
//               </p>
//               <p className="text-base text-gray-500 mt-1">
//                 {ideaDetails.entrepreneurLocation || "Not specified"}
//               </p>
//               <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
//                 <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
//                   {ideaDetails.currentStage || "Not specified"}
//                 </span>
//                 <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
//                   Seeking {ideaDetails.fundingNeeded || "Not specified"}
//                 </span>
//                 <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
//                   {ideaDetails.businessCategory || "Not specified"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content Area */}
//           <div className="lg:col-span-2 space-y-8">
//             <section className="bg-white p-6 rounded-2xl shadow-md">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Overview
//               </h2>
//               <p className="text-gray-600 leading-relaxed">
//                 {ideaDetails.overview || "No overview provided."}
//               </p>
//             </section>

//             <section className="bg-white p-6 rounded-2xl shadow-md">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Entrepreneur Background
//               </h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="font-medium text-gray-700">Education</h3>
//                   <p className="text-gray-600 mt-1">
//                     {ideaDetails.entrepreneurEducation || "Not specified"}
//                   </p>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-gray-700">Experience</h3>
//                   <p className="text-gray-600 mt-1">
//                     {ideaDetails.entrepreneurBackground || "Not specified"}
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="bg-white p-6 rounded-2xl shadow-md">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Problem Statement
//               </h2>
//               <p className="text-gray-600 mb-6 leading-relaxed">
//                 {ideaDetails.problemStatement || "Not specified"}
//               </p>
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Solution
//               </h2>
//               <p className="text-gray-600 leading-relaxed">
//                 {ideaDetails.solution || "Not specified"}
//               </p>
//             </section>

//             <section className="bg-white p-6 rounded-2xl shadow-md">
//   <h2 className="text-2xl font-semibold text-gray-900 mb-6">
//     Funding Progress
//   </h2>
//   <div className="flex flex-col md:flex-row items-center gap-8">
//     <div className="relative w-48 h-48">
//       <svg className="w-full h-full" viewBox="0 0 100 100">
//         <circle
//           cx="50"
//           cy="50"
//           r="45"
//           fill="none"
//           stroke="#e5e7eb"
//           strokeWidth="10"
//         />
//         <circle
//           cx="50"
//           cy="50"
//           r="45"
//           fill="none"
//           stroke="#3b82f6"
//           strokeWidth="10"
//           strokeLinecap="round"
//           strokeDasharray={`${calculateProgress(
//             data?.fundingRaised,
//             data?.fundingNeeded
//           )} 283`}
//           transform="rotate(-90 50 50)"
//         />
//         <text
//           x="50"
//           y="50"
//           textAnchor="middle"
//           fontSize="12"
//           fill="#374151"
//           dy=".3em"
//         >
//           {Math.round(
//             calculateProgress(data?.fundingRaised, data?.fundingNeeded)
//           )}
//           %
//         </text>
//       </svg>
//     </div>
//     <div className="space-y-4">
//       <div>
//         <p className="text-sm text-gray-500">Raised</p>
//         <p className="text-lg font-semibold text-gray-900">
//           {Number(data?.fundingRaised || 0).toLocaleString("en-US", {
//             style: "currency",
//             currency: "ETB",
//             minimumFractionDigits: 0,
//           })}
//         </p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-500">Goal</p>
//         <p className="text-lg font-semibold text-gray-900">
//           {Number(data?.fundingNeeded || 0).toLocaleString("en-US", {
//             style: "currency",
//             currency: "ETB",
//             minimumFractionDigits: 0,
//           })}
//         </p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-500">Remaining</p>
//         <p className="text-lg font-semibold text-gray-900">
//           {Number(data?.remainingFunding || 0).toLocaleString("en-US", {
//             style: "currency",
//             currency: "ETB",
//             minimumFractionDigits: 0,
//           })}
//         </p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-500">Your Equity</p>
//         <p className="text-lg font-semibold text-gray-900">
//           {userData.userData?.role === "investor"
//             ? `${(priorEquity * 100).toFixed(2)}%`
//             : "N/A"}
//         </p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-500">Valuation</p>
//         <p className="text-lg font-semibold text-gray-900">
//           {calculateValuation()}
//         </p>
//       </div>
//       <div>
//         <p className="text-sm text-gray-500">Investment Timeline</p>
//         <p className="text-lg font-semibold text-gray-900">
//           {ideaDetails.investmentTimeline || "Not specified"}
//         </p>
//       </div>
//     </div>
//   </div>
//   {remainingFunding < 3000 && remainingFunding > 0 && (
//     <p className="mt-4 text-sm text-orange-600">
//       Only {remainingFunding.toLocaleString()} ETB remains. You can
//       invest this exact amount to close the funding.
//     </p>
//   )}
// </section>



// <section className="bg-white p-6 rounded-2xl shadow-md">
//   <h2 className="text-2xl font-semibold text-gray-900 mb-6">Documents</h2>
//   {documentError && <p className="text-red-600 mb-4">{documentError}</p>}
//   {userData.userData?._id ? (
//     hasDocumentAccess || isEntrepreneur ? (
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {/* Debug log */}
//         {console.log('ideaDetails:', JSON.stringify(ideaDetails, null, 2))}
//         {ideaDetails?.documents ? (
//           [
//             {
//               name: "Business Registration",
//               path: ideaDetails.documents.businessRegistration,
//             },
//             {
//               name: "Financial Projections",
//               path: ideaDetails.documents.financialProjections,
//             },
//             {
//               name: "Market Research Report",
//               path: ideaDetails.documents.marketResearchReport,
//             },
//             {
//               name: "Patent Documentation",
//               path: ideaDetails.documents.patentDocumentation,
//             },
//             { name: "Pitch Deck", path: ideaDetails.documents.pitchDeck },
//             {
//               name: "Team Certifications",
//               path: ideaDetails.documents.teamCertifications,
//             },
//           ]
//             .filter((doc) => {
//               console.log(`Document ${doc.name}:`, doc.path);
//               return doc.path && typeof doc.path === "string" && doc.path.trim() !== "";
//             })
//             .length > 0 ? (
//             [
//               {
//                 name: "Business Registration",
//                 path: ideaDetails.documents.businessRegistration,
//               },
//               {
//                 name: "Financial Projections",
//                 path: ideaDetails.documents.financialProjections,
//               },
//               {
//                 name: "Market Research Report",
//                 path: ideaDetails.documents.marketResearchReport,
//               },
//               {
//                 name: "Patent Documentation",
//                 path: ideaDetails.documents.patentDocumentation,
//               },
//               { name: "Pitch Deck", path: ideaDetails.documents.pitchDeck },
//               {
//                 name: "Team Certifications",
//                 path: ideaDetails.documents.teamCertifications,
//               },
//             ]
//               .filter(
//                 (doc) =>
//                   doc.path &&
//                   typeof doc.path === "string" &&
//                   doc.path.trim() !== ""
//               )
//               .map((doc, index) => {
//                 if (!doc.path.toLowerCase().endsWith(".pdf")) {
//                   return (
//                     <div
//                       key={index}
//                       className="p-4 border border-gray-200 rounded-xl"
//                     >
//                       <p className="text-red-600">
//                         Only PDF documents are supported for {doc.name}
//                       </p>
//                     </div>
//                   );
//                 }

//                 const handleDocumentClick = async () => {
//                   const fullUrl = `${STATIC_URL}/${doc.path}`;
//                   console.log("Attempting to access document:", fullUrl);
//                   try {
//                     // Verify document exists
//                     const response = await axios.head(fullUrl, {
//                       headers: { Accept: "application/pdf" },
//                     });
//                     console.log(
//                       "HEAD response:",
//                       response.status,
//                       response.headers
//                     );
//                     if (response.status === 200) {
//                       const encodedPath = encodeURIComponent(doc.path);
//                       console.log(
//                         "Opening document viewer at:",
//                         `/view-document/${encodedPath}`
//                       );
//                       window.open(`/view-document/${encodedPath}`, "_blank");
//                     } else {
//                       setDocumentError(
//                         `Document "${doc.name}" not found. Please contact support.`
//                       );
//                     }
//                   } catch (error) {
//                     console.error(
//                       "Error checking document:",
//                       error.response?.status,
//                       error.message
//                     );
//                     setDocumentError(
//                       `Error accessing "${doc.name}": ${error.message}`
//                     );
//                   }
//                 };

//                 return (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
//                   >
//                     <div className="flex items-center gap-4">
//                       <svg
//                         className="w-6 h-6 text-gray-500"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
//                         />
//                       </svg>
//                       <div>
//                         <h3 className="font-medium text-gray-800">{doc.name}</h3>
//                         <p className="text-sm text-gray-500">Available</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={handleDocumentClick}
//                       className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
//                     >
//                       View
//                     </button>
//                   </div>
//                 );
//               })
//           ) : (
//             <p className="text-gray-500">No documents available.</p>
//           )
//         ) : (
//           <p className="text-gray-500">No documents available.</p>
//         )}
//       </div>
//     ) : (
//       <div className="flex flex-col items-center gap-4 text-center">
//         <p className="text-gray-600">
//           Documents are locked. Request access from the entrepreneur.
//         </p>
//         <button
//           onClick={requestDocumentAccess}
//           disabled={requestLoading}
//           className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
//             requestLoading ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//         >
//           {requestLoading ? (
//             <svg
//               className="animate-spin h-5 w-5 mx-auto text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.375.373 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//           ) : (
//             "Request Access"
//           )}
//         </button>
//       </div>
//     )
//   ) : (
//     <p className="text-gray-500 text-center">
//       Please log in to view or request documents.
//     </p>
//   )}
// </section>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-8">
//           <div className="bg-white p-6 rounded-2xl shadow-md relative overflow-hidden group">
//   <button

//     onClick={handleInvestNow}
//     className={`w-full py-4 ${
//       Number(data?.fundingRaised || 0) >= Number(data?.fundingNeeded || 0)
//         ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//         : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//     } text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg focus:ring-4 focus:ring-blue-300`}
//     aria-label={Number(data?.fundingRaised || 0) >= Number(data?.fundingNeeded || 0) ? "Go to dashboard" : "Invest now"}
//   >
//     <span className="flex items-center justify-center gap-2">
//       {Number(data?.fundingRaised || 0) >= Number(data?.fundingNeeded || 0) ? (
//         <>
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//             />
//           </svg>
//           Go to Dashboard
//         </>
//       ) : (
//         <>
//           <svg
//             className="w-5 h-5 animate-pulse"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
//             />
//           </svg>
//           Invest Now
//         </>
//       )}
//     </span>
//   </button>
// </div>

//             <div className="bg-white p-6 rounded-2xl shadow-md">
//               <button
//                 onClick={handleSaveIdea}
//                 className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all ${
//                   isSaved
//                     ? "bg-blue-600 text-white hover:bg-blue-700"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//                 aria-label={isSaved ? "Unsave idea" : "Save idea"}
//               >
//                 <svg
//                   className={`w-5 h-5 ${
//                     isSaved ? "text-white" : "text-gray-500"
//                   }`}
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 {isSaved ? "Saved" : "Save Idea"}
//               </button>
//             </div>

//             <section className="bg-white p-6 rounded-2xl shadow-md">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Market Size
//               </h2>
//               <p className="text-gray-600 leading-relaxed">
//                 {ideaDetails.marketSize || "Not specified"}
//               </p>
//             </section>

//             <section className="bg-white p-6 rounded-2xl shadow-md">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Use of Funds
//               </h2>
//               <ul
//                 className="list-disc list-inside space moved to PaymentForm.jsxy-2"
//               >
//                 {ideaDetails?.useOfFunds?.length > 0 ? (
//                   ideaDetails.useOfFunds.map((item, index) => (
//                     <li key={index} className="text-gray-600">
//                       {item}
//                     </li>
//                   ))
//                 ) : (
//                   <li className="text-gray-500">No details provided.</li>
//                 )}
//               </ul>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StartupDetail;



import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
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
  const selectedBusinessIdea = useSelector(
    (state) => state.businessIdea.selectedBusinessIdea
  );

  const bussinessIdea = useSelector(
    (state) => state.businessIdea.BussinessIdea
  );
  const bussinessIdeaArray = Array.isArray(bussinessIdea)
    ? bussinessIdea
    : Object.values(bussinessIdea || {});
  const userData = useSelector((state) => state.userData);
  const messages = useSelector(
    (state) => state.messageDatas.messageDatas || []
  );
  const token = localStorage.getItem("authToken");
  const API_URL = "https://ethio-capital-backend-123.onrender.com/api/v1";
  const STATIC_URL = "https://ethio-capital-backend-123.onrender.com";

  const [socket, setSocket] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
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
  const [priorEquity, setPriorEquity] = useState(0);
  const [remainingFunding, setRemainingFunding] = useState(0);
  const [data, setData] = useState(null);
  const [documentError, setDocumentError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const userRole = userData.userData?.role;
  const isEntrepreneur =
    userData.userData?.role === "entrepreneur" &&
    ideaDetails?.user?._id === userData.userData._id;

  // Socket.io connection
  useEffect(() => {
    if (token && userData.userData?._id) {
      const newSocket = io("https://ethio-capital-backend-123.onrender.com", {
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

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on("documentAccessApproved", ({ ideaId, ideaTitle }) => {
        if (ideaId === id) {
          fetchDocumentAccessStatus();
          alert(`Access approved for "${ideaTitle}"`);
        }
      });
      socket.on(
        "fundingUpdated",
        ({ ideaId, fundingRaised, fundingNeeded }) => {
          if (ideaId === id) {
            setIdeaDetails((prev) => ({
              ...prev,
              fundingRaised,
              fundingNeeded,
            }));
            calculateRemainingFunding(fundingRaised, fundingNeeded);
          }
        }
      );
    }
    return () => {
      if (socket) {
        socket.off("documentAccessApproved");
        socket.off("fundingUpdated");
      }
    };
  }, [socket, id]);

  // Initialize axios and fetch user data
  useEffect(() => {
    setupAxios();
    dispatch(fetchUserData());
    if (userData.userData?._id) {
      dispatch(fetchUnReadMessages(userData.userData._id));
    }
  }, [dispatch, userData.userData?._id]);

  // Camera handling
  useEffect(() => {
    if (showCamera && !streamActive) {
      startCamera();
    }
    return () => stopCamera();
  }, [showCamera, cameraFacingMode]);

  // Fetch user info
  const userDataFromRedux = useSelector((state) => state.userData.userData);
  const [userInfo, setUserInfo] = useState({ fullName: "", email: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userDataFromRedux) {
          setUserInfo({
            fullName:
              userDataFromRedux.fullName ||
              `${userDataFromRedux.firstName || ""} ${
                userDataFromRedux.lastName || ""
              }`.trim() ||
              "Unknown User",
            email: userDataFromRedux.email || "",
          });
        } else if (token) {
          try {
            const response = await axios.get(`${API_URL}/user`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserInfo({
              fullName:
                response.data.fullName ||
                `${response.data.firstName || ""} ${
                  response.data.lastName || ""
                }`.trim() ||
                "Unknown User",
              email: response.data.email || "",
            });
          } catch (error) {
            if (error.response?.status === 401) {
              console.error("Token expired:", error.response?.data);
              localStorage.removeItem("authToken");
              setTimeout(() => navigate("/login"), 3000);
              return;
            }
            throw error;
          }
        } else {
          console.error("No token or userId");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDataFromRedux, token]);

  // Main data fetching
  useEffect(() => {
    const fetchIdeaData = async () => {
      try {
        const selectedIdea = bussinessIdeaArray.find((idea) => idea._id === id);
        if (selectedIdea) {
          dispatch(setSelectedBusinessIdea(selectedIdea));
          setIdeaDetails(selectedIdea);
          calculateRemainingFunding(
            selectedIdea.fundingRaised,
            selectedIdea.fundingNeeded
          );
        } else {
          await dispatch(fetchBusinessIdeaById(id)).unwrap();
          const fetchedIdea =
            bussinessIdeaArray.find((idea) => idea._id === id) ||
            selectedBusinessIdea;
          if (fetchedIdea) {
            setIdeaDetails(fetchedIdea);
            calculateRemainingFunding(
              fetchedIdea.fundingRaised,
              fetchedIdea.fundingNeeded
            );
          } else {
            setIdeaDetails({});
          }
        }
      } catch (error) {
        console.error("Error fetching idea:", error);
        setIdeaDetails({});
      }
    };

    const fetchPriorEquity = async () => {
      if (
        userData.userData?.role === "investor" &&
        userData.userData?._id &&
        token &&
        id
      ) {
        let totalEquity = 0;
        for (const inv of data?.investments || []) {
          if (inv.email === userInfo.email) {
            totalEquity += inv.equityPercentage || 0;
          }
        }
        setPriorEquity(totalEquity);
      }
    };

    fetchIdeaData();
    fetchPriorEquity();

    // Check verification status for investors
    if (
      userData.userData?.role === "investor" &&
      userData.userData?._id &&
      id
    ) {
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
            if (
              verification.status === "draft" ||
              verification.status === "rejected"
            ) {
              setFormData((prev) => ({
                ...prev,
                fullName: verification.fullName || "",
                phone: verification.phone || "",
                investmentCapacity: verification.investmentCapacity || "",
                experience: verification.experience || "",
              }));
              if (
                verification.status === "rejected" &&
                verification.rejectionReason
              ) {
                setSubmissionError(
                  `Previous verification rejected: ${verification.rejectionReason}`
                );
              }
            }
          } else {
            setVerificationStatus("pending");
          }
        } catch (err) {
          console.error(
            "Error checking verification status:",
            err.response?.data || err.message
          );
          setVerificationStatus("pending");
        }
      };

      checkVerificationStatus();
    }

    // Fetch document access status
    if (userData.userData?._id) {
      fetchDocumentAccessStatus();

      // Fetch access requests for entrepreneurs
      if (isEntrepreneur) {
        fetchDocumentAccessRequests();
      }
    }

    // Fetch conversations
    if (isEntrepreneur) {
      const fetchConversations = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/conversations/idea/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setConversations(response.data);
          const unread = response.data.reduce((count, conv) => {
            return (
              count +
              messages.filter(
                (msg) =>
                  msg.conversationId === conv._id &&
                  !msg.read &&
                  msg.recipient === userData.userData._id
              ).length
            );
          }, 0);
          setUnreadCount(unread);
        } catch (err) {
          console.error(
            "Error fetching conversations:",
            err.response?.data || err.message
          );
        }
      };
      fetchConversations();
    } else if (
      userData.userData?.role === "investor" &&
      verificationStatus === "approved"
    ) {
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
          console.error(
            "Error fetching investor conversation:",
            err.response?.data || err.message
          );
        }
      };
      fetchInvestorConversation();
    }
  }, [
    dispatch,
    id,
    bussinessIdea,
    selectedBusinessIdea,
    userData,
    messages,
    verificationStatus,
    token,
    socket,
    isEntrepreneur
  ]);

  // Fetch investment details
  const projectId = ideaDetails?._id;
  useEffect(() => {
    const fetchInvestmentDetails = async () => {
      try {
        const response = await axios.get(
          `https://ethio-capital-backend-123.onrender.com/api/v1/investments-details/${projectId}`
        );
        setData(response.data);
      } catch (err) {
        setError("Failed to fetch investment details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchInvestmentDetails();
    }
  }, [projectId]);

  // Helper functions
  const calculateRemainingFunding = (fundingRaised, fundingNeeded) => {
    const raisedNum = Number(fundingRaised) || 0;
    const neededNum = Number(fundingNeeded) || 1;
    setRemainingFunding(neededNum - raisedNum);
  };

  const calculateValuation = () => {
    if (!ideaDetails.investorEquity || !ideaDetails.fundingNeeded)
      return "Not specified";
    const fundingNeededNum = Number(ideaDetails.fundingNeeded) || 0;
    const equityOfferedNum = Number(ideaDetails.investorEquity) / 100;
    return equityOfferedNum > 0
      ? (fundingNeededNum / equityOfferedNum).toLocaleString("en-US", {
          style: "currency",
          currency: "ETB",
          minimumFractionDigits: 0,
        })
      : "Not specified";
  };

  const calculateProgress = (raised, target) => {
    const raisedNum = Number(raised) || 0;
    const targetNum = Number(target) || 1;
    const percentage = targetNum > 0 ? (raisedNum / targetNum) * 100 : 0;
    return Math.min(percentage, 100);
  };

  // Document access functions
  const fetchDocumentAccessRequests = async () => {
    if (!userData.userData?._id || !token || !id) return;

    setIsRequestsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/document-access/requests/idea/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const requests = response.data.requests || response.data || [];
      setDocumentAccessRequests(Array.isArray(requests) ? requests : []);
    } catch (error) {
      console.error(
        "Error fetching document access requests:",
        error.response?.data || error.message
      );
      setDocumentAccessRequests([]);
    } finally {
      setIsRequestsLoading(false);
    }
  };

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
      setDocumentAccessRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
      alert(
        `Request ${action === "approve" ? "approved" : "denied"} successfully!`
      );
      await fetchDocumentAccessRequests();
    } catch (error) {
      console.error(
        `Error ${action}ing request:`,
        error.response?.data || error.message
      );
      alert(
        `Failed to ${action} request: ${
          error.response?.data?.message || "Please try again."
        }`
      );
    } finally {
      setRequestActionLoading((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  const fetchDocumentAccessStatus = async () => {
    if (!userData.userData?._id || !token || !id) {
      setHasDocumentAccess(userData.userData._id === ideaDetails.user?._id);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/document-access/status/${id}/${userData.userData._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasDocumentAccess(
        response.data.hasAccess ||
          userData.userData._id === ideaDetails.user?._id
      );
    } catch (error) {
      console.error("Error fetching document access status:", error);
      setHasDocumentAccess(userData.userData._id === ideaDetails.user?._id);
    }
  };
  
  const requestDocumentAccess = async () => {
    setRequestLoading(true);
    try {
      // Check verification status first
      if (userData.userData?.role === "investor" && verificationStatus !== "approved") {
        setShowVerificationForm(true);
        setDocumentError("You must complete investor verification before requesting document access.");
        return;
      }

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

  // Camera functions
  const startCamera = async () => {
    try {
      if (stream) stopCamera();
      const constraints = { video: { facingMode: cameraFacingMode } };
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert(
        "Error accessing camera. Please ensure camera permissions are granted."
      );
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
        const imageFile = new File([blob], "profile-picture.png", {
          type: "image/png",
        });
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

  // Main action handlers
  const handleInvestNow = async () => {
    if (!userData.userData?._id) {
      alert('Please log in to proceed.');
      navigate('/login');
      return;
    }
  
    if (!ideaDetails?._id && !selectedBusinessIdea?._id) {
      alert('No startup selected.');
      return;
    }
  
    const ideaToPass = ideaDetails._id ? ideaDetails : selectedBusinessIdea;
    if (!ideaToPass?._id) {
      alert('Startup data not available.');
      return;
    }
  
    if (!token) {
      alert('Authentication token missing. Please log in.');
      navigate('/login');
      return;
    }
  
    const fundingRaised = Number(data?.fundingRaised || 0);
    const fundingNeeded = Number(data?.fundingNeeded || 0);
    const isFundingComplete = fundingRaised >= fundingNeeded;
  
    if (isFundingComplete) {
      if (userRole === 'investor' && priorEquity <= 0) {
        alert('You cannot access the board because you have not purchased any shares.');
        return;
      }
  
      try {
        let boardId = null;
        try {
          const response = await axios.post(
            `${API_URL}/board/join`,
            {
              businessIdeaId: ideaToPass._id,
              userId: userData.userData._id,
              role: userRole,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          boardId = response.data.boardId;
        } catch (joinError) {
          console.warn('Join board failed, proceeding anyway', joinError);
        }
  
        navigate('/boardDashboard', {
          state: {
            startupId: ideaToPass._id,
            userId: userData.userData._id,
            boardId,
            startupData: {
              title: ideaToPass.title,
              fundingRaised: ideaToPass.fundingRaised,
              fundingNeeded: ideaToPass.fundingNeeded,
            },
            isFullyFunded: true,
            isEntrepreneur: userRole === 'entrepreneur',
            userRole,
          },
        });
      } catch (error) {
        alert(
          error.response?.data?.message ||
            'Failed to access the board. Please try again or contact support.'
        );
      }
    } else {
      if (userRole === 'investor') {
        if (verificationStatus !== 'approved') {
          setShowVerificationForm(true);
          return;
        }
        navigate('/PaymentForm', {
          state: {
            selectedIdea: ideaToPass,
            userId: userData.userData._id,
            userEmail: userInfo.email,
            userRole,
          },
        });
      } else if (userRole === 'entrepreneur') {
        alert('As the entrepreneur, you cannot invest in your own idea.');
      } else {
        alert('Unable to proceed. Please log in as an investor or entrepreneur.');
      }
    }
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
      setSubmissionError("Please upload both ID and profile pictures.");
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
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(`${API_URL}/verification`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data._id) {
          await axios.put(
            `${API_URL}/verification/${response.data._id}/submit`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      }

      setVerificationStatus("submitted");
      setVerificationId(response.data._id);
      setShowVerificationForm(false);
      alert("Verification submitted successfully. Awaiting admin approval.");
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      setSubmissionError(errorMessage);
    } finally {
      setSubmissionLoading(false);
    }
  };

  const startConversation = async (e, otherUserId, currentUserId, ideaId) => {
    e.preventDefault();
    if (
      userData.userData?.role === "investor" &&
      verificationStatus !== "approved"
    ) {
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
      console.error(
        "Error starting conversation:",
        error.response?.data || error.message
      );
      alert("Failed to start conversation. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Go back"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Capture Profile Picture
              </h2>
              <button
                onClick={() => {
                  setShowCamera(false);
                  setShowPreview(false);
                  stopCamera();
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close camera"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {!showPreview ? (
              <div className="relative mb-6 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  autoPlay
                  playsInline
                />
                <canvas ref={canvasRef} className="hidden" />
                <button
                  onClick={toggleCameraFacing}
                  className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  aria-label="Switch camera"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <img
                  src={capturedImage}
                  alt="Captured preview"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            )}

            <div className="flex justify-center gap-4">
              {!showPreview ? (
                <button
                  onClick={captureImage}
                  className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
                  aria-label="Capture image"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                    className="px-6 py-3 bg-gray-600 text-white rounded-xl shadow-md hover:bg-gray-700 transition-all"
                  >
                    Retake
                  </button>
                  <button
                    onClick={approveImage}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 transition-all"
                  >
                    Use Photo
                  </button>
                </>
              )}
            </div>
            <p className="text-center mt-4 text-sm text-gray-600">
              Ensure your face is clearly visible in good lighting.
            </p>
          </div>
        </div>
      )}

      {/* Verification Form Modal */}
      {showVerificationForm && !showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[90] p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Investor Verification
              </h2>
              <button
                onClick={() => setShowVerificationForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close verification form"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="mb-6 text-gray-600">
              Please complete the form to verify your investor status.
            </p>
            {submissionError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {submissionError}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="investmentCapacity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Investment Capacity
                </label>
                <select
                  id="investmentCapacity"
                  name="investmentCapacity"
                  value={formData.investmentCapacity}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  aria-required="true"
                >
                  <option value="">Select capacity</option>
                  <option value="$10k-$50k">$10,000 - $50,000</option>
                  <option value="$50k-$100k">$50,000 - $100,000</option>
                  <option value="$100k-$500k">$100,000 - $500,000</option>
                  <option value="$500k+">$500,000+</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Investment Experience
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label
                  htmlFor="idPicture"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ID/Passport Photo
                </label>
                <input
                  id="idPicture"
                  type="file"
                  name="idPicture"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept="image/*"
                  required
                  aria-required="true"
                />
                {formData.idPicture && (
                  <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ID photo uploaded successfully
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <button
                  type="button"
                  onClick={handleOpenCamera}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Take Picture
                </button>
                {formData.profilePicture && (
                  <div className="mt-2 text-green-600 text-sm flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Profile picture captured
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={submissionLoading}
                className={`w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
                  submissionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleVerificationSubmit}
              >
                {submissionLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
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
                  "Submit for Verification"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Access Requests Button (Entrepreneur Only) */}
      {isEntrepreneur && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => {
              setShowAccessRequests(!showAccessRequests);
              if (!showAccessRequests) {
                fetchDocumentAccessRequests();
              }
            }}
            className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Access Requests
            {documentAccessRequests.filter((req) => req.status === "pending")
              .length > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {
                  documentAccessRequests.filter(
                    (req) => req.status === "pending"
                  ).length
                }
              </span>
            )}
          </button>
        </div>
      )}

      {/* Document Access Requests Modal */}
      {showAccessRequests && isEntrepreneur && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[80] p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Document Access Requests
                </h2>
                <button
                  onClick={() => setShowAccessRequests(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close access requests"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={fetchDocumentAccessRequests}
                  disabled={isRequestsLoading}
                  className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
                    isRequestsLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      isRequestsLoading ? "animate-spin" : ""
                    }`}
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
                <div className="flex justify-center items-center py-12">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
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
                </div>
              ) : documentAccessRequests.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    No document access requests available
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documentAccessRequests.map((request) => (
                    <div
                      key={request._id}
                      className={`p-4 rounded-xl border ${
                        request.status === "pending"
                          ? "border-yellow-200 bg-yellow-50"
                          : request.status === "approved"
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">
                              {request.requesterName ||
                                `Investor #${request.requesterId.slice(-6)}`}
                            </span>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                request.status === "pending"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : request.status === "approved"
                                  ? "bg-green-200 text-green-800"
                                  : "bg-red-200 text-red-800"
                              }`}
                            >
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Requested on:{" "}
                            {new Date(request.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {request.status === "pending" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() =>
                                handleAccessRequestAction(
                                  request._id,
                                  "approve"
                                )
                              }
                              disabled={requestActionLoading[request._id]}
                              className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all ${
                                requestActionLoading[request._id]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleAccessRequestAction(request._id, "deny")
                              }
                              disabled={requestActionLoading[request._id]}
                              className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all ${
                                requestActionLoading[request._id]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
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

      {/* Chat Panel */}
      <div className="fixed bottom-6 right-6 z-[70]">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
          <div
            className={`p-4 rounded-t-2xl cursor-pointer flex justify-between items-center ${
              userData.userData?.role === "investor" &&
              verificationStatus !== "approved"
                ? "bg-gray-600 text-white"
                : "bg-blue-600 text-white"
            }`}
            onClick={() => {
              if (
                userData.userData?.role === "entrepreneur" ||
                verificationStatus === "approved"
              ) {
                setShowChat(!showChat);
              } else if (userData.userData?.role === "investor") {
                if (
                  verificationStatus === "pending" ||
                  verificationStatus === "rejected"
                ) {
                  setShowVerificationForm(true);
                } else if (verificationStatus === "submitted") {
                  alert("Verification pending. Please wait for approval.");
                }
              }
            }}
            aria-expanded={showChat}
            aria-controls="chat-panel"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  ideaDetails?.entrepreneurImage ||
                  "https://via.placeholder.com/32"
                }
                alt={ideaDetails?.entrepreneurName || "Entrepreneur"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-medium">
                {userData.userData?.role === "entrepreneur" &&
                ideaDetails?.user?._id === userData.userData._id
                  ? "Your Idea Chats"
                  : `Chat with ${
                      ideaDetails?.user?.fullName || "Entrepreneur"
                    }`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {userData.userData?.role === "investor" &&
                verificationStatus === "approved" &&
                !showChat &&
                unreadCount > 0 && (
                  <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              <svg
                className={`w-5 h-5 transition-transform ${
                  showChat ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {userData.userData?.role === "investor" &&
            verificationStatus !== "approved" &&
            !showChat && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {verificationStatus === "pending" && (
                  <>
                    <p className="font-medium text-gray-700 mb-3">
                      Verification Required
                    </p>
                    <button
                      onClick={() => setShowVerificationForm(true)}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                    >
                      Verify Now
                    </button>
                  </>
                )}
                {verificationStatus === "submitted" && (
                  <p className="font-medium text-gray-700">
                    Verification In Progress
                  </p>
                )}
                {verificationStatus === "rejected" && (
                  <>
                    <p className="font-medium text-red-700 mb-3">
                      Verification Rejected
                    </p>
                    <button
                      onClick={() => setShowVerificationForm(true)}
                      className="w-full py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
                    >
                      Update Information
                    </button>
                  </>
                )}
              </div>
            )}

          {showChat && (
            <div
              id="chat-panel"
              className="p-4 max-h-96 overflow-y-auto bg-gray-50"
            >
              {userData.userData?.role === "entrepreneur" &&
              ideaDetails?.user?._id === userData.userData._id ? (
                conversations.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No chats yet</p>
                ) : (
                  conversations.map((conv) => {
                    const investor = conv.participants.find(
                      (p) => p !== userData.userData._id
                    );
                    const unreadForConv = messages.filter(
                      (msg) =>
                        msg.conversationId === conv._id &&
                        !msg.read &&
                        msg.recipient === userData.userData._id
                    ).length;
                    return (
                      <div
                        key={conv._id}
                        onClick={() => setSelectedConversationId(conv._id)}
                        className={`p-3 rounded-xl cursor-pointer hover:bg-gray-100 transition-all ${
                          selectedConversationId === conv._id
                            ? "bg-blue-100"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-800">
                            Investor #
                            {typeof investor === "string"
                              ? investor.slice(-6)
                              : investor?._id.slice(-6)}
                          </p>
                          {unreadForConv > 0 && (
                            <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              {unreadForConv}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conv.lastMessage?.text || "No messages yet"}
                        </p>
                      </div>
                    );
                  })
                )
              ) : !selectedConversationId ? (
                <button
                  onClick={(e) =>
                    startConversation(
                      e,
                      ideaDetails?.user?._id,
                      userData.userData._id,
                      ideaDetails._id
                    )
                  }
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
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
              {selectedConversationId &&
                userData.userData?.role === "entrepreneur" && (
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

      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <img
              src={
                ideaDetails?.entrepreneurImage ||
                "https://via.placeholder.com/128"
              }
              alt={ideaDetails?.entrepreneurName || "Entrepreneur"}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-100"
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {ideaDetails.title || "Startup Idea"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mt-2">
                by {ideaDetails?.user?.fullName || "Entrepreneur"}
              </p>
              <p className="text-base text-gray-500 mt-1">
                {ideaDetails.entrepreneurLocation || "Not specified"}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                  {ideaDetails.currentStage || "Not specified"}
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium">
                  Seeking {ideaDetails.fundingNeeded || "Not specified"}
                </span>
                <span className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium">
                  {ideaDetails.businessCategory || "Not specified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {ideaDetails.overview || "No overview provided."}
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Entrepreneur Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700">Education</h3>
                  <p className="text-gray-600 mt-1">
                    {ideaDetails.entrepreneurEducation || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Experience</h3>
                  <p className="text-gray-600 mt-1">
                    {ideaDetails.entrepreneurBackground || "Not specified"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Problem Statement
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {ideaDetails.problemStatement || "Not specified"}
              </p>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Solution
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {ideaDetails.solution || "Not specified"}
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-md">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
    Funding Progress
  </h2>
  <div className="flex flex-col md:flex-row items-center gap-8">
    <div className="relative w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${calculateProgress(
            data?.fundingRaised,
            data?.fundingNeeded
          )} 283`}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          fontSize="12"
          fill="#374151"
          dy=".3em"
        >
          {Math.round(
            calculateProgress(data?.fundingRaised, data?.fundingNeeded)
          )}
          %
        </text>
      </svg>
    </div>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">Raised</p>
        <p className="text-lg font-semibold text-gray-900">
          {Number(data?.fundingRaised || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "ETB",
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Goal</p>
        <p className="text-lg font-semibold text-gray-900">
          {Number(data?.fundingNeeded || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "ETB",
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Remaining</p>
        <p className="text-lg font-semibold text-gray-900">
          {Number(data?.remainingFunding || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "ETB",
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Your Equity</p>
        <p className="text-lg font-semibold text-gray-900">
          {userData.userData?.role === "investor"
            ? `${(priorEquity * 100).toFixed(2)}%`
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Valuation</p>
        <p className="text-lg font-semibold text-gray-900">
          {calculateValuation()}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Investment Timeline</p>
        <p className="text-lg font-semibold text-gray-900">
          {ideaDetails.investmentTimeline || "Not specified"}
        </p>
      </div>
    </div>
  </div>
  {remainingFunding < 3000 && remainingFunding > 0 && (
    <p className="mt-4 text-sm text-orange-600">
      Only {remainingFunding.toLocaleString()} ETB remains. You can
      invest this exact amount to close the funding.
    </p>
  )}
</section>



<section className="bg-white p-6 rounded-2xl shadow-md">
  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Documents</h2>
  {documentError && <p className="text-red-600 mb-4">{documentError}</p>}
  {userData.userData?._id ? (
    hasDocumentAccess || isEntrepreneur ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Debug log */}
        {console.log('ideaDetails:', JSON.stringify(ideaDetails, null, 2))}
        {ideaDetails?.documents ? (
          [
            {
              name: "Business Registration",
              path: ideaDetails.documents.businessRegistration,
            },
            {
              name: "Financial Projections",
              path: ideaDetails.documents.financialProjections,
            },
            {
              name: "Market Research Report",
              path: ideaDetails.documents.marketResearchReport,
            },
            {
              name: "Patent Documentation",
              path: ideaDetails.documents.patentDocumentation,
            },
            { name: "Pitch Deck", path: ideaDetails.documents.pitchDeck },
            {
              name: "Team Certifications",
              path: ideaDetails.documents.teamCertifications,
            },
          ]
            .filter((doc) => {
              console.log(`Document ${doc.name}:`, doc.path);
              return doc.path && typeof doc.path === "string" && doc.path.trim() !== "";
            })
            .length > 0 ? (
            [
              {
                name: "Business Registration",
                path: ideaDetails.documents.businessRegistration,
              },
              {
                name: "Financial Projections",
                path: ideaDetails.documents.financialProjections,
              },
              {
                name: "Market Research Report",
                path: ideaDetails.documents.marketResearchReport,
              },
              {
                name: "Patent Documentation",
                path: ideaDetails.documents.patentDocumentation,
              },
              { name: "Pitch Deck", path: ideaDetails.documents.pitchDeck },
              {
                name: "Team Certifications",
                path: ideaDetails.documents.teamCertifications,
              },
            ]
              .filter(
                (doc) =>
                  doc.path &&
                  typeof doc.path === "string" &&
                  doc.path.trim() !== ""
              )
              .map((doc, index) => {
                if (!doc.path.toLowerCase().endsWith(".pdf")) {
                  return (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-xl"
                    >
                      <p className="text-red-600">
                        Only PDF documents are supported for {doc.name}
                      </p>
                    </div>
                  );
                }

                const handleDocumentClick = async () => {
                  const fullUrl = `${STATIC_URL}/${doc.path}`;
                  console.log("Attempting to access document:", fullUrl);
                  try {
                    // Verify document exists
                    const response = await axios.head(fullUrl, {
                      headers: { Accept: "application/pdf" },
                    });
                    console.log(
                      "HEAD response:",
                      response.status,
                      response.headers
                    );
                    if (response.status === 200) {
                      const encodedPath = encodeURIComponent(doc.path);
                      console.log(
                        "Opening document viewer at:",
                        `/view-document/${encodedPath}`
                      );
                      window.open(`/view-document/${encodedPath}`, "_blank");
                    } else {
                      setDocumentError(
                        `Document "${doc.name}" not found. Please contact support.`
                      );
                    }
                  } catch (error) {
                    console.error(
                      "Error checking document:",
                      error.response?.status,
                      error.message
                    );
                    setDocumentError(
                      `Error accessing "${doc.name}": ${error.message}`
                    );
                  }
                };

                return (
                  <div
                    key={index}
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
                        <h3 className="font-medium text-gray-800">{doc.name}</h3>
                        <p className="text-sm text-gray-500">Available</p>
                      </div>
                    </div>
                    <button
                      onClick={handleDocumentClick}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      View
                    </button>
                  </div>
                );
              })
          ) : (
            <p className="text-gray-500">No documents available.</p>
          )
        ) : (
          <p className="text-gray-500">No documents available.</p>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-gray-600">
          Documents are locked. Request access from the entrepreneur.
        </p>
        <button
          onClick={requestDocumentAccess}
          disabled={requestLoading}
          className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all ${
            requestLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {requestLoading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto text-white"
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
                d="M4 12a8 8 0 018-8V0C5.375.373 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Request Access"
          )}
        </button>
      </div>
    )
  ) : (
    <p className="text-gray-500 text-center">
      Please log in to view or request documents.
    </p>
  )}
</section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-md relative overflow-hidden group">
  <button

    onClick={handleInvestNow}
    className={`w-full py-4 ${
      Number(data?.fundingRaised || 0) >= Number(data?.fundingNeeded || 0)
        ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    } text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg focus:ring-4 focus:ring-blue-300`}
    aria-label={Number(data?.fundingRaised || 0) >= Number(data?.fundingNeeded || 0) ? "Go to dashboard" : "Invest now"}
  >
    <span className="flex items-center justify-center gap-2">
      {Number(data?.fundingRaised || 0) >= Number(data?.fundingNeeded || 0) ? (
        <>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Go to Dashboard
        </>
      ) : (
        <>
          <svg
            className="w-5 h-5 animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Invest Now
        </>
      )}
    </span>
  </button>
</div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <button
                onClick={handleSaveIdea}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold transition-all ${
                  isSaved
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={isSaved ? "Unsave idea" : "Save idea"}
              >
                <svg
                  className={`w-5 h-5 ${
                    isSaved ? "text-white" : "text-gray-500"
                  }`}
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

            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Market Size
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {ideaDetails.marketSize || "Not specified"}
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Use of Funds
              </h2>
              <ul
                className="list-disc list-inside space moved to PaymentForm.jsxy-2"
              >
                {ideaDetails?.useOfFunds?.length > 0 ? (
                  ideaDetails.useOfFunds.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No details provided.</li>
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



