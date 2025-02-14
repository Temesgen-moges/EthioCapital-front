import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Two from './Two';
import One from './One';

import Navigation from './Navigagation';
import PartnersSection from './PartnersSection';
import Motiv from './Motiv .jsx';

const Three = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      name: 'Abebe Kebede',
      role: 'Tech Entrepreneur',
      company: 'TechEth Solutions',
      text: 'Ethio Capital helped me connect with investors who believed in my vision. Now my startup is thriving with over 50 employees and growing!',
      rating: 5,
      investment: '$500K',
      sector: 'Technology',
      year: '2023',
      avatar: `data:image/svg+xml,${encodeURIComponent(
        '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4A90E2"/><text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">AK</text></svg>'
      )}`,
    },
    {
      name: 'Sara Mohammed',
      role: 'Student Innovator',
      company: 'GreenGrow Agriculture',
      text: 'Thanks to this platform, I found mentorship and funding to turn my university project into a successful agritech business.',
      rating: 5,
      investment: '$250K',
      sector: 'Agriculture',
      year: '2024',
      avatar: `data:image/svg+xml,${encodeURIComponent(
        '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#E24A84"/><text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">SM</text></svg>'
      )}`,
    },
    {
      name: 'Daniel Tesfaye',
      role: 'Angel Investor',
      company: 'Ethiopian Angels',
      text: 'This platform makes it easy to discover and invest in Ethiopia\'s most promising startups. I\'ve invested in 10 startups through Ethio Capital.',
      rating: 5,
      investment: '$1.2M',
      sector: 'Multiple',
      year: '2024',
      avatar: `data:image/svg+xml,${encodeURIComponent(
        '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4AE278"/><text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">DT</text></svg>'
      )}`,
    },
    {
      name: 'Mebruk Hassan',
      role: 'University Student',
      company: 'Addis Ababa University',
      text: 'Ethio Capital\'s education funding program changed my life. I received a full scholarship to pursue my Computer Science degree. Their support covers tuition, accommodation, and learning materials.',
      rating: 5,
      investment: '$15K',
      sector: 'Education',
      year: '2024',
      avatar: `data:image/svg+xml,${encodeURIComponent(
        '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#9B4AE2"/><text x="50" y="50" font-family="Arial" font-size="40" fill="white" text-anchor="middle" dy=".3em">MH</text></svg>'
      )}`,
    },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 120,
      disable: window.innerWidth < 768
    });
    window.addEventListener('resize', AOS.refresh);
    return () => window.removeEventListener('resize', AOS.refresh);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  const StarRating = ({ rating }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      <Navigation />

      {/* Hero Section */}
      <div className="relative py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 
              data-aos="fade-down" 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Connecting Ethiopian Innovation with Global Capital
            </h1>
            <p 
              data-aos="fade-up" 
              data-aos-delay="200"
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              We bridge the gap between Ethiopian entrepreneurs and investors worldwide,
              fostering growth and innovation in the Ethiopian startup ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                data-aos="zoom-in" 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>  
              <button 
                data-aos="zoom-in" 
                data-aos-delay="200"
                className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      <Two />
      <One />
      <PartnersSection />

      {/* Testimonials Section */}
      {/* Testimonials Section */}
      <div className="py-12 bg-gray-50 overflow-hidden">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Success Stories
      </h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Transformative journeys powered by strategic connections
      </p>
    </div>

    <div className="relative">
      {/* Navigation Arrows */}
      <button 
        className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
        onClick={() => setCurrentTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
      >
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
        onClick={() => setCurrentTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
      >
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Testimonial Card */}
      <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <img 
            src={testimonials[currentTestimonial].avatar}
            alt={testimonials[currentTestimonial].name}
            className="w-16 h-16 rounded-full border-2 border-blue-100"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {testimonials[currentTestimonial].name}
            </h3>
            <p className="text-sm text-gray-600">
              {testimonials[currentTestimonial].role}
            </p>
            <div className="flex items-center space-x-1 mt-1">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-4 h-4 ${index < testimonials[currentTestimonial].rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="space-y-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            {testimonials[currentTestimonial].text}
          </p>
          
          {/* Compact Stats Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Investment</div>
              <div className="text-sm font-semibold text-gray-900">
                {testimonials[currentTestimonial].investment}
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Sector</div>
              <div className="text-sm font-semibold text-gray-900">
                {testimonials[currentTestimonial].sector}
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">Year</div>
              <div className="text-sm font-semibold text-gray-900">
                {testimonials[currentTestimonial].year}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentTestimonial(index)}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
      <Motiv />
      

      {/* Footer */}
      <footer className="bg-gray-100 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-gray-900 font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-600">
                Connecting Ethiopian entrepreneurs with global investors to foster
                innovation and growth in the Ethiopian startup ecosystem.
              </p>
            </div>
            {/* Add other footer sections */}
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Ethio Capital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Three;