import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaArrowLeft, FaEnvelope, FaLock, FaBuilding, FaUserTie, FaFileUpload, FaUniversity, FaGraduationCap, FaLightbulb } from "react-icons/fa";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import userImage from "../ass/key.png";


const SignUp = () => {

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    // industry: "",
    // investmentInterests: [],
    // New fields for investor
    // idDocument: null,
    // bankStatement: null,
    // portfolioEvidence: null,
    // New fields for entrepreneur
    // businessPlan: null,
    // fundingPurpose: "",
    // requestedAmount: "",
    // educationDetails: "",
  });
  const navigate = useNavigate();
  const handleFileChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    //  signup logic here including file uploads
    try {

      const response = await axios.post("http://localhost:3001/api/v1/signup", formData);
      console.log(response.data);
     
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 2000);
    }

  };

  const roles = [
    {
      id: "entrepreneur",
      title: "Entrepreneur",
      icon: <FaLightbulb className="text-4xl mb-4" />,
      description: "I want to showcase my startup and raise funds",
    },
    {
      id: "investor",
      title: "Investor",
      icon: <FaUserTie className="text-4xl mb-4" />,
      description: "I want to invest in promising startups",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-emerald-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-lg w-full max-w-md rounded-2xl p-8 shadow-2xl"
      >
        <button
          onClick={() => navigate("/welcome")}
          className="absolute top-4 left-4 text-white hover:text-yellow-400"
        >
          <FaArrowLeft className="text-2xl" />
        </button>

        <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl text-white text-center mb-6">Choose your role</h3>
              <div className="grid grid-cols-1 gap-4">
                {roles.map((roleOption) => (
                  <motion.button
                    key={roleOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      setRole(roleOption.id);
                      setFormData({ ...formData, role: roleOption.id });
                      setStep(2);
                    }}
                    className={`p-6 rounded-xl text-center flex flex-col items-center justify-center ${role === roleOption.id
                        ? "bg-yellow-400 text-purple-900"
                        : "bg-white/10 text-white hover:bg-white/20"
                      } transition-all duration-300`}
                  >
                    {roleOption.icon}
                    <h4 className="text-xl font-bold mb-2">{roleOption.title}</h4>
                    <p className="text-sm opacity-80">{roleOption.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white/10 border bord  er-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Full Name"
                    required
                  />
                </div>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Email"
                    required
                  />
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>

              {/* Investor-specific fields */}
              {/* {role === "investor" && (
                <div className="space-y-4">
                  <div className="file-upload-container">
                    <label className="block text-white text-sm font-medium mb-2">ID Document</label>
                    <div className="relative">
                      <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="file"
                        onChange={handleFileChange('idDocument')}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
                        // required
                      />
                    </div>
                  </div>

                  <div className="file-upload-container">
                    <label className="block text-white text-sm font-medium mb-2">Bank Statement</label>
                    <div className="relative">
                      <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="file"
                        onChange={handleFileChange('bankStatement')}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
                        // required
                      />
                    </div>
                  </div>

                  <div className="file-upload-container">
                    <label className="block text-white text-sm font-medium mb-2">Investment Portfolio Evidence</label>
                    <div className="relative">
                      <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="file"
                        onChange={handleFileChange('portfolioEvidence')}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
                        // required
                      />
                    </div>
                  </div>
                </div>
              )} */}

              {/* Entrepreneur-specific fields */}
              {role === "entrepreneur" && (
                <div className="space-y-4">
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400"
                      placeholder="Company Name (if applicable)"
                    />
                  </div>

                  {/* <div className="relative">
                    <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.educationDetails}
                      onChange={(e) => setFormData({ ...formData, educationDetails: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400"
                      placeholder="Education Details"
                      required
                    />
                  </div>

                  <div className="relative">
                    <select
                      value={formData.fundingPurpose}
                      onChange={(e) => setFormData({ ...formData, fundingPurpose: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-black"
                      required
                    >
                      <option value="">Select Funding Purpose</option>
                      <option value="business">Business Idea</option>
                      <option value="education">Education</option>
                    </select>
                  </div> */}

                  {/* <div className="relative">
                    <input
                      type="number"
                      value={formData.requestedAmount}
                      onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white"
                      placeholder="Requested Amount ($)"
                      required
                    />
                  </div> */}

                  {/* <div className="file-upload-container">
                    <label className="block text-white text-sm font-medium mb-2">Business Plan / Study Proposal</label>
                    <div className="relative">
                      <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="file"
                        onChange={handleFileChange('businessPlan')}
                        className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
                        required
                      />
                    </div>
                  </div> */}
                </div>
              )}
              {/* 
              
                {/*  */}
              <div className="relative flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className={`flex-1 bg-white/10 text-white py-3 rounded-lg font-bold transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:bg-white/20'
                    }`}
                >
                  Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:from-yellow-500 hover:to-yellow-400'
                    }`}
                >
                  {role === 'investor' ? 'Submit' : 'Sign Up'}
                </motion.button>

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <ClipLoader loading={loading} size={50} aria-label="Loading Spinner" data-testid="loader" />
                  </div>
                )}
              </div>

            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <p className="text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
              Login
            </Link>

          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;