// import React, { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Building2, Briefcase, Trophy, DollarSign, Target, History,
//   Linkedin, Twitter, Globe, Mail, Instagram, ExternalLink,
//   X, ArrowLeft, // Added ArrowLeft icon
//   ArrowRight
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom'; // Added useNavigate hook
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchUserProfile } from '../redux/UserSlice';

// const mockIncomeData = [
//   { year: '2019', amount: 2.5 },
//   { year: '2020', amount: 3.8 },
//   { year: '2021', amount: 4.2 },
//   { year: '2022', amount: 5.1 },
//   { year: '2023', amount: 6.4 },
//   { year: '2024', amount: 7.2 },
// ];


// const InvestorProfile = () => {
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);
//   const navigate = useNavigate();
//   const { userData, error, loading, status } = useSelector((state) => state.userData);
//   const dispatch = useDispatch();
//   const [showPortfolio, setShowPortfolio] = useState(false);
// const [selectedIdea, setSelectedIdea] = useState(null);

//   useEffect(() => {
//     dispatch(fetchUserProfile());
//   }, [dispatch])

//   useEffect(() => {
//     console.log("userData for profile", userData)

//   }, [userData])

//   const investor = {
//     name: "John Maxwell",
//     title: "Angel Investor & Venture Capitalist",
//     capital: "$50M",
//     preferredFields: ["Technology", "Healthcare", "Renewable Energy"],
//     experience: "15+ years",
//     successfulExits: 12,
//     portfolioCompanies: 25,
//     about: "Serial entrepreneur turned investor with a passion for transformative technologies and sustainable solutions. Focus on early-stage startups with high growth potential.",
//     socialLinks: {
//       linkedin: "linkedin.com/johnmaxwell",
//       twitter: "twitter.com/johnmaxwell",
//       website: "johnmaxwell.com",
//       instagram: "instagram.com/johnmaxwell",
//       email: "john@maxwell.com"
//     },
//     previousInvestments: [
//       {
//         name: "TechCorp",
//         result: "3x Return",
//         image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234A90E2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3ETechCorp%3C/text%3E%3C/svg%3E",
//         description: "A leading technology company specializing in AI solutions for enterprise customers."
//       },
//       {
//         name: "HealthInnovate",
//         result: "5x Return",
//         image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%2350E3C2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EHealthInnovate%3C/text%3E%3C/svg%3E",
//         description: "Healthcare technology platform revolutionizing patient care management."
//       },
//       {
//         name: "GreenEnergy",
//         result: "2.5x Return",
//         image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234CAF50'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EGreenEnergy%3C/text%3E%3C/svg%3E",
//         description: "Renewable energy solutions provider focusing on solar and wind power."
//       },
//     ],
//   };

//   const redirectToInvestorDashboard = () => {
//     navigate('/Entrepreneur-dashboard');
//   };

//   const redirectToInvestorProfileForm = () => {
//     navigate('/Investor-profile-form');
//   };



//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-blue-600 text-white py-4">
//         <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
//           <button
//             onClick={redirectToInvestorDashboard} // Redirect to /investor-dashboard
//             className="hover:bg-blue-700 p-2 rounded-full transition-colors"
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </button>
//           <h1 className="text-xl font-bold"> Profile</h1>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={redirectToInvestorProfileForm} // Redirect to /Investor-profile-form
//           className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-4 right-4 z-10"
//         >
//           Profile Form
//         </motion.button>
//       </div>
//       <div className="p-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
//         >
//           {/* Rest of the existing code remains the same */}
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               className="flex flex-col md:flex-row items-center gap-6"
//             >
//               <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
//                 <span className="text-3xl font-bold text-blue-600">
//                   <img src={userData.photo} alt='Profile' className="w-full h-full rounded-full object-cover" />
//                 </span>
//               </div>
//               <div className="text-white text-center md:text-left">
//                 <h1 className="text-3xl font-bold">{userData?.user?.fullName}</h1>
//                 <p className="text-blue-100">{userData.title}</p>

//                 {/* Social Media Links */}
//                 <div className="flex gap-4 mt-4 justify-center md:justify-start">
//                   <a href={userData?.socialLinks?.linkedin} className="text-white hover:text-blue-200 transition-colors">
//                     <Linkedin className="w-5 h-5" />
//                   </a>
//                   <a href={userData?.socialLinks?.twitter} className="text-white hover:text-blue-200 transition-colors">
//                     <Twitter className="w-5 h-5" />
//                   </a>
//                   <a href={userData?.socialLinks?.website} className="text-white hover:text-blue-200 transition-colors">
//                     <Globe className="w-5 h-5" />
//                   </a>
//                   <a href={`mailto:${userData?.socialLinks?.email}`} className="text-white hover:text-blue-200 transition-colors">
//                     <Mail className="w-5 h-5" />
//                   </a>
//                   <a href={userData?.socialLinks?.instagram} className="text-white hover:text-blue-200 transition-colors">
//                     <Instagram className="w-5 h-5" />
//                   </a>
//                 </div>
//               </div>
//             </motion.div>
//           </div>

//           {/* Main Content */}
//           <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
//             {/* Left Column */}
//             <div className="space-y-6">
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="bg-gray-50 p-6 rounded-xl"
//               >
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <Building2 className="text-blue-600" />
//                   Key Information
//                 </h2>
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <DollarSign className="text-blue-600" />
//                     <span className="font-medium">Available Capital:</span>
//                     <span>{userData.capital}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Briefcase className="text-blue-600" />
//                     <span className="font-medium">Experience:</span>
//                     <span>{userData.experience}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Trophy className="text-blue-600" />
//                     <span className="font-medium">Successful Exits:</span>
//                     <span>{userData.successfulExits}</span>
//                   </div>
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-gray-50 p-6 rounded-xl"
//               >
//                 <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                   <Target className="text-blue-600" />
//                   Preferred Fields
//                 </h2>
//                 <div className="flex flex-wrap gap-2">
//                   {userData?.preferredFields?.map((field, index) => (
//                     <span
//                       key={index}
//                       className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
//                     >
//                       {field}
//                     </span>
//                   ))}
//                 </div>
//               </motion.div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">
//               <motion.div
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="bg-gray-50 p-6 rounded-xl"
//               >
//                 <h2 className="text-xl font-semibold mb-4">Investment Performance</h2>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={mockIncomeData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="year" />
//                       <YAxis />
//                       <Tooltip />
//                       <Line
//                         type="monotone"
//                         dataKey="amount"
//                         stroke="#2563eb"
//                         strokeWidth={2}
//                         dot={{ fill: '#2563eb' }}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </motion.div>
//             </div>
//           </div>

//           {/* Portfolio Gallery */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="p-8"
//           >
//             <h2 className="text-xl font-semibold mb-6">Portfolio Gallery</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {userData?.previousInvestments?.map((investment, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.1 * index }}
//                   className="bg-gray-50 rounded-xl overflow-hidden cursor-pointer"
//                   onClick={() => setSelectedPortfolio(investment)}
//                 >
//                   <img
//                     src={investment.image}
//                     alt={investment.name}
//                     className="w-full h-48 object-cover"
//                   />
//                   <div className="p-4">
//                     <h3 className="font-semibold">{investment.name}</h3>
//                     <p className="text-green-600">{investment.result}</p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>

//           {/* Portfolio Modal */}
//           <AnimatePresence>
//             {selectedPortfolio && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//                 onClick={() => setSelectedPortfolio(null)}
//               >
//                 <motion.div
//                   initial={{ scale: 0.9 }}
//                   animate={{ scale: 1 }}
//                   exit={{ scale: 0.9 }}
//                   className="bg-white rounded-xl p-6 max-w-lg w-full"
//                   onClick={e => e.stopPropagation()}
//                 >
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl font-semibold">{selectedPortfolio.name}</h3>
//                     <button
//                       onClick={() => setSelectedPortfolio(null)}
//                       className="text-gray-500 hover:text-gray-700"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <img
//                     src={selectedPortfolio.image}
//                     alt={selectedPortfolio.name}
//                     className="w-full h-64 object-cover rounded-lg mb-4"
//                   />
//                   <p className="text-gray-600 mb-2">{selectedPortfolio.description}</p>
//                   <p className="text-green-600 font-semibold">Return: {selectedPortfolio.result}</p>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* About Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="p-8 bg-gray-50 mt-4"
//           >
//             <h2 className="text-xl font-semibold mb-4">About</h2>
//             <p className="text-gray-600 leading-relaxed">{userData.about}</p>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default InvestorProfile;


import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Briefcase, Trophy, DollarSign, Target, History,
  Linkedin, Twitter, Globe, Mail, Instagram, ExternalLink,
  X, ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../redux/UserSlice';

const mockIncomeData = [
  { year: '2019', amount: 2.5 },
  { year: '2020', amount: 3.8 },
  { year: '2021', amount: 4.2 },
  { year: '2022', amount: 5.1 },
  { year: '2023', amount: 6.4 },
  { year: '2024', amount: 7.2 },
];

const InvestorProfile = () => {
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const navigate = useNavigate();
  const { userData, error, loading, status } = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [likedIdeas, setLikedIdeas] = useState([
    {
      id: 1,
      title: "Green Energy Solution",
      description: "Renewable energy technology for sustainable future",
      likes: 156,
      isLiked: true
    },
    {
      id: 2,
      title: "Healthcare AI",
      description: "AI-powered diagnostic tools for healthcare",
      likes: 89,
      isLiked: true
    },
    {
      id: 3,
      title: "Smart Agriculture",
      description: "IoT solutions for precision farming",
      likes: 234,
      isLiked: true
    }
  ]);
  const [showLikedIdeas, setShowLikedIdeas] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    console.log("userData for profile", userData);
  }, [userData]);

  const toggleLike = (ideaId) => {
    setLikedIdeas(ideas => 
      ideas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, isLiked: !idea.isLiked }
          : idea
      )
    );
  };

  const investor = {
    name: "John Maxwell",
    title: "Angel Investor & Venture Capitalist",
    capital: "$50M",
    preferredFields: ["Technology", "Healthcare", "Renewable Energy"],
    experience: "15+ years",
    successfulExits: 12,
    portfolioCompanies: 25,
    about: "Serial entrepreneur turned investor with a passion for transformative technologies and sustainable solutions. Focus on early-stage startups with high growth potential.",
    socialLinks: {
      linkedin: "linkedin.com/johnmaxwell",
      twitter: "twitter.com/johnmaxwell",
      website: "johnmaxwell.com",
      instagram: "instagram.com/johnmaxwell",
      email: "john@maxwell.com"
    },
    previousInvestments: [
      {
        name: "TechCorp",
        result: "3x Return",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234A90E2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3ETechCorp%3C/text%3E%3C/svg%3E",
        description: "A leading technology company specializing in AI solutions for enterprise customers."
      },
      {
        name: "HealthInnovate",
        result: "5x Return",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%2350E3C2'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EHealthInnovate%3C/text%3E%3C/svg%3E",
        description: "Healthcare technology platform revolutionizing patient care management."
      },
      {
        name: "GreenEnergy",
        result: "2.5x Return",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%234CAF50'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3EGreenEnergy%3C/text%3E%3C/svg%3E",
        description: "Renewable energy solutions provider focusing on solar and wind power."
      },
    ],
  };

  const redirectToInvestorDashboard = () => {
    navigate('/Entrepreneur-dashboard');
  };

  const redirectToInvestorProfileForm = () => {
    navigate('/Investor-profile-form');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <button
            onClick={redirectToInvestorDashboard}
            className="hover:bg-blue-700 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={redirectToInvestorProfileForm}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-4 right-4 z-10"
        >
          Profile Form
        </motion.button>
      </div>

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  <img src={userData.photo} alt='Profile' className="w-full h-full rounded-full object-cover" />
                </span>
              </div>
              <div className="text-white text-center md:text-left">
                <h1 className="text-3xl font-bold">{userData?.user?.fullName}</h1>
                <p className="text-blue-100">{userData.title}</p>

                {/* Social Media Links */}
                <div className="flex gap-4 mt-4 justify-center md:justify-start">
                  <a href={userData?.socialLinks?.linkedin} className="text-white hover:text-blue-200 transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={userData?.socialLinks?.twitter} className="text-white hover:text-blue-200 transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={userData?.socialLinks?.website} className="text-white hover:text-blue-200 transition-colors">
                    <Globe className="w-5 h-5" />
                  </a>
                  <a href={`mailto:${userData?.socialLinks?.email}`} className="text-white hover:text-blue-200 transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                  <a href={userData?.socialLinks?.instagram} className="text-white hover:text-blue-200 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Liked Ideas Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Liked Ideas</h2>
              <button
                onClick={() => setShowLikedIdeas(!showLikedIdeas)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showLikedIdeas ? 'Hide Ideas' : 'Show Ideas'}
              </button>
            </div>

            <AnimatePresence>
              {showLikedIdeas && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {likedIdeas.map((idea) => (
                    <motion.div
                      key={idea.id}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-semibold mb-2">{idea.title}</h3>
                        <p className="text-gray-600 mb-4">{idea.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{idea.likes} likes</span>
                          <button
                            onClick={() => toggleLike(idea.id)}
                            className={`p-2 rounded-full ${
                              idea.isLiked 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-gray-500'
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill={idea.isLiked ? "currentColor" : "none"}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Main Content Sections */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="text-blue-600" />
                  Key Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-blue-600" />
                    <span className="font-medium">Available Capital:</span>
                    <span>{userData.capital}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-blue-600" />
                    <span className="font-medium">Experience:</span>
                    <span>{userData.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="text-blue-600" />
                    <span className="font-medium">Successful Exits:</span>
                    <span>{userData.successfulExits}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="text-blue-600" />
                  Preferred Fields
                </h2>
                <div className="flex flex-wrap gap-2">
                  {userData?.preferredFields?.map((field, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h2 className="text-xl font-semibold mb-4">Investment Performance</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockIncomeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: '#2563eb' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-gray-50 mt-4"
          >
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{userData.about}</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestorProfile;