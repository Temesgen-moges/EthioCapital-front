import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";

import { FileText, Landmark, Calendar, X, Save, Plus, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import setupAxios from '../middleware/MiddleWare';

const categoryTypes = [
  {
    value: 'Research',
    label: 'Research Report',
    icon: <FileText className="w-8 h-8" />,
    color: 'bg-green-100 text-green-600',
    description: 'Publish academic studies, market analysis, or industry reports'
  },
  {
    value: 'Event',
    label: 'Event',
    icon: <Calendar className="w-8 h-8" />,
    color: 'bg-purple-100 text-purple-600',
    description: 'Create event announcements with dates, times, and locations'
  },
  {
    value: 'Policy',
    label: 'Policy Document',
    icon: <Landmark className="w-8 h-8" />,
    color: 'bg-orange-100 text-orange-600',
    description: 'Share official policies, regulations, or government directives'
  }
];

const BlogAdminForm = ({ onClose, onSubmit }) => {
  const navigate = useNavigate(); // ✅ Move this outside of handleSubmit

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    time: '',
    effectiveDate: '',
    issuedBy: '',
    summary: '',
    content: '',
    fileName: '',
    fileContent: ''
  });

  useEffect(() => {
    setupAxios(); // This will set the Authorization token
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category: category.value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const content = await file.text();
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileContent: content
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form data", formData);

    try {
      console.log("posting to /blogs");
      const response = await axios.post("/blogs", formData);
      console.log("Blog Submitted:", response);

      // Navigate after successful submission
      // navigate('/admin/blogs'); // ✅ Use navigate here
    } catch (error) {
      console.log("error saving Blog", error);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            {selectedCategory ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(null)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            ) : (
              <div />
            )}
            <h2 className="text-2xl font-bold text-center">
              {selectedCategory ? `New ${selectedCategory.label}` : 'Create Content'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
               onClick={() => navigate("/Admin-Dashboard")}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </motion.button>

          </div>

          <AnimatePresence mode='wait'>
            {!selectedCategory ? (
              <motion.div
                key="category-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {categoryTypes.map((category) => (
                  <motion.div
                    key={category.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCategorySelect(category)}
                    className={`p-6 rounded-xl cursor-pointer transition-colors ${category.color} hover:bg-opacity-80`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      {category.icon}
                      <h3 className="text-lg font-semibold">{category.label}</h3>
                      <p className="text-sm text-center text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.form
                key="form-fields"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>

                <AnimatePresence mode='wait'>
                  {selectedCategory.value === 'Research' && (
                    <motion.div
                      key="research-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Author *</label>
                        <input
                          type="text"
                          required
                          value={formData.author}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Upload Report *</label>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="relative border-2 border-dashed rounded-lg p-6 text-center"
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            required
                          />
                          <div className="text-gray-600">
                            {formData.fileName || 'Drag & drop or click to upload PDF'}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {selectedCategory.value === 'Event' && (
                    <motion.div
                      key="event-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Date *</label>
                          <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Time *</label>
                          <input
                            type="time"
                            required
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Location *</label>
                        <input
                          type="text"
                          required
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                    </motion.div>
                  )}

                  {selectedCategory.value === 'Policy' && (
                    <motion.div
                      key="policy-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium mb-2">Issued By *</label>
                        <input
                          type="text"
                          required
                          value={formData.issuedBy}
                          onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Effective Date *</label>
                        <input
                          type="date"
                          required
                          value={formData.effectiveDate}
                          onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                          className="w-full p-3 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Upload Policy Document (PDF)</label>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="relative border-2 border-dashed rounded-lg p-6 text-center"
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className="text-gray-600">
                            {formData.fileName || 'Drag & drop or click to upload PDF'}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Summary *</label>
                    <textarea
                      required
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      className="w-full p-3 border rounded-lg h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Content *</label>
                    <textarea
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full p-3 border rounded-lg h-32"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Publish {selectedCategory.label}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BlogAdminForm;