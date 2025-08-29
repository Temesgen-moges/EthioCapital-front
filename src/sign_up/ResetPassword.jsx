import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import userImage from "../ass/user.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Validate passwords
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    console.log("Sending reset password request:", { token, password });

    try {
      const response = await axios.post(
        `https://ethiocapital-back.onrender.com/api/v1/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.message ||
        err.message === "Network Error"
          ? "Cannot connect to the server. Please check if the backend is running."
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl border border-gray-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-8 flex items-center justify-center"
        >
          <button
            onClick={() => navigate("/login")}
            className="absolute top-4 left-4 text-blue-500 hover:text-blue-700"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <img src={userImage} alt="Logo" className="w-12 h-12" />
        </motion.div>

        <h2 className="text-3xl font-bold text-black text-center mb-8">Reset Password</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-black text-sm font-medium">New Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-black text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="relative w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-300 ${
                loading ? "opacity-50 pointer-events-none" : "hover:bg-blue-600"
              }`}
            >
              Reset Password
            </motion.button>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <ClipLoader loading={loading} size={35} aria-label="Loading Spinner" />
              </div>
            )}
          </div>
        </form>

        {message && <p className="mt-4 text-blue-500 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}

        <div className="mt-6 text-center">
          <p className="text-black">
            Back to{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-700 font-medium">
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;