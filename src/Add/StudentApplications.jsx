import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react'; 
import { CheckCircle, XCircle, Eye, Filter, FileText, GraduationCap } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

const StudentApplications = ({ darkMode }) => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Socket.IO
  useEffect(() => {
    const socket = io('https://ethio-capital-backend-123.onrender.com', {
      query: { userId: localStorage.getItem('userId') },
    });

    socket.on('newApplication', (newApp) => {
      setApplications((prev) => [{ ...newApp, _id: newApp.id }, ...prev]);
      if (statusFilter === 'pending') {
        setFilteredApplications((prev) => [{ ...newApp, _id: newApp.id }, ...prev]);
      }
      // Emit notification for new pending application
      socket.emit('newPendingApplication', {
        message: 'New student application submitted',
        time: new Date().toLocaleTimeString(),
      });
    });

    socket.on('applicationStatus', ({ id, status }) => {
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      setFilteredApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
    });

    return () => socket.disconnect();
  }, [statusFilter]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('https://ethio-capital-backend-123.onrender.com/api/v1/student-applications', {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: statusFilter },
        });
        setApplications(response.data);
        setFilteredApplications(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch applications');
        setApplications([]);
        setFilteredApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, [statusFilter]);

  // Handle approve/reject
  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(
        `https://ethio-capital-backend-123.onrender.com/api/v1/student-applications/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${action} application`);
    }
  };

  // Application detail modal
  const ApplicationDetailModal = ({ application, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={`p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <GraduationCap size={24} />
            Application Details
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p><strong>Name:</strong> {application.fullName}</p>
            <p><strong>Email:</strong> {application.contactEmail}</p>
            <p><strong>Date of Birth:</strong> {new Date(application.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-semibold">Education History</h3>
            {application.educationHistory.map((edu, index) => (
              <div key={index} className="ml-4">
                <p><strong>Institution:</strong> {edu.institution}</p>
                <p><strong>Degree:</strong> {edu.degree}</p>
                <p><strong>Field:</strong> {edu.fieldOfStudy || 'N/A'}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold">Funding Request</h3>
            <p><strong>Purpose:</strong> {application.fundingPurpose}</p>
            <p><strong>Amount:</strong> ${application.fundingAmount}</p>
            <p><strong>Description:</strong> {application.financialNeedsDescription}</p>
          </div>
          <div>
            <h3 className="font-semibold">Documents</h3>
            {application.documents.academicTranscripts && (
              <a
                href={application.documents.academicTranscripts}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Academic Transcripts
              </a>
            )}
            {application.documents.researchProposal && (
              <a
                href={application.documents.researchProposal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block"
              >
                View Research Proposal
              </a>
            )}
            {application.documents.additionalDocuments?.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline block"
              >
                View Additional Document {index + 1}
              </a>
            ))}
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p className={`capitalize ${application.status === 'approved' ? 'text-green-500' : application.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
              {application.status}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => handleAction(application._id, 'approve')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={application.status !== 'pending'}
          >
            Approve
          </button>
          <button
            onClick={() => handleAction(application._id, 'reject')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            disabled={application.status !== 'pending'}
          >
            Reject
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <section className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Student Applications
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Review and manage student funding applications
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['pending', 'approved', 'rejected'].map((status) => (
            <motion.button
              key={status}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md capitalize shadow-sm font-medium ${
                statusFilter === status
                  ? status === 'pending'
                    ? darkMode
                      ? 'bg-yellow-900 text-yellow-400'
                      : 'bg-yellow-100 text-yellow-800'
                    : status === 'approved'
                    ? darkMode
                      ? 'bg-green-900 text-green-400'
                      : 'bg-green-100 text-green-800'
                    : darkMode
                    ? 'bg-red-900 text-red-400'
                    : 'bg-red-100 text-red-800'
                  : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </motion.button>
          ))}
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg text-center ${
            darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
          }`}
        >
          {error}
        </motion.div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div
              className={`w-16 h-16 rounded-full border-4 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              } border-t-indigo-600 animate-spin`}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
          </div>
        </div>
      ) : filteredApplications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 text-center rounded-lg shadow-md ${
            darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
          }`}
        >
          <GraduationCap className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            No applications found
          </p>
          <p className={`mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Try changing your filter criteria or check back later
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-800 border-gray-700 border' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {app.fullName}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedApplication(app)}
                  className={`p-2 rounded-full ${
                    darkMode ? 'bg-gray-700 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  <Eye size={20} />
                </motion.button>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Purpose:</strong> {app.fundingPurpose}
              </p>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <strong>Amount:</strong> ${app.fundingAmount}
              </p>
              <p className={`mt-2 capitalize ${
                app.status === 'approved'
                  ? 'text-green-500'
                  : app.status === 'rejected'
                  ? 'text-red-500'
                  : 'text-yellow-500'
              }`}>
                <strong>Status:</strong> {app.status}
              </p>
              <div className="flex gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(app._id, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  disabled={app.status !== 'pending'}
                >
                  <CheckCircle size={20} className="inline mr-2" />
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction(app._id, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={app.status !== 'pending'}
                >
                  <XCircle size={20} className="inline mr-2" />
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedApplication && (
          <ApplicationDetailModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default StudentApplications;