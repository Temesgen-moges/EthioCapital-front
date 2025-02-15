import React, { useState ,useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, ArrowRight, Calendar, MapPin, FileText, Landmark, X, Download } from 'lucide-react';
import axios from 'axios';
import setupAxios from '../middleware/MiddleWare';

// const categoryCounts = contentData.reduce((acc, item) => {
//   acc[item.category] = (acc[item.category] || 0) + item.newNotifications;
//   acc.All = (acc.All || 0) + item.newNotifications;
//   return acc;
// }, {});

const downloadFile = (content, fileName) => {
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const ContentCard = ({ item, onClick }) => {
  const handleAction = (e) => {
    e.stopPropagation();
    if (item.category === 'Research') {
      downloadFile(item.fileContent, item.fileName);
    } else {
      onClick();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={item.category === 'Policy' ? onClick : undefined}
      className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border-l-4 cursor-pointer"
      style={{ borderColor: `var(--color)` }}
    >
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          {item.icon}
          <span className="text-xs sm:text-sm font-semibold" style={{ color: `var(--color)` }}>
            {item.category}
            {item.newNotifications > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs">
                {item.newNotifications}
              </span>
            )}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{item.title}</h3>

        {item.category === "Event" && (
          <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{item.date} | {item.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{item.location}</span>
            </div>
          </div>
        )}

        {item.category === "Research" && (
          <div className="flex items-center gap-2 text-gray-600 mb-2 sm:mb-3">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">{item.author}</span>
          </div>
        )}

        {item.category === "Policy" && (
          <div className="flex items-center gap-2 text-gray-600 mb-2 sm:mb-3">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Effective: {item.effectiveDate}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3">
          {item.description || item.summary}
        </p>

        <button 
          onClick={handleAction}
          className="flex items-center font-medium text-sm sm:text-base"
          style={{ color: `var(--color)` }}
        >
          {item.category === "Event" ? "RSVP Now" : 
           item.category === "Research" ? "Download Report" : 
           "Read Policy"}
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  );
};

const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [contentData, setContentData] = useState([]);

  useEffect(() => { setupAxios(); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/blogs");
        console.log("Blogs Data:", response.data);
        
        setContentData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

   // Move categoryCounts here, after contentData is defined
   const categoryCounts = contentData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + (item.newNotifications || 0);
    acc.All = (acc.All || 0) + (item.newNotifications || 0);
    return acc;
  }, {});

  const filteredData = activeCategory === "All" 
    ? contentData 
    : contentData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            EthioCapital Resource Hub
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Your gateway to investment opportunities and market insights
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {["All", "Research", "Event", "Policy"].map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors relative ${
                activeCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`
            }
          >
              {category}
              {categoryCounts[category] > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs"
                >
                  {categoryCounts[category]}
                </motion.span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          <AnimatePresence>
            {filteredData.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ "--color": item.color }}
              >
                <ContentCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                style={{ "--color": selectedItem.color }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      {selectedItem.icon}
                      <span className="text-sm sm:text-base font-semibold" style={{ color: `var(--color)` }}>
                        {selectedItem.category}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    {selectedItem.title}
                  </h2>

                  {selectedItem.category === "Event" && (
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                        <Calendar className="w-5 h-5 flex-shrink-0" />
                        <div>
                          <p className="text-sm sm:text-base">{selectedItem.date}</p>
                          <p className="text-sm sm:text-base text-gray-500">{selectedItem.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                        <MapPin className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm sm:text-base">{selectedItem.location}</p>
                      </div>
                    </div>
                  )}

                  {selectedItem.category === "Research" && (
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600 mb-3 sm:mb-4">
                      <User className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm sm:text-base">{selectedItem.author}</p>
                    </div>
                  )}

                  {selectedItem.category === "Policy" && (
                    <div className="flex items-center gap-2 sm:gap-3 text-gray-600 mb-3 sm:mb-4">
                      <Calendar className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm sm:text-base">Effective: {selectedItem.effectiveDate}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {(selectedItem.category === "Research" || selectedItem.category === "Policy") && (
                      <pre className="whitespace-pre-wrap font-sans text-gray-600 text-sm sm:text-base">
                        {selectedItem.content}
                      </pre>
                    )}

                    {(selectedItem.fileName && selectedItem.fileContent) && (
                      <button
                        onClick={() => downloadFile(selectedItem.fileContent, selectedItem.fileName)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                      >
                        <Download className="w-5 h-5" />
                        <span className="text-sm sm:text-base">
                          Download Full {selectedItem.category === "Policy" ? "Policy Document" : "Research Report"} (PDF)
                        </span>
                      </button>
                    )}

                    {selectedItem.category === "Event" && (
                      <button
                        className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm sm:text-base transition-colors"
                        style={{ 
                          color: `var(--color)`,
                          border: `2px solid var(--color)`,
                          backgroundColor: `rgba(var(--color-rgb), 0.05)`
                        }}
                      >
                        RSVP Now
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogsPage;