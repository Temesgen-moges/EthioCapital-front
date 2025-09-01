import React, { useState, useEffect } from 'react';
import { DollarSign, X } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

const FundReleaseForm = ({
  businessIdeaId,
  token,
  startupData,
  setActiveSection,
  setNotificationMessage,
  setShowNotification,
  fetchFundReleases,
  API_URL = 'https://ethiocapital-back.onrender.com/api/v1',
}) => {
  const [fundReleaseForm, setFundReleaseForm] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    amount: startupData?.fundingRaised ? startupData.fundingRaised.toString() : '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);

  // Validate ObjectId format
  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  // Initialize Socket.IO
  useEffect(() => {
    if (!token || !businessIdeaId) {
      console.warn('[FundReleaseForm] Missing token or businessIdeaId:', { token, businessIdeaId });
      return;
    }

    const newSocket = io('https://ethiocapital-back.onrender.com', {
      auth: { token },
    });

    newSocket.on('connect', () => {
      console.log('[Socket.IO] Connected:', newSocket.id);
      newSocket.emit('joinBusinessRoom', businessIdeaId);
      newSocket.emit('joinUserRoom', '67b0c87dba480c63fab77091'); // Hardcoded for testing
    });

    newSocket.on('newFundRelease', (data) => {
      console.log('[Socket.IO] New fund release:', data);
      setNotificationMessage('Fund release request created!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      fetchFundReleases();
    });

    newSocket.on('connect_error', (error) => {
      console.error('[Socket.IO] Connection error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      console.log('[Socket.IO] Disconnected');
    };
  }, [token, businessIdeaId, setNotificationMessage, setShowNotification, fetchFundReleases]);

  const handleFundReleaseChange = (e) => {
    const { name, value } = e.target;
    setFundReleaseForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isFormValid = () => {
    const amount = parseFloat(fundReleaseForm.amount);
    const fundingRaised = parseFloat(startupData?.fundingRaised || 0);
    return (
      fundReleaseForm.bankName.trim() &&
      /^[a-zA-Z\s]+$/.test(fundReleaseForm.bankName.trim()) &&
      fundReleaseForm.accountName.trim() &&
      /^[a-zA-Z\s]+$/.test(fundReleaseForm.accountName.trim()) &&
      fundReleaseForm.accountNumber.trim() &&
      /^\d{10,16}$/.test(fundReleaseForm.accountNumber.trim()) &&
      !isNaN(amount) &&
      amount > 0 &&
      amount <= fundingRaised &&
      businessIdeaId &&
      isValidObjectId(businessIdeaId) &&
      token
    );
  };

  const handleFundReleaseSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errors = {};

    if (!token) {
      errors.token = 'Authentication token is missing';
    }

    if (!businessIdeaId || !isValidObjectId(businessIdeaId)) {
      errors.businessIdeaId = 'Invalid Business Idea ID';
    }

    if (!fundReleaseForm.bankName.trim()) {
      errors.bankName = 'Bank Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(fundReleaseForm.bankName.trim())) {
      errors.bankName = 'Bank Name must contain only letters and spaces';
    }

    if (!fundReleaseForm.accountName.trim()) {
      errors.accountName = 'Account Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(fundReleaseForm.accountName.trim())) {
      errors.accountName = 'Account Name must contain only letters and spaces';
    }

    if (!fundReleaseForm.accountNumber.trim()) {
      errors.accountNumber = 'Account Number is required';
    } else if (!/^\d{10,16}$/.test(fundReleaseForm.accountNumber.trim())) {
      errors.accountNumber = 'Account Number must be 10-16 digits';
    }

    const amount = parseFloat(fundReleaseForm.amount);
    const fundingRaised = parseFloat(startupData?.fundingRaised || 0);
    if (!fundReleaseForm.amount || isNaN(amount)) {
      errors.amount = 'Amount is required';
    } else if (amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    } else if (amount > fundingRaised) {
      errors.amount = `Amount cannot exceed available funding (ETB ${fundingRaised.toLocaleString()})`;
    }

    if (Object.keys(errors).length > 0) {
      console.log('[FundReleaseForm] Client-side validation errors:', errors);
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const payload = {
      businessIdeaId,
      bankName: fundReleaseForm.bankName.trim(),
      accountName: fundReleaseForm.accountName.trim(),
      accountNumber: fundReleaseForm.accountNumber.trim(),
      amount,
    };

    console.log('[FundReleaseForm] Submitting payload:', payload);

    try {
      const response = await axios.post(
        `${API_URL}/fund-release`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('[FundReleaseForm] Submission success:', response.data);
      setFormErrors({});
      setFundReleaseForm({
        bankName: '',
        accountName: '',
        accountNumber: '',
        amount: startupData?.fundingRaised ? startupData.fundingRaised.toString() : '',
      });
      setNotificationMessage('Fund release request submitted successfully!');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setActiveSection('dashboard');
      await fetchFundReleases();
    } catch (error) {
      console.error('[FundReleaseForm] Submission error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      const errorMessage = error.response?.data?.message || 'Failed to submit fund release request';
      setFormErrors({ server: `${errorMessage} (Status: ${error.response?.status || 'Unknown'})` });
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Fund Release Request Form</h2>
      {formErrors.server && (
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">{formErrors.server}</p>
      )}
      <form onSubmit={handleFundReleaseSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={fundReleaseForm.bankName}
            onChange={handleFundReleaseChange}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Enter bank name (e.g., Commercial Bank of Ethiopia)"
          />
          {formErrors.bankName && (
            <p className="text-sm text-red-600 dark:text-red-400">{formErrors.bankName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
          <input
            type="text"
            name="accountName"
            value={fundReleaseForm.accountName}
            onChange={handleFundReleaseChange}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Enter account holder's name"
          />
          {formErrors.accountName && (
            <p className="text-sm text-red-600 dark:text-red-400">{formErrors.accountName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            value={fundReleaseForm.accountNumber} // Fixed from accountName
            onChange={handleFundReleaseChange}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Enter 10-16 digit account number"
          />
          {formErrors.accountNumber && (
            <p className="text-sm text-red-600 dark:text-red-400">{formErrors.accountNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount (ETB, Max: {startupData?.fundingRaised?.toLocaleString() || '0'})
          </label>
          <input
            type="number"
            name="amount"
            value={fundReleaseForm.amount}
            onChange={handleFundReleaseChange}
            className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Enter amount (e.g., 200000)"
            min="1"
            step="0.01"
          />
          {formErrors.amount && (
            <p className="text-sm text-red-600 dark:text-red-400">{formErrors.amount}</p>
          )}
        </div>
        {formErrors.businessIdeaId && (
          <p className="text-sm text-red-600 dark:text-red-400">{formErrors.businessIdeaId}</p>
        )}
        {formErrors.token && (
          <p className="text-sm text-red-600 dark:text-red-400">{formErrors.token}</p>
        )}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setActiveSection('dashboard')}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex-1 px-4 py-2 rounded-lg text-white ${
              isFormValid() && !isSubmitting
                ? 'bg-orange-500 hover:bg-orange-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isFormValid() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};


export default FundReleaseForm;
