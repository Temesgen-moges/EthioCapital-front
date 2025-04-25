
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage = () => {
  const navigate = useNavigate();
  const [investmentData, setInvestmentData] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken');
  const API_URL = 'http://localhost:3001/api/v1';

  useEffect(() => {
    const loadInvestmentData = async () => {
      // Try local storage first
      const pendingInvestment = localStorage.getItem('pendingInvestment');
      if (pendingInvestment) {
        try {
          const data = JSON.parse(pendingInvestment);
          console.log('From local storage:', data);
          setInvestmentData({
            txRef: data.txRef,
            fullName: data.investmentDetails?.fullName || 'User',
            projectName: data.investmentDetails?.projectName || 'Unknown Project',
            amount: data.investmentDetails?.amount || 0,
            shares: data.investmentDetails?.shares || 0,
            equityPercentage: data.investmentDetails?.equityPercentage || 0,
            sharePrice: data.investmentDetails?.sharePrice || 0,
          });
          localStorage.removeItem('pendingInvestment');
          return;
        } catch (err) {
          console.error('Error parsing local storage:', err);
        }
      }

      // Fallback to backend
      if (!token) {
        console.error('No token found');
        setError('Please log in. Redirecting...');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/investments?email=girma@gmail.com`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Backend investments:', response.data);
        const latestInvestment = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        if (latestInvestment) {
          setInvestmentData({
            txRef: latestInvestment.txRef,
            fullName: latestInvestment.fullName,
            projectName: latestInvestment.projectName,
            amount: latestInvestment.amount,
            shares: latestInvestment.shares,
            equityPercentage: latestInvestment.equityPercentage,
            sharePrice: latestInvestment.sharePrice,
          });
        } else {
          setError('No recent investment found.');
        }
      } catch (error) {
        console.error('Backend error:', error.response?.data || error.message);
        setError('Error loading investment.');
      }
    };

    loadInvestmentData();
  }, [token]);

  const handleGoToDashboard = () => {
    console.log('Navigating to dashboard with token:', token);
    navigate('/investor-dashboard');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
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

  if (!investmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Loading...</h1>
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
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
              <strong className="font-medium">Amount:</strong> {investmentData.amount} ETB
            </p>
            <p>
              <strong className="font-medium">Shares:</strong> {investmentData.shares}
            </p>
            <p>
              <strong className="font-medium">Equity:</strong> {investmentData.equityPercentage}%
            </p>
            <p>
              <strong className="font-medium">Share Price:</strong> {investmentData.sharePrice} ETB
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
