// // import React, { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { FaUser, FaArrowLeft, FaEnvelope, FaLock, FaBuilding, FaUserTie, FaLightbulb } from "react-icons/fa";
// // import axios from "axios";
// // import ClipLoader from "react-spinners/ClipLoader";
// // // import userImage from "../ass/key.png";


// // const SignUp = () => {

// //   const [step, setStep] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [role, setRole] = useState("");
// //   const [formData, setFormData] = useState({
// //     fullName: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //     companyName: "",
// //     // industry: "",
// //     // investmentInterests: [],
// //     // New fields for investor
// //     // idDocument: null,
// //     // bankStatement: null,
// //     // portfolioEvidence: null,
// //     // New fields for entrepreneur
// //     // businessPlan: null,
// //     // fundingPurpose: "",
// //     // requestedAmount: "",
// //     // educationDetails: "",
// //   });
// //   const navigate = useNavigate();
// //   // const handleFileChange = (field) => (e) => {
// //   //   setFormData({ ...formData, [field]: e.target.files[0] });
// //   // };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     setLoading(true);
// //     //  signup logic here including file uploads
// //     try {

// //       const response = await axios.post("https://ethio-capital-back-end-2.onrender.com/api/v1/signup", formData);
// //       console.log(response.data);
     
// //     } catch (error) {
// //       alert("Something went wrong. Please try again later.");
// //     } finally {
// //       setLoading(true);
// //       setTimeout(() => {
// //         setLoading(false);
// //         navigate("/login");
// //       }, 2000);
// //     }

// //   };

// //   const roles = [
// //     {
// //       id: "entrepreneur",
// //       title: "Entrepreneur",
// //       icon: <FaLightbulb className="text-4xl mb-4" />,
// //       description: "I want to showcase my startup and raise funds",
// //     },
// //     {
// //       id: "investor",
// //       title: "Investor",
// //       icon: <FaUserTie className="text-4xl mb-4" />,
// //       description: "I want to invest in promising startups",
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-emerald-800 p-4">
// //       <motion.div
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="bg-white/10 backdrop-blur-lg w-full max-w-md rounded-2xl p-8 shadow-2xl"
// //       >
// //         <button
// //           onClick={() => navigate("/welcome")}
// //           className="absolute top-4 left-4 text-white hover:text-yellow-400"
// //         >
// //           <FaArrowLeft className="text-2xl" />
// //         </button>

// //         <h2 className="text-3xl font-bold text-white text-center mb-8">Create Account</h2>

// //         <AnimatePresence mode="wait">
// //           {step === 1 && (
// //             <motion.div
// //               key="step1"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               className="space-y-6"
// //             >
// //               <h3 className="text-xl text-white text-center mb-6">Choose your role</h3>
// //               <div className="grid grid-cols-1 gap-4">
// //                 {roles.map((roleOption) => (
// //                   <motion.button
// //                     key={roleOption.id}
// //                     whileHover={{ scale: 1.02 }}
// //                     whileTap={{ scale: 0.98 }}
// //                     onClick={(e) => {
// //                       setRole(roleOption.id);
// //                       setFormData({ ...formData, role: roleOption.id });
// //                       setStep(2);
// //                     }}
// //                     className={`p-6 rounded-xl text-center flex flex-col items-center justify-center ${role === roleOption.id
// //                         ? "bg-yellow-400 text-purple-900"
// //                         : "bg-white/10 text-white hover:bg-white/20"
// //                       } transition-all duration-300`}
// //                   >
// //                     {roleOption.icon}
// //                     <h4 className="text-xl font-bold mb-2">{roleOption.title}</h4>
// //                     <p className="text-sm opacity-80">{roleOption.description}</p>
// //                   </motion.button>
// //                 ))}
// //               </div>
// //             </motion.div>
// //           )}

// //           {step === 2 && (
// //             <motion.form
// //               key="step2"
// //               initial={{ opacity: 0, x: 20 }}
// //               animate={{ opacity: 1, x: 0 }}
// //               exit={{ opacity: 0, x: -20 }}
// //               onSubmit={handleSubmit}
// //               className="space-y-6"
// //             >
// //               {/* Basic Information */}
// //               <div className="space-y-4">
// //                 <div className="relative">
// //                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                   <input
// //                     type="text"
// //                     value={formData.fullName}
// //                     onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
// //                     className="w-full bg-white/10 border bord  er-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
// //                     placeholder="Full Name"
// //                     required
// //                   />
// //                 </div>

// //                 <div className="relative">
// //                   <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                   <input
// //                     type="email"
// //                     value={formData.email}
// //                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                     className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
// //                     placeholder="Email"
// //                     required
// //                   />
// //                 </div>

// //                 <div className="relative">
// //                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                   <input
// //                     type="password"
// //                     value={formData.password}
// //                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //                     className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
// //                     placeholder="Password"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               {/* Investor-specific fields */}
// //               {/* {role === "investor" && (
// //                 <div className="space-y-4">
// //                   <div className="file-upload-container">
// //                     <label className="block text-white text-sm font-medium mb-2">ID Document</label>
// //                     <div className="relative">
// //                       <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                       <input
// //                         type="file"
// //                         onChange={handleFileChange('idDocument')}
// //                         className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
// //                         // required
// //                       />
// //                     </div>
// //                   </div>

// //                   <div className="file-upload-container">
// //                     <label className="block text-white text-sm font-medium mb-2">Bank Statement</label>
// //                     <div className="relative">
// //                       <FaUniversity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                       <input
// //                         type="file"
// //                         onChange={handleFileChange('bankStatement')}
// //                         className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
// //                         // required
// //                       />
// //                     </div>
// //                   </div>

// //                   <div className="file-upload-container">
// //                     <label className="block text-white text-sm font-medium mb-2">Investment Portfolio Evidence</label>
// //                     <div className="relative">
// //                       <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                       <input
// //                         type="file"
// //                         onChange={handleFileChange('portfolioEvidence')}
// //                         className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
// //                         // required
// //                       />
// //                     </div>
// //                   </div>
// //                 </div>
// //               )} */}

// //               {/* Entrepreneur-specific fields */}
// //               {role === "entrepreneur" && (
// //                 <div className="space-y-4">
// //                   <div className="relative">
// //                     <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                     <input
// //                       type="text"
// //                       value={formData.companyName}
// //                       onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
// //                       className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400"
// //                       placeholder="Company Name (if applicable)"
// //                     />
// //                   </div>

// //                   {/* <div className="relative">
// //                     <FaGraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                     <input
// //                       type="text"
// //                       value={formData.educationDetails}
// //                       onChange={(e) => setFormData({ ...formData, educationDetails: e.target.value })}
// //                       className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400"
// //                       placeholder="Education Details"
// //                       required
// //                     />
// //                   </div>

// //                   <div className="relative">
// //                     <select
// //                       value={formData.fundingPurpose}
// //                       onChange={(e) => setFormData({ ...formData, fundingPurpose: e.target.value })}
// //                       className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-black"
// //                       required
// //                     >
// //                       <option value="">Select Funding Purpose</option>
// //                       <option value="business">Business Idea</option>
// //                       <option value="education">Education</option>
// //                     </select>
// //                   </div> */}

// //                   {/* <div className="relative">
// //                     <input
// //                       type="number"
// //                       value={formData.requestedAmount}
// //                       onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
// //                       className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-4 text-white"
// //                       placeholder="Requested Amount ($)"
// //                       required
// //                     />
// //                   </div> */}

// //                   {/* <div className="file-upload-container">
// //                     <label className="block text-white text-sm font-medium mb-2">Business Plan / Study Proposal</label>
// //                     <div className="relative">
// //                       <FaFileUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
// //                       <input
// //                         type="file"
// //                         onChange={handleFileChange('businessPlan')}
// //                         className="w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white"
// //                         required
// //                       />
// //                     </div>
// //                   </div> */}
// //                 </div>
// //               )}
// //               {/* 
              
// //                 {/*  */}
// //               <div className="relative flex gap-4">
// //                 <motion.button
// //                   whileHover={{ scale: 1.02 }}
// //                   whileTap={{ scale: 0.98 }}
// //                   type="button"
// //                   onClick={() => setStep(1)}
// //                   disabled={loading}
// //                   className={`flex-1 bg-white/10 text-white py-3 rounded-lg font-bold transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:bg-white/20'
// //                     }`}
// //                 >
// //                   Back
// //                 </motion.button>

// //                 <motion.button
// //                   whileHover={{ scale: 1.02 }}
// //                   whileTap={{ scale: 0.98 }}
// //                   type="submit"
// //                   disabled={loading}
// //                   className={`flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 py-3 rounded-lg font-bold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:from-yellow-500 hover:to-yellow-400'
// //                     }`}
// //                 >
// //                   {role === 'investor' ? 'Submit' : 'Sign Up'}
// //                 </motion.button>

// //                 {loading && (
// //                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
// //                     <ClipLoader loading={loading} size={50} aria-label="Loading Spinner" data-testid="loader" />
// //                   </div>
// //                 )}
// //               </div>

// //             </motion.form>
// //           )}
// //         </AnimatePresence>

// //         <div className="mt-6 text-center">
// //           <p className="text-white">
// //             Already have an account?{" "}
// //             <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">
// //               Login
// //             </Link>

// //           </p>
// //         </div>
// //       </motion.div>
// //     </div>
// //   );
// // };

// // export default SignUp;


// import React, { useState } from "react"; 
// import { Link, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   FaUser, FaArrowLeft, FaEnvelope, FaLock, FaBuilding, FaUserTie, FaLightbulb,
//   FaEye, FaEyeSlash, FaFileAlt
// } from "react-icons/fa";
// import axios from "axios";
// import ClipLoader from "react-spinners/ClipLoader";

// const SignUp = () => {
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showTermsModal, setShowTermsModal] = useState(false);
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [nameError, setNameError] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     companyName: "",
//     role: "",
//   });
//   const [passwordError, setPasswordError] = useState("");

//   const navigate = useNavigate();

//   const validatePassword = (password) => {
//     const nonDigitCount = (password.match(/[^0-9]/g) || []).length;
//     const digitCount = (password.match(/[0-9]/g) || []).length;
//     return nonDigitCount >= 2 && digitCount >= 6;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (nameError) {
//       alert("Please fix errors in the form before submitting.");
//       return;
//     }

//     if (!termsAccepted) {
//       alert("Please accept the terms and conditions to proceed.");
//       return;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match.");
//       return;
//     }

//     if (!validatePassword(formData.password)) {
//       setPasswordError("Password must contain at least 2 non-digit characters and 6 digits for security.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("https://ethiocapital-back.onrender.com/api/v1/signup", formData);
//       console.log(response.data);
//       navigate("/login");
//     } catch (error) {
//       alert("Something went wrong. Please try again later.");
//     } finally {
//       setLoading(true);
//       setTimeout(() => {
//         setLoading(false);
//       }, 2000);
//     }
//   };

//   const roles = [
//     {
//       id: "entrepreneur",
//       title: "Entrepreneur",
//       icon: <FaLightbulb className="text-4xl mb-4" />,
//       description: "I want to showcase my startup and raise funds",
//     },
//     {
//       id: "investor",
//       title: "Investor",
//       icon: <FaUserTie className="text-4xl mb-4" />,
//       description: "I want to invest in promising startups",
//     },
//   ];

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white p-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl border border-gray-200"
//       >
//         <button
//           onClick={() => navigate("/welcome")}
//           className="absolute top-4 left-4 text-blue-500 hover:text-blue-700"
//         >
//           <FaArrowLeft className="text-2xl" />
//         </button>

//         <div className="bg-blue-500 rounded-lg py-2 mb-8">
//           <h2 className="text-3xl font-bold text-white text-center">Create Account</h2>
//         </div>

//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.div
//               key="step1"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               className="space-y-6"
//             >
//               <h3 className="text-xl text-black text-center mb-6">Choose your role</h3>
//               <div className="grid grid-cols-1 gap-4">
//                 {roles.map((roleOption) => (
//                   <motion.button
//                     key={roleOption.id}
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                     onClick={() => {
//                       setRole(roleOption.id);
//                       setFormData({ ...formData, role: roleOption.id });
//                       setStep(2);
//                     }}
//                     className={`p-6 rounded-xl text-center flex flex-col items-center justify-center ${
//                       role === roleOption.id
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-100 text-black hover:bg-blue-500 hover:text-white"
//                     } transition-all duration-300`}
//                   >
//                     {roleOption.icon}
//                     <h4 className="text-xl font-bold mb-2">{roleOption.title}</h4>
//                     <p className="text-sm opacity-80">{roleOption.description}</p>
//                   </motion.button>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {step === 2 && (
//             <motion.form
//               key="step2"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//               onSubmit={handleSubmit}
//               className="space-y-6"
//             >
//               <div className="space-y-4">
//                 {/* Full Name Input */}
//                 <div className="relative">
//                   <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input
//                     type="text"
//                     value={formData.fullName}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       const nameRegex = /^[A-Za-z\s]+$/;
//                       if (!nameRegex.test(value) && value !== "") {
//                         setNameError("Name cannot contain numbers or special characters.");
//                       } else {
//                         setNameError("");
//                       }
//                       setFormData({ ...formData, fullName: value });
//                     }}
//                     className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Full Name"
//                     required
//                   />
//                 </div>
//                 {nameError && (
//                   <p className="text-red-500 text-sm">{nameError}</p>
//                 )}

//                 {/* Email Input */}
//                 <div className="relative">
//                   <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                     className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Email"
//                     required
//                   />
//                 </div>

//                 {/* Password Input */}
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={formData.password}
//                     onChange={(e) => {
//                       setFormData({ ...formData, password: e.target.value });
//                       setPasswordError("");
//                     }}
//                     className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>

//                 {/* Confirm Password */}
//                 <div className="relative">
//                   <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                   <input
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={formData.confirmPassword}
//                     onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                     className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     placeholder="Confirm Password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
//                   >
//                     {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//                 {passwordError && (
//                   <p className="text-red-500 text-sm">{passwordError}</p>
//                 )}

//                 {/* Company Name (optional) */}
//                 {role === "entrepreneur" && (
//                   <div className="relative">
//                     <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
//                     <input
//                       type="text"
//                       value={formData.companyName}
//                       onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                       className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Company Name (if applicable)"
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* Terms and Conditions */}
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={termsAccepted}
//                   onChange={() => setTermsAccepted(!termsAccepted)}
//                   className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label className="text-black text-sm">
//                   I agree to the{" "}
//                   <button
//                     type="button"
//                     onClick={() => setShowTermsModal(true)}
//                     className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center"
//                   >
//                     <FaFileAlt className="mr-1" /> Terms and Conditions
//                   </button>
//                 </label>
//               </div>

//               {/* Submit Buttons */}
//               <div className="relative flex gap-4">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="button"
//                   onClick={() => setStep(1)}
//                   disabled={loading}
//                   className={`flex-1 bg-gray-100 text-black py-3 rounded-lg font-bold transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-200'}`}
//                 >
//                   Back
//                 </motion.button>

//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   type="submit"
//                   disabled={loading}
//                   className={`flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-600'}`}
//                 >
//                   Sign Up
//                 </motion.button>

//                 {loading && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
//                     <ClipLoader loading={loading} size={50} />
//                   </div>
//                 )}
//               </div>
//             </motion.form>
//           )}
//         </AnimatePresence>

//         {/* Terms Modal */}
//         {showTermsModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
//           >
//             <motion.div
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               className="bg-white rounded-lg p-6 max-w-lg w-full"
//             >
//               <h3 className="text-2xl font-bold text-black mb-4">Ethio Capital Terms and Regulations</h3>
//               <div className="text-black text-sm space-y-2 max-h-96 overflow-y-auto">
//                 <p><strong>1. Account Responsibility:</strong> Users are responsible for maintaining the confidentiality of their account credentials.</p>
//                 <p><strong>2. Investment Risks:</strong> All investments carry risks. Ethio Capital does not guarantee returns on investments.</p>
//                 <p><strong>3. Equity Purchase Limits:</strong> Investors may purchase up to 25% of a startup's equity.</p>
//                 <p><strong>4. Role-Based Access:</strong> Students can explore but need verification to register as entrepreneurs.</p>
//                 <p><strong>5. Data Privacy:</strong> We handle personal data per our Privacy Policy.</p>
//                 <p><strong>6. Prohibited Activities:</strong> No fraudulent or abusive use of the platform.</p>
//                 <p><strong>7. Compliance:</strong> Follow all laws and rules.</p>
//                 <p><strong>8. Termination:</strong> We may terminate accounts for rule violations.</p>
//               </div>
//               <button
//                 onClick={() => setShowTermsModal(false)}
//                 className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
//               >
//                 Close
//               </button>
//             </motion.div>
//           </motion.div>
//         )}

//         <div className="mt-6 text-center">
//           <p className="text-black">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
//               Login
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default SignUp;
import React, { useState } from "react"; 
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser, FaArrowLeft, FaEnvelope, FaLock, FaBuilding, FaUserTie, FaLightbulb,
  FaEye, FaEyeSlash, FaFileAlt, FaTimes, FaCheck
} from "react-icons/fa";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [nameError, setNameError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    role: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const nonDigitCount = (password.match(/[^0-9]/g) || []).length;
    const digitCount = (password.match(/[0-9]/g) || []).length;
    return nonDigitCount >= 2 && digitCount >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nameError) {
      alert("Please fix errors in the form before submitting.");
      return;
    }

    if (!termsAccepted) {
      alert("Please accept the terms and conditions to proceed.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setPasswordError("Password must contain at least 2 non-digit characters and 6 digits for security.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://ethiocapital-back.onrender.com/api/v1/signup", formData);
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
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

  const termSections = [
    {
      title: "Account Responsibility",
      content: "Users are responsible for maintaining the confidentiality of their account credentials and all activities that occur under their account. You must notify Ethio Capital immediately of any unauthorized use of your account or any other breach of security."
    },
    {
      title: "Investment Risks",
      content: "All investments carry risks. Ethio Capital does not guarantee returns on investments. Past performance is not indicative of future results. You should carefully consider your investment objectives, level of experience, and risk appetite before making any investment decisions."
    },
    {
      title: "Equity Purchase Limits",
      content: "Investors may purchase up to 25% of a startup's equity through our platform. This limit is in place to ensure diversity of investment and to protect both startups and investors from over-concentration of ownership."
    },
    {
      title: "Role-Based Access",
      content: "Students can explore the platform but need verification to register as entrepreneurs. Different roles on the platform have different access levels and capabilities designed to ensure appropriate use of platform features."
    },
    {
      title: "Data Privacy",
      content: "We handle personal data according to our Privacy Policy. Your personal information will be collected, stored, processed, and shared only as described in that policy and with your explicit consent where required by applicable law."
    },
    {
      title: "Prohibited Activities",
      content: "Users are prohibited from engaging in fraudulent activities, misrepresentation, market manipulation, or any form of abusive behavior on the platform. Any such activities may result in immediate account termination and possible legal action."
    },
    {
      title: "Compliance",
      content: "All users must comply with applicable laws, regulations, and platform rules. This includes securities laws, anti-money laundering regulations, and any other relevant legal requirements in your jurisdiction."
    },
    {
      title: "Termination",
      content: "Ethio Capital reserves the right to terminate or suspend accounts for violations of these terms, suspicious activity, or at our discretion. Upon termination, access to certain features and content may be restricted or removed entirely."
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-md rounded-2xl p-8 shadow-2xl border border-gray-200"
      >
        <button
          onClick={() => navigate("/welcome")}
          className="absolute top-4 left-4 text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="text-2xl" />
        </button>

        <div className="bg-blue-500 rounded-lg py-2 mb-8">
          <h2 className="text-3xl font-bold text-white text-center">Create Account</h2>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-xl text-black text-center mb-6">Choose your role</h3>
              <div className="grid grid-cols-1 gap-4">
                {roles.map((roleOption) => (
                  <motion.button
                    key={roleOption.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setRole(roleOption.id);
                      setFormData({ ...formData, role: roleOption.id });
                      setStep(2);
                    }}
                    className={`p-6 rounded-xl text-center flex flex-col items-center justify-center ${
                      role === roleOption.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-black hover:bg-blue-500 hover:text-white"
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
              <div className="space-y-4">
                {/* Full Name Input */}
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => {
                      const value = e.target.value;
                      const nameRegex = /^[A-Za-z\s]+$/;
                      if (!nameRegex.test(value) && value !== "") {
                        setNameError("Name cannot contain numbers or special characters.");
                      } else {
                        setNameError("");
                      }
                      setFormData({ ...formData, fullName: value });
                    }}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                    required
                  />
                </div>
                {nameError && (
                  <p className="text-red-500 text-sm">{nameError}</p>
                )}

                {/* Email Input */}
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setPasswordError("");
                    }}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Password"
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

                {/* Confirm Password */}
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm Password"
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
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}

                {/* Company Name (optional) */}
                {role === "entrepreneur" && (
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-10 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Company Name (if applicable)"
                    />
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-black text-sm">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-blue-500 hover:text-blue-700 font-medium inline-flex items-center"
                  >
                    <FaFileAlt className="mr-1" /> Terms and Conditions
                  </button>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="relative flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className={`flex-1 bg-gray-100 text-black py-3 rounded-lg font-bold transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-200'}`}
                >
                  Back
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-blue-500 text-white py-3 rounded-lg font-bold shadow-lg transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'hover:bg-blue-600'}`}
                >
                  Sign Up
                </motion.button>

                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                    <ClipLoader loading={loading} size={50} />
                  </div>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Terms Modal - Improved UI */}
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-xl p-0 max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-blue-500 p-4 flex justify-between items-center sticky top-0 z-10">
                <h3 className="text-xl font-bold text-white">Ethio Capital Terms and Conditions</h3>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px-80px)]">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 mb-6">
                    By using the Ethio Capital platform, you agree to be bound by these terms and conditions. 
                    Please read them carefully before proceeding with your registration.
                  </p>
                  
                  <div className="space-y-6">
                    {termSections.map((section, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{index + 1}. {section.title}</h4>
                        <p className="text-gray-700">{section.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-yellow-800">
                      <strong>Important:</strong> The above is a summary of our complete Terms and Conditions. 
                      For the full legal document, please visit our website or contact our legal department.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t border-gray-200 p-4 bg-gray-50 sticky bottom-0 flex flex-col sm:flex-row gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 shadow hover:bg-blue-600 transition-colors"
                >
                  <FaCheck size={14} />
                  Accept & Continue
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowTermsModal(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className="mt-6 text-center">
          <p className="text-black">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;