import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Pay from "./Pay";
import {
  FaUser,
  FaEnvelope,
  FaDollarSign,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";

function PaymentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedIdea, userId } = location.state || {};
  const userDataFromRedux = useSelector((state) => state.userData.userData);
  const token = localStorage.getItem("authToken");
  const API_URL = "http://localhost:3001/api/v1";

  const [userData, setUserData] = useState({ fullName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [formStep, setFormStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [shares, setShares] = useState(0);
  const [equityPercentage, setEquityPercentage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [animateShares, setAnimateShares] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [investmentDetails, setInvestmentDetails] = useState(null);
  const [txRef, setTxRef] = useState("");
  const [priorEquity, setPriorEquity] = useState(0);
  const [remainingFunding, setRemainingFunding] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(null); // Investment details data

  const public_key = "CHAPUBK_TEST-ugmqoPtY9HtCcpmg9GRD0J0zTkKwl8GX";
  const projectId = selectedIdea?._id;

  // Helper function to parse currency strings with decimals
  const parseCurrency = (value) => {
    if (!value) return 0;
    const cleanedValue = value.toString().replace(/,/g, "");
    const num = Number(cleanedValue);
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    if (token && userId) {
      const newSocket = io("http://localhost:3001", {
        auth: { token },
        query: { userId },
      });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to socket.io server");
      });
      newSocket.on("connect_error", (err) => {
        console.error("Socket.io connection error:", err.message);
      });

      newSocket.on(
        "fundingUpdated",
        ({ ideaId, fundingRaised, fundingNeeded }) => {
          if (ideaId === selectedIdea?._id) {
            const raisedNum = parseCurrency(fundingRaised);
            const neededNum = parseCurrency(fundingNeeded);
            console.log("fundingUpdated received:", {
              ideaId,
              fundingRaised,
              fundingNeeded,
              raisedNum,
              neededNum,
            });

            if (isNaN(raisedNum) || isNaN(neededNum) || neededNum <= 0) {
              console.error("Invalid funding data:", {
                fundingRaised,
                fundingNeeded,
              });
              setErrorMessage("Invalid funding data received. Please refresh.");
              return;
            }

            if (raisedNum > neededNum) {
              console.warn("Funding raised exceeds goal:", {
                raisedNum,
                neededNum,
              });
            }

            const newRemaining = neededNum - raisedNum;
            setRemainingFunding(newRemaining);
            setSelectedProject((prev) => ({
              ...prev,
              fundingRaised: raisedNum,
              fundingNeeded: neededNum,
              minInvestment:
                newRemaining < 3000 && newRemaining > 0
                  ? newRemaining
                  : prev?.minInvestment || 3000,
            }));
            console.log("Updated remainingFunding:", newRemaining);
          }
        }
      );

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, userId, selectedIdea?._id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!selectedIdea || !userId) {
          setErrorMessage(
            "No startup selected or user ID missing. Redirecting back..."
          );
          console.error("Missing selectedIdea or userId:", {
            selectedIdea,
            userId,
          });
          setTimeout(() => navigate(-1), 3000);
          return;
        }

        if (userDataFromRedux && userId === userDataFromRedux._id) {
          setUserData({
            fullName:
              userDataFromRedux.fullName ||
              `${userDataFromRedux.firstName || ""} ${
                userDataFromRedux.lastName || ""
              }`.trim() ||
              "Unknown User",
            email: userDataFromRedux.email || "",
          });
        } else if (userId && token) {
          try {
            const response = await axios.get(`${API_URL}/user`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setUserData({
              fullName:
                response.data.fullName ||
                `${response.data.firstName || ""} ${
                  response.data.lastName || ""
                }`.trim() ||
                "Unknown User",
              email: response.data.email || "",
            });
          } catch (error) {
            if (error.response?.status === 401) {
              setErrorMessage("Session expired. Please log in again.");
              console.error("Token expired:", error.response?.data);
              localStorage.removeItem("authToken");
              setTimeout(() => navigate("/login"), 3000);
              return;
            }
            throw error;
          }
        } else {
          setErrorMessage("User authentication required.");
          console.error("No token or userId");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (selectedIdea) {
          const sharePrice = 1000;
          const fundingNeeded = parseCurrency(selectedIdea.fundingNeeded);
          const fundingRaised = parseCurrency(selectedIdea.fundingRaised);
          console.log("Initial funding data:", {
            fundingNeeded,
            fundingRaised,
            rawNeeded: selectedIdea.fundingNeeded,
            rawRaised: selectedIdea.fundingRaised,
            investorEquity: selectedIdea.investorEquity,
          });

          const minInvestment = Math.max(3000, fundingNeeded * 0.01);
          const maxInvestment = calculateMaxInvestment(selectedIdea);
          const newRemaining = fundingNeeded - fundingRaised;
          setRemainingFunding(newRemaining);
          setSelectedProject({
            id: selectedIdea._id,
            name: selectedIdea.title || "Unnamed Idea",
            minInvestment:
              newRemaining < 3000 && newRemaining > 0
                ? newRemaining
                : minInvestment,
            sharePrice,
            description: selectedIdea.overview || "No description available",
            solution: selectedIdea.solution || "No solution provided",
            maxInvestment,
            equityOffered: selectedIdea.investorEquity || "0",
            fundingNeeded,
            fundingRaised,
            investmentTimeline: selectedIdea.investmentTimeline || "2 months",
          });
          console.log("Initial remainingFunding:", newRemaining);
        }

        if (projectId && userData.email) {
          try {
            const response = await axios.get(
              `${API_URL}/investments-details/${projectId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setData(response.data);
            console.log("Investment details for payment:", response.data);

            // Validate backend remainingFunding
            const backendRemaining = response.data.remainingFunding;
            if (backendRemaining <= 0) {
              setErrorMessage(
                "This project has reached or exceeded its funding goal."
              );
              setRemainingFunding(0);
              return;
            }
            // Update remainingFunding to match backend
            setRemainingFunding(backendRemaining);

            let totalEquity = 0;
            for (const inv of response.data?.investments || []) {
              if (inv.email === userData.email) {
                totalEquity += inv.equityPercentage || 0;
              }
            }
            console.log("Calculated priorEquity:", totalEquity);
            setPriorEquity(totalEquity);
          } catch (error) {
            console.error(
              "Error fetching investment details:",
              error.response?.data || error.message
            );
            setErrorMessage("Failed to fetch investment details.");
            setPriorEquity(0);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching data:",
          error.response?.data || error.message
        );
        setErrorMessage("Failed to load investment data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    selectedIdea,
    userId,
    userDataFromRedux,
    token,
    navigate,
    projectId,
    userData.email,
  ]);

  const calculateValuation = (idea) => {
    if (!idea || !idea.investorEquity || !idea.fundingNeeded) return Infinity;
    const fundingNeededNum = parseCurrency(idea.fundingNeeded);
    const equityOfferedNum = Number(idea.investorEquity) / 100;
    console.log("calculateValuation:", {
      fundingNeededNum,
      equityOfferedNum,
      rawInvestorEquity: idea.investorEquity,
    });
    return equityOfferedNum > 0
      ? fundingNeededNum / equityOfferedNum
      : Infinity;
  };

  const calculateMaxInvestment = (idea) => {
    const valuation = calculateValuation(idea);
    if (valuation === Infinity) return Infinity;
    const equityOfferedNum = Number(idea.investorEquity) / 100;
    const maxEquityPerInvestor = equityOfferedNum / 4; // 25% cap
    const maxInvestment = valuation * (maxEquityPerInvestor - priorEquity);
    console.log("calculateMaxInvestment:", {
      valuation,
      equityOfferedNum,
      maxEquityPerInvestor,
      priorEquity,
      maxInvestment,
    });
    return maxInvestment;
  };

  const calculateShares = (amount, project) => {
    if (!project || !amount) return 0;
    const shareValue = amount / project.sharePrice;
    return Number(shareValue.toFixed(5)); // Keep 5 decimals for shares
  };

  const calculateEquityPercentage = (amount, valuation) => {
    if (!amount || !valuation || valuation === Infinity) return 0;
    const equity = amount / valuation; // Return as decimal, unrounded
    console.log("calculateEquityPercentage:", { amount, valuation, equity });
    return equity;
  };

  const handleAmountChange = (e) => {
    const newAmount = e.target.value;
    setAmount(newAmount);
    setErrorMessage("");
    if (selectedProject && newAmount) {
      const amountNum = Number(newAmount);
      const valuation = calculateValuation(selectedIdea);
      const maxEquityPerInvestor = Number(selectedProject.equityOffered) / 400; // 79.01% → 0.197525
      const newEquityPercentage = calculateEquityPercentage(
        amountNum,
        valuation
      );
      const totalEquity = priorEquity + newEquityPercentage;

      console.log("handleAmountChange:", {
        amountNum,
        valuation,
        maxEquityPerInvestor,
        newEquityPercentage,
        priorEquity,
        totalEquity,
      });

      if (remainingFunding <= 0) {
        setErrorMessage("This project has already reached its funding goal.");
        setShares(0);
        setEquityPercentage(0);
        return;
      }

      if (newEquityPercentage > Number(selectedProject.equityOffered) / 100) {
        setErrorMessage(
          `Equity percentage (${
            newEquityPercentage * 100
          }%) exceeds total equity offered (${selectedProject.equityOffered}%).`
        );
        setShares(0);
        setEquityPercentage(0);
        return;
      }

      if (totalEquity > maxEquityPerInvestor) {
        const maxInvestment = (maxEquityPerInvestor - priorEquity) * valuation;
        setErrorMessage(
          `Total equity (${
            totalEquity * 100
          }%) exceeds 25% cap. You can invest up to ${maxInvestment.toLocaleString()} ETB.`
        );
        setShares(0);
        setEquityPercentage(0);
        return;
      }

      if (
        amountNum < selectedProject.minInvestment &&
        amountNum !== remainingFunding
      ) {
        setErrorMessage(
          `Minimum investment is ${selectedProject.minInvestment.toLocaleString()} ETB, unless covering the exact remaining amount (${remainingFunding.toLocaleString()} ETB).`
        );
        setShares(0);
        setEquityPercentage(0);
      } else if (amountNum > selectedProject.maxInvestment) {
        setErrorMessage(
          `Maximum investment is ${selectedProject.maxInvestment.toLocaleString()} ETB.`
        );
        setShares(0);
        setEquityPercentage(0);
      } else if (amountNum > remainingFunding) {
        setErrorMessage(
          `Investment cannot exceed remaining funding of ${remainingFunding.toLocaleString()} ETB.`
        );
        setShares(0);
        setEquityPercentage(0);
      } else {
        const newShares = calculateShares(amountNum, selectedProject);
        setShares(newShares);
        setEquityPercentage(newEquityPercentage);
        setAnimateShares(true);
        setTimeout(() => setAnimateShares(false), 700);
      }
    } else {
      setShares(0);
      setEquityPercentage(0);
    }
  };

  const goToNextStep = async (e) => {
    e.preventDefault();
    if (formStep === 1) {
      if (!userData.fullName || !userData.email) {
        setErrorMessage("Please provide valid user information.");
        console.error("Invalid user data:", userData);
        return;
      }
      setFormStep(2);
    } else if (
      formStep === 2 &&
      amount &&
      shares > 0 &&
      Number(amount) <= selectedProject.maxInvestment &&
      Number(amount) <= remainingFunding &&
      (Number(amount) >= selectedProject.minInvestment ||
        Number(amount) === remainingFunding) &&
      remainingFunding > 0
    ) {
      setIsSubmitting(true);
      const newTxRef = `tx-${uuidv4()}`;
      const details = {
        txRef: newTxRef,
        fullName: userData.fullName,
        email: userData.email,
        projectId: selectedProject.id,
        projectName: selectedProject.name,
        amount: Number(amount),
        shares: shares,
        equityPercentage: equityPercentage, // Send as decimal (e.g., 0.1975248)
        sharePrice: selectedProject.sharePrice,
        timestamp: new Date().toISOString(),
      };

      try {
        const response = await axios.post(
          `${API_URL}/save-investment`,
          details,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Investment saved as pending:", response.data);
        setInvestmentDetails(details);
        setTxRef(newTxRef);
        localStorage.setItem(
          "pendingInvestment",
          JSON.stringify({ investmentDetails: details, txRef: newTxRef })
        );
        setShowConfirmation(true);
      } catch (error) {
        console.error(
          "Error saving investment:",
          error.response?.data || error.message
        );
        const errorMsg =
          error.response?.data?.message ||
          "Failed to save investment. Please try again.";
        setErrorMessage(errorMsg);
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          navigate("/login");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrorMessage(
        remainingFunding <= 0
          ? "This project has reached or exceeded its funding goal."
          : "Please enter a valid investment amount."
      );
      console.error("Invalid investment amount:", {
        amount,
        shares,
        remainingFunding,
      });
    }
  };

  const goToPreviousStep = () => {
    if (formStep > 1) setFormStep(formStep - 1);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-[#020917] text-white p-8 rounded-lg border-2 border-orange-500 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p>Loading investment information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-100">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-10"
        aria-label="Go back"
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="bg-[#020917] text-white p-8 rounded-2xl border-2 border-orange-500 w-full max-w-md shadow-xl">
        {selectedProject ? (
          <div className="mb-6">
            <h1 className="text-3xl mb-4 text-center font-bold text-orange-500">
              Ethio Capital Investment
            </h1>
            <div className="w-full h-1 bg-orange-500 mb-6 rounded-full"></div>

            <div className="bg-gray-800 p-6 rounded-xl mb-6 shadow-inner">
              <h2 className="text-xl font-semibold mb-3 text-white">
                {selectedProject.name}
              </h2>
              <div className="text-gray-300 text-sm mb-4">
                <p>
                  <strong>Description:</strong> {selectedProject.description}
                </p>
                <p className="mt-2">
                  <strong>Solution:</strong> {selectedProject.solution}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Raised:</span>
                  <p className="font-bold text-orange-400">
                    {data?.fundingRaised?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0"}{" "}
                    ETB
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Goal:</span>
                  <p className="font-bold text-orange-400">
                    {data?.fundingNeeded?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0"}{" "}
                    ETB
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Remaining:</span>
                  <p className="font-bold text-orange-400">
                    {remainingFunding.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    ETB
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Your Equity:</span>
                  <p className="font-bold text-orange-400">
                    {(priorEquity + equityPercentage) * 100}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Equity Offered:</span>
                  <p className="font-bold text-orange-400">
                    {selectedProject.equityOffered}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Investment Timeline:</span>
                  <p className="font-bold text-orange-400">
                    {selectedProject.investmentTimeline}
                  </p>
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-sm mt-4">
                <p className="flex items-center gap-2 text-orange-300">
                  <FaInfoCircle /> Shares must be sold to at least 4 investors.
                </p>
                {priorEquity > 0 && (
                  <p className="flex items-center gap-2 text-orange-300 mt-2">
                    <FaInfoCircle /> You have already invested{" "}
                    {priorEquity * 100}% equity.
                  </p>
                )}
                {remainingFunding <= 0 && (
                  <p className="flex items-center gap-2 text-orange-300 mt-2">
                    <FaInfoCircle /> This project has reached its funding goal.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-8">
              <div
                className={`flex-1 text-center ${
                  formStep >= 1 ? "text-orange-500" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    formStep >= 1 ? "bg-orange-500 text-white" : "bg-gray-700"
                  }`}
                >
                  1
                </div>
                <p className="text-xs">Personal Info</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div
                  className={`h-0.5 w-full ${
                    formStep >= 2 ? "bg-orange-500" : "bg-gray-700"
                  }`}
                ></div>
              </div>
              <div
                className={`flex-1 text-center ${
                  formStep >= 2 ? "text-orange-500" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                    formStep >= 2 ? "bg-orange-500 text-white" : "bg-gray-700"
                  }`}
                >
                  2
                </div>
                <p className="text-xs">Investment Details</p>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm mb-4 flex items-center gap-2 bg-red-900/50 p-3 rounded-lg">
                <FaInfoCircle /> {errorMessage}
              </p>
            )}

            <form className="flex flex-col space-y-6">
              {formStep === 1 && (
                <div className="bg-gray-800 p-6 rounded-xl space-y-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FaUser className="text-orange-500" />
                      <span>Full Name</span>
                    </div>
                    <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                      {userData.fullName || "Not available"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FaEnvelope className="text-orange-500" />
                      <span>Email</span>
                    </div>
                    <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                      {userData.email || "Not available"}
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg text-sm">
                    <p className="flex items-center gap-2 text-orange-300">
                      <FaInfoCircle /> Information loaded from database records
                    </p>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm flex items-center gap-2 text-gray-300">
                      <FaDollarSign className="text-orange-500" /> Investment
                      Amount (ETB)
                    </label>
                    <input
                      className="px-4 py-3 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                      onChange={handleAmountChange}
                      value={amount}
                      type="number"
                      step="0.01"
                      min={selectedProject.minInvestment}
                      max={Math.min(
                        selectedProject.maxInvestment,
                        remainingFunding
                      )}
                      placeholder={
                        remainingFunding <= 0
                          ? "Project fully funded"
                          : `Min ${selectedProject.minInvestment.toLocaleString()} - Max ${Math.min(
                              selectedProject.maxInvestment,
                              remainingFunding
                            ).toLocaleString()} ETB`
                      }
                      required
                      disabled={remainingFunding <= 0}
                    />
                    {amount &&
                      Number(amount) < selectedProject.minInvestment &&
                      Number(amount) !== remainingFunding &&
                      remainingFunding > 0 && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-2">
                          <FaInfoCircle /> Investment must be at least{" "}
                          {selectedProject.minInvestment.toLocaleString()} ETB
                          {remainingFunding < 3000 && remainingFunding > 0
                            ? ` or exactly ${remainingFunding.toLocaleString()} ETB`
                            : ""}
                        </p>
                      )}
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-2 text-sm flex items-center gap-2 text-gray-300">
                      <FaChartLine className="text-orange-500" /> Shares You
                      Will Receive
                    </label>
                    <div
                      className={`px-4 py-3 rounded-lg bg-gray-700 font-bold text-center text-xl ${
                        animateShares
                          ? "text-orange-500 scale-105"
                          : "text-white"
                      }`}
                      style={{ transition: "all 0.3s ease" }}
                    >
                      {shares.toFixed(5)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-gray-400">Share Price:</span>
                        <p className="text-white">
                          {selectedProject.sharePrice} ETB
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Value:</span>
                        <p className="text-white">
                          {(shares * selectedProject.sharePrice).toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}{" "}
                          ETB
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">New Equity:</span>
                        <p className="text-white">{equityPercentage * 100}%</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Equity:</span>
                        <p className="text-white">
                          {(priorEquity + equityPercentage) * 100}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Max Equity:</span>
                        <p className="text-white">
                          {Number(selectedProject.equityOffered) / 4}%
                        </p>
                      </div>
                      {priorEquity > 0 && (
                        <div>
                          <span className="text-gray-400">Prior Equity:</span>
                          <p className="text-white">{priorEquity * 100}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-between mt-8">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                <button
                  type="button"
                  onClick={goToNextStep}
                  className={`px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors ${
                    (formStep === 2 &&
                      (!amount ||
                        shares <= 0 ||
                        (Number(amount) < selectedProject.minInvestment &&
                          Number(amount) !== remainingFunding) ||
                        Number(amount) > selectedProject.maxInvestment ||
                        Number(amount) > remainingFunding ||
                        remainingFunding <= 0)) ||
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={
                    (formStep === 2 &&
                      (!amount ||
                        shares <= 0 ||
                        (Number(amount) < selectedProject.minInvestment &&
                          Number(amount) !== remainingFunding) ||
                        Number(amount) > selectedProject.maxInvestment ||
                        Number(amount) > remainingFunding ||
                        remainingFunding <= 0)) ||
                    isSubmitting
                  }
                >
                  {isSubmitting
                    ? "Processing..."
                    : formStep === 1
                    ? "Continue to Investment"
                    : "Proceed to Payment"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-gray-400">
              By clicking Proceed to Payment, you agree to our{" "}
              <a href="/terms" className="text-orange-400 hover:underline">
                Terms and Conditions
              </a>{" "}
              for investment.
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-center p-6 bg-red-900/50 rounded-lg">
            No project selected. Please go back and try again.
          </p>
        )}
      </div>
      {showConfirmation && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white text-black p-8 rounded-2xl max-w-md w-full shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold mb-4 text-orange-600">
              Confirm Your Investment
            </h2>
            <div className="bg-gray-100 p-6 rounded-xl mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="col-span-2">
                  <p className="text-gray-500">Project</p>
                  <p className="font-bold text-lg text-gray-900">
                    {selectedProject.name}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Investor Details</p>
                  <div className="space-y-1">
                    <p className="font-medium">
                      Full Name: {userData.fullName}
                    </p>
                    <p className="font-medium">Email: {userData.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-bold text-green-700">
                    {Number(amount).toLocaleString()} ETB
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Shares</p>
                  <p className="font-bold text-gray-900">{shares.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Share Price</p>
                  <p className="font-medium text-gray-900">
                    {selectedProject.sharePrice} ETB
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">New Equity</p>
                  <p className="font-bold text-gray-900">
                    {equityPercentage * 100}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Total Equity</p>
                  <p className="font-bold text-gray-900">
                    {(priorEquity + equityPercentage) * 100}%
                  </p>
                </div>
                {priorEquity > 0 && (
                  <div>
                    <p className="text-gray-500">Prior Equity</p>
                    <p className="font-bold text-gray-900">
                      {priorEquity * 100}%
                    </p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-gray-500">Transaction Reference</p>
                  <p className="font-medium text-gray-900">{txRef}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeConfirmation}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <Pay
                fname={userData.fullName.split(" ")[0] || userData.fullName}
                lname={userData.fullName.split(" ").slice(1).join(" ") || ""}
                email={userData.email}
                amount={Number(amount)}
                public_key={public_key}
                project_id={selectedProject.id}
                project_name={selectedProject.name}
                shares={shares}
                equityPercentage={equityPercentage * 100} // Send as percentage to Pay component
                onCancel={closeConfirmation}
                fullName={userData.fullName}
                txRef={txRef}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
