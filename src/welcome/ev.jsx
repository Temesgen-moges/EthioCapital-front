import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Bell, ChevronDown, User, BookOpen, Briefcase, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const mockData = {
  currentInvestor: {
    name: "Daniel Haile",
    avatar: "https://example.com/path/to/avatar.jpg", // Update this to your image URL
    notifications: [
      { id: 1, text: "New startup idea in Agriculture sector", isNew: true },
      { id: 2, text: "Your interested project 'Smart Irrigation' was updated", isNew: true },
      { id: 3, text: "Weekly trending startups report", isNew: false },
    ]
  },
  entrepreneurs: [
    {
      id: 1,
      name: "Abebe Kebede",
      title: "Smart Agriculture IoT Solution",
      category: "Agriculture",
      description: "Revolutionary IoT-based irrigation system for Ethiopian farmers",
      fundingNeeded: "500000",
      location: "Addis Ababa",
      stage: "Seed",
      interestedInvestors: 15,
      hasShownInterest: false,
      currentStage: "Prototype",
    },
    {
      id: 2,
      name: "Sara Mohammed",
      title: "EthioTextiles",
      category: "Manufacturing",
      description: "Modern textile manufacturing using traditional Ethiopian patterns",
      fundingNeeded: "750000",
      location: "Dire Dawa",
      stage: "Growth",
      interestedInvestors: 23,
      hasShownInterest: false,
      currentStage: "MVP",
    },
    // Add more startup data here
  ]
};

const categories = [
  "All", "Agriculture", "Manufacturing", "Technology", 
  "Healthcare", "Education", "Food Processing", "Tourism"
];

function InvestorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ideas');
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [ideas, setIdeas] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIdeas(mockData.entrepreneurs);
      setIsLoading(false);
    }, 1000);
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesCategory = selectedCategory === "All" || idea.category === selectedCategory;
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleInterest = (ideaId) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          interestedInvestors: idea.hasShownInterest 
            ? idea.interestedInvestors - 1 
            : idea.interestedInvestors + 1,
          hasShownInterest: !idea.hasShownInterest
        };
      }
      return idea;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col space-y-4">
            {/* Top Nav */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-blue-600">EthioCapital</h1>
              <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    className="relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-6 w-6 text-gray-600" />
                    {mockData.currentInvestor.notifications.some(n => n.isNew) && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10">
                      {mockData.currentInvestor.notifications.map(notification => (
                        <div 
                          key={notification.id}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <p className="text-sm text-gray-600">
                            {notification.isNew && (
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2" />
                            )}
                            {notification.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative">
                  <button 
                    className="flex items-center gap-2"
                    onClick={() => setShowProfile(!showProfile)}
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img src={mockData.currentInvestor.avatar} alt="User Avatar" className="h-full w-full object-cover" />
                    </div>
                    <span className="text-gray-700">{mockData.currentInvestor.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          navigate("/Investor-Profile");
                          setShowProfile(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        Your Profile
                      </button>
                      <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        Settings
                      </button>
                      <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-50 w-full text-left">
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-6 border-b">
              <button
                onClick={() => setActiveTab('ideas')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'ideas'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Briefcase className="h-5 w-5" />
                Investment Ideas
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'blogs'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                Blogs
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === 'trending'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TrendingUp className="h-5 w-5" />
                Trending
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search opportunities..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <motion.div
                key={idea.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">by {idea.name}</p>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {idea.category}
                    </span>
                  </div>
                  
                  <p className="mt-4 text-gray-600">{idea.description}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Funding Needed:</span> ${idea.fundingNeeded}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Stage:</span> {idea.currentStage}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-sm text-gray-600">{idea.location}</span>
                    <button 
                      onClick={() => handleInterest(idea.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                        ${idea.hasShownInterest 
                          ? 'bg-red-50 text-red-600' 
                          : 'bg-blue-50 text-blue-600'}`}
                    >
                      <Heart 
                        className={`h-5 w-5 ${idea.hasShownInterest ? 'fill-current' : ''}`} 
                      />
                      <span>{idea.interestedInvestors} Interested</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => navigate(`/startup-detail/${idea.id}`)}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default InvestorDashboard;