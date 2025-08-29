
// import React, { useState, useEffect, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { motion } from 'framer-motion';
// import {
//   Crown, Gem, Award, CheckCircle2, XCircle, X, ChevronRight,
//   Heart, Clock, ShieldAlert, Users, DollarSign, Briefcase, MapPin,
//   FileText, Target, Lightbulb, TrendingUp, Calendar, UsersRound, Paperclip
// } from 'lucide-react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// // API base URL from environment variable
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ethiocapital-back.onrender.com/api/v1';

// const RankBadge = ({ rank, darkMode }) => {
//   if (!rank) return null;

//   const badges = {
//     Gold: {
//       color: darkMode ? 'bg-amber-900 text-amber-400' : 'bg-amber-100 text-amber-900',
//       icon: <Crown className={`w-4 h-4 mr-1 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`} />,
//       text: 'GOLD'
//     },
//     Silver: {
//       color: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900',
//       icon: <Gem className={`w-4 h-4 mr-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />,
//       text: 'SILVER'
//     },
//     Bronze: {
//       color: darkMode ? 'bg-amber-800 text-amber-200' : 'bg-amber-200 text-amber-900',
//       icon: <Award className={`w-4 h-4 mr-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`} />,
//       text: 'BRONZE'
//     }
//   };

//   const badge = badges[rank] || badges.Silver;

//   return (
//     <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
//       {badge.icon}
//       {badge.text}
//     </span>
//   );
// };

// RankBadge.propTypes = {
//   rank: PropTypes.string,
//   darkMode: PropTypes.bool.isRequired
// };

// const StatusBadge = ({ status, darkMode }) => {
//   const badges = {
//     approved: {
//       color: darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-800',
//       icon: <CheckCircle2 className={`w-4 h-4 mr-1 ${darkMode ? 'text-green-400' : 'text-green-700'}`} />,
//       text: 'APPROVED'
//     },
//     pending: {
//       color: darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
//       icon: <Clock className={`w-4 h-4 mr-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`} />,
//       text: 'PENDING'
//     },
//     rejected: {
//       color: darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-800',
//       icon: <ShieldAlert className={`w-4 h-4 mr-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`} />,
//       text: 'REJECTED'
//     }
//   };

//   const badge = badges[status.toLowerCase()] || badges.pending;

//   return (
//     <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
//       {badge.icon}
//       {badge.text}
//     </span>
//   );
// };

// StatusBadge.propTypes = {
//   status: PropTypes.string.isRequired,
//   darkMode: PropTypes.bool.isRequired
// };

// export const IdeaCard = ({ idea, onViewDetails, darkMode }) => {
//   return (
//     <motion.div
//       whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
//       className={`rounded-xl overflow-hidden border transition-all
//                 ${darkMode
//                     ? 'bg-gray-800 border-gray-700 hover:border-indigo-500'
//                     : 'bg-white border-gray-100 hover:border-indigo-300'}`}
//     >
//       <div className="relative h-2">
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600"
//           initial={{ width: 0 }}
//           animate={{ width: "100%" }}
//           transition={{ duration: 0.5 }}
//         />
//       </div>
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//               {idea.title}
//             </h3>
//             <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
//               <Users className="w-4 h-4 mr-1" />
//               <p>{idea.entrepreneurName}</p>
//             </div>
//             <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
//               <MapPin className="w-4 h-4 mr-1" />
//               <p>{idea.entrepreneurLocation}</p>
//             </div>
//           </div>
//           <div className="flex flex-col items-end gap-2">
//             <StatusBadge status={idea.approvalStatus} darkMode={darkMode} />
//             {idea.ranking && <RankBadge rank={idea.ranking} darkMode={darkMode} />}
//           </div>
//         </div>

//         <p className={`text-sm line-clamp-3 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//           {idea.overview}
//         </p>

//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className={`px-2 py-1 rounded text-xs font-medium flex items-center
//                       ${darkMode 
//                         ? 'bg-blue-900 text-blue-300' 
//                         : 'bg-blue-50 text-blue-700'}`}
//           >
//             <Briefcase className="w-3 h-3 mr-1" />
//             {idea.businessCategory}
//           </span>
//           <span className={`px-2 py-1 rounded text-xs font-medium flex items-center
//                       ${darkMode 
//                         ? 'bg-green-900 text-green-300' 
//                         : 'bg-green-50 text-green-700'}`}
//           >
//             <DollarSign className="w-3 h-3 mr-1" />
//             ${idea.fundingNeeded}
//           </span>
//         </div>

//         <div className="flex items-center justify-between text-sm">
//           <div className={`flex items-center ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
//             <Heart className="w-4 h-4 mr-1" />
//             <span>{idea.interestedInvestors || 0}</span>
//           </div>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={onViewDetails}
//             className={`px-3 py-1.5 rounded-lg font-medium flex items-center
//                   ${darkMode 
//                     ? 'bg-indigo-900 text-indigo-400 hover:bg-indigo-800' 
//                     : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
//           >
//             <span>View Details</span>
//             <ChevronRight className="w-4 h-4 ml-1" />
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// IdeaCard.propTypes = {
//   idea: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     entrepreneurName: PropTypes.string.isRequired,
//     entrepreneurLocation: PropTypes.string,
//     approvalStatus: PropTypes.string.isRequired,
//     ranking: PropTypes.string,
//     overview: PropTypes.string,
//     businessCategory: PropTypes.string,
//     fundingNeeded: PropTypes.number,
//     interestedInvestors: PropTypes.number
//   }).isRequired,
//   onViewDetails: PropTypes.func.isRequired,
//   darkMode: PropTypes.bool.isRequired
// };

// const StarAnimation = ({ visible, color }) => {
//   return (
//     <motion.div
//       className={`absolute inset-0 flex items-center justify-center z-10 ${
//          !visible && 'pointer-events-none'
//        }`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: visible ? 1 : 0 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         initial={{ scale: 0 }}
//         animate={visible ? {
//           scale: [0, 1.2, 1],
//           rotate: [0, 10, -10, 0]
//         } : { scale: 0 }}
//         transition={{ duration: 0.5, ease: "easeInOut" }}
//         className="relative"
//       >
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, scale: 0 }}
//             animate={visible ? {
//               opacity: [0, 1, 0],
//               scale: [0, 1, 0],
//               x: [0, Math.cos(i * 18 * Math.PI/180) * 100],
//               y: [0, Math.sin(i * 18 * Math.PI/180) * 100]
//             } : {}}
//             transition={{
//               delay: 0.2,
//               duration: 0.8,
//               ease: "easeOut"
//             }}
//             className={`absolute w-3 h-3 rounded-full ${color}`}
//             style={{ top: '50%', left: '50%', marginLeft: '-6px', marginTop: '-6px' }}
//           />
//         ))}
//         <motion.div
//           animate={visible ? {
//             scale: [1, 1.2, 1],
//             rotate: [0, 360],
//           } : {}}
//           transition={{
//             duration: 1,
//             ease: "easeInOut",
//             repeat: visible ? 1 : 0,
//           }}
//         >
//           <Award className={`w-20 h-20 ${color} drop-shadow-lg`} />
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// };

// StarAnimation.propTypes = {
//   visible: PropTypes.bool.isRequired,
//   color: PropTypes.string.isRequired
// };

// const ConfettiAnimation = ({ visible }) => {
//   return (
//     <motion.div
//       className="absolute inset-0 pointer-events-none overflow-hidden"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: visible ? 1 : 0 }}
//       exit={{ opacity: 0 }}
//     >
//       {visible && [...Array(50)].map((_, i) => {
//         const randomX = Math.random() * 100;
//         const randomSize = Math.random() * 10 + 5;
//         const randomRotation = Math.random() * 360;
//         const randomColor = [
//           'bg-red-500', 'bg-blue-500', 'bg-green-500',
//           'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
//         ][Math.floor(Math.random() * 6)];

//         return (
//           <motion.div
//             key={i}
//             className={`absolute ${randomColor}`}
//             style={{ 
//               left: `${randomX}%`,
//               width: `${randomSize}px`,
//               height: `${randomSize}px`
//             }}
//             initial={{ 
//               y: -20, 
//               rotate: randomRotation,
//               opacity: 1
//             }}
//             animate={{ 
//               y: '120vh',
//               rotate: randomRotation + 360,
//               opacity: [1, 1, 0]
//             }}
//             transition={{
//               duration: Math.random() * 3 + 2,
//               ease: "linear"
//             }}
//           />
//         );
//       })}
//     </motion.div>
//   );
// };

// ConfettiAnimation.propTypes = {
//   visible: PropTypes.bool.isRequired
// };

// const RankSelection = ({ currentRank, onRankSelect, darkMode }) => {
//   return (
//     <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
//       <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//         Assign Medal Rank
//       </h3>
//       <div className="grid grid-cols-3 gap-3">
//         {[
//           { value: 'Gold', label: 'Gold', icon: Crown },
//           { value: 'Silver', label: 'Silver', icon: Gem },
//           { value: 'Bronze', label: 'Bronze', icon: Award }
//         ].map(({ value, label, icon: Icon }) => (
//           <motion.button
//             key={value}
//             whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => onRankSelect(value)}
//             className={`p-4 rounded-lg flex flex-col items-center transition-all
//                        ${currentRank === value
//                           ? (value === 'Gold'
//                              ? (darkMode ? 'bg-amber-900 ring-2 ring-amber-400' : 'bg-amber-100 ring-2 ring-amber-500')
//                              : value === 'Silver'
//                                ? (darkMode ? 'bg-gray-700 ring-2 ring-gray-400' : 'bg-gray-200 ring-2 ring-gray-400')
//                                : (darkMode ? 'bg-amber-800 ring-2 ring-amber-600' : 'bg-amber-200 ring-2 ring-amber-700'))
//                          : (darkMode
//                               ? 'bg-gray-700 hover:bg-gray-600'
//                               : 'bg-gray-100 hover:bg-gray-200')
//                        }`}
//           >
//             <Icon className={`w-8 h-8 mb-3 ${
//               value === 'Gold' 
//                 ? (darkMode ? 'text-amber-400' : 'text-amber-500')
//                 : value === 'Silver'
//                   ? (darkMode ? 'text-gray-300' : 'text-gray-500')
//                   : (darkMode ? 'text-amber-500' : 'text-amber-700')
//             }`} />
//             <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
//               {label} Medal
//             </span>
//           </motion.button>
//         ))}
//       </div>
//     </div>
//   );
// };

// RankSelection.propTypes = {
//   currentRank: PropTypes.string,
//   onRankSelect: PropTypes.func.isRequired,
//   darkMode: PropTypes.bool.isRequired
// };

// export const IdeaDetailModal = ({ idea, onClose, onStatusChange, darkMode }) => {
//   const navigate = useNavigate();
//   const [currentRank, setCurrentRank] = useState(idea.ranking || '');
//   const [showAnimation, setShowAnimation] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [animationColor, setAnimationColor] = useState('text-amber-500');
//   const [showRankSelection, setShowRankSelection] = useState(idea.approvalStatus === 'approved');
//   const [ideaStatus, setIdeaStatus] = useState(idea.approvalStatus);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Normalize documents from idea.documents object to array
//   const documents = useMemo(() => {
//     if (!idea.documents || typeof idea.documents !== 'object') {
//       return [];
//     }
//     return Object.entries(idea.documents).map(([key, url]) => ({
//       name: key
//         .replace(/([A-Z])/g, ' $1')
//         .replace(/^./, str => str.toUpperCase())
//         .trim(),
//       url,
//       type: url.split('.').pop()?.toLowerCase() || 'unknown',
//     }));
//   }, [idea.documents]);

//   const handleDocumentClick = (url) => {
//     if (url) {
//       const absoluteUrl = url.startsWith('http')
//         ? url
//         : `${API_BASE_URL.replace('/api/v1', '')}/${url}`;
//       window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
//     }
//   };

//   const handleRankSelect = async (rank) => {
//     setCurrentRank(rank);
//     setError('');

//     if (rank === 'Gold') {
//       setAnimationColor(darkMode ? 'text-amber-400' : 'text-amber-500');
//       setShowConfetti(true);
//     } else if (rank === 'Silver') {
//       setAnimationColor(darkMode ? 'text-gray-300' : 'text-gray-400');
//     } else if (rank === 'Bronze') {
//       setAnimationColor(darkMode ? 'text-amber-600' : 'text-amber-700');
//     }

//     setIsLoading(true);
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }
//       console.log('[IdeaDetailModal] Assigning rank:', { ideaId: idea._id, rank, token: token.slice(0, 20) + '...' });
//       await axios.put(`${API_BASE_URL}/approve-idea/${idea._id}`, {
//         approvalStatus: 'approved',
//         ranking: rank,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('[IdeaDetailModal] Rank assigned successfully');
//       setIsLoading(false);
//       setShowAnimation(true);

//       setTimeout(() => {
//         setShowAnimation(false);
//         setShowConfetti(false);
//         onStatusChange(idea._id, 'approved', rank);
//       }, 1500);
//     } catch (err) {
//       console.error('[IdeaDetailModal] Error assigning rank:', {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       let errorMsg = 'Failed to assign ranking. Please try again.';
//       if (err.response?.status === 401) {
//         errorMsg = 'Session expired. Please log in again.';
//         setTimeout(() => navigate('/login'), 3000);
//       } else if (err.response?.status === 403) {
//         errorMsg = 'You do not have permission to assign rankings.';
//       } else if (err.response?.status === 404) {
//         errorMsg = 'Idea not found. Please refresh and try again.';
//       }
//       setError(errorMsg);
//       setIsLoading(false);
//     }
//   };

//   const handleApprove = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }
//       console.log('[IdeaDetailModal] Approving idea:', { ideaId: idea._id, token: token.slice(0, 20) + '...' });
//       await axios.put(`${API_BASE_URL}/approve-idea/${idea._id}`, {
//         approvalStatus: 'approved',
//         ranking: currentRank || '',
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('[IdeaDetailModal] Idea approved successfully');
//       setIsLoading(false);
//       setIdeaStatus('approved');
//       setShowRankSelection(true);
//       onStatusChange(idea._id, 'approved', currentRank);
//     } catch (err) {
//       console.error('[IdeaDetailModal] Error approving idea:', {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       let errorMsg = 'Failed to approve idea. Please try again.';
//       if (err.response?.status === 401) {
//         errorMsg = 'Session expired. Please log in again.';
//         setTimeout(() => navigate('/login'), 3000);
//       } else if (err.response?.status === 403) {
//         errorMsg = 'You do not have permission to approve ideas.';
//       } else if (err.response?.status === 404) {
//         errorMsg = 'Idea not found. Please refresh and try again.';
//       }
//       setError(errorMsg);
//       setIsLoading(false);
//     }
//   };

//   const handleReject = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         throw new Error('No authentication token found');
//       }
//       console.log('[IdeaDetailModal] Rejecting idea:', { ideaId: idea._id, token: token.slice(0, 20) + '...' });
//       await axios.put(`${API_BASE_URL}/approve-idea/${idea._id}`, {
//         approvalStatus: 'rejected',
//         ranking: '',
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('[IdeaDetailModal] Idea rejected successfully');
//       setIsLoading(false);
//       setIdeaStatus('rejected');
//       setShowRankSelection(false);
//       setCurrentRank('');
//       onStatusChange(idea._id, 'rejected', '');
//     } catch (err) {
//       console.error('[IdeaDetailModal] Error rejecting idea:', {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       let errorMsg = 'Failed to reject idea. Please try again.';
//       if (err.response?.status === 401) {
//         errorMsg = 'Session expired. Please log in again.';
//         setTimeout(() => navigate('/login'), 3000);
//       } else if (err.response?.status === 403) {
//         errorMsg = 'You do not have permission to reject ideas.';
//       } else if (err.response?.status === 404) {
//         errorMsg = 'Idea not found. Please refresh and try again.';
//       }
//       setError(errorMsg);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//     >
//       <ConfettiAnimation visible={showConfetti} />
//       <motion.div
//         initial={{ scale: 0.95, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.95, y: 20 }}
//         className={`rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative
//                    ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
//       >
//         <StarAnimation visible={showAnimation} color={animationColor} />

//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
//           <div className="flex justify-between items-start">
//             <h2 className="text-2xl font-bold text-white">{idea.title}</h2>
//             <motion.button 
//               whileHover={{ scale: 1.1, rotate: 90 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={onClose}
//               className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </motion.button>
//           </div>
//           <div className="flex flex-wrap gap-3 mt-4">
//             <StatusBadge status={ideaStatus} darkMode={false} />
//             {currentRank && <RankBadge rank={currentRank} darkMode={false} />}
//           </div>
//         </div>

//         <div className={`p-6 overflow-y-auto max-h-[calc(90vh-180px)] ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
//           <div className="space-y-6">
//             {error && (
//               <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center">
//                 {error}
//                 {error.includes('Session expired') && (
//                   <button
//                     onClick={() => navigate('/login')}
//                     className="ml-2 text-indigo-500 hover:underline"
//                   >
//                     Log in
//                   </button>
//                 )}
//               </div>
//             )}

//             {/* Entrepreneur Information */}
//             <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg
//                             ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
//             >
//               <div>
//                 <h3 className={`font-medium mb-3 flex items-center
//                               ${darkMode ? 'text-white' : 'text-gray-900'}`}
//                 >
//                   <Users className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                   Entrepreneur Information
//                 </h3>
//                 <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <div className="flex items-center">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Name:</span>
//                     <span>{idea.entrepreneurName}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Location:</span>
//                     <span>{idea.entrepreneurLocation || 'Not specified'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Education:</span>
//                     <span>{idea.entrepreneurEducation || 'Not specified'}</span>
//                   </div>
//                   <div className="flex items-start">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Background:</span>
//                     <span>{idea.entrepreneurBackground || 'Not specified'}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Business Details */}
//               <div>
//                 <h3 className={`font-medium mb-3 flex items-center
//                               ${darkMode ? 'text-white' : 'text-gray-900'}`}
//                 >
//                   <Briefcase className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                   Business Details
//                 </h3>
//                 <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <div className="flex items-center">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Category:</span>
//                     <span>{idea.businessCategory || 'Not specified'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Stage:</span>
//                     <span>{idea.currentStage || 'Idea'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Market Size:</span>
//                     <span>{idea.marketSize || 'Not specified'}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Financial Overview */}
//             <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
//               <h3 className={`font-medium mb-3 flex items-center
//                             ${darkMode ? 'text-white' : 'text-gray-900'}`}
//               >
//                 <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Financial Overview
//               </h3>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-blue-900 text-blue-200' 
//                                   : 'bg-blue-50 text-blue-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
//                     Requested
//                   </p>
//                   <p className="font-semibold text-lg">${idea.fundingNeeded || 'N/A'}</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-green-900 text-green-200' 
//                                   : 'bg-green-50 text-green-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
//                     Raised
//                   </p>
//                   <p className="font-semibold text-lg">${idea.fundingRaised || '0'}</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-purple-900 text-purple-200' 
//                                   : 'bg-purple-50 text-purple-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
//                     Valuation
//                   </p>
//                   <p className="font-semibold text-lg">${idea.financials?.valuation || 'N/A'}</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-indigo-900 text-indigo-200' 
//                                   : 'bg-indigo-50 text-indigo-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
//                     Revenue 2023
//                   </p>
//                   <p className="font-semibold text-lg">${idea.financials?.revenue2023 || 'N/A'}</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-blue-900 text-blue-200' 
//                                   : 'bg-blue-50 text-blue-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
//                     Projected 2024
//                   </p>
//                   <p className="font-semibold text-lg">${idea.financials?.projectedRevenue2024 || 'N/A'}</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-green-900 text-green-200' 
//                                   : 'bg-green-50 text-green-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
//                     Break-even Point
//                   </p>
//                   <p className="font-semibold text-lg">${idea.financials?.breakEvenPoint || 'N/A'}</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-purple-900 text-purple-200' 
//                                   : 'bg-purple-50 text-purple-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
//                     Entrepreneur Equity
//                   </p>
//                   <p className="font-semibold text-lg">${idea.entrepreneurEquity || 'N/A'}%</p>
//                 </div>
//                 <div className={`p-4 rounded-lg transition-all hover:scale-105
//                                 ${darkMode 
//                                   ? 'bg-indigo-900 text-indigo-200' 
//                                   : 'bg-indigo-50 text-indigo-900'}`}
//                 >
//                   <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
//                     Investor Equity
//                   </p>
//                   <p className="font-semibold text-lg">${idea.investorEquity || 'N/A'}%</p>
//                 </div>
//               </div>
//             </div>

//             {/* Business Overview */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <FileText className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Business Overview
//               </h3>
//               <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {idea.overview || 'Not provided'}
//               </p>
//             </div>

//             {/* Problem Statement */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <Target className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Problem Statement
//               </h3>
//               <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {idea.problemStatement || 'Not provided'}
//               </p>
//             </div>

//             {/* Solution */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <Lightbulb className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Solution
//               </h3>
//               <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {idea.solution || 'Not provided'}
//               </p>
//             </div>

//             {/* Use of Funds */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Use of Funds
//               </h3>
//               {idea.useOfFunds && idea.useOfFunds.length > 0 ? (
//                 <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                   {idea.useOfFunds.map((use, index) => (
//                     <li key={index}>{use}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not provided</p>
//               )}
//             </div>

//             {/* Traction */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <TrendingUp className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Traction
//               </h3>
//               {idea.traction && idea.traction.length > 0 ? (
//                 <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                   {idea.traction.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not provided</p>
//               )}
//             </div>

//             {/* Team */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <UsersRound className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Team
//               </h3>
//               {idea.team && idea.team.length > 0 ? (
//                 <div className="space-y-2">
//                   {idea.team.map((member, index) => (
//                     <div key={index} className={`p-3 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
//                       <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//                         {member.name || 'Not specified'}
//                       </p>
//                       <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                         Role: {member.role || 'Not specified'}
//                       </p>
//                       <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                         Expertise: {member.expertise || 'Not specified'}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No team members provided</p>
//               )}
//             </div>

//             {/* Documents */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <Paperclip className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Documents
//               </h3>
//               {documents.length > 0 ? (
//                 <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   {documents.map((doc, index) => (
//                     <div key={index} className="flex items-center">
//                       <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-40`}>{doc.name}:</span>
//                       <button
//                         onClick={() => handleDocumentClick(doc.url)}
//                         className="text-indigo-500 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
//                         disabled={!doc.url}
//                       >
//                         View
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No documents available</p>
//               )}
//             </div>

//             {/* Investment Timeline */}
//             <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//               <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                 <Calendar className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
//                 Investment Timeline
//               </h3>
//               <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                 {idea.investmentTimeline || 'Not provided'}
//               </p>
//             </div>

//             {/* Status Management or Rank Selection */}
//             {showRankSelection ? (
//               <RankSelection 
//                 currentRank={currentRank} 
//                 onRankSelect={handleRankSelect}
//                 darkMode={darkMode}
//               />
//             ) : (
//               <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
//                 <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                   Status Management
//                 </h3>
//                 <div className="flex gap-3">
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleApprove}
//                     disabled={isLoading}
//                     className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
//                               ${isLoading 
//                                 ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500')
//                                 : (darkMode 
//                                     ? 'bg-green-800 text-green-200 hover:bg-green-700' 
//                                     : 'bg-green-600 text-white hover:bg-green-700')
//                               }`}
//                   >
//                     {isLoading ? (
//                       <CheckCircle2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <>
//                         <CheckCircle2 className="w-5 h-5" />
//                         Approve Idea
//                       </>
//                     )}
//                   </motion.button>
//                   <motion.button
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={handleReject}
//                     disabled={isLoading}
//                     className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
//                               ${isLoading 
//                                 ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500')
//                                 : (darkMode 
//                                     ? 'bg-red-800 text-red-200 hover:bg-red-700' 
//                                     : 'bg-red-600 text-white hover:bg-red-700')
//                               }`}
//                   >
//                     {isLoading ? (
//                       <XCircle className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <>
//                         <XCircle className="w-5 h-5" />
//                         Reject Idea
//                       </>
//                     )}
//                   </motion.button>
//                 </div>
//               </div>
//             )}

//             {ideaStatus === 'approved' && !showAnimation && !currentRank && (
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`p-4 rounded-lg text-center
//                           ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}
//               >
//                 <p className={`mb-2 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
//                   Idea approved! Please select a medal rank.
//                 </p>
//                 <CheckCircle2 className={`w-6 h-6 mx-auto ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// IdeaDetailModal.propTypes = {
//   idea: PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     entrepreneurName: PropTypes.string.isRequired,
//     entrepreneurLocation: PropTypes.string,
//     entrepreneurEducation: PropTypes.string,
//     entrepreneurBackground: PropTypes.string,
//     approvalStatus: PropTypes.string.isRequired,
//     ranking: PropTypes.string,
//     overview: PropTypes.string,
//     businessCategory: PropTypes.string,
//     fundingNeeded: PropTypes.number,
//     fundingRaised: PropTypes.number,
//     currentStage: PropTypes.string,
//     marketSize: PropTypes.string,
//     financials: PropTypes.shape({
//       valuation: PropTypes.number,
//       revenue2023: PropTypes.number,
//       projectedRevenue2024: PropTypes.number,
//       breakEvenPoint: PropTypes.number,
//     }),
//     entrepreneurEquity: PropTypes.number,
//     investorEquity: PropTypes.number,
//     problemStatement: PropTypes.string,
//     solution: PropTypes.string,
//     useOfFunds: PropTypes.arrayOf(PropTypes.string),
//     traction: PropTypes.arrayOf(PropTypes.string),
//     team: PropTypes.arrayOf(PropTypes.shape({
//       name: PropTypes.string,
//       role: PropTypes.string,
//       expertise: PropTypes.string,
//     })),
//     documents: PropTypes.object,
//     investmentTimeline: PropTypes.string,
//   }).isRequired,
//   onClose: PropTypes.func.isRequired,
//   onStatusChange: PropTypes.func.isRequired,
//   darkMode: PropTypes.bool.isRequired
// };

// export const UserListModal = ({ onClose, darkMode, initialRoleFilter = 'all' }) => {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filterRole, setFilterRole] = useState(initialRoleFilter);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       setIsLoading(true);
//       setError('');
//       try {
//         const token = localStorage.getItem('authToken');
//         if (!token) {
//           throw new Error('No authentication token found');
//         }
//         const url = `${API_BASE_URL}/users${filterRole !== 'all' ? `?role=${filterRole}` : ''}`;
//         console.log('[UserListModal] Fetching users:', { url, token: token.slice(0, 20) + '...' });
//         const response = await axios.get(url, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log('[UserListModal] Users response:', response.data);
//         if (Array.isArray(response.data)) {
//           setUsers(response.data);
//           setFilteredUsers(response.data);
//         } else {
//           setError('Invalid data format from server. Please try again later.');
//         }
//       } catch (err) {
//         console.error('[UserListModal] Error fetching users:', {
//           message: err.message,
//           status: err.response?.status,
//           data: err.response?.data,
//         });
//         let errorMsg = 'Failed to load users. Please try again later.';
//         if (err.response) {
//           if (err.response.status === 401) {
//             errorMsg = 'Session expired. Please log in again.';
//             setTimeout(() => navigate('/login'), 3000);
//           } else if (err.response.status === 403) {
//             errorMsg = 'You do not have permission to view users.';
//             setTimeout(() => navigate('/login'), 3000);
//           } else if (err.response.status === 404) {
//             errorMsg = 'Users endpoint not found. Check server configuration.';
//           } else {
//             errorMsg = err.response.data?.message || errorMsg;
//           }
//         } else if (err.request) {
//           errorMsg = 'No response from server. Check your network or server status.';
//         }
//         setError(errorMsg);
//         setUsers([]);
//         setFilteredUsers([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchUsers();
//   }, [navigate, filterRole]);

//   // Update filtered users when filterRole changes
//   useEffect(() => {
//     setFilterRole(initialRoleFilter);
//   }, [initialRoleFilter]);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.95, y: 20 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.95, y: 20 }}
//         className={`rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative
//           ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
//           <div className="flex justify-between items-start">
//             <h2 className="text-2xl font-bold text-white">Entrepreneurs & Investors</h2>
//             <motion.button
//               whileHover={{ scale: 1.1, rotate: 90 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={onClose}
//               className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
//             >
//               <X className="w-5 h-5" />
//             </motion.button>
//           </div>
//           <p className="text-indigo-200 text-sm mt-1">Manage and review user profiles</p>
//         </div>

//         {/* Content */}
//         <div className={`p-6 overflow-y-auto max-h-[calc(90vh-180px)] ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
//           {/* Error Message */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`p-4 mb-6 rounded-lg text-center ${
//                 darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
//               }`}
//             >
//               {error}
//               {error.includes('Session expired') && (
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="ml-2 text-indigo-500 hover:underline"
//                 >
//                   Log in
//                 </button>
//               )}
//             </motion.div>
//           )}

//           {/* Role Filters */}
//           <div className="flex gap-3 mb-6">
//             {['all', 'entrepreneur', 'investor', 'admin'].map((role) => (
//               <motion.button
//                 key={role}
//                 whileHover={{ y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setFilterRole(role)}
//                 className={`px-4 py-2 rounded-md capitalize shadow-sm font-medium
//                   ${
//                     filterRole === role
//                       ? darkMode
//                         ? 'bg-indigo-900 text-indigo-400'
//                         : 'bg-indigo-100 text-indigo-800'
//                       : darkMode
//                         ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                         : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//                   }`}
//               >
//                 {role === 'all' ? 'All Users' : role}
//               </motion.button>
//             ))}
//           </div>

//           {/* User List */}
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="relative">
//                 <div
//                   className={`w-16 h-16 rounded-full border-4 ${
//                     darkMode ? 'border-gray-700' : 'border-gray-200'
//                   } border-t-indigo-600 animate-spin`}
//                 ></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <Users className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
//                 </div>
//               </div>
//             </div>
//           ) : filteredUsers.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className={`p-8 text-center rounded-lg shadow-md ${
//                 darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
//               }`}
//             >
//               <Users className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
//               <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                 No users found
//               </p>
//               <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
//                 Try adjusting your filter or check back later
//               </p>
//             </motion.div>
//           ) : (
//             <div className="space-y-4">
//               {filteredUsers.map((user, index) => (
//                 <motion.div
//                   key={user._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.3, delay: index * 0.1 }}
//                   className={`p-4 rounded-lg ${
//                     darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
//                   } transition-colors`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <div className="flex items-center gap-3">
//                         <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                           {user.fullName}
//                         </h3>
//                         <span
//                           className={`px-2 py-1 rounded text-xs font-medium ${
//                             user.role.toLowerCase() === 'entrepreneur'
//                               ? darkMode
//                                 ? 'bg-blue-900 text-blue-300'
//                                 : 'bg-blue-50 text-blue-700'
//                               : user.role.toLowerCase() === 'investor'
//                                 ? darkMode
//                                   ? 'bg-green-900 text-green-300'
//                                   : 'bg-green-50 text-green-700'
//                                 : darkMode
//                                   ? 'bg-purple-900 text-purple-300'
//                                   : 'bg-purple-50 text-purple-700'
//                           }`}
//                         >
//                           {user.role}
//                         </span>
//                       </div>
//                       <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                         {user.email}
//                       </p>
//                       {user.companyName && (
//                         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                           Company: {user.companyName}
//                         </p>
//                       )}
//                       {user.industry && (
//                         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                           Industry: {user.industry}
//                         </p>
//                       )}
//                       {user.role.toLowerCase() === 'entrepreneur' && user.fundingPurpose && (
//                         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                           Funding Purpose: {user.fundingPurpose}
//                         </p>
//                       )}
//                       {user.role.toLowerCase() === 'entrepreneur' && user.requestedAmount && (
//   <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//     Requested Amount: ${user.requestedAmount}
//   </p>
// )}

//                       {user.role.toLowerCase() === 'investor' && user.investmentInterests && (
//                         <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                           Interests: {user.investmentInterests.join(', ')}
//                         </p>
//                       )}
//                     </div>
//                     <div className="flex flex-col items-end gap-2">
//                       <StatusBadge status={user.status || 'pending'} darkMode={darkMode} />
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// UserListModal.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   darkMode: PropTypes.bool.isRequired,
//   initialRoleFilter: PropTypes.oneOf(['all', 'entrepreneur', 'investor', 'admin'])
// };

import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Crown, Gem, Award, CheckCircle2, XCircle, X, ChevronRight,
  Heart, Clock, ShieldAlert, Users, DollarSign, Briefcase, MapPin,
  FileText, Target, Lightbulb, TrendingUp, Calendar, UsersRound, Paperclip
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ethiocapital-back.onrender.com/api/v1';

const RankBadge = ({ rank, darkMode }) => {
  if (!rank) return null;

  const badges = {
    Gold: {
      color: darkMode ? 'bg-amber-900 text-amber-400' : 'bg-amber-100 text-amber-900',
      icon: <Crown className={`w-4 h-4 mr-1 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`} />,
      text: 'GOLD'
    },
    Silver: {
      color: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900',
      icon: <Gem className={`w-4 h-4 mr-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />,
      text: 'SILVER'
    },
    Bronze: {
      color: darkMode ? 'bg-amber-800 text-amber-200' : 'bg-amber-200 text-amber-900',
      icon: <Award className={`w-4 h-4 mr-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`} />,
      text: 'BRONZE'
    }
  };

  const badge = badges[rank] || badges.Silver;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
      {badge.icon}
      {badge.text}
    </span>
  );
};

RankBadge.propTypes = {
  rank: PropTypes.string,
  darkMode: PropTypes.bool.isRequired
};

const StatusBadge = ({ status, darkMode }) => {
  const badges = {
    approved: {
      color: darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-800',
      icon: <CheckCircle2 className={`w-4 h-4 mr-1 ${darkMode ? 'text-green-400' : 'text-green-700'}`} />,
      text: 'APPROVED'
    },
    pending: {
      color: darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
      icon: <Clock className={`w-4 h-4 mr-1 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`} />,
      text: 'PENDING'
    },
    rejected: {
      color: darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-800',
      icon: <ShieldAlert className={`w-4 h-4 mr-1 ${darkMode ? 'text-red-400' : 'text-red-700'}`} />,
      text: 'REJECTED'
    }
  };

  const badge = badges[status.toLowerCase()] || badges.pending;

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
      {badge.icon}
      {badge.text}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired
};

export const IdeaCard = ({ idea, onViewDetails, darkMode }) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className={`rounded-xl overflow-hidden border transition-all ${
        darkMode
          ? 'bg-gray-800 border-gray-700 hover:border-indigo-500'
          : 'bg-white border-gray-100 hover:border-indigo-300'
      }`}
    >
      <div className="relative h-2">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {idea.title}
            </h3>
            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <Users className="w-4 h-4 mr-1" />
              <p>{idea.entrepreneurName}</p>
            </div>
            <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              <MapPin className="w-4 h-4 mr-1" />
              <p>{idea.entrepreneurLocation}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={idea.approvalStatus} darkMode={darkMode} />
            {idea.ranking && <RankBadge rank={idea.ranking} darkMode={darkMode} />}
          </div>
        </div>

        <p className={`text-sm line-clamp-3 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {idea.overview}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center ${
            darkMode 
              ? 'bg-blue-900 text-blue-300' 
              : 'bg-blue-50 text-blue-700'
          }`}>
            <Briefcase className="w-3 h-3 mr-1" />
            {idea.businessCategory}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center ${
            darkMode 
              ? 'bg-green-900 text-green-300' 
              : 'bg-green-50 text-green-700'
          }`}>
            <DollarSign className="w-3 h-3 mr-1" />
            ${idea.fundingNeeded}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className={`flex items-center ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
            <Heart className="w-4 h-4 mr-1" />
            <span>{idea.interestedInvestors || 0}</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center ${
              darkMode 
                ? 'bg-indigo-900 text-indigo-400 hover:bg-indigo-800' 
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

IdeaCard.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    entrepreneurName: PropTypes.string.isRequired,
    entrepreneurLocation: PropTypes.string,
    approvalStatus: PropTypes.string.isRequired,
    ranking: PropTypes.string,
    overview: PropTypes.string,
    businessCategory: PropTypes.string,
    fundingNeeded: PropTypes.number,
    interestedInvestors: PropTypes.number
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired
};

const StarAnimation = ({ visible, color }) => {
  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center z-10 ${
        !visible && 'pointer-events-none'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={visible ? {
          scale: [0, 1.2, 1],
          rotate: [0, 10, -10, 0]
        } : { scale: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative"
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={visible ? {
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [0, Math.cos(i * 18 * Math.PI/180) * 100],
              y: [0, Math.sin(i * 18 * Math.PI/180) * 100]
            } : {}}
            transition={{
              delay: 0.2,
              duration: 0.8,
              ease: "easeOut"
            }}
            className={`absolute w-3 h-3 rounded-full ${color}`}
            style={{ top: '50%', left: '50%', marginLeft: '-6px', marginTop: '-6px' }}
          />
        ))}
        <motion.div
          animate={visible ? {
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          } : {}}
          transition={{
            duration: 1,
            ease: "easeInOut",
            repeat: visible ? 1 : 0,
          }}
        >
          <Award className={`w-20 h-20 ${color} drop-shadow-lg`} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

StarAnimation.propTypes = {
  visible: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired
};

const ConfettiAnimation = ({ visible }) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      {visible && [...Array(50)].map((_, i) => {
        const randomX = Math.random() * 100;
        const randomSize = Math.random() * 10 + 5;
        const randomRotation = Math.random() * 360;
        const randomColor = [
          'bg-red-500', 'bg-blue-500', 'bg-green-500',
          'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
        ][Math.floor(Math.random() * 6)];

        return (
          <motion.div
            key={i}
            className={`absolute ${randomColor}`}
            style={{ 
              left: `${randomX}%`,
              width: `${randomSize}px`,
              height: `${randomSize}px`
            }}
            initial={{ 
              y: -20, 
              rotate: randomRotation,
              opacity: 1
            }}
            animate={{ 
              y: '120vh',
              rotate: randomRotation + 360,
              opacity: [1, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              ease: "linear"
            }}
          />
        );
      })}
    </motion.div>
  );
};

ConfettiAnimation.propTypes = {
  visible: PropTypes.bool.isRequired
};

const RankSelection = ({ currentRank, onRankSelect, darkMode }) => {
  return (
    <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
      <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Assign Medal Rank
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: 'Gold', label: 'Gold', icon: Crown },
          { value: 'Silver', label: 'Silver', icon: Gem },
          { value: 'Bronze', label: 'Bronze', icon: Award }
        ].map(({ value, label, icon: Icon }) => (
          <motion.button
            key={value}
            whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRankSelect(value)}
            className={`p-4 rounded-lg flex flex-col items-center transition-all ${
              currentRank === value
                ? (value === 'Gold'
                    ? (darkMode ? 'bg-amber-900 ring-2 ring-amber-400' : 'bg-amber-100 ring-2 ring-amber-500')
                    : value === 'Silver'
                      ? (darkMode ? 'bg-gray-700 ring-2 ring-gray-400' : 'bg-gray-200 ring-2 ring-gray-400')
                      : (darkMode ? 'bg-amber-800 ring-2 ring-amber-600' : 'bg-amber-200 ring-2 ring-amber-700'))
                : (darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200')
            }`}
          >
            <Icon className={`w-8 h-8 mb-3 ${
              value === 'Gold' 
                ? (darkMode ? 'text-amber-400' : 'text-amber-500')
                : value === 'Silver'
                  ? (darkMode ? 'text-gray-300' : 'text-gray-500')
                  : (darkMode ? 'text-amber-500' : 'text-amber-700')
            }`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {label} Medal
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

RankSelection.propTypes = {
  currentRank: PropTypes.string,
  onRankSelect: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired
};

export const IdeaDetailModal = ({ idea, onClose, onStatusChange, darkMode }) => {
  const navigate = useNavigate();
  const [currentRank, setCurrentRank] = useState(idea.ranking || '');
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationColor, setAnimationColor] = useState('text-amber-500');
  const [showRankSelection, setShowRankSelection] = useState(idea.approvalStatus === 'approved');
  const [ideaStatus, setIdeaStatus] = useState(idea.approvalStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalize documents from idea.documents object to array
  const documents = useMemo(() => {
    if (!idea.documents || typeof idea.documents !== 'object') {
      return [];
    }
    return Object.entries(idea.documents).map(([key, url]) => ({
      name: key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim(),
      url,
      type: url.split('.').pop()?.toLowerCase() || 'unknown',
    }));
  }, [idea.documents]);

  const handleDocumentClick = (url) => {
    if (url) {
      const absoluteUrl = url.startsWith('http')
        ? url
        : `${API_BASE_URL.replace('/api/v1', '')}/${url}`;
      window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRankSelect = async (rank) => {
    setCurrentRank(rank);
    setError('');

    if (rank === 'Gold') {
      setAnimationColor(darkMode ? 'text-amber-400' : 'text-amber-500');
      setShowConfetti(true);
    } else if (rank === 'Silver') {
      setAnimationColor(darkMode ? 'text-gray-300' : 'text-gray-400');
    } else if (rank === 'Bronze') {
      setAnimationColor(darkMode ? 'text-amber-600' : 'text-amber-700');
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('[IdeaDetailModal] Assigning rank:', { ideaId: idea._id, rank, token: token.slice(0, 20) + '...' });
      await axios.put(`${API_BASE_URL}/approve-idea/${idea._id}`, {
        approvalStatus: 'approved',
        ranking: rank,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[IdeaDetailModal] Rank assigned successfully');
      setIsLoading(false);
      setShowAnimation(true);

      setTimeout(() => {
        setShowAnimation(false);
        setShowConfetti(false);
        onStatusChange(idea._id, 'approved', rank);
      }, 1500);
    } catch (err) {
      console.error('[IdeaDetailModal] Error assigning rank:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      let errorMsg = 'Failed to assign ranking. Please try again.';
      if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 3000);
      } else if (err.response?.status === 403) {
        errorMsg = 'You do not have permission to assign rankings.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Idea not found. Please refresh and try again.';
      }
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleStatusChangeRequest = async (newStatus) => {
    setIsLoading(true);
    setError('');
    const isApproved = newStatus === 'approved';
    const ranking = isApproved ? currentRank : ''; // Clear ranking for non-approved statuses

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('[IdeaDetailModal] Updating idea status:', { ideaId: idea._id, newStatus, ranking, token: token.slice(0, 20) + '...' });
      await axios.put(`${API_BASE_URL}/approve-idea/${idea._id}`, {
        approvalStatus: newStatus,
        ranking,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[IdeaDetailModal] Idea status updated successfully');
      setIsLoading(false);
      setIdeaStatus(newStatus);
      setShowRankSelection(isApproved);
      if (!isApproved) {
        setCurrentRank(''); // Clear ranking for pending or rejected
      }
      onStatusChange(idea._id, newStatus, ranking);

      // Trigger confetti for approval
      if (newStatus === 'approved' && !currentRank) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 1500);
      }
    } catch (err) {
      console.error('[IdeaDetailModal] Error updating idea status:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      let errorMsg = `Failed to set idea to ${newStatus}. Please try again.`;
      if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 3000);
      } else if (err.response?.status === 403) {
        errorMsg = `You do not have permission to set ideas to ${newStatus}.`;
      } else if (err.response?.status === 404) {
        errorMsg = 'Idea not found. Please refresh and try again.';
      }
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  const handleApprove = () => handleStatusChangeRequest('approved');
  const handlePending = () => handleStatusChangeRequest('pending');
  const handleReject = () => handleStatusChangeRequest('rejected');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <ConfettiAnimation visible={showConfetti} />
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className={`rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        <StarAnimation visible={showAnimation} color={animationColor} />

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">{idea.title}</h2>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <StatusBadge status={ideaStatus} darkMode={false} />
            {currentRank && <RankBadge rank={currentRank} darkMode={false} />}
          </div>
        </div>

        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-180px)] ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center">
                {error}
                {error.includes('Session expired') && (
                  <button
                    onClick={() => navigate('/login')}
                    className="ml-2 text-indigo-500 hover:underline"
                  >
                    Log in
                  </button>
                )}
              </div>
            )}

            {/* Entrepreneur Information */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div>
                <h3 className={`font-medium mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Users className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Entrepreneur Information
                </h3>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Name:</span>
                    <span>{idea.entrepreneurName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Location:</span>
                    <span>{idea.entrepreneurLocation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Education:</span>
                    <span>{idea.entrepreneurEducation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Background:</span>
                    <span>{idea.entrepreneurBackground || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className={`font-medium mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Briefcase className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Business Details
                </h3>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Category:</span>
                    <span>{idea.businessCategory || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Stage:</span>
                    <span>{idea.currentStage || 'Idea'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Market Size:</span>
                    <span>{idea.marketSize || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
              <h3 className={`font-medium mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Financial Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-50 text-blue-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                    Requested
                  </p>
                  <p className="font-semibold text-lg">${idea.fundingNeeded || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-green-50 text-green-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                    Raised
                  </p>
                  <p className="font-semibold text-lg">${idea.fundingRaised || '0'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-purple-900 text-purple-200' 
                    : 'bg-purple-50 text-purple-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                    Valuation
                  </p>
                  <p className="font-semibold text-lg">${idea.financials?.valuation || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-indigo-900 text-indigo-200' 
                    : 'bg-indigo-50 text-indigo-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
                    Revenue 2023
                  </p>
                  <p className="font-semibold text-lg">${idea.financials?.revenue2023 || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-50 text-blue-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                    Projected 2024
                  </p>
                  <p className="font-semibold text-lg">${idea.financials?.projectedRevenue2024 || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-green-50 text-green-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                    Break-even Point
                  </p>
                  <p className="font-semibold text-lg">${idea.financials?.breakEvenPoint || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-purple-900 text-purple-200' 
                    : 'bg-purple-50 text-purple-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                    Entrepreneur Equity
                  </p>
                  <p className="font-semibold text-lg">${idea.entrepreneurEquity || 'N/A'}%</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${
                  darkMode 
                    ? 'bg-indigo-900 text-indigo-200' 
                    : 'bg-indigo-50 text-indigo-900'
                }`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
                    Investor Equity
                  </p>
                  <p className="font-semibold text-lg">${idea.investorEquity || 'N/A'}%</p>
                </div>
              </div>
            </div>

            {/* Business Overview */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Business Overview
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {idea.overview || 'Not provided'}
              </p>
            </div>

            {/* Problem Statement */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Target className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Problem Statement
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {idea.problemStatement || 'Not provided'}
              </p>
            </div>

            {/* Solution */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Lightbulb className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Solution
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {idea.solution || 'Not provided'}
              </p>
            </div>

            {/* Use of Funds */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Use of Funds
              </h3>
              {idea.useOfFunds && idea.useOfFunds.length > 0 ? (
                <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {idea.useOfFunds.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              ) : (
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not provided</p>
              )}
            </div>

            {/* Traction */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <TrendingUp className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Traction
              </h3>
              {idea.traction && idea.traction.length > 0 ? (
                <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {idea.traction.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not provided</p>
              )}
            </div>

            {/* Team */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <UsersRound className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Team
              </h3>
              {idea.team && idea.team.length > 0 ? (
                <div className="space-y-2">
                  {idea.team.map((member, index) => (
                    <div key={index} className={`p-3 rounded-md ${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}>
                      <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {member.name || 'Not specified'}
                      </p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Role: {member.role || 'Not specified'}
                      </p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Expertise: {member.expertise || 'Not specified'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>No team members provided</p>
              )}
            </div>

            {/* Documents */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Paperclip className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Documents
              </h3>
              {documents.length > 0 ? (
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center">
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-40`}>{doc.name}:</span>
                      <button
                        onClick={() => handleDocumentClick(doc.url)}
                        className="text-indigo-500 hover:underline disabled:text-gray-500 disabled:cursor-not-allowed"
                        disabled={!doc.url}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No documents available</p>
              )}
            </div>

            {/* Investment Timeline */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Calendar className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Investment Timeline
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {idea.investmentTimeline || 'Not provided'}
              </p>
            </div>

            {/* Rank Selection */}
            {showRankSelection && (
              <RankSelection 
                currentRank={currentRank} 
                onRankSelect={handleRankSelect}
                darkMode={darkMode}
              />
            )}

            {/* Approval Status Section */}
            <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Reassign Approval Status
              </h3>
              <div className="flex items-center gap-4 mb-4">
                {ideaStatus === 'approved' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Idea is Approved
                    </span>
                  </motion.div>
                )}
                {ideaStatus === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Clock className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Idea is Pending
                    </span>
                  </motion.div>
                )}
                {ideaStatus === 'rejected' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShieldAlert className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                    <span className={`font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Idea is Rejected
                    </span>
                  </motion.div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
                  { value: 'approved', label: 'Approved', icon: CheckCircle2, color: 'green' },
                  { value: 'rejected', label: 'Rejected', icon: ShieldAlert, color: 'red' },
                ].map(({ value, label, icon: Icon, color }) => (
                  <motion.button
                    key={value}
                    whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (value === 'approved') handleApprove();
                      else if (value === 'pending') handlePending();
                      else handleReject();
                    }}
                    disabled={isLoading || ideaStatus === value}
                    className={`p-4 rounded-lg flex flex-col items-center transition-all ${
                      ideaStatus === value
                        ? (value === 'approved'
                            ? (darkMode ? 'bg-green-900 ring-2 ring-green-400' : 'bg-green-100 ring-2 ring-green-500')
                            : value === 'pending'
                              ? (darkMode ? 'bg-yellow-900 ring-2 ring-yellow-400' : 'bg-yellow-100 ring-2 ring-yellow-500')
                              : (darkMode ? 'bg-red-900 ring-2 ring-red-400' : 'bg-red-100 ring-2 ring-red-500'))
                        : (darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-100 hover:bg-gray-200')
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 mb-3 ${
                        value === 'approved'
                          ? (darkMode ? 'text-green-400' : 'text-green-500')
                          : value === 'pending'
                            ? (darkMode ? 'text-yellow-400' : 'text-yellow-500')
                            : (darkMode ? 'text-red-400' : 'text-red-500')
                      }`}
                    />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Approval Confirmation */}
            {ideaStatus === 'approved' && !showAnimation && !currentRank && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg text-center ${
                  darkMode ? 'bg-green-900' : 'bg-green-50'
                }`}
              >
                <p className={`mb-2 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  Idea approved! Please select a medal rank.
                </p>
                <CheckCircle2 className={`w-6 h-6 mx-auto ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

IdeaDetailModal.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    entrepreneurName: PropTypes.string.isRequired,
    entrepreneurLocation: PropTypes.string,
    entrepreneurEducation: PropTypes.string,
    entrepreneurBackground: PropTypes.string,
    approvalStatus: PropTypes.string.isRequired,
    ranking: PropTypes.string,
    overview: PropTypes.string,
    businessCategory: PropTypes.string,
    fundingNeeded: PropTypes.number,
    fundingRaised: PropTypes.number,
    currentStage: PropTypes.string,
    marketSize: PropTypes.string,
    financials: PropTypes.shape({
      valuation: PropTypes.number,
      revenue2023: PropTypes.number,
      projectedRevenue2024: PropTypes.number,
      breakEvenPoint: PropTypes.number,
    }),
    entrepreneurEquity: PropTypes.number,
    investorEquity: PropTypes.number,
    problemStatement: PropTypes.string,
    solution: PropTypes.string,
    useOfFunds: PropTypes.arrayOf(PropTypes.string),
    traction: PropTypes.arrayOf(PropTypes.string),
    team: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string,
      expertise: PropTypes.string,
    })),
    documents: PropTypes.object,
    investmentTimeline: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired
};

export const UserListModal = ({ onClose, darkMode, initialRoleFilter = 'all', onStatusChange }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRole, setFilterRole] = useState(initialRoleFilter);
  const [userLoadingStates, setUserLoadingStates] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const url = `${API_BASE_URL}/users${filterRole !== 'all' ? `?role=${filterRole}` : ''}`;
        console.log('[UserListModal] Fetching users:', { url, token: token.slice(0, 20) + '...' });
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('[UserListModal] Users response:', response.data);
        if (Array.isArray(response.data)) {
          setUsers(response.data);
          setFilteredUsers(response.data);
        } else {
          setError('Invalid data format from server. Please try again later.');
        }
      } catch (err) {
        console.error('[UserListModal] Error fetching users:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        let errorMsg = 'Failed to load users. Please try again later.';
        if (err.response) {
          if (err.response.status === 401) {
            errorMsg = 'Session expired. Please log in again.';
            setTimeout(() => navigate('/login'), 3000);
          } else if (err.response.status === 403) {
            errorMsg = 'You do not have permission to view users.';
            setTimeout(() => navigate('/login'), 3000);
          } else if (err.response.status === 404) {
            errorMsg = 'Users endpoint not found. Check server configuration.';
          } else {
            errorMsg = err.response.data?.message || errorMsg;
          }
        } else if (err.request) {
          errorMsg = 'No response from server. Check your network or server status.';
        }
        setError(errorMsg);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, filterRole]);

  // Update filtered users when filterRole changes
  useEffect(() => {
    setFilterRole(initialRoleFilter);
  }, [initialRoleFilter]);

  const handleApproveUser = async (userId) => {
    setUserLoadingStates((prev) => ({ ...prev, [userId]: true }));
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('[UserListModal] Approving user:', { userId, token: token.slice(0, 20) + '...' });
      await axios.put(`${API_BASE_URL}/users/${userId}/status`, {
        status: 'approved',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[UserListModal] User approved successfully');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: 'approved' } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: 'approved' } : user
        )
      );
      if (onStatusChange) {
        onStatusChange(userId, 'approved');
      }
    } catch (err) {
      console.error('[UserListModal] Error approving user:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      let errorMsg = 'Failed to approve user. Please try again.';
      if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 3000);
      } else if (err.response?.status === 403) {
        errorMsg = 'You do not have permission to approve users.';
      } else if (err.response?.status === 404) {
        errorMsg = 'User not found. Please refresh and try again.';
      }
      setError(errorMsg);
    } finally {
      setUserLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleRejectUser = async (userId) => {
    setUserLoadingStates((prev) => ({ ...prev, [userId]: true }));
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('[UserListModal] Rejecting user:', { userId, token: token.slice(0, 20) + '...' });
      await axios.put(`${API_BASE_URL}/users/${userId}/status`, {
        status: 'rejected',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[UserListModal] User rejected successfully');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: 'rejected' } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: 'rejected' } : user
        )
      );
      if (onStatusChange) {
        onStatusChange(userId, 'rejected');
      }
    } catch (err) {
      console.error('[UserListModal] Error rejecting user:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      let errorMsg = 'Failed to reject user. Please try again.';
      if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 3000);
      } else if (err.response?.status === 403) {
        errorMsg = 'You do not have permission to reject users.';
      } else if (err.response?.status === 404) {
        errorMsg = 'User not found. Please refresh and try again.';
      }
      setError(errorMsg);
    } finally {
      setUserLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className={`rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl relative ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">Entrepreneurs & Investors</h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
          <p className="text-indigo-200 text-sm mt-1">Manage and review user profiles</p>
        </div>

        {/* Content */}
        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-180px)] ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 mb-6 rounded-lg text-center ${
                darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
              }`}
            >
              {error}
              {error.includes('Session expired') && (
                <button
                  onClick={() => navigate('/login')}
                  className="ml-2 text-indigo-500 hover:underline"
                >
                  Log in
                </button>
              )}
            </motion.div>
          )}

          {/* Role Filters */}
          <div className="flex gap-3 mb-6">
            {['all', 'entrepreneur', 'investor', 'admin'].map((role) => (
              <motion.button
                key={role}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterRole(role)}
                className={`px-4 py-2 rounded-md capitalize shadow-sm font-medium ${
                  filterRole === role
                    ? darkMode
                      ? 'bg-indigo-900 text-indigo-400'
                      : 'bg-indigo-100 text-indigo-800'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {role === 'all' ? 'All Users' : role}
              </motion.button>
            ))}
          </div>

          {/* User List */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full border-4 ${
                    darkMode ? 'border-gray-700' : 'border-gray-200'
                  } border-t-indigo-600 animate-spin`}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Users className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-8 text-center rounded-lg shadow-md ${
                darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
              }`}
            >
              <Users className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                No users found
              </p>
              <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Try adjusting your filter or check back later
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {user.fullName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role.toLowerCase() === 'entrepreneur'
                              ? darkMode
                                ? 'bg-blue-900 text-blue-300'
                                : 'bg-blue-50 text-blue-700'
                              : user.role.toLowerCase() === 'investor'
                                ? darkMode
                                  ? 'bg-green-900 text-green-300'
                                  : 'bg-green-50 text-green-700'
                                : darkMode
                                  ? 'bg-purple-900 text-purple-300'
                                  : 'bg-purple-50 text-purple-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {user.email}
                      </p>
                      {user.companyName && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Company: {user.companyName}
                        </p>
                      )}
                      {user.industry && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Industry: {user.industry}
                        </p>
                      )}
                      {user.role.toLowerCase() === 'entrepreneur' && user.fundingPurpose && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Funding Purpose: {user.fundingPurpose}
                        </p>
                      )}
                      {user.role.toLowerCase() === 'entrepreneur' && user.requestedAmount && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Requested Amount: ${user.requestedAmount}
                        </p>
                      )}
                      {user.role.toLowerCase() === 'investor' && user.investmentInterests && (
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Interests: {user.investmentInterests.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={user.status || 'pending'} darkMode={darkMode} />
                      {user.status !== 'approved' && user.status !== 'rejected' && (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleApproveUser(user._id)}
                            disabled={userLoadingStates[user._id]}
                            className={`py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors font-medium text-sm ${
                              userLoadingStates[user._id]
                                ? darkMode
                                  ? 'bg-gray-700 text-gray-500'
                                  : 'bg-gray-200 text-gray-500'
                                : darkMode
                                  ? 'bg-green-800 text-green-200 hover:bg-green-700'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {userLoadingStates[user._id] ? (
                              <CheckCircle2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                Approve
                              </>
                            )}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRejectUser(user._id)}
                            disabled={userLoadingStates[user._id]}
                            className={`py-1 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors font-medium text-sm ${
                              userLoadingStates[user._id]
                                ? darkMode
                                  ? 'bg-gray-700 text-gray-500'
                                  : 'bg-gray-200 text-gray-500'
                                : darkMode
                                  ? 'bg-red-800 text-red-200 hover:bg-red-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {userLoadingStates[user._id] ? (
                              <XCircle className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Reject
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

UserListModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  initialRoleFilter: PropTypes.oneOf(['all', 'entrepreneur', 'investor', 'admin']),
  onStatusChange: PropTypes.func
};
