import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Gem, Award, CheckCircle2, XCircle, X, ChevronRight, 
  Heart, Star, Clock, ShieldAlert, Users, DollarSign, Briefcase, MapPin, 
  GraduationCap, Send, Download, Share2, HelpCircle, AlertTriangle,
  RefreshCw
} from 'lucide-react';

const RankBadge = ({ rank, darkMode }) => {
  if (!rank) return null;
  
  const badges = {
    gold: {
      color: darkMode ? 'bg-amber-900 text-amber-400' : 'bg-amber-100 text-amber-900',
      icon: <Crown className={`w-4 h-4 mr-1 ${darkMode ? 'text-amber-400' : 'text-amber-800'}`} />,
      text: 'GOLD'
    },
    silver: {
      color: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900',
      icon: <Gem className={`w-4 h-4 mr-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />,
      text: 'SILVER'
    },
    bronze: {
      color: darkMode ? 'bg-amber-800 text-amber-200' : 'bg-amber-200 text-amber-900',
      icon: <Award className={`w-4 h-4 mr-1 ${darkMode ? 'text-amber-200' : 'text-amber-800'}`} />,
      text: 'BRONZE'
    }
  };
  
  const badge = badges[rank];
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
      {badge.icon}
      {badge.text}
    </span>
  );
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
  
  const badge = badges[status] || badges.pending;
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${badge.color}`}>
      {badge.icon}
      {badge.text}
    </span>
  );
};

export const IdeaCard = ({ idea, onViewDetails, darkMode }) => {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className={`rounded-xl overflow-hidden border transition-all
                ${darkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-indigo-500' 
                  : 'bg-white border-gray-100 hover:border-indigo-300'}`}
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
            <StatusBadge status={idea.status} darkMode={darkMode} />
            {idea.rank && <RankBadge rank={idea.rank} darkMode={darkMode} />}
          </div>
        </div>

        <p className={`text-sm line-clamp-3 mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {idea.overview}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center
                          ${darkMode 
                            ? 'bg-blue-900 text-blue-300' 
                            : 'bg-blue-50 text-blue-700'}`}
          >
            <Briefcase className="w-3 h-3 mr-1" />
            {idea.businessCategory}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium flex items-center
                          ${darkMode 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-green-50 text-green-700'}`}
          >
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
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center
                      ${darkMode 
                        ? 'bg-indigo-900 text-indigo-400 hover:bg-indigo-800' 
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
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
          <Star className={`w-20 h-20 ${color} drop-shadow-lg`} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const RankSelection = ({ currentRank, onRankSelect, darkMode }) => {
  return (
    <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
      <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Assign Medal Rank
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <motion.button
          whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRankSelect('gold')}
          className={`p-4 rounded-lg flex flex-col items-center transition-all
                    ${currentRank === 'gold' 
                      ? (darkMode 
                          ? 'bg-amber-900 ring-2 ring-amber-400' 
                          : 'bg-amber-100 ring-2 ring-amber-500')
                      : (darkMode 
                          ? 'bg-gray-700 hover:bg-amber-900' 
                          : 'bg-gray-100 hover:bg-amber-50')
                    }`}
        >
          <Crown className={`w-8 h-8 mb-3 ${darkMode ? 'text-amber-400' : 'text-amber-500'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
            Gold Medal
          </span>
        </motion.button>
        <motion.button
          whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRankSelect('silver')}
          className={`p-4 rounded-lg flex flex-col items-center transition-all
                    ${currentRank === 'silver' 
                      ? (darkMode 
                          ? 'bg-gray-700 ring-2 ring-gray-400' 
                          : 'bg-gray-200 ring-2 ring-gray-400')
                      : (darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200')
                    }`}
        >
          <Gem className={`w-8 h-8 mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
            Silver Medal
          </span>
        </motion.button>
        <motion.button
          whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onRankSelect('bronze')}
          className={`p-4 rounded-lg flex flex-col items-center transition-all
                    ${currentRank === 'bronze' 
                      ? (darkMode 
                          ? 'bg-amber-800 ring-2 ring-amber-600' 
                          : 'bg-amber-200 ring-2 ring-amber-700')
                      : (darkMode 
                          ? 'bg-gray-700 hover:bg-amber-800' 
                          : 'bg-gray-100 hover:bg-amber-100')
                    }`}
        >
          <Award className={`w-8 h-8 mb-3 ${darkMode ? 'text-amber-500' : 'text-amber-700'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-amber-300' : 'text-amber-900'}`}>
            Bronze Medal
          </span>
        </motion.button>
      </div>
    </div>
  );
};

const ConfettiAnimation = ({ visible }) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      {/* Generate 50 confetti particles */}
      {visible && [...Array(50)].map((_, i) => {
        const randomX = Math.random() * 100;  // random X position (0-100%)
        const randomSize = Math.random() * 10 + 5; // random size (5-15px)
        const randomRotation = Math.random() * 360; // random rotation (0-360deg)
        const randomColor = [
          'bg-red-500', 'bg-blue-500', 'bg-green-500', 
          'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
        ][Math.floor(Math.random() * 6)]; // random color
        
        return (
          <motion.div
            key={i}
            className={`absolute w-${randomSize} h-${randomSize} ${randomColor}`}
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
              duration: Math.random() * 3 + 2, // random duration between 2-5 seconds
              ease: "linear"
            }}
          />
        );
      })}
    </motion.div>
  );
};

export const IdeaDetailModal = ({ idea, onClose, onStatusChange, onRankChange, darkMode }) => {
  const [currentRank, setCurrentRank] = useState(idea.rank);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationColor, setAnimationColor] = useState('text-amber-500');
  const [showRankSelection, setShowRankSelection] = useState(idea.status === 'approved');
  const [ideaStatus, setIdeaStatus] = useState(idea.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleRankSelect = (rank) => {
    setCurrentRank(rank);
    
    if (rank === 'gold') {
      setAnimationColor(darkMode ? 'text-amber-400' : 'text-amber-500');
      setShowConfetti(true);
    }
    else if (rank === 'silver') setAnimationColor(darkMode ? 'text-gray-300' : 'text-gray-400');
    else if (rank === 'bronze') setAnimationColor(darkMode ? 'text-amber-600' : 'text-amber-700');
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowAnimation(true);
      
      setTimeout(() => {
        setShowAnimation(false);
        setShowConfetti(false);
        onRankChange(idea._id, rank);
      }, 1500);
    }, 500);
  };

  const handleApprove = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIdeaStatus('approved');
      setShowRankSelection(true);
      onStatusChange(idea._id, 'approved');
    }, 800);
  };

  const handleReject = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIdeaStatus('rejected');
      setShowRankSelection(false);
      onStatusChange(idea._id, 'rejected');
    }, 800);
  };

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
        className={`rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative
                  ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
      >
        <StarAnimation visible={showAnimation} color={animationColor} />
        
        {/* Header with gradient background */}
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
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg
                            ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div>
                <h3 className={`font-medium mb-3 flex items-center
                              ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  <Users className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Entrepreneur Information
                </h3>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24`}>Name:</span>
                    <span>{idea.entrepreneurName}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24`}>Location:</span>
                    <span>{idea.entrepreneurLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24`}>Education:</span>
                    <span>{idea.entrepreneurEducation || 'Not specified'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className={`font-medium mb-3 flex items-center
                              ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  <Briefcase className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Business Details
                </h3>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24`}>Category:</span>
                    <span>{idea.businessCategory}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24`}>Stage:</span>
                    <span>{idea.currentStage || 'Idea'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-24`}>Market Size:</span>
                    <span>{idea.marketSize || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
              <h3 className={`font-medium mb-3 flex items-center
                            ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Financial Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg transition-all hover:scale-105
                                ${darkMode 
                                  ? 'bg-blue-900 text-blue-200' 
                                  : 'bg-blue-50 text-blue-900'}`}
                >
                  <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>
                    Requested
                  </p>
                  <p className="font-semibold text-lg">${idea.fundingNeeded}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105
                                ${darkMode 
                                  ? 'bg-green-900 text-green-200' 
                                  : 'bg-green-50 text-green-900'}`}
                >
                  <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>
                    Raised
                  </p>
                  <p className="font-semibold text-lg">${idea.fundingRaised || 0}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105
                                ${darkMode 
                                  ? 'bg-purple-900 text-purple-200' 
                                  : 'bg-purple-50 text-purple-900'}`}
                >
                  <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>
                    Valuation
                  </p>
                  <p className="font-semibold text-lg">${idea.financials?.valuation || 'N/A'}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105
                                ${darkMode 
                                  ? 'bg-indigo-900 text-indigo-200' 
                                  : 'bg-indigo-50 text-indigo-900'}`}
                >
                  <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>
                    Revenue 2023
                  </p>
                  <p className="font-semibold text-lg">${idea.financials?.revenue2023 || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className={`p-5 rounded-lg
                          ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Business Overview
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{idea.overview}</p>
            </div>

            {/* Actions - conditional rendering based on status */}
            {showRankSelection ? (
              <RankSelection 
                currentRank={currentRank} 
                onRankSelect={handleRankSelect}
                darkMode={darkMode}
              />
            ) : (
              <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
                <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Status Management
                </h3>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApprove}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
                              ${isLoading 
                                ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500')
                                : (darkMode 
                                    ? 'bg-green-800 text-green-200 hover:bg-green-700' 
                                    : 'bg-green-600 text-white hover:bg-green-700')
                              }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Approve Idea
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReject}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
                              ${isLoading 
                                ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500')
                                : (darkMode 
                                    ? 'bg-red-800 text-red-200 hover:bg-red-700' 
                                    : 'bg-red-600 text-white hover:bg-red-700')
                              }`}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        Reject Idea
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}

            {ideaStatus === 'approved' && !showAnimation && !currentRank && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg text-center
                          ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}
              >
                <p className={`mb-2 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                  Idea approved! Please select a medal rank.
                </p>
                <CheckCircle2 className={`w-6 h-6 mx-auto ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </motion.div>
            )}
            
            {/* Footer Actions */}
            <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t flex flex-wrap gap-2 justify-end`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1
                          ${darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1
                          ${darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-md flex items-center gap-1
                          ${darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};