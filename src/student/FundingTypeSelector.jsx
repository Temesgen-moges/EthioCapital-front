import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  BookOpen, 
  ArrowRight,
  ChevronLeft,
  GraduationCap,
  FlaskConical,
  Users,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const FundingTypeSelector = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        damping: 12
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    },
    tap: { 
      scale: 0.97,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.05)"
    }
  };

  const iconVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.2,
      rotate: 5,
      transition: { 
        type: "spring", 
        stiffness: 300,
        yoyo: Infinity,
        duration: 0.6
      }
    }
  };

  const backgroundVariants = {
    initial: { 
      background: "linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%)" 
    },
    hover: { 
      background: "linear-gradient(135deg, #e0ebff 0%, #efe0ff 100%)",
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const educationFeatures = [
    { icon: <GraduationCap size={18} />, text: "Master's Degree Scholarships" },
    { icon: <FlaskConical size={18} />, text: "PhD Research Grants" },
    { icon: <BookOpen size={18} />, text: "Academic Conference Funding" }
  ];

  const businessFeatures = [
    { icon: <Briefcase size={18} />, text: "Equity Funding Options" },
    { icon: <TrendingUp size={18} />, text: "Share-based Investment" },
    { icon: <Users size={18} />, text: "Direct Investor Matching" }
  ];

  return (
    <motion.div 
      className="min-h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={pageTransition}
    >
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50"
        variants={backgroundVariants}
        initial="initial"
        animate={hoveredCard ? "hover" : "initial"}
      >
        <motion.nav 
          className="bg-blue-600 text-white p-4 shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.button 
            onClick={() => navigate('/Entrepreneur-dashboard')}
            className="flex items-center gap-2 hover:bg-blue-700 p-2 rounded transition-all"
            variants={buttonVariants}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
          >
            <ChevronLeft size={24} />
            <span>Back to Dashboard</span>
          </motion.button>
        </motion.nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-5xl mx-auto px-4 py-12"
        >
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
            >
              Start Your Journey
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-gray-600 text-lg"
            >
              Choose the type of support you're looking for
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Education Funding Card */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border-2 border-blue-100 hover:border-blue-300 transition-all relative"
              onClick={() => navigate('/StudentApplicationForm')}
              onHoverStart={() => setHoveredCard('education')}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 z-0"
                animate={{
                  opacity: hoveredCard === 'education' ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="p-8 flex flex-col items-center relative z-10">
                <motion.div 
                  className="p-5 bg-blue-100 rounded-full mb-6 relative"
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-200"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <BookOpen className="text-blue-600 relative z-10" size={40} />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-blue-600 mb-4"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Educational Funding
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  initial={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                >
                  Apply for master's degrees, PhD research, and academic conferences
                </motion.p>
                
                <AnimatePresence>
                  {hoveredCard === 'education' && (
                    <motion.div 
                      className="w-full space-y-2 mb-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {educationFeatures.map((feature, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded-lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {feature.icon}
                          <span>{feature.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button 
                  className="flex items-center gap-2 text-white font-semibold bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Get Started
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>

            {/* Business Idea Card */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer border-2 border-purple-100 hover:border-purple-300 transition-all relative"
              onClick={() => navigate('/Submit-Idea')}
              onHoverStart={() => setHoveredCard('business')}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 z-0"
                animate={{
                  opacity: hoveredCard === 'business' ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="p-8 flex flex-col items-center relative z-10">
                <motion.div 
                  className="p-5 bg-purple-100 rounded-full mb-6 relative"
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-purple-200"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <Lightbulb className="text-purple-600 relative z-10" size={40} />
                </motion.div>
                
                <motion.h2 
                  className="text-2xl font-bold text-purple-600 mb-4"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Business Idea Funding
                </motion.h2>
                
                <motion.p 
                  className="text-gray-600 text-center mb-6"
                  initial={{ opacity: 0.9 }}
                  whileHover={{ opacity: 1 }}
                >
                  Sell shares of your business idea and connect with investors
                </motion.p>
                
                <AnimatePresence>
                  {hoveredCard === 'business' && (
                    <motion.div 
                      className="w-full space-y-2 mb-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {businessFeatures.map((feature, index) => (
                        <motion.div 
                          key={index}
                          className="flex items-center gap-2 text-purple-700 bg-purple-50 p-2 rounded-lg"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {feature.icon}
                          <span>{feature.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button 
                  className="flex items-center gap-2 text-white font-semibold bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  Get Started
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }}
                  >
                    <ArrowRight size={20} />
                  </motion.div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

        </motion.div>
        
       
      </motion.div>
    </motion.div>
  );
};

export default FundingTypeSelector;