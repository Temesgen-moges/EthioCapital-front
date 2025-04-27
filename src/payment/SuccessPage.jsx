import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [investmentData, setInvestmentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const API_URL = 'http://localhost:3001/api/v1';

  // Extract txRef from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const txRef = queryParams.get('tx_ref');

  useEffect(() => {
    const loadInvestmentData = async () => {
      setLoading(true);
      setError(null);

      // Check if token exists
      if (!token) {
        setError('Please log in to view your investment details.');
        setLoading(false);
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // Try local storage as a fallback
      let pendingInvestmentData = null;
      const pendingInvestment = localStorage.getItem('pendingInvestment');
      if (pendingInvestment) {
        try {
          const data = JSON.parse(pendingInvestment);
          pendingInvestmentData = {
            txRef: data.txRef,
            fullName: data.investmentDetails?.fullName || 'User',
            projectName: data.investmentDetails?.projectName || 'Unknown Project',
            amount: data.investmentDetails?.amount || 0,
            shares: data.investmentDetails?.shares || 0,
            equityPercentage: data.investmentDetails?.equityPercentage * 100 || 0, // Convert to percentage
            sharePrice: data.investmentDetails?.sharePrice || 0,
          };
          console.log('Retrieved from local storage:', pendingInvestmentData);
        } catch (err) {
          console.error('Error parsing local storage:', err);
        }
      }

      // Fetch investment data from backend using txRef
      if (txRef) {
        try {
          const response = await axios.get(`${API_URL}/investment/${txRef}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Backend investment:', response.data);
          const investment = response.data;
          setInvestmentData({
            txRef: investment.txRef,
            fullName: investment.fullName || 'User',
            projectName: investment.projectName || 'Unknown Project',
            amount: investment.amount || 0,
            shares: investment.shares || 0,
            equityPercentage: investment.equityPercentage || 0, // Already in percentage
            sharePrice: investment.sharePrice || 0,
          });
          // Clear local storage after successful backend fetch
          localStorage.removeItem('pendingInvestment');
        } catch (error) {
          console.error('Backend error:', error.response?.data || error.message);
          if (error.response?.status === 404) {
            setError('Investment not found. It may still be processing.');
          } else if (error.response?.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('authToken');
            setTimeout(() => navigate('/login'), 3000);
            return;
          } else {
            setError('Error loading investment details.');
          }
          // Fallback to local storage data if available
          if (pendingInvestmentData) {
            setInvestmentData(pendingInvestmentData);
            setError('Displaying cached data. Please check your investment status later.');
          }
        }
      } else {
        setError('No transaction reference provided.');
        if (pendingInvestmentData) {
          setInvestmentData(pendingInvestmentData);
          setError('Displaying cached data due to missing transaction reference.');
        }
      }

      setLoading(false);
    };

    loadInvestmentData();
  }, [token, txRef, navigate]);

  const handleGoToDashboard = () => {
    console.log('Navigating to dashboard with token:', token);
    navigate('/entrepreneur-dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Loading...</h1>
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error && !investmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
          <FaExclamationCircle className="text-red-600 text-4xl mb-4" />
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 text-lg mb-4">{error}</p>
          <button
            onClick={handleGoToDashboard}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
        {error && (
          <p className="text-yellow-600 text-sm mb-4 flex items-center gap-2 bg-yellow-100 p-3 rounded-lg">
            <FaExclamationCircle /> {error}
          </p>
        )}
        <div className="flex items-center justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-4xl mr-2" />
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
        </div>
        <p className="text-gray-700 text-lg text-center mb-6">
          Thank you, <span className="font-semibold">{investmentData.fullName}</span>, for your investment!
        </p>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Details</h2>
          <div className="grid grid-cols-1 gap-3 text-gray-600">
            <p>
              <strong className="font-medium">Project:</strong> {investmentData.projectName}
            </p>
            <p>
              <strong className="font-medium">Amount:</strong>{' '}
              {investmentData.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              ETB
            </p>
            <p>
              <strong className="font-medium">Shares:</strong>{' '}
              {investmentData.shares.toFixed(5)}
            </p>
            <p>
              <strong className="font-medium">Equity:</strong>{' '}
              {investmentData.equityPercentage.toFixed(2)}%
            </p>
            <p>
              <strong className="font-medium">Share Price:</strong>{' '}
              {investmentData.sharePrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              ETB
            </p>
            <p>
              <strong className="font-medium">Transaction ID:</strong> {investmentData.txRef}
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleGoToDashboard}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition duration-300 shadow-md"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;