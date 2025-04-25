import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, CheckCircle2, XCircle, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

const FundReleaseManagement = ({ darkMode }) => {
  const [fundReleases, setFundReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'approved'
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
  const token = localStorage.getItem('authToken');

  // Initialize Socket.IO for real-time updates
  useEffect(() => {
    console.log('[FundReleaseManagement] Initializing Socket.IO with token:', token);
    const socket = io('http://localhost:3001', {
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('[FundReleaseManagement] Socket.IO connected');
    });

    socket.on('connect_error', (error) => {
      console.error('[FundReleaseManagement] Socket.IO connect_error:', error.message);
      setErrorMessage('Failed to connect to real-time updates. Please refresh the page.');
    });

    socket.on('fundReleaseApproved', ({ fundReleaseId, businessIdeaId, bankName, accountName, accountNumber, amount, votes, status }) => {
      console.log('[FundReleaseManagement] Socket.IO fundReleaseApproved', {
        fundReleaseId,
        businessIdeaId,
        bankName,
        accountName,
        amount,
        votes,
        status,
      });
      if (status === 'sent_to_admin') {
        // Fetch business idea details for the new fund release
        axios.get(`${API_URL}/business-ideas/${businessIdeaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(response => {
            setFundReleases((prev) => [
              {
                _id: fundReleaseId,
                businessIdea: response.data.data, // Populated business idea
                bankName,
                accountName,
                accountNumber,
                amount,
                votes,
                status,
                createdBy: { fullName: 'Unknown', email: 'Unknown' }, // Update if creator info is available
              },
              ...prev.filter(fr => fr.status === 'sent_to_admin'),
            ]);
            setErrorMessage('New fund release request received.');
          })
          .catch(error => {
            console.error('[FundReleaseManagement] Failed to fetch business idea:', error);
          });
      }
    });

    socket.on('fundReleaseStatusUpdated', ({ fundReleaseId, businessIdeaId, status }) => {
      console.log('[FundReleaseManagement] Socket.IO fundReleaseStatusUpdated', {
        fundReleaseId,
        businessIdeaId,
        status,
      });
      setFundReleases((prev) => {
        const updatedReleases = prev.filter((fr) => fr._id !== fundReleaseId);
        if (status === 'approved') {
          // Fetch business idea details for approved fund release
          axios.get(`${API_URL}/business-ideas/${businessIdeaId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(response => {
              const updatedRelease = prev.find(fr => fr._id === fundReleaseId);
              if (updatedRelease) {
                setFundReleases([
                  ...updatedReleases,
                  { ...updatedRelease, status, businessIdea: response.data.data },
                ]);
              }
            })
            .catch(error => {
              console.error('[FundReleaseManagement] Failed to fetch business idea:', error);
            });
        }
        return updatedReleases;
      });
      setErrorMessage(`Fund release ${status} successfully.`);
    });

    return () => socket.disconnect();
  }, [token]);

  // Fetch fund releases by status
  const fetchFundReleases = async (tab = activeTab) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const status = tab === 'pending' ? 'sent_to_admin' : 'approved';
      const response = await axios.get(`${API_URL}/fund-release/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[FundReleaseManagement] fetchFundReleases response:', response.data);
      setFundReleases(response.data.data || []);
    } catch (error) {
      console.error('[FundReleaseManagement] fetchFundReleases error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMsg = 'Failed to load fund release requests.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMsg = 'Authentication failed. Please log in again.';
            break;
          case 403:
            errorMsg = 'You do not have permission to view fund releases.';
            break;
          case 404:
            errorMsg = 'No fund release requests found.';
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      }
      setErrorMessage(errorMsg);
      setFundReleases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh fund releases
  const refreshData = async () => {
    setIsRefreshing(true);
    setErrorMessage('');
    try {
      const status = activeTab === 'pending' ? 'sent_to_admin' : 'approved';
      const response = await axios.get(`${API_URL}/fund-release/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[FundReleaseManagement] refreshData response:', response.data);
      setFundReleases(response.data.data || []);
    } catch (error) {
      console.error('[FundReleaseManagement] refreshData error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMsg = 'Failed to refresh fund release requests.';
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMsg = 'Authentication failed. Please log in again.';
            break;
          case 403:
            errorMsg = 'You do not have permission to view fund releases.';
            break;
          case 404:
            errorMsg = 'No fund release requests found.';
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle approve or reject actions
  const handleFundReleaseAction = async (fundReleaseId, action) => {
    try {
      const response = await axios.put(
        `${API_URL}/fund-release/${fundReleaseId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[FundReleaseManagement] handleFundReleaseAction response:', response.data);
      setFundReleases((prev) => {
        const updatedRelease = prev.find(fr => fr._id === fundReleaseId);
        if (action === 'approve' && updatedRelease) {
          return [
            ...prev.filter((fr) => fr._id !== fundReleaseId),
            { ...updatedRelease, status: 'approved' },
          ];
        }
        return prev.filter((fr) => fr._id !== fundReleaseId);
      });
      setErrorMessage(`Fund release ${action === 'approve' ? 'approved' : 'rejected'} successfully.`);
    } catch (error) {
      console.error('[FundReleaseManagement] handleFundReleaseAction error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMsg = `Failed to ${action} fund release.`;
      if (error.response) {
        errorMsg = error.response.data?.message || errorMsg;
      }
      setErrorMessage(errorMsg);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFundReleases();
    } else {
      setErrorMessage('Authentication required. Please log in.');
      setIsLoading(false);
    }
  }, [token, activeTab]);

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Fund Release Management
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Review and manage fund release requests and their associated startups
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshData}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            darkMode
              ? 'bg-gray-700 text-indigo-400 hover:bg-gray-600'
              : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
          } ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={18} />
          Refresh
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'pending'
                ? `border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400`
                : `text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400`
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`py-2 px-4 font-medium ${
              activeTab === 'approved'
                ? `border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400`
                : `text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400`
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg text-center ${
            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
          }`}
        >
          <p>{errorMessage}</p>
          {errorMessage.includes('Authentication') && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = '/login')}
              className={`mt-2 px-4 py-2 rounded-md font-medium ${
                darkMode
                  ? 'bg-indigo-800 text-indigo-200 hover:bg-indigo-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              Log In
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Fund Releases List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full border-4 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } border-t-indigo-600 animate-spin`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      ) : fundReleases.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 text-center rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
          }`}
        >
          <DollarSign className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No {activeTab === 'pending' ? 'pending' : 'approved'} fund release requests
          </p>
          <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Check back later for new requests
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fundReleases.map((fundRelease, index) => (
            <motion.div
              key={fundRelease._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    fundRelease.status === 'approved'
                      ? darkMode
                        ? 'bg-green-900 text-green-400'
                        : 'bg-green-100 text-green-600'
                      : darkMode
                        ? 'bg-indigo-900 text-indigo-400'
                        : 'bg-indigo-100 text-indigo-600'
                  }`}
                >
                  {fundRelease.status === 'approved' ? <CheckCircle2 size={24} /> : <DollarSign size={24} />}
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Fund Release #{fundRelease._id.slice(-6)}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Startup ID: {(fundRelease.businessIdea?._id || fundRelease.businessIdea || 'N/A').slice(-6)}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Startup Title:</strong> {fundRelease.businessIdea?.title || 'N/A'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Description:</strong>{' '}
                  {(fundRelease.businessIdea?.description || 'N/A').substring(0, 100)}
                  {(fundRelease.businessIdea?.description || '').length > 100 ? '...' : ''}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Amount:</strong>{' '}
                  {fundRelease.amount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' })}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Bank:</strong> {fundRelease.bankName || 'N/A'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Account Name:</strong> {fundRelease.accountName || 'N/A'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Account Number:</strong> {fundRelease.accountNumber || 'N/A'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Created By:</strong> {fundRelease.createdBy?.fullName || fundRelease.createdBy?.email || 'N/A'}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Votes:</strong> {fundRelease.votes || 0}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <strong>Status:</strong> {fundRelease.status}
                </p>
              </div>
              {fundRelease.status === 'sent_to_admin' && (
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFundReleaseAction(fundRelease._id, 'approve')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                      darkMode
                        ? 'bg-green-700 text-green-200 hover:bg-green-600'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <CheckCircle2 size={18} />
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFundReleaseAction(fundRelease._id, 'reject')}
                    className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 ${
                      darkMode
                        ? 'bg-red-700 text-red-200 hover:bg-red-600'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <XCircle size={18} />
                    Reject
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FundReleaseManagement;