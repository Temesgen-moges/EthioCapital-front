import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  Crown, Gem, Award, CheckCircle2, XCircle, X, ChevronRight,
  Heart, Clock, ShieldAlert, Users, DollarSign, Briefcase, MapPin,
  FileText, Target, Lightbulb, TrendingUp, Calendar, UsersRound, Paperclip
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://ethiocapital-back.onrender.com/api/v1';

// RankBadge Component
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

  const badge = badges[rank] || { color: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900', icon: null, text: rank };

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

// StatusBadge Component
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

// StarAnimation Component
const StarAnimation = ({ visible, color }) => {
  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center z-10 ${!visible && 'pointer-events-none'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={visible ? { scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] } : { scale: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
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
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className={`absolute w-3 h-3 rounded-full ${color}`}
            style={{ top: '50%', left: '50%', marginLeft: '-6px', marginTop: '-6px' }}
          />
        ))}
        <motion.div
          animate={visible ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
          transition={{ duration: 1, ease: 'easeInOut', repeat: visible ? 1 : 0 }}
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

// ConfettiAnimation Component
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
            style={{ left: `${randomX}%`, width: `${randomSize}px`, height: `${randomSize}px` }}
            initial={{ y: -20, rotate: randomRotation, opacity: 1 }}
            animate={{ y: '120vh', rotate: randomRotation + 360, opacity: [1, 1, 0] }}
            transition={{ duration: Math.random() * 3 + 2, ease: 'linear' }}
          />
        );
      })}
    </motion.div>
  );
};

ConfettiAnimation.propTypes = {
  visible: PropTypes.bool.isRequired
};

// RankSelection Component
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
            className={`p-4 rounded-lg flex flex-col items-center transition-all
              ${currentRank === value
                ? (value === 'Gold'
                  ? (darkMode ? 'bg-amber-900 ring-2 ring-amber-400' : 'bg-amber-100 ring-2 ring-amber-500')
                  : value === 'Silver'
                    ? (darkMode ? 'bg-gray-700 ring-2 ring-gray-400' : 'bg-gray-200 ring-2 ring-gray-400')
                    : (darkMode ? 'bg-amber-800 ring-2 ring-amber-600' : 'bg-amber-200 ring-2 ring-amber-700'))
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')}`}
          >
            <Icon className={`w-8 h-8 mb-3 ${
              value === 'Gold' ? (darkMode ? 'text-amber-400' : 'text-amber-500') :
              value === 'Silver' ? (darkMode ? 'text-gray-300' : 'text-gray-500') :
              (darkMode ? 'text-amber-500' : 'text-amber-700')
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

// IdeaDetailModal Component
const IdeaDetailModal = ({ idea, onClose, onStatusChange, darkMode }) => {
  const navigate = useNavigate();
  const [currentRank, setCurrentRank] = useState(idea.ranking || '');
  const [customRank, setCustomRank] = useState(['Gold', 'Silver', 'Bronze'].includes(idea.ranking) ? '' : idea.ranking || '');
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [animationColor, setAnimationColor] = useState('text-amber-500');
  const [ideaStatus, setIdeaStatus] = useState(idea.approvalStatus || 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Normalize documents
  const documents = useMemo(() => {
    if (!idea.documents || typeof idea.documents !== 'object') {
      return [];
    }
    return Object.entries(idea.documents).map(([key, url]) => ({
      name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
      url,
      type: url.split('.').pop()?.toLowerCase() || 'unknown',
    }));
  }, [idea.documents]);

  const handleDocumentClick = (url) => {
    if (url) {
      const absoluteUrl = url.startsWith('http') ? url : `${API_BASE_URL.replace('/api/v1', '')}/${url}`;
      window.open(absoluteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRankSelect = (rank) => {
    setCurrentRank(rank);
    setCustomRank('');
    setAnimationColor(
      rank === 'Gold' ? (darkMode ? 'text-amber-400' : 'text-amber-500') :
      rank === 'Silver' ? (darkMode ? 'text-gray-300' : 'text-gray-400') :
      (darkMode ? 'text-amber-600' : 'text-amber-700')
    );
    setShowConfetti(rank === 'Gold');
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1500);
    setTimeout(() => setShowConfetti(false), 1500);
  };

  const handleStatusUpdate = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const ranking = ideaStatus === 'approved' ? (currentRank || customRank || '') : '';
      console.log('[IdeaDetailModal] Updating status:', { ideaId: idea._id, approvalStatus: ideaStatus, ranking, token: token.slice(0, 20) + '...' });
      await axios.put(`${API_BASE_URL}/approve-idea/${idea._id}`, {
        approvalStatus: ideaStatus,
        ranking,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[IdeaDetailModal] Status updated successfully');
      onStatusChange(idea._id, ideaStatus, ranking);
    } catch (err) {
      console.error('[IdeaDetailModal] Error updating status:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      let errorMsg = 'Failed to update status. Please try again.';
      if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
        setTimeout(() => navigate('/login'), 3000);
      } else if (err.response?.status === 403) {
        errorMsg = 'You do not have permission to update status.';
      } else if (err.response?.status === 404) {
        errorMsg = 'Idea not found. Please refresh and try again.';
      }
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to handle missing data
  const getValue = (value, fallback = 'Not provided') => value && value !== '' ? value : fallback;

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
        className={`rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl relative
          ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}
      >
        <StarAnimation visible={showAnimation} color={animationColor} />

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">{getValue(idea.title)}</h2>
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
            {(currentRank || customRank) && <RankBadge rank={currentRank || customRank} darkMode={false} />}
          </div>
        </div>

        <div className={`p-6 overflow-y-auto max-h-[calc(90vh-180px)] ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          <div className="space-y-6">
            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-lg text-center">
                {error}
                {error.includes('Session expired') && (
                  <button onClick={() => navigate('/login')} className="ml-2 text-indigo-500 hover:underline">
                    Log in
                  </button>
                )}
              </div>
            )}

            {/* Entrepreneur Information */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div>
                <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Users className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Entrepreneur Information
                </h3>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Name:</span>
                    <span>{getValue(idea.entrepreneurName)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Location:</span>
                    <span>{getValue(idea.entrepreneurLocation)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Education:</span>
                    <span>{getValue(idea.entrepreneurEducation)}</span>
                  </div>
                  <div className="flex items-start">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Background:</span>
                    <span>{getValue(idea.entrepreneurBackground)}</span>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div>
                <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <Briefcase className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  Business Details
                </h3>
                <div className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Category:</span>
                    <span>{getValue(idea.businessCategory)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Stage:</span>
                    <span>{getValue(idea.currentStage)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} w-32`}>Market Size:</span>
                    <span>{getValue(idea.marketSize)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <DollarSign className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Financial Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>Requested</p>
                  <p className="font-semibold text-lg">${getValue(idea.fundingNeeded, '0')}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Raised</p>
                  <p className="font-semibold text-lg">${getValue(idea.fundingRaised, '0')}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Valuation</p>
                  <p className="font-semibold text-lg">${getValue(idea.financials?.valuation, '0')}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-50 text-indigo-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Revenue 2023</p>
                  <p className="font-semibold text-lg">${getValue(idea.financials?.revenue2023, '0')}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-50 text-blue-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-800'}`}>Projected 2024</p>
                  <p className="font-semibold text-lg">${getValue(idea.financials?.projectedRevenue2024, '0')}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-green-400' : 'text-green-800'}`}>Break-even Point</p>
                  <p className="font-semibold text-lg">${getValue(idea.financials?.breakEvenPoint, '0')}</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-50 text-purple-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-purple-400' : 'text-purple-800'}`}>Entrepreneur Equity</p>
                  <p className="font-semibold text-lg">{getValue(idea.entrepreneurEquity, '0')}%</p>
                </div>
                <div className={`p-4 rounded-lg transition-all hover:scale-105 ${darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-50 text-indigo-900'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-indigo-400' : 'text-indigo-800'}`}>Investor Equity</p>
                  <p className="font-semibold text-lg">{getValue(idea.investorEquity, '0')}%</p>
                </div>
              </div>
            </div>

            {/* Business Overview */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <FileText className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Business Overview
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{getValue(idea.overview)}</p>
            </div>

            {/* Problem Statement */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Target className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Problem Statement
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{getValue(idea.problemStatement)}</p>
            </div>

            {/* Solution */}
            <div className={`p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-medium mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Lightbulb className={`w-4 h-4 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                Solution
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{getValue(idea.solution)}</p>
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
                        {getValue(member.name)}
                      </p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Role: {getValue(member.role)}
                      </p>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Expertise: {getValue(member.expertise)}
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
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{getValue(idea.investmentTimeline)}</p>
            </div>

            {/* Status Management */}
            <div className={`pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-t`}>
              <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Status Management
              </h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Approval Status
                  </label>
                  <select
                    value={ideaStatus}
                    onChange={(e) => {
                      setIdeaStatus(e.target.value);
                      if (e.target.value !== 'approved') {
                        setCurrentRank('');
                        setCustomRank('');
                      }
                    }}
                    className={`mt-1 block w-full rounded-md border p-2 focus:outline-none focus:ring-2
                      ${darkMode
                        ? 'bg-gray-700 text-gray-300 border-gray-600 focus:ring-indigo-500'
                        : 'bg-white text-gray-800 border-gray-300 focus:ring-indigo-500'}`}
                    disabled={isLoading}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {ideaStatus === 'approved' && (
                  <>
                    <RankSelection 
                      currentRank={currentRank} 
                      onRankSelect={handleRankSelect}
                      darkMode={darkMode}
                    />
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Custom Ranking (optional)
                      </label>
                      <input
                        type="text"
                        value={customRank}
                        onChange={(e) => {
                          setCustomRank(e.target.value);
                          setCurrentRank('');
                        }}
                        className={`mt-1 block w-full rounded-md border p-2 focus:outline-none focus:ring-2
                          ${darkMode
                            ? 'bg-gray-700 text-gray-300 border-gray-600 focus:ring-indigo-500'
                            : 'bg-white text-gray-800 border-gray-300 focus:ring-indigo-500'}`}
                        placeholder="e.g., Top 10, Featured"
                        disabled={currentRank !== '' || isLoading}
                      />
                    </div>
                  </>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStatusUpdate}
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium
                    ${isLoading
                      ? (darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-500')
                      : (darkMode ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-indigo-600 text-white hover:bg-indigo-700')}`}
                >
                  {isLoading ? (
                    <CheckCircle2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Update Status
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

IdeaDetailModal.propTypes = {
  idea: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    entrepreneurName: PropTypes.string,
    entrepreneurLocation: PropTypes.string,
    entrepreneurEducation: PropTypes.string,
    entrepreneurBackground: PropTypes.string,
    approvalStatus: PropTypes.string,
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

export default IdeaDetailModal;