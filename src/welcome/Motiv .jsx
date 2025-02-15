import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRocket, FaArrowRight, FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Motiv = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const motivContents = [
    {
      title: "Empower Your Future!",
      text: "Join our growing community of innovators and change-makers!",
      color: "from-purple-900 to-emerald-800"
    },
    {
      title: "Connect with Investors",
      text: "Find the right partners to fuel your business growth",
      color: "from-blue-900 to-teal-800"
    },
    {
      title: "Discover Opportunities",
      text: "Explore innovative startups and investment possibilities",
      color: "from-indigo-900 to-cyan-800"
    },
    {
      title: "Grow Together",
      text: "Be part of Ethiopia's entrepreneurial revolution",
      color: "from-red-900 to-orange-800"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % motivContents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % motivContents.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + motivContents.length) % motivContents.length);
  };
  const handleLogin = () => {
    navigate('/login');
  };


  return (
    <div className="relative overflow-hidden min-h-[60vh] transition-colors duration-1000">
      <div className={`absolute inset-0 bg-gradient-to-br ${motivContents[currentIndex].color} transition-colors duration-1000`}>
        
        {/* Wave decorations */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full" style={{ transform: 'rotate(180deg)' }}>
            <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 70C672 80 768 100 864 100C960 100 1056 80 1152 70C1248 60 1344 60 1392 60H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-20"
          >
            <FaRocket className="text-5xl text-yellow-400 mb-6 mx-auto animate-bounce" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {motivContents[currentIndex].title}
            </h2>
            <p className="text-xl mb-8 text-gray-200 max-w-xl mx-auto">
              {motivContents[currentIndex].text}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogin}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900
                       px-8 py-4 rounded-full font-bold text-lg shadow-lg
                       transition-all duration-300 flex items-center gap-3 mx-auto"
            >
              Get Started
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 70C672 80 768 100 864 100C960 100 1056 80 1152 70C1248 60 1344 60 1392 60H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <FaArrowAltCircleLeft className="text-3xl text-white" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <FaArrowAltCircleRight className="text-3xl text-white" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {motivContents.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-yellow-400 w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Motiv;