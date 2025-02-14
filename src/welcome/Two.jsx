import React, { useEffect, useState } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import enterIcon from '../ass/enter.png';
import investorIcon from '../ass/enter.png';
import studentIcon from '../ass/enter.png';

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
        name: "Students",
        icon: (
            <img src={studentIcon} alt="Student Icon" className="w-12 h-12 text-primary group-hover:text-black duration-300" />
        ),
        link: "#",
        description: "Helping students find financial support to achieve their educational dreams.",
        aosDelay: "1000",
    },
];

const statsCardStyle = {
    background: 'linear-gradient(145deg, #ffffff, #f3f4f6)',
    boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
    borderRadius: '20px',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
};

const statsNumberStyle = {
    background: 'linear-gradient(45deg, #3B82F6, #1D4ED8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    letterSpacing: '1px',
};

const statsCardBeforeStyle = {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1))',
    transform: 'scaleX(0)',
    transformOrigin: '0 50%',
    transition: 'transform 0.5s ease-out',
    zIndex: '0',
};

const Two = () => {
    const [counters, setCounters] = useState({
        investments: 0,
        entrepreneurs: 0,
        investors: 0,
        success: 0
    });

    const targetValues = {
        investments: 50,
        entrepreneurs: 1000,
        investors: 500,
        success: 200
    };

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true
        });

        const animateCounters = () => {
            const duration = 2000;
            const steps = 60;
            const interval = duration / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const progress = currentStep / steps;
                
                setCounters({
                    investments: Math.round(targetValues.investments * progress),
                    entrepreneurs: Math.round(targetValues.entrepreneurs * progress),
                    investors: Math.round(targetValues.investors * progress),
                    success: Math.round(targetValues.success * progress)
                });

                if (currentStep === steps) {
                    clearInterval(timer);
                }
            }, interval);
        };

        animateCounters();
    }, []);

    return (
        <div className="">
            {/* How It Works Section */}
            <div className="py-20 bg-white ">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 data-aos="fade-up" className="text-4xl font-bold text-black text-center mb-4">
                        How It Works
                    </h2>
                    <p data-aos="fade-up" className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Our platform makes it easy to connect entrepreneurs with investors through a simple but effective process
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div data-aos="fade-right" className="bg-gray-50 rounded-xl p-6 shadow-md hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-black text-center mb-4">Create Your Profile</h3>
                            <p className="text-gray-600 text-center">
                                Entrepreneurs can create detailed profiles showcasing their business plans, achievements, and funding needs. Investors can set up profiles with their investment preferences.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div data-aos="fade-up" className="bg-gray-50 rounded-xl p-6 shadow-md hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-black text-center mb-4">Connect & Match</h3>
                            <p className="text-gray-600 text-center">
                                Our AI-powered matching system connects entrepreneurs with suitable investors based on industry, investment size, and strategic alignment.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div data-aos="fade-left" className="bg-gray-50 rounded-xl p-6 shadow-md hover:transform hover:scale-105 transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-black text-center mb-4">Secure Investment</h3>
                            <p className="text-gray-600 text-center">
                                Facilitate secure investments through our platform with legal documentation support and transparent transaction processes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="stats-section grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-7xl mx-auto px-4 pb-7">
                <div
                    data-aos="zoom-in"
                    data-aos-delay="0"
                    className="stats-card group relative"
                    style={statsCardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(0)';
                    }}
                >
                    <div className="stats-overlay" style={statsCardBeforeStyle}></div>
                    <div className="relative z-10">
                        <div 
                            className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300"
                            style={statsNumberStyle}
                        >
                            ${counters.investments}M+
                        </div>
                        <div className="text-gray-600 font-medium text-lg">Total Investments</div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in"
                    data-aos-delay="200"
                    className="stats-card group relative"
                    style={statsCardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(0)';
                    }}
                >
                    <div className="stats-overlay" style={statsCardBeforeStyle}></div>
                    <div className="relative z-10">
                        <div 
                            className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300"
                            style={statsNumberStyle}
                        >
                            {counters.entrepreneurs}+
                        </div>
                        <div className="text-gray-600 font-medium text-lg">Entrepreneurs</div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in"
                    data-aos-delay="400"
                    className="stats-card group relative"
                    style={statsCardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(0)';
                    }}
                >
                    <div className="stats-overlay" style={statsCardBeforeStyle}></div>
                    <div className="relative z-10">
                        <div 
                            className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300"
                            style={statsNumberStyle}
                        >
                            {counters.investors}+
                        </div>
                        <div className="text-gray-600 font-medium text-lg">Investors</div>
                    </div>
                </div>

                <div
                    data-aos="zoom-in"
                    data-aos-delay="600"
                    className="stats-card group relative"
                    style={statsCardStyle}
                    onMouseEnter={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.querySelector('.stats-overlay').style.transform = 'scaleX(0)';
                    }}
                >
                    <div className="stats-overlay" style={statsCardBeforeStyle}></div>
                    <div className="relative z-10">
                        <div 
                            className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300"
                            style={statsNumberStyle}
                        >
                            {counters.success}+
                        </div>
                        <div className="text-gray-600 font-medium text-lg">Success Stories</div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .stats-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
                    transform: scaleX(0);
                    transform-origin: 0 50%;
                    transition: transform 0.5s ease-out;
                }

                .stats-card:hover::before {
                    transform: scaleX(1);
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default Two;