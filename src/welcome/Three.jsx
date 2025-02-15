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
     
      {/* Footer */}
      <footer className="bg-gray-100 py-8 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* About Section */}
      <div className="space-y-4">
        <h3 className="text-gray-900 font-bold text-lg mb-4 group hover:text-indigo-600 transition-colors duration-300">
          <span className="border-b-2 border-transparent group-hover:border-indigo-600 pb-1">
            About Us
          </span>
        </h3>
        <p className="text-gray-600 hover:text-gray-800 transition-colors duration-300 transform hover:translate-x-1">
          Connecting Ethiopian entrepreneurs with global investors to foster
          innovation and growth in the Ethiopian startup ecosystem.
        </p>
      </div>

      {/* Quick Links - Horizontal Scroll */}
      <div className="space-y-4">
        <h3 className="text-gray-900 font-bold text-lg mb-4 group hover:text-indigo-600 transition-colors duration-300">
          <span className="border-b-2 border-transparent group-hover:border-indigo-600 pb-1">
            Quick Links
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {['Startups', 'Investors', 'Success Stories', 'FAQs'].map((item) => (
            <a
              key={item}
              href="#"
              className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 group"
            >
              <span className="w-2 h-2 bg-indigo-600 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Resources - Card Style */}
      <div className="space-y-4">
        <h3 className="text-gray-900 font-bold text-lg mb-4 group hover:text-indigo-600 transition-colors duration-300">
          <span className="border-b-2 border-transparent group-hover:border-indigo-600 pb-1">
            Resources
          </span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {['Blog', 'Guides', 'Webinars', 'Toolkit'].map((item) => (
            <div
              key={item}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
            >
              <span className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact & Social - Interactive Cards */}
      <div className="space-y-4">
        <h3 className="text-gray-900 font-bold text-lg mb-4 group hover:text-indigo-600 transition-colors duration-300">
          <span className="border-b-2 border-transparent group-hover:border-indigo-600 pb-1">
            Connect
          </span>
        </h3>
        
        {/* Contact Cards */}
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors duration-300 group">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <a href="mailto:info@example.com" className="ml-3 text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                info@ethiocapital.com
              </a>
            </div>
          </div>

          <div className="p-3 bg-white rounded-lg hover:bg-indigo-50 transition-colors duration-300 group">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                  +251 912 345 678
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media - Animated Icons */}
        <div className="flex space-x-4 mt-4">
          {[
            {name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53...'},
            {name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2...'},
            {name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'},
          ].map((platform) => (
            <a
              key={platform.name}
              href="#"
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 hover:-translate-y-1"
            >
              <svg className="w-6 h-6 text-gray-600 hover:text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d={platform.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* Copyright Section with Animated Border */}
    <div className="border-t border-gray-200 mt-8 pt-8 text-center">
      <div className="relative inline-block group">
        <span className="text-gray-600 hover:text-indigo-600 transition-colors duration-300">
          &copy; 2024 Ethio Capital. All rights reserved.
        </span>
        <div className="absolute bottom-0 left-0 w-0 h-px bg-indigo-600 group-hover:w-full transition-all duration-500" />
      </div>
      <div className="mt-2 flex justify-center space-x-4">
        <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 relative group">
          Privacy Policy
          <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-600 group-hover:w-full transition-all duration-300" />
        </a>
        <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 relative group">
          Terms of Service
          <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-600 group-hover:w-full transition-all duration-300" />
        </a>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Three;