import React, { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import enterIcon from '../ass/enter.png';
import investorIcon from '../ass/investor-.png';
import economicIcon from '../ass/tt.png';

const skillsData = [
  {
    name: "Entrepreneur",
    icon: (
      <img src={enterIcon} alt="Enter Icon" className="w-12 h-12 text-primary group-hover:text-black duration-300" />
    ),
    link: "#",
    description: "Empowering entrepreneurs to connect with investors and bring ideas to life.",
    aosDelay: "0",
  },
  {
    name: "Investor",
    icon: (
      <img src={investorIcon} alt="Investor Icon" className="w-12 h-12 text-primary group-hover:text-black duration-300" />
    ),
    link: "#",
    description: "Connecting investors with innovative entrepreneurs to foster growth and success.",
    aosDelay: "500",
  },
  {
    name: "Economic Growth",
    icon: (
      <img src={economicIcon} alt="Economic Growth Icon" className="w-12 h-12 text-primary group-hover:text-black duration-300" />
    ),
    link: "#",
    description: "Driving sustainable economic development through strategic investments and innovation.",
    aosDelay: "1000",
  },
];

const One = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // Allow animations to trigger multiple times
      mirror: true, // Animate elements when scrolling back up
      startEvent: 'DOMContentLoaded',
      offset: 120,
      disable: window.innerWidth < 768
    });

    // Refresh AOS when components update
    AOS.refresh();

    // Handle window resize
    window.addEventListener('resize', AOS.refresh);
    return () => window.removeEventListener('resize', AOS.refresh);
  }, []);

 
  return (
    <>
      <span id="about"></span>
      <div className="relative min-h-[600px] py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1951&q=80')] 
          bg-cover bg-center"
          data-aos="zoom-out"
          data-aos-delay="200"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-purple-800/90 to-emerald-800/90"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg 
            viewBox="0 0 1440 120" 
            className="w-full"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <path 
              d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 70C672 80 768 100 864 100C960 100 1056 80 1152 70C1248 60 1344 60 1392 60H1440V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" 
              fill="white"
            />
          </svg>
        </div>

        <div className="container relative z-20 mx-auto max-w-7xl">
          <div className="pb-12 px-4">
            <h1 
              data-aos="fade-down" 
              data-aos-delay="200" 
              className="text-3xl font-semibold text-center sm:text-4xl font-serif text-white"
            >
              Why Choose Us
            </h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4">
            {skillsData.map((skill) => (
              <div 
                key={skill.name} 
                data-aos="fade-up"
                data-aos-once="false"
                data-aos-delay={skill.aosDelay}
                data-aos-easing="ease-out-cubic"
                className="card text-center group space-y-3 sm:space-y-6 p-4 sm:py-8 bg-white/10 backdrop-blur-sm text-white hover:bg-yellow-400 hover:text-black duration-300 rounded-lg mx-2"
              >
                <div className="grid place-items-center" data-aos="zoom-in" data-aos-delay="200">
                  {skill.icon}
                </div>
                <h1 className="text-2xl font-bold" data-aos="fade-up" data-aos-delay="100">
                  {skill.name}
                </h1>
                <p className="px-2" data-aos="fade-up" data-aos-delay="150">{skill.description}</p>
                <a 
                  href={skill.link} 
                  className="inline-block text-lg font-semibold py-3 text-white group-hover:text-black duration-300"
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  Learn more
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 8 + 8}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default One;