import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pay from './Pay';
import { FaUser, FaEnvelope, FaDollarSign, FaChartLine, FaInfoCircle } from 'react-icons/fa';

function PaymentForm({ selectedProjectId = "proj1", userId = null }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "Temesgen",
    lastName: "Moges",
    email: "temu@gmail.com"
  });
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [shares, setShares] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [animateShares, setAnimateShares] = useState(false);

  const projects = [
    { id: 'proj1', name: 'Ethio Tech Hub', minInvestment: 5000, sharePrice: 1000, description: 'A technology innovation hub fostering tech startups and digital transformation in Ethiopia.' },
    { id: 'proj2', name: 'Addis Real Estate', minInvestment: 10000, sharePrice: 1000, description: 'Premium real estate development projects in Addis Ababa with high ROI potential.' },
    { id: 'proj3', name: 'Green Energy Initiative', minInvestment: 3000, sharePrice: 1000, description: 'Sustainable energy projects including solar and wind power installations across Ethiopia.' },
    { id: 'proj4', name: 'Agricultural Expansion', minInvestment: 7500, sharePrice: 1000, description: 'Modern agricultural techniques and equipment to boost crop yields and exports.' }
  ];

  const tx_ref = `negade-tx-${Date.now()}`;
  const public_key = "CHAPUBK_TEST-ugmqoPtY9HtCcpmg9GRD0J0zTkKwl8GX";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const project = projects.find(p => p.id === selectedProjectId);
        setSelectedProject(project);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedProjectId]);

  const calculateShares = (amount, project) => {
    if (!project || !amount) return 0;
    const shareValue = amount / project.sharePrice;
    return Number(shareValue.toFixed(1));
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    if (selectedProject && newAmount) {
      const newShares = calculateShares(Number(newAmount), selectedProject);
      setShares(newShares);
      setAnimateShares(true);
      setTimeout(() => setAnimateShares(false), 700);
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    if (formStep === 1) {
      setFormStep(2);
    } else if (formStep === 2 && amount && shares > 0) {
      setShowConfirmation(true);
    }
  };

  const goToPreviousStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  const closeConfirmation = () => setShowConfirmation(false);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-[#020917] text-white p-8 rounded-lg border-2 border-orange-500 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading investment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white p-2 rounded-full shadow-lg z-10"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="bg-[#020917] text-white p-8 rounded-lg border-2 border-orange-500 w-full max-w-md shadow-xl">
        {selectedProject && (
          <div className="mb-6">
            <h1 className="text-3xl mb-2 text-center font-bold text-orange-500">Ethio Capital Investment</h1>
            <div className="w-full h-1 bg-orange-500 mb-4 rounded-full"></div>

            <div className="bg-gray-800 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-semibold mb-2">{selectedProject.name}</h2>
              <p className="text-gray-300 text-sm mb-3">{selectedProject.description}</p>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-gray-400">Minimum Investment:</span>
                  <p className="font-bold">{selectedProject.minInvestment} ETB</p>
                </div>
                <div>
                  <span className="text-gray-400">Share Price:</span>
                  <p className="font-bold">{selectedProject.sharePrice} ETB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <div className={`flex-1 text-center ${formStep >= 1 ? 'text-orange-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${formStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>1</div>
                <p className="text-xs">Personal Info</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className={`h-0.5 w-full ${formStep >= 2 ? 'bg-orange-500' : 'bg-gray-700'}`}></div>
              </div>
              <div className={`flex-1 text-center ${formStep >= 2 ? 'text-orange-500' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${formStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>2</div>
                <p className="text-xs">Investment Details</p>
              </div>
            </div>

            <form className="flex flex-col space-y-4">
              {formStep === 1 && (
                <div className="bg-gray-800 p-4 rounded-lg space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FaUser className="text-orange-500" />
                      <span>First Name</span>
                    </div>
                    <div className="bg-gray-700 text-white px-4 py-2 rounded-md">
                      {userData.firstName}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FaUser className="text-orange-500" />
                      <span>Last Name</span>
                    </div>
                    <div className="bg-gray-700 text-white px-4 py-2 rounded-md">
                      {userData.lastName}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FaEnvelope className="text-orange-500" />
                      <span>Email</span>
                    </div>
                    <div className="bg-gray-700 text-white px-4 py-2 rounded-md">
                      {userData.email}
                    </div>
                  </div>

                  <div className="bg-gray-700 p-3 rounded-md text-sm mt-4">
                    <p className="flex items-center gap-2 text-orange-300">
                      <FaInfoCircle /> Information loaded from database records
                    </p>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm flex items-center gap-2">
                      <FaDollarSign className="text-orange-500" /> Investment Amount (ETB)
                    </label>
                    <input
                      className="input-field px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                      onChange={handleAmountChange}
                      value={amount}
                      type="number"
                      step="100"
                      min={selectedProject.minInvestment}
                      placeholder={`Minimum ${selectedProject.minInvestment} ETB`}
                      style={{ color: 'black' }}
                      required
                    />
                    {amount && Number(amount) < selectedProject.minInvestment && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <FaInfoCircle /> Investment must be at least {selectedProject.minInvestment} ETB
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm flex items-center gap-2">
                      <FaChartLine className="text-orange-500" /> Shares You Will Receive
                    </label>
                    <div 
                      className={`px-4 py-3 rounded-md bg-gray-700 font-bold text-center text-xl ${animateShares ? 'text-orange-500 scale-110' : 'text-white'}`}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      {shares.toFixed(1)}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-400">Share Price:</span>
                      <span className="text-white">{selectedProject.sharePrice} ETB per share</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Value:</span>
                      <span className="text-white">
                        {(shares * selectedProject.sharePrice).toLocaleString(undefined, { 
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1 
                        })} ETB
                      </span>
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-6">
                {formStep > 1 ? (
                  <button 
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                ) : <div />}
                
                <button 
                  type="button"
                  onClick={goToNextStep}
                  className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition duration-300 ${
                    (formStep === 2 && (!amount || shares <= 0 || Number(amount) < selectedProject.minInvestment)) 
                      ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={
                    (formStep === 2 && (!amount || shares <= 0 || Number(amount) < selectedProject.minInvestment))
                  }
                >
                  {formStep === 1 ? "Continue to Investment" : "Invest Now"}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-4 text-center text-sm text-gray-400">
          By clicking Invest Now, you agree to our Terms and Conditions for investment.
        </div>
      </div>

      {showConfirmation && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white text-black p-6 rounded-lg max-w-md w-full shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-2 text-orange-600">Confirm Your Investment</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="col-span-2">
                  <p className="text-gray-500">Project</p>
                  <p className="font-bold text-lg">{selectedProject.name}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-gray-500">Investor Details</p>
                  <div className="space-y-1">
                    <p className="font-medium">First Name: {userData.firstName}</p>
                    <p className="font-medium">Last Name: {userData.lastName}</p>
                    <p className="font-medium">Email: {userData.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-bold text-green-700">{Number(amount).toLocaleString()} ETB</p>
                </div>
                <div>
                  <p className="text-gray-500">Shares</p>
                  <p className="font-bold">{shares.toFixed(1)} shares</p>
                </div>
                <div>
                  <p className="text-gray-500">Share Price</p>
                  <p className="font-medium">{selectedProject.sharePrice} ETB</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                onClick={closeConfirmation}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <Pay 
                fname={userData.firstName} 
                lname={userData.lastName} 
                email={userData.email} 
                amount={amount} 
                tx_ref={tx_ref} 
                public_key={public_key}
                project_id={selectedProject.id}
                project_name={selectedProject.name}
                shares={shares}
                onCancel={closeConfirmation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;