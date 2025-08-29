// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   MessageSquare, Clock, CheckCircle, Video, Activity, Send,
//   FileText, Users, ChevronLeft, FilePlus, Info, Sun, Moon, DollarSign,
// } from 'lucide-react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';
// import FundReleaseForm from './FundReleaseForm.jsx';
// import FundReleaseVoting from './FundReleaseVoting.jsx';
// import { X } from 'lucide-react';

// const VOTE_THRESHOLD = 0.75;

// const BoardDashboard = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [activeTab, setActiveTab] = useState('discussion');
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const chatRef = useRef(null);
//   const [votes, setVotes] = useState({
//     releaseFunds: 0,
//     extendTime: 0,
//     refundInvestors: 0,
//   });
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userInitials, setUserInitials] = useState('?');
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [showNotification, setShowNotification] = useState(false);
//   const [notificationMessage, setNotificationMessage] = useState('');
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const [businessIdeaId, setBusinessIdeaId] = useState(null);
//   const [boardMemberData, setBoardMemberData] = useState(null);
//   const [isEntrepreneur, setIsEntrepreneur] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showAllInvestors, setShowAllInvestors] = useState(false);
//   const [theme, setTheme] = useState('light');
//   const [fundReleaseId, setFundReleaseId] = useState(null);
//   const [fundReleaseStatus, setFundReleaseStatus] = useState('pending');
//   const [fundReleases, setFundReleases] = useState([]);
//   const [newFundRelease, setNewFundRelease] = useState(false);
//   const token = localStorage.getItem('authToken');
//   const API_URL = process.env.REACT_APP_API_URL || 'https://ethiocapital-back.onrender.com/api/v1';
//   const socket = useRef(null);

//   const {
//     startupId,
//     userId,
//     startupData,
//     isEntrepreneur: passedIsEntrepreneur,
//     userRole,
//   } = location.state || {};

//   useEffect(() => {
//     console.log('[BoardDashboard] location.state:', {
//       startupId,
//       userId,
//       startupData,
//       isEntrepreneur: passedIsEntrepreneur,
//       userRole,
//     });
//   }, [startupId, userId, startupData, passedIsEntrepreneur, userRole]);

//   useEffect(() => {
//     console.log('[BoardDashboard] State debug:', {
//       businessIdeaId,
//       fundReleaseId,
//       fundReleases,
//       isEntrepreneur,
//       fundReleaseStatus,
//       votes,
//     });
//   }, [businessIdeaId, fundReleaseId, fundReleases, isEntrepreneur, fundReleaseStatus, votes]);

//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//   };

//   useEffect(() => {
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [theme]);

//   const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

//   useEffect(() => {
//     if (!businessIdeaId && !startupId) {
//       setNotificationMessage('Business Idea ID is missing.');
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 3000);
//       navigate('/startups');
//     } else if (!isValidObjectId(startupId)) {
//       setNotificationMessage('Invalid startup ID format.');
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 3000);
//       navigate('/startups');
//     } else {
//       setBusinessIdeaId(startupId);
//     }
//   }, [businessIdeaId, startupId, navigate]);

//   const fetchFundReleases = useCallback(async () => {
//     console.log('[BoardDashboard] fetchFundReleases called', { businessIdeaId, token: token ? 'present' : 'missing' });
//     if (!businessIdeaId || !isValidObjectId(businessIdeaId) || !token) {
//       console.warn('[BoardDashboard] fetchFundReleases invalid inputs:', { businessIdeaId, token });
//       setNotificationMessage('Invalid startup ID or session expired.');
//       setShowNotification(true);
//       setTimeout(() => {
//         setShowNotification(false);
//         if (!token) {
//           localStorage.removeItem('authToken');
//           navigate('/login');
//         }
//       }, 3000);
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `${API_URL}/fund-release/business/${businessIdeaId}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       console.log('[BoardDashboard] fetchFundReleases response:', {
//         status: response.status,
//         data: response.data,
//         fundReleases: response.data.data,
//       });
//       const fundReleases = response.data.data || [];
//       setFundReleases(fundReleases);
//       if (fundReleases.length > 0) {
//         const latest = fundReleases[0];
//         console.log('[BoardDashboard] Setting fund release:', {
//           fundReleaseId: latest._id,
//           status: latest.status,
//           votes: latest.votes,
//         });
//         setFundReleaseId(latest._id);
//         setFundReleaseStatus(latest.status);
//         setVotes((prev) => ({
//           ...prev,
//           releaseFunds: Array.isArray(latest.votes) ? latest.votes.length : latest.votes || 0,
//         }));
//       } else {
//         console.log('[BoardDashboard] No fund releases found');
//         setFundReleaseId(null);
//         setFundReleaseStatus('pending');
//       }
//     } catch (error) {
//       console.error('[BoardDashboard] fetchFundReleases error:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       let errorMessage = 'Failed to load fund release requests.';
//       if (error.response) {
//         switch (error.response.status) {
//           case 401:
//             errorMessage = 'Session expired. Please log in again.';
//             setTimeout(() => {
//               localStorage.removeItem('authToken');
//               navigate('/login');
//             }, 3000);
//             break;
//           case 403:
//             errorMessage = 'You are not authorized to view fund releases.';
//             break;
//           case 404:
//             errorMessage = 'No fund releases found for this startup.';
//             break;
//           default:
//             errorMessage = error.response.data?.message || errorMessage;
//         }
//       }
//       setNotificationMessage(errorMessage);
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 5000);
//     }
//   }, [businessIdeaId, token, navigate]);

//   useEffect(() => {
//     if (token && businessIdeaId) {
//       socket.current = io('http://localhost:3001', { auth: { token } });
//       socket.current.on('connect', () => {
//         socket.current.emit('joinRoom', `business:${businessIdeaId}`);
//       });
//       socket.current.on('voteUpdated', ({ businessIdeaId: updatedIdeaId, voteType, votes: newVotes, fundReleaseId }) => {
//         console.log('[BoardDashboard] Socket.IO voteUpdated', { updatedIdeaId, voteType, newVotes, fundReleaseId });
//         if (
//           updatedIdeaId === businessIdeaId &&
//           voteType === 'releaseFunds' &&
//           fundReleaseId &&
//           Number.isInteger(newVotes)
//         ) {
//           setVotes((prev) => ({ ...prev, [voteType]: newVotes }));
//           setFundReleases((prev) =>
//             prev.map((fr) =>
//               fr._id === fundReleaseId ? { ...fr, votes: newVotes } : fr
//             )
//           );
//         }
//       });
//       socket.current.on('voteMajorityReached', ({ businessIdeaId: updatedIdeaId, voteType, votes: newVotes, fundReleaseId }) => {
//         console.log('[BoardDashboard] Socket.IO voteMajorityReached', { updatedIdeaId, voteType, newVotes, fundReleaseId });
//         if (
//           updatedIdeaId === businessIdeaId &&
//           voteType === 'releaseFunds' &&
//           fundReleaseId &&
//           Number.isInteger(newVotes)
//         ) {
//           setVotes((prev) => ({ ...prev, [voteType]: newVotes }));
//           setFundReleaseStatus('sent_to_admin');
//           setFundReleases((prev) =>
//             prev.map((fr) =>
//               fr._id === fundReleaseId ? { ...fr, votes: newVotes, status: 'sent_to_admin' } : fr
//             )
//           );
//           setNotificationMessage('Fund release approved! Sent to admin.');
//           setShowNotification(true);
//           setTimeout(() => setShowNotification(false), 3000);
//         }
//       });
//       socket.current.on('newFundRelease', ({ fundReleaseId, businessIdeaId: updatedIdeaId, bankName, accountName, accountNumber, amount, createdBy, votes, status }) => {
//         console.log('[BoardDashboard] Socket.IO newFundRelease', { fundReleaseId, updatedIdeaId, bankName, accountName, amount, createdBy, votes, status });
//         if (updatedIdeaId === businessIdeaId && fundReleaseId) {
//           setFundReleases((prev) => [
//             {
//               _id: fundReleaseId,
//               bankName,
//               accountName,
//               accountNumber,
//               amount,
//               votes: Number.isInteger(votes) ? votes : 0,
//               status,
//               createdBy,
//             },
//             ...prev,
//           ]);
//           setFundReleaseId(fundReleaseId);
//           setFundReleaseStatus(status);
//           setNewFundRelease(true);
//           setNotificationMessage(`New fund release request by ${createdBy} for ${amount} ETB`);
//           setShowNotification(true);
//           setTimeout(() => {
//             setShowNotification(false);
//             setNewFundRelease(false);
//           }, 5000);
//         }
//       });
//       socket.current.on('fundReleaseApproved', ({ fundReleaseId, businessIdeaId: updatedIdeaId, bankName, accountName, accountNumber, amount, votes }) => {
//         console.log('[BoardDashboard] Socket.IO fundReleaseApproved', { fundReleaseId, updatedIdeaId, bankName, accountName, amount, votes });
//         if (updatedIdeaId === businessIdeaId && fundReleaseId && Number.isInteger(votes)) {
//           setFundReleaseStatus('sent_to_admin');
//           setVotes((prev) => ({ ...prev, releaseFunds: votes }));
//           setFundReleases((prev) =>
//             prev.map((fr) =>
//               fr._id === fundReleaseId ? { ...fr, status: 'sent_to_admin', votes } : fr
//             )
//           );
//           setNotificationMessage('Fund release approved and sent to admin!');
//           setShowNotification(true);
//           setTimeout(() => setShowNotification(false), 3000);
//         }
//       });
//       fetchFundReleases();
//       return () => {
//         socket.current?.disconnect();
//       };
//     }
//   }, [token, businessIdeaId, fetchFundReleases]);

//   const fetchBoardMemberData = useCallback(async (ideaId) => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${API_URL}/board-member-database/${ideaId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = response.data;
//       console.log('[BoardDashboard] fetchBoardMemberData:', { data });
//       setBoardMemberData(data);
//       const tokenPayload = JSON.parse(atob(token.split('.')[1]));
//       console.log('[BoardDashboard] Token payload:', { userId: tokenPayload.userId });
//       if (data.entrepreneur && tokenPayload.userId === data.entrepreneur.userId) {
//         setCurrentUser(data.entrepreneur.fullName || data.entrepreneur.email || 'Unknown User');
//         setUserInitials(getInitials(data.entrepreneur.fullName || data.entrepreneur.email).initials);
//       } else {
//         setCurrentUser(tokenPayload.fullName || tokenPayload.email || 'Unknown User');
//         setUserInitials(getInitials(tokenPayload.fullName || tokenPayload.email).initials);
//       }
//     } catch (error) {
//       console.error('[BoardDashboard] fetchBoardMemberData error:', {
//         message: error.message,
//         response: error.response?.data,
//       });
//       setNotificationMessage('Failed to load board member data');
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 3000);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   const checkIsEntrepreneur = useCallback(() => {
//     if (passedIsEntrepreneur !== undefined) {
//       setIsEntrepreneur(passedIsEntrepreneur);
//       console.log('[BoardDashboard] checkIsEntrepreneur: Using passedIsEntrepreneur', { passedIsEntrepreneur });
//       return;
//     }
//     try {
//       const tokenPayload = JSON.parse(atob(token.split('.')[1]));
//       const userId = tokenPayload.userId;
//       const isEnt = boardMemberData?.entrepreneur?._id === userId;
//       setIsEntrepreneur(isEnt);
//       console.log('[BoardDashboard] checkIsEntrepreneur:', { userId, entrepreneurId: boardMemberData?.entrepreneur?._id, isEnt });
//     } catch (error) {
//       setIsEntrepreneur(false);
//       console.error('[BoardDashboard] checkIsEntrepreneur error:', { message: error.message });
//     }
//   }, [passedIsEntrepreneur, boardMemberData, token]);

//   useEffect(() => {
//     if (businessIdeaId) {
//       fetchBoardMemberData(businessIdeaId);
//     }
//   }, [businessIdeaId, fetchBoardMemberData]);

//   useEffect(() => {
//     if (boardMemberData) {
//       checkIsEntrepreneur();
//     }
//   }, [boardMemberData, checkIsEntrepreneur]);

//   useEffect(() => {
//     if (chatRef.current && activeTab === 'discussion' && messages.length > 0) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages, activeTab]);

//   const getInitials = (name) => {
//     if (!name) return { initials: '?', color: 'bg-gray-500' };
//     const initials = name
//       .split(' ')
//       .map((word) => word.charAt(0).toUpperCase())
//       .slice(0, 2)
//       .join('');
//     const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-600'];
//     const colorIndex = name.length % colors.length;
//     return { initials, color: colors[colorIndex] };
//   };

//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       try {
//         await axios.post(
//           `${API_URL}/board/message`,
//           { businessIdeaId, text: newMessage },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setNewMessage('');
//       } catch (error) {
//         setNotificationMessage('Failed to send message');
//         setShowNotification(true);
//         setTimeout(() => setShowNotification(false), 3000);
//       }
//     }
//   };

//   const handleVote = async (type) => {
//     console.log('[BoardDashboard] handleVote called', { type, isEntrepreneur, fundReleaseId, fundReleases });
//     if (isEntrepreneur) {
//       setNotificationMessage('Entrepreneurs cannot vote.');
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 3000);
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${API_URL}/fund-release/vote`,
//         { businessIdeaId, voteType: type, fundReleaseId: type === 'releaseFunds' ? fundReleaseId : undefined },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setVotes((prev) => ({
//         ...prev,
//         [type]: Number.isInteger(response.data.votes) ? response.data.votes : prev[type],
//       }));
//       if (type === 'releaseFunds' && response.data.status) {
//         setFundReleaseStatus(response.data.status);
//         setFundReleases((prev) =>
//           prev.map((fr) =>
//             fr._id === fundReleaseId ? { ...fr, status: response.data.status, votes: response.data.votes } : fr
//           )
//         );
//       }
//       setNotificationMessage('Vote recorded successfully');
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 3000);
//     } catch (error) {
//       setNotificationMessage(error.response?.data?.message || 'Failed to cast vote');
//       setShowNotification(true);
//       setTimeout(() => setShowNotification(false), 3000);
//     }
//   };

//   const chairman = boardMemberData?.investors?.find((member) => member.role?.includes('Chairman')) ||
//     (boardMemberData?.entrepreneur?.fullName === currentUser ? boardMemberData?.entrepreneur : null);

//   const renderMainContent = () => {
//     switch (activeSection) {
//       case 'dashboard':
//         return (
//           <>
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
//               <div className="flex justify-between items-center flex-wrap gap-4">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Overview</h2>
//                   <p className="text-gray-600 dark:text-gray-400">
//                     Total Investment:{' '}
//                     {(startupData?.fundingRaised || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-400">Required Votes for Approval: {Math.ceil((boardMemberData?.investors?.length || 4) * VOTE_THRESHOLD)}/{boardMemberData?.investors?.length || 4}</p>
//                 </div>
//                 <div className="flex flex-wrap gap-4">
//                   {isEntrepreneur && (
//                     <>
//                       <button
//                         onClick={() => navigate('/release-funds')}
//                         className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
//                         aria-label="Create new proposal"
//                       >
//                         <FilePlus size={18} />
//                         Create Proposal
//                       </button>
//                       <button
//                         onClick={() => setActiveSection('releaseForm')}
//                         className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
//                         aria-label="Request fund release"
//                       >
//                         <DollarSign size={18} />
//                         Request Fund Release
//                       </button>
//                     </>
//                   )}
//                   {currentUser === chairman?.fullName && (
//                     <button
//                       onClick={() => navigate('/release-funds')}
//                       className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
//                       aria-label="Chairman create proposal"
//                     >
//                       <FilePlus size={18} />
//                       Chairman: Create Proposal
//                     </button>
//                   )}
//                   {!isEntrepreneur && (
//                     <>
//                       <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600" aria-label="Generate report">
//                         Generate Report
//                       </button>
//                       <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600" aria-label="Schedule meeting">
//                         Schedule Meeting
//                       </button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Board Members</h2>
//                 {boardMemberData ? (
//                   <div className="space-y-4">
//                     {boardMemberData.entrepreneur && (
//                       <div className="p-4 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-500 transform hover:scale-105 transition-all duration-300">
//                         <div className="flex items-center gap-4">
//                           <div
//                             className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${getInitials(boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email).color}`}
//                           >
//                             {getInitials(boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email).initials}
//                           </div>
//                           <div className="flex-1">
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email}</h3>
//                                 <p className="text-sm text-gray-600 dark:text-gray-400">Entrepreneur</p>
//                                 <p className="text-sm text-gray-500 dark:text-gray-500">{boardMemberData.entrepreneur.email}</p>
//                               </div>
//                               <button
//                                 onClick={() => setSelectedMember({
//                                   ...boardMemberData.entrepreneur,
//                                   image: getInitials(boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email),
//                                   type: 'Entrepreneur',
//                                   shares: 0,
//                                   amount: 0,
//                                   equityPercentage: 0
//                                 })}
//                                 className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 aria-label={`View details for ${boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email}`}
//                               >
//                                 <Info size={20} className="text-blue-600 dark:text-blue-400" />
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                     {boardMemberData.investors?.length > 0 ? (
//                       <>
//                         {boardMemberData.investors
//                           .filter((investor) => investor.email === 'girma@gmail.com' || showAllInvestors)
//                           .map((investor, index) => (
//                             <div
//                               key={index}
//                               className="p-4 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800 rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-green-500 transform hover:scale-105 transition-all duration-300"
//                             >
//                               <div className="flex items-center gap-4">
//                                 <div
//                                   className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${getInitials(investor.fullName || investor.email).color}`}
//                                 >
//                                   {getInitials(investor.fullName || investor.email).initials}
//                                 </div>
//                                 <div className="flex-1">
//                                   <div className="flex justify-between items-center">
//                                     <div>
//                                       <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{investor.fullName || investor.email}</h3>
//                                       <p className="text-sm text-gray-600 dark:text-gray-400">Investor</p>
//                                       <p className="text-sm text-gray-500 dark:text-gray-500">{investor.email}</p>
//                                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                                         Investment: {(investor.amount || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
//                                       </p>
//                                       <p className="text-sm text-gray-600 dark:text-gray-400">Shares: {investor.shares || 0}</p>
//                                       <p className="text-sm text-gray-600 dark:text-gray-400">
//                                         Equity: {investor.equityPercentage ? `${(investor.equityPercentage * 100).toFixed(1)}%` : 'N/A'}
//                                       </p>
//                                     </div>
//                                     <button
//                                       onClick={() => setSelectedMember({
//                                         ...investor,
//                                         image: getInitials(investor.fullName || investor.email),
//                                         type: 'Investor'
//                                       })}
//                                       className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//                                       aria-label={`View details for ${investor.fullName || investor.email}`}
//                                     >
//                                       <Info size={20} className="text-green-600 dark:text-green-400" />
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         <button
//                           onClick={() => setShowAllInvestors(!showAllInvestors)}
//                           className="mt-4 flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full justify-center"
//                           aria-label={showAllInvestors ? 'Hide additional investors' : 'Show all investors'}
//                         >
//                           <Users size={18} />
//                           {showAllInvestors ? 'Hide Additional Investors' : 'Show All Investors'}
//                         </button>
//                       </>
//                     ) : (
//                       <p className="text-gray-600 dark:text-gray-400">No investors found.</p>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="text-center p-8">
//                     <svg
//                       className="animate-spin h-8 w-8 text-orange-500 mx-auto"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       aria-label="Loading board members"
//                     >
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     <p className="mt-4 text-gray-600 dark:text-gray-400">Loading board members...</p>
//                   </div>
//                 )}
//               </div>
//               <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
//                 <div className="flex gap-4 mb-4">
//                   <button
//                     onClick={() => setActiveTab('discussion')}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//                       activeTab === 'discussion' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                     }`}
//                     aria-label="Switch to discussion tab"
//                   >
//                     <MessageSquare size={20} />
//                     Discussion
//                   </button>
//                   <button
//                     onClick={() => setActiveTab('video')}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//                       activeTab === 'video' ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
//                     }`}
//                     aria-label="Switch to video meeting tab"
//                   >
//                     <Video size={20} />
//                     Video Meeting
//                   </button>
//                 </div>
//                 <div className="h-96 bg-gray-50 dark:bg-gray-900 rounded-lg">
//                   {activeTab === 'discussion' ? (
//                     <div className="h-full flex flex-col p-4">
//                       <div className="flex-1 overflow-y-auto mb-4" ref={chatRef}>
//                         {messages.length > 0 ? (
//                           messages.map((message) => (
//                             <div key={message.id} className="mb-4">
//                               <div className="flex items-center gap-2">
//                                 <div
//                                   className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getInitials(message.user).color}`}
//                                 >
//                                   {getInitials(message.user).initials}
//                                 </div>
//                                 <div>
//                                   <span className="font-medium text-gray-900 dark:text-white">{message.user}</span>
//                                   <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{message.time}</span>
//                                 </div>
//                               </div>
//                               <div className="ml-10 mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-900 dark:text-white">
//                                 {message.text}
//                               </div>
//                             </div>
//                           ))
//                         ) : (
//                           <div className="flex items-center justify-center h-full">
//                             <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
//                           </div>
//                         )}
//                       </div>
//                       <form onSubmit={handleSendMessage} className="flex gap-2">
//                         <input
//                           type="text"
//                           value={newMessage}
//                           onChange={(e) => setNewMessage(e.target.value)}
//                           placeholder="Type your message..."
//                           className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
//                           autoFocus={false}
//                           aria-label="Type your message"
//                         />
//                         <button
//                           type="submit"
//                           className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                           aria-label="Send message"
//                         >
//                           <Send size={20} />
//                         </button>
//                       </form>
//                     </div>
//                   ) : (
//                     <div className="h-full flex flex-col items-center justify-center">
//                       <Video size={48} className="text-gray-400 dark:text-gray-300 mb-4" />
//                       <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600" aria-label="Join video meeting">
//                         Join Video Meeting
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
//               <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Board Voting</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <FundReleaseVoting
//                   fundReleases={fundReleases}
//                   fundReleaseId={fundReleaseId}
//                   fundReleaseStatus={fundReleaseStatus}
//                   votes={votes}
//                   boardMemberData={boardMemberData}
//                   isEntrepreneur={isEntrepreneur}
//                   newFundRelease={newFundRelease}
//                   token={token}
//                   businessIdeaId={businessIdeaId}
//                   setNotificationMessage={setNotificationMessage}
//                   setShowNotification={setShowNotification}
//                   setVotes={setVotes}
//                   setFundReleaseStatus={setFundReleaseStatus}
//                   setFundReleases={setFundReleases}
//                   API_URL={API_URL}
//                 />
//                 {[
//                   {
//                     key: 'extendTime',
//                     icon: Clock,
//                     title: 'Extend Timeline',
//                     color: 'yellow',
//                     description: 'Extend project deadline',
//                     disabled: false,
//                   },
//                   {
//                     key: 'refundInvestors',
//                     icon: Activity,
//                     title: 'Refund Investors',
//                     color: 'red',
//                     description: 'Return funds to investors',
//                     disabled: false,
//                   },
//                 ].map(({ key, icon: Icon, title, color, description, disabled }) => (
//                   <div
//                     key={key}
//                     className={`p-6 border rounded-lg transition-colors border-gray-200 dark:border-gray-600 ${
//                       disabled
//                         ? 'opacity-50 cursor-not-allowed'
//                         : `hover:bg-${color}-50 dark:hover:bg-${color}-900/30 cursor-pointer`
//                     }`}
//                   >
//                     <Icon className={`mx-auto mb-2 text-${color}-500 dark:text-${color}-400`} size={24} />
//                     <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{description}</p>
//                     <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
//                       <div
//                         className={`bg-${color}-500 rounded-full h-2`}
//                         style={{ width: `${(votes[key] / (boardMemberData?.investors?.length || 4)) * 100}%` }}
//                       />
//                     </div>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
//                       Votes: {votes[key]}/{boardMemberData?.investors?.length || 4}
//                     </p>
//                     {!isEntrepreneur && !disabled && (
//                       <button
//                         onClick={() => handleVote(key)}
//                         className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 w-full"
//                         aria-label={`Vote to ${title.toLowerCase()}`}
//                       >
//                         Vote
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         );
//       case 'documents':
//         return (
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Documents</h2>
//             <div className="flex flex-col gap-4">
//               <p className="text-gray-600 dark:text-gray-400">Project and contract documents will be displayed here.</p>
//               <div className="border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
//                 <h3 className="font-medium text-gray-900 dark:text-white mb-2">Upload Document</h3>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="file"
//                     className="hidden"
//                     id="document-upload"
//                     aria-label="Upload document"
//                   />
//                   <label
//                     htmlFor="document-upload"
//                     className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer"
//                   >
//                     Choose File
//                   </label>
//                   <span className="text-sm text-gray-500 dark:text-gray-400">No file chosen</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         );
//       case 'releaseForm':
//         return (
//           <FundReleaseForm
//             businessIdeaId={businessIdeaId}
//             token={token}
//             startupData={startupData}
//             setActiveSection={setActiveSection}
//             setNotificationMessage={setNotificationMessage}
//             setShowNotification={setShowNotification}
//             fetchFundReleases={fetchFundReleases}
//             API_URL={API_URL}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   const LoadingSpinner = () => (
//     <div className="fixed inset-0 bg-white/80 dark:bg-[#020917]/80 flex items-center justify-center z-50">
//       <svg
//         className="animate-spin h-12 w-12 text-orange-500"
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         aria-label="Loading"
//       >
//         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//         <path
//           className="opacity-75"
//           fill="currentColor"
//           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//         ></path>
//       </svg>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-[#020917] transition-colors duration-200">
//       {loading && <LoadingSpinner />}
//       <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#020917] shadow-lg z-10">
//         <div className="p-6 flex items-center gap-2">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
//             aria-label="Go back"
//           >
//             <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
//           </button>
//           <div>
//             <h1 className="text-2xl font-bold text-orange-500 dark:text-orange-500">EthioCapital</h1>
//             <p className="text-sm text-gray-600 dark:text-gray-400">Board Dashboard</p>
//           </div>
//         </div>
//         <nav className="mt-6">
//           {[
//             { icon: Users, label: 'Dashboard', value: 'dashboard' },
//             { icon: FileText, label: 'Documents', value: 'documents' },
//             { icon: theme === 'light' ? Moon : Sun, label: theme === 'light' ? 'Dark Mode' : 'Light Mode', value: 'theme', onClick: toggleTheme },
//             ...(isEntrepreneur ? [{ icon: DollarSign, label: 'Request Fund Release', value: 'releaseForm' }] : []),
//           ].map(({ icon: Icon, label, value, onClick }) => (
//             <button
//               key={value}
//               onClick={onClick || (() => setActiveSection(value))}
//               className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 ${
//                 activeSection === value && value !== 'theme' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400' : 'text-gray-700 dark:text-white'
//               }`}
//               aria-label={`Switch to ${label.toLowerCase()}`}
//             >
//               <Icon size={20} />
//               {label}
//             </button>
//           ))}
//         </nav>
//         <div className="absolute bottom-0 left-0 right-0 p-6">
//           <div className="flex items-center gap-2">
//             <div
//               className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-medium ${currentUser ? getInitials(currentUser).color : 'bg-gray-500'}`}
//             >
//               {userInitials}
//             </div>
//             <div>
//               <p className="font-medium text-gray-800 dark:text-white">{currentUser || 'User'}</p>
//               <p className="text-xs text-gray-500 dark:text-gray-400">{userRole || 'Board Member'}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="ml-64 p-8">
//         <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{startupData?.title || 'Board Dashboard'}</h2>
//         {renderMainContent()}
//       </div>
//       {showNotification && (
//         <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50" role="alert">
//           <CheckCircle size={20} />
//           {notificationMessage}
//         </div>
//       )}
//       {selectedMember && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedMember.fullName || selectedMember.email}</h3>
//               <button onClick={() => setSelectedMember(null)} aria-label="Close member details">
//                 <X size={24} className="text-gray-600 dark:text-gray-300" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <div
//                   className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${selectedMember.image.color}`}
//                 >
//                   {selectedMember.image.initials}
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900 dark:text-white">{selectedMember.type}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Email: {selectedMember.email}</p>
//                 </div>
//               </div>
//               {selectedMember.type === 'Investor' && (
//                 <div className="space-y-2">
//                   <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Investment</p>
//                     <p className="font-medium text-gray-900 dark:text-white">
//                       {(selectedMember.amount || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
//                     </p>
//                   </div>
//                   <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 pb-2">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Shares</p>
//                     <p className="font-medium text-gray-900 dark:text-white">{selectedMember.shares || 0}</p>
//                   </div>
//                   <div className="flex justify-between pb-2">
//                     <p className="text-sm text-gray-600 dark:text-gray-400">Equity Percentage</p>
//                     <p className="font-medium text-gray-900 dark:text-white">
//                       {selectedMember.equityPercentage ? `${(selectedMember.equityPercentage * 100).toFixed(1)}%` : 'N/A'}
//                     </p>
//                   </div>
//                 </div>
//               )}
//               {selectedMember.type === 'Entrepreneur' && (
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
//                   <p className="font-medium text-gray-900 dark:text-white">Entrepreneur</p>
//                 </div>
//               )}
//               {selectedMember.fullName === chairman?.fullName && votes.releaseFunds >= Math.ceil((boardMemberData?.investors?.length || 4) * VOTE_THRESHOLD) && (
//                 <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
//                   <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Bank Transfer Details</p>
//                   <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg mt-2">
//                     <p className="font-medium text-gray-900 dark:text-white">Bank: {fundReleases[0]?.bankName || 'N/A'}</p>
//                     <p className="font-medium text-gray-900 dark:text-white">Account: {fundReleases[0]?.accountNumber || 'N/A'}</p>
//                   </div>
//                 </div>
//               )}
//               <div className="mt-4 flex gap-2">
//                 <button
//                   className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
//                   onClick={() => setSelectedMember(null)}
//                   aria-label="Close"
//                 >
//                   Close
//                 </button>
//                 <button
//                   className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
//                   aria-label={`Message ${selectedMember.fullName || selectedMember.email}`}
//                 >
//                   Message
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BoardDashboard;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare, Clock, CheckCircle, Video, Activity, Send,
  Users, ChevronLeft, FilePlus, Info, DollarSign,X,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import FundReleaseForm from './FundReleaseForm.jsx';
import FundReleaseVoting from './FundReleaseVoting.jsx';

const VOTE_THRESHOLD = 0.75;

// Generate random ID for video call room
function randomID(len) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const BoardDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('discussion');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const chatRef = useRef(null);
  const [votes, setVotes] = useState({
    releaseFunds: 0,
    extendTime: 0,
    refundInvestors: 0,
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [userInitials, setUserInitials] = useState('?');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [businessIdeaId, setBusinessIdeaId] = useState(null);
  const [boardMemberData, setBoardMemberData] = useState(null);
  const [isEntrepreneur, setIsEntrepreneur] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllInvestors, setShowAllInvestors] = useState(false);
  const [fundReleaseId, setFundReleaseId] = useState(null);
  const [fundReleaseStatus, setFundReleaseStatus] = useState('pending');
  const [fundReleases, setFundReleases] = useState([]);
  const [newFundRelease, setNewFundRelease] = useState(false);
  const [showFundReleaseDetails, setShowFundReleaseDetails] = useState(false);
  const [showExtendTimelineModal, setShowExtendTimelineModal] = useState(false);
  const [showRefundInvestorsModal, setShowRefundInvestorsModal] = useState(false);
  const [showThankYouOverlay, setShowThankYouOverlay] = useState(false);
  const token = localStorage.getItem('authToken');
  const API_URL = process.env.REACT_APP_API_URL || 'https://ethiocapital-back.onrender.com/api/v1';
  const socket = useRef(null);

  const {
    startupId,
    userId,
    startupData,
    isEntrepreneur: passedIsEntrepreneur,
    userRole,
  } = location.state || {};

  useEffect(() => {
    console.log('[BoardDashboard] location.state:', {
      startupId,
      userId,
      startupData,
      isEntrepreneur: passedIsEntrepreneur,
      userRole,
    });
  }, [startupId, userId, startupData, passedIsEntrepreneur, userRole]);

  useEffect(() => {
    console.log('[BoardDashboard] State debug:', {
      businessIdeaId,
      conversationId,
      fundReleaseId,
      fundReleases,
      isEntrepreneur,
      fundReleaseStatus,
      votes,
      API_URL,
    });
  }, [businessIdeaId, conversationId, fundReleaseId, fundReleases, isEntrepreneur, fundReleaseStatus, votes]);

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    if (!businessIdeaId && !startupId) {
      setNotificationMessage('Business Idea ID is missing.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/startups');
      }, 3000);
    } else if (!isValidObjectId(startupId)) {
      setNotificationMessage('Invalid startup ID format.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        navigate('/startups');
      }, 3000);
    } else {
      setBusinessIdeaId(startupId);
    }
  }, [businessIdeaId, startupId, navigate]);

  const fetchFundReleases = useCallback(async () => {
    console.log('[BoardDashboard] fetchFundReleases called', { businessIdeaId, token: token ? 'present' : 'missing' });
    if (!businessIdeaId || !isValidObjectId(businessIdeaId) || !token) {
      console.warn('[BoardDashboard] fetchFundReleases invalid inputs:', { businessIdeaId, token });
      setNotificationMessage('Invalid startup ID or session expired.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        if (!token) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }, 3000);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/fund-release/business/${businessIdeaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[BoardDashboard] fetchFundReleases response:', {
        status: response.status,
        data: response.data,
        fundReleases: response.data.data,
      });
      const fundReleases = response.data.data || [];
      setFundReleases(fundReleases);
      if (fundReleases.length > 0) {
        const latest = fundReleases[0];
        console.log('[BoardDashboard] Setting fund release:', {
          fundReleaseId: latest._id,
          status: latest.status,
          votes: latest.votes,
        });
        setFundReleaseId(latest._id);
        setFundReleaseStatus(latest.status);
        setVotes((prev) => ({
          ...prev,
          releaseFunds: Array.isArray(latest.votes) ? latest.votes.length : latest.votes || 0,
        }));
      } else {
        console.log('[BoardDashboard] No fund releases found');
        setFundReleaseId(null);
        setFundReleaseStatus('pending');
      }
    } catch (error) {
      console.error('[BoardDashboard] fetchFundReleases error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Failed to load fund release requests.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }, 3000);
            break;
          case 403:
            errorMessage = 'You are not authorized to view fund releases.';
            break;
          case 404:
            errorMessage = 'No fund releases found for this startup.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [businessIdeaId, token, navigate]);

  const fetchConversation = useCallback(async () => {
    if (!businessIdeaId || !isValidObjectId(businessIdeaId) || !token) {
      console.warn('[BoardDashboard] fetchConversation: Invalid inputs', { businessIdeaId, token });
      setNotificationMessage('Cannot load conversation: Invalid business idea ID or session expired.');
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        if (!token) {
          localStorage.removeItem('authToken');
          navigate('/login');
        }
      }, 3000);
      return;
    }
    try {
      console.log('[BoardDashboard] fetchConversation: Sending request', { businessIdeaId, token: token.substring(0, 20) + '...' });
      const response = await axios.post(
        `${API_URL}/board/conversation`,
        { businessIdeaId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[BoardDashboard] fetchConversation response:', response.data);
      if (!response.data.success || !response.data.data?._id) {
        throw new Error('Invalid conversation response from server');
      }
      setConversationId(response.data.data._id);
    } catch (error) {
      console.error('[BoardDashboard] fetchConversation error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Failed to load conversation.';
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data.message || 'Invalid business idea ID or board data.';
            break;
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }, 3000);
            break;
          case 403:
            errorMessage = 'You are not authorized to access this conversation.';
            break;
          case 404:
            errorMessage = 'Conversation not found for this business idea.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }
  }, [businessIdeaId, token, navigate]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !isValidObjectId(conversationId) || !token) {
      console.warn('[BoardDashboard] fetchMessages: Invalid inputs', { conversationId, token });
      return;
    }
    try {
      console.log('[BoardDashboard] fetchMessages: Sending request', { conversationId });
      const response = await axios.get(
        `${API_URL}/board/messages/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[BoardDashboard] fetchMessages response:', response.data);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('[BoardDashboard] fetchMessages error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Failed to load messages.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }, 3000);
            break;
          case 403:
            errorMessage = 'You are not authorized to view these messages.';
            break;
          case 404:
            errorMessage = 'Messages not found for this conversation.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  }, [conversationId, token, navigate]);

  useEffect(() => {
    if (token && businessIdeaId && isValidObjectId(businessIdeaId)) {
      socket.current = io('http://localhost:3001', { auth: { token } });
      socket.current.on('connect', () => {
        console.log('[BoardDashboard] Socket.IO connected');
        if (conversationId && isValidObjectId(conversationId)) {
          socket.current.emit('joinRoom', `conversation:${conversationId}`);
        }
      });
      socket.current.on('newBoardMessage', (message) => {
        console.log('[BoardDashboard] Socket.IO newBoardMessage', message);
        setMessages((prev) => [...prev, message]);
      });
      socket.current.on('voteUpdated', ({ businessIdeaId: updatedIdeaId, voteType, votes: newVotes, fundReleaseId }) => {
        console.log('[BoardDashboard] Socket.IO voteUpdated', { updatedIdeaId, voteType, newVotes, fundReleaseId });
        if (
          updatedIdeaId === businessIdeaId &&
          Number.isInteger(newVotes)
        ) {
          setVotes((prev) => ({ ...prev, [voteType]: newVotes }));
          if (voteType === 'releaseFunds' && fundReleaseId) {
            setFundReleases((prev) =>
              prev.map((fr) =>
                fr._id === fundReleaseId ? { ...fr, votes: newVotes } : fr
              )
            );
          }
        }
      });
      socket.current.on('voteMajorityReached', ({ businessIdeaId: updatedIdeaId, voteType, votes: newVotes, fundReleaseId }) => {
        console.log('[BoardDashboard] Socket.IO voteMajorityReached', { updatedIdeaId, voteType, newVotes, fundReleaseId });
        if (
          updatedIdeaId === businessIdeaId &&
          Number.isInteger(newVotes)
        ) {
          setVotes((prev) => ({ ...prev, [voteType]: newVotes }));
          if (voteType === 'releaseFunds' && fundReleaseId) {
            setFundReleaseStatus('sent_to_admin');
            setFundReleases((prev) =>
              prev.map((fr) =>
                fr._id === fundReleaseId ? { ...fr, votes: newVotes, status: 'sent_to_admin' } : fr
              )
            );
            setNotificationMessage('Fund release approved! Sent to admin.');
          } else if (voteType === 'extendTime') {
            setNotificationMessage('Timeline extension approved! Deadline extended by 3 months.');
          } else if (voteType === 'refundInvestors') {
            setNotificationMessage('Refund process initiated for investors.');
          }
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      });
      socket.current.on('newFundRelease', ({ fundReleaseId, businessIdeaId: updatedIdeaId, bankName, accountName, accountNumber, amount, createdBy, votes, status }) => {
        console.log('[BoardDashboard] Socket.IO newFundRelease', { fundReleaseId, updatedIdeaId, bankName, accountName, amount, createdBy, votes, status });
        if (updatedIdeaId === businessIdeaId && fundReleaseId) {
          setFundReleases((prev) => [
            {
              _id: fundReleaseId,
              bankName,
              accountName,
              accountNumber,
              amount,
              votes: Number.isInteger(votes) ? votes : 0,
              status,
              createdBy,
            },
            ...prev,
          ]);
          setFundReleaseId(fundReleaseId);
          setFundReleaseStatus(status);
          setNewFundRelease(true);
          setNotificationMessage(`New fund release request by ${createdBy} for ${amount} ETB`);
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
            setNewFundRelease(false);
          }, 5000);
        }
      });
      socket.current.on('fundReleaseApproved', ({ fundReleaseId, businessIdeaId: updatedIdeaId, bankName, accountName, accountNumber, amount, votes }) => {
        console.log('[BoardDashboard] Socket.IO fundReleaseApproved', { fundReleaseId, updatedIdeaId, bankName, accountName, amount, votes });
        if (updatedIdeaId === businessIdeaId && fundReleaseId && Number.isInteger(votes)) {
          setFundReleaseStatus('approved');
          setVotes((prev) => ({ ...prev, releaseFunds: votes }));
          setFundReleases((prev) =>
            prev.map((fr) =>
              fr._id === fundReleaseId ? { ...fr, status: 'approved', votes } : fr
            )
          );
          setShowThankYouOverlay(true);
          setNotificationMessage('Fund release approved by admin!');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      });
      fetchFundReleases();
      fetchConversation();
      return () => {
        socket.current?.disconnect();
      };
    }
  }, [token, businessIdeaId, conversationId, fetchFundReleases, fetchConversation]);

  useEffect(() => {
    if (conversationId && isValidObjectId(conversationId)) {
      fetchMessages();
      if (socket.current && socket.current.connected) {
        socket.current.emit('joinRoom', `conversation:${conversationId}`);
      }
    }
  }, [conversationId, fetchMessages]);

  const fetchBoardMemberData = useCallback(async (ideaId) => {
    if (!ideaId || !isValidObjectId(ideaId) || !token) {
      console.warn('[BoardDashboard] fetchBoardMemberData: Invalid inputs', { ideaId, token });
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/board-member-database/${ideaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      console.log('[BoardDashboard] fetchBoardMemberData:', { data });
      setBoardMemberData(data);
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log('[BoardDashboard] Token payload:', { userId: tokenPayload.userId });
      if (data.entrepreneur && tokenPayload.userId === data.entrepreneur.userId) {
        setCurrentUser(data.entrepreneur.fullName || data.entrepreneur.email || 'Unknown User');
        setUserInitials(getInitials(data.entrepreneur.fullName || data.entrepreneur.email).initials);
      } else {
        setCurrentUser(tokenPayload.fullName || tokenPayload.email || 'Unknown User');
        setUserInitials(getInitials(tokenPayload.fullName || tokenPayload.email).initials);
      }
    } catch (error) {
      console.error('[BoardDashboard] fetchBoardMemberData error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Failed to load board member data.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }, 3000);
            break;
          case 403:
            errorMessage = 'You are not authorized to view board data.';
            break;
          case 404:
            errorMessage = 'Board data not found for this business idea.';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const checkIsEntrepreneur = useCallback(() => {
    if (passedIsEntrepreneur !== undefined) {
      setIsEntrepreneur(passedIsEntrepreneur);
      console.log('[BoardDashboard] checkIsEntrepreneur: Using passedIsEntrepreneur', { passedIsEntrepreneur });
      return;
    }
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.userId;
      const isEnt = boardMemberData?.entrepreneur?._id === userId;
      setIsEntrepreneur(isEnt);
      console.log('[BoardDashboard] checkIsEntrepreneur:', { userId, entrepreneurId: boardMemberData?.entrepreneur?._id, isEnt });
    } catch (error) {
      setIsEntrepreneur(false);
      console.error('[BoardDashboard] checkIsEntrepreneur error:', { message: error.message });
    }
  }, [passedIsEntrepreneur, boardMemberData, token]);

  useEffect(() => {
    if (businessIdeaId && isValidObjectId(businessIdeaId)) {
      fetchBoardMemberData(businessIdeaId);
    }
  }, [businessIdeaId, fetchBoardMemberData]);

  useEffect(() => {
    if (boardMemberData) {
      checkIsEntrepreneur();
    }
  }, [boardMemberData, checkIsEntrepreneur]);

  useEffect(() => {
    if (chatRef.current && activeTab === 'discussion' && messages.length > 0) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  useEffect(() => {
    if (fundReleases.length > 0 && fundReleases[0].status === 'approved') {
      setShowThankYouOverlay(true);
    }
  }, [fundReleases]);

  const getInitials = (name) => {
    if (!name) return { initials: '?', color: 'bg-gray-500' };
    const initials = name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600', 'bg-yellow-600'];
    const colorIndex = name.length % colors.length;
    return { initials, color: colors[colorIndex] };
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setNotificationMessage('Message cannot be empty.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    if (!conversationId || !isValidObjectId(conversationId)) {
      setNotificationMessage('Cannot send message: No conversation loaded. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      fetchConversation();
      return;
    }
    try {
      console.log('[BoardDashboard] handleSendMessage: Sending request', { conversationId, text: newMessage.substring(0, 50) });
      const response = await axios.post(
        `${API_URL}/board/message`,
        { conversationId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[BoardDashboard] handleSendMessage response:', response.data);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('[BoardDashboard] handleSendMessage error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = 'Failed to send message.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            setTimeout(() => {
              localStorage.removeItem('authToken');
              navigate('/login');
            }, 3000);
            break;
          case 403:
            errorMessage = 'You are not authorized to send messages in this conversation.';
            break;
          case 404:
            errorMessage = 'Conversation not found. Please try again.';
            setConversationId(null);
            fetchConversation();
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      }
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleVote = async (type) => {
    console.log('[BoardDashboard] handleVote called', { type, isEntrepreneur, fundReleaseId, fundReleases });
    if (isEntrepreneur) {
      setNotificationMessage('Entrepreneurs cannot vote.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }
    try {
      const response = await axios.post(
        `${API_URL}/fund-release/vote`,
        { businessIdeaId, voteType: type, fundReleaseId: type === 'releaseFunds' ? fundReleaseId : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVotes((prev) => ({
        ...prev,
        [type]: Number.isInteger(response.data.votes) ? response.data.votes : prev[type],
      }));
      if (type === 'releaseFunds' && response.data.status) {
        setFundReleaseStatus(response.data.status);
        setFundReleases((prev) =>
          prev.map((fr) =>
            fr._id === fundReleaseId ? { ...fr, status: response.data.status, votes: response.data.votes } : fr
          )
        );
      }
      setNotificationMessage('Vote recorded successfully');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('[BoardDashboard] handleVote error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setNotificationMessage(error.response?.data?.message || 'Failed to cast vote');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const handleExtendTimelineVote = () => {
    handleVote('extendTime');
    setShowExtendTimelineModal(true);
  };

  const handleRefundInvestorsVote = () => {
    handleVote('refundInvestors');
    setShowRefundInvestorsModal(true);
  };

  const handleContactAdmin = async () => {
    try {
      await axios.post(
        `${API_URL}/contact-admin`,
        { businessIdeaId, message: 'Complaint regarding fund release' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotificationMessage('Your message has been sent to the admin.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('[BoardDashboard] handleContactAdmin error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setNotificationMessage('Failed to contact admin. Please try again.');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const chairman = boardMemberData?.investors?.find((member) => member.role?.includes('Chairman')) ||
    (boardMemberData?.entrepreneur?.fullName === currentUser ? boardMemberData?.entrepreneur : null);

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Project Overview</h2>
                  <p className="text-gray-600">
                    Total Investment:{' '}
                    {(startupData?.fundingRaised || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                  </p>
                  <p className="text-gray-600">Required Votes for Approval: {Math.ceil((boardMemberData?.investors?.length || 4) * VOTE_THRESHOLD)}/{boardMemberData?.investors?.length || 4}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {isEntrepreneur && (
                    <button
                      onClick={() => setActiveSection('releaseForm')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition duration-300 shadow-md"
                      aria-label="Request fund release"
                    >
                      <DollarSign size={18} />
                      Request Fund Release
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Board Members</h2>
                {boardMemberData ? (
                  <div className="space-y-4">
                    {boardMemberData.entrepreneur && (
                      <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-500 transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${getInitials(boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email).color}`}
                          >
                            {getInitials(boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email).initials}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email}</h3>
                                <p className="text-sm text-gray-600">Entrepreneur</p>
                                <p className="text-sm text-gray-500">{boardMemberData.entrepreneur.email}</p>
                              </div>
                              <button
                                onClick={() => setSelectedMember({
                                  ...boardMemberData.entrepreneur,
                                  image: getInitials(boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email),
                                  type: 'Entrepreneur',
                                  shares: 0,
                                  amount: 0,
                                  equityPercentage: 0
                                })}
                                className="p-2 rounded-full hover:bg-gray-100"
                                aria-label={`View details for ${boardMemberData.entrepreneur.fullName || boardMemberData.entrepreneur.email}`}
                              >
                                <Info size={20} className="text-blue-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {boardMemberData.investors?.length > 0 ? (
                      <>
                        {boardMemberData.investors
                          .filter((investor) => investor.email === 'girma@gmail.com' || showAllInvestors)
                          .map((investor, index) => (
                            <div
                              key={index}
                              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-blue-500 transform hover:scale-105 transition-all duration-300"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-medium ${getInitials(investor.fullName || investor.email).color}`}
                                >
                                  {getInitials(investor.fullName || investor.email).initials}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <h3 className="font-semibold text-lg text-gray-900">{investor.fullName || investor.email}</h3>
                                      <p className="text-sm text-gray-600">Investor</p>
                                      <p className="text-sm text-gray-500">{investor.email}</p>
                                      <p className="text-sm text-gray-600">
                                        Investment: {(investor.amount || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                                      </p>
                                      <p className="text-sm text-gray-600">Shares: {investor.shares || 0}</p>
                                      <p className="text-sm text-gray-600">
                                        Equity: {investor.equityPercentage ? `${(investor.equityPercentage * 100).toFixed(1)}%` : 'N/A'}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => setSelectedMember({
                                        ...investor,
                                        image: getInitials(investor.fullName || investor.email),
                                        type: 'Investor'
                                      })}
                                      className="p-2 rounded-full hover:bg-gray-100"
                                      aria-label={`View details for ${investor.fullName || investor.email}`}
                                    >
                                      <Info size={20} className="text-blue-600" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        <button
                          onClick={() => setShowAllInvestors(!showAllInvestors)}
                          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full justify-center shadow-md transition duration-300"
                          aria-label={showAllInvestors ? 'Hide additional investors' : 'Show all investors'}
                        >
                          <Users size={18} />
                          {showAllInvestors ? 'Hide Additional Investors' : 'Show All Investors'}
                        </button>
                      </>
                    ) : (
                      <p className="text-gray-600">No investors found.</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600 mx-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-label="Loading board members"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="mt-4 text-gray-600">Loading board members...</p>
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setActiveTab('discussion')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      activeTab === 'discussion' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    } transition duration-300`}
                    aria-label="Switch to discussion tab"
                  >
                    <MessageSquare size={20} />
                    Discussion
                  </button>
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      activeTab === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    } transition duration-300`}
                    aria-label="Switch to video meeting tab"
                  >
                    <Video size={20} />
                    Video Meeting
                  </button>
                </div>
                <div className="h-96 bg-gray-50 rounded-lg">
                  {activeTab === 'discussion' ? (
                    <div className="h-full flex flex-col p-4">
                      <div className="flex-1 overflow-y-auto mb-4" ref={chatRef}>
                        {messages.length > 0 ? (
                          messages.map((message) => (
                            <div key={message.id} className="mb-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${getInitials(message.user).color}`}
                                >
                                  {getInitials(message.user).initials}
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">{message.user}</span>
                                  <span className="text-sm text-gray-500 ml-2">{message.time}</span>
                                </div>
                              </div>
                              <div className="ml-10 mt-1 p-2 bg-white rounded-lg shadow-sm text-gray-900">
                                {message.text}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">No messages yet. Start the conversation!</p>
                          </div>
                        )}
                      </div>
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder={conversationId ? 'Type your message...' : 'Chat unavailable: Loading conversation...'}
                          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                          disabled={!conversationId}
                          aria-label="Type your message"
                        />
                        <button
                          type="submit"
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-300"
                          disabled={!conversationId}
                          aria-label="Send message"
                        >
                          <Send size={20} />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <Video size={48} className="text-gray-400 mb-4" />
                      <button
                        onClick={() => {
                          const params = new URLSearchParams({
                            roomID: randomID(5),
                            startupId: startupId || '',
                            userId: userId || '',
                            isEntrepreneur: isEntrepreneur.toString(),
                            userRole: userRole || '',
                            businessIdeaId: businessIdeaId || '',
                          }).toString();
                          const videoCallUrl = `/VideoCall?${params}`;
                          window.open(videoCallUrl, '_blank');
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition duration-300"
                        aria-label="Join video meeting"
                      >
                        Join Video Meeting
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Board Voting</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FundReleaseVoting
                  fundReleases={fundReleases}
                  fundReleaseId={fundReleaseId}
                  fundReleaseStatus={fundReleaseStatus}
                  votes={votes}
                  boardMemberData={boardMemberData}
                  isEntrepreneur={isEntrepreneur}
                  newFundRelease={newFundRelease}
                  token={token}
                  businessIdeaId={businessIdeaId}
                  setNotificationMessage={setNotificationMessage}
                  setShowNotification={setShowNotification}
                  setVotes={setVotes}
                  setFundReleaseStatus={setFundReleaseStatus}
                  setFundReleases={setFundReleases}
                  API_URL={API_URL}
                  handleVote={handleVote}
                  setShowFundReleaseDetails={setShowFundReleaseDetails}
                />
                <div className="p-6 border rounded-lg transition-colors border-gray-200 bg-white shadow-md hover:shadow-lg">
                  <div className="mb-3 text-center">
                    <Clock className="mx-auto mb-2 text-yellow-500" size={24} />
                    <h3 className="font-semibold text-gray-900 text-lg">Extend Timeline</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      When voting to extend timeline, the current project deadline will be extended by 3 months to allow more time for development and milestones.
                    </p>
                  </div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 rounded-full h-2"
                      style={{ width: `${(votes['extendTime'] / (boardMemberData?.investors?.length || 4)) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    <strong>Votes: {votes['extendTime']}/{boardMemberData?.investors?.length || 4}</strong>
                  </p>
                  {!isEntrepreneur && (
                    <button
                      onClick={handleExtendTimelineVote}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full shadow-md transition duration-300"
                      aria-label="Vote to extend timeline"
                    >
                      Vote
                    </button>
                  )}
                </div>
                <div className="p-6 border rounded-lg transition-colors border-gray-200 bg-white shadow-md hover:shadow-lg">
                  <div className="mb-3 text-center">
                    <Activity className="mx-auto mb-2 text-red-500" size={24} />
                    <h3 className="font-semibold text-gray-900 text-lg">Refund Investors</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      In case of project failure or strategic pivot, voting for refund will initiate the process to return available funds to investors.
                    </p>
                  </div>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 rounded-full h-2"
                      style={{ width: `${(votes['refundInvestors'] / (boardMemberData?.investors?.length || 4)) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    <strong>Votes: {votes['refundInvestors']}/{boardMemberData?.investors?.length || 4}</strong>
                  </p>
                  {!isEntrepreneur && (
                    <button
                      onClick={handleRefundInvestorsVote}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full shadow-md transition duration-300"
                      aria-label="Vote to refund investors"
                    >
                      Vote
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case 'releaseForm':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Request Fund Release</h2>
              <button 
                onClick={() => setActiveSection('dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition duration-300"
                aria-label="Cancel fund release request"
              >
                Cancel
              </button>
            </div>
            <FundReleaseForm
              businessIdeaId={businessIdeaId}
              token={token}
              startupData={startupData}
              setActiveSection={setActiveSection}
              setNotificationMessage={setNotificationMessage}
              setShowNotification={setShowNotification}
              fetchFundReleases={fetchFundReleases}
              API_URL={API_URL}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
      <svg
        className="animate-spin h-12 w-12 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
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

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {loading && <LoadingSpinner />}
      {showThankYouOverlay && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50" aria-modal="true" role="dialog">
          <div className="text-center text-white p-8 bg-white/10 rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Thank You for Using EthioCapital</h3>
            <p className="text-lg mb-4">
              Investment Amount Released: {fundReleases[0]?.amount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' }) || 'N/A'}
            </p>
            <p className="text-sm mb-6">If you have any complaints, please contact the admin.</p>
            <button
              onClick={handleContactAdmin}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
              aria-label="Contact admin for complaints"
            >
              Contact Admin
            </button>
          </div>
        </div>
      )}
      
      {/* Top Navigation Bar */}
      <div className="bg-blue-600 shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-1 bg-blue-700 hover:bg-blue-800 rounded-full text-white transition duration-300"
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">{startupData?.title || 'Project Name'}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {isEntrepreneur && (
              <button
                onClick={() => setActiveSection('releaseForm')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white ${
                  activeSection === 'releaseForm' ? 'bg-blue-800' : 'hover:bg-blue-700'
                } transition duration-300`}
                aria-label="Request fund release"
              >
                <DollarSign size={18} />
                <span className="hidden md:inline">Request Fund Release</span>
              </button>
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-md font-medium ${currentUser ? getInitials(currentUser).color : 'bg-gray-500'}`}
              >
                {userInitials}
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-white">{currentUser || 'User'}</p>
                <p className="text-xs text-blue-200">{userRole || 'Board Member'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto p-6">
        {showNotification && (
          <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg flex items-center gap-2 shadow-md" role="alert">
            <CheckCircle size={20} />
            {notificationMessage}
          </div>
        )}
        {renderMainContent()}
      </div>
      
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedMember.fullName || selectedMember.email}</h3>
              <button 
                onClick={() => setSelectedMember(null)} 
                className="p-2 rounded-full hover:bg-gray-100 transition duration-300"
                aria-label="Close member details"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-medium ${selectedMember.image.color}`}
                >
                  {selectedMember.image.initials}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedMember.type}</p>
                  <p className="text-sm text-gray-600">Email: {selectedMember.email}</p>
                </div>
              </div>
              {selectedMember.type === 'Investor' && (
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <p className="text-sm text-gray-600">Investment</p>
                    <p className="font-medium text-gray-900">
                      {(selectedMember.amount || 0).toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                    </p>
                  </div>
                  <div className="flex justify-between border-b border-gray-200 pb-2">
                    <p className="text-sm text-gray-600">Shares</p>
                    <p className="font-medium text-gray-900">{selectedMember.shares || 0}</p>
                  </div>
                  <div className="flex justify-between pb-2">
                    <p className="text-sm text-gray-600">Equity Percentage</p>
                    <p className="font-medium text-gray-900">
                      {selectedMember.equityPercentage ? `${(selectedMember.equityPercentage * 100).toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              )}
              {selectedMember.type === 'Entrepreneur' && (
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium text-gray-900">Entrepreneur</p>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                  onClick={() => setSelectedMember(null)}
                  aria-label="Close"
                >
                  Close
                </button>
                <button
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                  aria-label={`Message ${selectedMember.fullName || selectedMember.email}`}
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showFundReleaseDetails && fundReleases[0] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-describedby="fund-release-details-description">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Fund Release Details</h3>
              <button
                onClick={() => setShowFundReleaseDetails(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-300"
                aria-label="Close fund release details"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Transfer Details</h4>
              <p id="fund-release-details-description" className="text-sm text-gray-600">
                <strong>Purpose:</strong> Project funding release
              </p>
              <p className="text-sm text-gray-600">
                <strong>Bank:</strong> {fundReleases[0].bankName || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Account Name:</strong> {fundReleases[0].accountName || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Account Number:</strong> {fundReleases[0].accountNumber || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Amount:</strong>{' '}
                {fundReleases[0].amount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' }) || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Status:</strong> {fundReleaseStatus || 'Pending'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Votes:</strong> {votes['releaseFunds']}/{boardMemberData?.investors?.length || 4}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFundReleaseDetails(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                aria-label="Close fund release details"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showExtendTimelineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-describedby="extend-timeline-description">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vote for Timeline Extension</h3>
              <button
                onClick={() => setShowExtendTimelineModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-300"
                aria-label="Close timeline extension modal"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <p id="extend-timeline-description" className="text-sm text-gray-600 mb-6">
              Your vote for extending the timeline has been recorded. The project deadline will be extended by 3 months when sufficient votes ({Math.ceil((boardMemberData?.investors?.length || 4) * VOTE_THRESHOLD)}/{boardMemberData?.investors?.length || 4}) are reached.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowExtendTimelineModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                aria-label="Cancel timeline extension vote"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowExtendTimelineModal(false)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                aria-label="Confirm timeline extension vote"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundInvestorsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-describedby="refund-investors-description">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Vote for Refund Investors</h3>
              <button
                onClick={() => setShowRefundInvestorsModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition duration-300"
                aria-label="Close refund investors modal"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <p id="refund-investors-description" className="text-sm text-gray-600 mb-6">
              Your vote for refunding investors has been recorded. The refund process will initiate when sufficient votes ({Math.ceil((boardMemberData?.investors?.length || 4) * VOTE_THRESHOLD)}/{boardMemberData?.investors?.length || 4}) are reached.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowRefundInvestorsModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-300"
                aria-label="Cancel refund investors vote"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowRefundInvestorsModal(false)}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                aria-label="Confirm refund investors vote"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardDashboard;