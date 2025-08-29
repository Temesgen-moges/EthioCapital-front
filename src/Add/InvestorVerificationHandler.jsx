import React, { useEffect, memo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
  UserCheck,
  Clock,
} from 'lucide-react';
import {
  fetchVerifications,
  approveVerification,
  rejectVerification,
  setStatusFilter,
  setSelectedVerification,
  setRejectionReason,
  clearError,
} from '../redux/verificationSlice';

// Custom component to handle image loading with stable placeholder
const ImageWithPlaceholder = ({ src, alt, className, placeholderSrc, onErrorSrc, darkMode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-40">
      {/* Placeholder always visible until image loads */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        } ${isLoaded && !hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      >
        {hasError ? (
          <img src={onErrorSrc} alt="Placeholder" className="w-full h-full object-contain" />
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
      {src && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
          onLoad={() => {
            console.log(`[ImageWithPlaceholder] Loaded: ${src}`);
            setIsLoaded(true);
          }}
          onError={(e) => {
            console.error(`[ImageWithPlaceholder] Failed to load: ${src}`);
            setHasError(true);
            setIsLoaded(true);
            e.target.src = onErrorSrc;
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};

const InvestorVerificationHandler = ({ darkMode = false }) => {
  const dispatch = useDispatch();
  const {
    verifications,
    selectedVerification,
    statusFilter,
    rejectionReason,
    isLoading,
    actionLoading,
    error,
  } = useSelector((state) => state.verification);

  const BASE_URL = 'https://ethiocapital-back.onrender.com'; // Base server URL for static files

  useEffect(() => {
    console.log('[InvestorVerificationHandler] Fetching verifications for status:', statusFilter);
    dispatch(fetchVerifications(statusFilter));
  }, [dispatch, statusFilter]);

  useEffect(() => {
    if (error) {
      console.error('[InvestorVerificationHandler] Error:', error);
      if (error.includes('403')) {
        alert('You don’t have permission to view verifications. Please log in as an admin.');
      } else if (error.includes('404')) {
        alert('Verification endpoint not found. Check backend routes.');
      } else {
        alert('Failed to fetch verifications: ' + error);
      }
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleApprove = (id) => {
    console.log('[InvestorVerificationHandler] Approving verification:', id);
    dispatch(approveVerification(id)).then((result) => {
      if (approveVerification.fulfilled.match(result)) {
        alert('Verification approved successfully');
      } else {
        alert('Error approving verification: ' + (result.payload || 'Unknown error'));
      }
    });
  };

  const handleReject = (id) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    console.log('[InvestorVerificationHandler] Rejecting verification:', id, 'Reason:', rejectionReason);
    dispatch(rejectVerification({ id, rejectionReason })).then((result) => {
      if (rejectVerification.fulfilled.match(result)) {
        alert('Verification rejected successfully');
      } else {
        alert('Error rejecting verification: ' + (result.payload || 'Unknown error'));
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getImageUrl = React.useCallback((url) => {
    if (!url) return null;

    try {
      let cleanUrl = url;
      // Handle legacy full file system paths (e.g., C:/Users/.../Uploads/...)
      if (url.includes('Uploads')) {
        const uploadsIndex = url.indexOf('Uploads');
        cleanUrl = url.slice(uploadsIndex); // Extract from Uploads onward
      } else if (url.includes('uploads')) {
        // Handle case-insensitive uploads
        const uploadsIndex = url.indexOf('uploads');
        cleanUrl = url.slice(uploadsIndex).replace(/^uploads/, 'Uploads'); // Normalize to Uploads
      }

      // Ensure the path starts with /Uploads
      cleanUrl = cleanUrl.startsWith('Uploads') ? `/${cleanUrl}` : `/Uploads${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;

      // Normalize slashes for web URLs
      cleanUrl = cleanUrl.replace(/\\/g, '/');

      const finalUrl = `${BASE_URL}${cleanUrl}`;
      console.log('[InvestorVerificationHandler] Image URL:', finalUrl);

      // Validate URL format
      new URL(finalUrl);
      return finalUrl;
    } catch (error) {
      console.error('[InvestorVerificationHandler] Invalid image URL:', url, error);
      return 'https://via.placeholder.com/150?text=Error'; // Hardcoded fallback URL
    }
  }, [BASE_URL]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Investor Verifications
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Review and manage investor verification requests
          </p>
        </div>
        <div className="flex gap-3">
          {['submitted', 'approved', 'rejected'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(setStatusFilter(status))}
              className={`px-5 py-2.5 rounded-lg capitalize shadow-md font-semibold text-sm ${
                statusFilter === status
                  ? status === 'submitted'
                    ? darkMode
                      ? 'bg-yellow-800 text-yellow-300'
                      : 'bg-yellow-100 text-yellow-800'
                    : status === 'approved'
                    ? darkMode
                      ? 'bg-green-800 text-green-300'
                      : 'bg-green-100 text-green-800'
                    : darkMode
                    ? 'bg-red-800 text-red-300'
                    : 'bg-red-100 text-red-800'
                  : darkMode
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div
            className={`w-12 h-12 rounded-full border-4 ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            } border-t-indigo-600 animate-spin`}
          ></div>
        </div>
      ) : verifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-10 text-center rounded-xl shadow-lg ${
            darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
          }`}
        >
          <Shield className={`w-14 h-14 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`text-xl font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
            No verification requests found
          </p>
          <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {statusFilter === 'submitted'
              ? 'No pending verification requests'
              : `No ${statusFilter} verifications found`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-8">
          <div className={`overflow-x-auto rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <table className={`min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold ${
                      darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'
                    }`}
                  >
                    Investor
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold ${
                      darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'
                    }`}
                  >
                    Business Idea
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold ${
                      darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'
                    }`}
                  >
                    Investment Capacity
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold ${
                      darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'
                    }`}
                  >
                    Submitted On
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold ${
                      darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'
                    }`}
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-4 text-left text-xs font-semibold ${
                      darkMode ? 'text-gray-300 uppercase tracking-wider' : 'text-gray-500 uppercase tracking-wider'
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {verifications.map((verification) => (
                  <tr key={verification._id} className={darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      <div className="flex items-center">
                        {verification.profilePictureUrl && (
                          <div className="flex-shrink-0 h-12 w-12 mr-4">
                            <ImageWithPlaceholder
                              src={getImageUrl(verification.profilePictureUrl)}
                              alt={verification.fullName}
                              className="h-12 w-12 rounded-full object-cover"
                              placeholderSrc="https://via.placeholder.com/150?text=Profile"
                              onErrorSrc="https://via.placeholder.com/150?text=Profile"
                              darkMode={darkMode}
                            />
                          </div>
                        )}
                        <div>
                          <div className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {verification.fullName}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {verification.userId?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {verification.ideaId?.title || 'N/A'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {verification.investmentCapacity}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {formatDate(verification.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          verification.status === 'submitted'
                            ? darkMode
                              ? 'bg-yellow-800 text-yellow-200'
                              : 'bg-yellow-100 text-yellow-800'
                            : verification.status === 'approved'
                            ? darkMode
                              ? 'bg-green-800 text-green-200'
                              : 'bg-green-100 text-green-800'
                            : darkMode
                            ? 'bg-red-800 text-red-200'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {verification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-3">
                        <button
                          onClick={() => dispatch(setSelectedVerification(verification))}
                          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                            darkMode
                              ? 'bg-gray-700 text-indigo-300 hover:bg-gray-600'
                              : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                          } shadow-md`}
                        >
                          View
                        </button>
                        {verification.status === 'submitted' && (
                          <>
                            <button
                              onClick={() => handleApprove(verification._id)}
                              disabled={actionLoading}
                              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                                darkMode
                                  ? 'bg-green-800 text-green-300 hover:bg-green-700'
                                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                              } shadow-md ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                dispatch(
                                  setSelectedVerification({
                                    ...verification,
                                    isRejecting: true,
                                  })
                                )
                              }
                              disabled={actionLoading}
                              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                                darkMode
                                  ? 'bg-red-800 text-red-300 hover:bg-red-700'
                                  : 'bg-red-50 text-red-600 hover:bg-red-100'
                              } shadow-md ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {verification.status === 'approved' && (
                          <button
                            onClick={() =>
                              dispatch(
                                setSelectedVerification({
                                  ...verification,
                                  isRejecting: true,
                                })
                              )
                            }
                            disabled={actionLoading}
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                              darkMode
                                ? 'bg-red-800 text-red-300 hover:bg-red-700'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                              } shadow-md ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Revoke
                          </button>
                        )}
                        {verification.status === 'rejected' && (
                          <button
                            onClick={() => handleApprove(verification._id)}
                            disabled={actionLoading}
                            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold ${
                              darkMode
                                ? 'bg-green-800 text-green-300 hover:bg-green-700'
                                : 'bg-green-50 text-green-600 hover:bg-green-100'
                              } shadow-md ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedVerification &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-75">
            <div
              className={`fixed inset-0 transition-opacity ${darkMode ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}
              onClick={() => {
                if (!selectedVerification.isRejecting || actionLoading) {
                  dispatch(setSelectedVerification(null));
                }
              }}
            ></div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative z-50 w-full max-w-3xl rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              {selectedVerification.isRejecting ? (
                <div className="p-8">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedVerification.status === 'approved' ? 'Revoke Approval' : 'Reject Verification Request'}
                  </h3>
                  <div className="mt-6">
                    <label
                      htmlFor="rejectionReason"
                      className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      {selectedVerification.status === 'approved' ? 'Reason for Revoking' : 'Reason for Rejection'}
                    </label>
                    <textarea
                      id="rejectionReason"
                      rows="5"
                      className={`mt-2 block w-full border ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                      } rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500`}
                      placeholder={`Please provide a reason for ${
                        selectedVerification.status === 'approved' ? 'revoking this approval' : 'rejecting this verification request'
                      }...`}
                      value={rejectionReason}
                      onChange={(e) => dispatch(setRejectionReason(e.target.value))}
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setRejectionReason(''));
                        dispatch(
                          setSelectedVerification({
                            ...selectedVerification,
                            isRejecting: false,
                          })
                        );
                      }}
                      disabled={actionLoading}
                      className={`inline-flex justify-center rounded-lg border ${
                        darkMode ? 'border-gray-600 bg-gray-700 text-gray-300' : 'border-gray-300 bg-white text-gray-700'
                      } px-5 py-2.5 text-sm font-semibold shadow-md hover:bg-opacity-90 ${
                        actionLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedVerification._id)}
                      disabled={actionLoading}
                      className={`inline-flex justify-center rounded-lg border border-transparent px-5 py-2.5 text-sm font-semibold shadow-md ${
                        darkMode ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-500'
                      } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {actionLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : selectedVerification.status === 'approved' ? (
                        'Confirm Revocation'
                      ) : (
                        'Confirm Rejection'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={`p-8 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Investor Verification Details
                      </h3>
                      <button
                        onClick={() => dispatch(setSelectedVerification(null))}
                        className={`rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <XCircle size={28} />
                      </button>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className={`text-base font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Personal Information
                        </h4>
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Full Name</p>
                            <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedVerification.fullName}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                            <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedVerification.userId?.email || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                            <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedVerification.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className={`text-base font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Investment Details
                        </h4>
                        <div className="mt-4 space-y-4">
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Investment Capacity</p>
                            <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedVerification.investmentCapacity}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Experience</p>
                            <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedVerification.experience || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Interested In</p>
                            <p className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {selectedVerification.ideaId?.title || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <h4 className={`text-base font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Verification Documents
                      </h4>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ID Document
                          </p>
                          <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
                            {selectedVerification.idPictureUrl ? (
                              <ImageWithPlaceholder
                                src={getImageUrl(selectedVerification.idPictureUrl)}
                                alt="ID Document"
                                className="w-full h-40 object-contain"
                                placeholderSrc="https://via.placeholder.com/300x200?text=ID+Document"
                                onErrorSrc="https://via.placeholder.com/300x200?text=ID+Document"
                                darkMode={darkMode}
                              />
                            ) : (
                              <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500 font-medium">No ID Document</p>
                              </div>
                            )}
                          </div>
                          {selectedVerification.idPictureUrl && (
                            <button
                              className={`mt-3 flex items-center text-sm font-semibold ${
                                darkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-500'
                              }`}
                              onClick={() => window.open(getImageUrl(selectedVerification.idPictureUrl), '_blank')}
                            >
                              <ExternalLink size={16} className="mr-2" /> View Full Size
                            </button>
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Profile Picture
                          </p>
                          <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-md`}>
                            {selectedVerification.profilePictureUrl ? (
                              <ImageWithPlaceholder
                                src={getImageUrl(selectedVerification.profilePictureUrl)}
                                alt="Profile"
                                className="w-full h-40 object-contain"
                                placeholderSrc="https://via.placeholder.com/150?text=Profile"
                                onErrorSrc="https://via.placeholder.com/150?text=Profile"
                                darkMode={darkMode}
                              />
                            ) : (
                              <div className="w-full h-40 flex items-center justify-center bg-gray-100">
                                <p className="text-gray-500 font-medium">No Profile Picture</p>
                              </div>
                            )}
                          </div>
                          {selectedVerification.profilePictureUrl && (
                            <button
                              className={`mt-3 flex items-center text-sm font-semibold ${
                                darkMode ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-600 hover:text-indigo-500'
                              }`}
                              onClick={() => window.open(getImageUrl(selectedVerification.profilePictureUrl), '_blank')}
                            >
                              <ExternalLink size={16} className="mr-2" /> View Full Size
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedVerification.createdAt && (
                      <div className="mt-8 relative">
                        <h4 className={`text-base font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-4`}>
                          Status Timeline
                        </h4>
                        <div className="space-y-6 relative">
                          <div className="absolute left-2.5 top-6 h-[calc(100%-2.5rem)] w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                          <div className="flex items-start relative">
                            <div
                              className={`flex-shrink-0 h-6 w-6 rounded-full ${
                                darkMode ? 'bg-blue-700' : 'bg-blue-100'
                              } flex items-center justify-center z-10`}
                            >
                              <Clock size={14} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />
                            </div>
                            <div className="ml-4">
                              <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Submitted
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(selectedVerification.createdAt)}
                              </p>
                            </div>
                          </div>
                          {(selectedVerification.status === 'approved' || selectedVerification.status === 'rejected') && (
                            <div className="flex items-start relative">
                              <div
                                className={`flex-shrink-0 h-6 w-6 rounded-full ${
                                  selectedVerification.status === 'approved'
                                    ? darkMode
                                      ? 'bg-green-700'
                                      : 'bg-green-100'
                                    : darkMode
                                    ? 'bg-red-700'
                                    : 'bg-red-100'
                                } flex items-center justify-center z-10`}
                              >
                                {selectedVerification.status === 'approved' ? (
                                  <UserCheck size={14} className={darkMode ? 'text-green-300' : 'text-green-600'} />
                                ) : (
                                  <XCircle size={14} className={darkMode ? 'text-red-300' : 'text-red-600'} />
                                )}
                              </div>
                              <div className="ml-4">
                                <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {selectedVerification.status === 'approved' ? 'Approved' : 'Rejected'}
                                </p>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {selectedVerification.approvedAt
                                    ? formatDate(selectedVerification.approvedAt)
                                    : selectedVerification.rejectedAt
                                    ? formatDate(selectedVerification.rejectedAt)
                                    : 'Date not recorded'}
                                </p>
                                {selectedVerification.status === 'rejected' && selectedVerification.rejectionReason && (
                                  <p className={`text-sm mt-1 ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                                    Reason: {selectedVerification.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    {selectedVerification.status === 'submitted' && (
                      <div className="mt-8 flex justify-end gap-4">
                        <button
                          onClick={() =>
                            dispatch(
                              setSelectedVerification({
                                ...selectedVerification,
                                isRejecting: true,
                              })
                            )
                          }
                          disabled={actionLoading}
                          className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-md ${
                            darkMode ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-500'
                          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <XCircle size={18} className="mr-2" /> Reject
                        </button>
                        <button
                          onClick={() => handleApprove(selectedVerification._id)}
                          disabled={actionLoading}
                          className={`inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-md ${
                            darkMode ? 'bg-green-700 text-white hover:bg-green-600' : 'bg-green-600 text-white hover:bg-green-500'
                          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {actionLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Processing...
                            </span>
                          ) : (
                            <>
                              <CheckCircle size={18} className="mr-2" /> Approve
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Note: If you see an ESLint warning about 'skillsData' or 'targetValues' (entrepreneurs, investments, investors, success),
// it may come from another component (e.g., AdminDashboard.js). Search for these in your codebase (e.g., `grep -r "skillsData" src/` or `grep -r "targetValues" src/`) and remove if unused.

export default memo(InvestorVerificationHandler);