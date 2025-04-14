import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
  UserCheck,
  Clock,
} from "lucide-react";

const InvestorVerificationHandler = ({ darkMode }) => {
  const [verifications, setVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [statusFilter, setStatusFilter] = useState("submitted");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const API_URL = "http://localhost:3001/api/v1";
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchVerifications();
  }, [statusFilter]);

  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching verifications with token:", token);
      const response = await axios.get(`${API_URL}/verification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("API response:", response.data);
      const filteredVerifications = response.data.filter(
        (v) => v.status === statusFilter
      );
      setVerifications(filteredVerifications);
    } catch (error) {
      console.error("Error fetching verifications:", error);
      if (error.response?.status === 403) {
        alert("You don’t have permission to view verifications. Please log in as an admin.");
      } else if (error.response?.status === 404) {
        alert("Verification endpoint not found. Check backend routes.");
      } else {
        alert(
          "Failed to fetch verifications: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await axios.put(
        `${API_URL}/verification/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVerifications(verifications.filter((v) => v._id !== id));
      setSelectedVerification(null);
      alert("Verification approved successfully");
      if (statusFilter === "approved") {
        fetchVerifications();
      }
    } catch (error) {
      console.error("Error approving verification:", error);
      alert(
        "Error approving verification: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      await axios.put(
        `${API_URL}/verification/${id}/reject`,
        { rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVerifications(verifications.filter((v) => v._id !== id));
      setSelectedVerification(null);
      setRejectionReason("");
      alert("Verification rejected successfully");
      if (statusFilter === "rejected") {
        fetchVerifications();
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
      alert(
        "Error rejecting verification: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Helper function to construct the correct image URL
  const getImageUrl = (url) => {
    if (!url) return null;
    // If the URL is already absolute (starts with http/https), use it as-is
    if (url.startsWith("http")) return url;
    // Otherwise, prepend the API_URL
    return `${API_URL}/${url}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Investor Verifications
          </h2>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Review and manage investor verification requests
          </p>
        </div>

        <div className="flex gap-2">
          {["submitted", "approved", "rejected"].map((status) => (
            <motion.button
              key={status}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md capitalize shadow-sm font-medium
                ${
                  statusFilter === status
                    ? status === "submitted"
                      ? darkMode
                        ? "bg-yellow-900 text-yellow-400"
                        : "bg-yellow-100 text-yellow-800"
                      : status === "approved"
                      ? darkMode
                        ? "bg-green-900 text-green-400"
                        : "bg-green-100 text-green-800"
                      : darkMode
                      ? "bg-red-900 text-red-400"
                      : "bg-red-100 text-red-800"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              darkMode ? "border-gray-700" : "border-gray-200"
            } border-t-indigo-600 animate-spin`}
          ></div>
        </div>
      ) : verifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 text-center rounded-lg shadow-md ${
            darkMode ? "bg-gray-800 border-gray-700 border" : "bg-white"
          }`}
        >
          <Shield
            className={`w-12 h-12 mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-gray-400"
            }`}
          />
          <p
            className={`text-lg font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            No verification requests found
          </p>
          <p
            className={`mt-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            {statusFilter === "submitted"
              ? "No pending verification requests"
              : `No ${statusFilter} verifications found`}
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-6">
          <div
            className={`overflow-x-auto rounded-lg shadow ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <table
              className={`min-w-full divide-y ${
                darkMode ? "divide-gray-700" : "divide-gray-200"
              }`}
            >
              <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode
                        ? "text-gray-300 uppercase tracking-wider"
                        : "text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Investor
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode
                        ? "text-gray-300 uppercase tracking-wider"
                        : "text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Business Idea
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode
                        ? "text-gray-300 uppercase tracking-wider"
                        : "text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Investment Capacity
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode
                        ? "text-gray-300 uppercase tracking-wider"
                        : "text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Submitted On
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode
                        ? "text-gray-300 uppercase tracking-wider"
                        : "text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium ${
                      darkMode
                        ? "text-gray-300 uppercase tracking-wider"
                        : "text-gray-500 uppercase tracking-wider"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  darkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {verifications.map((verification) => (
                  <tr
                    key={verification._id}
                    className={darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      <div className="flex items-center">
                        {verification.profilePictureUrl && (
                          <div className="flex-shrink-0 h-10 w-10 mr-3">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={getImageUrl(verification.profilePictureUrl)} // Use helper function
                              alt={verification.fullName}
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150?text=Profile")
                              }
                            />
                          </div>
                        )}
                        <div>
                          <div
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {verification.fullName}
                          </div>
                          <div
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {verification.userId?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {verification.ideaId?.title || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {verification.investmentCapacity}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-900"
                      }`}
                    >
                      {formatDate(verification.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            verification.status === "submitted"
                              ? darkMode
                                ? "bg-yellow-900 text-yellow-200"
                                : "bg-yellow-100 text-yellow-800"
                              : verification.status === "approved"
                              ? darkMode
                                ? "bg-green-900 text-green-200"
                                : "bg-green-100 text-green-800"
                              : darkMode
                              ? "bg-red-900 text-red-200"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {verification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedVerification(verification)}
                          className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                            darkMode
                              ? "bg-gray-700 text-indigo-400 hover:bg-gray-600"
                              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                          }`}
                        >
                          View
                        </button>

                        {verification.status === "submitted" && (
                          <>
                            <button
                              onClick={() => handleApprove(verification._id)}
                              disabled={actionLoading}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                darkMode
                                  ? "bg-green-900 text-green-400 hover:bg-green-800"
                                  : "bg-green-50 text-green-600 hover:bg-green-100"
                              } ${
                                actionLoading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setSelectedVerification({
                                  ...verification,
                                  isRejecting: true,
                                })
                              }
                              disabled={actionLoading}
                              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                darkMode
                                  ? "bg-red-900 text-red-400 hover:bg-red-800"
                                  : "bg-red-50 text-red-600 hover:bg-red-100"
                              } ${
                                actionLoading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {verification.status === "approved" && (
                          <button
                            onClick={() =>
                              setSelectedVerification({
                                ...verification,
                                isRejecting: true,
                              })
                            }
                            disabled={actionLoading}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                              darkMode
                                ? "bg-red-900 text-red-400 hover:bg-red-800"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            } ${
                              actionLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            Revoke
                          </button>
                        )}

                        {verification.status === "rejected" && (
                          <button
                            onClick={() => handleApprove(verification._id)}
                            disabled={actionLoading}
                            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                              darkMode
                                ? "bg-green-900 text-green-400 hover:bg-green-800"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                            } ${
                              actionLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
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

      {selectedVerification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
          {/* Overlay */}
          <div
            className={`fixed inset-0 transition-opacity ${
              darkMode ? "bg-gray-900" : "bg-gray-500"
            } opacity-75`}
            onClick={() => {
              if (!selectedVerification.isRejecting || actionLoading) {
                setSelectedVerification(null);
              }
            }}
          ></div>

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`relative z-50 w-full max-w-2xl rounded-lg shadow-xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {selectedVerification.isRejecting ? (
              <div className="p-6">
                <h3
                  className={`text-lg font-medium leading-6 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedVerification.status === "approved"
                    ? "Revoke Approval"
                    : "Reject Verification Request"}
                </h3>
                <div className="mt-4">
                  <label
                    htmlFor="rejectionReason"
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {selectedVerification.status === "approved"
                      ? "Reason for Revoking"
                      : "Reason for Rejection"}
                  </label>
                  <textarea
                    id="rejectionReason"
                    rows="4"
                    className={`mt-1 block w-full border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } rounded-md shadow-sm p-2`}
                    placeholder={`Please provide a reason for ${
                      selectedVerification.status === "approved"
                        ? "revoking this approval"
                        : "rejecting this verification request"
                    }...`}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRejectionReason("");
                      setSelectedVerification({
                        ...selectedVerification,
                        isRejecting: false,
                      });
                    }}
                    disabled={actionLoading}
                    className={`inline-flex justify-center rounded-md border ${
                      darkMode
                        ? "border-gray-600 bg-gray-700 text-gray-300"
                        : "border-gray-300 bg-white text-gray-700"
                    } px-4 py-2 text-sm font-medium shadow-sm hover:bg-opacity-90 ${
                      actionLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(selectedVerification._id)}
                    disabled={actionLoading}
                    className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm ${
                      darkMode
                        ? "bg-red-700 text-white hover:bg-red-800"
                        : "bg-red-600 text-white hover:bg-red-700"
                    } ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {actionLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : selectedVerification.status === "approved" ? (
                      "Confirm Revocation"
                    ) : (
                      "Confirm Rejection"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div
                  className={`p-6 ${
                    darkMode
                      ? "border-b border-gray-700"
                      : "border-b border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3
                      className={`text-lg font-medium leading-6 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Investor Verification Details
                    </h3>
                    <button
                      onClick={() => setSelectedVerification(null)}
                      className={`rounded-md ${
                        darkMode
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Personal Information
                      </h4>
                      <div className="mt-2 space-y-3">
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Full Name
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedVerification.fullName}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Email
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedVerification.userId?.email || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Phone
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedVerification.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Investment Details
                      </h4>
                      <div className="mt-2 space-y-3">
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Investment Capacity
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedVerification.investmentCapacity}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Experience
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedVerification.experience}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Interested In
                          </p>
                          <p
                            className={`font-medium ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {selectedVerification.ideaId?.title || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Verification Documents
                    </h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p
                          className={`text-sm mb-2 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ID Document
                        </p>
                        <div
                          className={`border rounded-md overflow-hidden ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          {selectedVerification.idPictureUrl && (
                            <img
                              src={getImageUrl(selectedVerification.idPictureUrl)} // Use helper function
                              alt="ID Document"
                              className="w-full h-auto max-h-40 object-contain"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/300x200?text=ID+Document")
                              }
                            />
                          )}
                        </div>
                        <button
                          className={`mt-2 flex items-center text-sm ${
                            darkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                          onClick={() =>
                            window.open(getImageUrl(selectedVerification.idPictureUrl), "_blank")
                          }
                        >
                          <ExternalLink size={14} className="mr-1" /> View Full Size
                        </button>
                      </div>
                      <div>
                        <p
                          className={`text-sm mb-2 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Profile Picture
                        </p>
                        <div
                          className={`border rounded-md overflow-hidden ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                          }`}
                        >
                          {selectedVerification.profilePictureUrl && (
                            <img
                              src={getImageUrl(selectedVerification.profilePictureUrl)} // Use helper function
                              alt="Profile"
                              className="w-full h-auto max-h-40 object-contain"
                              onError={(e) =>
                                (e.target.src =
                                  "https://via.placeholder.com/150?text=Profile")
                              }
                            />
                          )}
                        </div>
                        <button
                          className={`mt-2 flex items-center text-sm ${
                            darkMode ? "text-indigo-400" : "text-indigo-600"
                          }`}
                          onClick={() =>
                            window.open(getImageUrl(selectedVerification.profilePictureUrl), "_blank")
                          }
                        >
                          <ExternalLink size={14} className="mr-1" /> View Full Size
                        </button>
                      </div>
                    </div>
                  </div>

                  {selectedVerification.createdAt && (
                    <div className="mt-8">
                      <h4
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        } mb-3`}
                      >
                        Status Timeline
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div
                            className={`flex-shrink-0 h-5 w-5 rounded-full ${
                              darkMode ? "bg-blue-700" : "bg-blue-100"
                            } flex items-center justify-center`}
                          >
                            <Clock
                              size={12}
                              className={darkMode ? "text-blue-300" : "text-blue-600"}
                            />
                          </div>
                          <div className="ml-3">
                            <p
                              className={`text-sm font-medium ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              Submitted
                            </p>
                            <p
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {formatDate(selectedVerification.createdAt)}
                            </p>
                          </div>
                        </div>

                        {(selectedVerification.status === "approved" ||
                          selectedVerification.status === "rejected") && (
                          <div className="flex items-start">
                            <div
                              className={`flex-shrink-0 h-5 w-5 rounded-full ${
                                selectedVerification.status === "approved"
                                  ? darkMode
                                    ? "bg-green-700"
                                    : "bg-green-100"
                                  : darkMode
                                  ? "bg-red-700"
                                  : "bg-red-100"
                              } flex items-center justify-center`}
                            >
                              {selectedVerification.status === "approved" ? (
                                <UserCheck
                                  size={12}
                                  className={
                                    darkMode ? "text-green-300" : "text-green-600"
                                  }
                                />
                              ) : (
                                <XCircle
                                  size={12}
                                  className={
                                    darkMode ? "text-red-300" : "text-red-600"
                                  }
                                />
                              )}
                            </div>
                            <div className="ml-3">
                              <p
                                className={`text-sm font-medium ${
                                  darkMode ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {selectedVerification.status === "approved"
                                  ? "Approved"
                                  : "Rejected"}
                              </p>
                              <p
                                className={`text-xs ${
                                  darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                {selectedVerification.approvedAt
                                  ? formatDate(selectedVerification.approvedAt)
                                  : selectedVerification.rejectedAt
                                  ? formatDate(selectedVerification.rejectedAt)
                                  : "Date not recorded"}
                              </p>
                              {selectedVerification.status === "rejected" &&
                                selectedVerification.rejectionReason && (
                                  <p
                                    className={`text-xs mt-1 ${
                                      darkMode ? "text-red-400" : "text-red-500"
                                    }`}
                                  >
                                    Reason: {selectedVerification.rejectionReason}
                                  </p>
                                )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selectedVerification.status === "submitted" && (
                    <div className="mt-8 flex justify-end gap-4">
                      <button
                        onClick={() =>
                          setSelectedVerification({
                            ...selectedVerification,
                            isRejecting: true,
                          })
                        }
                        disabled={actionLoading}
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          darkMode
                            ? "bg-red-700 text-white hover:bg-red-800"
                            : "bg-red-600 text-white hover:bg-red-700"
                        } ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <XCircle size={16} className="mr-2" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(selectedVerification._id)}
                        disabled={actionLoading}
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                          darkMode
                            ? "bg-green-700 text-white hover:bg-green-800"
                            : "bg-green-600 text-white hover:bg-green-700"
                        } ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {actionLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
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
                            <CheckCircle size={16} className="mr-2" /> Approve
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default InvestorVerificationHandler;