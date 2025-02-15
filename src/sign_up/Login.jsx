import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaLock } from "react-icons/fa";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import userImage from "../ass/user.png";



const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const [loading, setLoading] = useState(false);
  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post("https://ethio-capital-back-end-2.onrender.com/api/v1/login", formData);
      console.log(response);
      localStorage.setItem("authToken", response.data.token);
      console.log("user role", response.data.user.role);
      console.log("response status", response.status);

      if (response.status === 200 && (response.data.user.role === "investor" || response.data.user.role === "entrepreneur")) {
        navigate("/entrepreneur-dashboard");
        // } else if (response.status === 200  && response.data.user.role === "entrepreneur") {
        //   navigate("/investor-dashboard");
      } else if (response.status === 200 && response.data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        alert("Invalid email or password. Please try again. for navigation");
      }
    } catch (error) {
      alert("Invalid email or password. Please try again.");
    } finally{
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-emerald-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-8 flex items-center justify-center"
        >
          <button
            onClick={() => navigate("/welcome")}
            className="absolute top-4 left-4 text-white hover:text-yellow-400"
          >
            <FaArrowLeft className="text-2xl" />
          </button>
          <img src={userImage} alt="Logo" className="w-12 h-12" />
        </motion.div>

        <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          <div className="relative w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:from-yellow-500 hover:to-yellow-400'
                }`}
            >
              Login
            </motion.button>

            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <ClipLoader loading={loading} size={35} aria-label="Loading Spinner" />
              </div>
            )}
          </div>

        </form>

        <div className="mt-6 text-center">
          <a href="/forgot-password" className="text-yellow-400 hover:text-yellow-300 text-sm">
            Forgot Password?
          </a>
          <p className="mt-4 text-white">
            Don't have an account?{" "}
            <a href="/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Sign Up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
